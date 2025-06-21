"use client"

import type React from "react"
import { useEffect, useRef } from "react"

interface ReCAPTCHAProps {
  siteKey: string
  onSuccess: (token: string) => void
  onExpire?: () => void
  onError?: () => void
}

const ReCAPTCHA: React.FC<ReCAPTCHAProps> = ({ onSuccess, onExpire, onError }) => {
  const recaptchaRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<number | null>(null)

  useEffect(() => {
    // Function to render the reCAPTCHA widget
    const renderRecaptcha = () => {
      if (recaptchaRef.current && (window as any).grecaptcha && widgetIdRef.current === null) {
        widgetIdRef.current = (window as any).grecaptcha.render(recaptchaRef.current, {
          sitekey: "6LctwGgrAAAAAG01jljZ3VSgB7BsYJ6l25QSpLmI",
          callback: onSuccess,
          "expired-callback": () => {
            if (onExpire) onExpire()
            // Reset the widget on expiration to allow a new challenge
            if (widgetIdRef.current !== null) {
              ;(window as any).grecaptcha.reset(widgetIdRef.current)
            }
          },
          "error-callback": () => {
            if (onError) onError()
            // Reset the widget on error
            if (widgetIdRef.current !== null) {
              ;(window as any).grecaptcha.reset(widgetIdRef.current)
            }
          },
        })
      }
    }

    // Load the reCAPTCHA script if it's not already loaded
    const scriptId = "recaptcha-script"
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script")
      script.id = scriptId
      script.src = `https://www.google.com/recaptcha/api.js?render=explicit`
      script.async = true
      script.defer = true
      script.onload = () => {
        // Once script is loaded, ensure grecaptcha is ready and then render
        if ((window as any).grecaptcha) {
          ;(window as any).grecaptcha.ready(renderRecaptcha)
        }
      }
      document.body.appendChild(script)
    } else {
      // If script is already loaded, ensure grecaptcha is ready and then render
      if ((window as any).grecaptcha) {
        ;(window as any).grecaptcha.ready(renderRecaptcha)
      }
    }

    // Cleanup function: Reset the widget when the component unmounts
    return () => {
      if (widgetIdRef.current !== null && (window as any).grecaptcha) {
        try {
          ;(window as any).grecaptcha.reset(widgetIdRef.current)
        } catch (e) {
          console.warn("Failed to reset reCAPTCHA widget on unmount:", e)
        }
        widgetIdRef.current = null // Clear the widget ID
      }
    }
  }, []) // Empty dependency array: This effect runs only once on mount

  return (
    <div className="flex justify-center">
      <div ref={recaptchaRef} className="g-recaptcha"></div>
    </div>
  )
}

export default ReCAPTCHA
