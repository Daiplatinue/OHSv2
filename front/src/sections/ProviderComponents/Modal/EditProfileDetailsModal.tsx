import React, { useState, useEffect } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { X, Loader2 } from "lucide-react"
import axios from "axios"

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
    zipCode: string
  }
  type: string
  status: string
  verification: string
  createdAt: string
}

interface EditProfileDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  userDetails: UserDetails | null
  onSaveSuccess: (updatedUser: UserDetails) => void
}

export function EditProfileDetailsModal({ isOpen, onClose, userDetails, onSaveSuccess }: EditProfileDetailsModalProps) {
  const [editedDetails, setEditedDetails] = useState<Partial<UserDetails>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  useEffect(() => {
    if (userDetails) {
      setEditedDetails({
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
        middleName: userDetails.middleName,
        email: userDetails.email,
        mobileNumber: userDetails.mobileNumber,
        gender: userDetails.gender,
        bio: userDetails.bio,
        location: userDetails.location ? { ...userDetails.location } : undefined,
      })
    }
  }, [userDetails, isOpen]) // Re-initialize when userDetails or modal opens

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (name.startsWith("location.")) {
      setEditedDetails((prev) => ({
        ...prev,
        location: {
          ...(prev.location ?? {
            name: "",
            lat: 0,
            lng: 0,
            distance: 0,
            zipCode: "",
          }),
          [name.split(".")[1]]: value,
        },
      }))
    } else {
      setEditedDetails((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setSaveError(null)

    const API_BASE_URL = "http://localhost:3000"
    const token = localStorage.getItem("token")

    if (!token) {
      setSaveError("Authentication token missing. Please log in.")
      setIsSaving(false)
      return
    }

    try {
      const response = await axios.put(`${API_BASE_URL}/api/user/profile`, editedDetails, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      onSaveSuccess(response.data.user)
      onClose()
    } catch (err: any) {
      console.error("Error saving user details:", err)
      if (err.response && err.response.data && err.response.data.message) {
        setSaveError(`Failed to save changes: ${err.response.data.message}`)
      } else {
        setSaveError("Failed to save changes. Please try again.")
      }
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-center mb-6">
                  <Dialog.Title as="h3" className="text-2xl font-semibold leading-6 text-gray-900">
                    Edit Account Details
                  </Dialog.Title>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-600"
                    onClick={onClose}
                    aria-label="Close"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {saveError && (
                  <div
                    className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
                    role="alert"
                  >
                    <strong className="font-bold">Error:</strong>
                    <span className="block sm:inline"> {saveError}</span>
                  </div>
                )}

                <form onSubmit={handleSave} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={editedDetails.firstName || ""}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="middleName" className="block text-sm font-medium text-gray-700 mb-1">
                        Middle Name (Optional)
                      </label>
                      <input
                        type="text"
                        id="middleName"
                        name="middleName"
                        value={editedDetails.middleName || ""}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={editedDetails.lastName || ""}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={editedDetails.email || ""}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="mobileNumber"
                        name="mobileNumber"
                        value={editedDetails.mobileNumber || ""}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                        Gender
                      </label>
                      <input
                        type="text"
                        id="gender"
                        name="gender"
                        value={editedDetails.gender || ""}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="location.name" className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        id="location.name"
                        name="location.name"
                        value={editedDetails.location?.name || ""}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      name="bio"
                      value={editedDetails.bio || ""}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
                      disabled={isSaving}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-all flex items-center justify-center"
                      disabled={isSaving}
                    >
                      {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : "Save Changes"}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}