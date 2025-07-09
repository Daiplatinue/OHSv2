import "leaflet/dist/leaflet.css"
import { useState, useEffect, useRef } from "react"
import { Share, Flag, MapPin, X, Check, ArrowLeft, Users } from "lucide-react"
import L from "leaflet"
import LocationSelectionModal from "./LocationSelectionModal"
import CompanyModal from "./CompanyModal"
import { getMockCompanyData } from "./company-data"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
// Remove this line:
// import Image from "next/image" // Import Image component for profile pictures
import { Clock } from "lucide-react"

// Add animation keyframes
const animationStyles = `
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

@keyframes pulse {
0% { transform: scale(1); }
50% { transform: scale(1.05); }
100% { transform: scale(1); }
}
`

interface Seller {
  id: number | string // Allow string for dynamic service IDs
  name: string
  rating: number
  reviews: number
  location: string
  startingRate: number
  ratePerKm: number
  badges: string[]
  description: string
  workerCount?: number
  estimatedTime?: string
}

interface CooDetails {
  _id: string // Changed to string
  firstName: string
  middleName?: string
  lastName: string
  profilePicture: string | null
  location?: { name: string }
}

interface ServiceDetails {
  id: string | number // Changed to string | number
  name: string
  price: number // This is the base price for the service itself
  category: string
  image: string
  description: string
  workerCount?: number // Optional for static subcategories
  estimatedTime?: string // Optional for static subcategories
  cooId?: CooDetails | null // Changed to cooId
  chargePerKm?: number
  totalRating?: number
  totalReviews?: number
  workersNeeded?: number
}

interface WorkersModalProps {
  isOpen: boolean
  onClose: () => void
  serviceDetails: ServiceDetails | null // Changed from productName to serviceDetails
  staticSellers: { [key: string]: Seller[] } // The original sellers object
}

interface Location {
  name: string
  lat: number
  lng: number
  distance: number
  estimatedTime?: number
  lightTrafficTime?: number
  midTrafficTime?: number
  heavyTrafficTime?: number
  weatherIssuesTime?: number
}

const COMPANY_LOCATION = {
  lat: 10.3125,
  lng: 123.8924,
  name: "HandyGO Headquarters",
}

