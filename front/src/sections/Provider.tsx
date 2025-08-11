"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import MyFloatingDockProvider from "../sections/Styles/MyFloatingDock-Provider"
import {
  CalendarIcon,
  Clock,
  MapPin,
  AlertCircle,
  Check,
  X,
  CheckCircle2,
  Users,
  ChevronRight,
  MoreVertical,
  User,
  Plus,
  Star,
  Award,
  MessageSquareText,
  Target,
} from "lucide-react"
import { Dialog } from "@headlessui/react"
import ProviderSimulation from "../sections/Styles/CustomerTrackingMap"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"

interface Service {
  canAccept: boolean
  _id: string
  customerName: string
  serviceName: string
  date: string
  time: string
  location: {
    name: string
    lat: number
    lng: number
    distance: number
  }
  price: number
  distanceCharge: number
  total: number
  image: string
  createdAt: string
  autoCancelDate: string
  status: "pending" | "active" | "ongoing" | "completed" | "cancelled"
  completedDate?: string
  workersRequired?: number
  workersAssigned?: number
  shortDescription?: string
  review?: string
  rating?: number
  userDetails?: {
    firstName: string
    lastName: string
    middleName?: string
    email: string
    mobileNumber: string
    profilePicture?: string
  }
  assignedWorkers?: { name: string; workerId?: string }[] // Updated to include workerId
  providerAccepted?: boolean
}

interface RecentCustomer {
  id: string
  name: string
  avatar: string
  serviceName: string
  review: string
  totalPayment: number
  rating: number
}

interface UserDetails {
  _id: string
  firstName: string
  lastName: string
  middleName?: string
  email: string
  mobileNumber: string
  gender?: string
  bio?: string
  profilePicture?: string
  coverPhoto?: string
  location?: {
    name: string
    lat: number
    lng: number
    distance: number
    zipCode?: string
  }
  type: string
  status: string
  verification: string
  createdAt: string
}

const keyframes = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

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
10%, 30%, 50%, 70%, 90% { transform: translateX(10px); }
20%, 40%, 60%, 80% { transform: translateX(-10px); }
}

