import type React from "react"
import { useState, useEffect } from "react"
import MyFloatingDockCeo from "../Styles/MyFloatingDock-COO"
import { Dialog, Switch, DialogPanel, DialogTitle } from "@headlessui/react"
import {
  MapPin,
  ChevronRight,
  Camera,
  X,
  CheckCircle,
  Plus,
  ArrowLeft,
  ArrowRight,
  DollarSign,
  Clipboard,
  FileText,
  Lock,
  Trash2,
  User,
  Crown,
  Sparkles,
  Calendar,
  Check,
  CheckCircle2,
  ChevronLeft,
  Upload,
} from "lucide-react"
import PleaseWaitModal from "../Styles/PleaseWaitModal"
import AdvertisementFlowModal from "../Styles/AdvertisementModal"
import image1 from "../../assets/No_Image_Available.jpg"
import confetti from "canvas-confetti"

import {
  type Service,
  type Booking,
  type PersonalInfo,
  type SubscriptionTier,
  type SubscriptionInfo,
  bookings as initialBookings,
  personalInfo as initialPersonalInfo,
  subscriptionPlans,
  companyDetails,
  userDetails,
} from "./bookings-data"
import Footer from "../Styles/Footer"
import SubscriptionInfoCard from "./SubInfoCard"

const keyframes = `
@keyframes fadeIn {
from { opacity: 0; }
to { opacity: 1; }
}

@keyframes bounceIn {
0% { transform: scale(0); opacity: 0; }
60% { transform: scale(1.2); }
100% { transform: scale(1); opacity: 1; }
}

@keyframes slideInUp {
from { transform: translateY(20px); opacity: 0; }
to { opacity: 1; }
}

@keyframes shakeX {
0%, 100% { transform: translateX(0); }
10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
20%, 40%, 60%, 80% { transform: translateX(10px); }
}

@keyframes countdown {
from { width: 100%; }
to { width: 0%; }
}

@keyframes pulse {
0% { transform: scale(1); }
50% { transform: scale(1.05); }
100% { transform: scale(1); }
}
`

