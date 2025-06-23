import React, { useState, useEffect, useRef } from 'react';

import img1 from '../../assets/proposition/Focused Worker in Blue.jpeg';
import img2 from '../../assets/proposition/Man Assembling Chair.jpeg';
import img3 from '../../assets/proposition/Construction Crewmates in Uniform.jpeg';
import img4 from '../../assets/proposition/Man Gardening in Vibrant Flower Garden.jpeg';
import img5 from '../../assets/proposition/Lipstick with Flies.jpeg';
import img6 from '../../assets/proposition/Friendly Home Robot.jpeg';

const serviceMetrics = [
  {
    id: 1,
    serviceName: "Plumbling Services",
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
  }
];

const EighthSection: React.FC = () => {
  const [translateX, setTranslateX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const cardWidth = 508; // 500px width + 8px margin
  const totalSetWidth = serviceMetrics.length * cardWidth;

  useEffect(() => {
    if (isDragging) return; // Don't auto-scroll while dragging

    const interval = setInterval(() => {
      setTranslateX(prev => {
        const newValue = prev - 1;
        // Seamlessly reset when we've moved one complete set
        if (Math.abs(newValue) >= totalSetWidth) {
          return newValue + totalSetWidth;
        }
        return newValue;
      });
    }, 20);

    return () => clearInterval(interval);
  }, [totalSetWidth, isDragging]);

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart(e.clientX);
    setDragOffset(0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const currentOffset = e.clientX - dragStart;
    setDragOffset(currentOffset);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    setTranslateX(prev => prev + dragOffset);
    setDragOffset(0);
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setDragStart(e.touches[0].clientX);
    setDragOffset(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentOffset = e.touches[0].clientX - dragStart;
    setDragOffset(currentOffset);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    setTranslateX(prev => prev + dragOffset);
    setDragOffset(0);
  };

  const MetricCard = ({ metric }: { metric: typeof serviceMetrics[0] }) => {
    return (
      <div className="relative w-[500px] h-[650px] flex-shrink-0 rounded-[8px] overflow-hidden bg-white mr-8 cursor-grab active:cursor-grabbing">
        {/* Background Image with Dark Overlay */}
        <div className="absolute inset-0">
          <img
            src={metric.image}
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
              <p className="text-4xl font-medium text-green-400">
                {metric.startingPrice}
              </p>
            </div>
          </div>

          {/* Service Name */}
          <div className="mt-auto">
            <h3 className="text-3xl font-medium leading-tight mb-2 text-gray-200">
              {metric.serviceName}
            </h3>
          </div>

        </div>
      </div>
    );
  };

  // Create enough copies to ensure seamless scrolling
  interface ServiceMetric {
    id: number;
    value: string;
    unit: string;
    title: string;
    subtitle: string;
    description: string;
    image: string;
  }

  const infiniteCards: React.ReactElement<{ metric: ServiceMetric }>[] = [];
  for (let i = 0; i < 6; i++) {
    serviceMetrics.forEach((metric) => {
      infiniteCards.push(
        <MetricCard
          key={`set-${i}-card-${metric.id}`}
          metric={metric}
        />
      );
    });
  }

  return (
    <section className="relative min-h-screen bg-gray-50 overflow-hidden">
      {/* Carousel Section */}
      <div className="flex items-center justify-center flex-1 py-8">
        <div
          ref={containerRef}
          className="flex items-center select-none"
          style={{
            transform: `translateX(${translateX + dragOffset}px)`,
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {infiniteCards}
        </div>
      </div>

      {/* Drag Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex items-center gap-2 bg-black/20 backdrop-blur-sm rounded-full px-4 py-2">
          <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" />
          <span className="text-white/80 text-sm font-medium">Draggable Cards</span>
        </div>
      </div>
    </section>
  );
};

export default EighthSection;