import { Booking } from "../models/bookings.js"
import { User } from "../models/user.js"

export const createBookings = async (req, res) => {
  try {
    const {
      userId,
      firstname,
      productName,
      serviceImage,
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
      serviceImage,
      providerName,
      providerId,
      workerCount,
      bookingDate,
      bookingTime,
      location,
      estimatedTime,
      pricing,
      specialRequests,
      status: "pending",
      assignedWorkers: [],
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
    const userId = req.userId
    if (!userId) {
      return res.status(400).json({ message: "User ID not found in request." })
    }

    const bookings = await Booking.find({ userId }).sort({ createdAt: -1 })
    res.status(200).json(bookings)
  } catch (error) {
    console.error("Error fetching bookings by user ID:", error)
    res.status(500).json({ message: "Failed to fetch bookings.", error: error.message })
  }
}

export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status, autoCancelDate, providerAccepted, workerName, workerId: reqWorkerId } = req.body // Destructure reqWorkerId

    console.log(`[${new Date().toISOString()}] updateBookingStatus called for booking ID: ${id}`)
    console.log(`Request body:`, req.body)
    console.log(`Authenticated User ID (req.userId): ${req.userId}`)

    const booking = await Booking.findById(id)
    if (!booking) {
      console.log(`Booking not found for ID: ${id}`)
      return res.status(404).json({ message: "Booking not found." })
    }

    // NEW: Normalize assignedWorkers to remove duplicates based on workerId or name
    const uniqueWorkers = []
    const seenWorkerIds = new Set()
    const seenWorkerNames = new Set()

    for (const worker of booking.assignedWorkers) {
      if (worker.workerId) {
        if (!seenWorkerIds.has(worker.workerId.toString())) {
          seenWorkerIds.add(worker.workerId.toString())
          uniqueWorkers.push(worker)
        }
      } else {
        // If no workerId, check by name. This is less reliable but necessary for old data.
        if (!seenWorkerNames.has(worker.name)) {
          seenWorkerNames.add(worker.name)
          uniqueWorkers.push(worker)
        }
      }
    }
    booking.assignedWorkers = uniqueWorkers
    console.log(
      `Normalized booking state (assignedWorkers):`,
      booking.assignedWorkers.map((w) => ({ name: w.name, workerId: w.workerId?.toString() })),
    )

    let currentAssignedWorkersCount = booking.assignedWorkers.length

    console.log(
      `Initial booking state (assignedWorkers):`,
      booking.assignedWorkers.map((w) => ({ name: w.name, workerId: w.workerId?.toString() })),
    )
    console.log(`Initial booking state (workerCount):`, booking.workerCount)
    console.log(`Initial booking state (providerAccepted):`, booking.providerAccepted)

    const updateFields = {}

    // Scenario 1: Initial acceptance by a provider
    if (providerAccepted !== undefined && booking.status === "active" && !booking.providerAccepted) {
      console.log(`Scenario 1: Initial acceptance by provider triggered.`)
      // Fetch the current provider's name from the User model
      const providerUser = await User.findById(req.userId).select("firstName lastName middleName")
      if (!providerUser) {
        console.log(`Provider user not found for ID: ${req.userId}`)
        return res.status(404).json({ message: "Provider user not found." })
      }
      const providerFullName =
        `${providerUser.firstName} ${providerUser.middleName ? providerUser.middleName + " " : ""}${providerUser.lastName}`.trim()
      console.log(`Provider Full Name: ${providerFullName}`)

      // UPDATED: Check if the provider is already in assignedWorkers by ID OR by name if workerId is undefined
      const isProviderAlreadyAssigned = booking.assignedWorkers.some(
        (worker) =>
          (worker.workerId && worker.workerId.toString() === req.userId.toString()) ||
          (!worker.workerId && worker.name === providerFullName),
      )
      console.log(`Is provider already assigned? ${isProviderAlreadyAssigned}`)

      if (!isProviderAlreadyAssigned) {
        // Only push if not already assigned
        updateFields.$push = { assignedWorkers: { name: providerFullName, workerId: req.userId } }
        currentAssignedWorkersCount += 1 // Increment only if a new worker is added
        console.log(
          `Provider added to assignedWorkers. New currentAssignedWorkersCount: ${currentAssignedWorkersCount}`,
        )
      } else {
        console.log(`Provider ${providerFullName} (ID: ${req.userId}) is already assigned. Not adding again.`)
      }

      updateFields.providerAccepted = true // Mark as accepted by a provider
      updateFields.autoCancelDate = undefined // Clear auto-cancel date once accepted
      updateFields.providerId = req.userId // IMPORTANT: Assign the accepting provider's ID to the booking
    }
    // Scenario 2: Assigning an additional worker to an already accepted booking
    else if (workerName) {
      console.log(`Scenario 2: Assigning additional worker triggered. Worker Name: ${workerName}`)
      if (!booking.providerAccepted) {
        return res.status(400).json({ message: "Booking must be accepted by provider before assigning workers." })
      }
      if (booking.assignedWorkers.length >= booking.workerCount) {
        return res.status(400).json({ message: "All required workers have already been assigned." })
      }

      const assignedWorkerName = workerName.trim()
      const assignedWorkerId = reqWorkerId || undefined // Use workerId from request body if provided

      // Check for duplicates based on workerId (if available) or name (less reliable, but needed for old data)
      const isDuplicateWorker = booking.assignedWorkers.some(
        (worker) =>
          (assignedWorkerId && worker.workerId && worker.workerId.toString() === assignedWorkerId.toString()) ||
          (!assignedWorkerId && worker.name === assignedWorkerName && !worker.workerId), // Check by name only if no workerId is involved in the existing entry
      )

      if (isDuplicateWorker) {
        console.log(
          `Worker ${assignedWorkerName} (ID: ${assignedWorkerId || "N/A"}) is already assigned. Not adding again.`,
        )
        return res.status(400).json({ message: "This worker is already assigned to this booking." })
      }

      // Add the new worker
      updateFields.$push = { assignedWorkers: { name: assignedWorkerName, workerId: assignedWorkerId } }
      currentAssignedWorkersCount += 1
      console.log(`Additional worker added. New currentAssignedWorkersCount: ${currentAssignedWorkersCount}`)
    }
    // Scenario 3: General status update (e.g., cancel, complete)
    else if (status) {
      console.log(`Scenario 3: General status update triggered. New status: ${status}`)
      updateFields.status = status
      if (status === "active" && autoCancelDate) {
        updateFields.autoCancelDate = new Date(autoCancelDate)
      } else if (status === "completed") {
        updateFields.completedDate = new Date() // Set completion date
      } else {
        updateFields.autoCancelDate = undefined
      }
    } else {
      console.log(`No valid update fields provided.`)
      return res.status(400).json({ message: "No valid update fields provided." })
    }

    // Determine final status based on worker assignment *after* potential pushes
    // This logic should run *after* `currentAssignedWorkersCount` is updated
    if (updateFields.$push && currentAssignedWorkersCount === booking.workerCount) {
      updateFields.status = "ongoing"
      console.log(`Booking status set to 'ongoing' as all workers are assigned.`)
    } else if (updateFields.$push && !updateFields.status) {
      // If workers are assigned but not all required, and no other status was set, keep as 'active'
      updateFields.status = "active"
      console.log(`Booking status kept as 'active' as not all workers are assigned yet.`)
    }

    console.log(`Final updateFields before DB call:`, JSON.stringify(updateFields, null, 2))
    const updatedBooking = await Booking.findByIdAndUpdate(id, updateFields, { new: true })

    if (!updatedBooking) {
      console.log(`Booking not found after update for ID: ${id}`)
      return res.status(404).json({ message: "Booking not found after update." })
    }
    console.log(
      `Updated booking state (assignedWorkers):`,
      updatedBooking.assignedWorkers.map((w) => ({ name: w.name, workerId: w.workerId?.toString() })),
    )
    console.log(`Updated booking state (status):`, updatedBooking.status)

    res.status(200).json(updatedBooking)
  } catch (error) {
    console.error("Error updating booking status:", error)
    res.status(500).json({ message: "Failed to update booking status.", error: error.message })
  }
}

