import { User } from "../models/user.js"
import { Notification } from "../models/notification.js"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import jwt from "jsonwebtoken"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Helper function to create welcome notification using the model's static method
const createWelcomeNotification = async (userId, userType, firstname) => {
  try {
    console.log(`Creating welcome notification for user ${userId} (${userType})`)

    // Use the static method from the Notification model
    const notification = await Notification.createWelcomeNotification(userId, userType, firstname)

    console.log("Welcome notification created successfully:", notification._id)
    return notification
  } catch (error) {
    console.error("Error creating welcome notification (non-critical):", error)
    // Don't throw error - notification creation failure shouldn't break registration
    return null
  }
}

// Helper function to create registration notification
const createRegistrationNotification = async (userId, userType, firstname, status) => {
  try {
    console.log(`Creating registration notification for user ${userId} (${userType})`)

    // Use the static method from the Notification model
    const notification = await Notification.createRegistrationNotification(userId, userType, firstname, status)

    console.log("Registration notification created successfully:", notification._id)
    return notification
  } catch (error) {
    console.error("Error creating registration notification (non-critical):", error)
    // Don't throw error - notification creation failure shouldn't break registration
    return null
  }
}

// Enhanced JWT token generation
const generateTokens = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
    type: user.type,
    firstname: user.firstname,
    lastname: user.lastname,
    status: user.status,
    verification: user.verification,
  }

  const accessToken = jwt.sign(payload, process.env.JWT_KEY, {
    expiresIn: "7d", // Keep it simple for now
    issuer: "your-app-name",
    audience: "your-app-users",
  })

  const refreshToken = jwt.sign({ id: user._id, type: "refresh" }, process.env.JWT_REFRESH_KEY || process.env.JWT_KEY, {
    expiresIn: "30d", // Longer refresh token
    issuer: "your-app-name",
    audience: "your-app-users",
  })

  return { accessToken, refreshToken }
}

// Helper function to save uploaded files
const saveFile = async (file, userId, fileType) => {
  if (!file) return null

  try {
    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(__dirname, "../../uploads")
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true })
    }

    // Create user directory if it doesn't exist
    const userDir = path.join(uploadsDir, userId)
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true })
    }

    // Process base64 data
    const matches = file.match(/^data:([A-Za-z-+/]+);base64,(.+)$/)
    if (!matches || matches.length !== 3) {
      console.log("Invalid file format for", fileType)
      return null
    }

    const fileExtension = matches[1].split("/")[1]
    const base64Data = matches[2]
    const fileName = `${fileType}.${fileExtension}`
    const filePath = path.join(userDir, fileName)

    // Save file
    await fs.promises.writeFile(filePath, base64Data, { encoding: "base64" })

    // Return relative path
    return `/uploads/${userId}/${fileName}`
  } catch (error) {
    console.error(`Error saving file ${fileType}:`, error)
    return null
  }
}

