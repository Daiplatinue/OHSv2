import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cors from "cors"
import multer from "multer"
import { put } from "@vercel/blob"
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
} from "./controller/userController.js"
import fetch from "node-fetch"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

const upload = multer({ storage: multer.memoryStorage() })

// Middleware
app.use(cors())
app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ limit: "50mb", extended: true }))

// New: Request timing middleware (replaces previous logging middleware)
app.use((req, res, next) => {
  const start = process.hrtime.bigint()
  res.on("finish", () => {
    const end = process.hrtime.bigint()
    const duration = Number(end - start) / 1_000_000 // Convert to milliseconds
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - ${duration.toFixed(2)}ms`)
  })
  next()
})

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err))

// Routes
app.post("/api/users/register/customer", registerCustomer)
app.post("/api/users/register/coo", registerCOO)
app.post("/api/users/login", loginUser)
app.post("/api/users/send-otp", sendOtpEmail) // New route for sending OTP
app.post("/api/users/verify-otp", verifyOtp) // New route for verifying OTP

// New routes for forgot password flow
app.post("/api/users/forgot-password/fetch-details", fetchSecretDetails)
app.post("/api/users/forgot-password/verify-answer", verifySecretAnswer)
app.post("/api/users/forgot-password/verify-code", verifySecretCode)
app.post("/api/users/forgot-password/reset-password", resetPassword)

// New route for image uploads using Vercel Blob
app.post("/api/upload/image", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." })
    }

    // Upload the file buffer to Vercel Blob
    const { url } = await put(req.file.originalname, req.file.buffer, {
      access: "public",
      contentType: req.file.mimetype,
    })

    res.status(200).json({ url })
  } catch (error) {
    console.error("Error uploading file to Vercel Blob:", error)
    // Check for the specific BlobError for existing files
    if (error && error.name === "BlobError" && error.code === "BLOB_ALREADY_EXISTS") {
      return res.status(409).json({ message: "File already exists. Please upload a different file or rename it." })
    }
    res
      .status(500)
      .json({ message: "File already exists. Please upload a different file or rename it.", error: error.message })
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

// Basic route for testing server
app.get("/", (req, res) => {
  res.send("Online Home Service Backend is running!")
})

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

console.log(process.env.JWT_SECRET)