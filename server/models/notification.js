import mongoose from "mongoose"

const NotificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true, // Add index for faster queries
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000,
  },
  type: {
    type: String,
    enum: ["info", "success", "warning", "error", "booking", "payment", "system", "welcome", "registration"],
    default: "info",
    index: true,
  },
  status: {
    type: String,
    enum: ["read", "unread"],
    default: "unread",
    index: true,
  },
  icon: {
    type: String,
    default: "bell",
    trim: true,
  },
  link: {
    type: String,
    default: "",
    trim: true,
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high", "urgent"],
    default: "medium",
    index: true,
  },
  relatedId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
    sparse: true, // Allow multiple null values
  },
  relatedModel: {
    type: String,
    enum: ["User", "Booking", "Payment", "Service", null],
    default: null,
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    index: { expireAfterSeconds: 0 }, // MongoDB TTL index
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Compound indexes for better query performance
NotificationSchema.index({ userId: 1, status: 1, createdAt: -1 })
NotificationSchema.index({ userId: 1, type: 1, createdAt: -1 })
NotificationSchema.index({ userId: 1, priority: 1, createdAt: -1 })
NotificationSchema.index({ createdAt: -1 })

// Update the updatedAt field before saving
NotificationSchema.pre("save", function (next) {
  this.updatedAt = new Date()
  next()
})

// Static method to create a welcome notification
NotificationSchema.statics.createWelcomeNotification = async function (userId, userType, firstname) {
  try {
    const welcomeData = {
      userId: userId,
      title: "Welcome to Our Platform! 🎉",
      description:
        userType === "customer"
          ? `Hi ${firstname}! Welcome to our platform. You can now browse and book services from our verified providers. Start exploring amazing services today!`
          : `Hi ${firstname}! Welcome to our platform. Your ${userType} account has been created and is under review. We'll notify you once it's approved and you can start offering your services.`,
      type: "welcome",
      icon: userType === "customer" ? "user-check" : "building-2",
      priority: "high",
      link: userType === "customer" ? "/services" : "/dashboard",
      relatedModel: "User",
      relatedId: userId,
      metadata: {
        userType: userType,
        registrationDate: new Date(),
        isWelcomeMessage: true,
      },
    }

    const notification = new this(welcomeData)
    await notification.save()

    console.log(`Welcome notification created successfully for user ${userId}`)
    return notification
  } catch (error) {
    console.error("Error creating welcome notification:", error)
    throw error
  }
}

// Static method to create a registration notification
NotificationSchema.statics.createRegistrationNotification = async function (userId, userType, firstname, status) {
  try {
    let title, description, type, icon, priority

    if (userType === "customer") {
      title = "Account Created Successfully! ✅"
      description = `Welcome ${firstname}! Your customer account has been created successfully. You can now start booking services from our trusted providers.`
      type = "success"
      icon = "check-circle"
      priority = "high"
    } else if (userType === "manager") {
      title = "Business Account Under Review 📋"
      description = `Hello ${firstname}! Your business account has been submitted for review. Our team will verify your documents and approve your account within 24-48 hours.`
      type = "info"
      icon = "clock"
      priority = "high"
    }

    const registrationData = {
      userId: userId,
      title: title,
      description: description,
      type: type,
      icon: icon,
      priority: priority,
      link: userType === "customer" ? "/services" : "/dashboard",
      relatedModel: "User",
      relatedId: userId,
      metadata: {
        userType: userType,
        registrationDate: new Date(),
        accountStatus: status,
        isRegistrationMessage: true,
      },
    }

    const notification = new this(registrationData)
    await notification.save()

    console.log(`Registration notification created successfully for user ${userId}`)
    return notification
  } catch (error) {
    console.error("Error creating registration notification:", error)
    throw error
  }
}

// Instance method to mark as read
NotificationSchema.methods.markAsRead = async function () {
  this.status = "read"
  this.updatedAt = new Date()
  return await this.save()
}

// Instance method to mark as unread
NotificationSchema.methods.markAsUnread = async function () {
  this.status = "unread"
  this.updatedAt = new Date()
  return await this.save()
}

const Notification = mongoose.model("Notification", NotificationSchema)

export { Notification }