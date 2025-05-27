import { useEffect, useState, useRef } from "react";
import { ChevronRight } from "lucide-react";

function App() {
  // Loading screen state
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [, setLoadingComplete] = useState(false);
  const [firstSpread, setFirstSpread] = useState(false);
  const [secondSpread, setSecondSpread] = useState(false);

  // Main content state
  const [hoveredService, setHoveredService] = useState<number | null>(null);
  const heroRef = useRef<HTMLDivElement | null>(null);
  const servicesRef = useRef<HTMLDivElement | null>(null);
  const [heroAnimationComplete, setHeroAnimationComplete] = useState(false);

  // Loading animation effect
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setLoadingComplete(true);

          // Trigger spreads immediately after completion
          setFirstSpread(true);
          
          // Second spread shortly after
          setTimeout(() => {
            setSecondSpread(true);
            
            // Notify when second spread starts
            setTimeout(() => {
              setHeroAnimationComplete(true);
            }, 90);
          }, 500);

          // Hide loading screen
          setTimeout(() => {
            setLoading(false);
          }, 1500);

          return 100;
        }
        return prev + 0.5;
      });
    }, 30);

    return () => clearInterval(progressInterval);
  }, []);

  // Parallax scrolling effect
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.5;
        heroRef.current.style.backgroundPosition = `center ${rate}px`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToServices = () => {
    servicesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Services data
  const services = [
    {
      name: "PLUMBING",
      related: ["Pipe Installation", "Leak Repair", "Drain Cleaning", "More"]
    },
    {
      name: "HANDYMAN",
      related: ["Furniture Assembly", "Door Repair", "General Maintenance", "More"]
    },
    {
      name: "CLEANING",
      related: ["Deep Cleaning", "Window Washing", "Carpet Cleaning", "More"]
    },
    {
      name: "REPAIR",
      related: ["Appliance Repair", "Electronics Fix", "Furniture Repair", "More"]
    },
    {
      name: "RENOVATION",
      related: ["Kitchen Remodel", "Bathroom Update", "Room Addition", "More"]
    },
    {
      name: "PEST CONTROL",
      related: ["Termite Treatment", "Rodent Control", "Insect Removal", "More"]
    }
  ];

  return (
    <>
      {/* Loading Animation */}
      {loading && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-white text-gray-800 z-40 overflow-hidden">
          {/* Centered container with progress */}
          <div className="w-full">
            <div className="relative w-full">
              {/* Gray background container */}
              <div className="w-full h-16 flex items-center justify-between px-8">
                <div className="text-gray-500 font-bold text-2xl">LOADING</div>
              </div>
              
              {/* Overlay that grows with progress */}
              <div 
                className="absolute top-0 left-0 h-16 bg-sky-500 flex items-center justify-between px-8 transition-all duration-300 ease-out overflow-hidden"
                style={{ width: `${progress}%` }}
              >
                <div className="text-white font-bold text-2xl whitespace-nowrap">LOADING</div>
                <div className="text-white font-bold text-2xl whitespace-nowrap">/{progress.toFixed(0)}</div>
              </div>
            </div>
          </div>

          {/* First spread (black) */}
          <div
            className={`fixed inset-0 bg-sky-500 transition-all duration-1000 ease-in-out ${
              firstSpread ? 'scale-y-100' : 'scale-y-0'
            }`}
            style={{ transformOrigin: 'center' }}
          />

          {/* Second spread (white) */}
          <div
            className={`fixed inset-0 bg-white transition-all duration-1000 ease-in-out ${
              secondSpread ? 'scale-y-100' : 'scale-y-0'
            }`}
            style={{ transformOrigin: 'center' }}
          />
        </div>
      )}

      {/* Main Content */}
      <div className={`fixed inset-0 z-50 bg-black text-white transition-all duration-1000 overflow-y-auto ${
        heroAnimationComplete ? 'opacity-100 scale-100' : 'opacity-0 scale-150'
      }`}>
        {/* First Section - Hero */}
        <section
          ref={heroRef}
          className="relative min-h-screen bg-white bg-opacity-90 bg-[url('https://cdn.pixabay.com/photo/2021/02/03/00/10/receptionists-5975962_1280.jpg')] bg-fixed bg-cover bg-center bg-no-repeat overflow-hidden"
        >
          {/* Grain overlay */}
          <div className="absolute inset-0 bg-black/50 bg-opacity-70 mix-blend-multiply"></div>

          {/* Coordinates */}
          <div className={`absolute top-100 left-4 text-[10px] font-mono text-yellow-400 opacity-60 md:text-xs transition-all duration-1000 delay-300 ${
            heroAnimationComplete ? 'opacity-60 translate-x-0' : 'opacity-0 -translate-x-10'
          }`}>
            48°51'10.9"N
          </div>
          <div className={`absolute top-100 right-4 text-[10px] font-mono text-yellow-400 opacity-60 md:text-xs transition-all duration-1000 delay-300 ${
            heroAnimationComplete ? 'opacity-60 translate-x-0' : 'opacity-0 translate-x-10'
          }`}>
            2°23'25.2"E
          </div>

          {/* Main headline */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 md:px-12">
            <div className={`max-w-7xl mx-auto text-center transition-all duration-1000 ease-out ${
              heroAnimationComplete ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl leading-none">
                <div className={`transition-transform duration-1000 delay-100 ${
                  heroAnimationComplete ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
                }`}>
                  <span className="block">FULL PRODUCTION</span>
                </div>
                <div className={`transition-transform duration-1000 delay-300 ${
                  heroAnimationComplete ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
                }`}>
                  <span className="block"><span className="text-sky-500">SERVICES</span> BASED</span>
                </div>
                <div className={`transition-transform duration-1000 delay-500 ${
                  heroAnimationComplete ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
                }`}>
                  <span className="block">IN PHILIPPINES</span>
                </div>
              </h1>

              {/* Call to action button */}
              <div className={`mt-12 transition-all duration-1000 delay-700 ${
                heroAnimationComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}>
                <button 
                  onClick={scrollToServices}
                  className="group flex items-center space-x-3 mx-auto transition-all duration-300 hover:opacity-80"
                >
                  <span className="uppercase tracking-widest text-sm font-medium text-yellow-400">Book now</span>
                </button>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className={`absolute bottom-8 left-0 right-0 hidden md:block transition-all duration-1000 delay-800 ${
            heroAnimationComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="container mx-auto px-8 flex justify-between items-center">
              <div></div> {/* Empty div for flex spacing */}
              <nav className="flex space-x-8 text-sm uppercase tracking-wider font-medium text-gray-400">
                <a href="#" className="hover:text-white transition-colors duration-300">Work</a>
                <button 
                  onClick={scrollToServices}
                  className="hover:text-white transition-colors duration-300"
                >
                  Services
                </button>
                <a href="#" className="hover:text-white transition-colors duration-300">About</a>
                <a href="#" className="hover:text-white transition-colors duration-300">Contact</a>
              </nav>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 md:hidden transition-all duration-1000 delay-900 ${
            heroAnimationComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <button 
              onClick={scrollToServices}
              className="flex flex-col items-center animate-bounce"
            >
              <div className="w-1 h-12 bg-gradient-to-b from-transparent to-white opacity-30 rounded-full"></div>
            </button>
          </div>
        </section>

        {/* Second Section - Services */}
        <section 
          ref={servicesRef}
          className="relative min-h-screen bg-white py-16"
        >
          <div className="container mx-auto px-8 flex justify-between items-center mb-12">
            <div className="relative">
              <h3 className="uppercase text-sm tracking-widest text-sky-500 font-bold">OUR SERVICES</h3>
            </div>
          </div>

          {/* Services List */}
          <div className="container mx-auto px-8">
            <div className="flex flex-col space-y-6">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="group cursor-pointer relative overflow-hidden"
                  onMouseEnter={() => setHoveredService(index)}
                  onMouseLeave={() => setHoveredService(null)}
                >
                  <div className="flex items-center justify-between py-3 px-4 rounded-md relative z-10">
                    <div className="flex items-center">
                      <h2 className={`text-4xl md:text-7xl font-bold tracking-tight transition-all duration-300 ${
                        hoveredService === index ? 'text-white' : 'text-gray-700 opacity-60'
                      }`}>
                        {service.name}
                      </h2>
                      <div className={`ml-4 transform transition-all duration-300 ${
                        hoveredService === index ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                      }`}>
                        <ChevronRight className={`w-6 h-6 ${
                          hoveredService === index ? 'text-white' : 'text-gray-700'
                        }`} />
                      </div>
                    </div>
                    <div className="relative overflow-hidden h-[120px] w-[200px]">
                      {hoveredService === index && (
                        <div className="absolute right-0 w-full">
                          {service.related.map((relatedService, idx) => (
                            <div 
                              key={idx}
                              className="text-white text-lg opacity-0 animate-slide-up"
                              style={{ 
                                animationDelay: `${idx * 0.1}s`,
                                animationFillMode: 'forwards'
                              }}
                            >
                              {relatedService}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div 
                    className={`absolute inset-0 bg-gray-700 transition-transform duration-300 ease-in-out ${
                      hoveredService === index ? 'translate-x-0' : '-translate-x-full'
                    }`}
                  ></div>
                </div>
              ))}
            </div>
          </div>

          <div className="container mx-auto px-5 mt-16">
            <a
              href="#"
              className="inline-flex items-center group"
            >
              <span className="ml-4 uppercase text-sky-500 font-bold tracking-widest text-xs group-hover:underline">KNOW MORE</span>
            </a>
          </div>
        </section>
      </div>
    </>
  );
}

export default App;