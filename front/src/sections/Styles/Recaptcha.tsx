import type React from "react"
import { useEffect, useRef } from "react"

interface ReCAPTCHAProps {
  siteKey: string
  onSuccess: (token: string) => void
  onExpire?: () => void
  onError?: () => void
}

const ReCAPTCHA: React.FC<ReCAPTCHAProps> = ({ siteKey, onSuccess, onExpire, onError }) => {
  const recaptchaRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<number | null>(null)

  useEffect(() => {
    const renderRecaptcha = () => {
      if (recaptchaRef.current && (window as any).grecaptcha && widgetIdRef.current === null) {
        widgetIdRef.current = (window as any).grecaptcha.render(recaptchaRef.current, {
          sitekey: "6LctwGgrAAAAAG01jljZ3VSgB7BsYJ6l25QSpLmI", 
          callback: onSuccess,
          "expired-callback": () => {
            if (onExpire) onExpire()
            if (widgetIdRef.current !== null) {
              ;(window as any).grecaptcha.reset(widgetIdRef.current)
            }
          },
          "error-callback": () => {
            if (onError) onError()
            if (widgetIdRef.current !== null) {
              ;(window as any).grecaptcha.reset(widgetIdRef.current)
            }
          },
        })
      }
    }

    const scriptId = "recaptcha-script"
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script")
      script.id = scriptId
      script.src = `https://www.google.com/recaptcha/api.js?render=explicit`
      script.async = true
      script.defer = true
      script.onload = () => {
        if ((window as any).grecaptcha) {
          ;(window as any).grecaptcha.ready(renderRecaptcha)
        }
      }
      document.body.appendChild(script)
    } else {
      if ((window as any).grecaptcha) {
        ;(window as any).grecaptcha.ready(renderRecaptcha)
      }
    }

    return () => {
      if (widgetIdRef.current !== null && (window as any).grecaptcha) {
        try {
          ;(window as any).grecaptcha.reset(widgetIdRef.current)
        } catch (e) {
          console.warn("Failed to reset reCAPTCHA widget on unmount:", e)
        }
        widgetIdRef.current = null
      }
    }
  }, [siteKey, onSuccess, onExpire, onError])

  return (
    <div className="flex justify-center">
      <div ref={recaptchaRef} className="g-recaptcha"></div>
    </div>
  )
}

export default ReCAPTCHA