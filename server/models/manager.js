import mongoose from "mongoose"
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    middleName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/.+@.+\..+/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    mobileNumber: {
      type: String,
      required: [true, "Mobile number is required"],
      trim: true,
    },
    gender: {
      type: String,
      required: [true, "Gender is required"],
      enum: ["male", "female", "other", "prefer-not-to-say"],
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [500, "Bio cannot be more than 500 characters"],
    },
    accountType: {
      type: String,
      required: [true, "Account type is required"],
      enum: ["customer", "manager"],
    },
    status: {
      type: String,
      enum: ["pending", "active", "inactive", "suspended"],
      default: "pending",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    idDocuments: {
      front: { type: String }, // URL or base64 string for demo
      back: { type: String }, // URL or base64 string for demo
    },
    location: {
      name: { type: String },
      lat: { type: Number },
      lng: { type: Number },
      distance: { type: Number },
      zipCode: { type: String },
    },
    profilePicture: {
      type: String, // URL or base64 string for demo
    },
    coverPhoto: {
      type: String, // URL or base64 string for demo
    },
    secretQuestion: {
      type: String,
    },
    secretAnswer: {
      type: String,
    },
    secretCode: {
      type: String,
    },
  },
  { timestamps: true },
)

// Hash password before saving the user
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

const User = mongoose.model("User", userSchema)

export { User }