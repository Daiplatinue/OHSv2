import mongoose from "mongoose"

const messageSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    text: {
      type: String,
      required: true,
    },
    sender_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sender: {
      type: String, // Store sender's username for display
      required: true,
    },
    room: {
      type: String, // e.g., "private"
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    isPrivate: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }, // Adds createdAt and updatedAt fields automatically
)

const Message = mongoose.model("Message", messageSchema)

export { Message }