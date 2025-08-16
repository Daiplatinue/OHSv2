import { User } from "../models/user.js"
import bcrypt from "bcryptjs"
import nodemailer from "nodemailer"
import jwt from "jsonwebtoken"

// Helper function for password validation
const validatePassword = (password) => {
  if (!password || password.length < 6) {
    return "Password must be at least 6 characters long."
  }
  return null
}

const getOptionalValue = (value) => {
  return value === null || value === undefined || value === "" ? "not provided" : value
}

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail", // You can use other services or SMTP
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.APP_PASSWORD, // Your generated App Password
  },
})

console.log(process.env.EMAIL_USER)
console.log(process.env.APP_PASSWORD)

// Function to generate a 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Send OTP via email (for existing users, e.g., login/password reset)
export const sendOtpEmail = async (req, res) => {
  const { email } = req.body

  if (!email) {
    return res.status(400).json({ message: "Email is required." })
  }

  try {
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(404).json({ message: "Email not registered. Please create an account first." })
    }

    const otp = generateOTP()
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000) // OTP valid for 10 minutes

    user.otp = otp
    user.otpExpires = otpExpires
    await user.save()

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your HandyGo Magic Link / OTP",
      html: `
    <h2>Your One-Time Password (OTP)</h2>
    <p>Please use the following code to complete your login/verification:</p>
    <h1 style="font-size: 24px; font-weight: bold; color: #007bff;">${otp}</h1>
    <p>This code is valid for 10 minutes.</p>
    <p>If you did not request this, please ignore this email.</p>
  `,
    }

    await transporter.sendMail(mailOptions)
    res.status(200).json({ message: "OTP sent to your email." })
  } catch (error) {
    console.error("Error sending OTP email:", error)
    res.status(500).json({ message: "Failed to send OTP. Please try again." })
  }
}

// Verify OTP (for existing users, e.g., login/password reset)
export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required." })
  }

  try {
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(404).json({ message: "User not found." })
    }

    if (user.otp !== otp || user.otpExpires < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP." })
    }

    // OTP is valid, clear it and mark user as verified if not already
    user.otp = null
    user.otpExpires = null
    user.isVerified = true // Mark as verified upon successful OTP login
    user.status = "active" // Set status to active for magic link users
    await user.save()

    // Generate JWT for OTP verified user
    const jwtSecret = process.env.JWT_SECRET
    if (!jwtSecret) {
      console.error("JWT_SECRET is not defined in environment variables.")
      return res.status(500).json({ message: "Server configuration error: JWT secret missing." })
    }
    const token = jwt.sign({ userId: user._id, email: user.email, accountType: user.accountType }, jwtSecret, {
      expiresIn: "1h",
    })

    // If login is successful, return user data (excluding password) and the token
    const { password: _, ...userData } = user.toObject()
    res.status(200).json({ message: "OTP verified successfully! Login successful.", user: userData, token: token })
  } catch (error) {
    console.error("Error verifying OTP:", error)
    res.status(500).json({ message: "Server error during OTP verification." })
  }
}

// NEW: Send email verification code (for any email, including new ones)
export const sendEmailVerificationCode = async (req, res, emailVerificationCodes) => {
  const { email } = req.body

  if (!email) {
    return res.status(400).json({ message: "Email is required." })
  }

  try {
    const code = generateOTP() // Reuse OTP generation logic
    const expiresAt = Date.now() + 10 * 60 * 1000 // Code valid for 10 minutes

    emailVerificationCodes.set(email, { code, expiresAt }) // Store code in the map

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Email Verification Code",
      html: `
        <h2>Verify Your Email Address</h2>
        <p>Please use the following code to verify your email address:</p>
        <h1 style="font-size: 24px; font-weight: bold; color: #007bff;">${code}</h1>
        <p>This code is valid for 10 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
      `,
    }

    await transporter.sendMail(mailOptions)
    res.status(200).json({ message: "Verification code sent to your email." })
  } catch (error) {
    console.error("Error sending email verification code:", error)
    res.status(500).json({ message: "Failed to send verification code. Please try again." })
  }
}

// NEW: Verify email verification code
export const verifyEmailVerificationCode = async (req, res, emailVerificationCodes) => {
  const { email, code } = req.body
  const userId = req.userId // Get current user ID from authenticated token

  if (!email || !code || !userId) {
    return res.status(400).json({ message: "Email, code, and user ID are required." })
  }

  try {
    const stored = emailVerificationCodes.get(email)

    if (!stored || stored.code !== code || stored.expiresAt < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired verification code." })
    }

    // Code is valid, remove it from temporary storage
    emailVerificationCodes.delete(email)

    // Update the user's email in the database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { email: email },
      { new: true, runValidators: true },
    ).select("-password")

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found for email update." })
    }

    res.status(200).json({ message: "Email verified and updated successfully!", user: updatedUser })
  } catch (error) {
    console.error("Error verifying email verification code:", error)
    res.status(500).json({ message: "Server error during email verification." })
  }
}

