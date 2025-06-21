// This file runs on your Node.js backend server (NOT part of your Vite client bundle)

// You'll need to install dotenv: npm install dotenv
require("dotenv").config() // Loads environment variables from .env file

import express from "express" // Example with Express, install: npm install express
import bodyParser from "body-parser" // Install: npm install body-parser
import cors from "cors" // Install: npm install cors
import fetch from "node-fetch" // Install: npm install node-fetch@2
const app = express()
const PORT = process.env.PORT || 3001 // Or whatever port your backend runs on

// Middleware
app.use(cors()) // Enable CORS for your frontend
app.use(bodyParser.json()) // Parse JSON request bodies

interface RecaptchaRequestBody {
    recaptchaToken?: string
}

interface RecaptchaSuccessResponse {
    success: true
    message: string
}

interface RecaptchaErrorResponse {
    success: false
    message: string
    errors?: string[]
}

app.post(
    "/api/verify-recaptcha",
    async (
        req: express.Request<unknown, unknown, RecaptchaRequestBody>,
        res: express.Response<RecaptchaSuccessResponse | RecaptchaErrorResponse>
    ): Promise<void> => {
        const secretKey: string | undefined = process.env.RECAPTCHA_SECRET_KEY // Access the secret key securely
        const recaptchaToken: string | undefined = req.body.recaptchaToken

        if (!secretKey) {
            console.error("Backend: RECAPTCHA_SECRET_KEY is NOT set.")
            res.status(500).json({ success: false, message: "Server configuration error." })
            return
        }

        if (!recaptchaToken) {
            res.status(400).json({ success: false, message: "reCAPTCHA token missing." })
            return
        }

        try {
            const params = new URLSearchParams()
            params.append("secret", secretKey)
            params.append("response", recaptchaToken)

            const googleResponse = await fetch("https://www.google.com/recaptcha/api/siteverify", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: params.toString(),
            })

            type GoogleRecaptchaResponse = {
                success: boolean
                "error-codes"?: string[]
            }

            const data = (await googleResponse.json()) as GoogleRecaptchaResponse

            if (data.success) {
                res.json({ success: true, message: "reCAPTCHA verified successfully!" })
            } else {
                console.error("Backend: reCAPTCHA verification failed with error codes:", data["error-codes"])
                res
                    .status(400)
                    .json({ success: false, message: "reCAPTCHA verification failed.", errors: data["error-codes"] })
            }
        } catch (error) {
            console.error("Backend: Error during reCAPTCHA verification:", error)
            res.status(500).json({ success: false, message: "Internal server error during reCAPTCHA verification." })
        }
    }
)

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`)
})
