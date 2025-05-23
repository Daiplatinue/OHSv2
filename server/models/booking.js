import mongoose from "mongoose"

const BookingSchema = new mongoose.Schema({
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
  providerName: {
    type: String,
    required: true,
  },
  providerId: {
    type: Number,
    required: true,
  },
  workerCount: {
    type: Number,
    default: 1,
  },
  bookingDate: {
    type: Date,
    required: true,
  },
  bookingTime: {
    type: String,
    required: true,
  },
  location: {
    name: {
      type: String,
      required: true,
    },
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
    distance: {
      type: Number,
      required: true,
    },
  },
  estimatedTime: {
    type: String,
    required: false,
  },
  pricing: {
    baseRate: {
      type: Number,
      required: true,
    },
    distanceCharge: {
      type: Number,
      required: true,
    },
    totalRate: {
      type: Number,
      required: true,
    },
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "ongoing", "completed", "cancelled"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const Booking = mongoose.model("Booking", BookingSchema)

export { Booking }