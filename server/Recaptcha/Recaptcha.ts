// This file runs on the client-side (in your Vite app)

interface RecaptchaVerificationResult {
  success: boolean
  message?: string
}

export async function verifyRecaptchaClient(token: string): Promise<RecaptchaVerificationResult> {
  try {
    // Changed to match backend running on port 3000
    const response = await fetch("http://localhost:3006/captcha", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ recaptchaToken: token }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Client-side API error:", errorData)
      return { success: false, message: errorData.message || "Backend verification failed." }
    }

    const data: RecaptchaVerificationResult = await response.json()
    return data
  } catch (error: any) {
    console.error("Client-side fetch error for reCAPTCHA verification:", error)
    return { success: false, message: `Network error: ${error.message}` }
  }
}