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
    serviceImage: {
      type: String,
    },
    providerName: {
      type: String,
      required: true,
    },
    providerId: {
      type: String,
      required: true,
    },
    workerCount: {
      type: Number,
      default: 1,
    },
    bookingDate: {
      type: String,
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
      type: String,
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
      enum: ["pending", "active", "ongoing", "cancelled", "completed"], // Updated enum
      default: "pending",
    },
    autoCancelDate: {
      type: Date,
      required: false,
    },
    providerAccepted: {
      // NEW: Add providerAccepted boolean
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
)

const Booking = mongoose.model("Booking", BookingSchema)

export { Booking }