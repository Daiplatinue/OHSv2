import { Booking } from "../models/booking.js"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Helper function to save uploaded files
const saveFile = async (file, userId, fileType) => {
  if (!file) return null

  try {
    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(__dirname, "../../uploads")
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true })
    }

    // Create user directory if it doesn't exist
    const userDir = path.join(uploadsDir, userId)
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true })
    }

    // Process base64 data
    const matches = file.match(/^data:([A-Za-z-+/]+);base64,(.+)$/)
    if (!matches || matches.length !== 3) {
      console.log("Invalid file format for", fileType)
      return null
    }

    const fileExtension = matches[1].split("/")[1]
    const base64Data = matches[2]
    const fileName = `${fileType}.${fileExtension}`
    const filePath = path.join(userDir, fileName)

    // Save file
    await fs.promises.writeFile(filePath, base64Data, { encoding: "base64" })

    // Return relative path
    return `/uploads/${userId}/${fileName}`
  } catch (error) {
    console.error(`Error saving file ${fileType}:`, error)
    return null
  }
}

// Create a new booking
const createBooking = async (req, res) => {
  try {
    console.log("Booking creation request received")
    console.log("Request body:", req.body)
    console.log("Auth header:", req.headers.authorization)

    const {
      userId,
      firstname,
      productName,
      providerName,
      providerId,
      workerCount,
      bookingDate,
      bookingTime,
      location,
      pricing,
    } = req.body

    // Basic validation
    if (!userId || !firstname || !productName || !providerName || !bookingDate || !bookingTime || !location) {
      console.log("Missing required fields")
      return res.status(400).json({ message: "Please fill all required fields" })
    }

    // Create new booking instance
    const booking = new Booking({
      userId,
      firstname,
      productName,
      providerName,
      providerId,
      workerCount: workerCount || 1,
      bookingDate,
      bookingTime,
      location: {
        name: location.name,
        lat: location.lat,
        lng: location.lng,
        distance: location.distance,
      },
      estimatedTime: req.body.estimatedTime || "",
      pricing: {
        baseRate: pricing.baseRate,
        distanceCharge: pricing.distanceCharge,
        totalRate: pricing.totalRate,
      },
      status: "pending",
    })

    // Save the booking
    console.log("Saving booking to database")
    const newBooking = await booking.save()
    console.log("Booking saved successfully with ID:", newBooking._id)

    return res.status(201).json(newBooking)
  } catch (error) {
    console.error("Booking creation error:", error)
    return res.status(500).json({ message: "Booking server error", error: error.message, stack: error.stack })
  }
}

// Get all bookings
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 })
    res.status(200).json(bookings)
  } catch (error) {
    console.error("Error fetching bookings:", error)
    res.status(500).json({ message: "Error fetching bookings", error: error.message })
  }
}

// Get bookings by user ID
const getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params

    // Validate userId
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" })
    }

    console.log(`Fetching bookings for user: ${userId}`)

    const bookings = await Booking.find({ userId }).sort({ createdAt: -1 })
    console.log(`Found ${bookings.length} bookings for user ${userId}`)

    res.status(200).json(bookings)
  } catch (error) {
    console.error("Error fetching user bookings:", error)
    res.status(500).json({ message: "Error fetching user bookings", error: error.message })
  }
}

// Get booking by ID
const getBookingById = async (req, res) => {
  try {
    const { id } = req.params
    const booking = await Booking.findById(id)

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" })
    }

    res.status(200).json(booking)
  } catch (error) {
    console.error("Error fetching booking:", error)
    res.status(500).json({ message: "Error fetching booking", error: error.message })
  }
}

// Update booking status
const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    if (!["pending", "ongoing", "confirmed", "completed", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" })
    }

    console.log(`Updating booking ${id} status to ${status}`)
    const booking = await Booking.findByIdAndUpdate(id, { status }, { new: true })

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" })
    }

    console.log(`Booking ${id} status updated successfully`)
    res.status(200).json(booking)
  } catch (error) {
    console.error("Error updating booking status:", error)
    res.status(500).json({ message: "Error updating booking status", error: error.message })
  }
}

export { createBooking, getAllBookings, getUserBookings, getBookingById, updateBookingStatus }