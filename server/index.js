import dotenv from "dotenv"
dotenv.config({ path: "../.env" })

import express from "express"
import cors from "cors"
import { createServer } from "http"
import mongoose from "mongoose"
import path from "path"
import { fileURLToPath } from "url"
import jwt from "jsonwebtoken"
import multer from "multer"
import fs from "fs"

import {
  registerUser,
  registerCustomer,
  registerManager,
  loginUser,
  getUserProfile,
  updateUserProfile,
  refreshToken,
  logoutUser,
} from "./controller/userController.js"

import {
  createBooking,
  getAllBookings,
  getUserBookings,
  getBookingById,
  updateBookingStatus,
} from "./controller/bookingController.js"

import { createBookingNotification } from "./controller/notificationController.js"

// Import the WebSocket server initialization function
import { initWebSocketServer } from "./websocket-server.js"

import { User } from "./models/user.js"
import { newService } from "./controller/serviceController.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Connection Failed", err))
console.log(process.env.MONGO_URL)
const app = express()

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000", "http://localhost:3006", "*"], // Add your frontend URL and the new backend port
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
)

// Increase payload limit for file uploads
app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ limit: "50mb", extended: true }))

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")))

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Create user directory if it doesn't exist
    const userId = req.user.id
    const userDir = path.join(__dirname, "../uploads", userId)

    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true })
    }

    cb(null, userDir)
  },
  filename: (req, file, cb) => {
    // Determine file type and set appropriate name
    const fileType = file.fieldname // profilePicture or coverPhoto
    const fileExtension = file.originalname.split(".").pop()
    cb(null, `${fileType}.${fileExtension}`)
  },
})

const upload = multer({ storage: storage })

// Enhanced authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (!token) {
    return res.status(401).json({ message: "Authentication required" })
  }

  jwt.verify(token, process.env.JWT_KEY, async (err, user) => {
    if (err) {
      // Check if token is expired
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired", code: "TOKEN_EXPIRED" })
      }
      return res.status(403).json({ message: "Invalid token" })
    }

    // Optional: Check if user still exists and is active
    try {
      const currentUser = await User.findById(user.id).select("-password -refreshTokens")
      if (!currentUser) {
        return res.status(401).json({ message: "User not found" })
      }

      // Add user info to request
      req.user = user
      req.currentUser = currentUser
      next()
    } catch (error) {
      console.error("Error verifying user:", error)
      return res.status(500).json({ message: "Authentication error" })
    }
  })
}

// Optional middleware for routes that don't require authentication
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (!token) {
    return next()
  }

  jwt.verify(token, process.env.JWT_KEY, (err, user) => {
    if (!err) {
      req.user = user
    }
    next()
  })
}

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" })
})

// Add detailed request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`)
  if (
    req.method === "POST" &&
    (req.url === "/register" ||
      req.url === "/register-customer" ||
      req.url === "/register-manager" ||
      req.url === "/login")
  ) {
    console.log("Request headers:", req.headers)
    console.log("Request body keys:", Object.keys(req.body))
    if (req.body.email) {
      console.log("Request email:", req.body.email)
    }
  }
  next()
})

