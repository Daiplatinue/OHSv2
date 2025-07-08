import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react"
import { Sparkles, DollarSign } from "lucide-react"

interface AdvertisementFlowModalProps {
  isOpen: boolean
  onClose: () => void
  step: number
  onNextStep: () => void
  onConfirmAdvertise: () => void
}

export default function AdvertisementFlowModal({
  isOpen,
  onClose,
  step,
  onNextStep,
  onConfirmAdvertise,
}: AdvertisementFlowModalProps) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-md" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4 font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,sans-serif]">
        <DialogPanel
          className="mx-auto max-w-md w-full bg-white/90 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl transform transition-all border border-white/20 p-6"
          style={{ animation: "fadeIn 0.5s ease-out" }}
        >
          {step === 1 && (
            <div className="flex flex-col items-center text-center" style={{ animation: "fadeIn 0.3s ease-out" }}>
              <div
                className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-6"
                style={{ animation: "pulse 2s ease-in-out infinite" }}
              >
                <Sparkles className="h-10 w-10 text-blue-500" style={{ animation: "bounceIn 0.6s ease-out" }} />
              </div>

              <DialogTitle
                className="text-xl font-medium text-gray-900 mb-2"
                style={{ animation: "slideInUp 0.4s ease-out" }}
              >
                Advertise Your Service?
              </DialogTitle>

              <p className="text-gray-600 mb-6" style={{ animation: "fadeIn 0.5s ease-out 0.2s both" }}>
                Congratulations on creating your new service! Would you like to advertise it to reach more customers?
              </p>

              <div className="flex space-x-4" style={{ animation: "fadeIn 0.5s ease-out 0.3s both" }}>
                <button
                  onClick={onClose}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-all"
                >
                  No, Thanks
                </button>
                <button
                  onClick={onNextStep}
                  className="px-6 py-3 bg-sky-500 text-white rounded-full hover:bg-sky-600 transition-all"
                >
                  Yes, Advertise
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col items-center text-center" style={{ animation: "fadeIn 0.3s ease-out" }}>
              <div
                className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6"
                style={{ animation: "pulse 2s ease-in-out infinite" }}
              >
                <DollarSign className="h-10 w-10 text-green-500" style={{ animation: "bounceIn 0.6s ease-out" }} />
              </div>

              <DialogTitle
                className="text-xl font-medium text-gray-900 mb-2"
                style={{ animation: "slideInUp 0.4s ease-out" }}
              >
                Choose Advertisement Plan
              </DialogTitle>

              <p className="text-gray-600 mb-6" style={{ animation: "fadeIn 0.5s ease-out 0.2s both" }}>
                Select an advertisement plan to boost your service visibility.
              </p>

              <div className="space-y-4 w-full" style={{ animation: "fadeIn 0.5s ease-out 0.3s both" }}>
                <div className="bg-gray-100 p-4 rounded-lg flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-gray-800">Standard Advertisement</h4>
                    <p className="text-sm text-gray-600">Reach a wider audience for 30 days.</p>
                  </div>
                  <span className="text-lg font-bold text-sky-600">₱100,000.00</span>
                </div>

                <button
                  onClick={onConfirmAdvertise}
                  className="w-full px-6 py-3 bg-sky-500 text-white rounded-full hover:bg-sky-600 transition-all"
                >
                  Pay Now
                </button>
              </div>
            </div>
          )}
        </DialogPanel>
      </div>
    </Dialog>
  )
}