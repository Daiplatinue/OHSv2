import express from "express"
import {
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
} from "../controller/notificationController.js"

const router = express.Router()

// Authentication middleware
import jwt from "jsonwebtoken"
import { User } from "../models/user.js"

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (!token) {
    return res.status(401).json({ message: "Authentication required" })
  }

  jwt.verify(token, process.env.JWT_KEY, async (err, user) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired", code: "TOKEN_EXPIRED" })
      }
      return res.status(403).json({ message: "Invalid token" })
    }

    try {
      const currentUser = await User.findById(user.id).select("-password -refreshTokens")
      if (!currentUser) {
        return res.status(401).json({ message: "User not found" })
      }

      req.user = user
      req.currentUser = currentUser
      next()
    } catch (error) {
      console.error("Error verifying user:", error)
      return res.status(500).json({ message: "Authentication error" })
    }
  })
}

// Create notification routes
router.post("/", authenticateToken, createNotification)
router.post("/welcome", authenticateToken, createWelcomeNotification)
router.post("/registration", authenticateToken, createRegistrationNotification)
router.post("/booking", authenticateToken, createBookingNotification)

// Get notification routes
router.get("/user/:userId", authenticateToken, getUserNotifications)
router.get("/user/:userId/stats", authenticateToken, getNotificationStats)

// Update notification routes
router.put("/:notificationId/read", authenticateToken, markNotificationAsRead)
router.put("/user/:userId/read-all", authenticateToken, markAllNotificationsAsRead)

// Delete notification routes
router.delete("/:notificationId", authenticateToken, deleteNotification)
router.delete("/user/:userId/clear-all", authenticateToken, clearAllNotifications) // New route

export default router