// Function to get ALL active bookings (for all providers to see and accept)
// This now fetches bookings that are 'active' but not yet accepted by any provider.
export const getAllActiveBookings = async (req, res) => {
  try {
    const activeBookings = await Booking.find({
      status: "active", // Only show bookings with 'active' status
      providerAccepted: false, // And not yet accepted by any provider
    })
      .populate("userId", "firstName lastName middleName email mobileNumber profilePicture")
      .sort({ createdAt: -1 })

    const transformedBookings = activeBookings.map((booking) => {
      const bookingObj = booking.toObject()
      const user = bookingObj.userId
      const customerName = user
        ? `${user.firstName} ${user.middleName ? user.middleName + " " : ""}${user.lastName}`.trim()
        : bookingObj.firstname || "Unknown Customer"

      return {
        ...bookingObj,
        customerName,
        serviceName: bookingObj.productName,
        date: bookingObj.bookingDate,
        time: bookingObj.bookingTime,
        image: bookingObj.serviceImage || "/placeholder.svg",
        price: bookingObj.pricing?.baseRate || 0,
        distanceCharge: bookingObj.pricing?.distanceCharge || 0,
        total: bookingObj.pricing?.totalRate || 0,
        workersRequired: bookingObj.workerCount || 1,
        workersAssigned: bookingObj.assignedWorkers?.length || 0, // Use assignedWorkers length
        shortDescription: `${bookingObj.productName} service`,
        autoCancelDate:
          bookingObj.autoCancelDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        createdAt: new Date(bookingObj.createdAt).toLocaleDateString(),
        userDetails: user,
        canAccept: !bookingObj.providerAccepted, // Can accept if no provider has accepted yet
        assignedWorkers: bookingObj.assignedWorkers || [], // Include assigned workers
      }
    })

    res.status(200).json(transformedBookings)
  } catch (error) {
    console.error("Error fetching all active bookings:", error)
    res.status(500).json({ message: "Failed to fetch all active bookings.", error: error.message })
  }
}

