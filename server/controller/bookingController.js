import { Booking } from "../models/bookings.js" // Corrected import to Booking

export const createBookings = async (req, res) => {
  try {
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