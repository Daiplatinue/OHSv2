import mongoose from "mongoose"

const NotificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["welcome_unverified", "welcome_verified", "general", "alert", "message"], // Define notification types
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    // Optional fields for context, e.g., if notification is about a specific booking or service
    relatedEntityId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    relatedEntityType: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }, // Adds createdAt and updatedAt fields automatically
)

const Notification = mongoose.model("Notification", NotificationSchema)

export { Notification }