// UPDATED: Function to get completed bookings for a specific provider with populated user details
export const getCompletedBookingsByProviderId = async (req, res) => {
  try {
    const providerId = req.userId
    if (!providerId) {
      return res.status(400).json({ message: "Provider ID not found in request." })
    }

    const completedBookings = await Booking.find({
      providerId: providerId,
      status: "completed",
    })
      .populate("userId", "firstName lastName middleName email mobileNumber profilePicture")
      .sort({ completedDate: -1, createdAt: -1 })

    const transformedBookings = completedBookings.map((booking) => {
      const bookingObj = booking.toObject()
      const user = bookingObj.userId
      const customerName = user
        ? `${user.firstName} ${user.middleName ? user.middleName + " " : ""}${user.lastName}`.trim()
        : bookingObj.firstname || "Unknown Customer"

      return {
        ...bookingObj,
        customerName,
        serviceName: bookingObj.productName,
        date: bookingObj.bookingDate,
        time: bookingObj.bookingTime,
        image: bookingObj.serviceImage || "/placeholder.svg",
        price: bookingObj.pricing?.baseRate || 0,
        distanceCharge: bookingObj.pricing?.distanceCharge || 0,
        total: bookingObj.pricing?.totalRate || 0,
        workersRequired: bookingObj.workerCount || 1,
        workersAssigned: bookingObj.assignedWorkers?.length || 0, // Use assignedWorkers length
        shortDescription: `${bookingObj.productName} service`,
        completedDate: bookingObj.completedDate ? new Date(bookingObj.completedDate).toLocaleDateString() : null,
        createdAt: new Date(bookingObj.createdAt).toLocaleDateString(),
        userDetails: user,
        review: bookingObj.review || "",
        rating: bookingObj.rating || 0,
        assignedWorkers: bookingObj.assignedWorkers || [], // Include assigned workers
      }
    })

    res.status(200).json(transformedBookings)
  } catch (error) {
    console.error("Error fetching completed bookings by provider ID:", error)
    res.status(500).json({ message: "Failed to fetch completed bookings.", error: error.message })
  }
}

