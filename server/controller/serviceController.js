import { Service } from "../models/service.js"
import { classifyServiceAI } from "../AI/aiController.js" // Import the AI classification function

// Create Service
export const createService = async (req, res) => {
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

    if (aiClassificationResponse.code === 200 && aiClassificationResponse.data) {
      const aiData = aiClassificationResponse.data
      isValidService = aiData.isValid
      if (isValidService) {
        mainCategory = aiData.mainCategory || mainCategory
        subCategory = aiData.subCategory || subCategory
      } else {
        mainCategory = "Invalid Service" // Mark as invalid category
        subCategory = name // Keep original name for reference
        invalidReason = aiData.reason || "Service deemed invalid by AI."
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
    }

    console.log("Service Classification Result (from AI):", {
      isValidService,
      mainCategory,
      subCategory,
      invalidReason,
    })

    // Create new service instance with AI-determined categories
    const newService = new Service({
      cooId,
      name,
      price,
      description,
      image: image || "/placeholder.svg?height=48&width=48", // Use provided image or default
      chargePerKm,
      mainCategory, // Set main category from AI
      subCategory, // Set sub category from AI
    })

    await newService.save()

    res.status(201).json({
      message: "Service created successfully!",
      service: newService,
      aiClassification: { isValid: isValidService, reason: invalidReason },
    })
  } catch (error) {
    console.error("Error creating service:", error)
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message)
      return res.status(400).json({ message: messages.join(", ") })
    }
    res.status(500).json({ message: "Server error during service creation." })
  }
}

// NEW: Fetch Services
export const getServices = async (req, res) => {
  try {
    // Allow fetching all services if no cooId is provided (for public display on Home page)
    const cooId = req.userId
    let services

    if (cooId) {
      // If a COO ID is provided (e.g., from authenticateToken), fetch only their services
      services = await Service.find({ cooId })
    } else {
      // If no COO ID, fetch all services (for public display)
      // Ensure this endpoint is accessible without authentication if intended for public
      services = await Service.find({})
    }

    res.status(200).json({ services })
  } catch (error) {
    console.error("Error fetching services:", error)
    res.status(500).json({ message: "Server error during service retrieval." })
  }
}