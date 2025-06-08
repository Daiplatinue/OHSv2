import React, { useEffect, useRef, useState } from 'react';
import { benefits } from '../propositionData';

const ThirdSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      // Find the scrolling container (the main content div with overflow-y-auto)
      const scrollingContainer = document.querySelector('.overflow-y-auto') as HTMLElement;
      if (!scrollingContainer) return;

      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      const containerTop = scrollingContainer.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;

      // Calculate relative position within the scrolling container
      const relativeTop = rect.top - containerTop;

      // Check if the container is in the viewport
      if (relativeTop <= 0 && relativeTop + container.offsetHeight >= windowHeight) {
        // Calculate how much we've scrolled through this section
        const scrolled = Math.abs(relativeTop);
        const totalScrollable = container.offsetHeight - windowHeight;

        // Ensure we don't divide by zero and clamp between 0 and 1
        const progress = totalScrollable > 0 ? Math.max(0, Math.min(1, scrolled / totalScrollable)) : 0;

        setScrollProgress(progress);
      } else if (relativeTop > 0) {
        // Section hasn't been reached yet
        setScrollProgress(0);
      } else if (relativeTop + container.offsetHeight < windowHeight) {
        // Section has been completely scrolled past
        setScrollProgress(1);
      }
    };

    // Listen to scroll events on the main scrolling container instead of window
    const scrollingContainer = document.querySelector('.overflow-y-auto');
    if (scrollingContainer) {
      scrollingContainer.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll(); // Initial call
    }

    return () => {
      if (scrollingContainer) {
        scrollingContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const renderSection = (benefit: any, index: number) => {
    const isFirst = index === 0;
    const isLast = index === benefits.length - 1;

    const layouts = [
      // Layout 1: Asymmetric Card Design
      <div key={index} className="w-screen h-full relative flex items-center justify-center p-4 md:p-8 bg-white">
        {isFirst && (
          <div className="absolute top-0 left-0 right-0 h-32 bg-white z-20"></div>
        )}

        <div className="relative w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white">
          <div className="lg:col-span-7 order-2 lg:order-1">
            <div
              className="aspect-[4/3] rounded-3xl bg-cover bg-center shadow-2xl"
              style={{ backgroundImage: `url(${benefit.image})` }}
            >
              <div className="w-full h-full rounded-3xl bg-black/40 flex items-end p-8">
                <div className="text-white">
                  <p className="text-sm uppercase tracking-widest opacity-80 mb-2">Featured Solution</p>
                  <h3 className="text-2xl font-light">{benefit.subtitle}</h3>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-5 space-y-6 order-1 lg:order-2">
            <h1 className="text-4xl md:text-6xl font-thin text-gray-900 leading-tight">
              {benefit.title}
            </h1>
            <p className="text-lg md:text-xl text-gray-600 font-light leading-relaxed">
              {benefit.description}
            </p>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-px bg-gray-300"></div>
              <span className="text-sm text-gray-400 font-light">0{index + 1}</span>
            </div>
          </div>
        </div>
      </div>,

      // Layout 2: Floating Card with Backdrop
      <div key={index} className="w-screen h-full relative flex items-center justify-center p-4 md:p-8 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="relative w-full max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="space-y-8 order-2 lg:order-1">
              <div className="space-y-4">
                <span className="inline-block px-4 py-2 bg-white rounded-full text-sm text-gray-600 shadow-sm">
                  {benefit.subtitle}
                </span>
                <h1 className="text-5xl md:text-7xl font-extralight text-gray-900 leading-none">
                  {benefit.title.split(' ')[0]}
                </h1>
                <h2 className="text-2xl md:text-3xl font-light text-gray-700">
                  {benefit.title.split(' ').slice(1).join(' ')}
                </h2>
              </div>
              <p className="text-lg text-gray-600 font-light leading-relaxed max-w-md">
                {benefit.description}
              </p>
            </div>
            <div className="relative order-1 lg:order-2">
              <div
                className="aspect-square rounded-2xl bg-cover bg-center shadow-xl transform rotate-3 hover:rotate-0 transition-transform duration-500"
                style={{ backgroundImage: `url(${benefit.image})` }}
              >
                <div className="w-full h-full rounded-2xl bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </div>,

      // Layout 3: Split Screen Minimal
      <div key={index} className="w-screen h-full relative bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
          <div className="flex items-center justify-center p-8 lg:p-16 order-2 lg:order-1">
            <div className="max-w-md space-y-8">
              <div className="space-y-2">
                <div className="w-8 h-px bg-gray-900"></div>
                <p className="text-xs uppercase tracking-widest text-gray-500">
                  {benefit.subtitle}
                </p>
              </div>
              <h1 className="text-4xl md:text-5xl font-thin text-gray-900 leading-tight">
                {benefit.title}
              </h1>
              <p className="text-gray-600 font-light leading-relaxed">
                {benefit.description}
              </p>
            </div>
          </div>
          <div className="relative p-8 flex items-center justify-center order-1 lg:order-2">
            <div
              className="w-full h-4/5 rounded-2xl bg-cover bg-center shadow-lg"
              style={{ backgroundImage: `url(${benefit.image})` }}
            >
              <div className="w-full h-full rounded-2xl bg-gradient-to-br from-transparent to-black/20"></div>
            </div>
          </div>
        </div>
      </div>,

      // Layout 4: Overlapping Elements
      <div key={index} className="w-screen h-full relative bg-white flex items-center justify-center p-4 md:p-8">
        <div className="relative w-full max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-6 z-10 relative order-2 lg:order-1">
              <h1 className="text-4xl md:text-6xl font-thin text-gray-900 leading-tight">
                {benefit.title}
              </h1>
              <p className="text-lg md:text-xl text-gray-500 font-light leading-relaxed">
                {benefit.description}
              </p>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                <span className="text-sm text-gray-400">{benefit.subtitle}</span>
              </div>
            </div>
            <div className="lg:col-span-7 relative order-1 lg:order-2">
              <div
                className="aspect-[3/2] rounded-3xl bg-cover bg-center shadow-2xl transform -rotate-2"
                style={{ backgroundImage: `url(${benefit.image})` }}
              >
                <div className="w-full h-full rounded-3xl bg-gradient-to-tr from-black/10 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </div>,

      // Layout 6: Magazine Style
      <div key={index} className="w-screen h-full relative bg-white flex items-center justify-center p-4 md:p-8">
        {isLast && (
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black via-black/70 to-transparent z-20"></div>
        )}
        
        <div className="relative w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-2 order-2 lg:order-1">
            <div 
              className="aspect-[16/10] rounded-2xl bg-cover bg-center shadow-2xl"
              style={{ backgroundImage: `url(${benefit.image})` }}
            >
              <div className="w-full h-full rounded-2xl bg-gradient-to-r from-black/40 via-transparent to-black/20 flex items-end p-8">
                <div className="text-white">
                  <h3 className="text-2xl md:text-3xl font-light mb-2">{benefit.subtitle}</h3>
                  <div className="w-16 h-px bg-white/60"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-8 order-1 lg:order-2">
            <h1 className="text-4xl md:text-5xl font-thin text-gray-900 leading-tight">
              {benefit.title}
            </h1>
            <p className="text-lg text-gray-500 font-light leading-relaxed">
              {benefit.description}
            </p>
            <div className="text-gray-500 text-sm">
              0{index + 1} / 0{benefits.length}
            </div>
          </div>
        </div>
      </div>,

      // Layout 5: Vertical Stack with Circle Image
      <div key={index} className="w-screen h-full relative bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4 md:p-8">
        <div className="text-center space-y-12 max-w-4xl mx-auto">
          <div 
            className="w-60 h-60 md:w-80 md:h-80 mx-auto rounded-full bg-cover bg-center shadow-xl"
            style={{ backgroundImage: `url(${benefit.image})` }}
          >
            <div className="w-full h-full rounded-full bg-gradient-to-b from-transparent to-black/20"></div>
          </div>
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-widest text-gray-500">
              {benefit.subtitle}
            </p>
            <h1 className="text-5xl md:text-7xl font-extralight text-gray-900 leading-none">
              {benefit.title}
            </h1>
            <p className="text-lg md:text-xl text-gray-600 font-light leading-relaxed max-w-2xl mx-auto">
              {benefit.description}
            </p>
          </div>
        </div>
      </div>


    ];

    return layouts[index % layouts.length];
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
            className="flex h-full will-change-transform"
            style={{
              transform: `translateX(-${scrollProgress * (benefits.length - 1) * 100}vw)`,
              width: `${benefits.length * 100}vw`,
              transition: 'none'
            }}
          >
            {benefits.map((benefit, index) => renderSection(benefit, index))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ThirdSection;