function WorkersModal({ isOpen, onClose, serviceDetails, staticSellers }: WorkersModalProps) {
  console.log("WorkersModal: Component rendered. serviceDetails:", serviceDetails) // Log serviceDetails at the start

  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null)
  const [bookingStep, setBookingStep] = useState<number>(0)
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [totalRate, setTotalRate] = useState<number>(0)
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false)
  const [confirmationStep, setConfirmationStep] = useState<boolean>(false)
  const [currentMonth] = useState<Date>(new Date())
  const [, setCalendarDays] = useState<Date[]>([])
  const [isLocationModalOpen, setIsLocationModalOpen] = useState<boolean>(false)
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState<boolean>(false)
  const [selectedCompany, setSelectedCompany] = useState<any>(null)
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false)

  const mapRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)
  const companyMarkerRef = useRef<L.Marker | null>(null)
  const lineRef = useRef<L.Polyline | null>(null)

  // Generate calendar days for the current month
  useEffect(() => {
    const days = []
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()

    // Get the first day of the month
    const firstDay = new Date(year, month, 1)
    // Get the last day of the month
    const lastDay = new Date(year, month + 1, 0)

    // Get the day of the week for the first day (0 = Sunday, 1 = Monday, etc.)
    const firstDayOfWeek = firstDay.getDay()

    // Add days from previous month to fill the first week
    for (let i = firstDayOfWeek; i > 0; i--) {
      const prevMonthDay = new Date(year, month, 1 - i)
      days.push(prevMonthDay)
    }

    // Add all days of the current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i))
    }

    // Add days from next month to complete the last week
    const remainingDays = 7 - (days.length % 7)
    if (remainingDays < 7) {
      for (let i = 1; i <= remainingDays; i++) {
        days.push(new Date(year, month + 1, i))
      }
    }

    setCalendarDays(days)
  }, [currentMonth])

  // Reset scroll position when changing steps
  useEffect(() => {
    const modalContent = document.getElementById("modal-content")
    if (modalContent) {
      modalContent.scrollTop = 0
    }
  }, [bookingStep, selectedSeller, bookingSuccess, confirmationStep])

  // Initialize map when component mounts and bookingStep is 2 AND a location is selected
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
        markerRef.current = null
        companyMarkerRef.current = null
        lineRef.current = null
      }
    }
  }, [bookingStep])

  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl

    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    })
  }, [])

  if (!isOpen || !serviceDetails) return null

  // Determine the list of providers to display
  const allProviders: (Seller & { isCoo?: boolean; profilePicture?: string | null })[] = []

  if (serviceDetails.cooId) {
    // Check serviceDetails.cooId
    console.log("WorkersModal: serviceDetails.cooId found. Adding COO as provider:", serviceDetails.cooId)
    const cooFullName = `${serviceDetails.cooId.firstName} ${
      // Use serviceDetails.cooId
      serviceDetails.cooId.middleName ? serviceDetails.cooId.middleName + " " : ""
      }${serviceDetails.cooId.lastName}`.trim()

    allProviders.push({
      id: serviceDetails.cooId._id, // This should now be a string
      name: cooFullName,
      rating: serviceDetails.totalRating || 0, // Use totalRating from serviceDetails
      reviews: serviceDetails.totalReviews || 0, // Use totalReviews from serviceDetails
      location: serviceDetails.cooId.location?.name || "Online/Remote", // Use COO's location
      startingRate: serviceDetails.price,
      ratePerKm: serviceDetails.chargePerKm || 0, // Use chargePerKm from serviceDetails
      badges: ["COO"],
      description: serviceDetails.description, // Use service description
      workerCount: serviceDetails.workersNeeded || 1, // Use workersNeeded from serviceDetails
      isCoo: true,
      profilePicture: serviceDetails.cooId.profilePicture,
      estimatedTime: serviceDetails.estimatedTime,
    })
  } else {
    console.log("WorkersModal: No cooId found. Using static sellers.")
    // Otherwise, use the static sellers from Home-data.ts
    const serviceSpecificStaticSellers = staticSellers[serviceDetails.name] || []
    allProviders.push(...serviceSpecificStaticSellers)
  }
  console.log("WorkersModal: allProviders array after population:", allProviders, "Length:", allProviders.length) // Log allProviders after population

  const handleSellerSelect = (seller: Seller) => {
    setSelectedSeller(seller)
  }

  const handleShare = (sellerId: number | string) => {
    // In a real app, this would open a share dialog
    alert(`Sharing seller #${sellerId}`)
  }

  const handleReport = (sellerId: number | string) => {
    // In a real app, this would open a report dialog
    alert(`Reporting seller #${sellerId}`)
  }

  const handleBook = (seller: Seller) => {
    setSelectedSeller(seller)
    setBookingStep(1)
    setTotalRate(seller.startingRate)
  }

  // Add a function to open the location modal
  const openLocationModal = () => {
    setIsLocationModalOpen(true)
  }

  // Add a function to close the location modal
  const closeLocationModal = () => {
    setIsLocationModalOpen(false)
  }

  const openCompanyModal = (seller: Seller) => {
    // Get company data from our data file
    const companyData = getMockCompanyData(seller, serviceDetails.name) // Use serviceDetails.name
    setSelectedCompany(companyData)
    setIsCompanyModalOpen(true)
  }

  const closeCompanyModal = () => {
    setIsCompanyModalOpen(false)
    setSelectedCompany(null)
  }

  // Add a function to select a location from the modal
  const selectLocation = (location: Location) => {
    // Calculate estimated time (assuming average speed of 30 km/h)
    const estimatedTimeInMinutes = Math.round(location.distance * 2) // 2 minutes per km

    const locationWithTime = {
      ...location,
      estimatedTime: estimatedTimeInMinutes,
    }

    setSelectedLocation(locationWithTime)
    setIsLocationModalOpen(false)

    // Update total rate
    if (selectedSeller) {
      const newTotalRate = selectedSeller.startingRate + location.distance * selectedSeller.ratePerKm
      setTotalRate(newTotalRate)
    }
  }

  // Modify the handleDateSelect function to open the location modal after selecting a date
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
      setSelectedDate(formattedDate)
    } else {
      setSelectedDate("")
    }
  }

  const handleBookNow = () => {
    setConfirmationStep(true)
  }

  // Helper function to safely get user auth data
  const getUserAuthData = () => {
    try {
      // Get the user data from localStorage
      const userString = localStorage.getItem("user")
      if (!userString) {
        console.error("No user data found in localStorage")
        return { userId: null, token: null, firstname: "User" }
      }

      // Parse user data
      const userData = JSON.parse(userString)
      console.log("User data from localStorage:", userData)

      let userId = null
      let token = null
      let firstname = "User"

      // Format 1: { user: { _id: "...", firstname: "..." }, token: "..." }
      if (userData.user && userData.user._id) {
        userId = userData.user._id
        firstname = userData.user.firstname || firstname
        token = userData.token
      }
      // Format 2: { _id: "...", firstname: "...", token: "..." }
      else if (userData._id) {
        userId = userData._id
        firstname = userData.firstname || firstname
        token = userData.token
      }
      // Format 3: { id: "...", firstname: "...", token: "..." }
      else if (userData.id) {
        userId = userData.id
        firstname = userData.firstname || firstname
        token = userData.token
      }

      return { userId, token, firstname }
    } catch (error) {
      console.error("Error parsing user data:", error)
      return { userId: null, token: null, firstname: "User" }
    }
  }

  // Add a function to submit booking to MongoDB
  const submitBookingToDatabase = async () => {
    if (!selectedSeller || !selectedLocation || !selectedDate || !selectedTime) {
      console.error("Missing required booking information")
      return { success: false, error: "Missing required booking information" }
    }

    try {
      // Get user auth data using our helper function
      const { userId, token, firstname } = getUserAuthData()

      if (!userId || !token) {
        console.error("Authentication data missing, userId:", userId, "token:", token ? "exists" : "missing")
        return {
          success: false,
          error: "Authentication required. Please log in again.",
          authError: true,
        }
      }

      // Calculate distance charge
      const distanceCharge = selectedLocation.distance * selectedSeller.ratePerKm

      // Prepare booking data
      const bookingData = {
        userId,
        firstname,
        productName: serviceDetails.name, // Use serviceDetails.name
        providerName: selectedSeller.name,
        providerId: selectedSeller.id,
        workerCount: selectedSeller.workerCount || 1,
        bookingDate: selectedDate,
        bookingTime: selectedTime,
        location: {
          name: selectedLocation.name,
          lat: selectedLocation.lat,
          lng: selectedLocation.lng,
          distance: selectedLocation.distance,
        },
        estimatedTime: selectedLocation?.midTrafficTime ? `${selectedLocation.midTrafficTime} min` : "",
        pricing: {
          baseRate: selectedSeller.startingRate,
          distanceCharge: distanceCharge,
          totalRate: totalRate,
        },
      }

      console.log("Sending booking data:", bookingData)

      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/bookings`
      console.log("API URL:", apiUrl)

      // Send booking data to the server with authentication token
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Unknown error" }))
        console.error("Error creating booking:", errorData)

        if (response.status === 401) {
          return {
            success: false,
            error: "Your session has expired. Please log in again.",
            authError: true,
          }
        }

        return {
          success: false,
          error: errorData.message || `Server error (${response.status})`,
        }
      }

      const result = await response.json()
      console.log("Booking created successfully:", result)

      // Create booking notification
      try {
        const notificationData = {
          userId,
          bookingId: result._id,
          status: "pending",
          serviceName: serviceDetails.name, // Use serviceDetails.name
          providerName: selectedSeller.name,
        }

        console.log("Creating booking notification:", notificationData)

        await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/notifications/booking`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(notificationData),
        }).catch((err) => {
          // Log but don't fail if notification creation fails
          console.error("Error creating notification:", err)
        })
      } catch (notificationError) {
        console.error("Error creating booking notification:", notificationError)
        // Continue with booking success even if notification fails
      }

      return { success: true, result }
    } catch (error) {
      console.error("Error submitting booking:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      }
    }
  }

  const handleConfirmBooking = async () => {
    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      const { success, error, authError } = await submitBookingToDatabase()

      if (success) {
        setIsSubmitting(false)
        setConfirmationStep(false)
        setBookingSuccess(true)
      } else {
        setIsSubmitting(false)
        setErrorMessage(error || "There was an error creating your booking. Please try again.")
        setIsErrorModalOpen(true)

        // If it's an auth error, you might want to redirect to login or handle differently
        if (authError) {
          console.error("Authentication error during booking")
          // You could redirect to login here if needed
          // window.location.href = "/login"
        }
      }
    } catch (error) {
      console.error("Error during booking confirmation:", error)
      setIsSubmitting(false)
      setErrorMessage("An unexpected error occurred. Please try again.")
      setIsErrorModalOpen(true)
    }
  }

  const resetBooking = () => {
    setBookingStep(0)
    setSelectedSeller(null)
    setSelectedDate("")
    setSelectedLocation(null)
    setConfirmationStep(false)
    setBookingSuccess(false)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
  }

  const isPastDate = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  const handleErrorModalClose = () => {
    setIsErrorModalOpen(false)
    setErrorMessage(null)
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50">
      <style>{animationStyles}</style>
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-white/40">
        {/* Header section - always visible */}
        <div className="p-6 flex justify-between items-center border-b border-gray-100/50 bg-white/80 backdrop-blur-sm">
          {bookingStep === 0 && !selectedSeller && !bookingSuccess && !confirmationStep && (
            <>
              <h2 className="text-xl font-medium text-gray-700">Providers for {serviceDetails.name}</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="h-6 w-6" />
              </button>
            </>
          )}

          {selectedSeller && bookingStep === 1 && !confirmationStep && !bookingSuccess && (
            <>
              <div>
                <button
                  onClick={resetBooking}
                  className="flex items-center text-sky-600 hover:text-sky-700 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" /> Back to providers
                </button>
                <h2 className="text-xl font-medium text-gray-700 mt-2">Select a Date</h2>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="h-6 w-6" />
              </button>
            </>
          )}

          {selectedSeller && bookingStep === 2 && !confirmationStep && !bookingSuccess && (
            <>
              <div>
                <button
                  onClick={() => setBookingStep(1)}
                  className="flex items-center text-sky-600 hover:text-sky-700 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" /> Back to date selection
                </button>
                <h2 className="text-xl font-medium text-gray-700 mt-2">Select Service Location</h2>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="h-6 w-6" />
              </button>
            </>
          )}

          {confirmationStep && (
            <>
              <div>
                <button
                  onClick={() => setConfirmationStep(false)}
                  className="flex items-center text-sky-600 hover:text-sky-700 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" /> Back to location selection
                </button>
                <h2 className="text-xl font-medium text-gray-700 mt-2">Confirm Booking</h2>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="h-6 w-6" />
              </button>
            </>
          )}

          {bookingSuccess && (
            <>
              <h2 className="text-xl font-semibold text-black">Booking Confirmation</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="h-6 w-6" />
              </button>
            </>
          )}
        </div>

        {/* Scrollable content area */}
        <div id="modal-content" className="overflow-y-auto flex-grow">
          {bookingStep === 0 && !selectedSeller && !bookingSuccess && !confirmationStep && (
            <div className="p-6">
              {allProviders.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No providers available for this service</p>
              ) : (
                <div className="space-y-6">
                  {allProviders.map((seller) => {
                    console.log("WorkersModal: Mapping seller with ID:", seller.id) // Log seller ID for debugging key warning
                    return (
                      <div
                        key={seller.id} // This key should now be a string
                        className="bg-white/90 backdrop-blur-sm rounded-xl p-5 hover:bg-gray-50/90 transition-all cursor-pointer border border-gray-200/70 shadow-sm hover:shadow-md"
                        onClick={() => handleSellerSelect(seller)}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="flex items-center">
                              <div className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden bg-gray-200 border border-gray-300 mr-3">
                                {seller.profilePicture ? (
                                  <img
                                    src={seller.profilePicture || "/placeholder.svg"}
                                    alt={seller.name}
                                    className="object-cover w-full h-full"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-500 text-lg font-medium">
                                    {seller.name.charAt(0)}
                                  </div>
                                )}
                              </div>
                              <h3
                                className="text-black font-medium text-lg cursor-pointer hover:text-sky-600 hover:underline"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  openCompanyModal(seller)
                                }}
                              >
                                {seller.name}
                              </h3>
                            </div>
                            <p className="text-gray-700 text-sm mt-1 flex items-center ml-13">
                              <MapPin className="h-3 w-3 mr-1 text-gray-500" /> {seller.location}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-yellow-500 mb-1">
                              {"★".repeat(seller.rating)}
                              {"☆".repeat(5 - seller.rating)}
                            </div>
                            <p className="text-gray-700 text-sm">{seller.reviews} reviews</p>
                          </div>
                        </div>

                        <p className="text-gray-600 text-sm mb-3">{seller.description}</p>

                        {/* Worker count information */}
                        {seller.workerCount && (
                          <div className="flex items-center mb-3 text-gray-600 text-sm">
                            <Users className="h-4 w-4 mr-1 text-sky-600" />
                            <span>
                              {seller.workerCount} worker{seller.workerCount > 1 ? "s" : ""} will complete this service
                            </span>
                          </div>
                        )}

                        <div className="flex justify-between items-center">
                          <div className="text-green-600 font-medium">
                            Starting at ₱{seller.startingRate.toLocaleString()} • ₱{seller.ratePerKm}/km
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleShare(seller.id)
                              }}
                              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                            >
                              <Share className="h-4 w-4 text-gray-700" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleReport(seller.id)
                              }}
                              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                            >
                              <Flag className="h-4 w-4 text-gray-700" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleBook(seller)
                              }}
                              className="px-6 py-2 bg-sky-600 text-white rounded-full hover:bg-sky-700 transition-colors shadow-sm hover:shadow-md"
                            >
                              Book
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {selectedSeller && bookingStep === 1 && !confirmationStep && !bookingSuccess && (
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-medium">{selectedSeller.name}</h3>
                <p className="text-gray-600 text-sm">{selectedSeller.description}</p>
                {selectedSeller.estimatedTime && (
                  <div className="flex items-center mt-2 text-gray-600 text-sm">
                    <Clock className="h-4 w-4 mr-1 text-sky-600" />
                    <span>Estimated time: {selectedSeller.estimatedTime}</span>
                  </div>
                )}

                {/* Worker count information */}
                {selectedSeller.workerCount && (
                  <div className="flex items-center mt-2 text-gray-600 text-sm">
                    <Users className="h-4 w-4 mr-1 text-sky-600" />
                    <span>
                      {selectedSeller.workerCount} worker{selectedSeller.workerCount > 1 ? "s" : ""} will complete this
                      service
                    </span>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <h4 className="text-md font-medium mb-3 flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-2" /> Select a date and time for your booking
                </h4>

                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  {/* Date Picker */}
                  <div className="flex-1">
                    <Label htmlFor="date-select" className="sr-only">
                      Select Date
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !selectedDate && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? format(new Date(selectedDate), "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={selectedDate ? new Date(selectedDate) : undefined}
                          onSelect={handleDateSelect}
                          initialFocus
                          disabled={(date) => isPastDate(date)}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Time Selection */}
                  <div className="flex-1">
                    <Label htmlFor="time-select" className="sr-only">
                      Select Time
                    </Label>
                    <Select value={selectedTime} onValueChange={setSelectedTime}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="08:00">8:00 AM</SelectItem>
                        <SelectItem value="09:00">9:00 AM</SelectItem>
                        <SelectItem value="10:00">10:00 AM</SelectItem>
                        <SelectItem value="11:00">11:00 AM</SelectItem>
                        <SelectItem value="12:00">12:00 PM</SelectItem>
                        <SelectItem value="13:00">1:00 PM</SelectItem>
                        <SelectItem value="14:00">2:00 PM</SelectItem>
                        <SelectItem value="15:00">3:00 PM</SelectItem>
                        <SelectItem value="16:00">4:00 PM</SelectItem>
                        <SelectItem value="17:00">5:00 PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Selected date and time display */}
                {(selectedDate || selectedTime) && (
                  <div className="mt-4 p-3 bg-sky-50 border border-sky-100 rounded-lg text-center">
                    <p className="text-sky-800">
                      <span className="font-medium">Selected:</span>{" "}
                      {selectedDate ? formatDate(selectedDate) : "No date selected"}
                      {selectedDate && selectedTime && " at "}
                      {selectedTime
                        ? new Date(`2000-01-01T${selectedTime}`).toLocaleTimeString([], {
                          hour: "numeric",
                          minute: "2-digit",
                        })
                        : "No time selected"}
                    </p>
                  </div>
                )}

                <div className="mt-6 flex justify-center">
                  <Button
                    onClick={() => selectedDate && selectedTime && setBookingStep(2)}
                    disabled={!selectedDate || !selectedTime}
                    className="px-6 py-2 rounded-full transition-colors shadow-sm hover:shadow-md"
                  >
                    Continue
                  </Button>
                </div>
              </div>
            </div>
          )}

          {selectedSeller && bookingStep === 2 && !confirmationStep && !bookingSuccess && (
            <div className="p-6">
              <div className="mb-4">
                <h3 className="text-lg font-medium">{selectedSeller.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{selectedSeller.description}</p>
                <p className="text-gray-600 text-sm flex items-center mt-5">
                  <CalendarIcon className="h-4 w-4 mr-2 text-sky-600" />
                  <span className="font-medium">Selected date:</span> {formatDate(selectedDate)}
                  {selectedTime && (
                    <>
                      {" at "}
                      {new Date(`2000-01-01T${selectedTime}`).toLocaleTimeString([], {
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </>
                  )}
                </p>

                {/* Worker count information */}
                {selectedSeller.workerCount && (
                  <p className="text-gray-600 text-sm flex items-center mt-2">
                    <Users className="h-4 w-4 mr-2 text-sky-600" />
                    <span className="font-medium">Workers:</span> {selectedSeller.workerCount} worker
                    {selectedSeller.workerCount > 1 ? "s" : ""}
                  </p>
                )}
                {selectedSeller.estimatedTime && (
                  <p className="text-gray-600 text-sm flex items-center mt-2">
                    <Clock className="h-4 w-4 mr-2 text-sky-600" />
                    <span className="font-medium">Estimated time:</span> {selectedSeller.estimatedTime}
                  </p>
                )}
              </div>

              <div>
                <h4 className="text-md font-medium mb-3 flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-sky-600" /> Select your service location
                </h4>

                {selectedLocation ? (
                  <div className="mt-4 p-4 bg-sky-50 rounded-lg border border-sky-100 mb-4">
                    <h4 className="font-medium mb-2">Selected Location</h4>
                    <p className="text-gray-700 mb-1">{selectedLocation.name}</p>
                    <p className="text-gray-600 text-sm mb-1">
                      Distance from company: {selectedLocation.distance.toFixed(1)} km
                    </p>
                    <p className="text-gray-600 text-sm">
                      Estimated travel time: {selectedLocation.estimatedTime} minutes
                    </p>

                    <div className="mt-4 pt-4 border-t border-sky-200">
                      <h4 className="text-md font-medium mb-2">Pricing Breakdown</h4>
                      <div className="flex justify-between mb-2">
                        <span>Base rate:</span>
                        <span>₱{selectedSeller.startingRate.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span>
                          Distance charge ({selectedLocation.distance.toFixed(1)} km × ₱{selectedSeller.ratePerKm}):
                        </span>
                        <span>₱{(selectedLocation.distance * selectedSeller.ratePerKm).toFixed(2)}</span>
                      </div>
                      <div className="border-t border-sky-200 my-2"></div>
                      <div className="flex justify-between font-medium text-lg">
                        <span>Total:</span>
                        <span>
                          ₱
                          {totalRate.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Button to change location */}
                    <div className="flex justify-center mt-4">
                      <button
                        onClick={openLocationModal}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        Change Location
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 p-8 bg-gray-50 rounded-lg border border-gray-200 mb-4 text-center">
                    <p className="text-gray-600 mb-4">Please select a location to continue with your booking.</p>
                    <button
                      onClick={openLocationModal}
                      className="px-6 py-2 bg-sky-600 text-white rounded-full hover:bg-sky-700 transition-colors shadow-sm hover:shadow-md"
                    >
                      Select Location
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {confirmationStep && (
            <div className="p-6">
              {isSubmitting ? (
                <div className="flex flex-col items-center justify-center py-12 animate-fadeIn">
                  <div className="w-16 h-16 border-4 border-gray-200 border-t-sky-600 rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-700 font-medium">Processing your booking...</p>
                  <p className="text-gray-500 text-sm mt-2">Please wait while we confirm your request.</p>
                </div>
              ) : (
                <>
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Left side - Booking information */}
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6 flex-1">
                      <h3 className="text-lg font-medium mb-4">Booking Details</h3>

                      <div className="space-y-4">
                        <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                          <span className="text-gray-600">Service:</span>
                          <span className="font-medium">{serviceDetails.name}</span>
                        </div>

                        <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                          <span className="text-gray-600">Provider:</span>
                          <span className="font-medium">{selectedSeller?.name}</span>
                        </div>

                        {selectedSeller?.workerCount && (
                          <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                            <span className="text-gray-600">Workers:</span>
                            <span className="font-medium">
                              {selectedSeller.workerCount} worker{selectedSeller.workerCount > 1 ? "s" : ""}
                            </span>
                          </div>
                        )}

                        <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                          <span className="text-gray-600">Date:</span>
                          <span className="font-medium">{formatDate(selectedDate)}</span>
                        </div>

                        {selectedSeller?.estimatedTime && (
                          <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                            <span className="text-gray-600">Estimated Time:</span> {selectedSeller.estimatedTime}
                          </div>
                        )}

                        <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                          <span className="text-gray-600">Time:</span>
                          <span className="font-medium">
                            {selectedTime
                              ? new Date(`2000-01-01T${selectedTime}`).toLocaleTimeString([], {
                                hour: "numeric",
                                minute: "2-digit",
                              })
                              : "Not specified"}
                          </span>
                        </div>

                        <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                          <span className="text-gray-600">Service Location:</span>
                          <span className="font-medium">{selectedLocation?.name}</span>
                        </div>

                        <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                          <span className="text-gray-600">Distance:</span>
                          <span className="font-medium">{selectedLocation?.distance.toFixed(1)} km</span>
                        </div>

                        <div className="space-y-1 pb-2 border-b border-gray-200">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Estimated Travel Times:</span>
                          </div>
                          <div className="pl-4">
                            <div className="flex justify-between text-sm">
                              <span>Light Traffic:</span>
                              <span className="text-green-600">{selectedLocation?.lightTrafficTime} min</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Medium Traffic:</span>
                              <span className="text-yellow-600">{selectedLocation?.midTrafficTime} min</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Heavy Traffic:</span>
                              <span className="text-orange-600">{selectedLocation?.heavyTrafficTime} min</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Weather Issues:</span>
                              <span className="text-red-600">{selectedLocation?.weatherIssuesTime} min</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right side - Price calculations */}
                    <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6 flex-1 shadow-sm">
                      <h3 className="text-lg font-medium mb-4">Price Breakdown</h3>

                      <div className="space-y-4">
                        <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                          <span className="text-gray-600">Base rate:</span>
                          <span className="font-medium">₱{selectedSeller?.startingRate.toLocaleString()}</span>
                        </div>

                        <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                          <span className="text-gray-600">Distance:</span>
                          <span className="font-medium">{selectedLocation?.distance.toFixed(1)} km</span>
                        </div>

                        <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                          <span className="text-gray-600">Rate per km:</span>
                          <span className="font-medium">₱{selectedSeller?.ratePerKm.toFixed(2)}</span>
                        </div>

                        <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                          <span className="text-gray-600">Distance charge:</span>
                          <span className="font-medium">
                            ₱
                            {selectedLocation
                              ? (selectedLocation.distance * (selectedSeller?.ratePerKm || 0)).toFixed(2)
                              : 0}
                          </span>
                        </div>

                        <div className="flex justify-between items-center pt-2 text-lg">
                          <span className="font-medium">Total:</span>
                          <span className="font-bold text-sky-700">
                            ₱
                            {totalRate.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-6">
                    <p className="text-sm text-yellow-800">
                      By confirming this booking, you agree to the terms and conditions of service. The service provider
                      will contact you shortly to confirm the details.
                    </p>
                  </div>
                </>
              )}

              {errorMessage && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 animate-fadeIn">
                  <p className="text-red-700 flex items-center">
                    <X className="h-5 w-5 mr-2" />
                    {errorMessage}
                  </p>
                </div>
              )}
            </div>
          )}

          {bookingSuccess && (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <Check className="h-8 w-8 text-green-500 animate-pulse" />
              </div>
              <h3 className="text-xl font-medium text-black mb-2">Booking Submitted!</h3>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                <p className="text-green-800 text-sm">
                  <span className="font-medium">Notification sent!</span> Check your notifications for booking updates.
                </p>
              </div>
              <p className="text-gray-600 mb-6">
                Stay tuned! {selectedSeller?.name} will review and accept your booking soon.
              </p>

              <div className="flex flex-col md:flex-row gap-6 text-left">
                {/* Left side - Booking information */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6 flex-1">
                  <h4 className="font-medium mb-3">Booking Details</h4>
                  <div className="mb-2">
                    <span className="font-medium">Service:</span> {serviceDetails.name}
                  </div>
                  <div className="mb-2">
                    <span className="font-medium">Provider:</span> {selectedSeller?.name}
                  </div>
                  {selectedSeller?.workerCount && (
                    <div className="mb-2">
                      <span className="font-medium">Workers:</span> {selectedSeller.workerCount} worker
                      {selectedSeller.workerCount > 1 ? "s" : ""}
                    </div>
                  )}
                  <div className="mb-2">
                    <span className="font-medium">Date:</span> {formatDate(selectedDate)}
                  </div>
                  {selectedSeller?.estimatedTime && (
                    <div className="mb-2">
                      <span className="font-medium">Estimated Time:</span> {selectedSeller.estimatedTime}
                    </div>
                  )}
                  <div className="mb-2">
                    <span className="font-medium">
                      Time:
                    </span>{" "}
                    {selectedTime
                      ? new Date(`2000-01-01T${selectedTime}`).toLocaleTimeString([], {
                        hour: "numeric",
                        minute: "2-digit",
                      })
                      : "Not specified"}
                  </div>
                  <div className="mb-2">
                    <span className="font-medium">Service Location:</span> {selectedLocation?.name}
                  </div>
                  <div className="mb-2">
                    <span className="font-medium">Distance:</span> {selectedLocation?.distance.toFixed(1)} km
                  </div>

                  <div className="mb-2">
                    <span className="font-medium">Estimated Travel Times:</span>
                    <div className="pl-4 mt-1">
                      <div className="text-sm">
                        <span>Light Traffic:</span>{" "}
                        <span className="text-green-600">{selectedLocation?.lightTrafficTime} min</span>
                      </div>
                      <div className="text-sm">
                        <span>Medium Traffic:</span>{" "}
                        <span className="text-yellow-600">{selectedLocation?.midTrafficTime} min</span>
                      </div>
                      <div className="text-sm">
                        <span>Heavy Traffic:</span>{" "}
                        <span className="text-orange-600">{selectedLocation?.heavyTrafficTime} min</span>
                      </div>
                      <div className="text-sm">
                        <span>Weather Issues:</span>{" "}
                        <span className="text-red-600">{selectedLocation?.weatherIssuesTime} min</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right side - Price information */}
                <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6 flex-1 shadow-sm">
                  <h4 className="font-medium mb-3">Price Details</h4>
                  <div className="mb-2">
                    <span className="font-medium">Base Rate:</span> ₱{selectedSeller?.startingRate.toLocaleString()}
                  </div>
                  <div className="mb-2">
                    <span className="font-medium">Distance Charge:</span> ₱
                    {selectedLocation ? (selectedLocation.distance * (selectedSeller?.ratePerKm || 0)).toFixed(2) : 0}
                  </div>
                  <div className="mb-2 pt-2 border-t border-gray-200">
                    <span className="font-medium">Total:</span> ₱
                    {totalRate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer section with action buttons - fixed at bottom */}
        <div className="p-6 border-t border-gray-100/50 mt-auto bg-gray-50/80 backdrop-blur-sm">
          {bookingStep === 0 && !selectedSeller && !bookingSuccess && !confirmationStep && (
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-sky-600 text-white rounded-full hover:bg-sky-700 transition-colors shadow-sm hover:shadow-md"
              >
                Close
              </button>
            </div>
          )}

          {bookingStep === 2 && selectedSeller && !confirmationStep && !bookingSuccess && (
            <div className="flex justify-end">
              <button
                onClick={handleBookNow}
                disabled={!selectedLocation}
                className={`px-6 py-2 rounded-full transition-colors ${selectedLocation
                    ? "bg-sky-600 text-white hover:bg-sky-700 shadow-sm hover:shadow-md"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
              >
                Book Now
              </button>
            </div>
          )}

          {confirmationStep && (
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setConfirmationStep(false)}
                disabled={isSubmitting}
                className={`px-6 py-2 border border-gray-300 text-gray-700 rounded-lg transition-colors ${isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"
                  }`}
              >
                Back
              </button>
              <button
                onClick={handleConfirmBooking}
                disabled={isSubmitting}
                className={`px-6 py-2 bg-sky-600 text-white rounded-full transition-colors shadow-sm ${isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-sky-700 hover:shadow-md"
                  }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                    Processing...
                  </span>
                ) : (
                  "Confirm Booking"
                )}
              </button>
            </div>
          )}

          {bookingSuccess && (
            <div className="flex justify-end">
              <button
                onClick={resetBooking}
                className="px-6 py-2 bg-sky-600 text-white rounded-full hover:bg-sky-700 transition-colors shadow-sm hover:shadow-md"
              >
                Go Back
              </button>
            </div>
          )}
        </div>
      </div>
      {isLocationModalOpen && (
        <LocationSelectionModal
          isOpen={isLocationModalOpen}
          onClose={closeLocationModal}
          onSelectLocation={selectLocation}
          companyLocation={COMPANY_LOCATION}
          previousLocation={selectedLocation}
        />
      )}
      {isCompanyModalOpen && (
        <CompanyModal isOpen={isCompanyModalOpen} onClose={closeCompanyModal} company={selectedCompany} />
      )}
      {isErrorModalOpen && errorMessage && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50">
          <div className="mx-auto max-w-md w-full bg-white/90 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl transform transition-all border border-white/20 p-6 animate-fadeIn">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-6 animate-pulse">
                <X className="h-10 w-10 text-red-500 animate-bounceIn" />
              </div>

              <h3 className="text-xl font-medium text-gray-900 mb-2 animate-slideInUp">Booking Failed</h3>

              <p className="text-gray-600 mb-6 animate-fadeIn">{errorMessage}</p>

              <button
                onClick={handleErrorModalClose}
                className="px-8 py-3 bg-red-500 text-white rounded-full font-medium shadow-sm hover:bg-red-600 active:scale-95 transition-all duration-200 animate-fadeIn"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default WorkersModal