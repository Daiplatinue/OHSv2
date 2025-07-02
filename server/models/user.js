import mongoose from "mongoose"
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema(
  {
    // Common fields for both customer and manager
    email: {
      type: String,
      // Removed required: [true, "Email is required"],
      unique: true, // Still unique, but can be null if not provided
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      // Removed required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    accountType: {
      type: String,
      // Removed required: [true, "Account type is required"],
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

    // Customer-specific fields
    firstName: {
      type: String,
      // Removed required: function () { return this.accountType === "customer" },
      trim: true,
    },
    lastName: {
      type: String,
      // Removed required: function () { return this.accountType === "customer" },
      trim: true,
    },
    middleName: {
      type: String,
      trim: true,
    },
    mobileNumber: {
      type: String,
      // Removed required: function () { return this.accountType === "customer" },
      trim: true,
    },
    gender: {
      type: String,
      // Removed required: function () { return this.accountType === "customer" },
      enum: ["male", "female", "other", "prefer-not-to-say"],
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [500, "Bio cannot be more than 500 characters"],
    },
    idDocuments: {
      front: { type: String }, // URL or base64 string for demo
      back: { type: String }, // URL or base64 string for demo
    },
    location: {
      type: new mongoose.Schema({
        // Define a sub-schema for location
        name: { type: String }, // Removed required: true
        lat: { type: Number },
        lng: { type: Number },
        distance: { type: Number },
        zipCode: { type: String }, // Removed required: true
      }),
      // Removed required: function () { return this.accountType === "customer" || this.accountType === "manager" },
    },

    // Manager-specific fields
    businessName: {
      type: String,
      // Removed required: function () { return this.accountType === "manager" },
      trim: true,
    },
    foundedDate: {
      type: Date, // Changed to Date type
      // Removed required: function () { return this.accountType === "manager" },
    },
    teamSize: {
      type: String,
      // Removed required: function () { return this.accountType === "manager" },
      enum: ["1-5", "6-10", "11-25", "26-50", "51-100", "101-500", "500+"],
    },
    companyNumber: {
      type: String,
      // Removed required: function () { return this.accountType === "manager" },
      trim: true,
    },
    tinNumber: {
      type: String,
      // Removed required: function () { return this.accountType === "manager" },
      trim: true,
      match: [/^\d{3}-\d{3}-\d{3}$/, "TIN number must be in XXX-XXX-XXX format"],
    },
    cityCoverage: {
      type: [String], // Array of strings
      // Removed required: function () { return this.accountType === "manager" },
    },
    aboutCompany: {
      type: String,
      trim: true,
      maxlength: [1000, "About company cannot be more than 1000 characters"],
    },
    secRegistration: { type: String }, // Base64 string or URL
    businessPermit: { type: String }, // Base64 string or URL
    birRegistration: { type: String }, // Base64 string or URL
    eccCertificate: { type: String }, // Base64 string or URL (optional)
    generalLiability: { type: String }, // Base64 string or URL
    workersComp: { type: String }, // Base64 string or URL
    professionalIndemnity: { type: String }, // Base64 string or URL (optional)
    propertyDamage: { type: String }, // Base64 string or URL (optional)
    businessInterruption: { type: String }, // Base64 string or URL (optional)
    bondingInsurance: { type: String }, // Base64 string or URL (optional)
  },
  { timestamps: true },
)

// Hash password before saving the user
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) { // Added check for !this.password
    return next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

const User = mongoose.model("User", userSchema)

export { User }