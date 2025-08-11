import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cors from "cors"
import multer from "multer"
import { put, BlobAccessError } from "@vercel/blob"
import jwt from "jsonwebtoken"
import { createServer } from "http"
import { Server } from "socket.io"
import { v4 as uuidv4 } from "uuid"
import {
  registerCustomer,
  registerCOO,
  loginUser,
  sendOtpEmail,
  verifyOtp,
  fetchSecretDetails,
  verifySecretAnswer,
  verifySecretCode,
  resetPassword,
  getUserProfile,
  updateUserImage,
  updateUserProfile,
  checkEmailAvailability,
  sendEmailVerificationCode,
  verifyEmailVerificationCode,
} from "./controller/userController.js"
import { createService, getServices, deleteService } from "./controller/serviceController.js"
import {
  saveMessage,
  getPrivateMessages,
  deleteMessage,
  updateMessageStatus,
  markMessagesAsRead,
} from "./controller/chatController.js"
import { User } from "./models/user.js"
import fetch from "node-fetch"
import {
  createBookings,
  getBookingsByUserId,
  updateBookingStatus,
  getAllActiveBookings,
  getCompletedBookingsByProviderId,
  getAllPendingBookings,
  getAcceptedBookingsByProviderId,
} from "./controller/bookingController.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

const upload = multer({ storage: multer.memoryStorage() })

app.use(cors())
app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ limit: "50mb", extended: true }))