// NEW RECAPTCHA VERIFICATION ENDPOINT
app.post("/captcha", async (req, res) => {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY
  const recaptchaToken = req.body.recaptchaToken

  if (!secretKey) {
    console.error("Backend /captcha: RECAPTCHA_SECRET_KEY is NOT set.")
    return res
      .status(500)
      .json({ success: false, message: "Server configuration error: Missing reCAPTCHA secret key." })
  }

  if (!recaptchaToken) {
    return res.status(400).json({ success: false, message: "reCAPTCHA token missing." })
  }

  console.log("Backend /captcha: Attempting to verify reCAPTCHA token.")

  try {
    const params = new URLSearchParams()
    params.append("secret", secretKey)
    params.append("response", recaptchaToken)

    const googleResponse = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
      signal: AbortSignal.timeout(10000), // 10-second timeout
    })

    if (!googleResponse.ok) {
      const errorText = await googleResponse.text()
      console.error(`Backend /captcha: HTTP error! Status: ${googleResponse.status}, Body: ${errorText}`)
      return res
        .status(googleResponse.status)
        .json({ success: false, message: `reCAPTCHA verification failed with HTTP status ${googleResponse.status}.` })
    }

    const data = await googleResponse.json()

    if (data.success) {
      console.log("Backend /captcha: reCAPTCHA verification successful.")
      return res.json({ success: true, message: "reCAPTCHA verified successfully!" })
    } else {
      console.error("Backend /captcha: reCAPTCHA verification failed with error codes:", data["error-codes"])
      let errorMessage = "reCAPTCHA verification failed. Please try again."
      if (data["error-codes"] && data["error-codes"].length > 0) {
        errorMessage += ` Error: ${data["error-codes"].join(", ")}`
      }
      return res.status(400).json({ success: false, message: errorMessage, errors: data["error-codes"] })
    }
  } catch (error) {
    console.error("Backend /captcha: Error during reCAPTCHA verification:", error)
    if (error.name === "AbortError") {
      return res.status(504).json({ success: false, message: "reCAPTCHA verification timed out." })
    }
    return res
      .status(500)
      .json({ success: false, message: `Internal server error during reCAPTCHA verification: ${error.message}` })
  }
})
// END NEW RECAPTCHA VERIFICATION ENDPOINT

// Authentication routes
app.post("/login", loginUser)
app.post("/register", registerUser)
app.post("/register-manager", registerManager)
app.post("/register-customer", registerCustomer)
app.post("/refresh-token", refreshToken)
app.post("/logout", authenticateToken, logoutUser)

// User profile routes
app.get("/user/profile", authenticateToken, getUserProfile)
app.put(
  "/user/profile",
  authenticateToken,
  upload.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "coverPhoto", maxCount: 1 },
  ]),
  updateUserProfile,
)

app.get("/users", optionalAuth, async (req, res) => {
  try {
    const users = await User.find().select("-password -refreshTokens")
    res.status(200).json(users)
  } catch (error) {
    console.error("Error fetching users:", error)
    res.status(500).json({ message: "Error fetching users", error: error.message })
  }
})

// Booking routes
app.post("/bookings", authenticateToken, createBooking)
app.get("/bookings", getAllBookings)
app.get("/bookings/user/:userId", getUserBookings)
app.get("/bookings/:id", getBookingById)
app.patch("/bookings/:id/status", updateBookingStatus)

// Service routes - no authentication required, uses userId from request body
app.post("/services", newService)

// Replace the existing notification routes with the new router
import notificationRoutes from "./routes/notification-route.js"
app.use("/notifications", notificationRoutes)

// Create notification after booking status change
import { sendNotificationToUser } from "./websocket-server.js"

app.use((req, res, next) => {
  const originalSend = res.send

  res.send = function (body) {
    // Check if this is a booking status update response
    if (req.method === "PATCH" && req.url.includes("/bookings/") && req.url.includes("/status")) {
      try {
        const responseBody = JSON.parse(body)

        // If booking status was updated successfully
        if (responseBody.success && responseBody.booking) {
          const booking = responseBody.booking

          // Create a notification for the booking status change
          createBookingNotification(
            {
              body: {
                userId: booking.userId,
                bookingId: booking._id,
                status: booking.status,
                serviceName: booking.productName || booking.service,
                providerName: booking.providerName || booking.companyName,
              },
            },
            {
              status: (code) => ({
                json: (data) => {
                  // If notification was created successfully, send it via WebSocket
                  if (data.success && data.notification) {
                    sendNotificationToUser(booking.userId, data.notification)
                  }
                },
              }),
            },
          ).catch((err) => {
            console.error("Error creating notification after booking update:", err)
          })
        }
      } catch (error) {
        console.error("Error processing response for notification:", error)
      }
    }

    // Continue with the original response
    originalSend.call(this, body)
  }

  next()
})

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global error handler:", err)

  if (err.name === "ValidationError") {
    return res.status(400).json({ message: "Validation error", errors: err.errors })
  }

  if (err.name === "CastError") {
    return res.status(400).json({ message: "Invalid ID format" })
  }

  if (err.code === 11000) {
    return res.status(400).json({ message: "Duplicate field value" })
  }

  res.status(500).json({ message: "Internal server error" })
})

const server = createServer(app)

// Initialize WebSocket server
const wss = initWebSocketServer(server)

const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
