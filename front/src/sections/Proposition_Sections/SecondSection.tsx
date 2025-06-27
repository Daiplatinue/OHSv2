interface SecondSectionProps {
  hoveredTeamMember: string;
  handleTeamMemberHover: (memberName: string) => void;
  handleTeamMemberLeave: () => void;
  getCurrentImage: () => string;
  imageTransitioning: boolean;
}

function SecondSection({
  hoveredTeamMember,
  handleTeamMemberHover,
  handleTeamMemberLeave,
  getCurrentImage,
  imageTransitioning
}: SecondSectionProps) {
  return (
    <section data-section="who-we-are" className="relative min-h-screen bg-white text-gray-600 py-16 px-8 md:px-16 lg:px-20">
      <div className="max-w-7xl mx-auto mt-15">
        <div className="pb-8">
          <h2 className="text-[12px] font-medium tracking-[0.2em] uppercase">WHO WE ARE</h2>
        </div>

        <div className="">
          <div className="pr-0 md:pr-8">
            <div className="space-y-6">
              <h1 className="text-[42px] sm:text-[52px] md:text-[55px] lg:text-[55px] font-medium tracking-[-0.02em] leading-[0.95] uppercase">
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
                    What started as a small initiative has grown into a full-service online home solution. Whether it's a quick repair or a complex project, Handy Go is here to deliver smooth, affordable, and dependable service right when you need it most.
                  </p>

                  <p className="text-[13px] tracking-[0.02em] leading-[1.6] uppercase mt-6 w-[25rem]">
                    HANDY GO WAS DEVELOPED BY A DEDICATED TEAM OF SIX MEMBERS:{" "}
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
                      VINCE EDWARD MAÑACAP AS DEVELOPER
                    </span>,{" "}
                    <span
                      className="cursor-pointer hover:text-sky-600 transition-colors duration-300 text-sky-500"
                      onMouseEnter={() => handleTeamMemberHover("KYLE SELLOTE AS DEVELOPER")}
                      onMouseLeave={handleTeamMemberLeave}
                    >
                      KYLE SELLOTE AS SYSTEM ANALYST
                    </span>, {" "}
                    <span
                      className="cursor-pointer hover:text-sky-600 transition-colors duration-300 text-sky-500"
                      onMouseEnter={() => handleTeamMemberHover("BART JUAREZ AS SYSTEM ANALYST")}
                      onMouseLeave={handleTeamMemberLeave}
                    >
                      BART JUAREZ AS CLIENT LIAISON
                      
                    </span>, AND {" "}
                      <span
                      className="cursor-pointer hover:text-sky-600 transition-colors duration-300 text-sky-500"
                      onMouseEnter={() => handleTeamMemberHover("BART JUAREZ AS SYSTEM ANALYST")}
                      onMouseLeave={handleTeamMemberLeave}
                    >
                      JV ALMENDRAS AS DOCUMENTOR.
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
                    className={`w-[425px] h-[425px] object-cover transition-all duration-700 ease-in-out transform ${hoveredTeamMember ? 'brightness-1.1 contrast-1.05 scale-102' : 'brightness-1 contrast-1 scale-100'} ${imageTransitioning ? 'opacity-0' : 'opacity-100'}`}
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
  );
}

export default SecondSection;