import { User } from "../models/user.js"
import bcrypt from "bcryptjs"
import nodemailer from "nodemailer"
import jwt from "jsonwebtoken" // Import jsonwebtoken

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

// Send OTP via email
export const sendOtpEmail = async (req, res) => {
  const { email } = req.body

  if (!email) {
    return res.status(400).json({ message: "Email is required." })
  }

  try {
    const user = await User.findOne({ email })

    if (!user) {
      // If user doesn't exist, do NOT create a new one.
      // Instead, inform the user that the email is not registered.
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

// Verify OTP
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

// Register coo
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
    // For email, explicitly set to null if not provided, to avoid unique key error.
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