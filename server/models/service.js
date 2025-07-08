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
  },
  { timestamps: true },
)

const Service = mongoose.model("Service", ServiceSchema)

export { Service }