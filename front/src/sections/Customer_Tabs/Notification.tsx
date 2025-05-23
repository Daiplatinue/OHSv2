import type React from "react"
import { useState, useEffect, useRef } from "react"
import { X, Check, Calendar, CreditCard, AlertTriangle, Info, CheckCircle, ChevronDown } from "lucide-react"
import axios from "axios"
import { motion, AnimatePresence } from "framer-motion"

export interface NotificationItem {
  _id: string
  title: string
  description: string
  type: "info" | "success" | "warning" | "error" | "booking" | "payment" | "system"
  status: "read" | "unread"
  createdAt: string
  icon?: string
  link?: string
}

interface NotificationProps {
  userId?: string
  onClose?: () => void
  updateBadge?: (notifications: NotificationItem[]) => void
}

const NotificationPopup: React.FC<NotificationProps> = ({ userId, onClose, updateBadge }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [loading, setLoading] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [viewAll, setViewAll] = useState(false)
  const notificationRef = useRef<HTMLDivElement>(null)
  // Add a new state to track expanded notification IDs
  const [expandedNotifications, setExpandedNotifications] = useState<string[]>([])

  // WebSocket connection
  const [socket, setSocket] = useState<WebSocket | null>(null)

  // Initialize WebSocket connection
  useEffect(() => {
    // Try to get userId from localStorage if not provided
    let userIdToUse = userId
    if (!userIdToUse) {
      const userData = localStorage.getItem("user")
      if (userData) {
        try {
          const parsedData = JSON.parse(userData)
          userIdToUse = (parsedData.user && parsedData.user._id) || parsedData._id || parsedData.id
        } catch (error) {
          console.error("Error parsing user data:", error)
        }
      }
    }

    if (!userIdToUse) return

    // Create WebSocket connection
    const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3000"}/ws?userId=${userIdToUse}`
    const newSocket = new WebSocket(wsUrl)

    newSocket.onopen = () => {
      console.log("WebSocket connection established")
    }

    newSocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)

        // Handle different message types
        if (data.type === "notification") {
          // Add new notification to the list
          setNotifications((prev) => [data.notification, ...prev])
        }
      } catch (error) {
        console.error("Error processing WebSocket message:", error)
      }
    }

    newSocket.onerror = (error) => {
      console.error("WebSocket error:", error)
    }

    newSocket.onclose = () => {
      console.log("WebSocket connection closed")
    }

    setSocket(newSocket)

    // Clean up WebSocket connection when component unmounts
    return () => {
      if (newSocket) {
        newSocket.close()
      }
    }
  }, [userId])

  // Fetch notifications when component mounts or userId changes
  useEffect(() => {
    fetchNotifications()
  }, [userId])

  // Close notification panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        if (onClose) onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onClose])

  // Update badge count when notifications change
  useEffect(() => {
    if (updateBadge) {
      updateBadge(notifications)
    }
  }, [notifications, updateBadge])

  // Animation effect when component mounts
  useEffect(() => {
    setIsExpanded(true)
  }, [])

  // Fetch notifications from API
  const fetchNotifications = async () => {
    try {
      setLoading(true)

      // Try to get userId from localStorage if not provided
      let userIdToUse = userId
      if (!userIdToUse) {
        const userData = localStorage.getItem("user")
        if (userData) {
          try {
            const parsedData = JSON.parse(userData)
            // Check different possible formats
            userIdToUse =
              (parsedData.user && parsedData.user._id) || // Format 1: { user: { _id: "..." }, token: "..." }
              parsedData._id || // Format 2: { _id: "...", token: "..." }
              parsedData.id // Format 3: { id: "...", token: "..." }
          } catch (error) {
            console.error("Error parsing user data:", error)
          }
        }
      }

      if (!userIdToUse) {
        console.error("No user ID available to fetch notifications")
        setLoading(false)
        // Use sample data if no user ID is available
        const sampleData = getSampleNotifications()
        setNotifications(sampleData)
        return
      }

      // Get user token from localStorage
      const userData = localStorage.getItem("user")
      let token = null
      if (userData) {
        try {
          const parsedData = JSON.parse(userData)
          token = parsedData.token || (parsedData.user && parsedData.user.token)
        } catch (error) {
          console.error("Error parsing user data for token:", error)
        }
      }

      // If we have a token, try to fetch from API
      if (token) {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/notifications/user/${userIdToUse}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )

        if (response.data && response.data.notifications) {
          setNotifications(response.data.notifications)
          return
        }
      }

      // Fallback to sample data if API call fails or returns no data
      setNotifications(getSampleNotifications())
    } catch (error) {
      console.error("Error fetching notifications:", error)
      // Use sample data if API fails
      setNotifications(getSampleNotifications())
    } finally {
      setLoading(false)
    }
  }

  // Mark a notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      // Get user token from localStorage
      const userData = localStorage.getItem("user")
      if (!userData) return

      let token = null
      try {
        const parsedData = JSON.parse(userData)
        token = parsedData.token || (parsedData.user && parsedData.user.token)
      } catch (error) {
        console.error("Error parsing user data for token:", error)
        return
      }

      if (!token) return

      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/notifications/${notificationId}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      // Update local state
      setNotifications(
        notifications.map((notification) =>
          notification._id === notificationId ? { ...notification, status: "read" } : notification,
        ),
      )
    } catch (error) {
      console.error("Error marking notification as read:", error)

      // Update local state even if API fails
      setNotifications(
        notifications.map((notification) =>
          notification._id === notificationId ? { ...notification, status: "read" } : notification,
        ),
      )
    }
  }

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      // Try to get userId from localStorage
      let userIdToUse = userId
      if (!userIdToUse) {
        const userData = localStorage.getItem("user")
        if (userData) {
          try {
            const parsedData = JSON.parse(userData)
            userIdToUse = (parsedData.user && parsedData.user._id) || parsedData._id || parsedData.id
          } catch (error) {
            console.error("Error parsing user data:", error)
            return
          }
        }
      }

      if (!userIdToUse) return

      // Get user token from localStorage
      const userData = localStorage.getItem("user")
      if (!userData) return

      let token = null
      try {
        const parsedData = JSON.parse(userData)
        token = parsedData.token || (parsedData.user && parsedData.user.token)
      } catch (error) {
        console.error("Error parsing user data for token:", error)
        return
      }

      if (!token) return

      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/notifications/user/${userIdToUse}/read-all`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      // Update local state
      setNotifications(
        notifications.map((notification) => ({
          ...notification,
          status: "read",
        })),
      )
    } catch (error) {
      console.error("Error marking all notifications as read:", error)

      // Update local state even if API fails
      setNotifications(
        notifications.map((notification) => ({
          ...notification,
          status: "read",
        })),
      )
    }
  }

  // Clear all notifications (from database)
  const clearAllNotifications = async () => {
    try {
      // Try to get userId from localStorage
      let userIdToUse = userId
      if (!userIdToUse) {
        const userData = localStorage.getItem("user")
        if (userData) {
          try {
            const parsedData = JSON.parse(userData)
            userIdToUse = (parsedData.user && parsedData.user._id) || parsedData._id || parsedData.id
          } catch (error) {
            console.error("Error parsing user data:", error)
            return
          }
        }
      }

      if (!userIdToUse) return

      // Get user token from localStorage
      const userData = localStorage.getItem("user")
      if (!userData) return

      let token = null
      try {
        const parsedData = JSON.parse(userData)
        token = parsedData.token || (parsedData.user && parsedData.user.token)
      } catch (error) {
        console.error("Error parsing user data for token:", error)
        return
      }

      if (!token) return

      // Delete all notifications for the user
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/notifications/user/${userIdToUse}/clear-all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      // Update local state
      setNotifications([])
    } catch (error) {
      console.error("Error clearing all notifications:", error)
      // Update local state even if API fails
      setNotifications([])
    }
  }

  // Get icon component based on notification type or icon name
  const getIcon = (notification: NotificationItem) => {
    if (notification.icon) {
      // Map icon string to component
      switch (notification.icon) {
        case "calendar":
        case "calendar-clock":
        case "calendar-check":
        case "calendar-x":
          return <Calendar className="h-5 w-5" />
        case "credit-card":
          return <CreditCard className="h-5 w-5" />
        case "alert-triangle":
          return <AlertTriangle className="h-5 w-5" />
        case "info":
          return <Info className="h-5 w-5" />
        case "check-circle":
          return <CheckCircle className="h-5 w-5" />
        default:
          return <Info className="h-5 w-5" />
      }
    }

    // Default icons based on notification type
    switch (notification.type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case "error":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      case "booking":
        return <Calendar className="h-5 w-5 text-purple-500" />
      case "payment":
        return <CreditCard className="h-5 w-5 text-blue-500" />
      case "info":
      default:
        return <Info className="h-5 w-5 text-sky-500" />
    }
  }

  // Get background color based on notification type
  const getBackgroundColor = (notification: NotificationItem) => {
    if (notification.status === "unread") {
      switch (notification.type) {
        case "success":
          return "bg-green-50"
        case "warning":
          return "bg-yellow-50"
        case "error":
          return "bg-red-50"
        case "booking":
          return "bg-purple-50"
        case "payment":
          return "bg-blue-50"
        case "info":
        default:
          return "bg-sky-50"
      }
    }
    return "bg-white"
  }

  // Format date to relative time (e.g., "2 hours ago")
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) {
      return "just now"
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60)
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`
    }

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`
    }

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 30) {
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`
    }

    const diffInMonths = Math.floor(diffInDays / 30)
    if (diffInMonths < 12) {
      return `${diffInMonths} month${diffInMonths > 1 ? "s" : ""} ago`
    }

    const diffInYears = Math.floor(diffInMonths / 12)
    return `${diffInYears} year${diffInYears > 1 ? "s" : ""} ago`
  }

  // Sample notifications for development/testing
  const getSampleNotifications = (): NotificationItem[] => {
    return [
      {
        _id: "1",
        title: "Booking Confirmed",
        description: "Your booking for House Cleaning has been confirmed.",
        type: "success",
        status: "unread",
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
        icon: "calendar-check",
        link: "/bookings/123",
      },
      {
        _id: "2",
        title: "Payment Received",
        description: "We've received your payment of ₱1,500 for Plumbing Service.",
        type: "payment",
        status: "unread",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        icon: "credit-card",
        link: "/payments/456",
      },
      {
        _id: "3",
        title: "Service Completed",
        description: "Your Electrical Repair service has been completed. Please rate your experience.",
        type: "info",
        status: "unread",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        icon: "check-circle",
        link: "/bookings/789",
      },
      {
        _id: "4",
        title: "Booking Cancelled",
        description: "Your booking for Gardening Service has been cancelled.",
        type: "error",
        status: "read",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
        icon: "calendar-x",
        link: "/bookings/101",
      },
      {
        _id: "5",
        title: "Welcome to ServiceHub",
        description: "Thank you for joining ServiceHub! Start exploring services near you.",
        type: "info",
        status: "read",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days ago
        icon: "info",
        link: "/explore",
      },
    ]
  }

  // Handle notification click
  const handleNotificationClick = (notification: NotificationItem) => {
    // Mark as read
    if (notification.status === "unread") {
      markAsRead(notification._id)
    }

    // Toggle expanded state for this notification
    setExpandedNotifications((prev) =>
      prev.includes(notification._id) ? prev.filter((id) => id !== notification._id) : [...prev, notification._id],
    )

    // Don't navigate or close the panel
    // if (notification.link) {
    //   window.location.href = notification.link;
    // }
    // if (onClose) onClose();
  }

  // Toggle view all notifications
  const toggleViewAll = () => {
    setViewAll(!viewAll)
  }

  // Get unread count
  const unreadCount = notifications.filter((notification) => notification.status === "unread").length

  // Determine which notifications to display
  const displayedNotifications = viewAll ? notifications : notifications.slice(0, 3)

  return (
    <AnimatePresence>
      {isExpanded && (
        <motion.div
          className="relative w-full"
          ref={notificationRef}
          initial={{ opacity: 0, y: -20, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -20, height: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {/* Notification Panel */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden z-50 border border-gray-200 w-full flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-800">Notifications</h3>
              <div className="flex space-x-2">
                {unreadCount > 0 && (
                  <button onClick={markAllAsRead} className="text-xs text-sky-600 hover:text-sky-800 flex items-center">
                    <Check className="h-3 w-3 mr-1" />
                    Mark all as read
                  </button>
                )}
                <button
                  onClick={clearAllNotifications}
                  className="text-xs text-red-600 hover:text-red-800 flex items-center"
                >
                  <X className="h-3 w-3 mr-1" />
                  Clear all
                </button>
                {onClose && (
                  <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Notification List */}
            <div className={`${viewAll ? "overflow-y-auto max-h-[300px]" : "overflow-hidden"}`}>
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
                </div>
              ) : notifications.length === 0 ? (
                <div className="py-8 text-center text-gray-500">
                  <p>No notifications yet</p>
                </div>
              ) : (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: {
                      transition: {
                        staggerChildren: 0.1,
                      },
                    },
                  }}
                >
                  {displayedNotifications.map((notification) => (
                    <motion.div
                      key={notification._id}
                      variants={{
                        hidden: { opacity: 0, y: 10 },
                        visible: { opacity: 1, y: 0 },
                      }}
                      transition={{ duration: 0.3 }}
                      className={`px-4 py-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${getBackgroundColor(
                        notification,
                      )}`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex">
                        <div className="flex-shrink-0 mr-3">{getIcon(notification)}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{notification.title}</p>
                          <p className="text-sm text-gray-600 line-clamp-2">{notification.description}</p>
                          <p className="text-xs text-gray-500 mt-1">{formatRelativeTime(notification.createdAt)}</p>
                        </div>
                        {notification.status === "unread" && (
                          <div className="ml-2 flex-shrink-0">
                            <span className="inline-block w-2 h-2 bg-sky-500 rounded-full"></span>
                          </div>
                        )}
                      </div>

                      {/* Expanded content */}
                      {expandedNotifications.includes(notification._id) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-2 pt-2 border-t border-gray-100"
                        >
                          <p className="text-sm text-gray-700">{notification.description}</p>
                          {notification.link && (
                            <a
                              href={notification.link}
                              className="text-sm text-sky-600 hover:text-sky-800 mt-2 inline-block"
                              onClick={(e) => e.stopPropagation()}
                            >
                              View details
                            </a>
                          )}
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 text-center">
              {notifications.length > 3 && (
                <button
                  onClick={toggleViewAll}
                  className="text-sm text-sky-600 hover:text-sky-800 flex items-center justify-center w-full"
                >
                  {viewAll ? "Show less" : "View all notifications"}
                  <ChevronDown
                    className={`h-4 w-4 ml-1 transition-transform duration-300 ${viewAll ? "rotate-180" : ""}`}
                  />
                </button>
              )}
              {viewAll && (
                <a href="/notifications" className="text-sm text-sky-600 hover:text-sky-800 block mt-1">
                  Go to notifications page
                </a>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default NotificationPopup