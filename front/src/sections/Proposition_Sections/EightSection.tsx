import type React from "react"
import { useState, useEffect, useRef } from "react"

import img1 from "../../assets/proposition/Focused Worker in Blue.jpeg"
import img2 from "../../assets/proposition/Man Assembling Chair.jpeg"
import img3 from "../../assets/proposition/Construction Crewmates in Uniform.jpeg"
import img4 from "../../assets/proposition/Man Gardening in Vibrant Flower Garden.jpeg"
import img5 from "../../assets/proposition/Lipstick with Flies.jpeg"
import img6 from "../../assets/proposition/Friendly Home Robot.jpeg"

const serviceMetrics = [
  {
    id: 1,
    serviceName: "Plumbing Services",
    provider: "QuickFix Pro",
    description: "Round-the-clock emergency repair services for plumbing, electrical, and HVAC issues in your home.",
    startingPrice: "₱89",
    image: img1,
  },
  {
    id: 2,
    serviceName: "Handyman Services",
    provider: "RapidHome Solutions",
    description: "Professional technicians arrive at your doorstep within 2 hours of booking for most home services.",
    startingPrice: "₱65",
    image: img2,
  },
  {
    id: 3,
    serviceName: "HVAC Maintenance",
    provider: "ExpertCare Services",
    description: "Access to over 500 verified and skilled professionals for all your home maintenance needs.",
    startingPrice: "₱75",
    image: img3,
  },
  {
    id: 4,
    serviceName: "Landscaping Services",
    provider: "Elite Home Care",
    description: "Consistently high customer satisfaction with quality workmanship and professional service delivery.",
    startingPrice: "₱95",
    image: img4,
  },
  {
    id: 5,
    serviceName: "Pest Control Services",
    provider: "TrustGuard Services",
    description: "Comprehensive warranty coverage on all completed work to ensure your complete satisfaction.",
    startingPrice: "₱55",
    image: img5,
  },
  {
    id: 6,
    serviceName: "Home Cleaning Services",
    provider: "TrustGuard Services",
    description: "Comprehensive warranty coverage on all completed work to ensure your complete satisfaction.",
    startingPrice: "₱55",
    image: img6,
  },
]

interface EighthSectionProps {
  onCardSelect: () => void
}

