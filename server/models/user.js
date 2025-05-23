import mongoose from "mongoose"
import crypto from "crypto"
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: [true, "First name is required"],
    trim: true,
  },
  lastname: {
    type: String,
    required: [true, "Last name is required"],
    trim: true,
  },
  middleName: {
    type: String,
    default: "",
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
  },
  contact: {
    type: String,
    required: [true, "Contact number is required"],
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  gender: {
    type: String,
    default: "",
    trim: true,
  },
  bio: {
    type: String,
    default: "",
    trim: true,
  },
  // Profile images
  profilePicture: {
    type: String,
    default: "",
  },
  coverPhoto: {
    type: String,
    default: "",
  },
  // ID verification
  frontId: {
    type: String,
    default: "",
  },
  backId: {
    type: String,
    default: "",
  },
  // Location information
  location: {
    name: {
      type: String,
      default: "",
    },
    lat: {
      type: Number,
      default: 0,
    },
    lng: {
      type: Number,
      default: 0,
    },
    distance: {
      type: Number,
      default: 0,
    },
    zipCode: {
      type: String,
      default: "",
    },
  },
  // Added user type and status fields
  type: {
    type: String,
    default: "customer",
    enum: ["customer", "manager", "admin"],
  },
  status: {
    type: String,
    default: "pending",
    enum: ["pending", "active", "inactive", "suspended"],
  },
  verification: {
    type: String,
    default: "unverified",
    enum: ["unverified", "pending", "verified", "rejected"],
  },

  // Business specific fields
  businessName: {
    type: String,
    default: "",
    trim: true,
  },
  businessEmail: {
    type: String,
    default: "",
    lowercase: true,
    trim: true,
  },
  foundedDate: {
    type: String,
    default: "",
  },
  companyNumber: {
    type: String,
    default: "",
    trim: true,
  },
  teamSize: {
    type: String,
    default: "",
    trim: true,
  },
  aboutCompany: {
    type: String,
    default: "",
    trim: true,
  },
  operatingHours: [
    {
      day: String,
      open: String,
      close: String,
      closed: Boolean,
    },
  ],

  // Location information
  tinNumber: {
    type: String,
    default: "",
    trim: true,
  },
  cityCoverage: [
    {
      type: String,
    },
  ],

  // Business permits and registrations
  secRegistration: {
    type: String,
    default: "",
  },
  businessPermit: {
    type: String,
    default: "",
  },
  birRegistration: {
    type: String,
    default: "",
  },
  eccCertificate: {
    type: String,
    default: "",
  },

  // Insurance information
  generalLiability: {
    document: {
      type: String,
      default: "",
    },
  },
  propertyDamage: {
    document: {
      type: String,
      default: "",
    },
  },
  workersCompensation: {
    document: {
      type: String,
      default: "",
    },
  },
  businessInterruption: {
    document: {
      type: String,
      default: "",
    },
  },
  professionalIndemnity: {
    document: {
      type: String,
      default: "",
    },
  },
  bondingInsurance: {
    document: {
      type: String,
      default: "",
    },
  },

  // JWT token tracking (optional - for token blacklisting or session management)
  refreshTokens: [
    {
      token: String,
      createdAt: {
        type: Date,
        default: Date.now,
        expires: 2592000, // 30 days in seconds
      },
    },
  ],

  // Account security
  lastLogin: {
    type: Date,
    default: null,
  },
  loginAttempts: {
    type: Number,
    default: 0,
  },
  lockUntil: {
    type: Date,
    default: null,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Update the updatedAt field before saving
userSchema.pre("save", function (next) {
  this.updatedAt = Date.now()
  next()
})

// Enhanced password hashing method
userSchema.methods.hashPassword = (password) => {
  const md5Hash = crypto.createHash("md5").update(password).digest("hex")
  const sha256Hash = crypto.createHash("sha256").update(md5Hash).digest("hex")
  const sha512Hash = crypto.createHash("sha512").update(sha256Hash).digest("hex")
  return sha512Hash
}

// Password verification method
userSchema.methods.verifyPassword = function (password) {
  const hashedInput = this.hashPassword(password)
  return this.password === hashedInput
}

// Generate JWT token method
userSchema.methods.generateAuthToken = function () {
  const payload = {
    id: this._id,
    email: this.email,
    type: this.type,
    firstname: this.firstname,
    lastname: this.lastname,
  }

  return jwt.sign(payload, process.env.JWT_KEY, {
    expiresIn: "7d",
    issuer: "your-app-name",
    audience: "your-app-users",
  })
}

// Add refresh token method
userSchema.methods.addRefreshToken = function (token) {
  this.refreshTokens.push({ token })
  return this.save()
}

// Remove refresh token method
userSchema.methods.removeRefreshToken = function (token) {
  this.refreshTokens = this.refreshTokens.filter((t) => t.token !== token)
  return this.save()
}

// Account lockout methods
userSchema.methods.incLoginAttempts = function () {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 },
    })
  }

  const updates = { $inc: { loginAttempts: 1 } }

  // Lock account after 5 failed attempts for 2 hours
  if (this.loginAttempts + 1 >= 5 && !this.lockUntil) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 } // 2 hours
  }

  return this.updateOne(updates)
}

// Virtual for checking if account is locked
userSchema.virtual("isLocked").get(function () {
  return !!(this.lockUntil && this.lockUntil > Date.now())
})

// Reset login attempts on successful login
userSchema.methods.resetLoginAttempts = function () {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 },
    $set: { lastLogin: Date.now() },
  })
}

const User = mongoose.model("User", userSchema)

export { User }