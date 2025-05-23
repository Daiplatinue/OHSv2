import { Service } from "../models/service.js"

const newService = async (req, res) => {
  try {
    const { name, price, description, image, chargePerKm, userId } = req.body

    // Validate that we have a userId
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required to create a service",
      })
    }

    const service = new Service({
      userId,
      name,
      price,
      description,
      image,
      chargePerKm,
    })

    await service.save()

    res.status(201).json({
      success: true,
      message: "Service created successfully",
      service,
    })
  } catch (error) {
    console.error("Error creating service:", error)
    res.status(500).json({
      success: false,
      message: "Error creating service",
      error: error.message,
    })
  }
}

export { newService }
