import { User } from "../models/user.js"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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

// Register a customer (simplified registration)
const registerCustomer = async (req, res) => {
  try {
    console.log("Customer registration request received")
    console.log("Request body:", req.body)

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

    // Basic validation
    if (!firstname || !lastname || !email || !contact || !password) {
      console.log("Missing required fields:", { firstname, lastname, email, contact, password: !!password })
      return res.status(400).json({ message: "Please fill all required fields" })
    }

    // Check if user already exists
    const exist = await User.findOne({ email })
    if (exist) {
      console.log("Email already exists:", email)
      return res.status(400).json({ message: "Email already exists" })
    }

    // Create new user instance
    const user = new User({
      firstname,
      lastname,
      middleName: middleName || "",
      email,
      contact,
      password: "", // Will be set below
      gender: gender || "",
      bio: bio || "",
      location: location || {
        name: "",
        lat: 0,
        lng: 0,
        distance: 0,
        zipCode: "",
      },
      type: "customer", // Always set type to customer
      status: "active", // Customers are active by default
      verification: "unverified", // Set verification status to unverified by default
    })

    // Hash the password using the custom method
    user.password = user.hashPassword(password)

    // Save the user
    console.log("Saving customer to database")
    const newUser = await user.save()
    console.log("Customer saved successfully with ID:", newUser._id)

    // If user creation was successful, process and save files
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
          const filePath = await saveFile(fileObj.data, userId, fileObj.type)
          if (filePath) {
            fileUpdates[fileObj.type] = filePath
          }
        }
      }

      // Update user with file paths if any were processed
      if (Object.keys(fileUpdates).length > 0) {
        console.log("Updating customer with file paths:", Object.keys(fileUpdates))
        await User.findByIdAndUpdate(userId, fileUpdates)

        // Refresh user data
        const updatedUser = await User.findById(userId).select("-password")
        return res.status(201).json(updatedUser)
      }

      // Return user without password
      const userWithoutPassword = await User.findById(userId).select("-password")
      return res.status(201).json(userWithoutPassword)
    }
  } catch (error) {
    console.error("Customer registration error:", error)
    return res.status(500).json({ message: "Registration server error", error: error.message, stack: error.stack })
  }
}

// Register a manager (business registration)
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

    // Basic validation
    if (!firstname || !lastname || !email || !contact || !password) {
      console.log("Missing required fields:", { firstname, lastname, email, contact, password: !!password })
      return res.status(400).json({ message: "Please fill all required fields" })
    }

    // Check if user already exists
    const exist = await User.findOne({ email })
    if (exist) {
      console.log("Email already exists:", email)
      return res.status(400).json({ message: "Email already exists" })
    }

    // Create new user instance with safe defaults for all fields
    const user = new User({
      firstname,
      lastname,
      middleName: middleName || "",
      email,
      contact,
      password: "", // Will be set below
      gender: gender || "",
      bio: bio || "",

      // Set location with safe defaults
      location: location
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
          },

      // Set type to manager
      type: "manager",
      status: "pending", // Managers need approval
      verification: "unverified", // Set verification status to unverified by default

      // Business specific fields with safe defaults
      businessName: businessName || "",
      businessEmail: businessEmail || email, // Default to user email if not provided
      foundedDate: foundedDate || "",
      companyNumber: companyNumber || contact, // Default to user contact if not provided
      teamSize: teamSize || "",
      aboutCompany: aboutCompany || bio || "", // Default to bio if not provided
      operatingHours: operatingHours || [],

      // Location information
      tinNumber: tinNumber || "",
      cityCoverage: cityCoverage || [],

      // Initialize document fields
      secRegistration: "",
      businessPermit: "",
      birRegistration: "",
      eccCertificate: "",

      // Insurance information - initialize with empty objects and safe defaults
      generalLiability: {
        document: "",
      },
      propertyDamage: {
        document: "",
      },
      workersCompensation: {
        document: "",
      },
      businessInterruption: {
        document: "",
      },
      professionalIndemnity: {
        document: "",
      },
      bondingInsurance: {
        document: "",
      },
    })

    // Hash the password using the custom method
    user.password = user.hashPassword(password)

    // Save the user
    console.log("Saving manager to database")
    const newUser = await user.save()
    console.log("Manager saved successfully with ID:", newUser._id)

    // If user creation was successful, process and save files
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
          } catch (error) {
            console.error(`Error processing file ${fileObj.type}:`, error)
          }
        }
      }

      // Update user with file paths if any were processed
      if (Object.keys(fileUpdates).length > 0) {
        console.log("Updating manager with file paths:", Object.keys(fileUpdates))
        await User.findByIdAndUpdate(userId, fileUpdates)

        // Refresh user data
        const updatedUser = await User.findById(userId).select("-password")
        return res.status(201).json(updatedUser)
      }

      // Return user without password
      const userWithoutPassword = await User.findById(userId).select("-password")
      return res.status(201).json(userWithoutPassword)
    }
  } catch (error) {
    console.error("Manager registration error:", error)
    return res.status(500).json({ message: "Registration server error", error: error.message, stack: error.stack })
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
    return res.status(500).json({ message: "Registration server error", error: error.message, stack: error.stack })
  }
}

const loginUser = async (req, res) => {
  try {
    console.log("Login request received for:", req.body.email)
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: "Please fill all fields" })
    }

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(400).json({ message: "User not found" })
    }

    // Verify password using the custom method
    if (!user.verifyPassword(password)) {
      return res.status(400).json({ message: "Invalid password" })
    }

    // Return user without password
    const userWithoutPassword = user.toObject()
    delete userWithoutPassword.password

    return res.json(userWithoutPassword)
  } catch (error) {
    console.error("Login error:", error)
    return res.status(500).json({ message: "Login server error" })
  }
}

export { registerUser, registerCustomer, registerManager, loginUser }