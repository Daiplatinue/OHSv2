import mongoose from "mongoose"

const ServiceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: "",
  },
  chargePerKm: {
    type: Number,
    required: true,
    min: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const Service = mongoose.model("Service", ServiceSchema)

export { Service }