// Get current user profile
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id

    // Find user by ID
    const user = await User.findById(userId).select("-password -refreshTokens")

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    return res.status(200).json(user)
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id

    // Get the user
    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Update fields if provided in the request body
    const { firstname, lastname, middleName, email, contact, gender, bio, location } = req.body

    // Create update object with only provided fields
    const updateData = {}

    if (firstname) updateData.firstname = firstname
    if (lastname) updateData.lastname = lastname
    if (middleName) updateData.middleName = middleName
    if (email) updateData.email = email
    if (contact) updateData.contact = contact
    if (gender) updateData.gender = gender
    if (bio) updateData.bio = bio
    if (location) updateData.location = location

    // Handle file uploads
    if (req.files) {
      // Handle profile picture
      if (req.files.profilePicture && req.files.profilePicture[0]) {
        const profilePicturePath = `/uploads/${userId}/${req.files.profilePicture[0].filename}`
        updateData.profilePicture = profilePicturePath
      }

      // Handle cover photo
      if (req.files.coverPhoto && req.files.coverPhoto[0]) {
        const coverPhotoPath = `/uploads/${userId}/${req.files.coverPhoto[0].filename}`
        updateData.coverPhoto = coverPhotoPath
      }
    }

    // Update the user
    const updatedUser = await User.findByIdAndUpdate(userId, { $set: updateData }, { new: true }).select(
      "-password -refreshTokens",
    )

    return res.status(200).json(updatedUser)
  } catch (error) {
    console.error("Error updating user profile:", error)
    return res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Register a customer (simplified registration)
const registerCustomer = async (req, res) => {
  try {
    console.log("Customer registration request received")
    console.log("Request body keys:", Object.keys(req.body))

    const {
      firstname,
      lastname,
      middleName,
      email,
      contact,
      password,
      gender,
      bio,
      frontId,
      backId,
      profilePicture,
      coverPhoto,
      location,
    } = req.body

    // Enhanced validation with detailed error messages
    const errors = []

    if (!firstname || firstname.trim() === "") {
      errors.push("First name is required")
    }
    if (!lastname || lastname.trim() === "") {
      errors.push("Last name is required")
    }
    if (!email || email.trim() === "") {
      errors.push("Email is required")
    }
    if (!contact || contact.trim() === "") {
      errors.push("Contact number is required")
    }
    if (!password || password.trim() === "") {
      errors.push("Password is required")
    }

    if (errors.length > 0) {
      console.log("Validation errors:", errors)
      return res.status(400).json({
        message: "Validation failed",
        errors: errors,
        details: "Please fill all required fields",
      })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      console.log("Invalid email format:", email)
      return res.status(400).json({
        message: "Please provide a valid email address",
        field: "email",
      })
    }

    // Validate password strength
    if (password.length < 6) {
      console.log("Password too short")
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
        field: "password",
      })
    }

    // Check if user already exists
    const exist = await User.findOne({ email: email.trim().toLowerCase() })
    if (exist) {
      console.log("Email already exists:", email)
      return res.status(400).json({
        message: "An account with this email already exists",
        field: "email",
      })
    }

    // Prepare location data with safe defaults
    const locationData = {
      name: location?.name || "",
      lat: location?.lat || 0,
      lng: location?.lng || 0,
      distance: location?.distance || 0,
      zipCode: location?.zipCode || "",
    }

    // Create new user instance
    const user = new User({
      firstname: firstname.trim(),
      lastname: lastname.trim(),
      middleName: middleName?.trim() || "",
      email: email.trim().toLowerCase(),
      contact: contact.trim(),
      password: "", // Will be set below
      gender: gender?.trim() || "",
      bio: bio?.trim() || "",
      location: locationData,
      type: "customer", // Always set type to customer
      status: "active", // Customers are active by default
      verification: "unverified", // Set verification status to unverified by default
      // Initialize optional fields
      profilePicture: "",
      coverPhoto: "",
      frontId: "",
      backId: "",
    })

    // Hash the password using the custom method
    user.password = user.hashPassword(password)

    // Save the user
    console.log("Saving customer to database")
    const newUser = await user.save()
    console.log("Customer saved successfully with ID:", newUser._id)

    // Generate JWT tokens
    const { accessToken, refreshToken } = generateTokens(newUser)

    // Add refresh token to user (only if the method exists)
    try {
      if (typeof newUser.addRefreshToken === "function") {
        await newUser.addRefreshToken(refreshToken)
      }
    } catch (refreshError) {
      console.log("Refresh token storage failed (non-critical):", refreshError.message)
    }

    // Create welcome notification using the enhanced method
    const welcomeNotification = await createWelcomeNotification(newUser._id.toString(), "customer", firstname.trim())

    // Create registration notification
    const registrationNotification = await createRegistrationNotification(
      newUser._id.toString(),
      "customer",
      firstname.trim(),
      "active",
    )

    // Process files if user creation was successful
    if (newUser && newUser._id) {
      const userId = newUser._id.toString()
      console.log("Processing files for customer:", userId)

      // Process each file if provided
      const filesToProcess = [
        { data: frontId, type: "frontId" },
        { data: backId, type: "backId" },
        { data: profilePicture, type: "profilePicture" },
        { data: coverPhoto, type: "coverPhoto" },
      ]

      const fileUpdates = {}

      for (const fileObj of filesToProcess) {
        if (fileObj.data) {
          console.log(`Processing ${fileObj.type}`)
          try {
            const filePath = await saveFile(fileObj.data, userId, fileObj.type)
            if (filePath) {
              fileUpdates[fileObj.type] = filePath
            }
          } catch (fileError) {
            console.error(`Error processing file ${fileObj.type}:`, fileError)
            // Continue with other files
          }
        }
      }

      // Update user with file paths if any were processed
      if (Object.keys(fileUpdates).length > 0) {
        console.log("Updating customer with file paths:", Object.keys(fileUpdates))
        try {
          await User.findByIdAndUpdate(userId, fileUpdates)
        } catch (updateError) {
          console.error("Error updating user with file paths:", updateError)
          // Continue anyway
        }
      }

      // Return user without sensitive data
      const userResponse = {
        _id: newUser._id,
        firstname: newUser.firstname,
        lastname: newUser.lastname,
        middleName: newUser.middleName,
        email: newUser.email,
        contact: newUser.contact,
        gender: newUser.gender,
        bio: newUser.bio,
        location: newUser.location,
        type: newUser.type,
        status: newUser.status,
        verification: newUser.verification,
        profilePicture: newUser.profilePicture,
        coverPhoto: newUser.coverPhoto,
        createdAt: newUser.createdAt,
      }

      return res.status(201).json({
        success: true,
        user: userResponse,
        token: accessToken, // For backward compatibility
        accessToken,
        refreshToken,
        message: "Customer registered successfully",
        notifications: {
          welcome: welcomeNotification ? welcomeNotification._id : null,
          registration: registrationNotification ? registrationNotification._id : null,
        },
      })
    }
  } catch (error) {
    console.error("Customer registration error:", error)

    // Handle specific MongoDB errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0]
      return res.status(400).json({
        message: `${field} already exists`,
        field: field,
      })
    }

    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map((err) => err.message)
      return res.status(400).json({
        message: "Validation failed",
        errors: validationErrors,
      })
    }

    return res.status(500).json({
      message: "Registration server error",
      error: error.message,
    })
  }
}

