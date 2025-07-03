import type React from "react"

import { CheckCircle2, X, ArrowRight, AlertCircle } from "lucide-react" // Added AlertCircle for error icon
import { useEffect, useRef, useState, useCallback } from "react"
import ReCAPTCHA from "../Styles/Recaptcha"
import { verifyRecaptchaClient } from "../../../../server/Recaptcha/Recaptcha"

interface OTPProps {
  email: string
  onClose: () => void
  onOtpVerifiedSuccess: (user: any) => void // Modified to pass user data on full success
  visible: boolean
  onResendOtp: (email: string) => Promise<boolean> // New prop for resending OTP
}

function OTP({ email, onClose, onOtpVerifiedSuccess, visible, onResendOtp }: OTPProps) {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""))
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [countdown, setCountdown] = useState(60)
  const [resendDisabled, setResendDisabled] = useState(true)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const [modalVisible, setModalVisible] = useState(false)
  const [showRecaptcha, setShowRecaptcha] = useState(false)
  const [isRecaptchaVerifying, setIsRecaptchaVerifying] = useState(false)
  const [verifiedUserData, setVerifiedUserData] = useState<any | null>(null) // To store user data after OTP verification

  useEffect(() => {
    if (visible) {
      setTimeout(() => setModalVisible(true), 10)
      setCountdown(60) // Reset countdown when modal becomes visible
      setResendDisabled(true) // Disable resend immediately
      setOtp(Array(6).fill("")) // Clear OTP input
      setError("") // Clear any previous errors
      setSuccess(false) // Reset success state
      setShowRecaptcha(false) // Hide recaptcha initially
      setVerifiedUserData(null) // Clear verified user data
    } else {
      setModalVisible(false)
    }
  }, [visible])

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6)
    if (modalVisible && inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [modalVisible])

  useEffect(() => {
    if (!visible) return

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setResendDisabled(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [visible])

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.charAt(0)
    }

    if (value && !/^\d+$/.test(value)) {
      return
    }

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value !== "" && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasteData = e.clipboardData.getData("text").trim().substring(0, 6)

    if (!pasteData || !/^\d+$/.test(pasteData)) return

    const newOtp = [...otp]

    for (let i = 0; i < pasteData.length; i++) {
      if (i >= 6) break
      newOtp[i] = pasteData[i]
    }

    setOtp(newOtp)

    const lastIndex = Math.min(pasteData.length, 5)
    inputRefs.current[lastIndex]?.focus()
  }

  const handleResend = async () => {
    setCountdown(60)
    setResendDisabled(true)
    setError("")
    const success = await onResendOtp(email)
    if (success) {
      setError("New OTP code sent!")
    } else {
      setError("Failed to resend OTP. Please try again.")
    }
    setTimeout(() => setError(""), 3000)
  }

  const handleVerifyClick = async () => {
    const otpValue = otp.join("")

    if (otpValue.length !== 6) {
      setError("Please enter all 6 digits")
      return
    }

    setError("")
    setIsVerifying(true)

    try {
      const response = await fetch("http://localhost:3000/api/users/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp: otpValue }),
      })

      const data = await response.json()

      if (response.ok) {
        setVerifiedUserData(data.user) // Store user data
        setShowRecaptcha(true) // Proceed to reCAPTCHA
        setError("") // Clear any previous errors
      } else {
        setError(data.message || "Invalid or expired OTP.") // Show error if OTP is wrong
        setOtp(Array(6).fill("")) // Clear OTP input on error
        inputRefs.current[0]?.focus() // Focus first input
      }
    } catch (err) {
      console.error("OTP verification error:", err)
      setError("Failed to connect to the server for OTP verification. Please try again.")
    } finally {
      setIsVerifying(false)
    }
  }

  const handleRecaptchaSuccess = useCallback(
    async (token: string) => {
      setIsRecaptchaVerifying(true)
      setError("")
      try {
        const result = await verifyRecaptchaClient(token)

        if (result.success) {
          setSuccess(true)
          setTimeout(() => {
            if (verifiedUserData) {
              onOtpVerifiedSuccess(verifiedUserData) // Pass the stored user data
            }
          }, 1500)
        } else {
          setError(result.message || "reCAPTCHA verification failed.")
          if ((window as any).grecaptcha) {
            ;(window as any).grecaptcha.reset()
          }
        }
      } catch (err: any) {
        console.error("Error during reCAPTCHA client verification:", err)
        setError(`Network error during reCAPTCHA verification: ${err.message}`)
        if ((window as any).grecaptcha) {
          ;(window as any).grecaptcha.reset()
        }
      } finally {
        setIsRecaptchaVerifying(false)
      }
    },
    [onOtpVerifiedSuccess, verifiedUserData],
  )

  const handleRecaptchaError = useCallback(() => {
    setError("reCAPTCHA encountered an error. Please try again.")
    setIsRecaptchaVerifying(false)
  }, [])

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,sans-serif] ${visible ? "visible" : "invisible"}`}
      onClick={handleBackdropClick}
    >
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300"
        style={{ opacity: modalVisible ? 1 : 0 }}
      />

      <div
        className="relative bg-white/90 backdrop-blur-md rounded-2xl w-full max-w-md shadow-2xl overflow-hidden transition-all duration-300 transform"
        style={{
          opacity: modalVisible ? 1 : 0,
          transform: modalVisible ? "scale(1)" : "scale(0.95)",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 z-10">
          <X size={20} />
          <span className="sr-only">Close</span>
        </button>

        <div className="px-6 py-8">
          {success ? (
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6 animate-pulse">
                <CheckCircle2 className="h-10 w-10 text-green-500 animate-bounce" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Verified Successfully</h3>
              <p className="text-gray-600 mb-6">You have been successfully authenticated.</p>
            </div>
          ) : showRecaptcha ? (
            <div className="text-center">
              <h3 className="text-xl font-medium text-gray-700 text-center mb-4">Complete Security Check</h3>
              <p className="text-center text-gray-600 mb-6">Please complete the reCAPTCHA challenge.</p>
              <ReCAPTCHA
                siteKey="6LctwGgrAAAAAG01jljZ3VSgB7BsYJ6l25QSpLmI" // Your reCAPTCHA site key
                onSuccess={handleRecaptchaSuccess}
                onError={handleRecaptchaError}
              />
              {isRecaptchaVerifying && <p className="text-center text-sm text-gray-500 mt-4">Verifying reCAPTCHA...</p>}
              {error && (
                <p className={`text-center text-sm mt-4 ${error.includes("sent") ? "text-green-500" : "text-red-500"}`}>
                  {error}
                </p>
              )}
            </div>
          ) : (
            <>
              <h3 className="text-xl font-medium text-gray-700 text-center mb-2">Verification Code</h3>
              <p className="text-center text-gray-600 mb-6">
                We've sent a 6-digit code to <span className="font-medium">{email}</span>
              </p>

              <div className="flex justify-center gap-2 mb-6" onPaste={handlePaste}>
                {Array(6)
                  .fill(null)
                  .map((_, index) => (
                    <input
                      key={index}
                      ref={(el) => {
                        inputRefs.current[index] = el
                      }}
                      type="text"
                      maxLength={1}
                      value={otp[index]}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-12 h-12 text-center text-lg font-medium border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent"
                    />
                  ))}
              </div>

              {error && (
                <div className="flex items-center justify-center text-center text-sm mb-4 text-red-500">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-4">
                <button
                  onClick={handleVerifyClick}
                  disabled={otp.join("").length !== 6 || isVerifying}
                  className={`w-full py-3 px-4 rounded-full font-medium flex items-center justify-center gap-2 ${
                    otp.join("").length !== 6 || isVerifying
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-sky-500 text-white hover:bg-sky-600"
                  }`}
                >
                  {isVerifying ? "Verifying..." : "Verify Code"}
                  {!isVerifying && <ArrowRight size={18} />}
                </button>

                <div className="text-center">
                  <p className="text-gray-500 text-sm">
                    Didn't receive the code?{" "}
                    <button
                      onClick={handleResend}
                      disabled={resendDisabled}
                      className={`font-medium ${
                        resendDisabled ? "text-gray-400 cursor-not-allowed" : "text-sky-500 hover:text-sky-600"
                      }`}
                    >
                      {resendDisabled ? `Resend in ${countdown}s` : "Resend code"}
                    </button>
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default OTP