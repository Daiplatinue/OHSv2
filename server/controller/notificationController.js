import { Notification } from "../models/notification.js"
import { User } from "../models/user.js"
import mongoose from "mongoose"

// Create a new notification
const createNotification = async (req, res) => {
  try {
    const { userId, title, description, type, icon, link, priority, relatedId, relatedModel, metadata } = req.body

    // Validate required fields
    if (!userId || !title || !description) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: userId, title, and description are required",
      })
    }

    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      })
    }

    // Check if user exists
    const userExists = await User.exists({ _id: userId })
    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Create notification
    const notificationData = {
      userId,
      title: title.trim(),
      description: description.trim(),
      type: type || "info",
      icon: icon || "bell",
      link: link || "",
      priority: priority || "medium",
      relatedId: relatedId || null,
      relatedModel: relatedModel || null,
      metadata: metadata || {},
    }

    const notification = new Notification(notificationData)
    await notification.save()

    // Populate user data for response
    await notification.populate("userId", "firstname lastname email")

    console.log(`Notification created successfully for user ${userId}:`, notification.title)

    return res.status(201).json({
      success: true,
      message: "Notification created successfully",
      notification,
    })
  } catch (error) {
    console.error("Error creating notification:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to create notification",
      error: error.message,
    })
  }
}

// Create welcome notification (for registration)
const createWelcomeNotification = async (req, res) => {
  try {
    const { userId, userType, firstname } = req.body

    // Validate required fields
    if (!userId || !userType || !firstname) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: userId, userType, and firstname are required",
      })
    }

    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      })
    }

    // Check if user exists
    const userExists = await User.exists({ _id: userId })
    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Create welcome notification using static method
    const notification = await Notification.createWelcomeNotification(userId, userType, firstname)

    return res.status(201).json({
      success: true,
      message: "Welcome notification created successfully",
      notification,
    })
  } catch (error) {
    console.error("Error creating welcome notification:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to create welcome notification",
      error: error.message,
    })
  }
}

// Create registration notification
const createRegistrationNotification = async (req, res) => {
  try {
    const { userId, userType, firstname, status } = req.body

    // Validate required fields
    if (!userId || !userType || !firstname) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: userId, userType, and firstname are required",
      })
    }

    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      })
    }

    // Check if user exists
    const userExists = await User.exists({ _id: userId })
    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Create registration notification using static method
    const notification = await Notification.createRegistrationNotification(userId, userType, firstname, status)

    return res.status(201).json({
      success: true,
      message: "Registration notification created successfully",
      notification,
    })
  } catch (error) {
    console.error("Error creating registration notification:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to create registration notification",
      error: error.message,
    })
  }
}

// Get all notifications for a user with pagination and filtering
const getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params
    const { page = 1, limit = 20, status, type, priority } = req.query

    // Validate user ID
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      })
    }

    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      })
    }

    // Build query
    const query = { userId }
    if (status) {
      query.status = status
    }
    if (type) {
      query.type = type
    }
    if (priority) {
      query.priority = priority
    }

    // Get total count for pagination
    const total = await Notification.countDocuments(query)

    // Get notifications with pagination
    const notifications = await Notification.find(query)
      .sort({ priority: -1, createdAt: -1 }) // Sort by priority first, then by creation date
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate("userId", "firstname lastname email")

    // Get unread count
    const unreadCount = await Notification.countDocuments({ userId, status: "unread" })

    return res.status(200).json({
      success: true,
      notifications,
      unreadCount,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
      error: error.message,
    })
  }
}

// Mark a notification as read
const markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params

    // Validate notification ID
    if (!notificationId) {
      return res.status(400).json({
        success: false,
        message: "Notification ID is required",
      })
    }

    // Validate notificationId format
    if (!mongoose.Types.ObjectId.isValid(notificationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid notification ID format",
      })
    }

    // Find and update notification
    const notification = await Notification.findById(notificationId)

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      })
    }

    // Use instance method to mark as read
    await notification.markAsRead()

    return res.status(200).json({
      success: true,
      message: "Notification marked as read",
      notification,
    })
  } catch (error) {
    console.error("Error marking notification as read:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to mark notification as read",
      error: error.message,
    })
  }
}

// Mark all notifications as read for a user
const markAllNotificationsAsRead = async (req, res) => {
  try {
    const { userId } = req.params

    // Validate user ID
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      })
    }

    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      })
    }

    // Update all unread notifications for the user
    const result = await Notification.updateMany(
      { userId, status: "unread" },
      { status: "read", updatedAt: new Date() },
    )

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read",
      count: result.modifiedCount,
    })
  } catch (error) {
    console.error("Error marking all notifications as read:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to mark all notifications as read",
      error: error.message,
    })
  }
}

