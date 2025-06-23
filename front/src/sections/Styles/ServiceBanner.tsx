import { Button } from "@/components/ui/button"

import img1 from "../../assets/Home/Pensive Male Portrait.jpeg"

export default function ServiceBanner() {
  return (
    <section
      className="relative w-full h-[500px] flex items-center justify-center text-center px-4 py-12 md:py-24 lg:py-32 bg-cover bg-center"
      style={{ backgroundImage: `url(${img1})` }}
    >
      {/* Overlay for text readability */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      <div className="relative z-10 max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extralight text-gray-200 leading-tight">Online Home Services</h1>
        <p className="text-lg md:text-xl text-gray-100 opacity-90">
          Your trusted partner for all home service needs. Quality, reliability, and convenience at your fingertips.
        </p>
        <Button
          className="mt-6 p-5 text-sm rounded-full border-1 border-gray-200 text-gray-200 bg-transparent"
        >
          Book Now
        </Button>
      </div>
    </section>
  )
}