app.use((req, res, next) => {
  const start = process.hrtime.bigint()
  res.on("finish", () => {
    const end = process.hrtime.bigint()
    const duration = Number(end - start) / 1_000_000
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - ${duration.toFixed(2)}ms`)
  })
  next()
})

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1] // Bearer TOKEN

  if (token == null) {
    console.warn("Authentication: No token provided.")
    return res.status(401).json({ message: "Authentication token required." })
  }

  const jwtSecret = process.env.JWT_SECRET
  if (!jwtSecret) {
    console.error("JWT_SECRET is not defined in environment variables.")
    return res.status(500).json({ message: "Server configuration error: JWT secret missing." })
  }

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) {
      console.error("JWT verification error:", err)
      if (err.name === "TokenExpiredError") {
        console.error("Token expired at:", err.expiredAt)
        return res.status(401).json({ message: "Token expired. Please log in again." })
      } else if (err.name === "JsonWebTokenError") {
        console.error("Invalid token:", err.message)
        return res.status(403).json({ message: "Invalid token. Please log in again." })
      } else {
        return res.status(403).json({ message: "Authentication failed. Invalid token." })
      }
    }
    req.userId = user.userId // Attach user ID to the request
    req.userEmail = user.email // Attach user email to the request
    req.accountType = user.accountType // Attach account type to the request
    next()
  })
}

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err))

// Online Chat Features - UNCOMMENTED AND INTEGRATED
const server = createServer(app) // Create HTTP server from Express app
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for development
    methods: ["GET", "POST"],
  },
})

const users = {} // Stores active users with their socket IDs and user info
const typingUsers = new Map() // Map to track who is typing to whom: { receiverId: Set<senderId> }

const emailVerificationCodes = new Map() // email -> { code, expiresAt }

io.use((socket, next) => {
  const { token, username, userId } = socket.handshake.auth
  console.log("Socket auth:", { username, userId })

  if (!username) {
    return next(new Error("Username is required"))
  }

  if (token) {
    try {
      const jwtSecret = process.env.JWT_KEY || process.env.JWT_SECRET // Use JWT_KEY or JWT_SECRET
      if (!jwtSecret) {
        console.error("JWT_KEY or JWT_SECRET is not defined in environment variables.")
        return next(new Error("Server configuration error: JWT secret missing."))
      }
      const decoded = jwt.verify(token, jwtSecret) // Ensure userId and username are correctly extracted

      // Use the username sent by client in auth, and userId from decoded token
      socket.user = { id: decoded.userId, username: username }
      console.log("Authenticated socket user:", socket.user)
    } catch (err) {
      console.error("Token verification failed:", err)
      return next(new Error("Authentication failed")) // Reject connection if token is invalid
    }
  } else {
    return next(new Error("Authentication token is required"))
  }
  next()
})

io.on("connection", async (socket) => {
  // Make the connection handler async
  console.log(`User connected: ${socket.id}`)
  const { username, userId } = socket.handshake.auth

  // Fetch full user details from DB
  let fullUserDetails = null
  try {
    fullUserDetails = await User.findById(userId).select("firstName lastName middleName profilePicture")
    if (!fullUserDetails) {
      console.warn(`User with ID ${userId} not found in DB during socket connection.`)
      // Fallback to basic info if not found
      fullUserDetails = { id: userId, username: username, profilePicture: null }
    } else {
      // Ensure the username property is also set for consistency,
      // using the username sent by client in auth, or constructing it from DB fields.
      fullUserDetails.username =
        username ||
        [fullUserDetails.firstName, fullUserDetails.middleName, fullUserDetails.lastName].filter(Boolean).join(" ")
    }
  } catch (dbError) {
    console.error("Error fetching user details from DB for socket:", dbError)
    fullUserDetails = { id: userId, username: username, profilePicture: null } // Fallback
  }

  // Remove any existing socket for this userId to ensure only one active connection per user
  const existingUserSocket = Object.values(users).find((user) => user.id === userId)
  if (existingUserSocket) {
    delete users[existingUserSocket.socketId]
  }

  users[socket.id] = {
    id: userId,
    username: fullUserDetails.username, // Use the full username
    profilePicture: fullUserDetails.profilePicture, // Add profile picture
    firstName: fullUserDetails.firstName, // Add first name
    lastName: fullUserDetails.lastName, // Add last name
    middleName: fullUserDetails.middleName, // Add middle name
    socketId: socket.id,
  }

  // Emit updated list of unique online users
  io.emit(
    "users_update",
    Object.values(users).reduce((unique, user) => {
      if (!unique.some((u) => u.id === user.id)) {
        unique.push(user)
      }
      return unique
    }, []),
  )

  socket.on("send_private_message", async (messageData, callback) => {
    try {
      const { text, sender_id, receiver_id, attachmentUrls } = messageData // Destructure attachmentUrls
      if ((!text && (!attachmentUrls || attachmentUrls.length === 0)) || !sender_id || !receiver_id) {
        return callback({
          success: false,
          error: "Missing required fields (text or attachment, sender_id, receiver_id)",
        })
      }

      const receiverSocket = Object.values(users).find((user) => user.id === receiver_id)
      const message = {
        id: uuidv4(),
        text,
        sender_id,
        receiver_id,
        sender: socket.user.username, // FIX: Use socket.user.username for sender's username
        room: "private",
        timestamp: new Date(),
        isPrivate: true,
        attachmentUrls: attachmentUrls || [], // Include attachmentUrls, default to empty array
        status: "sent", // NEW: Set initial status to 'sent'
        deleted: false, // NEW: Message is not deleted initially
      }

      const savedMessage = await saveMessage(message) // Save message to DB

      // Emit to sender immediately
      socket.emit("private_message", savedMessage)

      if (receiverSocket) {
        // Emit to receiver
        socket.to(receiverSocket.socketId).emit("private_message", savedMessage)

        // Update status to 'delivered' for the sender's view and DB
        const deliveredMessage = await updateMessageStatus(savedMessage.id, "delivered")
        if (deliveredMessage) {
          socket.emit("message_status_update", {
            messageId: deliveredMessage.id,
            status: deliveredMessage.status,
            receiverId: deliveredMessage.receiver_id, // Ensure receiverId is passed for client-side filtering
          })
        }
      }

      callback({ success: true, message: savedMessage })
    } catch (error) {
      console.error("Error sending private message:", error)
      callback({ success: false, error: "Failed to send message" })
    }
  })

  socket.on("get_private_message_history", async ({ userId }, callback) => {
    try {
      // FIX: Use socket.user.id for the current user's ID, which is set during authentication
      const currentUserId = socket.user.id
      if (!currentUserId || !userId) {
        return callback({
          success: false,
          error: "Missing user IDs",
        })
      }

      const messages = await getPrivateMessages(currentUserId, userId) // Fetch messages from DB
      callback({
        success: true,
        messages,
        userId,
      })
      // No need to emit 'private_message_history' separately, callback handles it
    } catch (error) {
      console.error("Error getting private message history:", error)
      callback({ success: false, error: "Failed to get message history" })
    }
  })

  // NEW: Handle unsend message event
  socket.on("unsend_message", async ({ messageId, receiverId }, callback) => {
    try {
      const senderId = socket.user.id
      const updatedMessage = await deleteMessage(messageId, senderId) // Mark message as deleted in DB

      if (updatedMessage) {
        // Notify sender and receiver about the unsent message
        const receiverSocket = Object.values(users).find((user) => user.id === receiverId)

        // Emit to sender
        socket.emit("message_unsent", {
          messageId: updatedMessage.id,
          receiverId: updatedMessage.receiver_id,
          text: updatedMessage.text,
        })

        // Emit to receiver if online
        if (receiverSocket) {
          socket.to(receiverSocket.socketId).emit("message_unsent", {
            messageId: updatedMessage.id,
            receiverId: updatedMessage.sender_id,
            text: updatedMessage.text,
          })
        }
        callback({ success: true })
      } else {
        callback({ success: false, error: "Failed to unsend message or message not found." })
      }
    } catch (error) {
      console.error("Error unsending message:", error)
      callback({ success: false, error: "Failed to unsend message" })
    }
  })

  // NEW: Handle marking messages as read
  socket.on("mark_messages_as_read", async ({ otherUserId }, callback) => {
    try {
      const currentUserId = socket.user.id
      const modifiedCount = await markMessagesAsRead(otherUserId, currentUserId) // Mark messages from otherUser to currentUser as read

      if (modifiedCount > 0) {
        // Notify the sender (otherUserId) that their messages have been read
        const senderSocket = Object.values(users).find((user) => user.id === otherUserId)
        if (senderSocket) {
          io.to(senderSocket.socketId).emit("message_status_update", {
            senderId: currentUserId, // The user who read the messages
            status: "read",
            messagesUpdated: true, // Indicate that multiple messages might have been updated
          })
        }
      }
      callback({ success: true, modifiedCount })
    } catch (error) {
      console.error("Error marking messages as read:", error)
      callback({ success: false, error: "Failed to mark messages as read" })
    }
  })

  // Handle typing start event
  socket.on("typing_start", ({ receiverId }) => {
    const senderId = socket.user.id
    const receiverSocket = Object.values(users).find((user) => user.id === receiverId)

    if (receiverSocket) {
      // Emit typing status to the receiver
      socket.to(receiverSocket.socketId).emit("typing_status", { userId: senderId, isTyping: true })
    }
  })

  // Handle typing stop event
  socket.on("typing_stop", ({ receiverId }) => {
    const senderId = socket.user.id
    const receiverSocket = Object.values(users).find((user) => user.id === receiverId)

    if (receiverSocket) {
      // Emit typing status to the receiver
      socket.to(receiverSocket.socketId).emit("typing_status", { userId: senderId, isTyping: false })
    }
  })

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`)
    delete users[socket.id]
    io.emit(
      "users_update",
      Object.values(users).reduce((unique, user) => {
        if (!unique.some((u) => u.id === user.id)) {
          unique.push(user)
        }
        return unique
      }, []),
    )
    // Also clear any typing status for this disconnected user
    typingUsers.forEach((senders, receiverId) => {
      if (socket.user && senders.has(socket.user.id)) {
        // Add check for socket.user
        senders.delete(socket.user.id)
        const receiverSocket = Object.values(users).find((user) => user.id === receiverId)
        if (receiverSocket) {
          socket.to(receiverSocket.socketId).emit("typing_status", { userId: socket.user.id, isTyping: false })
        }
      }
    })
  })
})

