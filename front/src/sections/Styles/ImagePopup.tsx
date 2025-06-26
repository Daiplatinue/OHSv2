import { X } from "lucide-react"

interface ImagePopupProps {
  imageUrl: string | null
  isOpen: boolean
  onClose: () => void
}

export default function ImagePopup({ imageUrl, isOpen, onClose }: ImagePopupProps) {
  if (!isOpen || !imageUrl) return null

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      style={{ animation: "fadeIn 0.3s ease-out" }}
      // Removed onClick={onClose} from here
    >
      <div
        className="relative max-w-4xl max-h-[90vh] w-full rounded-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()} // This prevents clicks on the image itself from closing it
      >
        <button
          onClick={onClose} // Now, only this button will close the popup
          className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>
        <img src={imageUrl || "/placeholder.svg"} alt="Full size preview" className="w-full h-full object-contain" />
      </div>
    </div>
  )
}