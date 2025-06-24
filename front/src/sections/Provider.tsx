import type React from "react"
import { useState, useEffect } from "react"
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
  Search,
  Mail,
  Bell,
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
// import Chart from "react-apexcharts" // Removed ApexCharts import

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar" // Shadcn Calendar component
import { format } from "date-fns" // For date formatting

interface Service {
  id: number
  customerName: string
  serviceName: string
  date: string
  time: string
  location: string
  price: number
  distanceCharge: number
  total: number
  image: string
  createdAt: string
  autoCancelDate: string
  status: "pending" | "ongoing" | "completed" | "cancelled"
  completedDate?: string
  workersRequired?: number
  workersAssigned?: number
  shortDescription?: string
  review?: string // Added review field
  rating?: number // Added rating field
}

interface RecentCustomer {
  id: number
  name: string
  avatar: string
  serviceName: string
  review: string
  totalPayment: number
  rating: number
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
    to { transform: translateY(0); opacity: 1; }
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
  const [activeTab, setActiveTab] = useState("pending")
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
  const [showWorkersWaitingModal, setShowWorkersWaitingModal] = useState(false)
  const [isDetailedStatsModalOpen, setIsDetailedStatsModalOpen] = useState(false) // New state for detailed stats modal

  const [pendingServices, setPendingServices] = useState<Service[]>([
    {
      id: 201,
      customerName: "Emma Wilson",
      serviceName: "Plumbing Services",
      date: "05/15/2025",
      time: "10:30 AM",
      location: "123 Oak Street, Springfield",
      price: 8000,
      distanceCharge: 450,
      total: 8450,
      image: "https://cdn.pixabay.com/photo/2024/07/23/09/14/ai-generated-8914595_1280.jpg",
      createdAt: "05/15/2025",
      autoCancelDate: "05/17/2025",
      status: "pending",
      workersRequired: 2,
      workersAssigned: 0,
      shortDescription: "Fixing leaky pipes and installing new fixtures.",
    },
    {
      id: 202,
      customerName: "James Rodriguez",
      serviceName: "Electrical Repairs",
      date: "05/16/2025",
      time: "2:00 PM",
      location: "456 Maple Avenue, Riverside",
      price: 6500,
      distanceCharge: 350,
      total: 6850,
      image: "https://cdn.pixabay.com/photo/2017/01/24/03/53/plant-2004483_1280.jpg",
      createdAt: "05/16/2025",
      autoCancelDate: "05/18/2025",
      status: "pending",
      workersRequired: 1,
      workersAssigned: 0,
      shortDescription: "Troubleshooting wiring issues and outlet repairs.",
    },
    {
      id: 203,
      customerName: "Sophia Chen",
      serviceName: "Cleaning Services",
      date: "05/18/2025",
      time: "9:00 AM",
      location: "789 Pine Road, Lakeside",
      price: 4000,
      distanceCharge: 300,
      total: 4300,
      image: "https://cdn.pixabay.com/photo/2014/02/17/14/28/vacuum-cleaner-268179_1280.jpg",
      createdAt: "05/18/2025",
      autoCancelDate: "05/20/2025",
      status: "pending",
      workersRequired: 3,
      workersAssigned: 0,
      shortDescription: "Deep cleaning of a 3-bedroom apartment.",
    },
    {
      id: 204,
      customerName: "Michael Brown",
      serviceName: "Home Renovation",
      date: "05/20/2025",
      time: "11:00 AM",
      location: "321 Cedar Lane, Hillcrest",
      price: 15000,
      distanceCharge: 600,
      total: 15600,
      image: "https://cdn.pixabay.com/photo/2016/11/18/17/20/living-room-1835923_1280.jpg",
      createdAt: "05/20/2025",
      autoCancelDate: "05/22/2025",
      status: "pending",
      workersRequired: 4,
      workersAssigned: 0,
      shortDescription: "Kitchen and bathroom remodeling project.",
    },
  ])

