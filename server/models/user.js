import mongoose from "mongoose"
import crypto from "crypto"

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  middleName: {
    type: String,
    default: "",
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  contact: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
  },
  bio: {
    type: String,
    default: "",
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
    default: "",
  },
  status: {
    type: String,
    default: "pending",
  },
  verification: {
    type: String,
    default: "unverified",
  },

  // Business specific fields
  businessName: {
    type: String,
    default: "",
  },
  businessEmail: {
    type: String,
    default: "",
  },
  foundedDate: {
    type: String,
    default: "",
  },
  companyNumber: {
    type: String,
    default: "",
  },
  teamSize: {
    type: String,
    default: "",
  },
  aboutCompany: {
    type: String,
    default: "",
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

  createdAt: {
    type: Date,
    default: Date.now,
  },
})

userSchema.methods.hashPassword = (password) => {
  const md5Hash = crypto.createHash("md5").update(password).digest("hex")
  const sha256Hash = crypto.createHash("sha256").update(md5Hash).digest("hex")
  const sha512Hash = crypto.createHash("sha512").update(sha256Hash).digest("hex")
  return sha512Hash
}

userSchema.methods.verifyPassword = function (password) {
  const hashedInput = this.hashPassword(password)
  return this.password === hashedInput
}

const User = mongoose.model("User", userSchema)

export { User }