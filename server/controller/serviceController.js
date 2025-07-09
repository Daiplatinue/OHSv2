import { Service } from "../models/service.js"
import { classifyServiceAI } from "../AI/aiController.js" // Import the AI classification function

// Create Service
export const createService = async (req, res, io) => {
  // Added 'io' parameter
  try {
    const { name, price, description, image, chargePerKm } = req.body
    const cooId = req.userId // This comes from the authenticateToken middleware

    if (!cooId) {
      return res.status(401).json({ message: "Authentication required: COO ID missing." })
    }

    // Validate required fields
    if (!name || !price || !description || !chargePerKm) {
      return res
        .status(400)
        .json({ message: "Missing required service fields: name, price, description, and charge per KM are required." })
    }

    // --- AI Classification Step ---
    // Call the AI classification function internally
    const aiClassificationResponse = await classifyServiceAI(
      { body: { name, description } },
      {
        // Mock res object for classifyServiceAI to return JSON directly
        status: (code) => ({
          json: (data) => ({ code, data }),
        }),
      },
    )

    let mainCategory = "Uncategorized Services" // Default fallback
    let subCategory = name // Default fallback
    let isValidService = true
    let invalidReason = ""
    let workersNeeded = 1 // NEW: Default for workersNeeded

    if (aiClassificationResponse.code === 200 && aiClassificationResponse.data) {
      const aiData = aiClassificationResponse.data
      isValidService = aiData.isValid
      if (isValidService) {
        mainCategory = aiData.mainCategory || mainCategory
        subCategory = aiData.subCategory || subCategory
        workersNeeded = aiData.workersNeeded || 1 // NEW: Get workersNeeded from AI
      } else {
        mainCategory = "Invalid Service" // Mark as invalid category
        subCategory = name // Keep original name for reference
        invalidReason = aiData.reason || "Service deemed invalid by AI."
        workersNeeded = 1 // For invalid services, default workers to 1
      }
    } else {
      console.warn(
        "AI classification failed or returned unexpected format, using defaults:",
        aiClassificationResponse.data,
      )
      // If AI classification fails, default to valid but uncategorized
      isValidService = true
      mainCategory = "Uncategorized Services"
      subCategory = name
      workersNeeded = 1 // Default workers if AI fails
    }

    console.log("Service Classification Result (from AI):", {
      isValidService,
      mainCategory,
      subCategory,
      invalidReason,
      workersNeeded, // NEW: Log workersNeeded
    })

    // Create new service instance with AI-determined categories and new fields
    const newService = new Service({
      cooId,
      name,
      price,
      description,
      image: image || "/placeholder.svg?height=48&width=48", // Use provided image or default
      chargePerKm,
      mainCategory, // Set main category from AI
      subCategory, // Set sub category from AI
      totalRating: 0, // NEW: Initialize to 0
      totalReviews: 0, // NEW: Initialize to 0
      workersNeeded: workersNeeded, // NEW: Set workersNeeded from AI
    })

    await newService.save()

    res.status(201).json({
      message: "Service created successfully!",
      service: newService,
      aiClassification: { isValid: isValidService, reason: invalidReason },
    })

    // Emit WebSocket event after successful creation
    if (io) {
      io.emit("service_update", { type: "created", service: newService })
    }
  } catch (error) {
    console.error("Error creating service:", error)
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message)
      return res.status(400).json({ message: messages.join(", ") })
    }
    res.status(500).json({ message: "Server error during service creation." })
  }
}

// NEW: Fetch Services (no change needed here for WebSockets)
export const getServices = async (req, res) => {
  try {
    // Allow fetching all services if no cooId is provided (for public display on Home page)
    const cooId = req.userId
    let services

    if (cooId) {
      // If a COO ID is provided (e.g., from authenticateToken), fetch only their services
      services = await Service.find({ cooId }).populate({
        path: "cooId",
        select: "firstName middleName lastName profilePicture location.name", // NEW: Select middleName and location.name
      })
    } else {
      // If no COO ID, fetch all services (for public display)
      // Ensure this endpoint is accessible without authentication if intended for public
      services = await Service.find({}).populate({
        path: "cooId",
        select: "firstName middleName lastName profilePicture location.name", // NEW: Select middleName and location.name
      })
    }

    // Add console.log to inspect services fetched from backend
    console.log(
      "Backend: Fetched services with COO details:",
      services.map((s) => ({
        id: s._id.toString(), // FIX: Convert ObjectId to string
        name: s.name,
        mainCategory: s.mainCategory,
        subCategory: s.subCategory,
        totalRating: s.totalRating, // NEW: Log totalRating
        totalReviews: s.totalReviews, // NEW: Log totalReviews
        workersNeeded: s.workersNeeded, // NEW: Log workersNeeded
        cooDetails: s.cooId
          ? {
              _id: s.cooId._id.toString(), // FIX: Convert ObjectId to string
              firstName: s.cooId.firstName,
              middleName: s.cooId.middleName, // NEW: Log middleName
              lastName: s.cooId.lastName,
              profilePicture: s.cooId.profilePicture,
              location: s.cooId.location ? s.cooId.location.name : "N/A", // NEW: Log COO location
            }
          : null,
      })),
    )

    // Send the services, ensuring _id fields are strings
    res.status(200).json({
      services: services.map((s) => ({
        ...s.toObject(), // Convert Mongoose document to plain object
        id: s._id.toString(), // Ensure top-level ID is string
        cooId: s.cooId
          ? {
              ...s.cooId.toObject(), // Convert populated COO document to plain object
              _id: s.cooId._id.toString(), // Ensure populated COO ID is string
            }
          : null,
      })),
    })
  } catch (error) {
    console.error("Error fetching services:", error)
    res.status(500).json({ message: "Server error during service retrieval." })
  }
}

// NEW: Delete Service
export const deleteService = async (req, res, io) => {
  // Added 'io' parameter
  try {
    const { id } = req.params // Service ID from URL parameter
    const cooId = req.userId // COO ID from authenticateToken middleware

    if (!cooId) {
      return res.status(401).json({ message: "Authentication required: COO ID missing." })
    }

    const service = await Service.findOneAndDelete({ _id: id, cooId: cooId })

    if (!service) {
      return res.status(404).json({ message: "Service not found or you are not authorized to delete this service." })
    }

    res.status(200).json({ message: "Service terminated successfully!", serviceId: id })

    // Emit WebSocket event after successful deletion
    if (io) {
      io.emit("service_update", { type: "deleted", serviceId: id })
    }
  } catch (error) {
    console.error("Error terminating service:", error)
    res.status(500).json({ message: "Server error during service termination." })
  }
}