const EighthSection: React.FC<EighthSectionProps> = ({ onCardSelect }) => {
  const [translateX, setTranslateX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState(0)
  const [isClickMode, setIsClickMode] = useState(false) // New state for click mode

  const containerRef = useRef<HTMLDivElement>(null)
  const firstCardRef = useRef<HTMLDivElement>(null) // Ref to measure card width

  const [actualCardWidth, setActualCardWidth] = useState(500 + 32) // Default to desktop size + margin
  const [actualTotalSetWidth, setActualTotalSetWidth] = useState(serviceMetrics.length * (500 + 32))

  const [isMobile, setIsMobile] = useState(false)
  const mobileAutoScrollTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Effect to determine if it's a mobile device
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768) // md breakpoint
    }

    handleResize() // Set initial value
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Effect to update card dimensions on resize (only relevant for carousel)
  useEffect(() => {
    const updateCardDimensions = () => {
      if (firstCardRef.current) {
        const cardElement = firstCardRef.current
        const style = window.getComputedStyle(cardElement)
        // Get the actual rendered width including margin-right
        const width = cardElement.offsetWidth + Number.parseFloat(style.marginRight)
        setActualCardWidth(width)
        setActualTotalSetWidth(serviceMetrics.length * width)
      }
    }

    if (!isMobile) {
      updateCardDimensions() // Initial calculation for desktop
      window.addEventListener("resize", updateCardDimensions)
    } else {
      // Cleanup listener if switching to mobile
      window.removeEventListener("resize", updateCardDimensions)
    }

    return () => window.removeEventListener("resize", updateCardDimensions)
  }, [isMobile])

  // Effect for auto-scrolling (only active on desktop)
  useEffect(() => {
    if (isMobile || isDragging || isClickMode) {
      // Stop auto-scroll if in click mode
      // If mobile or dragging, clear any auto-scroll timer
      if (mobileAutoScrollTimerRef.current) {
        clearInterval(mobileAutoScrollTimerRef.current)
        mobileAutoScrollTimerRef.current = null
      }
      return
    }

    const interval = setInterval(() => {
      setTranslateX((prev) => {
        const newValue = prev - 1 // Scroll by 1px
        // Seamlessly reset when we've moved one complete set
        if (actualTotalSetWidth > 0 && Math.abs(newValue) >= actualTotalSetWidth) {
          return newValue + actualTotalSetWidth
        }
        return newValue
      })
    }, 20) // Adjust scroll speed here

    return () => clearInterval(interval)
  }, [actualTotalSetWidth, isDragging, isMobile, isClickMode]) // Add isClickMode to dependencies

  // Mouse events (only active on desktop and when not in click mode)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMobile || isClickMode) return
    setIsDragging(true)
    setDragStart(e.clientX)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || isMobile || isClickMode) return
    e.preventDefault() // Prevent default browser drag behavior
    const currentX = e.clientX
    const deltaX = currentX - dragStart
    setTranslateX((prev) => prev + deltaX)
    setDragStart(currentX) // Update dragStart for the next move event
  }

  const handleMouseUp = () => {
    if (!isDragging || isMobile || isClickMode) return
    setIsDragging(false)
  }

  // Touch events (only active on desktop and when not in click mode)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isMobile || isClickMode) return
    setIsDragging(true)
    setDragStart(e.touches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || isMobile || isClickMode) return
    e.preventDefault() // Prevent default browser scroll behavior
    const currentX = e.touches[0].clientX
    const deltaX = currentX - dragStart
    setTranslateX((prev) => prev + deltaX)
    setDragStart(currentX) // Update dragStart for the next move event
  }

  const handleTouchEnd = () => {
    if (!isDragging || isMobile || isClickMode) return
    setIsDragging(false)
  }

  const MetricCard = ({
    metric,
    cardRef,
    onSelect,
    isClickMode, // Pass isClickMode to MetricCard
  }: {
    metric: (typeof serviceMetrics)[0]
    cardRef?: React.Ref<HTMLDivElement>
    onSelect: () => void
    isClickMode: boolean // Define isClickMode prop
  }) => {
    return (
      <div
        ref={cardRef}
        className={`relative w-full max-w-xs sm:max-w-sm md:max-w-[500px] h-[500px] sm:h-[600px] md:h-[650px] flex-shrink-0 rounded-[8px] overflow-hidden bg-white mr-4 sm:mr-6 md:mr-8 ${
          isClickMode ? "cursor-pointer" : "cursor-grab active:cursor-grabbing"
        }`}
        onClick={isClickMode ? onSelect : undefined} // Only call onSelect if in click mode
      >
        {/* Background Image with Dark Overlay */}
        <div className="absolute inset-0">
          <img
            src={metric.image || "/placeholder.svg"}
            alt={metric.serviceName}
            className="w-full h-full object-cover"
            draggable={false}
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* Main Content */}
        <div className="relative h-full flex flex-col text-white p-8">
          {/* Starting Price */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-75 mb-1 tracking-widest">Starting from</p>
              <p className="text-3xl sm:text-4xl font-medium text-green-400">{metric.startingPrice}</p>
            </div>
          </div>

          {/* Service Name */}
          <div className="mt-auto">
            <h3 className="text-2xl sm:text-3xl font-medium leading-tight mb-2 text-gray-200">{metric.serviceName}</h3>
          </div>
        </div>
      </div>
    )
  }

  // Create enough copies for desktop carousel
  const infiniteCards: React.ReactElement[] = []
  if (!isMobile) {
    const numCopies = Math.ceil(window.innerWidth / actualCardWidth) + 2 // At least 2 extra for smooth transition
    for (let i = 0; i < serviceMetrics.length * numCopies; i++) {
      const metric = serviceMetrics[i % serviceMetrics.length]
      infiniteCards.push(
        <MetricCard
          key={`set-${Math.floor(i / serviceMetrics.length)}-card-${metric.id}-${i}`} // Unique key for each instance
          metric={metric}
          cardRef={i === 0 ? firstCardRef : undefined} // Attach ref to the very first card only
          onSelect={onCardSelect}
          isClickMode={isClickMode} // Pass isClickMode
        />,
      )
    }
  }

  return (
    <section className="relative min-h-screen bg-gray-50 overflow-hidden py-12">
      {/* Carousel Section (Desktop) / Block Section (Mobile) */}
      <div className="flex items-center justify-center flex-1">
        {isMobile ? (
          // Mobile: Stacked cards
          <div className="flex flex-col items-center space-y-8 px-4 w-full">
            {serviceMetrics.map((metric) => (
              <MetricCard
                key={`mobile-card-${metric.id}`}
                metric={metric}
                cardRef={undefined}
                onSelect={onCardSelect}
                isClickMode={true} // Mobile cards are always clickable
              />
            ))}
          </div>
        ) : (
          // Desktop: Carousel
          <div
            ref={containerRef}
            className="flex items-center select-none mb-25"
            style={{
              transform: `translateX(${translateX}px)`,
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp} // End drag if mouse leaves container
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {infiniteCards}
          </div>
        )}
      </div>

      {/* Interaction Mode Indicator (only visible on desktop when carousel is active) */}
      {!isMobile && (
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 bg-black/20 backdrop-blur-sm rounded-full px-4 py-2">
            <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" />
            <span className="text-white/80 text-sm font-medium">{isClickMode ? "Click Cards" : "Draggable Cards"}</span>
          </div>
          <button
            onClick={() => setIsClickMode((prev) => !prev)}
            className="bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium rounded-full px-4 py-2 transition-colors duration-200"
          >
            Switch to {isClickMode ? "Drag Mode" : "Click Mode"}
          </button>
        </div>
      )}
    </section>
  )
}

export default EighthSection