export const getAllPendingBookings = async (req, res) => {
  try {
    const pendingBookings = await Booking.find({
      status: "pending",
    })
      .populate("userId", "firstName lastName middleName email mobileNumber profilePicture")
      .sort({ createdAt: -1 })

    const transformedBookings = pendingBookings.map((booking) => {
      const bookingObj = booking.toObject()
      const user = bookingObj.userId
      const customerName = user
        ? `${user.firstName} ${user.middleName ? user.middleName + " " : ""}${user.lastName}`.trim()
        : bookingObj.firstname || "Unknown Customer"

      return {
        ...bookingObj,
        customerName,
        serviceName: bookingObj.productName,
        date: bookingObj.bookingDate,
        time: bookingObj.bookingTime,
        image: bookingObj.serviceImage || "/placeholder.svg",
        price: bookingObj.pricing?.baseRate || 0,
        distanceCharge: bookingObj.pricing?.distanceCharge || 0,
        total: bookingObj.pricing?.totalRate || 0,
        workersRequired: bookingObj.workerCount || 1,
        workersAssigned: bookingObj.assignedWorkers?.length || 0, // Use assignedWorkers length
        shortDescription: `${bookingObj.productName} service`,
        autoCancelDate:
          bookingObj.autoCancelDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        createdAt: new Date(bookingObj.createdAt).toLocaleDateString(),
        userDetails: user,
        assignedWorkers: bookingObj.assignedWorkers || [], // Include assigned workers
      }
    })

    res.status(200).json(transformedBookings)
  } catch (error) {
    console.error("Error fetching all pending bookings:", error)
    res.status(500).json({ message: "Failed to fetch all pending bookings.", error: error.message })
  }
}

// UPDATED: Function to get accepted bookings for the current provider
export const getAcceptedBookingsByProviderId = async (req, res) => {
  try {
    const providerId = req.userId
    if (!providerId) {
      return res.status(400).json({ message: "Provider ID not found in request." })
    }

    const acceptedBookings = await Booking.find({
      providerId: providerId,
      providerAccepted: true, // Only bookings this provider has accepted
      status: { $in: ["active", "ongoing"] }, // Bookings that are active or ongoing
    })
      .populate("userId", "firstName lastName middleName email mobileNumber profilePicture")
      .sort({ createdAt: -1 })

    const transformedBookings = acceptedBookings.map((booking) => {
      const bookingObj = booking.toObject()
      const user = bookingObj.userId
      const customerName = user
        ? `${user.firstName} ${user.middleName ? user.middleName + " " : ""}${user.lastName}`.trim()
        : bookingObj.firstname || "Unknown Customer"

      return {
        ...bookingObj,
        customerName,
        serviceName: bookingObj.productName,
        date: bookingObj.bookingDate,
        time: bookingObj.bookingTime,
        image: bookingObj.serviceImage || "/placeholder.svg",
        price: bookingObj.pricing?.baseRate || 0,
        distanceCharge: bookingObj.pricing?.distanceCharge || 0,
        total: bookingObj.pricing?.totalRate || 0,
        workersRequired: bookingObj.workerCount || 1,
        workersAssigned: bookingObj.assignedWorkers?.length || 0,
        shortDescription: `${bookingObj.productName} service`,
        autoCancelDate:
          bookingObj.autoCancelDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        createdAt: new Date(bookingObj.createdAt).toLocaleDateString(),
        userDetails: user,
        assignedWorkers: bookingObj.assignedWorkers || [],
      }
    })

    res.status(200).json(transformedBookings)
  } catch (error) {
    console.error("Error fetching accepted bookings by provider ID:", error)
    res.status(500).json({ message: "Failed to fetch accepted bookings.", error: error.message })
  }
}