  const [ongoingServices, setOngoingServices] = useState<Service[]>([
    {
      id: 101,
      customerName: "David Johnson",
      serviceName: "Lawn Maintenance",
      date: "05/12/2025",
      time: "1:00 PM",
      location: "567 Elm Street, Meadowville",
      price: 3500,
      distanceCharge: 200,
      total: 3700,
      image: "https://cdn.pixabay.com/photo/2017/08/07/01/01/garden-2598867_1280.jpg",
      createdAt: "05/05/2025",
      autoCancelDate: "05/07/2025",
      status: "ongoing",
      workersRequired: 2,
      workersAssigned: 2,
      shortDescription: "Weekly lawn mowing and garden care.",
    },
    {
      id: 102,
      customerName: "Sarah Miller",
      serviceName: "Interior Design",
      date: "05/13/2025",
      time: "11:30 AM",
      location: "890 Birch Avenue, Westfield",
      price: 12000,
      distanceCharge: 500,
      total: 12500,
      image: "https://cdn.pixabay.com/photo/2017/03/28/12/11/chairs-2181960_1280.jpg",
      createdAt: "05/04/2025",
      autoCancelDate: "05/06/2025",
      status: "ongoing",
      workersRequired: 3,
      workersAssigned: 3,
      shortDescription: "Consultation and design for living room.",
    },
  ])

  const [completedServices] = useState<Service[]>([
    {
      id: 1,
      customerName: "Jennifer Lee",
      serviceName: "Roof Repair",
      date: "05/01/2025",
      time: "9:00 AM",
      location: "123 Pine Street, Oakville",
      price: 9000,
      distanceCharge: 400,
      total: 9400,
      image: "https://cdn.pixabay.com/photo/2018/03/15/11/57/roof-3228969_1280.jpg",
      createdAt: "04/25/2025",
      autoCancelDate: "04/27/2025",
      status: "completed",
      completedDate: "05/01/2025",
      workersRequired: 3,
      workersAssigned: 3,
      shortDescription: "Repair of damaged roof tiles and sealing.",
      review: "The roof repair was done quickly and efficiently. Very satisfied with the results!",
      rating: 5,
    },
    {
      id: 2,
      customerName: "Robert Garcia",
      serviceName: "Painting Services",
      date: "05/03/2025",
      time: "10:00 AM",
      location: "456 Oak Avenue, Riverdale",
      price: 7500,
      distanceCharge: 350,
      total: 7850,
      image: "https://cdn.pixabay.com/photo/2016/11/18/17/46/house-1836070_1280.jpg",
      createdAt: "04/26/2025",
      autoCancelDate: "04/28/2025",
      status: "completed",
      completedDate: "05/03/2025",
      workersRequired: 2,
      workersAssigned: 2,
      shortDescription: "Interior painting for two rooms.",
      review: "Fantastic paint job! The team was very professional and paid great attention to detail.",
      rating: 4,
    },
  ])

  // Derived data for Recent Customers
  const recentCustomers: RecentCustomer[] = completedServices.map((service) => ({
    id: service.id,
    name: service.customerName,
    avatar: "/placeholder.svg?height=40&width=40", // Placeholder avatar
    serviceName: service.serviceName,
    review: service.review || "",
    totalPayment: service.total,
    rating: service.rating || 0,
  }))

  // Filter services for "Accepted Services" section: ongoing services or pending services with at least one worker assigned
  const acceptedServices = [...pendingServices.filter((s) => (s.workersAssigned || 0) > 0), ...ongoingServices]

  const handleServiceClick = (service: Service) => {
    setSelectedService(service)
    setIsModalOpen(true)
  }

