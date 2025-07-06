import { User } from "../models/user.js"
import { Message } from "../models/message.js" // Import the new Message model

//Get User Profile
export const getUserProfile = async (req, res) => {
  try {
    // req.userId is set by the authenticateToken middleware
    const user = await User.findById(req.userId).select("-password")

    if (!user) {
      return res.status(404).json({ message: "User profile not found." })
    }

    res.status(200).json({ user })
  } catch (error) {
    console.error("Error fetching user profile:", error)
    res.status(500).json({ message: "Server error fetching user profile." })
  }
}

// New: Save a private message to the database
export const saveMessage = async (messageData) => {
  try {
    const newMessage = new Message(messageData)
    await newMessage.save()
    console.log("Message saved:", newMessage)
    return newMessage
  } catch (error) {
    console.error("Error saving message:", error)
    throw new Error("Failed to save message")
  }
}

// New: Get private message history between two users
export const getPrivateMessages = async (userId1, userId2) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender_id: userId1, receiver_id: userId2 },
        { sender_id: userId2, receiver_id: userId1 },
      ],
    }).sort({ timestamp: 1 }) // Sort by timestamp ascending
    return messages
  } catch (error) {
    console.error("Error fetching private messages:", error)
    throw new Error("Failed to fetch message history")
  }
}