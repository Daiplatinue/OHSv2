import type React from "react"
import { useState, useEffect } from "react"
import axios from "axios"
import MyFloatingDock from "../Styles/MyFloatingDock-Customer"
import { Dialog } from "@headlessui/react"
import { MapPin, Camera, X, Loader2 } from "lucide-react"
import image1 from "../../assets/No_Image_Available.jpg"
import Footer from "../Styles/Footer"

interface PersonalInfo {
  id: number
  type: string
  title: string
  description: string
  startDate?: string
  endDate?: string
  location?: string
  organization?: string
  hasNotification?: boolean
  notificationCount?: number
  image?: string
}

interface UserDetails {
  _id: string
  firstname: string
  lastname: string
  middleName?: string
  email: string
  contact: string
  gender?: string
  bio?: string
  profilePicture?: string
  coverPhoto?: string
  location?: {
    name: string
    lat: number
    lng: number
    distance: number
    zipCode: string
  }
  type: string
  status: string
  verification: string
  createdAt: string
}

function MyProfile() {
  const [activeTab, setActiveTab] = useState("personal")
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedInfo, ] = useState<PersonalInfo | null>(null)
  const [editedInfo, setEditedInfo] = useState<Partial<PersonalInfo>>({})
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null)

  const [personalInfo, setPersonalInfo] = useState<PersonalInfo[]>([
    {
      id: 1,
      type: "education",
      title: "Computer Science",
      description: "Bachelor's degree in Computer Science with focus on software engineering and data structures.",
      startDate: "2010-09-01",
      endDate: "2014-06-30",
      organization: "Stanford University",
      location: "Stanford, CA",
      image: "https://cdn.pixabay.com/photo/2017/01/24/03/53/plant-2004483_1280.jpg",
    },
    {
      id: 2,
      type: "education",
      title: "Machine Learning",
      description: "Master's degree in Machine Learning and Artificial Intelligence.",
      startDate: "2014-09-01",
      endDate: "2016-06-30",
      organization: "MIT",
      location: "Cambridge, MA",
      image: "https://cdn.pixabay.com/photo/2016/11/18/17/20/living-room-1835923_1280.jpg",
    },
    {
      id: 3,
      type: "experience",
      title: "Senior Developer",
      description: "Led a team of 5 developers to build and maintain enterprise-level web applications.",
      startDate: "2020-01-15",
      endDate: "Present",
      organization: "Tech Solutions Inc.",
      location: "San Francisco, CA",
      hasNotification: true,
      notificationCount: 2,
      image: "https://cdn.pixabay.com/photo/2024/07/23/09/14/ai-generated-8914595_1280.jpg",
    },
    {
      id: 4,
      type: "experience",
      title: "Web Developer",
      description: "Developed and maintained client websites using React, Node.js, and MongoDB.",
      startDate: "2016-08-01",
      endDate: "2019-12-31",
      organization: "Digital Creations",
      location: "Los Angeles, CA",
      image: "https://cdn.pixabay.com/photo/2014/02/17/14/28/vacuum-cleaner-268179_1280.jpg",
    },
    {
      id: 5,
      type: "skills",
      title: "Frontend Development",
      description:
        "Proficient in React, Vue.js, HTML5, CSS3, and JavaScript. Experienced in building responsive and accessible web applications.",
      image: "https://cdn.pixabay.com/photo/2016/11/18/17/20/living-room-1835923_1280.jpg",
    },
    {
      id: 6,
      type: "skills",
      title: "Backend Development",
      description:
        "Experienced with Node.js, Express, Python, Django, and RESTful API design. Familiar with database design and optimization.",
      hasNotification: true,
      notificationCount: 1,
      image: "https://cdn.pixabay.com/photo/2024/07/23/09/14/ai-generated-8914595_1280.jpg",
    },
  ])

  // Fetch current user details
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true)
        // Get user data from localStorage as stored by LoginAlt.tsx
        const userData = localStorage.getItem("user")

        if (!userData) {
          setError("You are not logged in")
          setLoading(false)
          return
        }

        const { token, user } = JSON.parse(userData)

        if (!token) {
          setError("Invalid authentication data")
          setLoading(false)
          return
        }

        // If we already have the user data, use it directly
        if (user) {
          setUserDetails(user)
          setLoading(false)
          return
        }

        // Otherwise fetch from API
        const response = await axios.get(`${process.env.REACT_APP_API_URL || "http://localhost:3000"}/user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        setUserDetails(response.data)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching user details:", err)
        setError("Failed to load user profile")
        setLoading(false)
      }
    }

    fetchUserDetails()
  }, [])

  const handleSaveInfo = () => {
    if (!selectedInfo) return

    const updatedInfo = personalInfo.map((info) => (info.id === selectedInfo.id ? { ...info, ...editedInfo } : info))

    setPersonalInfo(updatedInfo)
    setIsEditModalOpen(false)
  }

  const handleConfirmDelete = () => {
    if (!selectedInfo) return

    const filteredInfo = personalInfo.filter((info) => info.id !== selectedInfo.id)

    setPersonalInfo(filteredInfo)
    setIsDeleteConfirmOpen(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditedInfo({
      ...editedInfo,
      [name]: value,
    })
  }

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditedInfo({
      ...editedInfo,
      [name]: value,
    })
  }

  // Function to update profile
  const handleUpdateProfile = async (formData: FormData) => {
    try {
      const userData = localStorage.getItem("user")
      if (!userData) {
        setError("You are not logged in")
        return
      }
      const { token } = JSON.parse(userData)

      const response = await axios.put(
        `${process.env.REACT_APP_API_URL || "http://localhost:3000"}/user/profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      )

      setUserDetails(response.data)
    } catch (err) {
      console.error("Error updating profile:", err)
      setError("Failed to update profile")
    }
  }

  // Handle profile picture upload
  const handleProfilePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const formData = new FormData()
      formData.append("profilePicture", file)

      await handleUpdateProfile(formData)
    }
  }

  // Handle cover photo upload
  const handleCoverPhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const formData = new FormData()
      formData.append("coverPhoto", file)

      await handleUpdateProfile(formData)
    }
  }

  const renderTabContent = () => {
    if (activeTab === "personal") {
      return (
        <div className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-3xl shadow-sm p-6">
            <h3 className="text-xl font-semibold mb-6">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Full Name</h4>
                <p className="text-gray-900">
                  {userDetails
                    ? `${userDetails.firstname} ${userDetails.middleName || ""} ${userDetails.lastname}`
                    : "Loading..."}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Email</h4>
                <p className="text-gray-900">{userDetails?.email || "Loading..."}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Phone</h4>
                <p className="text-gray-900">{userDetails?.contact || "Loading..."}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Location</h4>
                <p className="text-gray-900 flex items-center">
                  <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                  {userDetails?.location?.name || "Not specified"}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Account Created</h4>
                <p className="text-gray-900">
                  {userDetails?.createdAt ? new Date(userDetails.createdAt).toLocaleDateString() : "Loading..."}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Gender</h4>
                <p className="text-gray-900">{userDetails?.gender || "Not specified"}</p>
              </div>
            </div>
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-500 mb-1">Bio</h4>
              <p className="text-gray-900">{userDetails?.bio || "No bio provided"}</p>
            </div>
          </div>
        </div>
      )
    }

    if (activeTab === "security") {
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
    }

    if (activeTab === "delete") {
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

    if (activeTab === "booking") {
      return (
        <div className="bg-white rounded-3xl shadow-sm p-6">
          <h3 className="text-xl font-semibold mb-6">Booking Settings</h3>
          <p className="text-gray-600 mb-6">Configure system-wide booking timers and commission settings.</p>

          <div className="space-y-8">
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
              <h4 className="font-medium text-blue-800 mb-2">Important Information:</h4>
              <ul className="list-disc pl-5 space-y-2 text-blue-700 text-sm">
                <li>Changes to these settings will affect all future bookings</li>
                <li>Timer values are in minutes</li>
                <li>Commission settings affect platform revenue</li>
              </ul>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Commission Timer Settings */}
              <div className="border border-gray-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-sky-100 text-sky-600">
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
                      className="lucide lucide-timer"
                    >
                      <path d="M10 2h4" />
                      <path d="M12 14v-4" />
                      <path d="M4 13a8 8 0 0 1 8-7 8 8 0 1 1-5.3 14L4 17.6" />
                      <path d="M9 17H4v5" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Commission Timer</h4>
                    <p className="text-sm text-gray-500">Time before commission is automatically processed</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="commission-timer" className="block text-sm font-medium text-gray-700 mb-1">
                      Timer Duration (minutes)
                    </label>
                    <div className="flex">
                      <input
                        type="number"
                        id="commission-timer"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                        defaultValue={1}
                        min={1}
                        max={1440}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Default: 1 minute. Recommended range: 1-5 minutes.</p>
                  </div>

                  <div className="pt-2">
                    <label htmlFor="commission-rate" className="block text-sm font-medium text-gray-700 mb-1">
                      Commission Rate (%)
                    </label>
                    <div className="flex">
                      <input
                        type="number"
                        id="commission-rate"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                        defaultValue={0.5}
                        min={1}
                        max={20}
                        step={0.5}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Default: 0.5%. This is the percentage taken from each transaction.
                    </p>
                  </div>
                </div>
              </div>

              {/* Auto-Cancellation Timer Settings */}
              <div className="border border-gray-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-rose-100 text-rose-600">
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
                      className="lucide lucide-alarm-clock-off"
                    >
                      <path d="M6.87 6.87A8 8 0 1 0 21 12" />
                      <path d="M19.71 19.71a8 8 0 0 1-11.31-11.31" />
                      <path d="M22 6 L6 22" />
                      <path d="M10 4H4v6" />
                      <path d="M12 9v1" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Auto-Cancellation Timer</h4>
                    <p className="text-sm text-gray-500">Time before unpaid bookings are automatically cancelled</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="cancellation-timer" className="block text-sm font-medium text-gray-700 mb-1">
                      Timer Duration (minutes)
                    </label>
                    <div className="flex">
                      <input
                        type="number"
                        id="cancellation-timer"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                        defaultValue={720}
                        min={5}
                        max={1440}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Default: 720 minutes (12 hours). Recommended range: 4,320 minutes (3 days).
                    </p>
                  </div>

                  <div className="pt-2">
                    <div className="flex items-center justify-between">
                      <label htmlFor="enable-notifications" className="text-sm font-medium text-gray-700">
                        Send Reminder Notifications
                      </label>
                      <div className="relative inline-block w-10 mr-2 align-middle select-none">
                        <input type="checkbox" id="enable-notifications" defaultChecked className="sr-only" />
                        <div className="block h-6 bg-gray-300 rounded-full w-10"></div>
                        <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
                        <style>{`
                          input:checked ~ .dot {
                            transform: translateX(100%);
                          }
                          input:checked ~ .block {
                            background-color: #3b82f6;
                          }
                        `}</style>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Send notifications to customers before auto-cancellation.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
              >
                Reset to Defaults
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-all"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )
    }
  }

  // If loading, show loading spinner
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 text-sky-500 animate-spin" />
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    )
  }

  // If error, show error message
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-sm max-w-md w-full">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
              <X className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Profile</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-all"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Floating Dock */}
      <div className="sticky top-0 z-40 flex">
        <MyFloatingDock />
      </div>

      {/* User Profile Section */}
      <div className="max-w-7xl mx-auto font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,sans-serif]">
        {/* Cover Photo */}
        <div className="relative h-80 overflow-hidden rounded-b-3xl">
          <img
            src={
              userDetails?.coverPhoto
                ? `${process.env.REACT_APP_API_URL || "http://localhost:3000"}${userDetails.coverPhoto}`
                : image1
            }
            alt="Cover"
            className="w-full h-full object-cover"
          />
          <label
            htmlFor="cover-photo-upload"
            className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-all cursor-pointer"
          >
            <Camera className="h-5 w-5" />
            <input
              id="cover-photo-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleCoverPhotoChange}
            />
          </label>
        </div>

        {/* Profile Info with Stats */}
        <div className="relative px-4 pb-8">
          <div className="absolute -top-16 left-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-white">
                <img
                  src={
                    userDetails?.profilePicture
                      ? `${process.env.REACT_APP_API_URL || "http://localhost:3000"}${userDetails.profilePicture}`
                      : image1
                  }
                  alt={userDetails ? `${userDetails.firstname} ${userDetails.lastname}` : "User"}
                  className="w-full h-full object-cover"
                />
              </div>
              <label
                htmlFor="profile-picture-upload"
                className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md hover:bg-gray-50 cursor-pointer"
              >
                <Camera className="h-4 w-4 text-gray-600" />
                <input
                  id="profile-picture-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfilePictureChange}
                />
              </label>
            </div>
          </div>

          <div className="pt-20">
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {userDetails ? `${userDetails.firstname} ${userDetails.lastname}` : "User"}
                  </h1>
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                    {userDetails?.type === "customer"
                      ? "Customer"
                      : userDetails?.type === "manager"
                        ? "Manager"
                        : userDetails?.type || "User"}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{userDetails?.location?.name || "Location not specified"}</span>
                </div>
              </div>
              <button
                onClick={() => {
                  // Implement edit profile functionality
                  alert("Edit profile functionality will be implemented here")
                }}
                className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-all"
              >
                Edit Profile
              </button>
            </div>

            <p className="text-gray-600 max-w-2xl mb-6">{userDetails?.bio || "No bio provided"}</p>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4">
            <nav className="flex -mb-px overflow-x-auto">
              <button
                onClick={() => setActiveTab("personal")}
                className={`py-4 px-6 font-medium text-sm border-b-2 flex items-center gap-2 whitespace-nowrap ${
                  activeTab === "personal"
                    ? "border-sky-500 text-sky-500"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
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
              <button
                onClick={() => setActiveTab("security")}
                className={`py-4 px-6 font-medium text-sm border-b-2 flex items-center gap-2 whitespace-nowrap ${
                  activeTab === "security"
                    ? "border-sky-500 text-sky-500"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
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
                  className="lucide lucide-lock"
                >
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                Security
              </button>
              <button
                onClick={() => setActiveTab("delete")}
                className={`py-4 px-6 font-medium text-sm border-b-2 flex items-center gap-2 whitespace-nowrap ${
                  activeTab === "delete"
                    ? "border-sky-500 text-sky-500"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
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
                Delete Account
              </button>
            </nav>
          </div>
        </div>

        {/* Content Section */}
        <div className="px-4 py-8 mb-20">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">
              {activeTab === "personal"
                ? "Personal Information"
                : activeTab === "security"
                  ? "Security Settings"
                  : activeTab === "earnings"
                    ? "Commission Earnings"
                    : activeTab === "booking"
                      ? "Booking Settings"
                      : "Delete Account"}
            </h2>
            {activeTab === "personal" && (
              <button
                onClick={() => {
                  // Implement edit profile functionality
                  alert("Edit profile functionality will be implemented here")
                }}
                className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-all"
              >
                Edit Profile
              </button>
            )}
          </div>

          {renderTabContent()}
        </div>
      </div>

      {/* Edit Info Modal */}
      <Dialog open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-4xl w-full bg-white rounded-2xl overflow-hidden shadow-xl">
            <div className="flex flex-col md:flex-row">
              {/* Preview Section */}
              <div className="md:w-2/5 bg-gray-50 p-6 flex flex-col">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Preview</h3>

                <div className="flex-1 flex flex-col">
                  <div className="relative w-full h-48 mb-4 rounded-xl overflow-hidden bg-gray-200 border border-gray-300">
                    <img
                      src={editedInfo.image || image1}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = image1
                      }}
                    />
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm flex-1">
                    <h4 className="text-xl font-semibold mb-2">{editedInfo.title || "Title"}</h4>
                    {editedInfo.organization && (
                      <p className="text-gray-700 text-sm mb-1">
                        {editedInfo.organization} {editedInfo.location && `• ${editedInfo.location}`}
                      </p>
                    )}
                    {editedInfo.startDate && (
                      <p className="text-gray-600 text-sm mb-3">
                        {new Date(editedInfo.startDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                        })}{" "}
                        -
                        {editedInfo.endDate === "Present"
                          ? " Present"
                          : editedInfo.endDate
                            ? ` ${new Date(editedInfo.endDate).toLocaleDateString("en-US", { year: "numeric", month: "short" })}`
                            : ""}
                      </p>
                    )}
                    <p className="text-gray-600 text-sm line-clamp-4">
                      {editedInfo.description || "Description will appear here."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Section */}
              <div className="md:w-3/5 p-6 border-t md:border-t-0 md:border-l border-gray-200">
                <div className="flex justify-between items-start mb-6">
                  <Dialog.Title className="text-xl font-semibold">
                    Edit{" "}
                    {selectedInfo?.type
                      ? selectedInfo.type.charAt(0).toUpperCase() + selectedInfo.type.slice(1)
                      : "Info"}
                  </Dialog.Title>
                  <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {selectedInfo && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      handleSaveInfo()
                    }}
                    className="space-y-4 max-h-[60vh] overflow-y-auto pr-2"
                  >
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={editedInfo.title || ""}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                        required
                      />
                    </div>

                    {(selectedInfo.type === "education" || selectedInfo.type === "experience") && (
                      <>
                        <div>
                          <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-1">
                            {selectedInfo.type === "education" ? "Institution" : "Company"}
                          </label>
                          <input
                            type="text"
                            id="organization"
                            name="organization"
                            value={editedInfo.organization || ""}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                          />
                        </div>

                        <div>
                          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                            Location
                          </label>
                          <input
                            type="text"
                            id="location"
                            name="location"
                            value={editedInfo.location || ""}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                              Start Date
                            </label>
                            <input
                              type="date"
                              id="startDate"
                              name="startDate"
                              value={editedInfo.startDate || ""}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                            />
                          </div>

                          <div>
                            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                              End Date
                            </label>
                            <input
                              type="date"
                              id="endDate"
                              name="endDate"
                              value={editedInfo.endDate === "Present" ? "" : editedInfo.endDate || ""}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                            />
                            <div className="flex items-center mt-1">
                              <input
                                type="checkbox"
                                id="currentlyHere"
                                checked={editedInfo.endDate === "Present"}
                                onChange={(e) => {
                                  setEditedInfo({
                                    ...editedInfo,
                                    endDate: e.target.checked ? "Present" : "",
                                  })
                                }}
                                className="mr-2"
                              />
                              <label htmlFor="currentlyHere" className="text-sm text-gray-600">
                                Currently {selectedInfo.type === "education" ? "studying here" : "working here"}
                              </label>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    <div>
                      <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                        Image URL
                      </label>
                      <input
                        type="text"
                        id="image"
                        name="image"
                        value={editedInfo.image || ""}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                        placeholder="Enter image URL or leave blank for default"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Enter a valid image URL to see the preview update in real-time
                      </p>
                    </div>

                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={editedInfo.description || ""}
                        onChange={handleTextAreaChange}
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
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteConfirmOpen} onClose={() => setIsDeleteConfirmOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-md w-full bg-white rounded-2xl overflow-hidden shadow-xl">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <Dialog.Title className="text-xl font-semibold text-gray-900">
                  Delete{" "}
                  {selectedInfo?.type ? selectedInfo.type.charAt(0).toUpperCase() + selectedInfo.type.slice(1) : "Info"}
                </Dialog.Title>
                <button onClick={() => setIsDeleteConfirmOpen(false)} className="text-gray-400 hover:text-gray-500">
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
                      onClick={() => setIsDeleteConfirmOpen(false)}
                      className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmDelete}
                      className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
      <Footer />
    </div>
  )
}

export default MyProfile