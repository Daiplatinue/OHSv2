import mongoose from "mongoose"

const BookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
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
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
      enum: ["pending", "active", "ongoing", "cancelled", "completed"],
      default: "pending",
    },
    autoCancelDate: {
      type: Date,
      required: false,
    },
    providerAccepted: {
      type: Boolean,
      default: false,
    },
    // UPDATED: Array to store assigned workers with their IDs
    assignedWorkers: [
      {
        workerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to User model
        name: { type: String, required: true },
        assignedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
)

const Booking = mongoose.model("Booking", BookingSchema)

export { Booking }