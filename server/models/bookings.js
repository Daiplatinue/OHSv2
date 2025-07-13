import mongoose from "mongoose"

const BookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the User model
      ref: "User",
      required: true,
    },
    firstname: {
      type: String,
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    providerName: {
      type: String,
      required: true,
    },
    providerId: {
      type: String, // Can be ObjectId or string depending on how provider IDs are stored
      required: true,
    },
    workerCount: {
      type: Number,
      default: 1,
    },
    bookingDate: {
      type: String, // Storing as string for simplicity, can be Date
      required: true,
    },
    bookingTime: {
      type: String,
      required: true,
    },
    location: {
      name: { type: String, required: true },
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
      distance: { type: Number, required: true },
    },
    estimatedTime: {
      type: String, // e.g., "30 min"
    },
    pricing: {
      baseRate: { type: Number, required: true },
      distanceCharge: { type: Number, required: true },
      totalRate: { type: Number, required: true },
    },
    specialRequests: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }, // Adds createdAt and updatedAt fields
)

const Booking = mongoose.model("Booking", BookingSchema)

export { Booking }