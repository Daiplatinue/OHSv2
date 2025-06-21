"use client"

import type React from "react"

import { CheckCircle2, X, ArrowRight } from "lucide-react"
import { useEffect, useRef, useState, useCallback } from "react"
import ReCAPTCHA from "../Styles/Recaptcha"
import { verifyRecaptchaClient } from "../../../../server/Recaptcha/Recaptcha" // New client-side API helper

interface OTPProps {
  email: string
  onClose: () => void
  onVerify: () => void
  visible: boolean
}

function OTP({ email, onClose, onVerify, visible }: OTPProps) {
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

  useEffect(() => {
    if (visible) {
      setTimeout(() => setModalVisible(true), 10)
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

  const handleResend = () => {
    setCountdown(60)
    setResendDisabled(true)
    console.log("Resending OTP to:", email)
    setError("New OTP code sent!")
    setTimeout(() => setError(""), 3000)
  }

  const handleVerify = () => {
    const otpValue = otp.join("")

    if (otpValue.length !== 6) {
      setError("Please enter all 6 digits")
      return
    }

    setError("")
    setIsVerifying(true)

    setTimeout(() => {
      setIsVerifying(false)
      // After OTP "verification", show reCAPTCHA
      setShowRecaptcha(true)
    }, 1500)
  }

  const handleRecaptchaSuccess = useCallback(
    async (token: string) => {
      setIsRecaptchaVerifying(true)
      setError("")
      try {
        // Call the new client-side API helper
        const result = await verifyRecaptchaClient(token)

        if (result.success) {
          setSuccess(true)
          setTimeout(() => {
            onVerify()
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
    [onVerify],
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
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${visible ? "visible" : "invisible"}`}
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
              <h3 className="text-xl font-semibold text-center mb-4">Complete Security Check</h3>
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
              <h3 className="text-xl font-semibold text-center mb-2">Verification Code</h3>
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
                <p className={`text-center text-sm mb-4 ${error.includes("sent") ? "text-green-500" : "text-red-500"}`}>
                  {error}
                </p>
              )}

              <div className="flex flex-col gap-4">
                <button
                  onClick={handleVerify}
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