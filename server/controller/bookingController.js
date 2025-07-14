import { Booking } from "../models/bookings.js" // Corrected import to Booking

export const createBookings = async (req, res) => {
  try {
    const {
      userId,
      firstname,
      productName,
      serviceImage, // Add serviceImage here
      providerName,
      providerId,
      workerCount,
      bookingDate,
      bookingTime,
      location,
      estimatedTime,
      pricing,
      specialRequests,
    } = req.body

    // Basic validation
    if (
      !userId ||
      !firstname ||
      !productName ||
      !providerName ||
      !providerId ||
      !bookingDate ||
      !bookingTime ||
      !location ||
      !pricing
    ) {
      return res.status(400).json({ message: "Missing required booking fields." })
    }

    const newBooking = new Booking({
      userId,
      firstname,
      productName,
      serviceImage, // Add serviceImage to the new Booking object
      providerName,
      providerId,
      workerCount,
      bookingDate,
      bookingTime,
      location,
      estimatedTime,
      pricing,
      specialRequests,
      status: "pending", // Default status
    })

    const savedBooking = await newBooking.save()
    res.status(201).json(savedBooking)
  } catch (error) {
    console.error("Error creating booking:", error)
    res.status(500).json({ message: "Failed to create booking.", error: error.message })
  }
}

export const getBookingsByUserId = async (req, res) => {
  try {
    const userId = req.userId // userId is set by the authenticateToken middleware
    if (!userId) {
      return res.status(400).json({ message: "User ID not found in request." })
    }

    const bookings = await Booking.find({ userId }).sort({ createdAt: -1 }) // Sort by most recent
    res.status(200).json(bookings)
  } catch (error) {
    console.error("Error fetching bookings by user ID:", error)
    res.status(500).json({ message: "Failed to fetch bookings.", error: error.message })
  }
}

export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params // Booking ID from URL
    const { status, autoCancelDate, providerAccepted } = req.body // NEW: Add providerAccepted

    if (!status) {
      return res.status(400).json({ message: "New status is required." })
    }

    const updateFields = { status }
    if (status === "active" && autoCancelDate) {
      updateFields.autoCancelDate = new Date(autoCancelDate)
    } else {
      // Clear autoCancelDate if status is not 'active' or autoCancelDate is not provided
      updateFields.autoCancelDate = undefined
    }

    // NEW: Update providerAccepted if provided
    if (providerAccepted !== undefined) {
      updateFields.providerAccepted = providerAccepted
    }

    const updatedBooking = await Booking.findByIdAndUpdate(id, updateFields, { new: true })

    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found." })
    }

    res.status(200).json(updatedBooking)
  } catch (error) {
    console.error("Error updating booking status:", error)
    res.status(500).json({ message: "Failed to update booking status.", error: error.message })
  }
}