  const handleAcceptService = (serviceId: number) => {
    setIsLoading(true)

    setTimeout(() => {
      const serviceToUpdate = pendingServices.find((service) => service.id === serviceId)

      if (serviceToUpdate) {
        const workersAssigned = (serviceToUpdate.workersAssigned || 0) + 1
        const workersRequired = serviceToUpdate.workersRequired || 1

        if (workersAssigned >= workersRequired) {
          const updatedService = {
            ...serviceToUpdate,
            status: "ongoing" as const,
            workersAssigned: workersRequired,
          }

          setPendingServices((prev) => prev.filter((service) => service.id !== serviceId))
          setOngoingServices((prev) => [...prev, updatedService])

          setSuccessMessage("Service accepted successfully! All required workers are now assigned.")
        } else {
          setPendingServices((prev) =>
            prev.map((service) =>
              service.id === serviceId ? { ...service, workersAssigned: workersAssigned } : service,
            ),
          )

          setShowWorkersWaitingModal(true)
          setSuccessMessage(
            `Worker assigned successfully! Waiting for ${workersRequired - workersAssigned} more worker(s).`,
          )
        }

        setIsSuccessModalOpen(true)

        setTimeout(() => {
          setIsSuccessModalOpen(false)
        }, 5000)
      }

      setIsModalOpen(false)
      setIsLoading(false)
    }, 1500)
  }

  const handleCancelService = (serviceId: number) => {
    setShowCancelReminder(true)
    setSelectedService(ongoingServices.find((service) => service.id === serviceId) || null)
  }

  const confirmCancelService = () => {
    setShowCancelReminder(false)
    setIsLoading(true)

    setTimeout(() => {
      if (selectedService) {
        const workersAssigned = selectedService.workersAssigned || 0
        const workersRequired = selectedService.workersRequired || 1

        const newWorkerCount = Math.max(0, workersAssigned - 1)

        if (newWorkerCount === 0) {
          setOngoingServices((prev) => prev.filter((service) => service.id !== selectedService.id))

          setPendingServices((prev) => [
            ...prev,
            {
              ...selectedService,
              status: "pending" as const,
              workersAssigned: newWorkerCount,
            },
          ])
        } else if (newWorkerCount < workersRequired) {
          setOngoingServices((prev) => prev.filter((service) => service.id !== selectedService.id))

          setPendingServices((prev) => [
            ...prev,
            {
              ...selectedService,
              status: "pending" as const,
              workersAssigned: newWorkerCount,
            },
          ])
        } else {
          setOngoingServices((prev) =>
            prev.map((service) =>
              service.id === selectedService.id ? { ...service, workersAssigned: newWorkerCount } : service,
            ),
          )
        }

        const newCancelCount = cancelCount + 1
        setCancelCount(newCancelCount)

        if (newCancelCount >= 3) {
          setShowSuspensionWarning(true)

          setTimeout(() => {
            window.location.href = "/login"
          }, 30000)
        } else {
          setSuccessMessage("Service has been cancelled. Worker count has been updated.")
          setIsModalOpen(false)
          setIsSuccessModalOpen(true)

          setTimeout(() => {
            setIsSuccessModalOpen(false)
          }, 5000)
        }
      }

      setIsLoading(false)
    }, 1500)
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
    const isPending = service.status === "pending"
    const isOngoing = service.status === "ongoing"
    const isCompleted = service.status === "completed"

    return (
      <Card className="rounded-xl shadow-sm overflow-hidden flex flex-col h-full">
        <div className="relative h-40 w-full">
          <img
            src={service.image || "/placeholder.svg"}
            alt={service.serviceName}
            className="w-full h-full object-cover rounded-t-xl"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <span
            className={`absolute bottom-2 left-2 text-xs font-medium px-2 py-1 rounded-full
            ${isPending ? "bg-yellow-100 text-yellow-800" : ""}
            ${isOngoing ? "bg-sky-100 text-sky-800" : ""}
            ${isCompleted ? "bg-green-100 text-green-800" : ""}
            `}
          >
            {isPending && "Pending"}
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
              <span className="line-clamp-1">{service.location}</span>
            </div>
            <div className="flex items-center col-span-2">
              <Users className="h-4 w-4 mr-2 text-gray-400" />
              <span>
                Workers: {service.workersAssigned || 0}/{service.workersRequired || 1}
              </span>
            </div>
          </div>

          <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
            <span className="text-lg font-bold text-sky-600">₱{service.total.toLocaleString()}</span>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-gray-400 hover:bg-gray-100"
              onClick={() => handleServiceClick(service)}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          {isPending && (
            <div className="mt-4 flex flex-col gap-2">
              <Button
                onClick={() => handleAcceptService(service.id)}
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
                    {(service.workersAssigned || 0) === 0
                      ? "Accept Service"
                      : `Assign Worker (${service.workersAssigned}/${service.workersRequired})`}
                  </span>
                )}
              </Button>
              <p className="text-xs text-gray-500 text-center mt-1">
                Auto-cancel: {service.autoCancelDate} ({getDaysRemaining(service.autoCancelDate)} days left)
              </p>
            </div>
          )}