// Connection Check for HTTP server
app.get("/", (req, res) => {
  res.send("Online Home Service Backend is running!")
})

// New API endpoint for shared files data
app.get("/api/shared-files", (req, res) => {
  // Simulate a delay for network request
  setTimeout(() => {
    const data = {
      totalFiles: 231,
      totalLinks: 45,
      fileTypes: [
        {
          name: "Documents",
          count: 126,
          sizeMB: 193,
          icon: "FileTextIcon",
        },
        {
          name: "Photos",
          count: 53,
          sizeMB: 321,
          icon: "ImageIcon",
        },
        {
          name: "Movies",
          count: 3,
          sizeMB: 210,
          icon: "FilmIcon",
        },
        {
          name: "Other",
          count: 49,
          sizeMB: 194,
          icon: "FolderIcon",
        },
      ],
    }
    res.json(data)
  }, 500)
})

// Routes
app.post("/api/users/register/customer", registerCustomer)
app.post("/api/users/register/coo", registerCOO)
app.post("/api/users/login", loginUser)
app.post("/api/users/send-otp", sendOtpEmail) // New route for sending OTP
app.post("/api/users/verify-otp", verifyOtp) // New route for verifying OTP

// NEW: Routes for generic email verification
app.post("/api/users/send-email-verification", (req, res) =>
  sendEmailVerificationCode(req, res, emailVerificationCodes),
)
app.post("/api/users/verify-email-code", authenticateToken, (req, res) =>
  verifyEmailVerificationCode(req, res, emailVerificationCodes),
)