// Unified account registration function for admin use
export const registerAccount = async (req, res) => {
  try {
    const {
      email,
      password,
      accountType,
      firstName,
      lastName,
      mobileNumber,
      gender,
      location,
      minimalMode,
      middleName,
      bio,
      secretQuestion,
      secretAnswer,
      secretCode,
      profilePicture,
      coverPhoto,
      idDocuments,
      // COO-specific fields
      businessName,
      foundedDate,
      teamSize,
      companyNumber,
      tinNumber,
      cityCoverage,
      aboutCompany,
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

    // Validate account type
    if (!accountType || !["customer", "coo", "provider", "admin"].includes(accountType)) {
      return res.status(400).json({ message: "Valid account type is required (customer, coo, provider, admin)." })
    }

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

    // Base user data common to all account types
    const userData = {
      email: email || null,
      password: password || null,
      accountType,
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

    // Add COO-specific fields if account type is COO
    if (accountType === "coo") {
      Object.assign(userData, {
        businessName: getOptionalValue(businessName),
        foundedDate: getOptionalValue(foundedDate),
        teamSize: getOptionalValue(teamSize),
        companyNumber: getOptionalValue(companyNumber),
        tinNumber: getOptionalValue(tinNumber),
        cityCoverage: cityCoverage || [],
        aboutCompany: getOptionalValue(aboutCompany),
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
      })
    }

    const newUser = new User(userData)
    await newUser.save()

    res.status(201).json({
      message: `${accountType.charAt(0).toUpperCase() + accountType.slice(1)} account created successfully!`,
      user: newUser,
    })
  } catch (error) {
    console.error("Account registration error:", error)
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message)
      return res.status(400).json({ message: messages.join(", ") })
    }
    res.status(500).json({ message: "Server error during account registration." })
  }
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
      minimalMode,
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

// Register COO
export const registerCOO = async (req, res) => {
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
      minimalMode,
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
    // For email, explicitly set to null if not provided, instead of "not provided" string.
    const COOData = {
      email: email || null, // FIX: Set email to null if not provided, instead of "not provided" string
      password: password || null,
      accountType: "coo",
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

    const newUser = new User(COOData)
    await newUser.save()

    res.status(201).json({ message: "COO registered successfully!", user: newUser })
  } catch (error) {
    console.error("COO registration error:", error)
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message)
      return res.status(400).json({ message: messages.join(", ") })
    }
    res.status(500).json({ message: "Server error during coo registration." })
  }
}

// New login function
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email) {
      return res.status(400).json({ message: "Email is required." })
    }

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(404).json({ message: "User not found." })
    }

    // If password is provided, attempt password login
    if (password) {
      if (!user.password) {
        return res.status(401).json({ message: "This account does not have a password set. Please use magic link." })
      }
      const isMatch = await bcrypt.compare(password, user.password)

      if (!isMatch) {
        return res.status(401).json({ message: "Incorrect password." })
      }
    } else {
      // If no password, it's a magic link request, but this endpoint is for login.
      // The magic link initiation should happen via sendOtpEmail.
      return res.status(400).json({ message: "Password is required for password-based login." })
    }

    // Generate JWT for password-based login
    const jwtSecret = process.env.JWT_SECRET
    if (!jwtSecret) {
      console.error("JWT_SECRET is not defined in environment variables.")
      return res.status(500).json({ message: "Server configuration error: JWT secret missing." })
    }
    const token = jwt.sign({ userId: user._id, email: user.email, accountType: user.accountType }, jwtSecret, {
      expiresIn: "1h",
    })

    // If login is successful, return user data (excluding password) and the token
    const { password: _, ...userData } = user.toObject()
    res.status(200).json({ message: "Login successful!", user: userData, token: token })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ message: "Server error during login." })
  }
}

// New: Fetch secret question and availability of secret answer/code
export const fetchSecretDetails = async (req, res) => {
  const { email } = req.body
  if (!email) {
    return res.status(400).json({ message: "Email is required." })
  }
  try {
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: "User not found." })
    }
    // Only return if they exist, not the values themselves
    const hasSecretQuestion = user.secretQuestion && user.secretQuestion !== "not provided"
    const hasSecretAnswer = user.secretAnswer && user.secretAnswer !== "not provided"
    const hasSecretCode = user.secretCode && user.secretCode !== "not provided"

    // If a secret question exists, return it. Otherwise, indicate it doesn't exist.
    const secretQuestionText = hasSecretQuestion ? user.secretQuestion : null

    res.status(200).json({
      message: "Secret details fetched successfully.",
      secretQuestion: secretQuestionText, // Send the question text if it exists
      hasSecretAnswer, // Indicate if an answer is set
      hasSecretCode, // Indicate if a code is set
    })
  } catch (error) {
    console.error("Error fetching secret details:", error)
    res.status(500).json({ message: "Server error fetching secret details." })
  }
}

