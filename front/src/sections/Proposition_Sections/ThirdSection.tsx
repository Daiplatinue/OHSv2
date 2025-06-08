import React, { useEffect, useRef, useState } from 'react';
import { benefits } from '../propositionData';

const ThirdSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [, setCurrentSection] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Check if the container is in view
      if (rect.top <= 0 && rect.bottom >= windowHeight) {
        // Calculate progress based on how much of the container has been scrolled through
        const scrolled = Math.abs(rect.top);
        const totalScrollable = container.offsetHeight - windowHeight;
        const progress = Math.max(0, Math.min(1, scrolled / totalScrollable));

        setScrollProgress(progress);

        // Calculate current section
        const sectionIndex = Math.floor(progress * benefits.length);
        setCurrentSection(Math.min(sectionIndex, benefits.length - 1));
      }
    };

    // Use the main container's scroll event since it has overflow-y-auto
    const mainContainer = document.querySelector('.fixed.inset-0.z-50.bg-black');
    if (mainContainer) {
      mainContainer.addEventListener('scroll', handleScroll);
      handleScroll(); // Initial call

      return () => mainContainer.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const getBackgroundColor = (index: number) => {
    const colors = [
      'from-blue-50 to-indigo-100',
      'from-purple-50 to-pink-100',
      'from-green-50 to-emerald-100',
      'from-yellow-50 to-orange-100',
      'from-red-50 to-rose-100',
      'from-cyan-50 to-teal-100',
      'from-violet-50 to-purple-100',
      'from-amber-50 to-yellow-100'
    ];
    return colors[index % colors.length];
  };

  return (
    <section className="relative">
      {/* Parallax Container */}
      <div
        ref={containerRef}
        className="relative"
        style={{ height: `${benefits.length * 100}vh` }}
      >
        <div className="sticky top-0 h-screen overflow-hidden">
          <div
            className="flex h-full transition-transform duration-100 ease-out"
            style={{
              transform: `translateX(-${scrollProgress * (benefits.length - 1) * 100}vw)`,
              width: `${benefits.length * 100}vw`
            }}
          >
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className={`w-screen h-full flex items-center justify-center bg-gradient-to-br ${getBackgroundColor(index)} relative`}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-current"></div>
                  <div className="absolute bottom-20 right-20 w-24 h-24 rounded-full bg-current"></div>
                  <div className="absolute top-1/2 left-1/4 w-16 h-16 rounded-full bg-current"></div>
                </div>

                <div className="max-w-4xl mx-auto px-8 text-center relative z-10">
                  {/* Section Number */}
                  <div className="text-6xl font-bold text-gray-200 mb-4">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  {/* Content */}
                  <h2 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
                    {benefit.title}
                  </h2>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ThirdSection;