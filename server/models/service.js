import mongoose from "mongoose"

const ServiceSchema = new mongoose.Schema(
  {
    cooId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming 'User' is the model for COO accounts
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      default: "/placeholder.svg?height=48&width=48", // Default placeholder image
    },
    chargePerKm: {
      type: Number,
      required: true,
      min: 0,
    },
    mainCategory: {
      type: String,
      required: false,
    },
    subCategory: {
      type: String,
      required: false,
    },
    // NEW: Add fields for rating, reviews, and workers needed
    totalRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
      min: 0,
    },
    workersNeeded: {
      type: Number,
      default: 1, // Default to 1, will be set by AI
      min: 1,
    },
    estimatedTime: {
      type: String,
      default: "Varies", // Default placeholder for estimated time
    },
  },
  { timestamps: true },
)

const Service = mongoose.model("Service", ServiceSchema)

export { Service }