// Register a manager (business registration) - keeping existing logic but adding notifications
const registerManager = async (req, res) => {
  try {
    console.log("Manager registration request received")
    console.log("Request body keys:", Object.keys(req.body))

    const {
      // Basic user information
      firstname,
      lastname,
      middleName,
      email,
      contact,
      password,
      gender,
      bio,
      frontId,
      backId,
      profilePicture,
      coverPhoto,
      location,

      // Business specific fields
      businessName,
      businessEmail,
      foundedDate,
      companyNumber,
      teamSize,
      aboutCompany,
      operatingHours,

      // Location information
      tinNumber,
      cityCoverage,

      // Business permits and registrations
      secRegistrationPreview,
      businessPermitPreview,
      birRegistrationPreview,
      eccCertificatePreview,

      // Insurance information
      generalLiability,
      propertyDamage,
      workersComp,
      businessInterruption,
      professionalIndemnity,
      bondingInsurance,
    } = req.body

    // Enhanced validation
    const errors = []

    if (!firstname || firstname.trim() === "") {
      errors.push("First name is required")
    }
    if (!lastname || lastname.trim() === "") {
      errors.push("Last name is required")
    }
    if (!email || email.trim() === "") {
      errors.push("Email is required")
    }
    if (!contact || contact.trim() === "") {
      errors.push("Contact number is required")
    }
    if (!password || password.trim() === "") {
      errors.push("Password is required")
    }

    if (errors.length > 0) {
      console.log("Manager validation errors:", errors)
      return res.status(400).json({
        message: "Validation failed",
        errors: errors,
      })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        message: "Please provide a valid email address",
        field: "email",
      })
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
        field: "password",
      })
    }

    // Check if user already exists
    const exist = await User.findOne({ email: email.trim().toLowerCase() })
    if (exist) {
      console.log("Email already exists:", email)
      return res.status(400).json({
        message: "An account with this email already exists",
        field: "email",
      })
    }

    // Prepare location data with safe defaults
    const locationData = location
      ? {
          name: location.name || "",
          lat: location.lat || 0,
          lng: location.lng || 0,
          distance: location.distance || 0,
          zipCode: location.zipCode || "",
        }
      : {
          name: "",
          lat: 0,
          lng: 0,
          distance: 0,
          zipCode: "",
        }

    // Create new user instance with safe defaults for all fields
    const user = new User({
      firstname: firstname.trim(),
      lastname: lastname.trim(),
      middleName: middleName?.trim() || "",
      email: email.trim().toLowerCase(),
      contact: contact.trim(),
      password: "", // Will be set below
      gender: gender?.trim() || "",
      bio: bio?.trim() || "",
      location: locationData,

      // Set type to manager
      type: "manager",
      status: "pending", // Managers need approval
      verification: "unverified",

      // Business specific fields with safe defaults
      businessName: businessName?.trim() || "",
      businessEmail: businessEmail?.trim() || email.trim().toLowerCase(),
      foundedDate: foundedDate?.trim() || "",
      companyNumber: companyNumber?.trim() || contact.trim(),
      teamSize: teamSize?.trim() || "",
      aboutCompany: aboutCompany?.trim() || bio?.trim() || "",
      operatingHours: operatingHours || [],

      // Location information
      tinNumber: tinNumber?.trim() || "",
      cityCoverage: cityCoverage || [],

      // Initialize document fields
      secRegistration: "",
      businessPermit: "",
      birRegistration: "",
      eccCertificate: "",

      // Insurance information - initialize with empty objects
      generalLiability: { document: "" },
      propertyDamage: { document: "" },
      workersCompensation: { document: "" },
      businessInterruption: { document: "" },
      professionalIndemnity: { document: "" },
      bondingInsurance: { document: "" },
    })

    // Hash the password using the custom method
    user.password = user.hashPassword(password)

    // Save the user
    console.log("Saving manager to database")
    const newUser = await user.save()
    console.log("Manager saved successfully with ID:", newUser._id)

    // Generate JWT tokens
    const { accessToken, refreshToken } = generateTokens(newUser)

    // Add refresh token to user (only if the method exists)
    try {
      if (typeof newUser.addRefreshToken === "function") {
        await newUser.addRefreshToken(refreshToken)
      }
    } catch (refreshError) {
      console.log("Refresh token storage failed (non-critical):", refreshError.message)
    }

    // Create welcome notification using the enhanced method
    const welcomeNotification = await createWelcomeNotification(newUser._id.toString(), "manager", firstname.trim())

    // Create registration notification
    const registrationNotification = await createRegistrationNotification(
      newUser._id.toString(),
      "manager",
      firstname.trim(),
      "pending",
    )

    // Process files (similar to customer but with more file types)
    if (newUser && newUser._id) {
      const userId = newUser._id.toString()
      console.log("Processing files for manager:", userId)

      // Process each file if provided
      const filesToProcess = [
        // Personal ID documents
        { data: frontId, type: "frontId" },
        { data: backId, type: "backId" },
        { data: profilePicture, type: "profilePicture" },
        { data: coverPhoto, type: "coverPhoto" },

        // Business permits and registrations
        { data: secRegistrationPreview, type: "secRegistration" },
        { data: businessPermitPreview, type: "businessPermit" },
        { data: birRegistrationPreview, type: "birRegistration" },
        { data: eccCertificatePreview, type: "eccCertificate" },

        // Insurance documents
        { data: generalLiability?.preview, type: "generalLiabilityDoc" },
        { data: propertyDamage?.preview, type: "propertyDamageDoc" },
        { data: workersComp?.preview, type: "workersCompensationDoc" },
        { data: businessInterruption?.preview, type: "businessInterruptionDoc" },
        { data: professionalIndemnity?.preview, type: "professionalIndemnityDoc" },
        { data: bondingInsurance?.preview, type: "bondingInsuranceDoc" },
      ]

      const fileUpdates = {}

      for (const fileObj of filesToProcess) {
        if (fileObj.data) {
          console.log(`Processing ${fileObj.type}`)
          try {
            const filePath = await saveFile(fileObj.data, userId, fileObj.type)
            if (filePath) {
              // For insurance documents, update the nested document field
              if (fileObj.type === "generalLiabilityDoc") {
                fileUpdates["generalLiability.document"] = filePath
              } else if (fileObj.type === "propertyDamageDoc") {
                fileUpdates["propertyDamage.document"] = filePath
              } else if (fileObj.type === "workersCompensationDoc") {
                fileUpdates["workersCompensation.document"] = filePath
              } else if (fileObj.type === "businessInterruptionDoc") {
                fileUpdates["businessInterruption.document"] = filePath
              } else if (fileObj.type === "professionalIndemnityDoc") {
                fileUpdates["professionalIndemnity.document"] = filePath
              } else if (fileObj.type === "bondingInsuranceDoc") {
                fileUpdates["bondingInsurance.document"] = filePath
              } else {
                // For regular files, update directly
                fileUpdates[fileObj.type] = filePath
              }
            }
          } catch (fileError) {
            console.error(`Error processing file ${fileObj.type}:`, fileError)
            // Continue with other files
          }
        }
      }

      // Update user with file paths if any were processed
      if (Object.keys(fileUpdates).length > 0) {
        console.log("Updating manager with file paths:", Object.keys(fileUpdates))
        try {
          await User.findByIdAndUpdate(userId, fileUpdates)
        } catch (updateError) {
          console.error("Error updating manager with file paths:", updateError)
          // Continue anyway
        }
      }

      // Return user without sensitive data
      const userResponse = await User.findById(userId).select("-password -refreshTokens")

      return res.status(201).json({
        success: true,
        user: userResponse,
        token: accessToken, // For backward compatibility
        accessToken,
        refreshToken,
        message: "Manager registered successfully. Account pending approval.",
        notifications: {
          welcome: welcomeNotification ? welcomeNotification._id : null,
          registration: registrationNotification ? registrationNotification._id : null,
        },
      })
    }
  } catch (error) {
    console.error("Manager registration error:", error)

    // Handle specific MongoDB errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0]
      return res.status(400).json({
        message: `${field} already exists`,
        field: field,
      })
    }

    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map((err) => err.message)
      return res.status(400).json({
        message: "Validation failed",
        errors: validationErrors,
      })
    }

    return res.status(500).json({
      message: "Registration server error",
      error: error.message,
    })
  }
}

