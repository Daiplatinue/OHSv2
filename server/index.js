import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cors from "cors"
import { registerCustomer, registerManager } from "./controller/userController.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors()) // Enable CORS for all origins
app.use(express.json({ limit: "50mb" })) // For parsing application/json
app.use(express.urlencoded({ limit: "50mb", extended: true })) // For parsing application/x-www-form-urlencoded

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err))

// Routes
app.post("/api/users/register/customer", registerCustomer)
app.post("/api/users/register/manager", registerManager)

// Basic route for testing server
app.get("/", (req, res) => {
  res.send("Online Home Service Backend is running!")
})

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})