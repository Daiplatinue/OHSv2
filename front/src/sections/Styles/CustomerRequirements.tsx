import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Upload, ChevronLeft, ChevronRight, Camera, ImageIcon, Check, CheckCircle2 } from "lucide-react"
import LocationSelector from "./LocationSelectorAuth"

interface Location {
  name: string
  lat: number
  lng: number
  distance: number
  price?: number
  id?: string
  zipCode?: string
}

interface CustomerRequirementsProps {
  onClose?: () => void
  parentModal?: boolean
  minimalMode?: boolean // New prop
}

export default function CustomerRequirements({
  onClose,
  parentModal = false,
  minimalMode = false,
}: CustomerRequirementsProps) {
  // Form state
  const [currentStep, setCurrentStep] = useState(1)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [middleName, setMiddleName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("") // New state
  const [confirmPassword, setConfirmPassword] = useState("") // New state
  const [mobileNumber, setMobileNumber] = useState("")
  const [gender, setGender] = useState("")
  const [bio, setBio] = useState("")
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationDirection, setAnimationDirection] = useState("next")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)

  // ID document state (only for full mode)
  const [frontId, setFrontId] = useState<File | null>(null)
  const [backId, setBackId] = useState<File | null>(null)
  const [frontIdPreview, setFrontIdPreview] = useState<string | null>(null)
  const [backIdPreview, setBackIdPreview] = useState<string | null>(null)

  // Location state (only for full mode)
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [showLocationModal, setShowLocationModal] = useState(false)

  // Profile state (only for full mode)
  const [profilePicture, setProfilePicture] = useState<File | null>(null)
  const [coverPhoto, setCoverPhoto] = useState<File | null>(null)
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null)
  const [coverPhotoPreview, setCoverPhotoPreview] = useState<string | null>(null)

  // Refs for file inputs (only for full mode)
  const frontIdRef = useRef<HTMLInputElement>(null)
  const backIdRef = useRef<HTMLInputElement>(null)
  const profilePictureRef = useRef<HTMLInputElement>(null)
  const coverPhotoRef = useRef<HTMLInputElement>(null)

  // Company location (for location selector)
  const companyLocation = {
    lat: 10.243343,
    lng: 123.796293,
  }

  // Reset form after successful submission
  useEffect(() => {
    if (success) {
      // Reset all form fields
      setFirstName("")
      setLastName("")
      setMiddleName("")
      setEmail("")
      setPassword("")
      setConfirmPassword("")
      setMobileNumber("")
      setGender("")
      setBio("")
      setFrontId(null)
      setBackId(null)
      setFrontIdPreview(null)
      setBackIdPreview(null)
      setSelectedLocation(null)
      setProfilePicture(null)
      setCoverPhoto(null)
      setProfilePicturePreview(null)
      setCoverPhotoPreview(null)

      // Reset to first step
      setCurrentStep(1)
    }
  }, [success])

  // Handle file selection and preview (only for full mode)
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<File | null>>,
    previewSetter: React.Dispatch<React.SetStateAction<string | null>>,
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      setter(file)

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        previewSetter(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Validation for each step (only for full mode)
  const isStep1Valid = () => {
    return (
      firstName.trim() !== "" &&
      lastName.trim() !== "" &&
      email.trim() !== "" &&
      mobileNumber.trim() !== "" &&
      gender !== "" &&
      frontId !== null &&
      backId !== null
    )
  }

  const isStep2Valid = () => {
    return selectedLocation !== null
  }

  const isStep3Valid = () => {
    return profilePicture !== null
  }

  // Navigation between steps with animation (only for full mode)
  const goToNextStep = () => {
    if (currentStep === 1 && isStep1Valid()) {
      animateStepChange("next", 2)
    } else if (currentStep === 2 && isStep2Valid()) {
      animateStepChange("next", 3)
    } else if (currentStep === 3 && isStep3Valid()) {
      animateStepChange("next", 4)
    }
  }

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      animateStepChange("prev", currentStep - 1)
    }
  }

  // Animation function
  const animateStepChange = (direction: "next" | "prev", newStep: number) => {
    setAnimationDirection(direction)
    setIsAnimating(true)

    // After a short delay, change the step
    setTimeout(() => {
      setCurrentStep(newStep)

      // Allow time for the new content to render before removing the animation class
      setTimeout(() => {
        setIsAnimating(false)
      }, 50)
    }, 250)
  }

  const handleSuccessModalClose = () => {
    setIsSuccessModalOpen(false)

    // Call onClose if provided (to close the parent modal)
    if (onClose) {
      onClose()
    }
  }

  // Handle form submission (mock implementation without API)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock successful form submission
      setSuccess(true)
      setIsSuccessModalOpen(true)
    } catch (error) {
      setError("An error occurred during registration. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Handle minimal form submission
  const handleMinimalSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      setLoading(false)
      return
    }

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock successful form submission for minimal mode
      setSuccess(true)
      setIsSuccessModalOpen(true)
    } catch (error) {
      setError("An error occurred during registration. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Handle location selection with price calculation (only for full mode)
  const handleLocationSelect = (location: Location) => {
    const updatedLocation = {
      ...location,
    }
    setSelectedLocation(updatedLocation)
  }

  return (
    <div className="py-4 px-2">
      {/* Include animation keyframes */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes bounceIn {
          0% { transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
      `}</style>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold mb-1">HandyGo</h1>
          <h2 className="text-3xl font-bold text-sky-400">Create Your Account</h2>
        </div>

        {/* Success message */}
        {success && !isSuccessModalOpen && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
            <div className="flex items-center justify-center">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mb-3">
                <Check className="h-6 w-6 text-white" />
              </div>
            </div>
            <h3 className="text-lg font-medium text-green-800">Registration Successful!</h3>
            <p className="text-green-600">Your account has been created successfully. You can now log in.</p>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="text-lg font-medium text-red-800">Registration Failed</h3>
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {minimalMode ? (
          // Minimal Mode Form
          <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 p-4">
            <form onSubmit={handleMinimalSubmit}>
              <h3 className="text-lg font-medium mb-4">Basic Account Information</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="first-name" className="mb-1 block text-sm font-medium">
                    First Name
                  </label>
                  <input
                    id="first-name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter your first name"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label htmlFor="last-name" className="mb-1 block text-sm font-medium">
                    Last Name
                  </label>
                  <input
                    id="last-name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter your last name"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label htmlFor="middle-name" className="mb-1 block text-sm font-medium">
                    Middle Name (optional)
                  </label>
                  <input
                    id="middle-name"
                    value={middleName}
                    onChange={(e) => setMiddleName(e.target.value)}
                    placeholder="Enter your middle name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="mb-1 block text-sm font-medium">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@mail.com"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="mb-1 block text-sm font-medium">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label htmlFor="confirm-password" className="mb-1 block text-sm font-medium">
                    Confirm Password
                  </label>
                  <input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={loading || !firstName || !lastName || !email || !password || !confirmPassword}
                  className={`px-5 py-2 rounded-full transition-all duration-300 hover:shadow-md flex items-center justify-center w-full ${
                    loading || !firstName || !lastName || !email || !password || !confirmPassword
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-sky-500 hover:bg-sky-600 text-white"
                  }`}
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    "Create Basic Account"
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          // Full Mode Form (Existing Logic)
          <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
            <div className="p-4 relative">
              {/* SwiftUI-inspired progress indicator */}
              <div className="mb-6 px-30 ml-20">
                <div className="flex items-center justify-center gap-1 md:gap-3">
                  {[1, 2, 3, 4].map((step) => (
                    <div key={step} className="flex flex-1 items-center">
                      <div
                        className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                          currentStep === step
                            ? "bg-sky-500 text-white scale-110 shadow-md"
                            : currentStep > step
                              ? "bg-sky-500 text-white"
                              : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {currentStep > step ? (
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <span className="text-xs font-medium">{step}</span>
                        )}
                      </div>
                      {step < 4 && (
                        <div
                          className={`flex-1 h-1 transition-all duration-500 ${
                            currentStep > step ? "bg-sky-500" : "bg-gray-200"
                          }`}
                        ></div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500 px-5  ml-[-2rem] mr-15">
                  <span className={currentStep >= 1 ? "text-sky-600 font-medium" : ""}>Personal</span>
                  <span className={currentStep >= 2 ? "text-sky-600 font-medium" : ""}>Location</span>
                  <span className={currentStep >= 3 ? "text-sky-600 font-medium" : ""}>Profile</span>
                  <span className={currentStep >= 4 ? "text-sky-600 font-medium" : ""}>Review</span>
                </div>
              </div>
              <form onSubmit={handleSubmit}>
                <div
                  className={`transition-all duration-300 ${
                    isAnimating
                      ? animationDirection === "next"
                        ? "opacity-0 translate-x-10"
                        : "opacity-0 -translate-x-10"
                      : "opacity-100 translate-x-0"
                  }`}
                >
                  {/* Step 1: Personal Information and ID */}
                  {currentStep === 1 && (
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Left side - ID upload */}
                      <div>
                        <h3 className="text-lg font-medium mb-4">Valid ID Submission</h3>

                        {/* Front ID */}
                        <div className="mb-4">
                          <label htmlFor="front-id" className="mb-2 block text-sm font-medium">
                            Front of ID
                          </label>
                          <div
                            className={`border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer transition-colors ${frontId ? "border-green-500 bg-green-50" : "border-gray-300 hover:border-gray-400"}`}
                            onClick={() => frontIdRef.current?.click()}
                          >
                            {frontIdPreview ? (
                              <div className="relative w-full h-40">
                                <img
                                  src={frontIdPreview || "/placeholder.svg"}
                                  alt="Front ID Preview"
                                  className="object-contain w-full h-full"
                                />
                              </div>
                            ) : (
                              <>
                                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                                <p className="text-sm text-gray-500">Upload front of your valid ID</p>
                                <p className="text-xs text-gray-400 mt-1">JPG, PNG or PDF up to 5MB</p>
                              </>
                            )}
                            <input
                              id="front-id"
                              type="file"
                              ref={frontIdRef}
                              className="hidden"
                              accept=".jpg,.jpeg,.png,.pdf"
                              onChange={(e) => handleFileChange(e, setFrontId, setFrontIdPreview)}
                            />
                          </div>
                        </div>

                        {/* Back ID */}
                        <div className="mb-4">
                          <label htmlFor="back-id" className="mb-2 block text-sm font-medium">
                            Back of ID
                          </label>
                          <div
                            className={`border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer transition-colors ${backId ? "border-green-500 bg-green-50" : "border-gray-300 hover:border-gray-400"}`}
                            onClick={() => backIdRef.current?.click()}
                          >
                            {backIdPreview ? (
                              <div className="relative w-full h-40">
                                <img
                                  src={backIdPreview || "/placeholder.svg"}
                                  alt="Back ID Preview"
                                  className="object-contain w-full h-full"
                                />
                              </div>
                            ) : (
                              <>
                                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                                <p className="text-sm text-gray-500">Upload back of your valid ID</p>
                                <p className="text-xs text-gray-400 mt-1">JPG, PNG or PDF up to 5MB</p>
                              </>
                            )}
                            <input
                              id="back-id"
                              type="file"
                              ref={backIdRef}
                              className="hidden"
                              accept=".jpg,.jpeg,.png,.pdf"
                              onChange={(e) => handleFileChange(e, setBackId, setBackIdPreview)}
                            />
                          </div>
                        </div>

                        {/* ID Preview */}
                        {(frontIdPreview || backIdPreview) && (
                          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                            <h4 className="text-sm font-medium mb-2">ID Overview</h4>
                            <div className="flex gap-2">
                              {frontIdPreview && (
                                <div className="relative w-20 h-12 border rounded overflow-hidden">
                                  <img
                                    src={frontIdPreview || "/placeholder.svg"}
                                    alt="Front ID"
                                    className="object-cover w-full h-full"
                                  />
                                  <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                                    <span className="text-xs text-white font-medium">Front</span>
                                  </div>
                                </div>
                              )}
                              {backIdPreview && (
                                <div className="relative w-20 h-12 border rounded overflow-hidden">
                                  <img
                                    src={backIdPreview || "/placeholder.svg"}
                                    alt="Back ID"
                                    className="object-cover w-full h-full"
                                  />
                                  <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                                    <span className="text-xs text-white font-medium">Back</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right side - Personal information */}
                      <div>
                        <h3 className="text-lg font-medium mb-4">Personal Information</h3>

                        <div className="space-y-4">
                          <div>
                            <label htmlFor="first-name" className="mb-1 block text-sm font-medium">
                              First Name
                            </label>
                            <input
                              id="first-name"
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                              placeholder="Enter your first name"
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                            />
                          </div>

                          <div>
                            <label htmlFor="last-name" className="mb-1 block text-sm font-medium">
                              Last Name
                            </label>
                            <input
                              id="last-name"
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                              placeholder="Enter your last name"
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                            />
                          </div>

                          <div>
                            <label htmlFor="middle-name" className="mb-1 block text-sm font-medium">
                              Middle Name (optional)
                            </label>
                            <input
                              id="middle-name"
                              value={middleName}
                              onChange={(e) => setMiddleName(e.target.value)}
                              placeholder="Enter your middle name"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                            />
                          </div>

                          <div>
                            <label htmlFor="gender" className="mb-1 block text-sm font-medium">
                              Gender
                            </label>
                            <select
                              id="gender"
                              value={gender}
                              onChange={(e) => setGender(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                              required
                            >
                              <option value="">Select gender</option>
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                              <option value="other">Other</option>
                              <option value="prefer-not-to-say">Prefer not to say</option>
                            </select>
                          </div>

                          <div>
                            <label htmlFor="email" className="mb-1 block text-sm font-medium">
                              Email Address
                            </label>
                            <input
                              id="email"
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="example@mail.com"
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                            />
                          </div>

                          <div>
                            <label htmlFor="mobile-number" className="mb-1 block text-sm font-medium">
                              Mobile Number
                            </label>
                            <input
                              id="mobile-number"
                              value={mobileNumber}
                              onChange={(e) => setMobileNumber(e.target.value)}
                              placeholder="Enter your mobile number"
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Location Selection */}
                  {currentStep === 2 && (
                    <div>
                      <h3 className="text-lg font-medium mb-4">Select Your Location</h3>

                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Left side - Location selection and price settings */}
                        <div>
                          <button
                            type="button"
                            onClick={() => setShowLocationModal(true)}
                            className="w-full mb-4 px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 transition-colors"
                          >
                            Open Location Selector
                          </button>

                          <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-500 mb-2">
                              Click the button above to open the location selector. You can search for a location or
                              click on the map to select your service location.
                            </p>

                            {!selectedLocation && (
                              <div className="flex items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
                                <p className="text-gray-400">No location selected</p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Right side - Selected location details */}
                        <div>
                          {selectedLocation ? (
                            <div className="p-4 bg-white border rounded-lg">
                              <h4 className="font-medium mb-2">Selected Location</h4>

                              <div className="space-y-3">
                                <div>
                                  <label className="text-xs text-gray-500">Location Name</label>
                                  <p className="font-medium">{selectedLocation.name}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-xs text-gray-500">Distance</label>
                                    <p className="font-medium">{selectedLocation.distance.toFixed(1)} km</p>
                                  </div>

                                  <div>
                                    <label className="text-xs text-gray-500">Zip Code</label>
                                    <p className="font-medium">
                                      {selectedLocation.zipCode ? (
                                        selectedLocation.zipCode
                                      ) : (
                                        <span className="text-gray-400">Not available</span>
                                      )}
                                    </p>
                                  </div>
                                </div>

                                <div>
                                  <label className="text-xs text-gray-500">Coordinates</label>
                                  <p className="text-sm">
                                    Lat: {selectedLocation.lat.toFixed(6)}, Lng: {selectedLocation.lng.toFixed(6)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center h-full p-6 border-2 border-dashed border-gray-300 rounded-lg">
                              <p className="text-gray-400 mb-2">No location selected</p>
                              <p className="text-xs text-gray-500 text-center">
                                Please select a location to continue with your registration
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Profile Setup */}
                  {currentStep === 3 && (
                    <div>
                      <h3 className="text-lg font-medium mb-4">Account Profile Setup</h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Left side - Bio and Profile Pictures */}
                        <div>
                          {/* Bio */}
                          <div className="mb-6">
                            <label htmlFor="bio" className="mb-2 block text-sm font-medium">
                              Bio
                            </label>
                            <textarea
                              id="bio"
                              value={bio}
                              onChange={(e) => setBio(e.target.value)}
                              placeholder="Tell us about yourself"
                              rows={4}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                            />
                          </div>

                          {/* Cover Photo */}
                          <div className="mb-4">
                            <label htmlFor="cover-photo" className="mb-2 block text-sm font-medium">
                              Cover Photo (optional)
                            </label>
                            <div
                              className={`border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer transition-colors h-40 ${coverPhoto ? "border-green-500 bg-green-50" : "border-gray-300 hover:border-gray-400"}`}
                              onClick={() => coverPhotoRef.current?.click()}
                            >
                              {coverPhotoPreview ? (
                                <div className="relative w-full h-full">
                                  <img
                                    src={coverPhotoPreview || "/placeholder.svg"}
                                    alt="Cover Photo Preview"
                                    className="object-cover rounded-md w-full h-full"
                                  />
                                </div>
                              ) : (
                                <>
                                  <ImageIcon className="h-8 w-8 text-gray-400 mb-2" />
                                  <p className="text-sm text-gray-500">Upload a cover photo</p>
                                  <p className="text-xs text-gray-400 mt-1">JPG or PNG up to 5MB</p>
                                </>
                              )}
                              <input
                                id="cover-photo"
                                type="file"
                                ref={coverPhotoRef}
                                className="hidden"
                                accept=".jpg,.jpeg,.png"
                                onChange={(e) => handleFileChange(e, setCoverPhoto, setCoverPhotoPreview)}
                              />
                            </div>
                          </div>

                          {/* Profile Picture */}
                          <div className="mb-4">
                            <label htmlFor="profile-picture" className="mb-2 block text-sm font-medium">
                              Profile Picture
                            </label>
                            <div
                              className={`border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer transition-colors ${profilePicture ? "border-green-500 bg-green-50" : "border-gray-300 hover:border-gray-400"}`}
                              onClick={() => profilePictureRef.current?.click()}
                            >
                              {profilePicturePreview ? (
                                <div className="relative w-32 h-32 rounded-full overflow-hidden">
                                  <img
                                    src={profilePicturePreview || "/placeholder.svg"}
                                    alt="Profile Picture Preview"
                                    className="object-cover w-full h-full"
                                  />
                                </div>
                              ) : (
                                <>
                                  <Camera className="h-8 w-8 text-gray-400 mb-2" />
                                  <p className="text-sm text-gray-500">Upload a profile picture</p>
                                  <p className="text-xs text-gray-400 mt-1">JPG or PNG up to 5MB</p>
                                </>
                              )}
                              <input
                                id="profile-picture"
                                type="file"
                                ref={profilePictureRef}
                                className="hidden"
                                accept=".jpg,.jpeg,.png"
                                onChange={(e) => handleFileChange(e, setProfilePicture, setProfilePicturePreview)}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Right side - Profile Preview */}
                        <div>
                          <h4 className="text-lg font-medium mb-4">Profile Preview</h4>
                          <div className="bg-white border rounded-lg overflow-hidden">
                            {/* Cover Photo Preview */}
                            <div className="h-48 bg-gray-100 relative">
                              {coverPhotoPreview ? (
                                <img
                                  src={coverPhotoPreview || "/placeholder.svg"}
                                  alt="Cover"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-r from-sky-400 to-blue-500" />
                              )}
                            </div>

                            {/* Profile Info */}
                            <div className="relative px-6 pb-6">
                              {/* Profile Picture */}
                              <div className="absolute -top-16 left-6">
                                <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-white shadow-lg">
                                  {profilePicturePreview ? (
                                    <img
                                      src={profilePicturePreview || "/placeholder.svg"}
                                      alt="Profile"
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                      <Camera className="h-8 w-8 text-gray-400" />
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Name and Bio */}
                              <div className="pt-20">
                                <h2 className="text-2xl font-bold text-gray-900">
                                  {firstName} {middleName} {lastName}
                                </h2>
                                {bio && <p className="mt-2 text-gray-600">{bio}</p>}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Account Review */}
                  {currentStep === 4 && (
                    <div>
                      <h3 className="text-lg font-medium mb-4">Review Your Profile</h3>

                      {/* Profile Header - Similar to MyProfile.tsx */}
                      <div className="bg-white rounded-xl overflow-hidden mb-6 border border-gray-100">
                        {/* Cover Photo */}
                        <div className="relative h-60 overflow-hidden">
                          {coverPhotoPreview ? (
                            <img
                              src={coverPhotoPreview || "/placeholder.svg"}
                              alt="Cover"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-r from-sky-400 to-blue-500"></div>
                          )}
                          <div className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full">
                            <Camera className="h-5 w-5" />
                          </div>
                        </div>

                        {/* Profile Info */}
                        <div className="relative px-6 pb-6">
                          <div className="absolute -top-16 left-6">
                            <div className="relative">
                              <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-white">
                                {profilePicturePreview ? (
                                  <img
                                    src={profilePicturePreview || "/placeholder.svg"}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                    <Camera className="h-8 w-8 text-gray-400" />
                                  </div>
                                )}
                              </div>
                              <div className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md">
                                <Camera className="h-4 w-4 text-gray-600" />
                              </div>
                            </div>
                          </div>

                          <div className="pt-20">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h1 className="text-2xl font-bold text-gray-900">
                                    {firstName} {middleName ? middleName + " " : ""}
                                    {lastName}
                                  </h1>
                                  <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                                    Customer
                                  </span>
                                </div>
                                {selectedLocation && (
                                  <div className="flex items-center gap-2 mt-1 text-gray-600">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="16"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="lucide lucide-map-pin"
                                    >
                                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                                      <circle cx="12" cy="10" r="3" />
                                    </svg>
                                    <span>{selectedLocation.name}</span>
                                    {selectedLocation.zipCode && (
                                      <span className="text-sky-600 text-sm">({selectedLocation.zipCode})</span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>

                            {bio && <p className="text-gray-600 max-w-2xl mb-6">{bio}</p>}
                          </div>
                        </div>
                      </div>

                      {/* Tabs Navigation */}
                      <div className="border-b border-gray-200 mb-6">
                        <nav className="flex -mb-px overflow-x-auto">
                          <button
                            type="button"
                            className="py-4 px-6 font-medium text-sm border-b-2 border-sky-500 text-sky-500 flex items-center gap-2 whitespace-nowrap"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="lucide lucide-user"
                            >
                              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                              <circle cx="12" cy="7" r="4" />
                            </svg>
                            Personal Info
                          </button>
                        </nav>
                      </div>

                      {/* Personal Information Section */}
                      <div className="bg-white rounded-xl p-6 mb-6 border border-gray-100">
                        <div className="flex justify-between items-center mb-6">
                          <h2 className="text-xl font-semibold">Personal Information</h2>
                        </div>

                        <div className="bg-white rounded-xl p-6">
                          <h3 className="text-lg font-semibold mb-6">Basic Information</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="text-sm font-medium text-gray-500 mb-1">Full Name</h4>
                              <p className="text-gray-900">
                                {firstName} {middleName ? middleName + " " : ""}
                                {lastName}
                              </p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-500 mb-1">Email</h4>
                              <p className="text-gray-900">{email}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-500 mb-1">Phone</h4>
                              <p className="text-gray-900">{mobileNumber}</p>
                            </div>
                            {selectedLocation && (
                              <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-1">Location</h4>
                                <p className="text-gray-900 flex items-center">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-4 w-4 text-gray-400 mr-1"
                                  >
                                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                                    <circle cx="12" cy="10" r="3" />
                                  </svg>
                                  {selectedLocation.name}
                                  {selectedLocation.zipCode && (
                                    <span className="ml-1 text-sky-600">({selectedLocation.zipCode})</span>
                                  )}
                                </p>
                              </div>
                            )}
                            <div>
                              <h4 className="text-sm font-medium text-gray-500 mb-1">Gender</h4>
                              <p className="text-gray-900 capitalize">{gender}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-500 mb-1">Account Type</h4>
                              <p className="text-gray-900">
                                <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                                  Customer
                                </span>
                                <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                                  Pending
                                </span>
                              </p>
                            </div>
                          </div>
                          {bio && (
                            <div className="mt-6">
                              <h4 className="text-sm font-medium text-gray-500 mb-1">Bio</h4>
                              <p className="text-gray-900">{bio}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 p-4 bg-sky-50 border border-sky-100 rounded-lg">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 mt-0.5">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-sky-500"
                            >
                              <circle cx="12" cy="12" r="10"></circle>
                              <line x1="12" y1="16" x2="12" y2="12"></line>
                              <line x1="12" y1="8" x2="12.01" y2="8"></line>
                            </svg>
                          </div>
                          <div className="ml-3">
                            <h5 className="text-sm font-medium text-sky-800">Please review your information</h5>
                            <p className="mt-1 text-sm text-sky-700">
                              This is how your profile will appear to others. Make sure all the information is correct
                              before creating your account. You can go back to previous steps to make changes.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Navigation buttons with SwiftUI-like design */}
                <div className="flex justify-between mt-8">
                  <button
                    type="button"
                    onClick={goToPreviousStep}
                    disabled={currentStep === 1}
                    className={`group px-4 py-2 flex items-center rounded-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-300 ${
                      currentStep === 1 ? "opacity-0 pointer-events-none" : "hover:shadow-sm"
                    }`}
                  >
                    <ChevronLeft className="mr-1 h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
                    <span>Back</span>
                  </button>

                  {currentStep < 4 ? (
                    <button
                      type="button"
                      onClick={goToNextStep}
                      disabled={
                        (currentStep === 1 && !isStep1Valid()) ||
                        (currentStep === 2 && !isStep2Valid()) ||
                        (currentStep === 3 && !isStep3Valid())
                      }
                      className={`group px-4 py-2 flex items-center rounded-full text-white transition-all duration-300 ${
                        (currentStep === 1 && !isStep1Valid()) ||
                        (currentStep === 2 && !isStep2Valid()) ||
                        (currentStep === 3 && !isStep3Valid())
                          ? "bg-sky-300 cursor-not-allowed"
                          : "bg-sky-500 hover:bg-sky-600 hover:shadow-md"
                      }`}
                    >
                      <span>Next</span>
                      <ChevronRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={loading}
                      className={`px-5 py-2 rounded-full transition-all duration-300 hover:shadow-md flex items-center ${
                        loading ? "bg-gray-400 cursor-not-allowed" : "bg-sky-500 hover:bg-sky-600 text-white"
                      }`}
                    >
                      {loading ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Success Modal - Similar to the one in Transaction.tsx */}
        {isSuccessModalOpen && (
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
                  Registration Successful!
                </h3>

                <p className="text-gray-600 mb-6" style={{ animation: "fadeIn 0.5s ease-out 0.2s both" }}>
                  Your account has been created successfully. You can now log in to access all features.
                </p>

                <button
                  onClick={handleSuccessModalClose}
                  className="px-8 py-3 bg-blue-500 text-white rounded-full font-medium shadow-sm hover:bg-blue-600 active:scale-95 transition-all duration-200"
                  style={{ animation: "fadeIn 0.5s ease-out 0.3s both" }}
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Location selection modal - only render if not in parent modal */}
        {showLocationModal && !parentModal && !minimalMode && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/20" onClick={() => setShowLocationModal(false)}></div>
            <div className="relative bg-white rounded-xl w-full max-w-3xl max-h-[80vh] overflow-auto p-4 z-10">
              <LocationSelector
                isOpen={showLocationModal}
                onClose={() => setShowLocationModal(false)}
                onSelectLocation={(location) => {
                  handleLocationSelect(location)
                  setShowLocationModal(false)
                }}
                companyLocation={companyLocation}
                previousLocation={selectedLocation}
              />
            </div>
          </div>
        )}

        {/* Location selection - render directly in parent modal */}
        {showLocationModal && parentModal && !minimalMode && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/20" onClick={() => setShowLocationModal(false)}></div>
            <div className="relative bg-white rounded-xl w-full max-w-3xl max-h-[80vh] overflow-auto p-4 z-10">
              <LocationSelector
                isOpen={showLocationModal}
                onClose={() => setShowLocationModal(false)}
                onSelectLocation={(location) => {
                  handleLocationSelect(location)
                  setShowLocationModal(false)
                }}
                companyLocation={companyLocation}
                previousLocation={selectedLocation}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}