import { useEffect, useState, useRef } from "react";
import { X, Twitter, MessageCircle, Repeat, Share, Heart } from 'lucide-react';
import { tweets, aboutHandyGo } from '../sections/propositionData';

import ThirdSection from '../sections/Proposition_Sections/ThirdSection';
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
                  <h1 className="text-[42px] sm:text-[52px] md:text-[62px] lg:text-[72px] font-semibold tracking-[-0.02em] leading-[0.95] uppercase">
                    WELCOME TO THE
                    GREATEST ONLINE
                    <br /><span className="text-sky-500">HOME SERVICE </span>
                    PLATFORM
                  </h1>

                  <div className="space-y-6 mt-16 ml-40 flex text-justify">
                    <div>
                      <p className="text-[13px] tracking-[0.02em] leading-[1.6] uppercase w-[25rem]">
                        Handy Go was born out of a simple idea to make
                        home services easier. During a time when many struggled to
                        find a more reliable help for repairs, cleaning, and
                        maintenance, we saw the need for a trusted platform
                        that connects skilled professionals with homeowners.
                      </p>

                      <p className="text-[13px] tracking-[0.02em] leading-[1.6] uppercase mt-6 w-[25rem]">
                        What started as a small initiative has grown into a full-service online home solution. Whether it’s a quick repair or a complex project, Handy Go is here to deliver smooth, affordable, and dependable service right when you need it most.
                      </p>

                      <p className="text-[13px] tracking-[0.02em] leading-[1.6] uppercase mt-6 w-[25rem]">
                        HANDY GO WAS DEVELOPED BY A DEDICATED TEAM OF FIVE MEMBERS:{" "}
                        <span
                          className="cursor-pointer hover:text-sky-600 transition-colors duration-300 text-sky-500"
                          onMouseEnter={() => handleTeamMemberHover("KIMBERLY BARON CAÑON AS PROJECT MANAGER")}
                          onMouseLeave={handleTeamMemberLeave}
                        >
                          KIMBERLY BARON CAÑON AS PROJECT MANAGER
                        </span>,{" "}
                        <span
                          className="cursor-pointer hover:text-sky-600 transition-colors duration-300 text-sky-500"
                          onMouseEnter={() => handleTeamMemberHover("KATHLEEN REPUNTE AS DOCUMENTOR")}
                          onMouseLeave={handleTeamMemberLeave}
                        >
                          KATHLEEN REPUNTE AS DOCUMENTOR
                        </span>,{" "}
                        <span
                          className="cursor-pointer hover:text-sky-600 transition-colors duration-300 text-sky-500"
                          onMouseEnter={() => handleTeamMemberHover("VINCE EDWARD CAÑEDO MAÑACAP AS DEVELOPER")}
                          onMouseLeave={handleTeamMemberLeave}
                        >
                          VINCE EDWARD CAÑEDO MAÑACAP AS DEVELOPER
                        </span>,{" "}
                        <span
                          className="cursor-pointer hover:text-sky-600 transition-colors duration-300 text-sky-500"
                          onMouseEnter={() => handleTeamMemberHover("KYLE SELLOTE AS DEVELOPER")}
                          onMouseLeave={handleTeamMemberLeave}
                        >
                          KYLE SELLOTE AS DEVELOPER
                        </span>, AND{" "}
                        <span
                          className="cursor-pointer hover:text-sky-600 transition-colors duration-300 text-sky-500"
                          onMouseEnter={() => handleTeamMemberHover("BART JUAREZ AS SYSTEM ANALYST")}
                          onMouseLeave={handleTeamMemberLeave}
                        >
                          BART JUAREZ AS SYSTEM ANALYST.
                        </span>
                      </p>

                    </div>
                    <div className="flex bg-sky-300 ml-60 relative overflow-hidden">
                      {/* Cascading Wipe Animation Overlays */}
                      <div className={`absolute inset-0 bg-sky-300 z-10 transition-transform duration-500 ease-out ${imageTransitioning ? 'translate-x-0' : 'translate-x-full'}`} style={{ transformOrigin: 'left' }}></div>
                      <div className={`absolute inset-0 bg-sky-400 z-20 transition-transform duration-400 ease-out delay-100 ${imageTransitioning ? 'translate-x-0' : 'translate-x-full'}`} style={{ transformOrigin: 'left' }}></div>
                      <div className={`absolute inset-0 bg-sky-500 z-30 transition-transform duration-300 ease-out delay-200 ${imageTransitioning ? 'translate-x-0' : 'translate-x-full'}`} style={{ transformOrigin: 'left' }}></div>

                      <img
                        src={getCurrentImage()}
                        alt="Team member"
                        className={`w-[400px] h-[400px] object-cover transition-all duration-700 ease-in-out transform ${hoveredTeamMember ? 'brightness-1.1 contrast-1.05 scale-102' : 'brightness-1 contrast-1 scale-100'} ${imageTransitioning ? 'opacity-0' : 'opacity-100'}`}
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
        <ThirdSection />

        {/* Fourth Section - Reviews & Tweets */}
        <section className="bg-white min-h-screen relative py-24">
          <div className="max-w-7xl mx-auto px-6 relative">
            {/* Tweet Cards */}
            <div className="grid grid-cols-3 gap-8 mb-16">
              {/* Left Tweet */}
              <div className="transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden max-w-sm">
                  <div className="p-4">
                    <div className="flex items-center">
                      <img
                        src={tweets[0].avatar}
                        alt={tweets[0].name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="ml-3 flex-1">
                        <div className="flex items-center">
                          <span className="font-bold text-gray-900 text-sm">{tweets[0].name}</span>
                          {tweets[0].verified && (
                            <svg className="w-4 h-4 ml-1 text-sky-500" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
                            </svg>
                          )}
                          <span className="ml-1 text-gray-500 text-sm">{tweets[0].handle}</span>
                        </div>
                      </div>
                      <Twitter className="w-5 h-5 text-gray-400" />
                    </div>
                    <p className="mt-3 text-gray-800 text-sm leading-relaxed">
                      {tweets[0].content}
                    </p>
                    <img
                      src={tweets[0].image}
                      alt="Tweet attachment"
                      className="mt-3 rounded-xl w-full h-48 object-cover"
                    />
                    <div className="mt-3 flex items-center justify-between text-gray-500 text-xs">
                      <button className="flex items-center hover:text-sky-500 transition-colors">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        <span>{tweets[0].stats.comments}</span>
                      </button>
                      <button className="flex items-center hover:text-green-500 transition-colors">
                        <Repeat className="w-4 h-4 mr-1" />
                        <span>{tweets[0].stats.retweets}</span>
                      </button>
                      <button className="flex items-center hover:text-red-500 transition-colors">
                        <Heart className="w-4 h-4 mr-1" />
                        <span>{tweets[0].stats.likes}</span>
                      </button>
                      <button className="flex items-center hover:text-sky-500 transition-colors">
                        <Share className="w-4 h-4 mr-1" />
                        <span>{tweets[0].stats.views}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Center Tweet */}
              <div className="transform translate-y-12 hover:translate-y-10 transition-transform duration-300">
                <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden max-w-sm">
                  <div className="p-4">
                    <div className="flex items-center">
                      <img
                        src={tweets[1].avatar}
                        alt={tweets[1].name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="ml-3 flex-1">
                        <div className="flex items-center">
                          <span className="font-bold text-gray-900 text-sm">{tweets[1].name}</span>
                          {tweets[1].verified && (
                            <svg className="w-4 h-4 ml-1 text-sky-500" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
                            </svg>
                          )}
                          <span className="ml-1 text-gray-500 text-sm">{tweets[1].handle}</span>
                        </div>
                      </div>
                      <Twitter className="w-5 h-5 text-gray-400" />
                    </div>
                    <p className="mt-3 text-gray-800 text-sm leading-relaxed">
                      {tweets[1].content}
                    </p>
                    <img
                      src={tweets[1].image}
                      alt="Tweet attachment"
                      className="mt-3 rounded-xl w-full h-48 object-cover"
                    />
                    <div className="mt-3 flex items-center justify-between text-gray-500 text-xs">
                      <button className="flex items-center hover:text-sky-500 transition-colors">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        <span>{tweets[1].stats.comments}</span>
                      </button>
                      <button className="flex items-center hover:text-green-500 transition-colors">
                        <Repeat className="w-4 h-4 mr-1" />
                        <span>{tweets[1].stats.retweets}</span>
                      </button>
                      <button className="flex items-center hover:text-red-500 transition-colors">
                        <Heart className="w-4 h-4 mr-1" />
                        <span>{tweets[1].stats.likes}</span>
                      </button>
                      <button className="flex items-center hover:text-sky-500 transition-colors">
                        <Share className="w-4 h-4 mr-1" />
                        <span>{tweets[1].stats.views}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Tweet */}
              <div className="transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden max-w-sm">
                  <div className="p-4">
                    <div className="flex items-center">
                      <img
                        src={tweets[2].avatar}
                        alt={tweets[2].name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="ml-3 flex-1">
                        <div className="flex items-center">
                          <span className="font-bold text-gray-900 text-sm">{tweets[2].name}</span>
                          {tweets[2].verified && (
                            <svg className="w-4 h-4 ml-1 text-sky-500" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
                            </svg>
                          )}
                          <span className="ml-1 text-gray-500 text-sm">{tweets[2].handle}</span>
                        </div>
                      </div>
                      <Twitter className="w-5 h-5 text-gray-400" />
                    </div>
                    <p className="mt-3 text-gray-800 text-sm leading-relaxed">
                      {tweets[2].content}
                    </p>
                    <img
                      src={tweets[2].image}
                      alt="Tweet attachment"
                      className="mt-3 rounded-xl w-full h-48 object-cover"
                    />
                    <div className="mt-3 flex items-center justify-between text-gray-500 text-xs">
                      <button className="flex items-center hover:text-sky-500 transition-colors">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        <span>{tweets[2].stats.comments}</span>
                      </button>
                      <button className="flex items-center hover:text-green-500 transition-colors">
                        <Repeat className="w-4 h-4 mr-1" />
                        <span>{tweets[2].stats.retweets}</span>
                      </button>
                      <button className="flex items-center hover:text-red-500 transition-colors">
                        <Heart className="w-4 h-4 mr-1" />
                        <span>{tweets[2].stats.likes}</span>
                      </button>
                      <button className="flex items-center hover:text-sky-500 transition-colors">
                        <Share className="w-4 h-4 mr-1" />
                        <span>{tweets[2].stats.views}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Typography Section */}
            <div className="text-center max-w-3xl mx-auto">
              <span className="text-sky-500 text-sm tracking-wide font-semibold uppercase">Customer Reviews</span>
              <h2 className="mt-4 text-5xl font-semibold text-gray-600 leading-tight">
                Our Clients Feedback
              </h2>
              <p className="mt-6 text-lg text-gray-600">
                Join thousands of satisfied customers who trust our services for their needs. Our commitment to excellence, attention to detail, and customer satisfaction sets us apart.
              </p>
              <div className="mt-8 flex justify-center space-x-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-sky-500">98%</div>
                  <div className="mt-2 text-sm text-gray-600">Satisfaction Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-sky-500">100M+</div>
                  <div className="mt-2 text-sm text-gray-600">Happy Clients</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-sky-500">24/7</div>
                  <div className="mt-2 text-sm text-gray-600">Support</div>
                </div>
              </div>
            </div>

            {/* Additional Tweet Cards */}
            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Additional tweets rendering */}
              {tweets.slice(3).map((tweet, index) => (
                <div key={index + 3} className={`transform ${index === 0 ? 'hover:scale-105' : index === 1 ? 'translate-y-6 hover:translate-y-3' : '-rotate-2 hover:rotate-0'} transition-transform duration-300`}>
                  <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                    <div className="p-4">
                      <div className="flex items-center">
                        <img
                          src={tweet.avatar}
                          alt={tweet.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="ml-3 flex-1">
                          <div className="flex items-center">
                            <span className="font-bold text-gray-900 text-sm">{tweet.name}</span>
                            {tweet.verified && (
                              <svg className="w-4 h-4 ml-1 text-sky-500" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
                              </svg>
                            )}
                            <span className="ml-1 text-gray-500 text-sm">{tweet.handle}</span>
                          </div>
                        </div>
                        <Twitter className="w-5 h-5 text-gray-400" />
                      </div>
                      <p className="mt-3 text-gray-800 text-sm leading-relaxed">
                        {tweet.content}
                      </p>
                      <img
                        src={tweet.image}
                        alt="Tweet attachment"
                        className="mt-3 rounded-xl w-full h-48 object-cover"
                      />
                      <div className="mt-3 flex items-center justify-between text-gray-500 text-xs">
                        <button className="flex items-center hover:text-sky-500 transition-colors">
                          <MessageCircle className="w-4 h-4 mr-1" />
                          <span>{tweet.stats.comments}</span>
                        </button>
                        <button className="flex items-center hover:text-green-500 transition-colors">
                          <Repeat className="w-4 h-4 mr-1" />
                          <span>{tweet.stats.retweets}</span>
                        </button>
                        <button className="flex items-center hover:text-red-500 transition-colors">
                          <Heart className="w-4 h-4 mr-1" />
                          <span>{tweet.stats.likes}</span>
                        </button>
                        <button className="flex items-center hover:text-sky-500 transition-colors">
                          <Share className="w-4 h-4 mr-1" />
                          <span>{tweet.stats.views}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Fifth Section - About HandyGo */}
        <section className={`relative min-h-screen transition-colors duration-700 ease-in-out ${aboutHandyGo[currentAboutSection].bgColor}`}>
          <div className="max-w-7xl mx-auto px-6 py-24">
            <div className="grid grid-cols-12 gap-8">
              {/* Left Side - Dynamic Typography with Enhanced Blur Animation */}
              <div className="col-span-5 sticky top-60 h-fit mr-10 ml-[-2rem]">
                <div className="space-y-5 overflow-hidden">
                  <span
                    className={`text-sm font-semibold tracking-wide uppercase transition-all duration-700 ease-out block ${textAnimating ? 'blur-lg opacity-0 transform translate-y-4' : 'blur-0 opacity-100 transform translate-y-0'
                      } ${aboutHandyGo[currentAboutSection].accentColor}`}
                  >
                    About HandyGo
                  </span>
                  <h2
                    className={`text-4xl font-bold text-gray-600 leading-tight transition-all duration-700 ease-out block ${textAnimating ? 'blur-lg opacity-0 transform translate-y-6' : 'blur-0 opacity-100 transform translate-y-0'
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
        <SixthSection />

        {/* Seventh Section - System Features */}
        <SeventhSection />

        {/* Eighth Section - Services */}
        <div data-section="services">
          <EighthSection />
        </div>

        {/* Ninth Section - Join Now */}
        <NinthSection />

        {/* Tenth Section - Call to Action */}
        <TenthSection navigateToLogin={navigateToLogin} />

      </div>
    </>
  );
}

export default Proposition;