          {isOngoing && (
            <div className="mt-4 flex flex-col gap-2">
              <Button
                onClick={() => handleTrackService(service)}
                className="w-full bg-black text-white hover:bg-gray-800 rounded-full"
              >
                <MapPin className="h-4 w-4 mr-2" /> Track Customer
              </Button>
              <Button
                onClick={() => handleCancelService(service.id)}
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
      return <div className="text-center py-10 text-gray-500">No {activeTab} services found.</div>
    }
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    )
  }

  // Statistic Card Data
  const totalServicesCompleted = completedServices.length
  const totalReviews = completedServices.filter((s) => s.review).length
  const averageRating =
    totalReviews > 0
      ? (completedServices.reduce((sum, s) => sum + (s.rating || 0), 0) / totalReviews).toFixed(1)
      : "N/A"

  const dailyQuota = {
    target: 5,
    completed: completedServices.filter(
      (s) => new Date(s.completedDate || "").toDateString() === new Date().toDateString(),
    ).length,
  }
  const dailyQuotaProgress = (dailyQuota.completed / dailyQuota.target) * 100

  // Calendar Card Data
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 font-sans">
      <style>{keyframes}</style>

      {/* Header */}
      <header className="flex flex-col sm:flex-row items-center justify-between p-4 bg-white shadow-sm">
        <div className="relative flex-1 w-full sm:max-w-md sm:mr-4 mb-4 sm:mb-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search your service..."
            className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-200"
          />
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100">
            <Mail className="h-6 w-6 text-gray-500" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100">
            <Bell className="h-6 w-6 text-gray-500" />
          </Button>
          <div className="flex items-center space-x-2">
            <Avatar className="h-9 w-9">
              <AvatarImage src="/placeholder.svg?height=36&width=36" alt="Jason Ranti" />
              <AvatarFallback>JR</AvatarFallback>
            </Avatar>
            <span className="font-medium text-gray-800 hidden sm:inline">Jason Ranti</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 md:gap-6">
        {/* Left Column - Accepted Services & Service Cards */}
        <div className="space-y-4 md:space-y-6">
          {/* Hero Section */}
          <div className="relative bg-gradient-to-br from-sky-600 to-sky-800 text-white p-6 md:p-8 rounded-2xl overflow-hidden shadow-lg">
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('/placeholder.svg?height=800&width=1600')" }}
            ></div>
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/40"></div>
            {/* Simple star/sparkle pattern for background */}
            <div className="absolute inset-0 opacity-20">
              <svg className="w-full h-full" fill="currentColor" viewBox="0 0 100 100" preserveAspectRatio="none">
                <circle cx="10" cy="10" r="3" />
                <circle cx="90" cy="20" r="4" />
                <circle cx="30" cy="80" r="2" />
                <circle cx="70" cy="90" r="5" />
                <path
                  d="M50 0 L55 10 L65 10 L60 15 L65 25 L55 20 L50 30 L45 20 L35 25 L40 15 L35 10 L45 10 Z"
                  transform="translate(10 10) scale(0.5)"
                />
                <path
                  d="M50 0 L55 10 L65 10 L60 15 L65 25 L55 20 L50 30 L45 20 L35 25 L40 15 L35 10 L45 10 Z"
                  transform="translate(70 60) scale(0.7)"
                />
              </svg>
            </div>
            <div className="relative z-10">
              <span className="text-sm font-semibold uppercase tracking-wider opacity-80">Service Provider</span>
              <h2 className="text-2xl md:text-4xl font-bold mt-2 leading-tight">
                Manage Your Services and Track Progress
              </h2>
              <Button className="mt-4 md:mt-6 bg-white text-sky-700 hover:bg-gray-100 rounded-full px-6 py-3 shadow-md">
                Learn More About Online Home Services <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Accepted Services Cards */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Accepted Services</h2>
            {acceptedServices.length === 0 ? (
              <div className="text-center py-10 text-gray-500">No accepted services found.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {acceptedServices.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            )}
          </div>

          {/* Service Management Section (now with cards) */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Service Management</h2>
            <div className="px-6 border-b border-gray-200 bg-white rounded-t-lg">
              <nav className="flex -mb-px overflow-x-auto">
                <button
                  onClick={() => setActiveTab("pending")}
                  className={`py-4 px-6 font-medium text-sm border-b-2 flex items-center gap-2 ${
                    activeTab === "pending"
                      ? "border-sky-500 text-sky-500"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Pending Services
                </button>
                <button
                  onClick={() => setActiveTab("ongoing")}
                  className={`py-4 px-6 font-medium text-sm border-b-2 flex items-center gap-2 ${
                    activeTab === "ongoing"
                      ? "border-sky-500 text-sky-500"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Ongoing Services
                </button>
                <button
                  onClick={() => setActiveTab("completed")}
                  className={`py-4 px-6 font-medium text-sm border-b-2 flex items-center gap-2 ${
                    activeTab === "completed"
                      ? "border-sky-500 text-sky-500"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Completed Services
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-4 md:p-6 bg-white rounded-b-lg shadow-sm">
              {activeTab === "pending" && renderServiceCards(pendingServices)}
              {activeTab === "ongoing" && renderServiceCards(ongoingServices)}
              {activeTab === "completed" && renderServiceCards(completedServices)}
            </div>
          </div>
        </div>

        {/* Right Column - Statistics & Recent Customers */}
        <div className="space-y-4 md:space-y-6">
          {/* Statistic Card */}
          <Card className="p-6 rounded-2xl shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between p-0 mb-4">
              <CardTitle className="text-lg font-semibold text-gray-900">Statistic</CardTitle>
              <Button variant="ghost" size="icon" className="rounded-full">
                <MoreVertical className="h-5 w-5 text-gray-400" />
              </Button>
            </CardHeader>
            <CardContent className="p-0 flex flex-col items-center text-center">
              <div className="relative w-32 h-32 mb-4 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-gray-200 flex items-center justify-center">
                  {/* This div simulates the filled part of the circular progress */}
                  <div
                    className="absolute inset-0 rounded-full border-4 border-sky-500"
                    style={{
                      clipPath: "polygon(50% 0%, 50% 50%, 100% 50%, 100% 0%)", // Top right quadrant
                      transform: `rotate(${dailyQuotaProgress * 3.6}deg)`, // Dynamic rotation
                      transformOrigin: "center center",
                    }}
                  ></div>
                </div>
                <Avatar className="w-[calc(100%-16px)] h-[calc(100%-16px)]">
                  <AvatarImage src="/placeholder.svg?height=128&width=128" alt="Jason Ranti" />
                  <AvatarFallback>JR</AvatarFallback>
                </Avatar>
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm font-bold text-sky-600">
                  {dailyQuotaProgress.toFixed(0)}%
                </span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Good Morning Jason 🔥</h3>
              <p className="text-sm text-gray-500 mt-1">Continue your learning to achieve your target!</p>

              {/* Performance Overview Section */}
              <div className="w-full mt-6 pt-4 border-t border-gray-100">
                <h3 className="text-md font-semibold text-gray-900 mb-4 text-left">Your Performance Overview</h3>
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
                {/* Daily Quota Progress Bar */}
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

          {/* Recent Customer Card */}
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
                    <p className="text-sm font-semibold text-sky-600">₱{customer.totalPayment.toLocaleString()}</p>
                    <Button
                      variant="default"
                      className="rounded-full px-4 py-2 text-sm bg-sky-500 text-white hover:bg-sky-600"
                      onClick={() => {
                        const serviceFound = completedServices.find((s) => s.id === customer.id)
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

          {/* Calendar Card */}
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

      {/* Service Details Modal (Existing) */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30 backdrop-blur-md" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4 font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,sans-serif]">
          <Dialog.Panel className="mx-auto max-w-2xl w-full bg-white/90 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl transform transition-all border border-white/20">
            {selectedService && (
              <div className="flex flex-col h-full">
                {/* Image Section - Top */}
                <div className="relative h-48 w-full">
                  <img
                    src={selectedService.image || "/placeholder.svg"}
                    alt={selectedService.serviceName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60" />

                  {/* Service name overlay on image */}
                  <div className="absolute bottom-0 left-0 p-6 w-full">
                    <h3 className="text-2xl font-light text-white tracking-tight">{selectedService.serviceName}</h3>
                    <div
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 
                      ${
                        selectedService.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : selectedService.status === "ongoing"
                            ? "bg-sky-100 text-sky-800"
                            : "bg-green-100 text-green-800"
                      }`}
                    >
                      {selectedService.status === "pending"
                        ? "Pending"
                        : selectedService.status === "ongoing"
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
                        <p className="mt-1 text-base font-medium text-gray-900">{selectedService.customerName}</p>
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
                          <span>{selectedService.location}</span>
                        </p>
                      </div>
                      <div>
                        <h3 className="text-xs font-medium uppercase tracking-wide text-gray-500">Workers Required</h3>
                        <p className="mt-1 text-base font-medium text-gray-900 flex items-center">
                          <Users className="h-4 w-4 text-gray-400 mr-2" />
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                            ${
                              (selectedService.workersAssigned || 0) === 0
                                ? "bg-gray-100 text-gray-800"
                                : (selectedService.workersAssigned || 0) < (selectedService.workersRequired || 1)
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800"
                            }`}
                          >
                            {selectedService.workersAssigned || 0}/{selectedService.workersRequired || 1} Workers
                          </span>
                        </p>
                      </div>
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
                          <span className="font-medium">₱{selectedService.price.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Distance Charge</span>
                          <span className="font-medium">₱{selectedService.distanceCharge.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-lg font-medium pt-3 border-t border-gray-200 mt-3">
                          <span>Total</span>
                          <span className="text-sky-600">₱{selectedService.total.toLocaleString()}</span>
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

                {/* Footer with buttons - Fixed at bottom */}
                <div className="p-6 border-t border-gray-100">
                  <div className="flex space-x-4">
                    {selectedService.status === "pending" && (
                      <>
                        <button
                          onClick={() => setIsModalOpen(false)}
                          className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors duration-200 font-medium text-sm"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleAcceptService(selectedService.id)}
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
                              {(selectedService.workersAssigned || 0) === 0
                                ? "Accept Service"
                                : `Assign Worker (${selectedService.workersAssigned}/${selectedService.workersRequired})`}
                            </span>
                          )}
                        </button>
                      </>
                    )}

                    {selectedService.status === "ongoing" && (
                      <>
                        <button
                          onClick={() => handleCancelService(selectedService.id)}
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

      {/* Success/Warning Modal (Existing) */}
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
                    : successMessage.includes("Waiting")
                      ? "bg-sky-100"
                      : "bg-green-100"
                } flex items-center justify-center mb-6 animate-[pulse_2s_ease-in-out_infinite]`}
              >
                {successMessage.includes("cancelled") ? (
                  <AlertCircle className="h-10 w-10 text-yellow-500 animate-[bounceIn_0.6s_ease-out]" />
                ) : successMessage.includes("Waiting") ? (
                  <Users className="h-10 w-10 text-sky-500 animate-[bounceIn_0.6s_ease-out]" />
                ) : (
                  <CheckCircle2 className="h-10 w-10 text-green-500 animate-[bounceIn_0.6s_ease-out]" />
                )}
              </div>

              <Dialog.Title
                className={`text-xl font-medium ${
                  successMessage.includes("cancelled")
                    ? "text-yellow-600"
                    : successMessage.includes("Waiting")
                      ? "text-sky-600"
                      : "text-gray-900"
                } mb-2 animate-[slideInUp_0.4s_ease-out]`}
              >
                {successMessage.includes("cancelled")
                  ? "Warning"
                  : successMessage.includes("Waiting")
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

      {/* Workers Waiting Modal (Updated to match image) */}
      <Dialog
        open={showWorkersWaitingModal}
        onClose={() => setShowWorkersWaitingModal(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30 backdrop-blur-md" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4 font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,sans-serif]">
          <Dialog.Panel className="mx-auto max-w-md w-full bg-white/90 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl transform transition-all border border-sky-200 p-6 animate-[fadeIn_0.5s_ease-out]">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-sky-100 flex items-center justify-center mb-6 animate-[pulse_2s_ease-in-out_infinite]">
                <Users className="h-10 w-10 text-sky-500 animate-[bounceIn_0.6s_ease-out]" />
              </div>

              <Dialog.Title className="text-xl font-medium text-sky-600 mb-6 animate-[slideInUp_0.4s_ease-out]">
                Worker Assignment Status
              </Dialog.Title>

              <button
                onClick={() => setShowWorkersWaitingModal(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors duration-200 font-medium text-sm animate-[fadeIn_0.5s_ease-out_0.3s_both]"
              >
                Close
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Cancel Reminder Modal (Existing) */}
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

      {/* Account Suspension Warning Modal (Existing) */}
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

      {/* Map Simulation Modal (Existing) */}
      {showMapSimulation && serviceBeingTracked && (
        <Dialog open={showMapSimulation} onClose={() => {}} className="relative z-50">
          <div className="fixed inset-0 bg-black/30 backdrop-blur-md" aria-hidden="true" />

          <div className="fixed inset-0 flex items-center justify-center p-4 font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,sans-serif]">
            <Dialog.Panel className="mx-auto max-w-5xl w-full h-[85vh] bg-white/90 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl transform transition-all border border-white/20">
              <ProviderSimulation
                customerName={serviceBeingTracked.customerName}
                customerLocation={serviceBeingTracked.location}
                onSimulationComplete={handleSimulationComplete}
                onClose={() => setShowMapSimulation(false)}
              />
            </Dialog.Panel>
          </div>
        </Dialog>
      )}

      {/* Detailed Stats Modal (New) */}
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
                {/* Left Column */}
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
                    {completedServices
                      .filter((s) => s.review && s.rating)
                      .map((service) => (
                        <div key={service.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="/placeholder.svg?height=32&width=32" alt={service.customerName} />
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

                {/* Right Column */}
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

                  <h3 className="text-md font-semibold text-gray-900 text-left">Completed Services</h3>
                  <div className="space-y-4 w-full max-h-60 overflow-y-auto pr-2">
                    {completedServices.map((service) => (
                      <ServiceCard key={service.id} service={service} />
                    ))}
                    {completedServices.length === 0 && (
                      <p className="text-center text-gray-500">No completed services yet.</p>
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

      {/* Floating Dock (Existing) */}
      <div className="z-40 flex">
        <MyFloatingDockProvider />
      </div>
    </div>
  )
}

export default ProviderDashboard