// Delete a notification
const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params

    // Validate notification ID
    if (!notificationId) {
      return res.status(400).json({
        success: false,
        message: "Notification ID is required",
      })
    }

    // Validate notificationId format
    if (!mongoose.Types.ObjectId.isValid(notificationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid notification ID format",
      })
    }

    // Find and delete notification
    const notification = await Notification.findByIdAndDelete(notificationId)

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      })
    }

    return res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting notification:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to delete notification",
      error: error.message,
    })
  }
}

// Create a notification for booking events
const createBookingNotification = async (req, res) => {
  try {
    const { userId, bookingId, status, serviceName, providerName } = req.body

    // Validate required fields
    if (!userId || !bookingId || !status) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: userId, bookingId, and status are required",
      })
    }

    // Validate ID formats
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID or booking ID format",
      })
    }

    // Check if user exists
    const userExists = await User.exists({ _id: userId })
    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Determine notification details based on booking status
    let title, description, type, icon, link, priority

    switch (status) {
      case "pending":
        title = "Booking Submitted Successfully! 📅"
        description = `Your booking for ${serviceName || "service"} has been submitted and is pending confirmation. Please wait for the service provider to accept your booking. Stay tuned!`
        type = "info"
        icon = "calendar-clock"
        priority = "high"
        break
      case "confirmed":
        title = "Booking Confirmed! ✅"
        description = `Great news! Your booking for ${serviceName || "service"} with ${providerName || "provider"} has been confirmed.`
        type = "success"
        icon = "calendar-check"
        priority = "high"
        break
      case "ongoing":
        title = "Service Started! 🚀"
        description = `Your ${serviceName || "service"} with ${providerName || "provider"} has started.`
        type = "info"
        icon = "calendar"
        priority = "medium"
        break
      case "completed":
        title = "Service Completed! 🎉"
        description = `Your ${serviceName || "service"} with ${providerName || "provider"} has been completed successfully. Please rate your experience.`
        type = "success"
        icon = "check-circle"
        priority = "medium"
        break
      case "cancelled":
        title = "Booking Cancelled ❌"
        description = `Your booking for ${serviceName || "service"} has been cancelled.`
        type = "error"
        icon = "calendar-x"
        priority = "high"
        break
      case "payment_received":
        title = "Payment Received! 💳"
        description = `We've received your payment for ${serviceName || "service"}. Thank you!`
        type = "payment"
        icon = "credit-card"
        priority = "high"
        break
      default:
        title = "Booking Update 📋"
        description = `Your booking for ${serviceName || "service"} has been updated to ${status}.`
        type = "info"
        icon = "calendar"
        priority = "medium"
    }

    // Create link to booking details
    link = `/bookings/${bookingId}`

    // Create notification
    const notificationData = {
      userId,
      title,
      description,
      type,
      icon,
      link,
      priority,
      relatedId: bookingId,
      relatedModel: "Booking",
      metadata: {
        bookingStatus: status,
        serviceName: serviceName || "",
        providerName: providerName || "",
        bookingId: bookingId,
      },
    }

    const notification = new Notification(notificationData)
    await notification.save()

    console.log(`Booking notification created successfully for user ${userId}: ${title}`)

    return res.status(201).json({
      success: true,
      message: "Booking notification created successfully",
      notification,
    })
  } catch (error) {
    console.error("Error creating booking notification:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to create booking notification",
      error: error.message,
    })
  }
}

// Get notification statistics for a user
const getNotificationStats = async (req, res) => {
  try {
    const { userId } = req.params

    // Validate user ID
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Valid user ID is required",
      })
    }

    // Get statistics
    const stats = await Notification.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          unread: { $sum: { $cond: [{ $eq: ["$status", "unread"] }, 1, 0] } },
          read: { $sum: { $cond: [{ $eq: ["$status", "read"] }, 1, 0] } },
          high_priority: { $sum: { $cond: [{ $eq: ["$priority", "high"] }, 1, 0] } },
          urgent: { $sum: { $cond: [{ $eq: ["$priority", "urgent"] }, 1, 0] } },
        },
      },
    ])

    const result = stats[0] || {
      total: 0,
      unread: 0,
      read: 0,
      high_priority: 0,
      urgent: 0,
    }

    return res.status(200).json({
      success: true,
      stats: result,
    })
  } catch (error) {
    console.error("Error fetching notification stats:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to fetch notification statistics",
      error: error.message,
    })
  }
}

// Clear all notifications for a user
const clearAllNotifications = async (req, res) => {
  try {
    const { userId } = req.params

    // Validate user ID
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      })
    }

    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      })
    }

    // Delete all notifications for the user
    const result = await Notification.deleteMany({ userId: userId })

    return res.status(200).json({
      success: true,
      message: "All notifications cleared successfully",
      count: result.deletedCount,
    })
  } catch (error) {
    console.error("Error clearing all notifications:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to clear all notifications",
      error: error.message,
    })
  }
}

export {
  createNotification,
  createWelcomeNotification,
  createRegistrationNotification,
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  createBookingNotification,
  getNotificationStats,
  clearAllNotifications,
}