@keyframes countdown {
from { width: 100%; }
to { width: 0%; }
}
`

function ProviderDashboard() {
  const [activeTab, setActiveTab] = useState("active")
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [cancelCount, setCancelCount] = useState(0)
  const [showSuspensionWarning, setShowSuspensionWarning] = useState(false)
  const [showCancelReminder, setShowCancelReminder] = useState(false)
  const [showMapSimulation, setShowMapSimulation] = useState(false)
  const [serviceBeingTracked, setServiceBeingTracked] = useState<Service | null>(null)
  const [isDetailedStatsModalOpen, setIsDetailedStatsModalOpen] = useState(false)

  const navigate = useNavigate()

  const [userDetails, setUserDetails] = useState<UserDetails | null>(null)
  const [allActiveBookings, setAllActiveBookings] = useState<Service[]>([]) // Active bookings (for accepting, status: active, providerAccepted: false)
  const [providerAcceptedBookings, setProviderAcceptedBookings] = useState<Service[]>([]) // Bookings this provider accepted (status: active or ongoing, providerAccepted: true)
  const [providerCompletedBookings, setProviderCompletedBookings] = useState<Service[]>([]) // Completed bookings for current provider

  const fetchAllBookingsData = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        navigate("/proposition")
        return
      }

      const [activeRes, acceptedRes, completedRes] = await Promise.all([
        // Fetch bookings that are 'active' but not yet accepted by any provider
        fetch("http://localhost:3000/api/bookings/all-active", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        // Fetch bookings that this provider has accepted (status: active or ongoing)
        fetch("http://localhost:3000/api/bookings/accepted-by-provider", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        // Fetch completed bookings for this provider
        fetch("http://localhost:3000/api/bookings/completed-by-provider", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ])

      if (!activeRes.ok) throw new Error(`HTTP error! status: ${activeRes.status} for all-active`)
      if (!acceptedRes.ok) throw new Error(`HTTP error! status: ${acceptedRes.status} for accepted-by-provider`)
      if (!completedRes.ok) throw new Error(`HTTP error! status: ${completedRes.status} for completed-by-provider`)

      const activeData: Service[] = await activeRes.json()
      const acceptedData: Service[] = await acceptedRes.json()
      const completedData: Service[] = await completedRes.json()

      setAllActiveBookings(activeData)
      setProviderAcceptedBookings(acceptedData)
      setProviderCompletedBookings(completedData)
    } catch (error) {
      console.error("Failed to fetch bookings data:", error)
      // Optionally show an error message to the user
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      navigate("/proposition")
    } else {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        try {
          const parsedUser: UserDetails = JSON.parse(storedUser)
          setUserDetails(parsedUser)
        } catch (error) {
          console.error("Failed to parse user profile from localStorage:", error)
        }
      }
      fetchAllBookingsData()
    }
  }, [navigate])

  const recentCustomers: RecentCustomer[] = providerCompletedBookings.map((service) => ({
    id: service._id,
    name: service.customerName,
    avatar: service.userDetails?.profilePicture || "/placeholder.svg?height=40&width=40",
    serviceName: service.serviceName,
    review: service.review || "",
    totalPayment: service.total,
    rating: service.rating || 0,
  }))

  const handleServiceClick = (service: Service) => {
    setSelectedService(service)
    setIsModalOpen(true)
  }

  const handleAcceptOrAssignWorker = async (service: Service) => {
    console.log("handleAcceptOrAssignWorker called for service:", service._id) // Added log
    setIsLoading(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        navigate("/proposition")
        return
      }

      // Scenario 1: Booking is 'active' and not yet accepted by any provider
      if (service.status === "active" && !service.providerAccepted) {
        const response = await fetch(`http://localhost:3000/api/bookings/${service._id}/status`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ providerAccepted: true }), // Backend will add provider as first worker and set status to 'active'
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(`Failed to accept service: ${errorData.message || response.statusText}`)
        }

        const updatedService: Service = await response.json()
        setSuccessMessage("Service accepted! You are assigned as the first worker.")
        setIsSuccessModalOpen(true)
        setTimeout(() => setIsSuccessModalOpen(false), 3000)

        // Immediately update the providerAcceptedBookings state with the new service status
        setProviderAcceptedBookings((prevBookings) =>
          prevBookings.map((b) => (b._id === updatedService._id ? updatedService : b)),
        )
        // Also update the selected service in the modal immediately
        setSelectedService(updatedService)

        // If more workers are required, the button will simply reflect the 'waiting' state.
        // No modal is opened for manual assignment by the current user.
        if (updatedService.status === "ongoing") {
          handleTrackService(updatedService)
        }
      }
      // Scenario 3: Booking is 'ongoing' (all workers assigned), proceed to track
      else if (service.status === "ongoing") {
        handleTrackService(service)
      }

      fetchAllBookingsData() // Re-fetch all relevant bookings to update UI
    } catch (error: any) {
      console.error("Error handling service action:", error)
      setSuccessMessage(`Failed to perform action: ${error.message}`)
      setIsSuccessModalOpen(true)
      setTimeout(() => setIsSuccessModalOpen(false), 5000)
    } finally {
      setIsModalOpen(false) // Close service details modal if open
      setIsLoading(false)
    }
  }

  const handleCancelService = (serviceId: string) => {
    setShowCancelReminder(true)
    setSelectedService(
      [...allActiveBookings, ...providerAcceptedBookings].find((service) => service._id === serviceId) || null,
    )
  }

  const confirmCancelService = async () => {
    setShowCancelReminder(false)
    setIsLoading(true)

    try {
      if (selectedService) {
        const token = localStorage.getItem("token")
        if (!token) {
          navigate("/proposition")
          return
        }

        const response = await fetch(`http://localhost:3000/api/bookings/${selectedService._id}/status`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: "cancelled" }),
        })

        if (!response.ok) {
          throw new Error(`Failed to cancel service: ${response.statusText}`)
        }

        const newCancelCount = cancelCount + 1
        setCancelCount(newCancelCount)

        if (newCancelCount >= 3) {
          setShowSuspensionWarning(true)
          setTimeout(() => {
            window.location.href = "/login"
          }, 30000)
        } else {
          setSuccessMessage("Service has been cancelled.")
          setIsModalOpen(false)
          setIsSuccessModalOpen(true)
          setTimeout(() => {
            setIsSuccessModalOpen(false)
          }, 5000)
        }
        fetchAllBookingsData() // Re-fetch all relevant bookings
      }
    } catch (error) {
      console.error("Error cancelling service:", error)
      setSuccessMessage("Failed to cancel service.")
      setIsSuccessModalOpen(true)
      setTimeout(() => {
        setIsSuccessModalOpen(false)
      }, 5000)
    } finally {
      setIsLoading(false)
    }
  }

  const getDaysRemaining = (autoCancelDate: string) => {
    const today = new Date()
    const cancelDate = new Date(autoCancelDate)
    const diffTime = cancelDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const handleTrackService = (service: Service) => {
    setServiceBeingTracked(service)
    setShowMapSimulation(true)
  }

  const handleSimulationComplete = () => {
    setShowMapSimulation(false)
    setSuccessMessage("Service provider is on the way!")
    setIsSuccessModalOpen(true)

    setTimeout(() => {
      setIsSuccessModalOpen(false)
    }, 5000)
  }

  const ServiceCard: React.FC<{ service: Service }> = ({ service }) => {
    const isPending = service.status === "pending" // Should not appear in 'Active Bookings' tab now
    const isActiveUnaccepted = service.status === "active" && !service.providerAccepted // For 'Active Bookings' tab
    const isActiveAcceptedAssigning =
      service.status === "active" &&
      service.providerAccepted &&
      (service.assignedWorkers?.length || 0) < (service.workersRequired || 1) // For 'Accepted Bookings' tab
    const isOngoing = service.status === "ongoing"
    const workersRequired = service.workersRequired || 1
    const workersAssigned = service.providerAccepted ? service.assignedWorkers?.length || 0 : 0
    const canTrackService =
      isOngoing || (service.status === "active" && service.providerAccepted && workersAssigned === workersRequired)
    const isCompleted = service.status === "completed"

    return (
      <Card className="rounded-xl shadow-sm overflow-hidden flex flex-col h-full">
        <div className="relative h-40 w-full overflow-hidden rounded-t-xl">
          <img
            src={service.image || "/placeholder.svg"}
            alt={service.serviceName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <span
            className={`absolute bottom-2 left-2 text-xs font-medium px-2 py-1 rounded-full
  ${isPending ? "bg-yellow-100 text-yellow-800" : ""}
  ${isActiveUnaccepted ? "bg-blue-100 text-blue-800" : ""}
  ${isActiveAcceptedAssigning ? "bg-purple-100 text-purple-800" : ""}
  ${isOngoing ? "bg-sky-100 text-sky-800" : ""}
  ${isCompleted ? "bg-green-100 text-green-800" : ""}
  `}
          >
            {isPending && "Pending"}
            {isActiveUnaccepted && "Active (Unaccepted)"}
            {isActiveAcceptedAssigning && "Accepted (Assigning Workers)"}
            {isOngoing && "In Progress"}
            {isCompleted && "Completed"}
          </span>
        </div>
        <CardContent className="p-4 flex flex-col flex-1">
          <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">{service.serviceName}</h3>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{service.shortDescription}</p>

          <div className="grid grid-cols-2 gap-y-2 gap-x-4 mt-4 text-sm text-gray-700">
            <div className="flex items-center">
              <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
              <span>{service.date}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-gray-400" />
              <span>{service.time}</span>
            </div>
            <div className="flex items-center col-span-2">
              <MapPin className="h-4 w-4 mr-2 text-gray-400" />
              <span className="line-clamp-1">{service.location.name}</span>
            </div>
            <div className="flex items-center col-span-2">
              <Users className="h-4 w-4 mr-2 text-gray-400" />
              <span>
                Workers: {workersAssigned}/{workersRequired}
              </span>
            </div>
          </div>

          <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
            <span className="text-lg font-bold text-sky-600">₱{(service.total || 0).toLocaleString()}</span>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-gray-400 hover:bg-gray-100 mr-5"
              onClick={() => handleServiceClick(service)}
            >
              See More
              <ChevronRight className="h-5 w-5 ml-[-5px]" />
            </Button>
          </div>

          {/* Conditional buttons based on service status and acceptance */}
          {isActiveUnaccepted && (
            <div className="mt-4 flex flex-col gap-2">
              <Button
                onClick={() => handleAcceptOrAssignWorker(service)}
                disabled={isLoading}
                className="w-full bg-sky-500 text-white hover:bg-sky-600 rounded-full"
              >
                {isLoading ? (
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
                    Accept Service
                  </span>
                )}
              </Button>
              <p className="text-xs text-gray-500 text-center mt-1">
                Auto-cancel: {service.autoCancelDate} ({getDaysRemaining(service.autoCancelDate)} days left)
              </p>
            </div>
          )}

          {isActiveAcceptedAssigning && (
            <div className="mt-4 flex flex-col gap-2">
              <Button
                // The button is always in a 'loading' state visually when workers are not fulfilled
                // It does not trigger a modal for manual assignment by the current user.
                // The onClick can be removed or set to a no-op if no action is desired.
                // For now, keeping onClick to trigger handleAcceptOrAssignWorker for consistency,
                // but it will no longer open the modal due to previous changes.
                onClick={() => handleAcceptOrAssignWorker(service)}
                className="w-full bg-purple-500 text-white hover:bg-purple-600 rounded-full"
              >
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
                  Waiting another provider ({workersAssigned}/{workersRequired})
                </span>
              </Button>
              <Button
                onClick={() => handleCancelService(service._id)}
                variant="outline"
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 rounded-full"
              >
                Cancel Service
              </Button>
            </div>
          )}

          {canTrackService && (
            <div className="mt-4 flex flex-col gap-2">
              <Button
                onClick={() => handleTrackService(service)}
                className="w-full bg-sky-500 text-white hover:bg-sky-600 rounded-full"
              >
                <MapPin className="h-4 w-4 mr-2" /> Track Customer
              </Button>
              <Button
                onClick={() => handleCancelService(service._id)}
                variant="outline"
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 rounded-full"
              >
                Cancel Service
              </Button>
            </div>
          )}

          {isCompleted && service.completedDate && (
            <div className="mt-4 flex items-center justify-center text-green-600 font-medium text-sm">
              <CheckCircle2 className="h-4 w-4 mr-2" /> Completed on {service.completedDate}
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  const renderServiceCards = (services: Service[]) => {
    if (services.length === 0) {
      return (
        <div className="text-center py-10 text-gray-500">
          {activeTab === "active"
            ? "No active bookings found. Active bookings will appear here once customers create them."
            : "No completed bookings found yet."}
        </div>
      )
    }
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {services.map((service) => (
          <ServiceCard key={service._id} service={service} />
        ))}
      </div>
    )
  }

  const totalServicesCompleted = providerCompletedBookings.length
  const totalReviews = providerCompletedBookings.filter((s) => s.review).length
  const averageRating =
    totalReviews > 0
      ? (providerCompletedBookings.reduce((sum, s) => sum + (s.rating || 0), 0) / totalReviews).toFixed(1)
      : "N/A"

  const dailyQuota = {
    target: 5,
    completed: providerCompletedBookings.filter(
      (s) => new Date(s.completedDate || "").toDateString() === new Date().toDateString(),
    ).length,
  }
  const dailyQuotaProgress = (dailyQuota.completed / dailyQuota.target) * 100

  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const getGreeting = (hour: number) => {
    if (hour < 12) {
      return "Good Morning"
    } else if (hour < 18) {
      return "Good Afternoon"
    } else {
      return "Good Evening"
    }
  }

  // Define these variables based on selectedService
  const isOngoing = selectedService?.status === "ongoing"
  const canTrackServiceInModal =
    isOngoing ||
    (selectedService?.status === "active" &&
      selectedService?.providerAccepted &&
      (selectedService?.assignedWorkers?.length || 0) === (selectedService?.workersRequired || 1))
  const isActiveUnaccepted = selectedService?.status === "active" && !selectedService?.providerAccepted
  const isActiveAcceptedAssigning =
    selectedService?.status === "active" &&
    selectedService?.providerAccepted &&
    (selectedService?.assignedWorkers?.length || 0) < (selectedService?.workersRequired || 1)

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 font-sans">
      <style>{keyframes}</style>
      <main className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 md:gap-6">
        <div className="space-y-4 md:space-y-6">
          <div className="relative bg-gradient-to-br from-sky-600 to-sky-800 text-white p-6 md:p-8 rounded-2xl overflow-hidden shadow-lg h-[180px]">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: "url('https://cdn.pixabay.com/photo/2023/05/24/20/18/rose-8015781_1280.jpg')",
              }}
            ></div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Accepted Bookings</h2>
            {providerAcceptedBookings.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                No accepted bookings found. Accept some active bookings to see them here.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {providerAcceptedBookings.map((service) => (
                  <ServiceCard key={service._id} service={service} />
                ))}
              </div>
            )}
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Bookings Management</h2>
            <div className="px-6 border-b border-gray-200 bg-white rounded-t-lg">
              <nav className="flex -mb-px overflow-x-auto">
                <button
                  onClick={() => setActiveTab("active")}
                  className={`py-4 px-6 font-medium text-sm border-b-2 flex items-center gap-2 ${
                    activeTab === "active"
                      ? "border-sky-500 text-sky-500"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Active Bookings (For Acceptance)
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
              </nav>
            </div>

            <div className="p-4 md:p-6 bg-white rounded-b-lg shadow-sm">
              {activeTab === "active" && renderServiceCards(allActiveBookings)}
              {activeTab === "completed" && renderServiceCards(providerCompletedBookings)}
            </div>
          </div>
        </div>

        <div className="space-y-4 md:space-y-6">
          <Card className="p-6 rounded-2xl shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between p-0 mb-4">
              <CardTitle className="text-lg font-semibold text-gray-900">Profile Overview</CardTitle>
              <Button variant="ghost" size="icon" className="rounded-full">
                <MoreVertical className="h-5 w-5 text-gray-400" />
              </Button>
            </CardHeader>
            <CardContent className="p-0 flex flex-col items-center text-center">
              <div className="relative w-32 h-32 mb-4 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-gray-200 flex items-center justify-center">
                  <div
                    className="absolute inset-0 rounded-full border-4 border-sky-500"
                    style={{
                      clipPath: "polygon(50% 0%, 50% 50%, 100% 50%, 100% 0%)",
                      transform: `rotate(${dailyQuotaProgress * 3.6}deg)`,
                      transformOrigin: "center center",
                    }}
                  ></div>
                </div>
                <Avatar className="w-[calc(100%)] h-[calc(100%)]">
                  <AvatarImage
                    className="object-cover"
                    src={userDetails?.profilePicture || "/placeholder.svg?height=128&width=128"}
                    alt={userDetails ? `${userDetails.firstName} ${userDetails.lastName}` : "User Profile"}
                  />
                  <AvatarFallback>
                    {userDetails ? `${userDetails.firstName.charAt(0)}${userDetails.lastName.charAt(0)}` : "US"}
                  </AvatarFallback>
                </Avatar>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                {getGreeting(currentTime.getHours())},{" "}
                {userDetails ? `${userDetails.firstName} ${userDetails.lastName}` : "User"}
              </h3>
              <p className="text-sm text-gray-500 mt-1">Continue your learning to achieve your target!</p>

              <div className="w-full mt-6 pt-4 border-t border-gray-100">
                <h3 className="text-md font-semibold text-gray-900 text-left">Your Performance Overview</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-sky-500" />
                    <div>
                      <p className="text-sm text-gray-500">Daily Quota</p>
                      <p className="font-semibold text-gray-900">
                        {dailyQuota.completed}/{dailyQuota.target}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Award className="h-5 w-5 text-sky-500" />
                    <div>
                      <p className="text-sm text-gray-500">Total Services</p>
                      <p className="font-semibold text-gray-900">{totalServicesCompleted}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MessageSquareText className="h-5 w-5 text-sky-500" />
                    <div>
                      <p className="text-sm text-gray-500">Total Reviews</p>
                      <p className="font-semibold text-gray-900">{totalReviews}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                    <div>
                      <p className="text-sm text-gray-500">Avg. Rating</p>
                      <p className="font-semibold text-gray-900">{averageRating}</p>
                    </div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                  <div className="bg-sky-500 h-2.5 rounded-full" style={{ width: `${dailyQuotaProgress}%` }}></div>
                </div>
                <Button
                  onClick={() => setIsDetailedStatsModalOpen(true)}
                  variant="outline"
                  className="w-full rounded-full border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  View Detailed Stats
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="p-6 rounded-2xl shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between p-0 mb-4">
              <CardTitle className="text-lg font-semibold text-gray-900">Recent Customers</CardTitle>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Plus className="h-5 w-5 text-gray-400" />
              </Button>
            </CardHeader>
            <CardContent className="p-0 space-y-4">
              {recentCustomers.map((customer) => (
                <div
                  key={customer.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 border border-gray-100 rounded-lg"
                >
                  <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={customer.avatar || "/placeholder.svg"} alt={customer.name} />
                      <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-900">{customer.name}</p>
                      <p className="text-sm text-gray-500">{customer.serviceName}</p>
                      <div className="flex items-center mt-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < customer.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-xs text-gray-600 italic line-clamp-1">"{customer.review}"</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2 sm:space-y-0 sm:ml-auto">
                    <p className="text-sm font-semibold text-sky-600 mb-2">
                      ₱{(customer.totalPayment || 0).toLocaleString()}
                    </p>
                    <Button
                      variant="default"
                      className="rounded-full px-4 py-2 text-sm bg-sky-500 text-white hover:bg-sky-600"
                      onClick={() => {
                        const serviceFound = providerCompletedBookings.find((s) => s._id === customer.id)
                        if (serviceFound) {
                          handleServiceClick(serviceFound)
                        }
                      }}
                    >
                      <User className="h-4 w-4 mr-2" /> View Service
                    </Button>
                  </div>
                </div>
              ))}
              <Button variant="default" className="w-full mt-4 rounded-full bg-sky-500 text-white hover:bg-sky-600">
                See All
              </Button>
            </CardContent>
          </Card>

          <Card className="p-6 rounded-2xl shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between p-0 mb-4">
              <CardTitle className="text-lg font-semibold text-gray-900">Today's Schedule</CardTitle>
              <Button variant="ghost" size="sm" className="text-sky-600 hover:text-sky-700">
                View all
              </Button>
            </CardHeader>
            <CardContent className="p-0 flex flex-col items-center">
              <div className="text-center mb-4">
                <p className="text-sm text-gray-500">{format(currentTime, "EEEE, MMMM d, yyyy")}</p>
                <p className="text-2xl font-bold text-gray-900">{format(currentTime, "hh:mm:ss a")}</p>
              </div>
              <Calendar mode="single" selected={currentTime} className="rounded-md border w-full max-w-sm" />
            </CardContent>
          </Card>
        </div>
      </main>

      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30 backdrop-blur-md" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4 font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,sans-serif]">
          <Dialog.Panel className="mx-auto max-w-2xl w-full bg-white/90 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl transform transition-all border border-white/20">
            {selectedService && (
              <div className="flex flex-col h-full">
                <div className="relative h-48 w-full">
                  <img
                    src={selectedService.image || "/placeholder.svg"}
                    alt={selectedService.serviceName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60" />

                  <div className="absolute bottom-0 left-0 p-6 w-full">
                    <h3 className="text-2xl font-light text-white tracking-tight">{selectedService.serviceName}</h3>
                    <div
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 
            ${
              selectedService.status === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : selectedService.status === "active" && !selectedService.providerAccepted
                  ? "bg-blue-100 text-blue-800"
                  : selectedService.status === "active" &&
                      selectedService.providerAccepted &&
                      (selectedService.assignedWorkers?.length || 0) < (selectedService.workersRequired || 1)
                    ? "bg-purple-100 text-purple-800"
                    : selectedService.status === "ongoing"
                      ? "bg-sky-100 text-sky-800"
                      : "bg-green-100 text-green-800"
            }`}
                    >
                      {selectedService.status === "pending"
                        ? "Pending"
                        : selectedService.status === "active" && !selectedService.providerAccepted
                          ? "Active (Unaccepted)"
                          : selectedService.status === "active" &&
                              selectedService.providerAccepted &&
                              (selectedService.assignedWorkers?.length || 0) < (selectedService.workersRequired || 1)
                            ? "Accepted (Assigning Workers)"
                            : selectedService.status === "ongoing"
                              ? "In Progress"
                              : "Completed"}
                    </div>
                  </div>

                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="absolute top-4 left-4 bg-black/20 backdrop-blur-xl p-2 rounded-full hover:bg-black/30 transition-all duration-200 text-white"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="p-6 max-h-[60vh] overflow-y-auto">
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                      <div>
                        <h3 className="text-xs font-medium uppercase tracking-wide text-gray-500">Customer</h3>
                        <p className="mt-1 text-base font-medium text-gray-900">{selectedService.customerName}</p>
                        {selectedService.userDetails && (
                          <div className="mt-2 text-sm text-gray-600">
                            <p>Email: {selectedService.userDetails.email}</p>
                            <p>Phone: {selectedService.userDetails.mobileNumber}</p>
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-xs font-medium uppercase tracking-wide text-gray-500">Created On</h3>
                        <p className="mt-1 text-base font-medium text-gray-900">{selectedService.createdAt}</p>
                      </div>
                      <div>
                        <h3 className="text-xs font-medium uppercase tracking-wide text-gray-500">Date & Time</h3>
                        <p className="mt-1 text-base font-medium text-gray-900 flex items-center">
                          <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
                          {selectedService.date}, {selectedService.time}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-xs font-medium uppercase tracking-wide text-gray-500">Location</h3>
                        <p className="mt-1 text-base font-medium text-gray-900 flex items-start">
                          <MapPin className="h-4 w-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                          <span>{selectedService.location.name}</span>
                        </p>
                      </div>
                      <div>
                        <h3 className="text-xs font-medium uppercase tracking-wide text-gray-500">Workers Required</h3>
                        <p className="mt-1 text-base font-medium text-gray-900 flex items-center">
                          <Users className="h-4 w-4 text-gray-400 mr-2" />
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
${
  (selectedService.providerAccepted ? selectedService.assignedWorkers?.length || 0 : 0) === 0
    ? "bg-gray-100 text-gray-800"
    : (selectedService.providerAccepted ? selectedService.assignedWorkers?.length || 0 : 0) <
        (selectedService.workersRequired || 1)
      ? "bg-yellow-100 text-yellow-800"
      : "bg-green-100 text-green-800"
}`}
                          >
                            {selectedService.providerAccepted ? selectedService.assignedWorkers?.length || 0 : 0}/
                            {selectedService.workersRequired || 1} Workers
                          </span>
                        </p>
                      </div>
                      {selectedService.assignedWorkers && selectedService.assignedWorkers.length > 0 && (
                        <div>
                          <h3 className="text-xs font-medium uppercase tracking-wide text-gray-500">
                            Assigned Workers
                          </h3>
                          <ul className="mt-1 text-base font-medium text-gray-900 list-disc list-inside">
                            {selectedService.assignedWorkers.map((worker, index) => (
                              <li key={index}>{worker.name}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {selectedService.status === "pending" && (
                        <div>
                          <h3 className="text-xs font-medium uppercase tracking-wide text-gray-500">
                            Auto-Cancellation
                          </h3>
                          <p className="mt-1 text-base font-medium text-gray-900 flex items-center">
                            <Clock className="h-4 w-4 text-gray-400 mr-2" />
                            {selectedService.autoCancelDate}
                          </p>
                        </div>
                      )}
                      {selectedService.status === "completed" && selectedService.completedDate && (
                        <div>
                          <h3 className="text-xs font-medium uppercase tracking-wide text-gray-500">Completed On</h3>
                          <p className="mt-1 text-base font-medium text-gray-900 flex items-center">
                            <Check className="h-4 w-4 text-green-500 mr-2" />
                            {selectedService.completedDate}
                          </p>
                        </div>
                      )}
                    </div>

                    {selectedService.status === "completed" && selectedService.review && selectedService.rating && (
                      <div className="bg-gray-50/80 backdrop-blur-sm rounded-2xl p-6">
                        <h3 className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-4">
                          Customer Review
                        </h3>
                        <div className="flex items-center mb-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-5 w-5 ${
                                i < selectedService.rating! ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-base text-gray-800 italic">"{selectedService.review}"</p>
                      </div>
                    )}

                    <div className="bg-gray-50/80 backdrop-blur-sm rounded-2xl p-6">
                      <h3 className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-4">
                        Payment Summary
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Service Fee</span>
                          <span className="font-medium">₱{(selectedService.price || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Distance Charge</span>
                          <span className="font-medium">₱{(selectedService.distanceCharge || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-lg font-medium pt-3 border-t border-gray-200 mt-3">
                          <span>Total</span>
                          <span className="text-sky-600">₱{(selectedService.total || 0).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {selectedService.status === "pending" &&
                        getDaysRemaining(selectedService.autoCancelDate) <= 1 && (
                          <div className="bg-red-50/80 backdrop-blur-sm border border-red-100 rounded-2xl p-4 text-red-800 text-sm">
                            <p className="font-medium flex items-center">
                              <AlertCircle className="h-4 w-4 mr-2" />
                              This service request will be automatically cancelled on {selectedService.autoCancelDate}{" "}
                              if not accepted.
                            </p>
                          </div>
                        )}
                    </div>
                  </div>
                </div>

                <div className="p-6 border-t border-gray-100">
                  <div className="flex space-x-4">
                    {isActiveUnaccepted && (
                      <>
                        <button
                          onClick={() => setIsModalOpen(false)}
                          className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors duration-200 font-medium text-sm"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleAcceptOrAssignWorker(selectedService)}
                          disabled={isLoading}
                          className={`flex-1 px-6 py-3 text-white rounded-full transition-all duration-200 font-medium text-sm ${
                            isLoading
                              ? "bg-sky-400 cursor-wait"
                              : "bg-sky-500 hover:bg-sky-600 shadow-lg shadow-sky-200"
                          }`}
                        >
                          {isLoading ? (
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
                              Accept Service
                            </span>
                          )}
                        </button>
                      </>
                    )}

                    {isActiveAcceptedAssigning && (
                      <>
                        <button
                          onClick={() => handleCancelService(selectedService._id)}
                          disabled={isLoading}
                          className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors duration-200 font-medium text-sm"
                        >
                          Cancel Service
                        </button>
                        <button
                          onClick={() => handleAcceptOrAssignWorker(selectedService)}
                          className={`flex-1 px-6 py-3 text-white rounded-full transition-all duration-200 font-medium text-sm bg-purple-500 hover:bg-purple-600 shadow-lg shadow-purple-200`}
                        >
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
                            Waiting another provider ({selectedService.assignedWorkers?.length || 0}/
                            {selectedService.workersRequired})
                          </span>
                        </button>
                      </>
                    )}

                    {canTrackServiceInModal && (
                      <>
                        <button
                          onClick={() => handleCancelService(selectedService._id)}
                          disabled={isLoading}
                          className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors duration-200 font-medium text-sm"
                        >
                          Cancel Service
                        </button>
                        <button
                          onClick={() => handleTrackService(selectedService)}
                          className="flex-1 px-6 py-3 text-white rounded-full transition-all duration-200 font-medium text-sm bg-sky-500 hover:bg-sky-600 shadow-lg shadow-sky-200"
                        >
                          <span className="flex items-center justify-center">
                            <MapPin className="h-4 w-4 mr-2" />
                            Track Customer
                          </span>
                        </button>
                      </>
                    )}

                    {selectedService.status === "completed" && (
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
          </Dialog.Panel>
        </div>
      </Dialog>

      <Dialog open={isSuccessModalOpen} onClose={() => setIsSuccessModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30 backdrop-blur-md" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4 font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,sans-serif]">
          <Dialog.Panel
            className={`mx-auto max-w-md w-full bg-white/90 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl transform transition-all border ${successMessage.includes("cancelled") ? "border-yellow-200" : "border-white/20"} p-6 animate-[fadeIn_0.5s_ease-out]`}
          >
            <div className="flex flex-col items-center text-center">
              <div
                className={`w-20 h-20 rounded-full ${
                  successMessage.includes("cancelled")
                    ? "bg-yellow-100"
                    : successMessage.includes("Waiting") || successMessage.includes("assigned")
                      ? "bg-sky-100"
                      : "bg-green-100"
                } flex items-center justify-center mb-6 animate-[pulse_2s_ease-in-out_infinite]`}
              >
                {successMessage.includes("cancelled") ? (
                  <AlertCircle className="h-10 w-10 text-yellow-500 animate-[bounceIn_0.6s_ease-out]" />
                ) : successMessage.includes("Waiting") || successMessage.includes("assigned") ? (
                  <Users className="h-10 w-10 text-sky-500 animate-[bounceIn_0.6s_ease-out]" />
                ) : (
                  <CheckCircle2 className="h-10 w-10 text-green-500 animate-[bounceIn_0.6s_ease-out]" />
                )}
              </div>

              <Dialog.Title
                className={`text-xl font-medium ${
                  successMessage.includes("cancelled")
                    ? "text-yellow-600"
                    : successMessage.includes("Waiting") || successMessage.includes("assigned")
                      ? "text-sky-600"
                      : "text-gray-900"
                } mb-2 animate-[slideInUp_0.4s_ease-out]`}
              >
                {successMessage.includes("cancelled")
                  ? "Warning"
                  : successMessage.includes("Waiting") || successMessage.includes("assigned")
                    ? "Worker Assigned"
                    : "Success!"}
              </Dialog.Title>
              <p className="text-gray-600 mb-6 animate-[fadeIn_0.5s_ease-out_0.2s_both]">{successMessage}</p>

              <button
                onClick={() => setIsSuccessModalOpen(false)}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors duration-200 font-medium text-sm animate-[fadeIn_0.5s_ease-out_0.3s_both]"
              >
                Close
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      <Dialog open={showCancelReminder} onClose={() => setShowCancelReminder(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30 backdrop-blur-md" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4 font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,sans-serif]">
          <Dialog.Panel className="mx-auto max-w-md w-full bg-white/90 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl transform transition-all border border-yellow-200 p-6 animate-[fadeIn_0.5s_ease-out]">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center mb-6">
                <AlertCircle className="h-10 w-10 text-yellow-500" />
              </div>

              <Dialog.Title className="text-xl font-medium text-gray-900 mb-2">Cancellation Warning</Dialog.Title>
              <p className="text-gray-600 mb-2">You are about to cancel this service.</p>
              <p className="text-yellow-600 font-medium mb-6">
                You have {2 - cancelCount} cancellation{cancelCount === 1 ? "" : "s"} remaining before your account is
                suspended.
              </p>

              <div className="flex space-x-4 w-full">
                <button
                  onClick={() => setShowCancelReminder(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors duration-200 font-medium text-sm"
                >
                  Go Back
                </button>
                <button
                  onClick={confirmCancelService}
                  className="flex-1 px-6 py-3 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition-colors duration-200 font-medium text-sm"
                >
                  Proceed with Cancellation
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      <Dialog open={showSuspensionWarning} onClose={() => {}} className="relative z-50">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4 font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,sans-serif]">
          <Dialog.Panel className="mx-auto max-w-md w-full bg-white/90 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl transform transition-all border border-red-200 p-6 animate-[shakeX_0.8s_ease-in-out]">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-6 animate-[pulse_1s_ease-in-out_infinite]">
                <AlertCircle className="h-10 w-10 text-red-500" />
              </div>

              <Dialog.Title className="text-xl font-bold text-red-600 mb-2">Account Suspended!</Dialog.Title>
              <p className="text-gray-700 mb-2">
                Due to three cancellation strikes, your account has been suspended for 1 year.
              </p>
              <p className="text-gray-500 mb-6">You will be redirected to login in 30 seconds...</p>

              <div className="w-full bg-gray-200 rounded-full h-1.5 mb-6">
                <div className="bg-red-500 h-1.5 rounded-full animate-[countdown_30s_linear_forwards]"></div>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {showMapSimulation && serviceBeingTracked && (
        <Dialog open={showMapSimulation} onClose={() => {}} className="relative z-50">
          <div className="fixed inset-0 bg-black/30 backdrop-blur-md" aria-hidden="true" />

          <div className="fixed inset-0 flex items-center justify-center p-4 font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,sans-serif]">
            <Dialog.Panel className="mx-auto max-w-5xl w-full h-[85vh] bg-white/90 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl transform transition-all border border-white/20">
              <ProviderSimulation
                customerName={serviceBeingTracked.customerName}
                customerLocation={serviceBeingTracked.location.name}
                onSimulationComplete={handleSimulationComplete}
                onClose={() => setShowMapSimulation(false)}
              />
            </Dialog.Panel>
          </div>
        </Dialog>
      )}

      <Dialog
        open={isDetailedStatsModalOpen}
        onClose={() => setIsDetailedStatsModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30 backdrop-blur-md" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4 font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,sans-serif]">
          <Dialog.Panel className="mx-auto max-w-3xl w-full bg-white/90 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl transform transition-all border border-sky-200 p-6 animate-[fadeIn_0.5s_ease-out]">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-sky-100 flex items-center justify-center mb-6 animate-[pulse_2s_ease-in-out_infinite]">
                <Award className="h-10 w-10 text-sky-500 animate-[bounceIn_0.6s_ease-out]" />
              </div>

              <Dialog.Title className="text-xl font-medium text-sky-600 mb-6 animate-[slideInUp_0.4s_ease-out]">
                Your Performance Summary
              </Dialog.Title>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                      <p className="font-medium text-gray-900">Average Rating</p>
                    </div>
                    <span className="font-semibold text-gray-900">{averageRating}</span>
                  </div>

                  <h3 className="text-md font-semibold text-gray-900 text-left">Customer Reviews</h3>
                  <div className="space-y-4 w-full max-h-60 overflow-y-auto pr-2">
                    {providerCompletedBookings
                      .filter((s) => s.review && s.rating)
                      .map((service) => (
                        <div key={service._id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={service.userDetails?.profilePicture || "/placeholder.svg?height=32&width=32"}
                              alt={service.customerName}
                            />
                            <AvatarFallback>{service.customerName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{service.customerName}</p>
                            <div className="flex items-center mt-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < service.rating! ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <p className="text-sm text-gray-600 italic mt-1">"{service.review}"</p>
                          </div>
                        </div>
                      ))}
                    {totalReviews === 0 && <p className="text-center text-gray-500">No reviews yet.</p>}
                  </div>
                </div>

                <div className="flex flex-col space-y-4">
                  <div className="flex flex-col space-y-2 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Target className="h-5 w-5 text-sky-500" />
                      <div>
                        <p className="font-medium text-gray-900">Daily Quota</p>
                        <p className="text-sm text-gray-500">
                          {dailyQuota.completed}/{dailyQuota.target} completed
                        </p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-sky-500 h-2.5 rounded-full" style={{ width: `${dailyQuotaProgress}%` }}></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Award className="h-5 w-5 text-sky-500" />
                      <p className="font-medium text-gray-900">Total Services Completed</p>
                    </div>
                    <span className="font-semibold text-gray-900">{totalServicesCompleted}</span>
                  </div>

                  <h3 className="text-md font-semibold text-gray-900 text-left">Completed Bookings</h3>
                  <div className="space-y-4 w-full max-h-60 overflow-y-auto pr-2">
                    {providerCompletedBookings.map((service) => (
                      <ServiceCard key={service._id} service={service} />
                    ))}
                    {providerCompletedBookings.length === 0 && (
                      <p className="text-center text-gray-500">No completed bookings yet.</p>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsDetailedStatsModalOpen(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors duration-200 font-medium text-sm animate-[fadeIn_0.5s_ease-out_0.3s_both] mt-6"
              >
                Close
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      <div className="z-40 flex">
        <MyFloatingDockProvider />
      </div>
    </div>
  )
}

export default ProviderDashboard