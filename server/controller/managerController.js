import { User } from "../models/user.js"

const registerCustomer = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      middleName,
      email,
      password,
      mobileNumber,
      gender,
      bio,
      accountType,
      minimalMode,
      idDocuments,
      location,
      profilePicture,
      coverPhoto,
      secretQuestion,
      secretAnswer,
      secretCode,
    } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists." })
    }

    // Basic validation for required fields
    if (!firstName || !lastName || !email || !password || !mobileNumber || !gender || !accountType) {
      return res.status(400).json({ message: "Please fill all required fields." })
    }

    let newUserFields = {
      firstName,
      lastName,
      middleName,
      email,
      password, // Password will be hashed by the pre-save hook in the model
      mobileNumber,
      gender,
      accountType,
      location, // Location is required for both minimal and full
    }

    if (!minimalMode) {
      // Add fields specific to full registration
      if (
        !idDocuments ||
        !idDocuments.front ||
        !idDocuments.back ||
        !profilePicture ||
        !secretQuestion ||
        !secretAnswer ||
        !secretCode
      ) {
        return res.status(400).json({ message: "Please fill all required fields for full registration." })
      }
      newUserFields = {
        ...newUserFields,
        bio,
        idDocuments,
        profilePicture,
        coverPhoto,
        secretQuestion,
        secretAnswer,
        secretCode,
        isVerified: false, // Will be set to true after admin review
      }
    } else {
      // For minimal mode, set isVerified to false and status to pending
      newUserFields.isVerified = false
      newUserFields.status = "pending"
    }

    const newUser = new User(newUserFields)
    await newUser.save()

    res.status(201).json({ message: "Customer registered successfully!", user: newUser })
  } catch (error) {
    console.error("Error registering customer:", error)
    res.status(500).json({ message: "Server error during registration.", error: error.message })
  }
}

const registerManager = async (req, res) => {
  // Manager registration logic would go here
  res.status(501).json({ message: "Manager registration not yet implemented." })
}

export { registerCustomer, registerManager }