// New routes for forgot password flow
app.post("/api/users/forgot-password/fetch-details", fetchSecretDetails)
app.post("/api/users/forgot-password/verify-answer", verifySecretAnswer)
app.post("/api/users/forgot-password/verify-code", verifySecretCode)
app.post("/api/users/forgot-password/reset-password", resetPassword)

// Protected route for fetching user profile
app.get("/api/user/profile", authenticateToken, getUserProfile) // Apply middleware here

// New route for image uploads using Vercel Blob
app.post("/api/upload/image", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." })
    }

    // Upload the file buffer to Vercel Blob
    const { url } = await put(req.file.originalname, req.file.buffer, {
      access: "public",
      addRandomSuffix: true, // FIX: Add random suffix to prevent "blob already exists" error
      contentType: req.file.mimetype,
    })

    res.status(200).json({ url })
  } catch (error) {
    console.error("Error uploading file to Vercel Blob:", error)
    // FIX: Ensure BlobAccessError is imported and used correctly
    if (error instanceof BlobAccessError && error.code === "BLOB_ALREADY_EXISTS") {
      return res.status(409).json({ message: "File already exists. Please upload a different file or rename it." })
    }
    res.status(500).json({ message: "An unexpected error occurred during file upload.", error: error.message })
  }
})

// New route to update user profile/cover photo URL in DB
app.put("/api/user/update-image", authenticateToken, updateUserImage) // Apply middleware and new controller function

// New route to update user profile details
app.put("/api/user/profile", authenticateToken, updateUserProfile) // Apply middleware and new controller function

// NEW: Route for checking email availability
app.post("/api/users/check-email-availability", authenticateToken, checkEmailAvailability)

