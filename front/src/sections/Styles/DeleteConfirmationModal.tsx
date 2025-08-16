import React from "react"
import { Trash2 } from "lucide-react"

interface Account {
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
  bio?: string
  profilePicturePreview?: string | null
  coverPhoto?: string | null
  selectedLocation?: {
    name: string
    lat: number
    lng: number
    distance: number
    zipCode?: string
  } | null
}

interface DeleteConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  account: Account
  onConfirmDelete: () => void
}

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

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  account,
  onConfirmDelete,
}: DeleteConfirmationModalProps) {
  React.useEffect(() => {
    const styleElement = document.createElement("style")
    styleElement.innerHTML = keyframes
    document.head.appendChild(styleElement)
    return () => {
      styleElement.remove()
    }
  }, [])

  if (!isOpen) return null

  return (
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
            className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-6"
            style={{ animation: "pulse 2s ease-in-out infinite" }}
          >
            <Trash2 className="h-10 w-10 text-red-500" style={{ animation: "bounceIn 0.6s ease-out" }} />
          </div>

          <h3 className="text-xl font-medium text-gray-900 mb-2" style={{ animation: "slideInUp 0.4s ease-out" }}>
            Delete Account
          </h3>

          <p className="text-gray-600 mb-6" style={{ animation: "fadeIn 0.5s ease-out 0.3s both" }}>
            Are you sure you want to delete {account.name}'s account? This action cannot be undone.
          </p>

          <div className="flex gap-3 w-full" style={{ animation: "fadeIn 0.5s ease-out 0.4s both" }}>
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-50 active:scale-95 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={onConfirmDelete}
              className="flex-1 px-6 py-3 bg-red-500 text-white rounded-full font-medium shadow-sm hover:bg-red-600 active:scale-95 transition-all duration-200"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}