// import { saveMessage, getPrivateMessages } from "./models/MessageModel.js"
// import { v4 as uuidv4 } from "uuid"
// import { Server } from "socket.io"
// import jwt from "jsonwebtoken"

import dotenv from "dotenv"
dotenv.config({ path: "../.env" })

import express from "express"
import cors from "cors"
import { createServer } from "http"
import mongoose from "mongoose"
import path from "path"
import { fileURLToPath } from "url"

import { registerUser, registerCustomer, registerManager, loginUser } from "./controller/userController.js"
import { User } from "./models/user.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Connection Failed", err))

const app = express()

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
)

// Increase payload limit for file uploads
app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ limit: "50mb", extended: true }))

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")))

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

// Authentication routes
app.post("/login", loginUser)

// Legacy registration route (for backward compatibility)
app.post("/register", registerUser)

// New specific registration routes
app.post("/register-customer", registerCustomer)
app.post("/register-manager", registerManager)

// Get all users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password")
    res.status(200).json(users)
  } catch (error) {
    console.error("Error fetching users:", error)
    res.status(500).json({ message: "Error fetching users", error: error.message })
  }
})

// Online Chat Features

const server = createServer(app)

// const io = new Server(server, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"],
//   },
// })

// const users = {}

// io.use((socket, next) => {
//   const { token, username, userId } = socket.handshake.auth

//   console.log("Socket auth:", { username, userId })

//   if (!username) {
//     return next(new Error("Username is required"))
//   }

//   if (token) {
//     try {
//       const decoded = jwt.verify(token, process.env.JWT_KEY)
//       socket.user = { id: decoded.id, username }
//       console.log("Authenticated socket user:", socket.user)
//     } catch (err) {
//       console.error("Token verification failed:", err)
//     }
//   }

//   next()
// })

// io.on("connection", (socket) => {
//   console.log(`User connected: ${socket.id}`)

//   const { username, userId } = socket.handshake.auth
//   const existingUserSocket = Object.values(users).find((user) => user.id === userId)
//   if (existingUserSocket) {
//     delete users[existingUserSocket.socketId]
//   }

//   users[socket.id] = {
//     id: userId || socket.id,
//     username,
//     socketId: socket.id,
//   }

//   io.emit(
//     "users_update",
//     Object.values(users).reduce((unique, user) => {
//       if (!unique.some((u) => u.id === user.id)) {
//         unique.push(user)
//       }
//       return unique
//     }, []),
//   )

//   socket.on("send_private_message", async (messageData, callback) => {
//     try {
//       const { text, sender_id, receiver_id } = messageData

//       if (!text || !sender_id || !receiver_id) {
//         return callback({
//           success: false,
//           error: "Missing required fields",
//         })
//       }

//       const receiverSocket = Object.values(users).find((user) => user.id === receiver_id)

//       const message = {
//         id: uuidv4(),
//         text,
//         sender_id,
//         receiver_id,
//         sender: users[socket.id].username,
//         room: "private",
//         timestamp: new Date(),
//         isPrivate: true,
//       }

//       await saveMessage(message)

//       if (receiverSocket) {
//         socket.to(receiverSocket.socketId).emit("private_message", message)
//       }

//       callback({ success: true, message })
//     } catch (error) {
//       console.error("Error sending private message:", error)
//       callback({ success: false, error: "Failed to send message" })
//     }
//   })

//   socket.on("get_private_message_history", async ({ userId }, callback) => {
//     try {
//       const currentUserId = users[socket.id].id

//       if (!currentUserId || !userId) {
//         return callback({
//           success: false,
//           error: "Missing user IDs",
//         })
//       }

//       const messages = await getPrivateMessages(currentUserId, userId)

//       callback({
//         success: true,
//         messages,
//         userId,
//       })

//       socket.emit("private_message_history", {
//         userId,
//         messages,
//       })
//     } catch (error) {
//       console.error("Error getting private message history:", error)
//       callback({ success: false, error: "Failed to get message history" })
//     }
//   })

//   socket.on("disconnect", () => {
//     console.log(`User disconnected: ${socket.id}`)
//     delete users[socket.id]
//     io.emit("users_update", Object.values(users))
//   })
// })

// Connection Check

// app.get("/", (req, res) => {
//   res.send("Socket.IO Chat Server is running")
// })

const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
