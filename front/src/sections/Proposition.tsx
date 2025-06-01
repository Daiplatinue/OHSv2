import { useEffect, useState, useRef } from "react";
import { X } from "lucide-react";
import { Star, Shield, Zap, Heart, Users, DollarSign, BarChart, Briefcase } from 'lucide-react';

function Proposition() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [, setLoadingComplete] = useState(false);
  const [firstSpread, setFirstSpread] = useState(false);
  const [secondSpread, setSecondSpread] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [hoveredContactHeader, setHoveredContactHeader] = useState(false);
  const [hoveredContactPhone, setHoveredContactPhone] = useState(false);
  const [hoveredService, setHoveredService] = useState("");
  const [indicatorPosition, setIndicatorPosition] = useState(0);

  const heroRef = useRef<HTMLDivElement | null>(null);
  const servicesRef = useRef<HTMLDivElement | null>(null);
  const [heroAnimationComplete, setHeroAnimationComplete] = useState(false);

  const services = [
    { title: "PLUMBLING", section: "01", action: "DISCOVER" },
    { title: "HANDYMAN", section: "02", action: "EXPLORE" },
    { title: "LANDSCAPING", section: "03", action: "EXPERIENCE" },
    { title: "ROOFING", section: "04", action: "LEARN" },
    { title: "PEST CONTROL", section: "05", action: "JOIN" },
    { title: "CLEANING", section: "06", action: "VISIT" }
  ];

  const benefits = [
    {
      icon: Star,
      title: "Premium Quality",
      description: "Experience excellence with our top-tier service quality and attention to detail."
    },
    {
      icon: Shield,
      title: "Fully Insured",
      description: "Rest easy knowing all our services are backed by comprehensive insurance coverage."
    },
    {
      icon: Zap,
      title: "Fast Response",
      description: "Get quick assistance with our 24/7 rapid response team ready to help."
    },
    {
      icon: Heart,
      title: "Eco-Friendly",
      description: "Our sustainable practices and materials minimize environmental impact without compromising quality."
    },
    {
      icon: Users,
      title: "Expert Team",
      description: "Work with skilled professionals who bring years of specialized experience to every project."
    },
    {
      icon: DollarSign,
      title: "Cost Effective",
      description: "Get exceptional value with competitive pricing and transparent, no-surprise billing."
    },
    {
      icon: BarChart,
      title: "Data-Driven Results",
      description: "Benefit from our analytics-backed methodologies that deliver measurable improvements."
    },
    {
      icon: Briefcase,
      title: "Industry Compliance",
      description: "All services adhere to the latest industry standards and regulatory requirements for your peace of mind."
    }
  ];

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

  const handleServiceHover = (title: string, event: React.MouseEvent<HTMLDivElement>) => {
    const element = event.currentTarget;
    const rect = element.getBoundingClientRect();
    setHoveredService(title);
    setIndicatorPosition(rect.top - 90);
  };

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
          className="relative min-h-screen bg-white bg-opacity-90 bg-[url('https://cdn.pixabay.com/photo/2023/05/15/22/09/city-7996136_1280.jpg')] bg-fixed bg-cover bg-center bg-no-repeat overflow-hidden"
        >
          <div className="absolute inset-0 bg-black/60 bg-opacity-70 mix-blend-multiply"></div>

          <div className={`absolute top-100 left-4 text-[10px] font-mono text-yellow-500 opacity-60 md:text-xs transition-all duration-1000 delay-300 ${heroAnimationComplete ? 'opacity-60 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            48°51'10.9"N
          </div>
          <div className={`absolute top-100 right-4 text-[10px] font-mono text-yellow-500 opacity-60 md:text-xs transition-all duration-1000 delay-300 ${heroAnimationComplete ? 'opacity-60 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            2°23'25.2"E
          </div>

          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 md:px-12">
            <div className={`max-w-7xl mx-auto text-center transition-all duration-1000 ease-out ${heroAnimationComplete ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl leading-none text-gray-300">
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
                  <span className="uppercase tracking-widest text-sm font-medium text-yellow-500">Book now</span>
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


        {/* Second Section - Who We Are */}
        <section className="relative min-h-screen bg-white text-gray-600 py-16 px-8 md:px-16 lg:px-20">
          <div className="max-w-7xl mx-auto mt-15">
            <div className="pb-8">
              <h2 className="text-[12px] font-medium tracking-[0.2em] uppercase">WHO WE ARE</h2>
            </div>

            <div className="">
              <div className="pr-0 md:pr-8">
                <div className="space-y-6">
                  <h1 className="text-[42px] sm:text-[52px] md:text-[62px] lg:text-[72px] font-bold tracking-[-0.02em] leading-[0.95] uppercase">
                    WELCOME TO THE
                    GREATEST CITY
                    IN THE WORLD
                    FEEL AT HOME
                    IN PARIS
                  </h1>

                  <div className="space-y-6 mt-16 ml-40 flex">
                    <div>
                      <p className="text-[13px] tracking-[0.02em] leading-[1.6] uppercase">
                        NESTLED IN THE HEART OF PARIS, WE ARE A DEDICATED<br />
                        PRODUCTION SERVICES COMPANY COMMITTED TO<br />
                        CRAFTING STUNNING VISUAL EXPERIENCES FOR CLIENTS<br />
                        FROM AROUND THE GLOBE.
                      </p>

                      <p className="text-[13px] tracking-[0.02em] leading-[1.6] uppercase mt-6">
                        REGARDLESS THE SCALE OF YOUR PROJECT, FROM AN<br />
                        AGILE SHOOT IN THE STREETS OF PARIS TO COMPLEX<br />
                        CAMPAIGNS MIXING REAL LOCATIONS AND STUDIO WORK,<br />
                        WE'RE HERE TO MAKE THINGS EASY FOR YOU.<br />
                        WE'LL GET IT DONE SMOOTHLY AND COST-EFFECTIVELY.
                      </p>

                      <p className="text-[13px] tracking-[0.02em] leading-[1.6] uppercase mt-6">
                        KIMBERLY BARON CAÑON AS PROJECT MANAGER<br />
                        KATHLEEN REPUNTE AS DOCUMTENTOR<br />
                        VINCE EDWARD CAÑEDO MAÑACAP AS DEVELOPER<br />
                        KYLE SELLOTE AS DEVELOPER<br />
                        BART JUAREZ AS SYSTEM ANALYST
                      </p>
                    </div>
                    <div className="flex bg-amber-300 ml-60">
                      <img
                        src="https://images.pexels.com/photos/3214995/pexels-photo-3214995.jpeg"
                        alt="Grand Palais interior in Paris"
                        className="w-[400px] h-[400px] object-cover"
                      />
                    </div>
                  </div>

                  <div className="mt-16 flex items-center">
                    <button className="flex items-center text-[12px] font-medium tracking-[0.2em] uppercase hover:text-sky-500 transition-colors duration-300">
                      SEE MORE
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* Third Section - Benefits */}
        <section>
          <div className="w-full py-24 px-8 bg-white">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <span className="text-sky-500 text-sm font-semibold tracking-wide">BENEFITS</span>
                <h2 className="mt-4 text-4xl font-semibold text-gray-700">
                  Why Choose Our Services
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="group p-6 rounded-3xl bg-[#FBFBFD] hover:bg-sky-50 transition-all duration-300">
                    <div className="w-12 h-12 rounded-2xl bg-sky-100 flex items-center justify-center mb-6 group-hover:bg-sky-200 transition-colors duration-300">
                      <benefit.icon className="w-6 h-6 text-sky-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>


        {/* Fourth Section - Services */}
        <section
          ref={servicesRef}
          className="relative min-h-screen bg-white flex flex-col p-8 lg:p-16"
        >
          <div className="text-gray-700 font-medium tracking-wider text-sm md:text-base">
            OUR <span className="text-sky-400 text-2xl">SERVICES</span>
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
                  <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-8xl font-bold leading-12 cursor-pointer tracking-tight text-gray-500/70 transition-all duration-300 ease-in-out transform group-hover:text-sky-400 group-hover:translate-x-4">
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

      </div>
    </>
  );
}

export default Proposition;