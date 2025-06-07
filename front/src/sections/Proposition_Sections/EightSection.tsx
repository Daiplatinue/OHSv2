import React, { useState } from 'react';
import { services } from '../propositionData';

const EighthSection: React.FC = () => {
  const [hoveredService, setHoveredService] = useState("");
  const [indicatorPosition, setIndicatorPosition] = useState(0);

  const handleServiceHover = (title: string, event: React.MouseEvent<HTMLDivElement>) => {
    const element = event.currentTarget;
    const rect = element.getBoundingClientRect();
    setHoveredService(title);
    setIndicatorPosition(rect.top - 90);
  };

  return (
    <section className="relative min-h-screen bg-white flex flex-col p-8 lg:p-16 tracking-tight">
      <div className="text-gray-700 font-medium tracking-wider text-sm md:text-base">
        INSIGHT OF OUR <span className="text-sky-400 text-2xl">SERVICES</span>
      </div>

      <div className="flex-grow relative justify-center items-center flex ml-[-30rem]">
        <div className="flex flex-col max-w-7xl space-y-6">
          {services.map((service) => (
            <div
              key={service.title}
              className="group relative"
              onMouseEnter={(e) => handleServiceHover(service.title, e)}
              onMouseLeave={() => setHoveredService("")}
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-8xl font-bold leading-12 cursor-pointer text-gray-500/70 transition-all duration-300 ease-in-out transform group-hover:text-sky-400 group-hover:translate-x-4">
                {service.title}
              </h2>
            </div>
          ))}
        </div>

        <div
          className={`absolute right-0 transition-all duration-300 ease-in-out transform ${hoveredService ? 'opacity-100' : 'opacity-0'}`}
          style={{ top: `${indicatorPosition}px` }}
        >
          <div className="text-right">
            <div className="text-gray-700 text-lg md:text-xl font-bold tracking-tight">
              {hoveredService ? services.find(s => s.title === hoveredService)?.section : "01"}
            </div>
            <div className="text-sky-400 text-sm md:text-base font-bold tracking-wide">
              {hoveredService ? services.find(s => s.title === hoveredService)?.action : "DISCOVER"}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-end mt-8">
        <div className="flex items-center">
          <span className="text-gray-700 text-sm font-medium tracking-wide mr-2">SEE MORE</span>
        </div>
      </div>
    </section>
  );
};

export default EighthSection;