function Bookings() {
  const [showNotification] = useState(true)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("services")

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [editedService, setEditedService] = useState<Partial<Service>>({})

  const [isCreateServiceModalOpen, setIsCreateServiceModalOpen] = useState(false)
  const [createServiceStep, setCreateServiceStep] = useState(1)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [totalSteps] = useState(3)
  const [subscription, setSubscription] = useState<SubscriptionInfo>({
    tier: "free",
    maxServices: 3,
    name: "Freebie",
    color: "text-gray-600",
    price: 0,
    billingCycle: "Monthly",
    nextBillingDate: "N/A",
  })

  const [isPlansModalOpen, setIsPlansModalOpen] = useState(false)
  const [isYearlyBilling, setIsYearlyBilling] = useState(false) // New state for billing toggle
  const [newService, setNewService] = useState<Partial<Service>>({
    name: "",
    price: 0,
    description: "",
    image: "",
    chargePerKm: 0,
  })
  const [requirements, setRequirements] = useState({
    backgroundCheck: { met: false, previewUrl: null as string | null },
    serviceAgreement: { met: false, previewUrl: null as string | null },
  })

  const [selectedInfo] = useState<PersonalInfo | null>(null)
  const [isDeleteInfoConfirmOpen, setIsDeleteInfoConfirmOpen] = useState(false)

  const [services, setServices] = useState<Service[]>([])
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo[]>(initialPersonalInfo)
  const [bookings, setBookings] = useState<Booking[]>(initialBookings)

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(8)

  // Service creation processing state
  const [isProcessing, setIsProcessing] = useState(false)

  // New states for service termination
  const [isTerminationModalOpen, setIsTerminationModalOpen] = useState(false)
  const [terminationStep, setTerminationStep] = useState(1) // 1: Strategic, 2: Legal, 3: Financial, 4: Scheduled
  const [serviceToTerminate, setServiceToTerminate] = useState<Service | null>(null)
  const [terminationReason, setTerminationReason] = useState("")
  const [legalReviewNotes, setLegalReviewNotes] = useState("")
  const [financialAuditNotes, setFinancialAuditNotes] = useState("")
  const [terminationTimer, setTerminationTimer] = useState<number | null>(null) // seconds remaining
  const [isTerminationScheduled, setIsTerminationScheduled] = useState(false)
  const [terminationStartTime, setTerminationStartTime] = useState<number | null>(null) // timestamp

  // Add new state variables for the advertisement flow modal
  const [isAdvertiseFlowModalOpen, setIsAdvertiseFlowModalOpen] = useState(0) // Changed to number for step
  const [advertiseFlowStep, setAdvertiseFlowStep] = useState(1) // 1: Ask to advertise, 2: Choose plan

  // New state for please wait modal
  const [isPleaseWaitModalOpen, setIsPleaseWaitModalOpen] = useState(false)

  // const TERMINATION_DURATION_MS = 2 * 24 * 60 * 60 * 1000 = 2 days in milliseconds
  const TERMINATION_DURATION_MS = 5

  const terminationReasonsOptions = [
    "Not Profitable",
    "Outdated Service",
    "Low Demand",
    "Resource Constraints",
    "Strategic Shift",
    "Other",
  ]
  const triggerCelebration = () => {
    const duration = 3000
    const animationEnd = Date.now() + duration

    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 }

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: randomInRange(0.3, 0.7) },
        colors: ["#26ccff", "#a25afd", "#ff5e7e", "#88ff5a", "#fcff42", "#ffa62d", "#ff36ff"],
      })

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: randomInRange(0.3, 0.7) },
        colors: ["#26ccff", "#a25afd", "#ff5e7e", "#88ff5a", "#fcff42", "#ffa62d", "#ff36ff"],
      })
    }, 250)
  }

  // useEffect to fetch services on component mount
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const token = localStorage.getItem("token") // Get token from localStorage
        const userId = localStorage.getItem("userId") // Get userId from localStorage

        if (!token) {
          console.warn("No authentication token found. Cannot fetch services.")
          // Optionally, redirect to login or show a message
          return
        }

        // For demonstration, log the userId from localStorage
        console.log("Current user ID from localStorage:", userId)

        const response = await fetch("http://localhost:3000/api/services", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          // Map _id to id and ensure image fallback, and include cooId
          const fetchedServices: Service[] = data.services.map((s: any) => ({
            id: s._id,
            name: s.name,
            price: s.price,
            description: s.description,
            image: s.image || image1, // Use image1 as fallback
            chargePerKm: s.chargePerKm,
            hasNotification: false, // Default for fetched services
            notificationCount: 0, // Default for fetched services
            cooId: s.cooId, // Include the cooId from the fetched service
          }))
          setServices(fetchedServices)
        } else {
          console.error("Failed to fetch services:", response.status, response.statusText)
          // Handle specific error messages from backend if available
          const errorData = await response.json()
          setSuccessMessage(`Failed to load services: ${errorData.message || "Please try again."}`)
          setIsSuccessModalOpen(true)
        }
      } catch (error) {
        console.error("Network error fetching services:", error)
        setSuccessMessage("Network error: Could not connect to the server to fetch services.")
        setIsSuccessModalOpen(true)
      }
    }

    fetchServices()
  }, []) // Empty dependency array means this runs once on mount

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const upgradedTier = urlParams.get("upgradedTier")

    if (upgradedTier) {
      const plan = subscriptionPlans.find((plan) => plan.tier === upgradedTier)

      if (plan) {
        setSubscription({
          tier: plan.tier as SubscriptionTier,
          maxServices: plan.maxServices,
          name: plan.name,
          color: plan.textColor,
          price: plan.price,
          billingCycle: isYearlyBilling ? "Yearly" : "Monthly", // Use isYearlyBilling
          nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        })

        setSuccessMessage(
          `You've successfully upgraded to the ${plan.name} plan! You can now add up to ${plan.maxServices === Number.POSITIVE_INFINITY ? "unlimited" : plan.maxServices} services.`,
        )
        setIsSuccessModalOpen(true)
        setTimeout(() => {
          triggerCelebration()
        }, 500)

        window.history.replaceState({}, document.title, window.location.pathname)
      }
    }
  }, [isYearlyBilling])

  // Get current items for pagination
  const getCurrentItems = () => {
    if (activeTab === "services") {
      const indexOfLastItem = currentPage * itemsPerPage
      const indexOfFirstItem = indexOfLastItem - itemsPerPage
      return services.slice(indexOfFirstItem, indexOfLastItem)
    } else {
      const filteredBookingsForTab = bookings.filter((booking) => {
        if (activeTab === "ongoing") return booking.status === "ongoing"
        if (activeTab === "pending") return booking.status === "pending"
        if (activeTab === "completed") return booking.status === "completed"
        return true
      })
      const indexOfLastItem = currentPage * itemsPerPage
      const indexOfFirstItem = indexOfLastItem - itemsPerPage
      return filteredBookingsForTab.slice(indexOfFirstItem, indexOfLastItem)
    }
  }

  // Get total pages
  const getTotalPages = () => {
    if (activeTab === "services") {
      return Math.ceil(services.length / itemsPerPage)
    } else {
      const filteredBookingsForTab = bookings.filter((booking) => {
        if (activeTab === "ongoing") return booking.status === "ongoing"
        if (activeTab === "pending") return booking.status === "pending"
        if (activeTab === "completed") return booking.status === "completed"
        return true
      })
      return Math.ceil(filteredBookingsForTab.length / itemsPerPage)
    }
  }

  // Reset pagination when tab changes
  useEffect(() => {
    setCurrentPage(1)
  }, [activeTab])

  const filteredBookings = bookings.filter((booking) => {
    if (activeTab === "ongoing") return booking.status === "ongoing"
    if (activeTab === "pending") return booking.status === "pending"
    if (activeTab === "completed") return booking.status === "completed"
    return true
  })

  const handleEditService = (service: Service) => {
    setSelectedService(service)
    setEditedService({
      name: service.name,
      price: service.price,
      image: service.image,
      chargePerKm: service.chargePerKm,
      description: service.description,
    })
    setIsEditModalOpen(true)
  }

  // handle delete service to open new termination modal
  const handleDeleteService = (service: Service) => {
    setServiceToTerminate(service)
    setIsTerminationModalOpen(true)
    setTerminationStep(1) // Start at the first step of the termination process
    setTerminationReason("")
    setLegalReviewNotes("")
    setFinancialAuditNotes("")
    setIsTerminationScheduled(false) // Ensure it's not scheduled initially
    setTerminationTimer(null)
    setTerminationStartTime(null)
  }

  const handleSaveService = async () => {
    // This function is currently a placeholder.
    // In a real application, you would send the updated service data to your backend.
    if (selectedService && editedService) {
      const updatedServices = services.map((s) => (s.id === selectedService.id ? { ...s, ...editedService } : s))
      setServices(updatedServices)
      setIsEditModalOpen(false)
      setSuccessMessage(`Service "${editedService.name}" updated successfully!`)
      setIsSuccessModalOpen(true)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    if (name === "price" || name === "chargePerKm") {
      setEditedService({
        ...editedService,
        [name]: Number.parseInt(value) || 0,
      })
    } else {
      setEditedService({
        ...editedService,
        [name]: value,
      })
    }
  }

  const handleNewServiceInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    if (name === "price" || name === "chargePerKm") {
      setNewService({
        ...newService,
        [name]: Number.parseInt(value) || 0,
      })
    } else {
      setNewService({
        ...newService,
        [name]: value,
      })
    }
  }

  const handleRequirementFileChange = (e: React.ChangeEvent<HTMLInputElement>, key: keyof typeof requirements) => {
    const file = e.target.files?.[0]
    if (file) {
      const previewUrl = URL.createObjectURL(file)
      setRequirements((prev) => ({
        ...prev,
        [key]: { met: true, previewUrl },
      }))
    } else {
      setRequirements((prev) => ({
        ...prev,
        [key]: { met: false, previewUrl: null },
      }))
    }
  }

  const handleBookingClick = (booking: Booking) => {
    setSelectedBooking(booking)
    setIsModalOpen(true)
  }

  const handleCreateService = () => {
    if (services.length >= subscription.maxServices) {
      setIsPlansModalOpen(true)
      return
    }

    setIsCreateServiceModalOpen(true)
    setCreateServiceStep(1)
    setNewService({
      name: "",
      price: 0,
      description: "",
      image: "",
      chargePerKm: 0,
    })
    setRequirements({
      backgroundCheck: { met: false, previewUrl: null as string | null },
      serviceAgreement: { met: false, previewUrl: null as string | null },
    })
  }

  const handleNextStep = () => {
    if (createServiceStep < totalSteps) {
      setCreateServiceStep(createServiceStep + 1)
    }
  }

  const handlePrevStep = () => {
    if (createServiceStep > 1) {
      setCreateServiceStep(createServiceStep - 1)
    }
  }

  const handleSubmitNewService = async () => {
    if (!allRequirementsMet) return

    setIsPleaseWaitModalOpen(true) // Show please wait modal
    setIsProcessing(true) // Indicate processing

    try {
      // Retrieve the JWT token from localStorage or wherever it's stored
      const token = localStorage.getItem("token") // Assuming token is stored in localStorage

      if (!token) {
        console.error("Authentication token not found.")
        setSuccessMessage("Error: Authentication required to create service.")
        setIsSuccessModalOpen(true)
        setIsPleaseWaitModalOpen(false) // Close please wait immediately
        return
      }

      const response = await fetch("http://localhost:3000/api/services/create", {
        // Use your backend URL
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
        body: JSON.stringify(newService),
      })

      const data = await response.json()

      if (response.ok) {
        // Add the new service to the local state
        const createdService = {
          id: data.service._id || Date.now().toString(), // Fallback ID if _id is not available
          name: data.service.name,
          price: data.service.price,
          description: data.service.description,
          image: data.service.image || image1,
          chargePerKm: data.service.chargePerKm,
          hasNotification: false,
          notificationCount: 0,
          cooId: data.service.cooId, // Include the cooId
        }

        setServices((prevServices) => [...prevServices, createdService])
        setIsCreateServiceModalOpen(false) // Close the creation form

        // Check AI classification result
        if (data.aiClassification && !data.aiClassification.isValid) {
          setSuccessMessage(
            `Service created, but AI flagged it as potentially invalid: ${data.aiClassification.reason || "No specific reason provided."} It will be listed under "Invalid Service".`,
          )
        } else {
          setSuccessMessage("Service created successfully! AI is reviewing for optimal placement.")
        }

        // Wait for 5 seconds for the "Please Wait" modal
        await new Promise((resolve) => setTimeout(resolve, 5000))

        setIsPleaseWaitModalOpen(false) // Close please wait modal
        setIsAdvertiseFlowModalOpen(1) // Open advertisement modal (step 1)
        setAdvertiseFlowStep(1)
      } else {
        console.error("Error creating service:", data.message || "Unknown error")
        setSuccessMessage(`Failed to create service: ${data.message || "Please try again."}`)
        setIsSuccessModalOpen(true)
        setIsPleaseWaitModalOpen(false) // Close please wait immediately on error
      }
    } catch (error) {
      console.error("Network error creating service:", error)
      setSuccessMessage("Network error: Could not connect to the server.")
      setIsSuccessModalOpen(true)
      setIsPleaseWaitModalOpen(false) // Close please wait immediately on network error
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSelectPlan = (tier: SubscriptionTier) => {
    const selectedPlan = subscriptionPlans.find((plan) => plan.tier === tier)

    if (selectedPlan) {
      const priceToUse = isYearlyBilling ? selectedPlan.yearlyPrice : selectedPlan.price
      window.location.href = `/transaction?plan=${tier}&price=${priceToUse}&redirect=/ceo/bookings`
    }
  }

  const handleConfirmDeleteInfo = () => {
    if (!selectedInfo) return

    const filteredInfo = personalInfo.filter((info) => info.id !== selectedInfo.id)

    setPersonalInfo(filteredInfo)
    setIsDeleteInfoConfirmOpen(false)
  }

  const allRequirementsMet = Object.values(requirements).every((req) => req.met === true)

  const renderCreateServiceStepContent = () => {
    switch (createServiceStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-medium text-gray-700 mb-2">Service Information</h3>
              <p className="text-gray-600">Enter the basic details about your service</p>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Service Name*
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newService.name || ""}
                  onChange={handleNewServiceInputChange}
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-900"
                  placeholder="Enter service name"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description*
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={newService.description || ""}
                  onChange={handleNewServiceInputChange}
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 min-h-[120px] text-gray-900"
                  placeholder="Describe your service"
                  required
                />
              </div>

              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL
                </label>
                <input
                  type="text"
                  id="image"
                  name="image"
                  value={newService.image || ""}
                  onChange={handleNewServiceInputChange}
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-900"
                  placeholder="Enter image URL or leave blank for default"
                />
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-medium text-gray-700 mb-2">Pricing Information</h3>
              <p className="text-gray-600">Set your service rates and charges</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                  Base Service Rate (₱)*
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={newService.price || ""}
                  onChange={handleNewServiceInputChange}
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-900"
                  min="0"
                  placeholder="0"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">This is the starting price for your service</p>
              </div>

              <div>
                <label htmlFor="chargePerKm" className="block text-sm font-medium text-gray-700 mb-2">
                  Charge Per KM (₱)*
                </label>
                <input
                  type="number"
                  id="chargePerKm"
                  name="chargePerKm"
                  value={newService.chargePerKm || ""}
                  onChange={handleNewServiceInputChange}
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-900"
                  min="0"
                  placeholder="0"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Additional charge per kilometer of travel distance</p>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800 text-sm">
              <p className="font-medium">💡 Pricing Recommendations</p>
              <p className="mt-1">Consider your expenses, market rates, and profit margin when setting prices.</p>
            </div>

            <div className="bg-gray-100 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Preview</h4>
              <div className="text-sm text-gray-600">
                <p>Base Rate: ₱{(newService.price || 0).toLocaleString()}</p>
                <p>Per KM: ₱{(newService.chargePerKm || 0).toLocaleString()}</p>
                <p className="mt-2 text-xs">
                  Example: 5km service = ₱
                  {((newService.price || 0) + (newService.chargePerKm || 0) * 5).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-medium text-gray-700 mb-2">Service Requirements</h3>
              <p className="text-gray-600">Confirm you have all required documents and qualifications</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {[
                  { key: "backgroundCheck", label: "Background Check", desc: "Consent to background verification" },
                  {
                    key: "serviceAgreement",
                    label: "Service Agreement",
                    desc: "Acceptance of platform terms and conditions",
                  },
                ].map((req) => (
                  <div key={req.key} className="flex flex-col">
                    <label htmlFor={`file-${req.key}`} className="block text-sm font-medium text-gray-700 mb-1">
                      {req.label}
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <p className="text-xs text-gray-500 mb-2">{req.desc}</p>
                    <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 focus-within:ring-2 focus:ring-sky-500">
                      <input
                        type="file"
                        id={`file-${req.key}`}
                        name={`file-${req.key}`}
                        onChange={(e) => handleRequirementFileChange(e, req.key as keyof typeof requirements)}
                        className="hidden"
                        accept="image/*" // Accept only image files
                      />
                      <button
                        type="button"
                        onClick={() => document.getElementById(`file-${req.key}`)?.click()}
                        className="flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Choose File
                      </button>
                      <span className="ml-3 text-sm text-gray-500 truncate">
                        {requirements[req.key as keyof typeof requirements].met ? "File attached" : "No file chosen"}
                      </span>
                    </div>
                    {requirements[req.key as keyof typeof requirements].previewUrl && (
                      <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden">
                        <img
                          src={requirements[req.key as keyof typeof requirements].previewUrl || ""}
                          alt={`Preview of ${req.label}`}
                          className="w-full h-32 object-cover"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {!allRequirementsMet && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 text-sm">
                <p className="font-medium">⚠️ All requirements must be met</p>
                <p className="mt-1">Please attach a file for each requirement to proceed.</p>
              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  const renderTabContent = () => {
    if (activeTab === "services") {
      const currentServices = getCurrentItems() as Service[]
      const totalPages = getTotalPages()

      if (services.length === 0) {
        return (
          <div className="flex flex-col items-center justify-center py-16 px-4 bg-gray-100/50 rounded-2xl">
            <div className="text-center max-w-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Services Available</h3>
              <p className="text-gray-600 mb-6">
                You haven't added any services yet. Add your first service to start receiving bookings.
              </p>
              <button
                onClick={handleCreateService}
                className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-all flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Service
              </button>
            </div>
          </div>
        )
      }

      return (
        <div className="flex flex-col">
          {/* Subscription info banner */}
          <div
            className={`mb-6 p-4 rounded-lg flex items-center ${
              services.length >= subscription.maxServices
                ? "bg-red-50 border border-red-200"
                : "bg-gray-50 border border-gray-200"
            }`}
          >
            <div className="flex items-center">
              <Crown className={`h-5 w-5 mr-2 ${subscription.color}`} />
              <div>
                <h3 className="font-medium">
                  {subscription.name} Plan
                  <span
                    className={`ml-2 text-sm ${
                      services.length >= subscription.maxServices ? "text-red-600" : "text-gray-600"
                    }`}
                  >
                    ({services.length}/
                    {subscription.maxServices === Number.POSITIVE_INFINITY ? "∞" : subscription.maxServices})
                  </span>
                </h3>
                <p className="text-sm text-gray-600">
                  {services.length >= subscription.maxServices
                    ? "You've reached your service limit."
                    : `You can add ${subscription.maxServices - services.length} more service${
                        subscription.maxServices - services.length !== 1 ? "s" : ""
                      }.`}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {currentServices.map((service) => (
              <div key={service.id} className="bg-gray-200/70 rounded-3xl p-6 relative flex flex-col h-[450px]">
                {service.hasNotification && showNotification && (
                  <div className="absolute -top-2 -right-2 z-10">
                    <div className="relative">
                      <div className="absolute -top-1 -right-1 animate-ping h-6 w-6 rounded-full bg-red-400 opacity-75"></div>
                      <div className="relative bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {service.notificationCount}
                      </div>
                    </div>
                  </div>
                )}

                {isTerminationScheduled && service.id === serviceToTerminate?.id ? (
                  <div
                    className="absolute inset-0 bg-white/90 backdrop-blur-xl rounded-3xl overflow-hidden transform transition-all border border-gray-400/50 p-6 z-20 flex flex-col items-center justify-center text-center"
                    style={{ animation: "fadeIn 0.5s ease-out" }}
                  >
                    <div
                      className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-6"
                      style={{ animation: "pulse 2s ease-in-out infinite" }}
                    >
                      <Trash2 className="h-10 w-10 text-red-500" style={{ animation: "bounceIn 0.6s ease-out" }} />
                    </div>

                    <h3
                      className="text-xl font-medium text-gray-900 mb-2"
                      style={{ animation: "slideInUp 0.4s ease-out" }}
                    >
                      Termination Scheduled!
                    </h3>

                    <p className="text-gray-600 mb-4" style={{ animation: "fadeIn 0.5s ease-out 0.2s both" }}>
                      This service will be permanently removed in:
                    </p>

                    <div
                      className="text-3xl font-medium text-red-500 tracking-tight mb-6"
                      style={{ animation: "fadeIn 0.5s ease-out 0.3s both" }}
                    >
                      {formatTime(terminationTimer)}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation() // Prevent opening the service details modal
                        setIsTerminationModalOpen(true)
                        setTerminationStep(4) // Ensure it opens to the scheduled view
                      }}
                      className="px-6 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all"
                      style={{ animation: "fadeIn 0.5s ease-out 0.4s both" }}
                    >
                      View Details / Cancel
                    </button>
                  </div>
                ) : null}

                <div className="absolute top-4 right-4 flex space-x-2 z-10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEditService(service)
                    }}
                    className={`bg-white/80 backdrop-blur-sm p-1.5 rounded-full hover:bg-white transition-all text-gray-600 ${
                      isTerminationScheduled && service.id === serviceToTerminate?.id
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    disabled={isTerminationScheduled && service.id === serviceToTerminate?.id}
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
                      className="lucide lucide-pencil"
                    >
                      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                      <path d="m15 5 4 4" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteService(service)
                    }}
                    className={`bg-white/80 backdrop-blur-sm p-1.5 rounded-full hover:bg-white transition-all text-red-500 ${
                      isTerminationScheduled && service.id === serviceToTerminate?.id
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    disabled={isTerminationScheduled && service.id === serviceToTerminate?.id}
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
                      className="lucide lucide-trash-2"
                    >
                      <path d="M3 6h18" />
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                      <line x1="10" x2="10" y1="11" y2="17" />
                      <line x1="14" x2="14" y1="11" y2="17" />
                    </svg>
                  </button>
                </div>
                <div className="relative overflow-hidden rounded-2xl mb-4">
                  <img src={service.image || image1} alt={service.name} className="w-full h-48 object-cover" />
                </div>
                <h3 className="text-xl font-light mb-2">{service.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">{service.description}</p>
                <div className="flex flex-col gap-1 mt-auto">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Starting Rate:</span>
                    <span className="text-lg font-medium">₱{service.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Per KM Charge:</span>
                    <span className="text-base">₱{service.chargePerKm.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-8 space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg ${
                  currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 rounded-lg ${
                    currentPage === page ? "bg-sky-500 text-white" : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg ${
                  currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}

          {/* Create Service button moved to the bottom */}
          <div className="mt-10 flex justify-center">
            <button
              onClick={handleCreateService}
              className={`px-6 py-3 rounded-full flex items-center gap-2 ${
                services.length >= subscription.maxServices
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-sky-500 text-white hover:bg-sky-600"
              }`}
              disabled={services.length >= subscription.maxServices}
            >
              <Plus className="h-4 w-4" />
              {services.length >= subscription.maxServices ? "Service Limit Reached" : "Create Service"}
            </button>
          </div>
        </div>
      )
    } else if (activeTab === "ongoing" || activeTab === "pending" || activeTab === "completed") {
      const currentBookings = getCurrentItems() as Booking[]
      const totalPages = getTotalPages()

      if (filteredBookings.length === 0) {
        let emptyMessage = ""
        let emptyDescription = ""

        if (activeTab === "ongoing") {
          emptyMessage = "No Ongoing Bookings"
          emptyDescription = "You don't have any ongoing bookings at the moment."
        } else if (activeTab === "pending") {
          emptyMessage = "No Pending Bookings"
          emptyDescription = "You don't have any pending bookings waiting for approval."
        } else if (activeTab === "completed") {
          emptyMessage = "No Completed Bookings"
          emptyDescription = "You haven't completed any bookings yet."
        }

        return (
          <div className="flex flex-col items-center justify-center py-16 px-4 bg-gray-100/50 rounded-2xl">
            <div className="text-center max-w-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{emptyMessage}</h3>
              <p className="text-gray-600 mb-6">{emptyDescription}</p>
              <button
                onClick={handleCreateService}
                className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-all flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Service
              </button>
            </div>
          </div>
        )
      }

      return (
        <div className="flex flex-col">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {currentBookings.map((booking) => (
              <div key={booking.id} className="bg-gray-200/70 rounded-3xl p-6 flex flex-col h-[450px]">
                <div className="relative overflow-hidden rounded-2xl mb-4">
                  <img src={booking.image || image1} alt={booking.serviceName} className="w-full h-48 object-cover" />
                </div>
                <h3 className="text-xl font-light mb-2">{booking.serviceName}</h3>
                <div className="space-y-2 flex-grow">
                  <p className="text-gray-600 text-sm">
                    <span className="font-medium">Customer:</span> {booking.customerName}
                  </p>
                  <p className="text-gray-600 text-sm">
                    <span className="font-medium">Date:</span> {new Date(booking.date).toLocaleDateString()},{" "}
                    {booking.time}
                  </p>
                  <p className="text-gray-600 text-sm">
                    <span className="font-medium">Location:</span> {booking.location}
                  </p>
                </div>
                <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
                  <div className="text-lg font-medium">₱{booking.total.toLocaleString()}</div>
                  <button
                    onClick={() => handleBookingClick(booking)}
                    className="text-sky-500 hover:text-sky-600 flex items-center gap-1 group"
                  >
                    Details
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination for bookings */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-8 space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg ${
                  currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 rounded-lg ${
                    currentPage === page ? "bg-sky-500 text-white" : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg ${
                  currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      )
    } else if (activeTab === "personal") {
      return (
        <div className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-3xl shadow-sm p-6">
            <h3 className="text-xl font-semibold mb-6">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Full Name</h4>
                <p className="text-gray-900">{userDetails.name}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Email</h4>
                <p className="text-gray-900">{userDetails.email}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Phone</h4>
                <p className="text-gray-900">{userDetails.phone}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Location</h4>
                <p className="text-gray-900 flex items-center">
                  <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                  <span>{userDetails.location}</span>
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Birthday</h4>
                <p className="text-gray-900">{new Date(userDetails.birthday).toLocaleDateString()}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Gender</h4>
                <p className="text-gray-900">{userDetails.gender}</p>
              </div>
            </div>
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-500 mb-1">Bio</h4>
              <p className="text-gray-900">{userDetails.description}</p>
            </div>
          </div>

          {/* Subscription Information - Apple-inspired design */}
          <SubscriptionInfoCard
            subscription={subscription}
            currentServicesCount={services.length}
            onOpenPlansModal={() => setIsPlansModalOpen(true)}
          />
        </div>
      )
    } else if (activeTab === "security") {
      return (
        <div className="bg-white rounded-3xl shadow-sm p-6">
          <h3 className="text-xl font-semibold mb-6">Change Password</h3>
          <form className="space-y-4 max-w-md">
            <div>
              <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <input
                type="password"
                id="current-password"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="Enter your current password"
              />
            </div>
            <div>
              <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                id="new-password"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="Enter your new password"
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirm-password"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="Confirm your new password"
              />
            </div>
            <div className="pt-2">
              <button
                type="submit"
                className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-all"
              >
                Update Password
              </button>
            </div>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-xl font-semibold mb-6">Two-Factor Authentication</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-700 font-medium">Protect your account with 2FA</p>
                <p className="text-gray-500 text-sm mt-1">
                  Add an extra layer of security to your account by requiring both your password and authentication
                  code.
                </p>
              </div>
              <button className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-all">
                Enable 2FA
              </button>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-xl font-semibold mb-6">Login Sessions</h3>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">Current Session</p>
                    <p className="text-gray-500 text-sm mt-1">San Francisco, CA • Chrome on Windows</p>
                    <p className="text-gray-500 text-sm">Started: March 18, 2025 at 1:42 PM</p>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">Mobile App</p>
                    <p className="text-gray-500 text-sm mt-1">Los Angeles, CA • iPhone App</p>
                    <p className="text-gray-500 text-sm">Last active: March 17, 2025 at 8:30 AM</p>
                  </div>
                  <button className="text-red-500 text-sm hover:text-red-600">Revoke</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    } else if (activeTab === "delete") {
      return (
        <div className="bg-white rounded-3xl shadow-sm p-6">
          <h3 className="text-xl font-semibold mb-2 text-red-600">Delete Account</h3>
          <p className="text-gray-600 mb-6">Once you delete your account, there is no going back. Please be certain.</p>

          <div className="space-y-6">
            <div className="bg-red-50 border border-red-100 rounded-xl p-4">
              <h4 className="font-medium text-red-800 mb-2">Before you proceed, please understand:</h4>
              <ul className="list-disc pl-5 space-y-2 text-red-700 text-sm">
                <li>All your personal information will be permanently deleted</li>
                <li>Your service listings will be removed from the platform</li>
                <li>Your booking history will be anonymized</li>
                <li>You will lose access to any pending payments</li>
                <li>This action cannot be undone</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-xl p-4">
              <h4 className="font-medium mb-3">Deletion Process:</h4>
              <ol className="list-decimal pl-5 space-y-3 text-gray-700">
                <li>
                  <p className="font-medium">Request Account Deletion</p>
                  <p className="text-sm text-gray-600">
                    Submit your request by clicking the "Delete Account" button below.
                  </p>
                </li>
                <li>
                  <p className="font-medium">Verification</p>
                  <p className="text-sm text-gray-600">
                    We'll send a verification code to your email address to confirm your identity.
                  </p>
                </li>
                <li>
                  <p className="font-medium">Confirmation</p>
                  <p className="text-sm text-gray-600">
                    Enter the verification code and confirm your decision to delete your account.
                  </p>
                </li>
                <li>
                  <p className="font-medium">Account Deletion</p>
                  <p className="text-sm text-gray-600">
                    Your account will be scheduled for deletion. This process may take up to 30 days to complete.
                  </p>
                </li>
              </ol>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <p className="text-gray-700 mb-4">
                To proceed with account deletion, please type <span className="font-medium">"DELETE MY ACCOUNT"</span>{" "}
                in the field below:
              </p>
              <div className="mb-4">
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Type DELETE MY ACCOUNT"
                />
              </div>
              <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )
    }
  }

  const handleServiceTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditedService({
      ...editedService,
      [name]: value,
    })
  }

  const [ceoMarkedCompleted, setCeoMarkedCompleted] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [processingBookingId, setProcessingBookingId] = useState<number | null>(null)

  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false)
  const [declineReason, setDeclineReason] = useState("")

  const handleDeclineBooking = (bookingId: number) => {
    setIsLoading(true)
    setProcessingBookingId(bookingId)

    setTimeout(() => {
      const updatedBookings = bookings.filter((booking) => booking.id !== bookingId)

      setBookings(updatedBookings)
      setIsDeclineModalOpen(false)
      setIsModalOpen(false)
      setIsLoading(false)
      setProcessingBookingId(null)
      setDeclineReason("")
    }, 2000)
  }

  const handleMarkAsCompleted = (bookingId: number) => {
    if (!ceoMarkedCompleted.includes(bookingId)) {
      setCeoMarkedCompleted([...ceoMarkedCompleted, bookingId])
      setIsLoading(true)
      setProcessingBookingId(bookingId)

      setTimeout(() => {
        setIsLoading(false)
        setShowSuccess(true)

        // Show success modal with animation
        setSuccessMessage("Service completed successfully! Transaction has been processed.")
        setIsSuccessModalOpen(true)

        setTimeout(() => {
          const updatedBookings = bookings.map(
            (booking): Booking => (booking.id === bookingId ? { ...booking, status: "completed" as const } : booking),
          )

          setBookings(updatedBookings)
          setIsModalOpen(false)
          setShowSuccess(false)
          setProcessingBookingId(null)
          setIsSuccessModalOpen(false)
          setActiveTab("completed")
        }, 5000)
      }, 10000)
    }
  }

  const handleAcceptBooking = (bookingId: number) => {
    setIsLoading(true)
    setProcessingBookingId(bookingId)

    setTimeout(() => {
      const updatedBookings = bookings.map(
        (booking): Booking => (booking.id === bookingId ? { ...booking, status: "ongoing" as const } : booking),
      )

      setBookings(updatedBookings)

      // Show success modal
      setSuccessMessage("Booking accepted successfully!")
      setIsSuccessModalOpen(true)

      setTimeout(() => {
        setIsSuccessModalOpen(false)
        setActiveTab("ongoing")
      }, 5000)

      setIsModalOpen(false)
      setIsLoading(false)
      setProcessingBookingId(null)
    }, 5000)
  }

  // New functions for service termination
  const handleScheduleTermination = () => {
    if (!serviceToTerminate) return

    const startTime = Date.now()
    setTerminationStartTime(startTime)
    setIsTerminationScheduled(true)
    setTerminationTimer(Math.ceil(TERMINATION_DURATION_MS / 1000)) // Set initial timer in seconds
    setTerminationStep(4) // Move to scheduled view
    // setIsTerminationModalOpen(false); // Keep modal open to show timer

    // Store in localStorage for persistence
    localStorage.setItem("terminationServiceId", serviceToTerminate.id.toString())
    localStorage.setItem("terminationStartTime", startTime.toString())
    localStorage.setItem("terminationReason", terminationReason)
    localStorage.setItem("legalReviewNotes", legalReviewNotes)
    localStorage.setItem("financialAuditNotes", financialAuditNotes)
  }

  const handleCancelTermination = () => {
    setIsTerminationScheduled(false)
    setTerminationTimer(null)
    setTerminationStartTime(null)
    setServiceToTerminate(null)
    localStorage.removeItem("terminationServiceId")
    localStorage.removeItem("terminationStartTime")
    localStorage.removeItem("terminationReason")
    localStorage.removeItem("legalReviewNotes")
    localStorage.removeItem("financialAuditNotes")
    setIsTerminationModalOpen(false) // Close the modal
    setSuccessMessage("Service termination cancelled successfully.")
    setIsSuccessModalOpen(true)
  }

  // useEffect for timer countdown and actual deletion
  useEffect(() => {
    let timerInterval: NodeJS.Timeout | null = null

    if (isTerminationScheduled && terminationStartTime !== null) {
      timerInterval = setInterval(() => {
        const elapsed = Date.now() - terminationStartTime
        const remaining = TERMINATION_DURATION_MS - elapsed

        if (remaining <= 0) {
          // Time's up, perform actual deletion
          setServices((prevServices) => prevServices.filter((s) => s.id !== serviceToTerminate?.id))
          setIsTerminationScheduled(false)
          setTerminationTimer(null)
          setTerminationStartTime(null)
          setServiceToTerminate(null)
          localStorage.removeItem("terminationServiceId")
          localStorage.removeItem("terminationStartTime")
          localStorage.removeItem("terminationReason")
          localStorage.removeItem("legalReviewNotes")
          localStorage.removeItem("financialAuditNotes")
          setIsTerminationModalOpen(false) // Close the termination modal
          setIsSuccessModalOpen(true)
          setSuccessMessage(`Service "${serviceToTerminate?.name}" has been successfully terminated.`)
          if (timerInterval) clearInterval(timerInterval)
        } else {
          setTerminationTimer(Math.ceil(remaining / 1000))
        }
      }, 1000)
    } else if (timerInterval) {
      clearInterval(timerInterval)
    }

    return () => {
      if (timerInterval) clearInterval(timerInterval)
    }
  }, [isTerminationScheduled, terminationStartTime, serviceToTerminate, setServices])

  // useEffect to load termination state from localStorage on mount
  useEffect(() => {
    const storedServiceId = localStorage.getItem("terminationServiceId")
    const storedStartTime = localStorage.getItem("terminationStartTime")
    const storedReason = localStorage.getItem("terminationReason")
    const storedLegalNotes = localStorage.getItem("legalReviewNotes")
    const storedFinancialNotes = localStorage.getItem("financialAuditNotes")

    if (storedServiceId && storedStartTime) {
      // Only use the 'services' array to find the service to terminate
      const service = services.find((s) => String(s.id) === storedServiceId)
      if (service) {
        setServiceToTerminate(service)
        setTerminationStartTime(Number.parseInt(storedStartTime))
        setIsTerminationScheduled(true)
        setTerminationReason(storedReason || "")
        setLegalReviewNotes(storedLegalNotes || "")
        setFinancialAuditNotes(storedFinancialNotes || "")

        const elapsed = Date.now() - Number.parseInt(storedStartTime)
        const remaining = TERMINATION_DURATION_MS - elapsed
        if (remaining <= 0) {
          // If already expired, delete immediately
          setServices((prevServices) => prevServices.filter((s) => s.id !== service.id))
          setIsTerminationScheduled(false)
          setTerminationTimer(null)
          setTerminationStartTime(null)
          setServiceToTerminate(null)
          localStorage.removeItem("terminationServiceId")
          localStorage.removeItem("terminationStartTime")
          localStorage.removeItem("terminationReason")
          localStorage.removeItem("legalReviewNotes")
          localStorage.removeItem("financialAuditNotes")
          setIsSuccessModalOpen(true)
          setSuccessMessage(`Service "${service.name}" was terminated.`)
        } else {
          setTerminationTimer(Math.ceil(remaining / 1000))
          setIsTerminationModalOpen(true) // Re-open modal if termination is ongoing
          setTerminationStep(4) // Go directly to scheduled view
        }
      }
    }
  }, [services])

  // Helper to format time
  const formatTime = (seconds: number | null) => {
    if (seconds === null || seconds < 0) return "0d 00h 00m 00s"
    const days = Math.floor(seconds / (24 * 3600))
    const hours = Math.floor((seconds % (24 * 3600)) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${days}d ${hours.toString().padStart(2, "0")}h ${minutes.toString().padStart(2, "0")}m ${secs
      .toString()
      .padStart(2, "0")}s`
  }

  const handleConfirmAdvertisement = () => {
    setIsAdvertiseFlowModalOpen(0) // Close the advertisement flow modal
    setSuccessMessage("Service created and advertisement confirmed!") // Set success message
    setIsSuccessModalOpen(true) // Open success modal
    // Redirect to transaction page with advertisement details
    window.location.href = `/transaction?plan=advertisement&price=500&redirect=/ceo/bookings&userType=ceo`
  }

  return (
    <div className="min-h-screen bg-gray-50 font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,sans-serif]">
      <style>{keyframes}</style>
      {/* Floating Dock */}
      <div className="sticky top-0 z-40 flex">
        <MyFloatingDockCeo />
      </div>

      {/* Company Profile Section */}
      <div className="max-w-7xl mx-auto">
        {/* Cover Photo */}
        <div className="relative h-80 overflow-hidden rounded-b-3xl">
          <img src={companyDetails.coverPhoto || image1} alt="Cover" className="w-full h-full object-cover" />
          <button className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-all">
            <Camera className="h-5 w-5" />
          </button>
        </div>

        {/* Profile Info with Stats */}
        <div className="relative px-4 pb-8">
          <div className="absolute -top-16 left-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-white">
                <img
                  src={companyDetails.logo || image1}
                  alt={companyDetails.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md hover:bg-gray-50">
                <Camera className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="pt-20">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-normal text-gray-900">{companyDetails.name}</h1>
                <div className="flex items-center gap-2 mt-1 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{companyDetails.location}</span>
                </div>
              </div>
              <button className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-all">
                Edit Profile
              </button>
            </div>

            {/* Stats Section */}
            <div className="flex gap-6 mb-6">
              <div className="flex items-center gap-2">
                <div>
                  <div className="font-normal">{companyDetails.followers.toLocaleString() + "M"}</div>
                  <div className="text-sm text-gray-600">Followers</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div>
                  <div>6.7M</div>
                  <div className="text-sm text-gray-600">Reviews</div>
                </div>
              </div>
            </div>

            <p className="text-gray-600 max-w-2xl">{companyDetails.description}</p>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4">
            <nav className="flex -mb-px overflow-x-auto">
              <button
                onClick={() => setActiveTab("services")}
                className={`py-4 px-6 font-medium text-sm border-b-2 flex items-center gap-2 ${
                  activeTab === "services"
                    ? "border-sky-500 text-sky-500"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Services
              </button>
              <button
                onClick={() => setActiveTab("ongoing")}
                className={`py-4 px-6 font-medium text-sm border-b-2 flex items-center gap-2 ${
                  activeTab === "ongoing"
                    ? "border-sky-500 text-sky-500"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Ongoing Bookings
              </button>
              <button
                onClick={() => setActiveTab("pending")}
                className={`py-4 px-6 font-medium text-sm border-b-2 flex items-center gap-2 ${
                  activeTab === "pending"
                    ? "border-sky-500 text-sky-500"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Pending Bookings
              </button>
              <button
                onClick={() => setActiveTab("completed")}
                className={`py-4 px-6 font-medium text-sm border-b-2 flex items-center gap-2 ${
                  activeTab === "completed"
                    ? "border-sky-500 text-sky-500"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Completed Bookings
              </button>
              <button
                onClick={() => setActiveTab("personal")}
                className={`py-4 px-6 font-medium text-sm border-b-2 flex items-center gap-2 ${
                  activeTab === "personal"
                    ? "border-sky-500 text-sky-500"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <User className="h-4 w-4" />
                Personal Info
              </button>
              <button
                onClick={() => setActiveTab("security")}
                className={`py-4 px-6 font-medium text-sm border-b-2 flex items-center gap-2 ${
                  activeTab === "security"
                    ? "border-sky-500 text-sky-500"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Lock className="h-4 w-4" />
                Security
              </button>
              <button
                onClick={() => setActiveTab("delete")}
                className={`py-4 px-6 font-medium text-sm border-b-2 flex items-center gap-2 ${
                  activeTab === "delete"
                    ? "border-sky-500 text-sky-500"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Trash2 className="h-4 w-4" />
                Delete Account
              </button>
            </nav>
          </div>
        </div>

        {/* Content Section */}
        <div className="px-4 py-8 mb-20">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-medium">
              {activeTab === "services"
                ? "Services"
                : activeTab === "ongoing"
                  ? "Ongoing Bookings"
                  : activeTab === "pending"
                    ? "Pending Bookings"
                    : activeTab === "completed"
                      ? "Completed Bookings"
                      : activeTab === "personal"
                        ? "Personal Information"
                        : activeTab === "security"
                          ? "Security Settings"
                          : "Delete Account"}
            </h2>
            {activeTab === "personal" && (
              <button className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-all">
                Edit Profile
              </button>
            )}
          </div>

          {renderTabContent()}
        </div>
      </div>

      {/* Booking Details Modal */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30 backdrop-blur-md" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4 font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,sans-serif]">
          <DialogPanel className="mx-auto max-w-2xl w-full bg-white/90 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl transform transition-all border border-white/20">
            {selectedBooking && (
              <div className="flex flex-col h-full">
                {/* Image Section - Top */}
                <div className="relative h-48 w-full">
                  <img
                    src={selectedBooking.image || image1}
                    alt={selectedBooking.serviceName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60" />

                  {/* Service name overlay on image */}
                  <div className="absolute bottom-0 left-0 p-6 w-full">
                    <h3 className="text-2xl font-light text-white tracking-tight">{selectedBooking.serviceName}</h3>
                    <div
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 
          ${
            selectedBooking.status === "pending"
              ? "bg-yellow-100 text-yellow-800"
              : selectedBooking.status === "ongoing"
                ? "bg-sky-100 text-sky-800"
                : "bg-green-100 text-green-800"
          }`}
                    >
                      {selectedBooking.status === "pending"
                        ? "Pending"
                        : selectedBooking.status === "ongoing"
                          ? "In Progress"
                          : "Completed"}
                    </div>
                  </div>

                  {/* Close button */}
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="absolute top-4 left-4 bg-black/20 backdrop-blur-xl p-2 rounded-full hover:bg-black/30 transition-all duration-200 text-white"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Content Section - Below image, scrollable */}
                <div className="p-6 max-h-[60vh] overflow-y-auto">
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                      <div>
                        <h3 className="text-xs font-medium uppercase tracking-wide text-gray-500">Customer</h3>
                        <p className="mt-1 text-base font-medium text-gray-900">{selectedBooking.customerName}</p>
                      </div>
                      <div>
                        <h3 className="text-xs font-medium uppercase tracking-wide text-gray-500">Payment Method</h3>
                        <p className="mt-1 text-base font-medium text-gray-900">{selectedBooking.modeOfPayment}</p>
                      </div>
                      <div>
                        <h3 className="text-xs font-medium uppercase tracking-wide text-gray-500">Date & Time</h3>
                        <p className="mt-1 text-base font-medium text-gray-900 flex items-center">
                          <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                          {new Date(selectedBooking.date).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                          , {selectedBooking.time}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-xs font-medium uppercase tracking-wide text-gray-500">Location</h3>
                        <p className="mt-1 text-base font-medium text-gray-900 flex items-start">
                          <MapPin className="h-4 w-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                          <span>{selectedBooking.location}</span>
                        </p>
                      </div>
                    </div>

                    <div className="bg-gray-50/80 backdrop-blur-sm rounded-2xl p-6">
                      <h3 className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-4">
                        Payment Summary
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Service Fee</span>
                          <span className="font-medium">₱{selectedBooking.price.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Distance Charge</span>
                          <span className="font-medium">₱{selectedBooking.distanceCharge.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-lg font-medium pt-3 border-t border-gray-200 mt-3">
                          <span>Total</span>
                          <span className="text-sky-600">₱{selectedBooking.total.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {selectedBooking &&
                        selectedBooking.status === "ongoing" &&
                        !ceoMarkedCompleted.includes(selectedBooking.id) && (
                          <div className="bg-blue-50/80 backdrop-blur-sm border border-blue-200 rounded-2xl p-4 text-blue-800 text-sm">
                            <p className="font-medium">
                              Admin is still holding your transaction until both customer and CEO marked as completed.
                            </p>
                          </div>
                        )}

                      {showSuccess && processingBookingId === selectedBooking.id && (
                        <div className="bg-green-50/80 backdrop-blur-sm border border-green-200 rounded-2xl p-4 text-green-800 text-sm flex items-center">
                          <CheckCircle className="h-5 w-5 mr-2 text-green-500 animate-bounce" />
                          <p className="font-medium">Transaction is completed, please check your balance.</p>
                        </div>
                      )}

                      {selectedBooking && ceoMarkedCompleted.includes(selectedBooking.id) && !showSuccess && (
                        <div className="bg-yellow-50/80 backdrop-blur-sm border border-yellow-200 rounded-2xl p-4 text-yellow-800 text-sm">
                          <p className="font-medium">Please wait for the customer to mark as completed at their end.</p>
                          <p className="mt-1">Contact our services if anything goes wrong.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer with buttons - Fixed at bottom */}
                <div className="p-6 border-t border-gray-100">
                  <div className="flex space-x-4">
                    {selectedBooking && selectedBooking.status === "ongoing" && (
                      <button
                        onClick={() => handleMarkAsCompleted(selectedBooking.id)}
                        disabled={ceoMarkedCompleted.includes(selectedBooking.id) || isLoading || showSuccess}
                        className={`w-full px-6 py-3 text-white rounded-full transition-all duration-200 font-medium text-sm ${
                          ceoMarkedCompleted.includes(selectedBooking.id) || showSuccess
                            ? "bg-gray-400 cursor-not-allowed"
                            : isLoading && processingBookingId === selectedBooking.id
                              ? "bg-sky-400 cursor-wait"
                              : "bg-sky-500 hover:bg-sky-600 shadow-lg shadow-sky-200"
                        }`}
                      >
                        {isLoading && processingBookingId === selectedBooking.id ? (
                          <span className="flex items-center justify-center">
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
                          </span>
                        ) : ceoMarkedCompleted.includes(selectedBooking.id) ? (
                          "Waiting for Customer"
                        ) : (
                          <span className="flex items-center justify-center">
                            <Check className="h-4 w-4 mr-2" />
                            Mark as Completed
                          </span>
                        )}
                      </button>
                    )}

                    {selectedBooking && selectedBooking.status === "pending" && (
                      <div className="flex space-x-3 w-full">
                        <button
                          onClick={() => {
                            setIsDeclineModalOpen(true)
                          }}
                          className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors duration-200 font-medium text-sm"
                        >
                          <span className="flex items-center justify-center">
                            <X className="h-4 w-4 mr-2" />
                            Decline Booking
                          </span>
                        </button>
                        <button
                          onClick={() => handleAcceptBooking(selectedBooking.id)}
                          disabled={isLoading}
                          className={`flex-1 px-6 py-3 text-white rounded-full transition-all duration-200 font-medium text-sm ${
                            isLoading && processingBookingId === selectedBooking.id
                              ? "bg-sky-400 cursor-wait"
                              : "bg-sky-500 hover:bg-sky-600 shadow-lg shadow-sky-200"
                          }`}
                        >
                          {isLoading && processingBookingId === selectedBooking.id ? (
                            <span className="flex items-center justify-center">
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
                            </span>
                          ) : (
                            <span className="flex items-center justify-center">
                              <Check className="h-4 w-4 mr-2" />
                              Accept Booking
                            </span>
                          )}
                        </button>
                      </div>
                    )}

                    {selectedBooking && selectedBooking.status === "completed" && (
                      <button
                        onClick={() => setIsModalOpen(false)}
                        className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors duration-200 font-medium text-sm"
                      >
                        Close
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </DialogPanel>
        </div>
      </Dialog>

      {/* Create Service Modal - Transaction Style */}
      <Dialog
        open={isCreateServiceModalOpen}
        onClose={() => setIsCreateServiceModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30 backdrop-blur-md" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4 font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,sans-serif]">
          <DialogPanel className="mx-auto max-w-6xl w-full bg-white/90 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl transform transition-all border border-white/20">
            <div className="flex flex-col md:flex-row">
              {/* Preview Section - Left Side */}
              <div className="md:w-2/5 bg-gray-100/50 p-8 flex flex-col">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Service Preview</h3>
                  <p className="text-sm text-gray-600">See how your service will appear</p>
                </div>

                <div className="flex-1 flex flex-col">
                  <div className="relative w-full h-48 mb-6 rounded-2xl overflow-hidden bg-gray-200 border border-gray-300">
                    <img
                      src={newService.image || image1}
                      alt="Service Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = image1
                      }}
                    />
                  </div>

                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm flex-1">
                    <h4 className="text-xl font-medium mb-3">{newService.name || "Service Name"}</h4>
                    <p className="text-gray-600 text-sm mb-6 line-clamp-4">
                      {newService.description || "Service description will appear here."}
                    </p>

                    <div className="mt-auto space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Starting Rate:</span>
                        <span className="text-lg font-medium">₱{(newService.price || 0).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Per KM Charge:</span>
                        <span className="text-base">₱{(newService.chargePerKm || 0).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Section - Right Side */}
              <div className="md:w-3/5 p-8 border-t md:border-t-0 md:border-l border-gray-200/50">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <DialogTitle className="text-2xl font-medium text-gray-700">Create New Service</DialogTitle>
                    <p className="text-gray-600 mt-1">
                      Step {createServiceStep} of {totalSteps}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsCreateServiceModalOpen(false)}
                    className="text-gray-400 hover:text-gray-500 p-2 rounded-full hover:bg-gray-100 transition-all"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Progress Indicator */}
                <div className="mb-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-full ${
                          createServiceStep >= 1 ? "bg-sky-500 text-white" : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className={`h-1 w-16 ${createServiceStep >= 2 ? "bg-sky-500" : "bg-gray-200"}`}></div>
                    </div>
                    <div className="flex items-center">
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-full ${
                          createServiceStep >= 2 ? "bg-sky-500 text-white" : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        <DollarSign className="h-5 w-5" />
                      </div>
                      <div className={`h-1 w-16 ${createServiceStep >= 3 ? "bg-sky-500" : "bg-gray-200"}`}></div>
                    </div>
                    <div className="flex items-center">
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-full ${
                          createServiceStep >= 3 ? "bg-sky-500 text-white" : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        <Clipboard className="h-5 w-5" />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between mt-3 text-xs text-gray-500">
                    <span>Service Info</span>
                    <span>Pricing</span>
                    <span>Requirements</span>
                  </div>
                </div>

                <div className="max-h-[50vh] overflow-y-auto pr-2">{renderCreateServiceStepContent()}</div>

                <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => (createServiceStep > 1 ? handlePrevStep() : setIsCreateServiceModalOpen(false))}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-all flex items-center"
                  >
                    {createServiceStep > 1 ? (
                      <>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                      </>
                    ) : (
                      "Cancel"
                    )}
                  </button>

                  {createServiceStep < totalSteps ? (
                    <button
                      onClick={handleNextStep}
                      className="px-6 py-3 bg-sky-500 text-white rounded-full hover:bg-sky-600 transition-all flex items-center"
                    >
                      Next
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmitNewService}
                      disabled={!allRequirementsMet || isProcessing}
                      className={`px-6 py-3 text-white rounded-full transition-all flex items-center ${
                        !allRequirementsMet || isProcessing
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-sky-500 hover:bg-sky-600"
                      }`}
                    >
                      {isProcessing ? (
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
                          Creating...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Create Service
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      {/* Edit Service Modal */}
      <Dialog open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4 font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,sans-serif]">
          <DialogPanel className="mx-auto max-w-4xl w-full bg-white rounded-2xl overflow-hidden shadow-xl">
            <div className="flex flex-col md:flex-row">
              {/* Preview Section */}
              <div className="md:w-2/5 bg-gray-50 p-6 flex flex-col">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Service Preview</h3>

                <div className="flex-1 flex flex-col">
                  <div className="relative w-full h-48 mb-4 rounded-xl overflow-hidden bg-gray-200 border border-gray-300">
                    <img
                      src={editedService.image || image1}
                      alt="Service Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = image1
                      }}
                    />
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm flex-1">
                    <h4 className="text-xl font-medium mb-2">{editedService.name || "Service Name"}</h4>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-4">
                      {editedService.description || "Service description will appear here."}
                    </p>

                    <div className="mt-auto space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Starting Rate:</span>
                        <span className="text-lg font-medium">₱{(editedService.price || 0).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Per KM Charge:</span>
                        <span className="text-base">₱{(editedService.chargePerKm || 0).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Section */}
              <div className="md:w-3/5 p-6 border-t md:border-t-0 md:border-l border-gray-200">
                <div className="flex justify-between items-start mb-6">
                  <DialogTitle className="text-xl font-medium">Edit Service</DialogTitle>
                  <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {selectedService && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      handleSaveService()
                    }}
                    className="space-y-4 max-h-[60vh] overflow-y-auto pr-2"
                  >
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Service Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={editedService.name || ""}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                        Image URL
                      </label>
                      <input
                        type="text"
                        id="image"
                        name="image"
                        value={editedService.image || ""}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                        placeholder="Enter image URL or leave blank for default"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Enter a valid image URL to see the preview update in real-time
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                          Starting Rate (₱)
                        </label>
                        <input
                          type="number"
                          id="price"
                          name="price"
                          value={editedService.price || ""}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                          min="0"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="chargePerKm" className="block text-sm font-medium text-gray-700 mb-1">
                          Charge Per KM (₱)
                        </label>
                        <input
                          type="number"
                          id="chargePerKm"
                          name="chargePerKm"
                          value={editedService.chargePerKm || ""}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                          min="0"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={editedService.description || ""}
                        onChange={handleServiceTextAreaChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 min-h-[120px]"
                        required
                      />
                    </div>

                    <div className="flex space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setIsEditModalOpen(false)}
                        className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 px-4 py-2.5 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      {/* Delete Confirmation Modal (for Personal Info) */}
      <Dialog
        open={isDeleteInfoConfirmOpen}
        onClose={() => setIsDeleteInfoConfirmOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="mx-auto max-w-md w-full bg-white rounded-2xl overflow-hidden shadow-xl">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <DialogTitle className="text-xl font-semibold text-gray-900">
                  Delete{" "}
                  {selectedInfo?.type ? selectedInfo.type.charAt(0).toUpperCase() + selectedInfo.type.slice(1) : "Info"}
                </DialogTitle>
                <button onClick={() => setIsDeleteInfoConfirmOpen(false)} className="text-gray-400 hover:text-gray-500">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {selectedInfo && (
                <div>
                  <p className="text-gray-600 mb-6">
                    Are you sure you want to delete <span className="font-semibold">{selectedInfo.title}</span>? This
                    action cannot be undone.
                  </p>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => setIsDeleteInfoConfirmOpen(false)}
                      className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmDeleteInfo}
                      className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      {/* Decline Reason Modal */}
      <Dialog open={isDeclineModalOpen} onClose={() => setIsDeclineModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="mx-auto max-w-md w-full bg-white rounded-2xl overflow-hidden shadow-xl">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <DialogTitle className="text-xl font-semibold text-gray-900">Decline Booking</DialogTitle>
                <button onClick={() => setIsDeclineModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {selectedBooking && (
                <div>
                  <p className="text-gray-600 mb-4">
                    Please provide a reason for declining this booking request from{" "}
                    <span className="font-semibold">{selectedBooking.customerName}</span>.
                  </p>

                  <div className="mb-6">
                    <label htmlFor="declineReason" className="block text-sm font-medium text-gray-700 mb-1">
                      Reason for Declining
                    </label>
                    <textarea
                      id="declineReason"
                      value={declineReason}
                      onChange={(e) => setDeclineReason(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 min-h-[120px]"
                      placeholder="Please explain why you're declining this booking..."
                      required
                    />
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => setIsDeclineModalOpen(false)}
                      className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleDeclineBooking(selectedBooking.id)}
                      disabled={!declineReason.trim() || isLoading}
                      className={`flex-1 px-4 py-2.5 text-white rounded-lg transition-colors ${
                        !declineReason.trim()
                          ? "bg-gray-400 cursor-not-allowed"
                          : isLoading && processingBookingId === selectedBooking.id
                            ? "bg-red-400 cursor-wait"
                            : "bg-red-500 hover:bg-red-600"
                      }`}
                    >
                      {isLoading && processingBookingId === selectedBooking.id ? (
                        <span className="flex items-center justify-center">
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
                        </span>
                      ) : (
                        "Submit"
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      {/* Subscription Plans Modal */}
      <Dialog open={isPlansModalOpen} onClose={() => setIsPlansModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="mx-auto max-w-6xl w-full bg-white rounded-2xl overflow-hidden shadow-xl">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    Powerful features for <span className="text-blue-600">powerful creators</span>
                  </h2>
                  <p className="text-gray-600 mt-2">Choose a plan that's right for you</p>
                </div>
                <button onClick={() => setIsPlansModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Billing Toggle */}
              <div className="flex items-center justify-center mb-10">
                <span className="text-gray-700 font-medium mr-3">Pay Monthly</span>
                <Switch
                  checked={isYearlyBilling}
                  onChange={setIsYearlyBilling}
                  className={`
                ${isYearlyBilling ? "bg-blue-600" : "bg-gray-300"}
               relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                >
                  <span className="sr-only">Enable yearly billing</span>
                  <span
                    className={`
                  ${isYearlyBilling ? "translate-x-6" : "translate-x-1"}
                 inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                  />
                </Switch>
                <span className="text-gray-700 font-medium ml-3">Pay Yearly</span>
                {isYearlyBilling && (
                  <span className="ml-4 text-blue-600 font-semibold text-sm flex items-center">
                    <ArrowRight className="h-4 w-4 mr-1 -rotate-45" />
                    Save 25%
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subscriptionPlans
                  .filter((plan) => plan.tier !== "unlimited")
                  .map((plan) => (
                    <div
                      key={plan.tier}
                      className={`rounded-xl p-6 flex flex-col shadow-lg transition-all duration-300
                      ${plan.color} ${plan.textColor}
                      ${
                        plan.tier === subscription.tier
                          ? plan.tier === "mid"
                            ? "ring-4 ring-blue-300"
                            : "ring-4 ring-blue-200"
                          : "border border-gray-200"
                      }
                      `}
                    >
                      <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                      <p className={`text-sm mb-4 ${plan.tier === "mid" ? "text-blue-200" : "text-gray-600"}`}>
                        {plan.description}
                      </p>

                      <div className="mb-6">
                        <span className="text-4xl font-bold">${isYearlyBilling ? plan.yearlyPrice : plan.price}</span>
                        <span className={`text-lg ${plan.tier === "mid" ? "text-blue-200" : "text-gray-500"}`}>
                          /Month
                        </span>
                      </div>

                      <button
                        onClick={() => handleSelectPlan(plan.tier as SubscriptionTier)}
                        className={`w-full py-3 rounded-lg font-semibold transition-colors duration-200
                        ${
                          plan.tier === "mid"
                            ? "bg-white text-blue-600 hover:bg-gray-100"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }
                        ${plan.tier === subscription.tier ? "opacity-70 cursor-not-allowed" : ""}
                        `}
                        disabled={plan.tier === subscription.tier}
                      >
                        {plan.tier === subscription.tier ? "Current Plan" : "Get Started Now"}
                      </button>

                      <ul className="space-y-3 mt-8 flex-grow">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center">
                            {feature.included ? (
                              <CheckCircle
                                className={`h-5 w-5 mr-3 flex-shrink-0 ${
                                  plan.tier === "mid" ? "text-white" : "text-green-500"
                                }`}
                              />
                            ) : (
                              <X
                                className={`h-5 w-5 mr-3 flex-shrink-0 ${
                                  plan.tier === "mid" ? "text-blue-300" : "text-gray-400"
                                }`}
                              />
                            )}
                            <span className={`text-sm ${plan.textColor}`}>{feature.text}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      <Dialog open={isSuccessModalOpen} onClose={() => setIsSuccessModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30 backdrop-blur-md" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4 font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,sans-serif]">
          <DialogPanel
            className="mx-auto max-w-md w-full bg-white/90 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl transform transition-all border border-white/20 p-6"
            style={{ animation: "fadeIn 0.5s ease-out" }}
          >
            <div className="flex flex-col items-center text-center" style={{ animation: "fadeIn 0.3s ease-out" }}>
              <div
                className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6"
                style={{ animation: "pulse 2s ease-in-out infinite" }}
              >
                {successMessage.includes("upgraded") || successMessage.includes("terminated") ? (
                  <Sparkles className="h-10 w-10 text-green-500" style={{ animation: "bounceIn 0.6s ease-out" }} />
                ) : (
                  <CheckCircle2 className="h-10 w-10 text-green-500" style={{ animation: "bounceIn 0.6s ease-out" }} />
                )}
              </div>

              <DialogTitle
                className="text-xl font-medium text-gray-900 mb-2"
                style={{ animation: "slideInUp 0.4s ease-out" }}
              >
                {successMessage.includes("upgraded") || successMessage.includes("terminated")
                  ? "Congratulations!"
                  : "Success!"}
              </DialogTitle>

              <p className="text-gray-600 mb-6" style={{ animation: "fadeIn 0.5s ease-out 0.2s both" }}>
                {successMessage ||
                  (subscription.tier !== "free"
                    ? `You've successfully upgraded to the ${subscription.name} plan! You can now add up to ${
                        subscription.maxServices === Number.POSITIVE_INFINITY ? "unlimited" : subscription.maxServices
                      } services.`
                    : "Operation completed successfully!")}
              </p>

              <button
                onClick={() => setIsSuccessModalOpen(false)}
                className="px-6 py-3 bg-sky-500 text-white rounded-full hover:bg-sky-600 transition-all"
                style={{ animation: "fadeIn 0.5s ease-out 0.3s both" }}
              >
                {successMessage.includes("upgraded") ? "Start Using Your New Plan" : "Close"}
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      {/* Service Termination Modal */}
      <Dialog open={isTerminationModalOpen} onClose={() => setIsTerminationModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4 font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,sans-serif]">
          <DialogPanel className="mx-auto max-w-2xl w-full bg-white rounded-2xl overflow-hidden shadow-xl">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <DialogTitle className="text-xl font-medium text-gray-700">
                  {isTerminationScheduled ? "Service Termination Scheduled" : "Terminate Service: Strategic Review"}
                </DialogTitle>
                <button onClick={() => setIsTerminationModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {serviceToTerminate && (
                <>
                  {!isTerminationScheduled && (
                    <div className="mb-6">
                      <p className="text-gray-600">
                        You are initiating the termination process for service:{" "}
                        <span className="font-semibold">{serviceToTerminate.name}</span>.
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        This process requires a 2-day countdown, during which the termination can be cancelled.
                      </p>
                    </div>
                  )}

                  {!isTerminationScheduled && (
                    <div className="mb-8">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div
                            className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                              terminationStep >= 1 ? "bg-red-500 text-white" : "bg-gray-200 text-gray-500"
                            }`}
                          >
                            1
                          </div>
                          <div className={`h-1 w-16 ${terminationStep >= 2 ? "bg-red-500" : "bg-gray-200"}`}></div>
                        </div>
                        <div className="flex items-center">
                          <div
                            className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                              terminationStep >= 2 ? "bg-red-500 text-white" : "bg-gray-200 text-gray-500"
                            }`}
                          >
                            2
                          </div>
                          <div className={`h-1 w-16 ${terminationStep >= 3 ? "bg-red-500" : "bg-gray-200"}`}></div>
                        </div>
                        <div className="flex items-center">
                          <div
                            className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                              terminationStep >= 3 ? "bg-red-500 text-white" : "bg-gray-200 text-gray-500"
                            }`}
                          >
                            3
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between mt-3 text-xs text-gray-500">
                        <span>Strategic Review</span>
                        <span>Legal Review</span>
                        <span>Financial Audit</span>
                      </div>
                    </div>
                  )}

                  {terminationStep === 1 && !isTerminationScheduled && (
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="terminationReason" className="block text-sm font-medium text-gray-700 mb-1">
                          Reason for Termination (COO)
                        </label>
                        <select
                          id="terminationReason"
                          value={terminationReason}
                          onChange={(e) => setTerminationReason(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                          required
                        >
                          <option value="">Select a reason</option>
                          {terminationReasonsOptions.map((reason) => (
                            <option key={reason} value={reason}>
                              {reason}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="strategicNotes" className="block text-sm font-medium text-gray-700 mb-1">
                          Additional Strategic Notes
                        </label>
                        <textarea
                          id="strategicNotes"
                          value={legalReviewNotes}
                          onChange={(e) => setLegalReviewNotes(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 min-h-[80px]"
                          placeholder="Enter any additional notes for strategic review..."
                        />
                      </div>
                      <div className="flex justify-end pt-4">
                        <button
                          onClick={() => setTerminationStep(2)}
                          disabled={!terminationReason}
                          className={`px-6 py-3 text-white rounded-full transition-all ${
                            !terminationReason ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"
                          }`}
                        >
                          Next: Legal Review
                        </button>
                      </div>
                    </div>
                  )}

                  {terminationStep === 2 && !isTerminationScheduled && (
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Legal Review</h3>
                        <p className="text-gray-600 mb-4">
                          Consider the legal implications and existing Service Level Agreements (SLAs).
                        </p>
                        <label htmlFor="legalNotes" className="block text-sm font-medium text-gray-700 mb-1">
                          Legal Notes / Implications
                        </label>
                        <textarea
                          id="legalNotes"
                          value={legalReviewNotes}
                          onChange={(e) => setLegalReviewNotes(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 min-h-[120px]"
                          placeholder="Document any legal effects or considerations..."
                          required
                        />
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="slaCheck" className="mr-2" />
                        <label htmlFor="slaCheck" className="text-sm text-gray-700">
                          Confirmed review of customer SLAs and agreements.
                        </label>
                      </div>
                      <div className="flex justify-between pt-4">
                        <button
                          onClick={() => setTerminationStep(1)}
                          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors"
                        >
                          Back
                        </button>
                        <button
                          onClick={() => setTerminationStep(3)}
                          disabled={!legalReviewNotes.trim()}
                          className={`px-6 py-3 text-white rounded-full transition-all ${
                            !legalReviewNotes.trim() ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"
                          }`}
                        >
                          Next: Financial Audit
                        </button>
                      </div>
                    </div>
                  )}

                  {terminationStep === 3 && !isTerminationScheduled && (
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Financial Audit</h3>
                        <p className="text-gray-600 mb-4">
                          Ensure all financial obligations, including refunds for pre-booked services, are addressed.
                        </p>
                        <label htmlFor="financialNotes" className="block text-sm font-medium text-gray-700 mb-1">
                          Financial Audit Notes
                        </label>
                        <textarea
                          id="financialNotes"
                          value={financialAuditNotes}
                          onChange={(e) => setFinancialAuditNotes(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 min-h-[120px]"
                          placeholder="Document refund plans, outstanding payments, etc."
                          required
                        />
                      </div>
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-yellow-800 text-sm">
                        <p className="font-medium">Important:</p>
                        <p className="mt-1">
                          All customers with existing bookings for this service will be automatically refunded upon
                          final termination.
                        </p>
                      </div>
                      <div className="flex justify-between pt-4">
                        <button
                          onClick={() => setTerminationStep(2)}
                          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors"
                        >
                          Back
                        </button>
                        <button
                          onClick={handleScheduleTermination}
                          disabled={!financialAuditNotes.trim()}
                          className={`px-6 py-3 text-white rounded-full transition-all ${
                            !financialAuditNotes.trim()
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-red-500 hover:bg-red-600"
                          }`}
                        >
                          Schedule Termination
                        </button>
                      </div>
                    </div>
                  )}

                  {isTerminationScheduled && terminationStep === 4 && (
                    <div className="text-center space-y-6">
                      <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4 animate-pulse">
                        <Trash2 className="h-12 w-12 text-red-500" />
                      </div>
                      <h3 className="text-2xl font-medium text-red-500">Termination Scheduled!</h3>
                      <p className="text-gray-700">
                        The service "<span className="font-semibold">{serviceToTerminate.name}</span>" is scheduled for
                        termination and will be permanently removed in:
                      </p>
                      <div className="text-4xl font-medium text-red-500 tracking-tight">
                        {formatTime(terminationTimer)}
                      </div>
                      <p className="text-gray-600">
                        Reason for termination: <span className="font-medium">{terminationReason}</span>
                      </p>
                      <div className="flex justify-center space-x-4 mt-6">
                        <button
                          onClick={handleCancelTermination}
                          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors"
                        >
                          Cancel Termination
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      {/* Please Wait Modal */}
      <PleaseWaitModal
        isOpen={isPleaseWaitModalOpen}
        onClose={() => setIsPleaseWaitModalOpen(false)}
        message="Please wait while our AI reviews your service for compliance and optimal placement. This may take a moment."
      />

      {/* Advertisement Flow Modal */}
      <AdvertisementFlowModal
        isOpen={isAdvertiseFlowModalOpen === 1 || isAdvertiseFlowModalOpen === 2}
        onClose={() => {
          setIsAdvertiseFlowModalOpen(0) // Close advertisement modal
          setSuccessMessage("Service created successfully!") // Set success message
          setIsSuccessModalOpen(true) // Open success modal
        }}
        step={advertiseFlowStep}
        onNextStep={() => setAdvertiseFlowStep(2)}
        onConfirmAdvertise={handleConfirmAdvertisement}
      />

      <Footer />
    </div>
  )
}

export default Bookings