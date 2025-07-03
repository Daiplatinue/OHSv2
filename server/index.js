import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cors from "cors"
import multer from "multer" 
import { put } from "@vercel/blob"
import { registerCustomer, registerCOO, loginUser } from "./controller/userController.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

const upload = multer({ storage: multer.memoryStorage() })

// Middleware
app.use(cors()) 
app.use(express.json({ limit: "50mb" })) 
app.use(express.urlencoded({ limit: "50mb", extended: true }))

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err))

// Routes
app.post("/api/users/register/customer", registerCustomer)
app.post("/api/users/register/coo", registerCOO)
app.post("/api/users/login", loginUser)

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
    res.status(500).json({ message: "File already exists. Please upload a different file or rename it.", error: error.message })
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