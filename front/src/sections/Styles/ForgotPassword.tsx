import { useState } from "react"
import { X, ArrowLeft, LockKeyhole, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ForgotPasswordModalProps {
  visible: boolean
  onClose: () => void
}

const keyframes = `
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes bounceIn {
  0% { transform: scale(0); opacity: 0; }
  60% { transform: scale(1.2); }
  100% { transform: 1; opacity: 1; }
}

@keyframes slideInUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}
`

export default function ForgotPassword({ visible, onClose }: ForgotPasswordModalProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [email, setEmail] = useState("")
  const [secretQuestion, setSecretQuestion] = useState("") // In a real app, this would be fetched from a backend
  const [secretAnswer, setSecretAnswer] = useState("")
  const [secretCode, setSecretCode] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false) // New state for success modal
  const [successMessage, setSuccessMessage] = useState("") // New state for success message

  // Mock data for secret question (replace with actual backend logic)
  const mockSecretQuestions: { [key: string]: string } = {
    "user@example.com": "What was your first pet's name?",
    "test@example.com": "What is your mother's maiden name?",
  }

  const resetForm = () => {
    setCurrentPage(1)
    setEmail("")
    setSecretQuestion("")
    setSecretAnswer("")
    setSecretCode("")
    setError("")
    setLoading(false)
    setShowSuccessModal(false)
    setSuccessMessage("")
  }

  const handleEmailSubmit = async () => {
    setError("")
    setLoading(true)
    // Simulate API call to check email and fetch secret question
    await new Promise((resolve) => setTimeout(resolve, 1000))
    if (mockSecretQuestions[email]) {
      setSecretQuestion(mockSecretQuestions[email])
      setCurrentPage(2)
    } else {
      setError("Email not found. Please try again.")
    }
    setLoading(false)
  }

  const handleSecretAnswerSubmit = async () => {
    setError("")
    setLoading(true)
    // Simulate API call to verify secret answer (replace with actual backend logic)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    if (secretAnswer.toLowerCase() === "mockanswer") {
      setSuccessMessage("Secret answer verified! You can now reset your password.")
      setShowSuccessModal(true)
    } else {
      setError("Incorrect secret answer. Please try again.")
    }
    setLoading(false)
  }

  const handleSecretCodeSubmit = async () => {
    setError("")
    setLoading(true)
    // Simulate API call to verify secret code (replace with actual backend logic)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    if (secretCode === "123456") {
      setSuccessMessage("Secret code verified! You can now reset your password.")
      setShowSuccessModal(true)
    } else {
      setError("Incorrect secret code. Please try again.")
    }
    setLoading(false)
  }

  const handleBack = () => {
    setError("") // Clear error on back
    if (currentPage === 3) {
      setCurrentPage(2)
    } else if (currentPage === 2) {
      setCurrentPage(1)
    }
  }

  const handleSuccessModalClose = () => {
    resetForm()
    onClose() // Close the main ForgotPassword modal
  }

  if (!visible) return null

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-md z-50 flex items-center justify-center p-4"
      style={{ animation: "fadeIn 0.3s ease-out" }}
    >
      {/* Include animation keyframes */}
      <style>{keyframes}</style>

      <Card
        className="mx-auto max-w-md w-full bg-white/90 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl transform transition-all border border-white/20 p-6"
        style={{ animation: "fadeIn 0.5s ease-out" }}
      >
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 z-10">
          <X size={20} />
          <span className="sr-only">Close</span>
        </button>

        {currentPage > 1 && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="absolute left-4 top-4 text-gray-500 hover:text-gray-700 z-10"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Button>
        )}

        {/* Icon - centered using mx-auto */}
        <div
          className="w-20 h-20 rounded-full bg-sky-100 flex items-center justify-center mx-auto mb-6"
          style={{ animation: "pulse 2s ease-in-out infinite" }}
        >
          <LockKeyhole className="h-10 w-10 text-sky-500" style={{ animation: "bounceIn 0.6s ease-out" }} />
        </div>

        {/* CardHeader - text content will be left-aligned by default */}
        <CardHeader className="space-y-1 p-0 mb-6 text-center">
          <CardTitle
            className="text-xl font-medium text-gray-700 mb-2 whitespace-nowrap"
            style={{ animation: "slideInUp 0.4s ease-out" }}
          >
            Forgot Password
          </CardTitle>
          {currentPage === 1 && (
            <CardDescription className="text-gray-600" style={{ animation: "fadeIn 0.5s ease-out 0.2s both" }}>
              Enter your email to find your account.
            </CardDescription>
          )}
          {currentPage === 2 && (
            <CardDescription className="text-gray-600" style={{ animation: "fadeIn 0.5s ease-out 0.2s both" }}>
              Answer your secret question.
            </CardDescription>
          )}
          {currentPage === 3 && (
            <CardDescription className="text-gray-600" style={{ animation: "fadeIn 0.5s ease-out 0.2s both" }}>
              Enter your secret code.
            </CardDescription>
          )}
        </CardHeader>

        {/* CardContent - input and button will take full width and align as expected */}
        <CardContent className="w-full p-0">
          {currentPage === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-gray-200 border border-gray-400 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-300"
                />
              </div>
              <Button
                onClick={handleEmailSubmit}
                className="w-full px-8 py-3 bg-sky-500 text-white rounded-full font-medium shadow-sm hover:bg-sky-600 active:scale-95 transition-all duration-200"
                disabled={loading || !email}
                style={{ animation: "fadeIn 0.5s ease-out 0.3s both" }}
              >
                {loading ? "Loading..." : "Next"}
              </Button>
            </div>
          )}

          {currentPage === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="secret-question" className="text-gray-700">
                  Secret Question
                </Label>
                <Input
                  id="secret-question"
                  type="text"
                  value={secretQuestion || "No secret question found for this email."}
                  readOnly
                  className="bg-gray-100 cursor-not-allowed w-full px-4 py-3 border border-gray-400 rounded-lg text-gray-700"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="secret-answer" className="text-gray-700">
                  Your Answer
                </Label>
                <Input
                  id="secret-answer"
                  type="text"
                  placeholder="Enter your answer"
                  value={secretAnswer}
                  onChange={(e) => setSecretAnswer(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-gray-200 border border-gray-400 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-300"
                />
              </div>
              <Button
                onClick={handleSecretAnswerSubmit}
                className="w-full px-8 py-3 bg-sky-500 text-white rounded-full font-medium shadow-sm hover:bg-sky-600 active:scale-95 transition-all duration-200"
                disabled={loading || !secretAnswer}
                style={{ animation: "fadeIn 0.5s ease-out 0.3s both" }}
              >
                {loading ? "Verifying..." : "Submit"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setCurrentPage(3)}
                className="w-full px-8 py-3 border border-gray-300 bg-white text-gray-700 rounded-full font-medium hover:bg-gray-50 transition-all"
                style={{ animation: "fadeIn 0.5s ease-out 0.4s both" }}
              >
                Click here to use secret code instead
              </Button>
            </div>
          )}

          {currentPage === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="secret-code" className="text-gray-700">
                  Secret Code
                </Label>
                <Input
                  id="secret-code"
                  type="text"
                  placeholder="Enter your secret code"
                  value={secretCode}
                  onChange={(e) => setSecretCode(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-gray-200 border border-gray-400 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-300"
                />
              </div>
              <Button
                onClick={handleSecretCodeSubmit}
                className="w-full px-8 py-3 bg-sky-500 text-white rounded-full font-medium shadow-sm hover:bg-sky-600 active:scale-95 transition-all duration-200"
                disabled={loading || !secretCode}
                style={{ animation: "fadeIn 0.5s ease-out 0.3s both" }}
              >
                {loading ? "Verifying..." : "Submit"}
              </Button>
            </div>
          )}

          {error && (
            <div
              className={`mt-4 text-sm text-center ${error.includes("verified") ? "text-green-500" : "text-red-500"}`}
              style={{ animation: "fadeIn 0.5s ease-out 0.2s both" }}
            >
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Success Modal */}
      {showSuccessModal && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-md z-50 flex items-center justify-center p-4"
          style={{ animation: "fadeIn 0.3s ease-out" }}
        >
          <div
            className="mx-auto max-w-md w-full bg-white/90 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl transform transition-all border border-white/20 p-6"
            style={{ animation: "fadeIn 0.5s ease-out" }}
          >
            <div className="flex flex-col items-center text-center">
              <div
                className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6"
                style={{ animation: "pulse 2s ease-in-out infinite" }}
              >
                <CheckCircle2 className="h-10 w-10 text-green-500" style={{ animation: "bounceIn 0.6s ease-out" }} />
              </div>

              <h3 className="text-xl font-medium text-gray-900 mb-2" style={{ animation: "slideInUp 0.4s ease-out" }}>
                Success!
              </h3>

              <p className="text-gray-600 mb-6" style={{ animation: "fadeIn 0.5s ease-out 0.2s both" }}>
                {successMessage}
              </p>

              <Button
                onClick={handleSuccessModalClose}
                className="px-8 py-3 bg-sky-500 text-white rounded-full font-medium shadow-sm hover:bg-sky-600 active:scale-95 transition-all duration-200"
                style={{ animation: "fadeIn 0.5s ease-out 0.3s both" }}
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}