import React from "react"
import {
  ChevronLeft,
  MapPin,
  FileText,
  AlertTriangle,
  Camera,
  User,
  X,
  CheckCircle,
  Edit,
  Trash2,
  Settings,
} from "lucide-react"
import ImagePopup from "../Styles/ImagePopup"
import DeclineModal from "../Styles/DeclineModal"
import DeleteConfirmationModal from "../Styles/DeleteConfirmationModal"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface Account {
  id: number | string // Allow both number and string for MongoDB ObjectId compatibility
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
  // Customer specific fields
  gender?: string
  bio?: string
  frontIdPreview?: string | null
  backIdPreview?: string | null
  profilePicturePreview?: string | null
  coverPhoto?: string | null
  selectedLocation?: {
    name: string
    lat: number
    lng: number
    distance: number
    zipCode?: string
  } | null
  // Customer anomaly status fields
  frontIdAnomaly?: boolean
  backIdAnomaly?: boolean
  // Service Provider specific fields (for type compatibility, though not used here)
  secRegistrationPreview?: string | null
  businessPermitPreview?: string | null
  birRegistrationPreview?: string | null
  eccCertificatePreview?: string | null
  generalLiabilityPreview?: string | null
  workersCompPreview?: string | null
  professionalIndemnityPreview?: string | null
  propertyDamagePreview?: string | null
  businessInterruptionPreview?: string | null
  bondingInsurancePreview?: string | null
  secRegistrationAnomaly?: boolean
  businessPermitAnomaly?: boolean
  birRegistrationAnomaly?: boolean
  eccCertificateAnomaly?: boolean
  generalLiabilityAnomaly?: boolean
  workersCompAnomaly?: boolean
  professionalIndemnityAnomaly?: boolean
  propertyDamageAnomaly?: boolean
  businessInterruptionAnomaly?: boolean
  bondingInsuranceAnomaly?: boolean
}

interface CustomerReviewerProps {
  account: Account
  onClose: () => void
  onAccountAction: (
    accountId: number | string, // Allow both number and string for MongoDB ObjectId compatibility
    newStatus: string,
    newVerificationStatus: string,
    updatedAnomalies: { [key: string]: boolean },
    declineReasons?: string[],
    declineMessage?: string,
  ) => void
}

