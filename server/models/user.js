import mongoose from "mongoose"
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema(
  {
    // Common fields for both customer and coo
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      sparse: true,
    },
    password: {
      type: String,
      minlength: [6, "Password must be at least 6 characters long"],
    },
    accountType: {
      type: String,
      enum: ["customer", "coo", "provider", "admin"],
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
      type: String,
    },
    coverPhoto: {
      type: String,
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
    // New fields for OTP/Magic Link
    otp: {
      type: String,
      default: null,
    },
    otpExpires: {
      type: Date,
      default: null,
    },

    // Customer-specific fields
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    middleName: {
      type: String,
      trim: true,
    },
    mobileNumber: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other", "prefer-not-to-say"],
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [500, "Bio cannot be more than 500 characters"],
    },
    idDocuments: {
      front: { type: String },
      back: { type: String },
    },
    location: {
      type: new mongoose.Schema({
        name: { type: String },
        lat: { type: Number },
        lng: { type: Number },
        distance: { type: Number },
        zipCode: { type: String },
      }),
    },

    // coo-specific fields
    businessName: {
      type: String,
      trim: true,
    },
    foundedDate: {
      type: Date,
    },
    teamSize: {
      type: String,
      enum: ["1-5", "6-10", "11-25", "26-50", "51-100", "101-500", "500+"],
    },
    companyNumber: {
      type: String,
      trim: true,
    },
    tinNumber: {
      type: String,
      trim: true,
      match: [/^\d{3}-\d{3}-\d{3}$/, "TIN number must be in XXX-XXX-XXX format"],
    },
    cityCoverage: {
      type: [String],
    },
    aboutCompany: {
      type: String,
      trim: true,
      maxlength: [1000, "About company cannot be more than 1000 characters"],
    },
    secRegistration: { type: String },
    businessPermit: { type: String },
    birRegistration: { type: String },
    eccCertificate: { type: String },
    generalLiability: { type: String },
    workersComp: { type: String },
    professionalIndemnity: { type: String },
    propertyDamage: { type: String },
    businessInterruption: { type: String },
    bondingInsurance: { type: String },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }, // Enable virtuals
)

// Virtual property for username
userSchema.virtual("username").get(function () {
  let fullName = this.firstName || "" // Initialize fullName with firstName or empty string

  if (this.middleName) {
    fullName += ` ${this.middleName}`
  }
  if (this.lastName) {
    fullName += ` ${this.lastName}`
  }
  return fullName.trim()
})

// Hash password before saving the user
userSchema.pre("save", async function (next) {
  if (this.isModified("password") && this.password) {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
  }
  // Add hashing for secretAnswer
  if (this.isModified("secretAnswer") && this.secretAnswer && this.secretAnswer !== "not provided") {
    const salt = await bcrypt.genSalt(10)
    this.secretAnswer = await bcrypt.hash(this.secretAnswer, salt)
  }
  // Add hashing for secretCode
  if (this.isModified("secretCode") && this.secretCode && this.secretCode !== "not provided") {
    const salt = await bcrypt.genSalt(10)
    this.secretCode = await bcrypt.hash(this.secretCode, salt)
  }
  next()
})

const User = mongoose.model("User", userSchema)

export { User }