// NEW: PayMongo Link Creation Route
app.post("/api/paymongo-create-link", async (req, res) => {
  try {
    const { amount, description, success_url, failure_url } = req.body

    // IMPORTANT: This key MUST be loaded from environment variables in a real deployment.
    // For local testing without a .env file, you can temporarily hardcode it here,
    // but REMOVE IT before deploying to production.
    const PAYMENT_SECRET_KEY = process.env.PAYMENT_SECRET_KEY || "sk_test_C91FKxnYJbsaa6zdpaJ4bNvk" // TEMPORARY: Hardcoded for testing without .env

    if (!PAYMENT_SECRET_KEY) {
      console.error("PAYMENT_SECRET_KEY is not defined in environment variables.")
      return res.status(500).json({ error: "Payment secret key not configured." })
    }

    // PayMongo requires amount in centavos (smallest currency unit).
    // Ensure the amount is an integer.
    const amountInCentavos = Math.round(amount * 100)

    const paymongoResponse = await fetch("https://api.paymongo.com/v1/links", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // The Authorization header uses Basic authentication with your secret key as the username and an empty password.
        Authorization: `Basic ${Buffer.from(PAYMENT_SECRET_KEY + ":").toString("base64")}`,
      },
      body: JSON.stringify({
        data: {
          attributes: {
            amount: amountInCentavos,
            description: description,
            remarks: "payment api integrations", // Using the remark from your curl example
            currency: "PHP", // Assuming PHP as the currency for PayMongo in the Philippines
            redirect: {
              success: success_url,
              failed: failure_url,
            },
          },
        },
      }),
    })

    if (!paymongoResponse.ok) {
      const errorData = await paymongoResponse.json()
      console.error("PayMongo API Error:", errorData)
      return res
        .status(paymongoResponse.status)
        .json({ error: errorData.errors?.[0]?.detail || "Failed to create PayMongo link." })
    }

    const paymongoData = await paymongoResponse.json()
    const checkoutUrl = paymongoData.data.attributes.checkout_url

    return res.json({ checkoutUrl })
  } catch (error) {
    console.error("Error creating PayMongo link:", error)
    return res.status(500).json({ error: "Internal server error." })
  }
})

// Add the reCAPTCHA verification route
app.post("/api/verify-recaptcha", async (req, res) => {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY
  const recaptchaToken = req.body.recaptchaToken

  if (!secretKey) {
    console.error("Backend: RECAPTCHA_SECRET_KEY is NOT set.")
    res.status(500).json({ success: false, message: "Server configuration error: reCAPTCHA secret key missing." })
    return
  }

  if (!recaptchaToken) {
    res.status(400).json({ success: false, message: "reCAPTCHA token missing." })
    return
  }

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
    })

    const data = await googleResponse.json()

    if (data.success) {
      res.json({ success: true, message: "reCAPTCHA verified successfully!" })
    } else {
      console.error("Backend: reCAPTCHA verification failed with error codes:", data["error-codes"])
      res.status(400).json({ success: false, message: "reCAPTCHA verification failed.", errors: data["error-codes"] })
    }
  } catch (error) {
    console.error("Backend: Error during reCAPTCHA verification:", error)
    res.status(500).json({ success: false, message: "Internal server error during reCAPTCHA verification." })
  }
})

// NEW: Service creation route - pass 'io' to the controller
app.post("/api/services/create", authenticateToken, (req, res) => createService(req, res, io))
// NEW: Service fetch route
app.get("/api/services", getServices)
// NEW: Service deletion route - pass 'io' to the controller
app.delete("/api/services/:id", authenticateToken, (req, res) => deleteService(req, res, io))

// Add the new booking route
app.post("/api/bookings", authenticateToken, createBookings)
// NEW: Route to fetch bookings by user ID
app.get("/api/bookings/user", authenticateToken, getBookingsByUserId)
// NEW: Route to update booking status
app.put("/api/bookings/:id/status", authenticateToken, updateBookingStatus)

// NEW: Route to fetch ALL active bookings (for all providers to see)
app.get("/api/bookings/all-active", authenticateToken, getAllActiveBookings)
// NEW: Route to fetch completed bookings for a specific provider
app.get("/api/bookings/completed-by-provider", authenticateToken, getCompletedBookingsByProviderId)
// NEW: Route to fetch all pending bookings
app.get("/api/bookings/all-pending", authenticateToken, getAllPendingBookings)

// Add the new route for accepted bookings by provider
// NEW: Route to fetch accepted bookings for the current provider
app.get("/api/bookings/accepted-by-provider", authenticateToken, getAcceptedBookingsByProviderId)

// Start the server using the HTTP server instance
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Socket.IO server running on port ${PORT}`)
})

console.log(process.env.OPENROUTER_API_KEY)
console.log(process.env.RECAPTCHA_SECRET_KEY)
console.log(process.env.VITE_API_URL)