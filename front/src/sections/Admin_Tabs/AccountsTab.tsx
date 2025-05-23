import { useState, useEffect } from "react"
import {
  Users,
  Search,
  Filter,
  UserPlus,
  MoreHorizontal,
  ChevronDown,
  CheckCircle,
  XCircle,
  Trash2,
  Edit,
  Eye,
  Shield,
  ChevronRight,
  BarChart3,
  PieChart,
  ArrowRight,
  RefreshCw,
  Clock,
  Calendar,
  Mail,
  Phone,
  MapPin,
  User,
} from "lucide-react"
import MyFloatingDock from "../Styles/MyFloatingDock"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Footer from "../Styles/Footer"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import axios from "axios"

function AccountsTab() {
  const [activeTab, setActiveTab] = useState("all")
  const [currentTime, setCurrentTime] = useState(new Date())
  const [selectedAccount, setSelectedAccount] = useState<{
    id: number
    name: string
    email: string
    role: string
    status: string
    joinDate: string
    lastLogin: string
    avatar: string
    phone: string
    location: string
    rating: number
    paymentMethod: string
    verificationStatus: string
  } | null>(null)

  const [newAccountFirstName, setNewAccountFirstName] = useState("")
  const [newAccountLastName, setNewAccountLastName] = useState("")
  const [newAccountContact, setNewAccountContact] = useState("")

  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [newAccountEmail, setNewAccountEmail] = useState("")
  const [newAccountPassword, setNewAccountPassword] = useState("")
  const [newAccountType, setNewAccountType] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newAccountData, setNewAccountData] = useState<any>(null)
  interface Account {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
    joinDate: string;
    lastLogin: string;
    avatar: string;
    phone: string;
    location: string;
    rating: number;
    paymentMethod: string;
    verificationStatus: string;
  }

  const [accounts, setAccounts] = useState<Account[]>([])

  // Animation keyframes
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
    to { transform: translateY(0); opacity: 1; }
  }
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
`

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(timer)
  }, [])

  // Fetch users from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:3000/users")
        if (response.data) {
          // Transform the user data to match the expected format
          interface User {
            _id?: string;
            firstname: string;
            lastname: string;
            email: string;
            type: string;
            status: string;
            createdAt: string;
            profilePicture?: string;
            contact?: string;
            location?: {
              name: string;
            };
            verification: string;
          }

          const formattedUsers: Account[] = response.data.map((user: User, index: number) => ({
            id: typeof user._id === 'string' ? parseInt(user._id, 16) % Number.MAX_SAFE_INTEGER : index + 1,
            name: `${user.firstname} ${user.lastname}`,
            email: user.email,
            role: user.type === "manager" ? "Service Provider" : user.type === "admin" ? "Admin" : "Customer",
            status: user.status.charAt(0).toUpperCase() + user.status.slice(1),
            joinDate: new Date(user.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
            lastLogin: "N/A",
            avatar: user.profilePicture || "/placeholder.svg?height=40&width=40",
            phone: user.contact || "N/A",
            location: user.location?.name || "N/A",
            rating: 0,
            paymentMethod: "N/A",
            verificationStatus: user.verification.charAt(0).toUpperCase() + user.verification.slice(1),
          }))

          // Replace the sample accounts with the fetched users
          setAccounts(formattedUsers)
        }
      } catch (error) {
        console.error("Error fetching users:", error)
        toast(
          <div>
            <div className="font-semibold">Failed to load accounts</div>
            <div className="text-sm text-gray-600">Please try again later</div>
          </div>,
          { className: "bg-red-50 text-red-700 border-red-200", duration: 4000 },
        )
      }
    }

    fetchUsers()
  }, [])

  // Format current time
  const timeString = currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  const dateString = currentTime.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })

  // Sample account data
  // const accounts = [
  //   {
  //     id: 1,
  //     name: "John Smith",
  //     email: "john.smith@example.com",
  //     role: "Customer",
  //     status: "Active",
  //     joinDate: "May 12, 2023",
  //     lastLogin: "2 hours ago",
  //     avatar: "/placeholder.svg?height=40&width=40",
  //     phone: "+1 (555) 123-4567",
  //     location: "New York, USA",
  //     rating: 4.8,
  //     paymentMethod: "Credit Card",
  //     verificationStatus: "Verified",
  //   },
  //   {
  //     id: 2,
  //     name: "Sarah Johnson",
  //     email: "sarah.j@example.com",
  //     role: "Customer",
  //     status: "Active",
  //     joinDate: "Apr 28, 2023",
  //     lastLogin: "1 day ago",
  //     avatar: "/placeholder.svg?height=40&width=40",
  //     phone: "+1 (555) 234-5678",
  //     location: "Los Angeles, USA",
  //     rating: 4.5,
  //     paymentMethod: "PayPal",
  //     verificationStatus: "Verified",
  //   },
  //   {
  //     id: 3,
  //     name: "Michael Brown",
  //     email: "michael.b@example.com",
  //     role: "Service Provider",
  //     status: "Active",
  //     joinDate: "Mar 15, 2023",
  //     lastLogin: "5 hours ago",
  //     avatar: "/placeholder.svg?height=40&width=40",
  //     phone: "+1 (555) 345-6789",
  //     location: "Chicago, USA",
  //     rating: 4.9,
  //     paymentMethod: "Direct Deposit",
  //     verificationStatus: "Verified",
  //   },
  //   {
  //     id: 4,
  //     name: "Emily Davis",
  //     email: "emily.d@example.com",
  //     role: "Customer",
  //     status: "Inactive",
  //     joinDate: "Feb 10, 2023",
  //     lastLogin: "2 weeks ago",
  //     avatar: "/placeholder.svg?height=40&width=40",
  //     phone: "+1 (555) 456-7890",
  //     location: "Miami, USA",
  //     rating: 4.2,
  //     paymentMethod: "Credit Card",
  //     verificationStatus: "Verified",
  //   },
  //   {
  //     id: 5,
  //     name: "David Wilson",
  //     email: "david.w@example.com",
  //     role: "Service Provider",
  //     status: "Pending",
  //     joinDate: "May 5, 2023",
  //     lastLogin: "3 days ago",
  //     avatar: "/placeholder.svg?height=40&width=40",
  //     phone: "+1 (555) 567-8901",
  //     location: "Seattle, USA",
  //     rating: 0,
  //     paymentMethod: "Awaiting Setup",
  //     verificationStatus: "Pending",
  //   },
  //   {
  //     id: 6,
  //     name: "Jennifer Martinez",
  //     email: "jennifer.m@example.com",
  //     role: "Admin",
  //     status: "Active",
  //     joinDate: "Jan 8, 2023",
  //     lastLogin: "Just now",
  //     avatar: "/placeholder.svg?height=40&width=40",
  //     phone: "+1 (555) 678-9012",
  //     location: "Boston, USA",
  //     rating: 5.0,
  //     paymentMethod: "N/A",
  //     verificationStatus: "Verified",
  //   },
  //   {
  //     id: 7,
  //     name: "Robert Taylor",
  //     email: "robert.t@example.com",
  //     role: "Customer",
  //     status: "Suspended",
  //     joinDate: "Apr 2, 2023",
  //     lastLogin: "1 month ago",
  //     avatar: "/placeholder.svg?height=40&width=40",
  //     phone: "+1 (555) 789-0123",
  //     location: "Denver, USA",
  //     rating: 2.1,
  //     paymentMethod: "Credit Card (Expired)",
  //     verificationStatus: "Verified",
  //   },
  //   {
  //     id: 8,
  //     name: "Robert Taylor",
  //     email: "robert.t@example.com",
  //     role: "Customer",
  //     status: "Suspended",
  //     joinDate: "Apr 2, 2023",
  //     lastLogin: "1 month ago",
  //     avatar: "/placeholder.svg?height=40&width=40",
  //     phone: "+1 (555) 789-0123",
  //     location: "Denver, USA",
  //     rating: 2.1,
  //     paymentMethod: "Credit Card (Expired)",
  //     verificationStatus: "Verified",
  //   },
  //   {
  //     id: 9,
  //     name: "Robert Taylor",
  //     email: "robert.t@example.com",
  //     role: "Customer",
  //     status: "Suspended",
  //     joinDate: "Apr 2, 2023",
  //     lastLogin: "1 month ago",
  //     avatar: "/placeholder.svg?height=40&width=40",
  //     phone: "+1 (555) 789-0123",
  //     location: "Denver, USA",
  //     rating: 2.1,
  //     paymentMethod: "Credit Card (Expired)",
  //     verificationStatus: "Verified",
  //   },
  //   {
  //     id: 10,
  //     name: "Robert Taylor",
  //     email: "robert.t@example.com",
  //     role: "Customer",
  //     status: "Suspended",
  //     joinDate: "Apr 2, 2023",
  //     lastLogin: "1 month ago",
  //     avatar: "/placeholder.svg?height=40&width=40",
  //     phone: "+1 (555) 789-0123",
  //     location: "Denver, USA",
  //     rating: 2.1,
  //     paymentMethod: "Credit Card (Expired)",
  //     verificationStatus: "Verified",
  //   },
  //   {
  //     id: 11,
  //     name: "Robert Taylor",
  //     email: "robert.t@example.com",
  //     role: "Customer",
  //     status: "Suspended",
  //     joinDate: "Apr 2, 2023",
  //     lastLogin: "1 month ago",
  //     avatar: "/placeholder.svg?height=40&width=40",
  //     phone: "+1 (555) 789-0123",
  //     location: "Denver, USA",
  //     rating: 2.1,
  //     paymentMethod: "Credit Card (Expired)",
  //     verificationStatus: "Verified",
  //   },
  //   {
  //     id: 12,
  //     name: "Robert Taylor",
  //     email: "robert.t@example.com",
  //     role: "Customer",
  //     status: "Suspended",
  //     joinDate: "Apr 2, 2023",
  //     lastLogin: "1 month ago",
  //     avatar: "/placeholder.svg?height=40&width=40",
  //     phone: "+1 (555) 789-0123",
  //     location: "Denver, USA",
  //     rating: 2.1,
  //     paymentMethod: "Credit Card (Expired)",
  //     verificationStatus: "Verified",
  //   },
  // ]

  // Account statistics
  const accountStats = {
    totalAccounts: 842,
    activeUsers: 685,
    newThisMonth: 48,
    conversionRate: 68,
  }

  // Account distribution data
  const accountDistribution = [
    { role: "Customers", percentage: 68, count: 573 },
    { role: "Service Providers", percentage: 24, count: 202 },
    { role: "Administrators", percentage: 8, count: 67 },
  ]

  // Account status data
  const accountStatus = [
    { status: "Active", count: 685, percentage: 81 },
    { status: "Inactive", count: 98, percentage: 12 },
    { status: "Pending", count: 42, percentage: 5 },
    { status: "Suspended", count: 17, percentage: 2 },
  ]

  // Filter accounts based on active tab
  const filteredAccounts = accounts.filter((account) => {
    if (activeTab === "all") return true
    if (activeTab === "customers") return account.role === "Customer"
    if (activeTab === "providers") return account.role === "Service Provider"
    if (activeTab === "admins") return account.role === "Admin"
    if (activeTab === "inactive") return account.status !== "Active"
    return true
  })

  // Status badge renderer
  const renderStatusBadge = (status: any) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-[#E8F8EF] text-[#30D158] hover:bg-[#E8F8EF]">{status}</Badge>
      case "Inactive":
        return <Badge className="bg-[#F2F2F7] text-[#8E8E93] hover:bg-[#F2F2F7]">{status}</Badge>
      case "Pending":
        return <Badge className="bg-[#FFF8E6] text-[#FF9500] hover:bg-[#FFF8E6]">{status}</Badge>
      case "Suspended":
        return <Badge className="bg-[#FFE5E7] text-[#FF453A] hover:bg-[#FFE5E7]">{status}</Badge>
      default:
        return <Badge className="bg-[#F2F2F7] text-[#8E8E93] hover:bg-[#F2F2F7]">{status}</Badge>
    }
  }

  // Role badge renderer
  const renderRoleBadge = (role: any) => {
    switch (role) {
      case "Customer":
        return <Badge className="bg-[#E9F6FF] text-[#0A84FF] hover:bg-[#E9F6FF]">{role}</Badge>
      case "Service Provider":
        return <Badge className="bg-[#F2EBFF] text-[#5E5CE6] hover:bg-[#F2EBFF]">{role}</Badge>
      case "Admin":
        return <Badge className="bg-[#E9F6FF] text-[#5AC8FA] hover:bg-[#E9F6FF]">{role}</Badge>
      default:
        return <Badge className="bg-[#F2F2F7] text-[#8E8E93] hover:bg-[#F2F2F7]">{role}</Badge>
    }
  }

  // Handle account selection for details view
  const handleAccountSelect = (account: any) => {
    setSelectedAccount(account === selectedAccount ? null : account)
  }

  const handleAddAccount = async () => {
    if (
      !newAccountEmail ||
      !newAccountPassword ||
      !newAccountType ||
      !newAccountFirstName ||
      !newAccountLastName ||
      !newAccountContact
    ) {
      toast(
        <div>
          <div className="font-semibold">Missing fields</div>
          <div className="text-sm text-gray-600">Please fill in all required fields.</div>
        </div>,
        { className: "bg-red-50 text-red-700 border-red-200", duration: 4000 },
      )
      return
    }

    setIsSubmitting(true)

    try {
      // Create account data object
      const accountData = {
        email: newAccountEmail,
        password: newAccountPassword,
        type: newAccountType,
        firstname: newAccountFirstName,
        lastname: newAccountLastName,
        contact: newAccountContact,
        status: newAccountType === "admin" ? "active" : "pending",
      }

      // Determine which endpoint to use based on account type
      let endpoint = "register"
      if (newAccountType === "customer") {
        endpoint = "register-customer"
      } else if (newAccountType === "manager" || newAccountType === "provider") {
        endpoint = "register-manager"
      }

      // Make API request
      const response = await axios.post(`http://localhost:3000/${endpoint}`, accountData, {
        headers: {
          "Content-Type": "application/json",
        },
      })

      // Handle success
      setNewAccountData(response.data)
      setIsAddAccountModalOpen(false)
      setIsSuccessModalOpen(true)

      // Refresh the accounts list
      const fetchUsers = await axios.get("http://localhost:3000/users")
      if (fetchUsers.data) {
        const formattedUsers = fetchUsers.data.map((user: { _id: any; firstname: any; lastname: any; email: any; type: string; status: string; createdAt: string | number | Date; profilePicture: any; contact: any; location: { name: any }; verification: string }, index: number) => ({
          id: user._id || index + 1,
          name: `${user.firstname} ${user.lastname}`,
          email: user.email,
          role: user.type === "manager" ? "Service Provider" : user.type === "admin" ? "Admin" : "Customer",
          status: user.status.charAt(0).toUpperCase() + user.status.slice(1),
          joinDate: new Date(user.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          lastLogin: "N/A",
          avatar: user.profilePicture || "/placeholder.svg?height=40&width=40",
          phone: user.contact || "N/A",
          location: user.location?.name || "N/A",
          rating: 0,
          paymentMethod: "N/A",
          verificationStatus: user.verification.charAt(0).toUpperCase() + user.verification.slice(1),
        }))

        setAccounts(formattedUsers)
      }

      // Reset form
      setNewAccountEmail("")
      setNewAccountPassword("")
      setNewAccountType("")
      setNewAccountFirstName("")
      setNewAccountLastName("")
      setNewAccountContact("")
    } catch (error) {
      console.error("Error creating account:", error)
      toast(
        <div>
          <div className="font-semibold">Account creation failed</div>
          <div className="text-sm text-gray-600">
            {error instanceof Error ? error.message : "An error occurred while creating the account"}
          </div>
        </div>,
        { className: "bg-red-50 text-red-700 border-red-200" },
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7] pb-20 font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,sans-serif]">
      {/* Include animation keyframes */}
      <style>{keyframes}</style>

      {/* Floating Dock */}
      <div className="sticky z-40 flex">
        <MyFloatingDock />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-16">
        {/* Header with Time and Date */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Accounts Management</h1>
            <p className="text-gray-500 text-sm font-light">View and manage all user accounts in your system</p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-col items-end">
            <div className="text-2xl font-medium text-[#0A84FF]">{timeString}</div>
            <div className="text-sm text-gray-500 font-light">{dateString}</div>
          </div>
        </div>

        {/* Account Overview */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-[#0A84FF] to-[#5AC8FA] rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 text-white">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                  <h2 className="text-xl font-semibold">Account Overview</h2>
                  <p className="text-white/90 font-light">Manage and monitor all registered accounts</p>
                </div>
                <div className="mt-4 md:mt-0 flex gap-2">
                  <Button className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border-0">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh
                  </Button>
                  <Button
                    className="bg-white text-[#0A84FF] hover:bg-white/90 border-0"
                    onClick={() => setIsAddAccountModalOpen(true)}
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Account
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-white/20 rounded-full p-2">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-sm font-medium">Total Accounts</span>
                  </div>
                  <div className="text-3xl font-medium">{accountStats.totalAccounts}</div>
                  <div className="text-white/90 text-sm mt-1 flex items-center font-light">
                    <ArrowRight className="h-3 w-3 mr-1" />
                    <span>+12% increase</span>
                  </div>
                </div>

                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-white/20 rounded-full p-2">
                      <CheckCircle className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-sm font-medium">Active Users</span>
                  </div>
                  <div className="text-3xl font-medium">{accountStats.activeUsers}</div>
                  <div className="text-white/90 text-sm mt-1 flex items-center font-light">
                    <ArrowRight className="h-3 w-3 mr-1" />
                    <span>+8% increase</span>
                  </div>
                </div>

                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-white/20 rounded-full p-2">
                      <UserPlus className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-sm font-medium">New This Month</span>
                  </div>
                  <div className="text-3xl font-medium">{accountStats.newThisMonth}</div>
                  <div className="text-white/90 text-sm mt-1 flex items-center font-light">
                    <ArrowRight className="h-3 w-3 mr-1" />
                    <span>+24% increase</span>
                  </div>
                </div>

                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-white/20 rounded-full p-2">
                      <ChevronDown className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-sm font-medium">Conversion Rate</span>
                  </div>
                  <div className="text-3xl font-medium">{accountStats.conversionRate}%</div>
                  <div className="text-white/90 text-sm mt-1 flex items-center font-light">
                    <ArrowRight className="h-3 w-3 mr-1" />
                    <span>+5% increase</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Accounts List - Left Side */}
          <div className="lg:col-span-2 overflow-auto max-h-[95rem]">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <h2 className="text-lg font-medium text-gray-800">Registered Accounts</h2>
                  <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                    <div className="relative w-full md:w-64">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input placeholder="Search accounts..." className="pl-9 bg-[#F2F2F7] border-0" />
                    </div>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-full sm:w-[180px] bg-[#F2F2F7] border-0">
                        <SelectValue placeholder="Filter by role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="customer">Customers</SelectItem>
                        <SelectItem value="provider">Service Providers</SelectItem>
                        <SelectItem value="admin">Administrators</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" className="bg-[#F2F2F7] border-0">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-auto">
                  <TabsList className="bg-[#F2F2F7] mb-4">
                    <TabsTrigger value="all" className="text-xs data-[state=active]:bg-white">
                      All
                    </TabsTrigger>
                    <TabsTrigger value="customers" className="text-xs data-[state=active]:bg-white">
                      Customers
                    </TabsTrigger>
                    <TabsTrigger value="providers" className="text-xs data-[state=active]:bg-white">
                      Providers
                    </TabsTrigger>
                    <TabsTrigger value="admins" className="text-xs data-[state=active]:bg-white">
                      Admins
                    </TabsTrigger>
                    <TabsTrigger value="inactive" className="text-xs data-[state=active]:bg-white">
                      Inactive
                    </TabsTrigger>
                  </TabsList>

                  <div className="space-y-3">
                    {filteredAccounts.map((account) => (
                      <div
                        key={account.id}
                        className={`bg-[#F2F2F7]/50 rounded-xl p-4 hover:bg-[#F2F2F7] transition-colors cursor-pointer ${selectedAccount?.id === account.id ? "ring-1 ring-[#0A84FF]" : ""}`}
                        onClick={() => handleAccountSelect(account)}
                      >
                        <div className="flex items-start gap-4">
                          <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                            <AvatarImage src={account.avatar || "/placeholder.svg"} alt={account.name} />
                            <AvatarFallback className="bg-[#E9F6FF] text-[#0A84FF]">
                              {account.name.charAt(0)}
                              {account.name.split(" ")[1]?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <h3 className="font-medium text-gray-800">{account.name}</h3>
                              <div className="flex flex-wrap gap-2">
                                {renderStatusBadge(account.status)}
                                {renderRoleBadge(account.role)}
                              </div>
                            </div>

                            <div className="text-sm text-gray-500 mt-1 font-light">{account.email}</div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1 mt-3 text-xs text-gray-600 font-light">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3 text-gray-400" />
                                <span>Joined: {account.joinDate}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3 text-gray-400" />
                                <span>Last login: {account.lastLogin}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-2">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Account
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {account.status === "Active" ? (
                                  <DropdownMenuItem>
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Deactivate
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem>
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Activate
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-[#FF453A]">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>

                        {selectedAccount?.id === account.id && (
                          <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                              <h4 className="font-medium text-sm text-gray-700">Contact Information</h4>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm font-light">
                                  <Mail className="h-4 w-4 text-[#0A84FF]" />
                                  <span>{account.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm font-light">
                                  <Phone className="h-4 w-4 text-[#0A84FF]" />
                                  <span>{account.phone}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm font-light">
                                  <MapPin className="h-4 w-4 text-[#0A84FF]" />
                                  <span>{account.location}</span>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-3">
                              <h4 className="font-medium text-sm text-gray-700">Account Details</h4>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                  <div className="flex items-center gap-2">
                                    <Shield className="h-4 w-4 text-[#0A84FF]" />
                                    <span className="font-light">Verification</span>
                                  </div>
                                  <span
                                    className={`font-medium ${account.verificationStatus === "Verified" ? "text-[#30D158]" : "text-[#FF9500]"}`}
                                  >
                                    {account.verificationStatus}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="md:col-span-2 flex justify-end">
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-[#0A84FF] border-[#0A84FF]/20 hover:bg-[#E9F6FF]"
                              >
                                View Full Profile
                                <ChevronRight className="ml-1 h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </Tabs>
              </div>

              <div className="p-4 border-t border-gray-100 flex items-center justify-between">
                <div className="text-sm text-gray-500 font-light">
                  Showing <span className="font-medium">{filteredAccounts.length}</span> of{" "}
                  <span className="font-medium">{accounts.length}</span> accounts
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="bg-white border-gray-200 text-gray-700">
                    Previous
                  </Button>
                  <Button variant="outline" size="sm" className="bg-white border-gray-200 text-gray-700">
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Account Analytics - Right Side */}
          <div>
            <div className="space-y-6">
              {/* Account Distribution */}
              <Card className="border-none rounded-2xl shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-[#E9F6FF] to-[#F2EBFF] p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-800">Account Distribution</h3>
                    <PieChart className="h-4 w-4 text-[#0A84FF]" />
                  </div>
                </div>
                <CardContent className="p-5">
                  <div className="flex items-center justify-center mb-6">
                    <div className="relative w-36 h-36">
                      {/* Circular chart */}
                      <div className="absolute inset-0 rounded-full bg-[#F2F2F7]"></div>
                      <div
                        className="absolute inset-0 rounded-full bg-[#0A84FF]"
                        style={{ clipPath: "polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, 50% 0%)" }}
                      ></div>
                      <div
                        className="absolute inset-0 rounded-full bg-[#5E5CE6]"
                        style={{ clipPath: "polygon(50% 50%, 100% 0%, 100% 24%,  bg-[#5E5CE6]" }}
                      ></div>
                      <div
                        className="absolute inset-0 rounded-full bg-[#5AC8FA]"
                        style={{ clipPath: "polygon(50% 50%, 100% 24%, 100% 32%, 50% 32%)" }}
                      ></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center">
                          <Users className="h-10 w-10 text-[#0A84FF]" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {accountDistribution.map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-3 h-3 rounded-full ${index === 0 ? "bg-[#0A84FF]" : index === 1 ? "bg-[#5E5CE6]" : "bg-[#5AC8FA]"
                                }`}
                            ></div>
                            <span className="text-sm text-gray-700 font-light">{item.role}</span>
                          </div>
                          <div className="text-sm font-medium">{item.count}</div>
                        </div>
                        <div className="h-1.5 bg-[#F2F2F7] rounded-full">
                          <div
                            className={`h-full rounded-full ${index === 0 ? "bg-[#0A84FF]" : index === 1 ? "bg-[#5E5CE6]" : "bg-[#5AC8FA]"
                              }`}
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Account Status */}
              <Card className="border-none rounded-2xl shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-[#E8F8EF] to-[#E9F6FF] p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-800">Account Status</h3>
                    <BarChart3 className="h-4 w-4 text-[#30D158]" />
                  </div>
                </div>
                <CardContent className="p-5">
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {accountStatus.map((status, index) => (
                      <div key={index} className="bg-[#F2F2F7] rounded-xl p-3">
                        <div className="text-xs text-gray-500 font-light">{status.status}</div>
                        <div className="text-lg font-medium text-gray-800">{status.count}</div>
                        <div
                          className={`text-xs ${status.status === "Active"
                              ? "text-[#30D158]"
                              : status.status === "Inactive"
                                ? "text-[#8E8E93]"
                                : status.status === "Pending"
                                  ? "text-[#FF9500]"
                                  : "text-[#FF453A]"
                            }`}
                        >
                          {status.percentage}%
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    {accountStatus.map((status, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-3 h-3 rounded-full ${status.status === "Active"
                                  ? "bg-[#30D158]"
                                  : status.status === "Inactive"
                                    ? "bg-[#8E8E93]"
                                    : status.status === "Pending"
                                      ? "bg-[#FF9500]"
                                      : "bg-[#FF453A]"
                                }`}
                            ></div>
                            <span className="text-sm text-gray-700 font-light">{status.status}</span>
                          </div>
                          <div className="text-sm font-medium">{status.percentage}%</div>
                        </div>
                        <div className="h-1.5 bg-[#F2F2F7] rounded-full">
                          <div
                            className={`h-full rounded-full ${status.status === "Active"
                                ? "bg-[#30D158]"
                                : status.status === "Inactive"
                                  ? "bg-[#8E8E93]"
                                  : status.status === "Pending"
                                    ? "bg-[#FF9500]"
                                    : "bg-[#FF453A]"
                              }`}
                            style={{ width: `${status.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* Add Account Modal */}
      <Dialog open={isAddAccountModalOpen} onOpenChange={setIsAddAccountModalOpen}>
        <DialogContent className="sm:max-w-4xl rounded-2xl border-none shadow-lg overflow-hidden p-0 bg-white/90 backdrop-blur-xl">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left side - Form */}
            <div className="p-6">
              <DialogTitle className="text-xl mb-1">Add New Account</DialogTitle>
              <DialogDescription className="mb-6">Create a new user account with the specified role.</DialogDescription>

              <div className="grid gap-4" style={{ animation: "slideInUp 0.3s ease-out" }}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="firstname" className="text-gray-700">
                      First Name
                    </Label>
                    <Input
                      id="firstname"
                      placeholder="John"
                      className="bg-gray-100 border-gray-200 focus:ring-2 focus:ring-[#0A84FF] transition-all duration-200"
                      value={newAccountFirstName}
                      onChange={(e) => setNewAccountFirstName(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="lastname" className="text-gray-700">
                      Last Name
                    </Label>
                    <Input
                      id="lastname"
                      placeholder="Doe"
                      className="bg-gray-100 border-gray-200 focus:ring-2 focus:ring-[#0A84FF] transition-all duration-200"
                      value={newAccountLastName}
                      onChange={(e) => setNewAccountLastName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-gray-700">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="user@example.com"
                    className="bg-gray-100 border-gray-200 focus:ring-2 focus:ring-[#0A84FF] transition-all duration-200"
                    value={newAccountEmail}
                    onChange={(e) => setNewAccountEmail(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="contact" className="text-gray-700">
                    Contact Number
                  </Label>
                  <Input
                    id="contact"
                    placeholder="+1 (555) 123-4567"
                    className="bg-gray-100 border-gray-200 focus:ring-2 focus:ring-[#0A84FF] transition-all duration-200"
                    value={newAccountContact}
                    onChange={(e) => setNewAccountContact(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password" className="text-gray-700">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter a secure password"
                    className="bg-gray-100 border-gray-200 focus:ring-2 focus:ring-[#0A84FF] transition-all duration-200"
                    value={newAccountPassword}
                    onChange={(e) => setNewAccountPassword(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="type" className="text-gray-700">
                    Account Type
                  </Label>
                  <Select value={newAccountType} onValueChange={setNewAccountType}>
                    <SelectTrigger className="bg-gray-100 border-gray-200 focus:ring-2 focus:ring-[#0A84FF] transition-all duration-200">
                      <SelectValue placeholder="Select account type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="provider">Provider</SelectItem>
                      <SelectItem value="customer">Customer</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setIsAddAccountModalOpen(false)}
                  className="rounded-full hover:bg-gray-100 transition-all duration-200"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddAccount}
                  disabled={isSubmitting}
                  className="rounded-full bg-[#0A84FF] hover:bg-[#0A84FF]/90 transition-all duration-200"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Creating...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </div>
            </div>

            {/* Right side - Information and preview */}
            <div className="bg-gradient-to-br from-[#0A84FF]/10 to-[#5AC8FA]/10 p-6 border-l border-gray-100">
              <div className="h-full flex flex-col">
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Account Information</h3>
                  <p className="text-sm text-gray-600">
                    Create a new user account to provide access to the system. Different account types have different
                    permissions.
                  </p>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-sm border border-gray-100 mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Account Types</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 bg-[#E9F6FF] p-1.5 rounded-full">
                        <Shield className="h-3.5 w-3.5 text-[#0A84FF]" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-700">Admin</div>
                        <div className="text-xs text-gray-500">Full system access and management capabilities</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 bg-[#F2EBFF] p-1.5 rounded-full">
                        <Users className="h-3.5 w-3.5 text-[#5E5CE6]" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-700">Provider</div>
                        <div className="text-xs text-gray-500">
                          Can manage services and respond to customer requests
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 bg-[#E8F8EF] p-1.5 rounded-full">
                        <User className="h-3.5 w-3.5 text-[#30D158]" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-700">Customer</div>
                        <div className="text-xs text-gray-500">Can browse services and make requests</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Account preview */}
                {newAccountFirstName && newAccountLastName && (
                  <div className="mt-auto">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Account Preview</h4>
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-gray-100">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                          <AvatarFallback className="bg-[#E9F6FF] text-[#0A84FF]">
                            {newAccountFirstName.charAt(0)}
                            {newAccountLastName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-gray-800">
                            {newAccountFirstName} {newAccountLastName}
                          </div>
                          <div className="text-sm text-gray-500">{newAccountEmail || "email@example.com"}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
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
                <CheckCircle className="h-10 w-10 text-green-500" style={{ animation: "bounceIn 0.6s ease-out" }} />
              </div>

              <h3 className="text-xl font-medium text-gray-900 mb-2" style={{ animation: "slideInUp 0.4s ease-out" }}>
                Account Created Successfully!
              </h3>

              <p className="text-gray-600 mb-6" style={{ animation: "fadeIn 0.5s ease-out 0.2s both" }}>
                {newAccountData?.email
                  ? `The account for ${newAccountData.email} has been created successfully.`
                  : "The new account has been created successfully."}
              </p>

              <button
                onClick={() => setIsSuccessModalOpen(false)}
                className="px-8 py-3 bg-[#0A84FF] text-white rounded-full font-medium shadow-sm hover:bg-[#0A84FF]/90 active:scale-95 transition-all duration-200"
                style={{ animation: "fadeIn 0.5s ease-out 0.3s both" }}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AccountsTab