// Legacy register function (for backward compatibility)
const registerUser = async (req, res) => {
  try {
    console.log("Legacy registration request received")

    // Determine if this is a manager or customer registration based on presence of business fields
    const isManager = !!req.body.businessName

    if (isManager) {
      return registerManager(req, res)
    } else {
      return registerCustomer(req, res)
    }
  } catch (error) {
    console.error("Registration error:", error)
    return res.status(500).json({ message: "Registration server error", error: error.message })
  }
}

// Enhanced login function
const loginUser = async (req, res) => {
  try {
    console.log("Login request received for:", req.body.email)
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: "Please fill all fields" })
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() })

    if (!user) {
      return res.status(400).json({ message: "User not found" })
    }

    // Check if account is locked (only if the method exists)
    if (user.isLocked) {
      return res.status(423).json({ message: "Account temporarily locked due to too many failed login attempts" })
    }

    // Verify password using the custom method
    if (!user.verifyPassword(password)) {
      // Increment login attempts (only if the method exists)
      if (typeof user.incLoginAttempts === "function") {
        await user.incLoginAttempts()
      }
      return res.status(400).json({ message: "Invalid password" })
    }

    // Reset login attempts on successful login (only if the method exists)
    if (typeof user.resetLoginAttempts === "function") {
      await user.resetLoginAttempts()
    }

    // Generate JWT tokens
    const { accessToken, refreshToken } = generateTokens(user)

    // Add refresh token to user (only if the method exists)
    try {
      if (typeof user.addRefreshToken === "function") {
        await user.addRefreshToken(refreshToken)
      }
    } catch (refreshError) {
      console.log("Refresh token storage failed (non-critical):", refreshError.message)
    }

    // Return user without password
    const userWithoutPassword = user.toObject()
    delete userWithoutPassword.password
    delete userWithoutPassword.refreshTokens

    // If user is a customer, update status to pending
    if (user.type === "customer" && user.status === "active") {
      await User.findByIdAndUpdate(user._id, { status: "pending" })
      userWithoutPassword.status = "pending"
    }

    // Return user without password
    return res.json({
      success: true,
      user: userWithoutPassword,
      token: accessToken, // For backward compatibility
      accessToken,
      refreshToken,
      message: "Login successful",
    })
  } catch (error) {
    console.error("Login error:", error)
    return res.status(500).json({ message: "Login server error" })
  }
}