export default function CustomerReviewer({ account, onClose, onAccountAction }: CustomerReviewerProps) {
  const keyframes = `
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideInUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes bounceIn {
  0% { transform: scale(0); opacity: 0; }
  60% { transform: scale(1.2); }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}
`

  React.useEffect(() => {
    const styleElement = document.createElement("style")
    styleElement.innerHTML = keyframes
    document.head.appendChild(styleElement)
    return () => {
      styleElement.remove()
    }
  }, [keyframes])

  const [popupImage, setPopupImage] = React.useState<string | null>(null)
  const [isImagePopupOpen, setIsImagePopupOpen] = React.useState(false)
  const [isDeclineModalOpen, setIsDeclineModalOpen] = React.useState(false)
  const [isEditMode, setIsEditMode] = React.useState(false)
  const [isChangeStatusModalOpen, setIsChangeStatusModalOpen] = React.useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false)
  const [selectedStatus, setSelectedStatus] = React.useState(account.status)
  const [suspensionDuration, setSuspensionDuration] = React.useState({
    value: 1,
    unit: "days",
  })
  const [editableFields, setEditableFields] = React.useState({
    name: account.name,
    email: account.email,
    phone: account.phone,
    gender: account.gender || "",
    bio: account.bio || "",
  })

  const [documentAnomalies, setDocumentAnomalies] = React.useState({
    frontIdAnomaly: account.frontIdAnomaly || false,
    backIdAnomaly: account.backIdAnomaly || false,
  })

  const handleImageClick = (imageUrl: string | null) => {
    if (imageUrl) {
      setPopupImage(imageUrl)
      setIsImagePopupOpen(true)
    }
  }

  const toggleAnomaly = (docKey: keyof typeof documentAnomalies) => {
    setDocumentAnomalies((prev) => ({
      ...prev,
      [docKey]: !prev[docKey],
    }))
  }

  const renderDocumentPreview = (
    previewUrl: string | null | undefined,
    docName: string,
    anomalyKey: keyof typeof documentAnomalies,
  ) => {
    const hasAnomaly = documentAnomalies[anomalyKey]
    return (
      <div className={`space-y-2 ${hasAnomaly ? "border border-red-400 bg-red-50 p-2 rounded-md" : ""}`}>
        <div className="flex items-center justify-between">
          <h5 className="text-sm font-medium text-gray-700">{docName}</h5>
          <button
            onClick={() => toggleAnomaly(anomalyKey)}
            className={`p-1 rounded-full ${hasAnomaly ? "bg-red-200 text-red-700" : "bg-gray-100 text-gray-500"} hover:bg-opacity-80 transition-colors`}
            title={hasAnomaly ? "Mark as no anomaly" : "Mark as anomaly"}
          >
            <AlertTriangle className="h-4 w-4" />
          </button>
        </div>
        {previewUrl ? (
          <div
            className="relative w-full h-32 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation()
              handleImageClick(previewUrl)
            }}
          >
            <img
              src={previewUrl || "/placeholder.svg"}
              alt={`${docName} Preview`}
              className="object-contain w-full h-full filter blur-sm hover:blur-[2px] transition-all"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-black/50 text-white px-3 py-1 rounded-full text-sm">Click to view</span>
            </div>
          </div>
        ) : (
          <div className="mt-2 border rounded p-2 flex items-center">
            <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center mr-3">
              <FileText className="h-6 w-6 text-gray-500" />
            </div>
            <div>
              <p className="text-sm font-medium">{docName}</p>
              <p className="text-red-500 text-xs">Not uploaded</p>
            </div>
          </div>
        )}
      </div>
    )
  }

  const handleAcceptApplication = () => {
    onAccountAction(account.id, "Active", "Verified", documentAnomalies)
  }

  const handleDeclineApplicationClick = () => {
    setIsDeclineModalOpen(true)
  }

  const handleConfirmDecline = (reasons: string[], message: string) => {
    onAccountAction(account.id, "Declined", "Rejected", documentAnomalies, reasons, message)
    setIsDeclineModalOpen(false)
  }

  const handleEditMode = () => {
    if (isEditMode) {
      // Save changes
      toast.success(`Account updated for ${editableFields.name}`, { duration: 2000 })
      setIsEditMode(false)
    } else {
      // Enter edit mode
      setIsEditMode(true)
      toast.info(`Edit mode enabled for ${account.name}`, { duration: 2000 })
    }
  }

  const handleFieldChange = (field: string, value: string) => {
    setEditableFields((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleCancelEdit = () => {
    setIsEditMode(false)
    setEditableFields({
      name: account.name,
      email: account.email,
      phone: account.phone,
      gender: account.gender || "",
      bio: account.bio || "",
    })
    toast.info("Edit mode cancelled", { duration: 2000 })
  }

  const handleConfirmStatusChange = () => {
    let statusMessage = selectedStatus
    if (selectedStatus === "Suspended") {
      statusMessage = `Suspended for ${suspensionDuration.value} ${suspensionDuration.unit}`
    }
    onAccountAction(account.id, selectedStatus, account.verificationStatus, documentAnomalies)
    setIsChangeStatusModalOpen(false)
    toast.success(`Account status changed to ${statusMessage}`, { duration: 2000 })
  }

  const handleConfirmDelete = async () => {
    try {
      // The actual API call is now handled in DeleteConfirmationModal
      // This function will be called after successful deletion
      toast.success(`Account deleted successfully for ${account.name}`, { duration: 3000 })
      setIsDeleteModalOpen(false)

      // Close the reviewer after successful deletion
      setTimeout(() => {
        onClose()
      }, 1000)
    } catch (error) {
      console.error("Error in delete confirmation:", error)
      const errorMessage = error instanceof Error ? error.message : String(error)
      toast.error(`Failed to delete account: ${errorMessage}`, { duration: 3000 })
    }
  }

  return (
    <div className="py-4 px-2 min-h-screen bg-[#F5F5F7] font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,sans-serif] mt-10">
      <style>{keyframes}</style>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-medium mb-1 text-gray-700">Account Details</h1>
          <h2 className="text-3xl font-medium text-sky-500">Customer Profile Review</h2>
        </div>

        {/* Form content */}
        <div className="bg-white rounded-xl text-gray-700">
          <div className="p-6">
            <div>
              {/* Profile Header */}
              <div className="bg-white rounded-xl overflow-hidden mb-6 border border-gray-100">
                {/* Cover Photo */}
                <div className="relative h-60 overflow-hidden">
                  {account.coverPhoto ? (
                    <img
                      src={account.coverPhoto || "/placeholder.svg"}
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
                        {account.profilePicturePreview ? (
                          <img
                            src={
                              account.profilePicturePreview ||
                              "https://cdn.pixabay.com/photo/2023/04/16/10/55/nature-7929920_1280.jpg" ||
                              "/placeholder.svg" ||
                              "/placeholder.svg" ||
                              "/placeholder.svg" ||
                              "/placeholder.svg" ||
                              "/placeholder.svg"
                            }
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
                          <h1 className="text-2xl font-medium text-gray-700">{account.name}</h1>
                          <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                            {account.role}
                          </span>
                        </div>
                        {account.selectedLocation && (
                          <div className="flex items-center gap-2 mt-1 text-gray-600">
                            <MapPin className="h-4 w-4" />
                            <span>{account.selectedLocation.name}</span>
                            {account.selectedLocation.zipCode && (
                              <span className="text-sky-600 text-sm">({account.selectedLocation.zipCode})</span>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => setIsDeleteModalOpen(true)}
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2 text-red-600 hover:text-red-700 bg-transparent"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </div>

                    {account.bio && <p className="text-gray-600 max-w-2xl mb-6">{account.bio}</p>}
                  </div>
                </div>
              </div>

              {/* Tabs Navigation */}
              <div className="border-b border-gray-200 mb-6">
                <nav className="flex -mb-px overflow-x-auto">
                  <button className="py-4 px-6 font-medium text-sm border-b-2 border-sky-500 text-sky-500 flex items-center gap-2 whitespace-nowrap">
                    <User className="h-4 w-4" />
                    Personal Info
                  </button>
                </nav>
              </div>

              {/* Personal Information Section */}
              <div className="bg-white rounded-xl p-6 mb-6 border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-medium">Personal Information</h2>
                  <div className="flex gap-2">
                    {isEditMode ? (
                      <>
                        <Button
                          onClick={handleCancelEdit}
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2 bg-transparent"
                        >
                          <X className="h-4 w-4" />
                          Cancel
                        </Button>
                        <Button
                          onClick={handleEditMode}
                          size="sm"
                          className="flex items-center gap-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 active:scale-95 transition-all duration-200"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Save Changes
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={handleEditMode}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2 bg-transparent"
                      >
                        <Edit className="h-4 w-4" />
                        Edit Mode
                      </Button>
                    )}
                    <Button
                      onClick={() => setIsChangeStatusModalOpen(true)}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 bg-transparent"
                    >
                      <Settings className="h-4 w-4" />
                      Change Status
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Full Name</h4>
                    {isEditMode ? (
                      <input
                        type="text"
                        value={editableFields.name}
                        onChange={(e) => handleFieldChange("name", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{editableFields.name}</p>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Email</h4>
                    {isEditMode ? (
                      <input
                        type="email"
                        value={editableFields.email}
                        onChange={(e) => handleFieldChange("email", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{editableFields.email}</p>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Phone</h4>
                    {isEditMode ? (
                      <input
                        type="tel"
                        value={editableFields.phone}
                        onChange={(e) => handleFieldChange("phone", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{editableFields.phone}</p>
                    )}
                  </div>
                  {account.selectedLocation && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Location</h4>
                      <p className="text-gray-900 flex items-center">
                        <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                        {account.selectedLocation.name}
                        {account.selectedLocation.zipCode && (
                          <span className="ml-1 text-sky-600">({account.selectedLocation.zipCode})</span>
                        )}
                      </p>
                    </div>
                  )}
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Gender</h4>
                    {isEditMode ? (
                      <select
                        value={editableFields.gender}
                        onChange={(e) => handleFieldChange("gender", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer-not-to-say">Prefer not to say</option>
                      </select>
                    ) : (
                      <p className="text-gray-900 capitalize">{editableFields.gender || "N/A"}</p>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Account Type</h4>
                    <p className="text-gray-900">
                      <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                        {account.role}
                      </span>
                      <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                        {account.status}
                      </span>
                    </p>
                  </div>
                </div>
                {(account.bio || isEditMode) && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Bio</h4>
                    {isEditMode ? (
                      <textarea
                        value={editableFields.bio}
                        onChange={(e) => handleFieldChange("bio", e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter bio..."
                      />
                    ) : (
                      <p className="text-gray-900">{editableFields.bio}</p>
                    )}
                  </div>
                )}
              </div>

              {/* ID Documents */}
              <div className="bg-white rounded-xl p-6 border">
                <h4 className="text-lg font-medium mb-4">ID Documents</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>{renderDocumentPreview(account.frontIdPreview, "Front of ID", "frontIdAnomaly")}</div>
                  <div>{renderDocumentPreview(account.backIdPreview, "Back of ID", "backIdAnomaly")}</div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-0.5">
                    <AlertTriangle className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="ml-3">
                    <h5 className="text-sm font-medium text-blue-800">Account Status</h5>
                    <p className="mt-1 text-sm text-blue-700">
                      This account is currently <span className="font-medium">{account.status.toLowerCase()}</span> with
                      a verification status of{" "}
                      <span className="font-medium">{account.verificationStatus.toLowerCase()}</span>.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation and Action buttons */}
            <div className="flex justify-end gap-3 mt-8">
              <Button variant="outline" onClick={onClose} className="flex items-center gap-2 bg-transparent">
                <ChevronLeft className="h-4 w-4" />
                Close
              </Button>
              {account.status === "Pending" ? (
                <>
                  <Button
                    onClick={handleDeclineApplicationClick}
                    variant="destructive"
                    className="flex items-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Decline
                  </Button>
                  <Button
                    onClick={handleAcceptApplication}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Accept
                  </Button>
                </>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Image Popup */}
      <ImagePopup imageUrl={popupImage} isOpen={isImagePopupOpen} onClose={() => setIsImagePopupOpen(false)} />

      {/* Decline Modal */}
      <DeclineModal
        isOpen={isDeclineModalOpen}
        onClose={() => setIsDeclineModalOpen(false)}
        account={account}
        anomalies={documentAnomalies}
        onConfirmDecline={handleConfirmDecline}
      />

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          account={account}
          onConfirmDelete={handleConfirmDelete}
        />
      )}

      {isChangeStatusModalOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-md z-50 flex items-center justify-center p-4"
          style={{ animation: "fadeIn 0.3s ease-out" }}
        >
          <div
            className="mx-auto max-w-md w-full bg-white/90 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl transform transition-all border border-white/20 p-6"
            style={{ animation: "fadeIn 0.5s ease-out 0.2s both" }}
          >
            <div className="flex flex-col items-center text-center">
              <div
                className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-6"
                style={{ animation: "pulse 2s ease-in-out infinite" }}
              >
                <Settings className="h-10 w-10 text-blue-500" style={{ animation: "bounceIn 0.6s ease-out" }} />
              </div>

              <h3 className="text-xl font-medium text-gray-900 mb-2" style={{ animation: "slideInUp 0.4s ease-out" }}>
                Change Account Status
              </h3>

              <p className="text-gray-600 mb-6" style={{ animation: "fadeIn 0.5s ease-out 0.3s both" }}>
                Select the new status for {account.name}'s account
              </p>

              <div className="w-full mb-4" style={{ animation: "fadeIn 0.5s ease-out 0.3s both" }}>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Pending">Pending</option>
                  <option value="Active">Active</option>
                  <option value="On Review">On Review</option>
                  <option value="Suspended">Suspended</option>
                  <option value="Declined">Declined</option>
                </select>
              </div>

              {selectedStatus === "Suspended" && (
                <div className="w-full mb-4" style={{ animation: "fadeIn 0.3s ease-out" }}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Suspension Duration</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="1"
                      max="999"
                      value={suspensionDuration.value}
                      onChange={(e) =>
                        setSuspensionDuration((prev) => ({ ...prev, value: Number.parseInt(e.target.value) || 1 }))
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <select
                      value={suspensionDuration.unit}
                      onChange={(e) => setSuspensionDuration((prev) => ({ ...prev, unit: e.target.value }))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="days">Days</option>
                      <option value="weeks">Weeks</option>
                      <option value="months">Months</option>
                      <option value="years">Years</option>
                    </select>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Account will be suspended for {suspensionDuration.value} {suspensionDuration.unit}
                  </p>
                </div>
              )}

              <div className="flex gap-3 w-full" style={{ animation: "fadeIn 0.5s ease-out 0.4s both" }}>
                <button
                  onClick={() => setIsChangeStatusModalOpen(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-50 active:scale-95 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmStatusChange}
                  className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-full font-medium shadow-sm hover:bg-blue-600 active:scale-95 transition-all duration-200"
                >
                  {selectedStatus === "Suspended" ? "Suspend Account" : "Update Status"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}