// New: Verify secret answer
export const verifySecretAnswer = async (req, res) => {
  const { email, answer } = req.body
  if (!email || !answer) {
    return res.status(400).json({ message: "Email and answer are required." })
  }
  try {
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: "User not found." })
    }
    if (!user.secretAnswer || user.secretAnswer === "not provided") {
      return res.status(400).json({ message: "No secret answer set for this user." })
    }
    const isMatch = await bcrypt.compare(answer, user.secretAnswer)
    if (isMatch) {
      res.status(200).json({ success: true, message: "Secret answer verified successfully." })
    } else {
      res.status(401).json({ success: false, message: "Incorrect secret answer." })
    }
  } catch (error) {
    console.error("Error verifying secret answer:", error)
    res.status(500).json({ message: "Server error during secret answer verification." })
  }
}

// New: Verify secret code
export const verifySecretCode = async (req, res) => {
  const { email, code } = req.body
  if (!email || !code) {
    return res.status(400).json({ message: "Email and code are required." })
  }
  try {
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: "User not found." })
    }
    if (!user.secretCode || user.secretCode === "not provided") {
      return res.status(400).json({ message: "No secret code set for this user." })
    }
    const isMatch = await bcrypt.compare(code, user.secretCode)
    if (isMatch) {
      res.status(200).json({ success: true, message: "Secret code verified successfully." })
    } else {
      res.status(401).json({ success: false, message: "Incorrect secret code." })
    }
  } catch (error) {
    console.error("Error verifying secret code:", error)
    res.status(500).json({ message: "Server error during secret code verification." })
  }
}

// New: Reset password
export const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body
  if (!email || !newPassword) {
    return res.status(400).json({ message: "Email and new password are required." })
  }
  const passwordError = validatePassword(newPassword)
  if (passwordError) {
    return res.status(400).json({ message: passwordError })
  }
  try {
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: "User not found." })
    }
    // Assign the plain new password. The pre-save hook in the User model will hash it.
    user.password = newPassword
    await user.save()

    res.status(200).json({ success: true, message: "Password reset successfully." })
  } catch (error) {
    console.error("Error resetting password:", error)
    res.status(500).json({ message: "Server error during password reset." })
  }
}

// New: Get User Profile
export const getUserProfile = async (req, res) => {
  try {
    // req.userId is set by the authenticateToken middleware
    const user = await User.findById(req.userId).select("-password") // Exclude password

    if (!user) {
      return res.status(404).json({ message: "User profile not found." })
    }

    res.status(200).json({ user })
  } catch (error) {
    console.error("Error fetching user profile:", error)
    res.status(500).json({ message: "Server error fetching user profile." })
  }
}

// New: Update User Profile Image (profilePicture or coverPhoto)
export const updateUserImage = async (req, res) => {
  try {
    const { imageType, imageUrl } = req.body
    const userId = req.userId // From authenticateToken middleware

    if (!userId || !imageType || !imageUrl) {
      return res.status(400).json({ message: "User ID, image type, and image URL are required." })
    }

    const updateField = {}
    if (imageType === "profilePicture") {
      updateField.profilePicture = imageUrl
    } else if (imageType === "coverPhoto") {
      updateField.coverPhoto = imageUrl
    } else {
      return res
        .status(400)
        .json({ message: "Invalid image type specified. Must be 'profilePicture' or 'coverPhoto'." })
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateField },
      { new: true, runValidators: true }, // Return the updated document and run schema validators
    ).select("-password") // Exclude password from the returned user object

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." })
    }

    res.status(200).json({ message: `${imageType} updated successfully!`, user: updatedUser })
  } catch (error) {
    console.error(`Error updating user ${req.body?.imageType || "image"}:`, error)
    res.status(500).json({ message: "Failed to update image.", error: error.message })
  }
}