// Refresh token endpoint
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token required" })
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY || process.env.JWT_KEY)

    // Find user and check if refresh token exists
    const user = await User.findById(decoded.id)
    if (!user) {
      return res.status(403).json({ message: "Invalid refresh token" })
    }

    // Check if refresh token exists (only if the method exists)
    if (user.refreshTokens && !user.refreshTokens.some((t) => t.token === refreshToken)) {
      return res.status(403).json({ message: "Invalid refresh token" })
    }

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user)

    // Remove old refresh token and add new one (only if the methods exist)
    try {
      if (typeof user.removeRefreshToken === "function" && typeof user.addRefreshToken === "function") {
        await user.removeRefreshToken(refreshToken)
        await user.addRefreshToken(newRefreshToken)
      }
    } catch (refreshError) {
      console.log("Refresh token management failed (non-critical):", refreshError.message)
    }

    return res.json({
      accessToken,
      refreshToken: newRefreshToken,
    })
  } catch (error) {
    console.error("Refresh token error:", error)
    return res.status(403).json({ message: "Invalid refresh token" })
  }
}

// Logout endpoint
const logoutUser = async (req, res) => {
  try {
    const { refreshToken } = req.body
    const userId = req.user.id

    if (refreshToken) {
      const user = await User.findById(userId)
      if (user && typeof user.removeRefreshToken === "function") {
        await user.removeRefreshToken(refreshToken)
      }
    }

    return res.json({ message: "Logged out successfully" })
  } catch (error) {
    console.error("Logout error:", error)
    return res.status(500).json({ message: "Logout server error" })
  }
}

export {
  registerUser,
  registerCustomer,
  registerManager,
  loginUser,
  getUserProfile,
  updateUserProfile,
  refreshToken,
  logoutUser,
}