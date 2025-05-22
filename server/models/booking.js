import mongoose from "mongoose"

const BookingSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
})

const Booking = mongoose.model("Booking", BookingSchema)

export { Booking }