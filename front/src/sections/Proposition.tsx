import { useEffect, useState, useRef } from "react";
import { X, Blend } from 'lucide-react';
import { aboutHandyGo } from '../sections/propositionData';

import SecondSection from '../sections/Proposition_Sections/SecondSection';
import ThirdSection from '../sections/Proposition_Sections/ThirdSection';
import FourthSection from '../sections/Proposition_Sections/FourthSection';
import SixthSection from '../sections/Proposition_Sections/SixthSection';
import SeventhSection from '../sections/Proposition_Sections/SeventhSection';
import EighthSection from '../sections/Proposition_Sections/EightSection';
import NinthSection from '../sections/Proposition_Sections/NinethSection';
import TenthSection from '../sections/Proposition_Sections/TenthSection';

import img1 from '../assets/proposition/Aerial View of Lush Green Waterways.jpeg';
import img2 from '../assets/proposition/Airplane Wing at Sunset.jpeg';
import img3 from '../assets/proposition/Cheerful Man in Maroon Turtleneck.jpeg';
import img4 from '../assets/proposition/Close-Up Dewy Face.jpeg';
import img5 from '../assets/proposition/Contemplative Portrait (1).jpeg';

function Proposition() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [, setLoadingComplete] = useState(false);
  const [firstSpread, setFirstSpread] = useState(false);
  const [secondSpread, setSecondSpread] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [hoveredContactHeader, setHoveredContactHeader] = useState(false);
  const [hoveredContactPhone, setHoveredContactPhone] = useState(false);
  const [currentAboutSection, setCurrentAboutSection] = useState(0);
  const [hoveredTeamMember, setHoveredTeamMember] = useState("");
  const [imageTransitioning, setImageTransitioning] = useState(false);

  // New states for floating indicator
  const [showFloatingIndicator, setShowFloatingIndicator] = useState(false);
  const [showSpeechBubble, setShowSpeechBubble] = useState(false);
  const [isFloatingIndicatorIdle, setIsFloatingIndicatorIdle] = useState(false);
  const [showNavigationCloud, setShowNavigationCloud] = useState(false);
  const [isClosingCloud, setIsClosingCloud] = useState(false);

  const heroRef = useRef<HTMLDivElement | null>(null);
  const aboutSectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [heroAnimationComplete, setHeroAnimationComplete] = useState(false);

  const teamMemberImages = {
    "KIMBERLY BARON CAÑON AS PROJECT MANAGER": img1,
    "KATHLEEN REPUNTE AS DOCUMTENTOR": img2,
    "VINCE EDWARD CAÑEDO MAÑACAP AS DEVELOPER": img3,
    "KYLE SELLOTE AS DEVELOPER": img4,
    "BART JUAREZ AS SYSTEM ANALYST": img5
  };

  const defaultImage = "https://images.pexels.com/photos/3214995/pexels-photo-3214995.jpeg";

  // Navigation sections for the cloud
  const navigationSections = [
    { name: "Home", target: "hero-sections" },
    { name: "Who Are We", target: "who-we-are" },
    { name: "Benefits", target: "benefits" },
    { name: "Reviews", target: "reviews" },
    { name: "About HG", target: "about-handygo" },
    { name: "Sponsors", target: "sponsors" },
    { name: "Features", target: "features" },
    { name: "Services", target: "services" },
    { name: "How To Join", target: "join" },
    { name: "Get Started", target: "get-started" }
  ];

  // Floating Indicator Timer Effect
  useEffect(() => {
    if (!loading && heroAnimationComplete) {
      const timer = setTimeout(() => {
        setShowFloatingIndicator(true);

        // Show speech bubble for 10 seconds initially
        setShowSpeechBubble(true);
        setTimeout(() => {
          setShowSpeechBubble(false);
          // Set opacity to 50% after 10 seconds of being idle
          setIsFloatingIndicatorIdle(true);
        }, 5000);
      }, 1000); // Show indicator after 5 second

      return () => clearTimeout(timer);
    }
  }, [loading, heroAnimationComplete]);

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

  const [textAnimating, setTextAnimating] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.5;
        heroRef.current.style.backgroundPosition = `center ${rate}px`;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const index = aboutSectionRefs.current.findIndex(
                (ref) => ref === entry.target
              );
              if (index !== -1 && currentAboutSection !== index) {
                setTextAnimating(true);
                setTimeout(() => {
                  setCurrentAboutSection(index);
                  setTimeout(() => {
                    setTextAnimating(false);
                  }, 400);
                }, 200);
              }
            }
          });
        },
        {
          root: null,
          rootMargin: '-20% 0px -20% 0px',
          threshold: [0.2, 0.5, 0.8]
        }
      );

      aboutSectionRefs.current.forEach((ref) => {
        if (ref) {
          observer.observe(ref);
        }
      });

      return () => {
        aboutSectionRefs.current.forEach((ref) => {
          if (ref) {
            observer.unobserve(ref);
          }
        });
      };
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentAboutSection]);

  const scrollToSection = (sectionName: string) => {
    if (sectionName === "hero") {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (sectionName === "contact") {
      setShowContact(true);
    } else {
      const section = document.querySelector(`[data-section="${sectionName}"]`) ||
        document.querySelector(`section:nth-of-type(${getSectionIndex(sectionName)})`);
      section?.scrollIntoView({ behavior: 'smooth' });
    }

    // Start closing animation
    setIsClosingCloud(true);
    setTimeout(() => {
      setShowNavigationCloud(false);
      setIsClosingCloud(false);
    }, 500); // Adjusted timing for fade animation
  };

  const getSectionIndex = (sectionName: string) => {
    const sectionMap: { [key: string]: number } = {
      "who-we-are": 2,
      "benefits": 3,
      "reviews": 4,
      "about-handygo": 5,
      "sponsors": 6,
      "features": 7,
      "services": 8,
      "join": 9
    };
    return sectionMap[sectionName] || 1;
  };

  const scrollToServices = () => {
    const servicesSection = document.querySelector('[data-section="services"]');
    servicesSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const navigateToLogin = () => {
    window.location.href = '/login';
  };

  const handleTeamMemberHover = (memberName: string) => {
    if (memberName !== hoveredTeamMember) {
      setImageTransitioning(true);
      setTimeout(() => {
        setHoveredTeamMember(memberName);
        setTimeout(() => {
          setImageTransitioning(false);
        }, 300);
      }, 200);
    }
  };

  const handleTeamMemberLeave = () => {
    setImageTransitioning(true);
    setTimeout(() => {
      setHoveredTeamMember("");
      setTimeout(() => {
        setImageTransitioning(false);
      }, 300);
    }, 200);
  };

  const getCurrentImage = () => {
    if (hoveredTeamMember && teamMemberImages[hoveredTeamMember as keyof typeof teamMemberImages]) {
      return teamMemberImages[hoveredTeamMember as keyof typeof teamMemberImages];
    }
    return defaultImage;
  };

  const handleFloatingIndicatorClick = () => {
    setShowSpeechBubble(false);
    if (showNavigationCloud) {
      // Start closing animation
      setIsClosingCloud(true);
      setTimeout(() => {
        setShowNavigationCloud(false);
        setIsClosingCloud(false);
      }, 500); // Adjusted timing for fade animation
    } else {
      setShowNavigationCloud(true);
      setIsClosingCloud(false);
    }
  };

  const handleCloseNavigationCloud = () => {
    setIsClosingCloud(true);
    setTimeout(() => {
      setShowNavigationCloud(false);
      setIsClosingCloud(false);
    }, 500); // Adjusted timing for fade animation
  };

  const handleFloatingIndicatorHover = () => {
    setShowSpeechBubble(true);
    setIsFloatingIndicatorIdle(false); // Reset idle state on hover
  };

  const handleFloatingIndicatorLeave = () => {
    if (!showNavigationCloud) {
      setShowSpeechBubble(false);
    }
  };

  return (
    <>

      {/* Navigation Cloud */}
      <div className={`fixed inset-0 z-[80] transition-all duration-500 ease-out font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,sans-serif] ${showNavigationCloud
        ? 'opacity-100 backdrop-blur-sm'
        : 'opacity-0 pointer-events-none'
        }`}>
        <div className="absolute inset-0 bg-black/20" onClick={handleCloseNavigationCloud}></div>

        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]">
          <div className="relative w-full h-full">
            {/* Navigation Items in Circular Formation */}
            {navigationSections.map((section, index) => {
              const angle = (index * 360) / navigationSections.length;
              const radius = 220; // Radius for spacing
              const x = Math.cos((angle * Math.PI) / 180) * radius;
              const y = Math.sin((angle * Math.PI) / 180) * radius;

              // Simple staggered fade animation
              const fadeDelay = isClosingCloud
                ? (navigationSections.length - 1 - index) * 50 // Reverse order for closing
                : index * 50; // Normal order for opening

              return (
                <button
                  key={section.name}
                  onClick={() => scrollToSection(section.target)}
                  className={`absolute bg-white hover:bg-sky-500 text-gray-700 hover:text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-gray-200 group w-32 ${showNavigationCloud && !isClosingCloud
                    ? 'fade-in'
                    : isClosingCloud
                      ? 'fade-out'
                      : 'opacity-0'
                    }`}
                  style={{
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% + ${y}px)`,
                    transform: 'translate(-50%, -50%)',
                    animationDelay: `${fadeDelay}ms`
                  }}
                >
                  <div className="flex items-center justify-center">
                    <span className="text-sm font-extralight text-center truncate">{section.name}</span>
                  </div>
                </button>
              );
            })}

            {/* Center Close Button */}
            <button
              onClick={handleCloseNavigationCloud}
              className={`absolute bg-sky-500 hover:bg-sky-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 ${showNavigationCloud && !isClosingCloud
                ? 'fade-in'
                : isClosingCloud
                  ? 'fade-out'
                  : 'opacity-0'
                }`}
              style={{
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                animationDelay: `${isClosingCloud ? '0ms' : navigationSections.length * 50}ms` // Center button appears last when opening, first when closing
              }}
            >
              <X size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Floating Indicator */}
      <div className={`fixed bottom-8 right-8 z-[70] transition-all duration-700 ease-out font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,sans-serif] ${showFloatingIndicator
        ? 'opacity-100 translate-y-0 scale-100'
        : 'opacity-0 translate-y-10 scale-75 pointer-events-none'
        }`}>
        {/* Speech Bubble */}
        <div className={`absolute bottom-full right-0 mb-4 transition-all duration-500 ease-out ${showSpeechBubble
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
          }`}>
          <div className="relative bg-white px-4 py-3 rounded-xl shadow-lg border border-gray-200 whitespace-nowrap">
            <div className="text-sm font-medium text-gray-700">
              Click me for easy navigation
            </div>
            {/* Speech bubble arrow */}
            <div className="absolute top-full right-6 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white"></div>
            <div className="absolute top-full right-6 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-gray-200 transform translate-y-px"></div>
          </div>
        </div>

        {/* Floating Button */}
        <button
          onClick={handleFloatingIndicatorClick}
          onMouseEnter={handleFloatingIndicatorHover}
          onMouseLeave={handleFloatingIndicatorLeave}
          className={`bg-sky-400 text-white p-3 rounded-full shadow-lg hover:bg-sky-500 cursor-pointer transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-75 hover:scale-110 active:scale-95 ${isFloatingIndicatorIdle ? 'opacity-50 hover:opacity-100' : 'opacity-100'
            }`}
          aria-label="Navigate faster"
        >
          <Blend size={20} />
        </button>
      </div>

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
            <span className="ml-2 text-sm tracking-wide flex items-center cursor-pointer ">
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
                <span className={`transition-colors duration-300 font-extralight font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,sans-serif] ${hoveredContactHeader ? 'text-white' : 'text-gray-700'}`}>
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
                <span className={`transition-colors duration-300 font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,sans-serif] font-extralight ${hoveredContactPhone ? 'text-white' : 'text-gray-700'}`}>
                  (+63) 96 057 2055
                </span>
              </h2>
            </div>

            <div className="space-y-8 contact-details">
              <div className="flex justify-between items-center border-b border-gray-100 pb-6 opacity-0 fade-slide-up delay-1  font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,sans-serif]">
                <div className="text-gray-500">KIMBERY CAÑON / PROJECT MANAGER</div>
                <div className="text-gray-900">KIMBERYCAÑON16@GMAIL.COM / (+63) 96 452 7563</div>
              </div>

              <div className="flex justify-between items-center border-b border-gray-100 pb-6 opacity-0 fade-slide-up delay-2 font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,sans-serif]">
                <div className="text-gray-500">KATHLEEN REPUNTE / DOCUMENTOR</div>
                <div className="text-gray-900">KATHREPUNTE44@GMAIL.COM / (+63) 95 222 4625</div>
              </div>

              <div className="flex justify-between items-center border-b border-gray-100 pb-6 opacity-0 fade-slide-up delay-3 font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,sans-serif]">
                <div className="text-gray-500">VINCE EDWARD MAÑACAP / DEVELOPER</div>
                <div className="text-gray-900">VINCEEDWARD480@GMAIL.COM / (+63) 96 245 2324</div>
              </div>

              <div className="flex justify-between items-center border-b border-gray-100 pb-6 opacity-0 fade-slide-up delay-4 font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,sans-serif]">
                <div className="text-gray-500">BART JAY JUAREZ / ANALYST</div>
                <div className="text-gray-900">BARTOLOMS122@GMAIL.COM / (+63) 96 057 2055</div>
              </div>

              <div className="flex justify-between items-center border-b border-gray-100 pb-6 opacity-0 fade-slide-up delay-5 font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,sans-serif]">
                <div className="text-gray-500">KYLE SELLOTE / DEVELOPER</div>
                <div className="text-gray-900">KYLEPARDILLO55@GMAIL.COM / (+63) 96 057 2055</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Animation */}
      {loading && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-white text-gray-800 z-40 overflow-hidden font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,sans-serif]">
          <div className="w-full">
            <div className="relative w-full">
              <div className="w-full h-16 flex items-center justify-between px-8">
                <div className="text-gray-500 font-extralight text-2xl">LOADING</div>
              </div>

              <div
                className="absolute top-0 left-0 h-16 bg-sky-500 flex items-center justify-between px-8 transition-all duration-300 ease-out overflow-hidden"
                style={{ width: `${progress}%` }}
              >
                <div className="text-white font-extralight text-2xl whitespace-nowrap">LOADING</div>
                <div className="text-white font-extralight text-2xl whitespace-nowrap">/{progress.toFixed(0)}</div>
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
      <div className={`fixed inset-0 z-50 bg-black text-white transition-all duration-1000 overflow-y-auto font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,sans-serif] ${heroAnimationComplete ? 'opacity-100 scale-100' : 'opacity-0 scale-150'}`}>

        {/* First Section - Hero */}
        <section
          ref={heroRef}
          data-section="hero-section"
          className="relative min-h-screen bg-white bg-opacity-90 bg-[url('https://cdn.pixabay.com/photo/2021/02/03/00/10/receptionists-5975962_1280.jpg')] bg-fixed bg-cover bg-center bg-no-repeat overflow-hidden"
        >
          <div className="absolute inset-0 bg-black/50 bg-opacity-70 mix-blend-multiply"></div>

          <div className={`absolute top-100 left-4 text-[10px] font-mono text-yellow-500 opacity-60 md:text-xs transition-all duration-1000 delay-300 ${heroAnimationComplete ? 'opacity-60 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            14°35'46.0"N
          </div>
          <div className={`absolute top-100 right-4 text-[10px] font-mono text-yellow-500 opacity-60 md:text-xs transition-all duration-1000 delay-300 ${heroAnimationComplete ? 'opacity-60 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            121°01'15.0"E
          </div>

          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 md:px-12">
            <div className={`max-w-7xl mx-auto text-center transition-all duration-1000 ease-out ${heroAnimationComplete ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl leading-none text-gray-300">
                <div className={`transition-transform duration-1000 delay-100 ${heroAnimationComplete ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                  <span className="block text-gray-300 font-medium">FULL PRODUCTION</span>
                </div>
                <div className={`transition-transform duration-1000 delay-300 ${heroAnimationComplete ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                  <span className="block text-gray-300 font-medium"><span className="text-sky-400">SERVICES</span> BASED</span>
                </div>
                <div className={`transition-transform duration-1000 delay-500 ${heroAnimationComplete ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                  <span className="block text-gray-300 font-medium">IN PHILIPPINES</span>
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
        <SecondSection
          hoveredTeamMember={hoveredTeamMember}
          handleTeamMemberHover={handleTeamMemberHover}
          handleTeamMemberLeave={handleTeamMemberLeave}
          getCurrentImage={getCurrentImage}
          imageTransitioning={imageTransitioning}
        />

        {/* Third Section - Benefits */}
        <div data-section="benefits">
          <ThirdSection />
        </div>

        {/* Fourth Section - Reviews & Tweets */}
        <FourthSection />

        {/* Fifth Section - About HandyGo */}
        <section data-section="about-handygo" className={`relative min-h-screen transition-colors duration-700 ease-in-out ${aboutHandyGo[currentAboutSection].bgColor}`}>
          <div className="max-w-7xl mx-auto px-6 py-24">
            <div className="grid grid-cols-12 gap-8">
              {/* Left Side - Dynamic Typography with Enhanced Blur Animation */}
              <div className="col-span-5 sticky top-60 h-fit mr-10 ml-[-2rem]">
                <div className="space-y-5 overflow-hidden">
                  <span
                    className={`text-sm font-medium tracking-wide uppercase transition-all duration-700 ease-out block ${textAnimating ? 'blur-lg opacity-0 transform translate-y-4' : 'blur-0 opacity-100 transform translate-y-0'
                      } ${aboutHandyGo[currentAboutSection].accentColor}`}
                  >
                    About HandyGo
                  </span>
                  <h2
                    className={`text-4xl font-medium text-gray-600 leading-tight transition-all duration-700 ease-out block ${textAnimating ? 'blur-lg opacity-0 transform translate-y-6' : 'blur-0 opacity-100 transform translate-y-0'
                      }`}
                  >
                    {aboutHandyGo[currentAboutSection].title}
                  </h2>
                  <div
                    className={`text-xl font-medium transition-all duration-700 ease-out block ${textAnimating ? 'blur-lg opacity-0 transform translate-y-8' : 'blur-0 opacity-100 transform translate-y-0'
                      } ${aboutHandyGo[currentAboutSection].accentColor}`}
                  >
                    {aboutHandyGo[currentAboutSection].subtitle}
                  </div>
                  <p
                    className={`text-lg text-gray-600 transition-all duration-700 ease-out block ${textAnimating ? 'blur-lg opacity-0 transform translate-y-10' : 'blur-0 opacity-100 transform translate-y-0'
                      }`}
                  >
                    {aboutHandyGo[currentAboutSection].description}
                  </p>
                </div>
              </div>

              {/* Right Side - Scrolling Images */}
              <div className="col-span-7 space-y-[20vh]">
                {aboutHandyGo.map((item, index) => (
                  <div
                    key={item.id}
                    ref={el => { aboutSectionRefs.current[index] = el; }}
                    className="relative h-screen flex items-center"
                  >
                    <div
                      className={`w-full bg-white rounded-2xl shadow-lg transition-all duration-700 ease-out hover:shadow-xl overflow-hidden transform ${index === currentAboutSection
                        ? 'scale-100 opacity-100'
                        : 'scale-95 opacity-50'
                        }`}
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-[600px] object-cover transition-transform duration-700 hover:scale-105"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Sixth Section - Sponsors */}
        <div data-section="sponsors">
          <SixthSection />
        </div>

        {/* Seventh Section - System Features */}
        <div data-section="features">
          <SeventhSection />
        </div>

        {/* Eighth Section - Services */}
        <div data-section="services">
          <EighthSection />
        </div>

        {/* Ninth Section - Join Now */}
        <div data-section="join">
          <NinthSection />
        </div>

        {/* Tenth Section - Call to Action */}
        <div data-section="get-started">
          <TenthSection navigateToLogin={navigateToLogin} />
        </div>

      </div>

      <style>{`
        @keyframes fade-in {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
        
        @keyframes fade-out {
          0% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
        
        .fade-in {
          animation: fade-in 0.4s ease-out forwards;
        }
        
        .fade-out {
          animation: fade-out 0.4s ease-out forwards;
        }
        
        .contact-text {
          animation: fadeSlideUp 0.8s ease-out forwards;
        }
        
        .contact-heading {
          animation: fadeSlideUp 1s ease-out forwards;
        }
        
        .contact-details {
          animation: fadeSlideUp 1.2s ease-out forwards;
        }
        
        .fade-slide-up {
          animation: fadeSlideUp 0.8s ease-out forwards;
        }
        
        .delay-1 {
          animation-delay: 0.2s;
        }
        
        .delay-2 {
          animation-delay: 0.4s;
        }
        
        .delay-3 {
          animation-delay: 0.6s;
        }
        
        .delay-4 {
          animation-delay: 0.8s;
        }
        
        .delay-5 {
          animation-delay: 1s;
        }
        
        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}

export default Proposition;