import { useEffect, useState, useRef } from "react";
import { ChevronRight, X } from "lucide-react";

function Proposition() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [, setLoadingComplete] = useState(false);
  const [firstSpread, setFirstSpread] = useState(false);
  const [secondSpread, setSecondSpread] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [hoveredContactHeader, setHoveredContactHeader] = useState(false);
  const [hoveredContactPhone, setHoveredContactPhone] = useState(false);

  const [hoveredService, setHoveredService] = useState<number | null>(null);
  const heroRef = useRef<HTMLDivElement | null>(null);
  const servicesRef = useRef<HTMLDivElement | null>(null);
  const [heroAnimationComplete, setHeroAnimationComplete] = useState(false);

  useEffect(() => {
    const loadingSteps = [
      { target: 15, delay: 300 },
      { target: 35, delay: 800 },
      { target: 67, delay: 400 },
      { target: 89, delay: 1000 },
      { target: 100, delay: 500 }
    ];
    let currentStep = 0;

    const simulateLoading = () => {
      if (currentStep >= loadingSteps.length) {
        setLoadingComplete(true);
        setFirstSpread(true);
        setTimeout(() => {
          setSecondSpread(true);
          setTimeout(() => {
            setHeroAnimationComplete(true);
          }, 90);
        }, 500);
        setTimeout(() => {
          setLoading(false);
        }, 1500);
        return;
      }

      const { target, delay } = loadingSteps[currentStep];
      setProgress(target);
      currentStep++;
      setTimeout(simulateLoading, delay);
    };

    simulateLoading();
  }, []);

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

  const navigateToLogin = () => {
    window.location.href = '/login';
  };

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
      {/* Contact Overlay */}
      <div className="fixed inset-0 z-[60] pointer-events-none">
        <div
          className={`fixed inset-x-0 top-0 bg-white h-1/2 transition-transform duration-700 ease-in-out ${showContact ? 'translate-y-0' : '-translate-y-full'}`}
          style={{ transformOrigin: 'top' }}
        />
        <div
          className={`fixed inset-x-0 bottom-0 bg-white h-1/2 transition-transform duration-700 ease-in-out ${showContact ? 'translate-y-0' : 'translate-y-full'}`}
          style={{ transformOrigin: 'bottom' }}
        />

        {/* Contact Content */}
        <div className={`fixed inset-0 flex items-center justify-center transition-all duration-500 pointer-events-auto ${showContact ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <button
            onClick={() => setShowContact(false)}
            className="absolute top-8 right-8 text-black hover:opacity-70 transition-opacity contact-text"
          >
            <span className="ml-2 text-sm tracking-wide flex items-center cursor-pointer">
              <X size={20} className="mr-1" />CLOSE
            </span>
          </button>

          <div className="max-w-4xl w-full mx-auto px-6">
            <div className="text-center mb-6">
              <span className="text-xs tracking-widest text-gray-400 contact-text opacity-0 fade-slide-up delay-1">FACEBOOK</span>
            </div>

            <div className="relative mb-20">
              <div 
                className={`absolute inset-0 bg-sky-400 transition-transform duration-300 ease-in-out rounded-2xl ${hoveredContactHeader ? 'scale-x-100' : 'scale-x-0'}`}
                style={{ transformOrigin: 'left' }}
              />
              <h2 
                className={`relative text-5xl md:text-6xl lg:text-7xl text-center contact-heading mb-4 transition-colors duration-300 cursor-pointer opacity-0 fade-slide-up delay-2`}
                onMouseEnter={() => setHoveredContactHeader(true)}
                onMouseLeave={() => setHoveredContactHeader(false)}
              >
                <span className={`transition-colors duration-300 ${hoveredContactHeader ? 'text-white' : 'text-gray-900'}`}>
                  CONTACT @ <span className={hoveredContactHeader ? 'text-white' : 'text-sky-400'}>HANDYGO</span>
                </span>
              </h2>
              
              <div 
                className={`absolute inset-0 top-[4.5rem] bg-sky-400 transition-transform duration-300 ease-in-out rounded-2xl ${hoveredContactPhone ? 'scale-x-100' : 'scale-x-0'}`}
                style={{ transformOrigin: 'left' }}
              />
              <h2 
                className={`relative text-4xl md:text-5xl lg:text-6xl text-center contact-heading mb-16 transition-colors duration-300 cursor-pointer opacity-0 fade-slide-up delay-3`}
                onMouseEnter={() => setHoveredContactPhone(true)}
                onMouseLeave={() => setHoveredContactPhone(false)}
              >
                <span className={`transition-colors duration-300 ${hoveredContactPhone ? 'text-white' : 'text-gray-900'}`}>
                  (+63) 96 057 2055
                </span>
              </h2>
            </div>

            <div className="space-y-8 contact-details">
              <div className="flex justify-between items-center border-b border-gray-100 pb-6 opacity-0 fade-slide-up delay-1">
                <div className="text-gray-500">KIMBERY CAÑON / PROJECT MANAGER</div>
                <div className="text-gray-900">KIMBERYCAÑON16@GMAIL.COM / (+63) 96 452 7563</div>
              </div>

              <div className="flex justify-between items-center border-b border-gray-100 pb-6 opacity-0 fade-slide-up delay-2">
                <div className="text-gray-500">KATHLEEN REPUNTE / DOCUMENTOR</div>
                <div className="text-gray-900">KATHREPUNTE44@GMAIL.COM / (+63) 95 222 4625</div>
              </div>

              <div className="flex justify-between items-center border-b border-gray-100 pb-6 opacity-0 fade-slide-up delay-3">
                <div className="text-gray-500">VINCE EDWARD MAÑACAP / DEVELOPER</div>
                <div className="text-gray-900">VINCEEDWARD480@GMAIL.COM / (+63) 96 245 2324</div>
              </div>

              <div className="flex justify-between items-center border-b border-gray-100 pb-6 opacity-0 fade-slide-up delay-4">
                <div className="text-gray-500">BART JAY JUAREZ / ANALYST</div>
                <div className="text-gray-900">BARTOLOMS122@GMAIL.COM / (+63) 96 057 2055</div>
              </div>

              <div className="flex justify-between items-center border-b border-gray-100 pb-6 opacity-0 fade-slide-up delay-5">
                <div className="text-gray-500">KYLE SELLOTE / DEVELOPER</div>
                <div className="text-gray-900">KYLEPARDILLO55@GMAIL.COM / (+63) 96 057 2055</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Animation */}
      {loading && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-white text-gray-800 z-40 overflow-hidden">
          <div className="w-full">
            <div className="relative w-full">
              <div className="w-full h-16 flex items-center justify-between px-8">
                <div className="text-gray-500 font-bold text-2xl">LOADING</div>
              </div>

              <div
                className="absolute top-0 left-0 h-16 bg-sky-500 flex items-center justify-between px-8 transition-all duration-300 ease-out overflow-hidden"
                style={{ width: `${progress}%` }}
              >
                <div className="text-white font-bold text-2xl whitespace-nowrap">LOADING</div>
                <div className="text-white font-bold text-2xl whitespace-nowrap">/{progress.toFixed(0)}</div>
              </div>
            </div>
          </div>

          <div
            className={`fixed inset-0 bg-sky-500 transition-all duration-1000 ease-in-out ${firstSpread ? 'scale-y-100' : 'scale-y-0'}`}
            style={{ transformOrigin: 'center' }}
          />

          <div
            className={`fixed inset-0 bg-white transition-all duration-1000 ease-in-out ${secondSpread ? 'scale-y-100' : 'scale-y-0'}`}
            style={{ transformOrigin: 'center' }}
          />
        </div>
      )}

      {/* Main Content */}
      <div className={`fixed inset-0 z-50 bg-black text-white transition-all duration-1000 overflow-y-auto ${heroAnimationComplete ? 'opacity-100 scale-100' : 'opacity-0 scale-150'}`}>
        {/* First Section - Hero */}
        <section
          ref={heroRef}
          className="relative min-h-screen bg-white bg-opacity-90 bg-[url('https://cdn.pixabay.com/photo/2021/02/03/00/10/receptionists-5975962_1280.jpg')] bg-fixed bg-cover bg-center bg-no-repeat overflow-hidden"
        >
          <div className="absolute inset-0 bg-black/50 bg-opacity-70 mix-blend-multiply"></div>

          <div className={`absolute top-100 left-4 text-[10px] font-mono text-sky-400 opacity-60 md:text-xs transition-all duration-1000 delay-300 ${heroAnimationComplete ? 'opacity-60 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            48°51'10.9"N
          </div>
          <div className={`absolute top-100 right-4 text-[10px] font-mono text-sky-400 opacity-60 md:text-xs transition-all duration-1000 delay-300 ${heroAnimationComplete ? 'opacity-60 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            2°23'25.2"E
          </div>

          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 md:px-12">
            <div className={`max-w-7xl mx-auto text-center transition-all duration-1000 ease-out ${heroAnimationComplete ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl leading-none">
                <div className={`transition-transform duration-1000 delay-100 ${heroAnimationComplete ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                  <span className="block">FULL PRODUCTION</span>
                </div>
                <div className={`transition-transform duration-1000 delay-300 ${heroAnimationComplete ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                  <span className="block"><span className="text-sky-400">SERVICES</span> BASED</span>
                </div>
                <div className={`transition-transform duration-1000 delay-500 ${heroAnimationComplete ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                  <span className="block">IN PHILIPPINES</span>
                </div>
              </h1>

              <div className={`mt-12 transition-all duration-1000 delay-700 ${heroAnimationComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <button
                  onClick={navigateToLogin}
                  className="group flex items-center space-x-3 mx-auto transition-all duration-300 hover:opacity-80"
                >
                  <span className="uppercase tracking-widest text-sm font-medium text-sky-400">Book now</span>
                </button>
              </div>
            </div>
          </div>

          <div className={`absolute bottom-8 left-0 right-0 hidden md:block transition-all duration-1000 delay-800 ${heroAnimationComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="container mx-auto px-8 flex justify-between items-center cursor-pointer">
              <div></div>
              <nav className="flex space-x-8 text-sm tracking-wider font-medium text-gray-400">
                <a href="#" className="hover:text-white transition-colors duration-300">Work</a>
                <button
                  onClick={scrollToServices}
                  className="hover:text-white transition-colors duration-300 cursor-pointer"
                >
                  Services
                </button>
                <a href="#" className="hover:text-white transition-colors duration-300">About</a>
                <button
                  onClick={() => setShowContact(true)}
                  className="hover:text-white transition-colors duration-300 cursor-pointer"
                >
                  Contact
                </button>
              </nav>
            </div>
          </div>

          <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 md:hidden transition-all duration-1000 delay-900 ${heroAnimationComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
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
                      <h2 className={`text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight transition-all duration-300 ${hoveredService === index ? 'text-white' : 'text-gray-700 opacity-60'}`}>
                        {service.name}
                      </h2>
                      <div className={`ml-4 transform transition-all duration-300 ${hoveredService === index ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                        <ChevronRight className={`w-6 h-6 ${hoveredService === index ? 'text-white' : 'text-gray-700'}`} />
                      </div>
                    </div>
                    <div className="relative overflow-hidden h-[120px] w-[200px]">
                      {hoveredService === index && (
                        <div className="absolute right-0 w-full">
                          {service.related.map((relatedService, idx) => (
                            <div
                              key={idx}
                              className="text-white text-base opacity-0 animate-slide-up"
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
                    className={`absolute inset-0 bg-gray-700 transition-transform duration-300 ease-in-out ${hoveredService === index ? 'translate-x-0' : '-translate-x-full'}`}
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

export default Proposition;