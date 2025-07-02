import { User } from "../models/user.js"

// Helper function for password validation
const validatePassword = (password) => {
  if (!password || password.length < 6) {
    return "Password must be at least 6 characters long."
  }
  return null
}

// Helper function to handle optional fields: if null, undefined, or empty string, make it 'not provided'
// This helper will remain for other fields where 'not provided' is an acceptable placeholder.
const getOptionalValue = (value) => {
  return value === null || value === undefined || value === "" ? "not provided" : value
}

// Register Customer
export const registerCustomer = async (req, res) => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      mobileNumber,
      gender,
      location,
      minimalMode, // From frontend
      middleName,
      bio,
      secretQuestion,
      secretAnswer,
      secretCode,
      profilePicture,
      coverPhoto,
      idDocuments,
    } = req.body

    const passwordError = validatePassword(password)
    if (passwordError) {
      if (password) {
        return res.status(400).json({ message: passwordError })
      }
    }

    // Check if user already exists (only if email is provided and not empty)
    if (email) {
      const existingUser = await User.findOne({ email })
      if (existingUser) {
        return res.status(409).json({ message: "User with this email already exists." })
      }
    }

    // Set default values for optional fields.
    // For email, explicitly set to null if not provided, to avoid unique key error.
    const customerData = {
      email: email || null, // FIX: Set email to null if not provided, instead of "not provided" string
      password: password || null,
      accountType: "customer",
      firstName: getOptionalValue(firstName),
      lastName: getOptionalValue(lastName),
      mobileNumber: getOptionalValue(mobileNumber),
      gender: getOptionalValue(gender),
      secretQuestion: getOptionalValue(secretQuestion),
      secretAnswer: getOptionalValue(secretAnswer),
      secretCode: getOptionalValue(secretCode),
      location: location
        ? {
            name: getOptionalValue(location.name),
            lat: getOptionalValue(location.lat),
            lng: getOptionalValue(location.lng),
            distance: getOptionalValue(location.distance),
            zipCode: getOptionalValue(location.zipCode),
          }
        : null,
      middleName: getOptionalValue(middleName),
      bio: getOptionalValue(bio),
      profilePicture: getOptionalValue(profilePicture),
      coverPhoto: getOptionalValue(coverPhoto),
      idDocuments: idDocuments
        ? {
            front: getOptionalValue(idDocuments.front),
            back: getOptionalValue(idDocuments.back),
          }
        : null,
      status: minimalMode ? "active" : "pending",
      isVerified: minimalMode ? true : false,
    }

    const newUser = new User(customerData)
    await newUser.save()

    res.status(201).json({ message: "Customer registered successfully!", user: newUser })
  } catch (error) {
    console.error("Customer registration error:", error)
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message)
      return res.status(400).json({ message: messages.join(", ") })
    }
    res.status(500).json({ message: "Server error during customer registration." })
  }
}

// Register Manager
export const registerManager = async (req, res) => {
  try {
    const {
      email,
      password,
      businessName,
      foundedDate,
      teamSize,
      companyNumber,
      tinNumber,
      cityCoverage,
      location,
      minimalMode, // From frontend
      secretQuestion,
      secretAnswer,
      secretCode,
      aboutCompany,
      profilePicture,
      coverPhoto,
      secRegistration,
      businessPermit,
      birRegistration,
      eccCertificate,
      generalLiability,
      workersComp,
      professionalIndemnity,
      propertyDamage,
      businessInterruption,
      bondingInsurance,
    } = req.body

    const passwordError = validatePassword(password)
    if (passwordError) {
      if (password) {
        return res.status(400).json({ message: passwordError })
      }
    }

    // Check if user already exists (only if email is provided and not empty)
    if (email) {
      const existingUser = await User.findOne({ email })
      if (existingUser) {
        return res.status(409).json({ message: "User with this email already exists." })
      }
    }

    // Set default values for optional fields.
    // For email, explicitly set to null if not provided, to avoid unique key error.
    const managerData = {
      email: email || null, // FIX: Set email to null if not provided, instead of "not provided" string
      password: password || null,
      accountType: "manager",
      businessName: getOptionalValue(businessName),
      foundedDate: getOptionalValue(foundedDate),
      teamSize: getOptionalValue(teamSize),
      companyNumber: getOptionalValue(companyNumber),
      tinNumber: getOptionalValue(tinNumber),
      cityCoverage: cityCoverage || [],
      secretQuestion: getOptionalValue(secretQuestion),
      secretAnswer: getOptionalValue(secretAnswer),
      secretCode: getOptionalValue(secretCode),
      location: location
        ? {
            name: getOptionalValue(location.name),
            lat: getOptionalValue(location.lat),
            lng: getOptionalValue(location.lng),
            distance: getOptionalValue(location.distance),
            zipCode: getOptionalValue(location.zipCode),
          }
        : null,
      aboutCompany: getOptionalValue(aboutCompany),
      profilePicture: getOptionalValue(profilePicture),
      coverPhoto: getOptionalValue(coverPhoto),
      secRegistration: getOptionalValue(secRegistration),
      businessPermit: getOptionalValue(businessPermit),
      birRegistration: getOptionalValue(birRegistration),
      eccCertificate: getOptionalValue(eccCertificate),
      generalLiability: getOptionalValue(generalLiability),
      workersComp: getOptionalValue(workersComp),
      professionalIndemnity: getOptionalValue(professionalIndemnity),
      propertyDamage: getOptionalValue(propertyDamage),
      businessInterruption: getOptionalValue(businessInterruption),
      bondingInsurance: getOptionalValue(bondingInsurance),
      status: minimalMode ? "active" : "pending",
      isVerified: minimalMode ? true : false,
    }

    const newUser = new User(managerData)
    await newUser.save()

    res.status(201).json({ message: "Manager registered successfully!", user: newUser })
  } catch (error) {
    console.error("Manager registration error:", error)
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message)
      return res.status(400).json({ message: messages.join(", ") })
    }
    res.status(500).json({ message: "Server error during manager registration." })
  }
}