// New: Update User Profile Details
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.userId // From authenticateToken middleware
    const updates = req.body

    if (!userId) {
      return res.status(400).json({ message: "User ID is required." })
    }

    const currentUser = await User.findById(userId)
    if (!currentUser) {
      return res.status(404).json({ message: "Current user not found." })
    }

    // Check if email is being changed and if the new email is already in use
    if (updates.email && updates.email !== currentUser.email) {
      const existingUserWithNewEmail = await User.findOne({ email: updates.email })

      // If an existing user is found AND that user is NOT the current user
      if (existingUserWithNewEmail && existingUserWithNewEmail._id.toString() !== userId) {
        return res.status(409).json({ message: "Email already in use. Please choose another one." })
      }
    }

    // Construct update object, handling nested fields like location
    const updateFields = {}
    for (const key in updates) {
      if (updates.hasOwnProperty(key)) {
        if (key === "location" && typeof updates[key] === "object" && updates[key] !== null) {
          // If location is provided as an object, replace the entire location subdocument
          updateFields[key] = updates[key]
        } else {
          // For other fields, or if location is not an object (e.g., null or undefined),
          // directly assign the value.
          updateFields[key] = updates[key]
        }
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true, runValidators: true }, // Return the updated document and run schema validators
    ).select("-password") // Exclude password from the returned user object

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found after update attempt." })
    }

    res.status(200).json({ message: "User profile updated successfully!", user: updatedUser })
  } catch (error) {
    console.error("Error updating user profile:", error)
    // Handle MongoDB duplicate key error specifically for email if it somehow bypasses the check above
    if (error.code === 11000 && error.message.includes("email")) {
      return res.status(409).json({ message: "A user with this email already exists." })
    }
    res.status(500).json({ message: "Failed to update user profile.", error: error.message })
  }
}

// NEW: Check Email Availability
export const checkEmailAvailability = async (req, res) => {
  const { email } = req.body
  const userId = req.userId // Get current user ID from authenticated token

  if (!email) {
    return res.status(400).json({ message: "Email is required." })
  }

  try {
    // Find a user with the given email, but exclude the current user
    const existingUser = await User.findOne({ email, _id: { $ne: userId } })

    if (existingUser) {
      return res.status(200).json({ available: false, message: "This email is already in use by another account." })
    } else {
      return res.status(200).json({ available: true, message: "Email is available." })
    }
  } catch (error) {
    console.error("Error checking email availability:", error)
    res.status(500).json({ message: "Server error checking email availability." })
  }
}

export const registerProviderAdmin = async (req, res) => {
  try {
    const { accountType } = req.body

    // Only allow provider and admin account types for this endpoint
    if (!accountType || !["provider", "admin"].includes(accountType)) {
      return res.status(400).json({ message: "This endpoint only supports provider and admin account types." })
    }

    // Check if the requesting user has appropriate permissions
    const requestingUser = await User.findById(req.userId)
    if (!requestingUser) {
      return res.status(404).json({ message: "Requesting user not found." })
    }

    // Allow admin and COO account types to create provider/admin accounts
    if (requestingUser.accountType !== "admin" && requestingUser.accountType !== "coo") {
      return res
        .status(403)
        .json({ message: "Access denied. Only admin or COO users can create provider/admin accounts." })
    }

    // Use the existing registerAccount logic
    return await registerAccount(req, res)
  } catch (error) {
    console.error("Provider/Admin registration error:", error)
    res.status(500).json({ message: "Server error during provider/admin registration." })
  }
}

export const getAllUsers = async (req, res) => {
  try {
    // Fetch all users with pagination support
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 100
    const skip = (page - 1) * limit

    // Build filter based on query parameters
    const filter = {}

    if (req.userId) {
      filter._id = { $ne: req.userId }
    }

    if (req.query.accountType) {
      filter.accountType = req.query.accountType
    }
    if (req.query.status) {
      filter.status = req.query.status
    }

    const users = await User.find(filter)
      .select("-password -otp -otpExpires -secretAnswer -secretCode -secretQuestion")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const totalUsers = await User.countDocuments(filter)
    const totalPages = Math.ceil(totalUsers / limit)

    res.status(200).json({
      users,
      success: true,
      pagination: {
        currentPage: page,
        totalPages,
        totalUsers,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    })
  } catch (error) {
    console.error("Error fetching users:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}

export const deleteUserAccount = async (req, res) => {
  try {
    const { id } = req.params
    const adminId = req.userId // From authenticateToken middleware

    console.log("[v0] Delete request for user ID:", id)
    console.log("[v0] Admin ID:", adminId)

    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format.",
      })
    }

    // Check if the requesting user is an admin
    const admin = await User.findById(adminId)
    if (!admin || (admin.accountType !== "admin" && admin.accountType !== "coo")) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required.",
      })
    }

    // Find and delete the user
    const userToDelete = await User.findById(id)
    if (!userToDelete) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      })
    }

    // Prevent admin from deleting themselves
    if (userToDelete._id.toString() === adminId) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete your own account.",
      })
    }

    await User.findByIdAndDelete(id)

    console.log("[v0] User deleted successfully:", id)

    res.status(200).json({
      success: true,
      message: "User account deleted successfully.",
    })
  } catch (error) {
    console.error("[v0] Error deleting user account:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error while deleting account.",
    })
  }
}
