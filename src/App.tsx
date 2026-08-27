import React, { useEffect, useState } from 'react';
import Lenis from 'lenis';
import { CanvasScroll } from './components/CanvasScroll';
import { Plane, Plus, Minus } from 'lucide-react';

const RealTimeClock = () => {
  const [time, setTime] = useState("");
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = { 
        timeZone: 'Asia/Dubai', 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      };
      setTime(new Intl.DateTimeFormat('en-US', options).format(now));
    };
    updateTime();
    const int = setInterval(updateTime, 1000);
    return () => clearInterval(int);
  }, []);
  return <span className="text-2xl md:text-4xl font-heading tracking-tight font-medium text-black">{time}</span>;
};

const CityTicker = () => {
  const coreCities = ["Riyadh", "Cairo", "Singapore", "Berlin", "Cape Town", "Marrakech", "Geneva", "London", "New York", "Tokyo", "Paris"];
  const cities = [...coreCities, ...coreCities];
  return (
    <div className="w-full pt-16 md:pt-24 pb-8 flex items-center justify-center bg-transparent relative z-20">
      <div className="flex items-center gap-8 md:gap-16">
        <div className="text-2xl md:text-4xl font-heading font-medium tracking-tight text-white drop-shadow-xl">
          Fly anywhere
        </div>
        <Plane className="w-5 h-5 md:w-6 md:h-6 text-white rotate-90 drop-shadow-xl" />
        <div className="h-[250px] overflow-hidden relative flex items-start" 
             style={{ 
               maskImage: 'linear-gradient(to bottom, transparent 0%, black 45%, black 55%, transparent 100%)', 
               WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 45%, black 55%, transparent 100%)' 
             }}>
          <div className="animate-ticker flex flex-col text-2xl md:text-4xl font-heading font-medium tracking-tight text-white">
            {cities.map((city, i) => (
              <div key={i} className="py-3 md:py-4">{city}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};


const FadeIn = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => { if (ref.current) observer.unobserve(ref.current); };
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName.toLowerCase() === 'a' || target.tagName.toLowerCase() === 'button' || target.closest('a') || target.closest('button')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };
    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <>
      <div 
        className="fixed top-0 left-0 w-10 h-10 border border-white/50 rounded-full pointer-events-none z-[10000] mix-blend-difference transition-all duration-300 ease-out hidden md:block"
        style={{ transform: `translate3d(${position.x - 20}px, ${position.y - 20}px, 0) scale(${isHovering ? 1.5 : 1})` }}
      />
      <div 
        className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-[10000] mix-blend-difference hidden md:block"
        style={{ transform: `translate3d(${position.x - 4}px, ${position.y - 4}px, 0)`, opacity: isHovering ? 0 : 1 }}
      />
    </>
  );
};

function App() {
  const [activeAccordion, setActiveAccordion] = useState<number | null>(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  const advantages = [
    {
      title: "Pets",
      content: "Traveling with pets on a private jet means comfort and peace of mind for both owners and their companions. Our dedicated team ensures seamless arrangements, from documentation and safety to onboard care, so that your pet enjoys the same level of attention and luxury as you do. Every detail is managed to create a stress-free and enjoyable journey for everyone on board.",
      img: "/images/dog_in_jet.jpg"
    },
    {
      title: "24/7 availability",
      content: "Our operations run around the clock, providing you with the ultimate flexibility to fly whenever you need, regardless of time zones or tight schedules.",
      img: "/images/jet_night.jpg"
    },
    {
      title: "Onboard services",
      content: "Experience world-class catering, personalized amenities, and absolute privacy. From bespoke menus to specific entertainment requests, your flight is tailored completely to you.",
      img: "/images/onboard_champagne.jpg"
    },
    {
      title: "Efficient",
      content: "Bypass commercial terminal queues, security delays, and baggage claims. Arrive minutes before your departure and maximize your valuable time.",
      img: "/images/plane_clouds.jpg"
    }
  ];

  return (
    <div className="relative w-full font-body selection:bg-white selection:text-black bg-[#050505]">
      <CustomCursor />
      <div className="noise-overlay fixed inset-0 pointer-events-none z-[60] opacity-[0.03]"></div>
      
      {/* Header */}
      <nav className="fixed top-0 left-0 w-full flex justify-between items-center px-6 md:px-10 py-6 z-50 text-[10px] md:text-[11px] uppercase tracking-widest font-medium text-white mix-blend-difference">
        <div className="hidden md:flex gap-12">
          {['About', 'Our Fleet', 'Advantages', 'Global'].map((item) => (
            <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} className="relative group overflow-hidden pb-1">
              {item}
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-white transform -translate-x-[105%] group-hover:translate-x-0 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"></span>
            </a>
          ))}
        </div>
        <div className={`absolute left-1/2 -translate-x-1/2 text-sm md:text-base tracking-[0.3em] font-light font-heading transition-all duration-700 ${isScrolled ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
          AEROLUXE
        </div>
        <div className="flex gap-8">
          <a href="tel:+971544325050" className="hover:opacity-60 transition-opacity hidden md:block">+971 54 432 5050</a>
          <a href="mailto:info@aeroluxe.com" className="hover:opacity-60 transition-opacity">info@aeroluxe.com</a>
        </div>
      </nav>

      {/* Sticky Bottom CTA */}
      <div className="fixed bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4">
        <button className="bg-white text-black px-6 py-3 rounded-full font-semibold text-xs md:text-sm tracking-wide shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.6)] transition-all duration-300 ease-out">
          Book the Flight
        </button>
        <button className="bg-white text-black p-3 rounded-full shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-110 hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(255,255,255,0.6)] transition-all duration-300 ease-out group">
          <Plane className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform duration-300" />
        </button>
      </div>

      <div id="canvas-container" className="relative w-full z-10">
        
        {/* Sticky Background Canvas */}
        <div className="sticky top-0 left-0 w-full h-[100dvh] -z-10">
          <CanvasScroll />
        </div>

        {/* Content Sections that overlay the canvas */}
        <div className="relative z-10 -mt-[100dvh]">
          
          {/* Hero Section */}
          <section className="h-[150dvh] relative px-6 md:px-10 text-white overflow-hidden">
            <div className="sticky top-0 h-[100dvh] w-full flex flex-col justify-between pt-20 md:pt-28 pb-20 md:pb-32">
              
              {/* Floating Center Text (Inside Window) */}
              <div className={`absolute top-[47%] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none hidden md:block z-0 transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${isScrolled ? 'opacity-0 -translate-y-16 scale-75' : 'opacity-100 translate-y-0 scale-100'}`}>
                <div className="text-[1.5vw] font-heading font-light tracking-[0.8em] text-white/90 uppercase whitespace-nowrap drop-shadow-lg -mr-[0.8em]">
                  AEROLUXE
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-center w-full relative z-10">
                <div className="flex flex-col md:flex-row justify-between w-full h-full relative">
                  <div className="w-auto">
                    <h1 className="text-5xl md:text-[7.5vw] font-heading font-medium tracking-tighter leading-[0.9] drop-shadow-2xl md:mt-4">
                      Absolute <br/><span className="italic font-thin">Freedom</span>
                    </h1>
                  </div>
                  <div className="w-auto flex justify-start md:justify-end items-end pt-8 md:pt-40">
                    <h1 className="text-5xl md:text-[7.5vw] font-heading font-medium tracking-tighter leading-[0.9] text-left md:text-right drop-shadow-2xl">
                      Absolute <br/><span className="italic font-thin">Elegance</span>
                    </h1>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row justify-between items-start md:items-end w-full mt-8 md:mt-0">
                <div className="max-w-[250px] md:max-w-sm mb-6 md:mb-0">
                  <h2 className="text-xl md:text-3xl font-heading font-medium mb-2 md:mb-3 leading-[1.1] drop-shadow-md">
                    Elevating <br/>the standard of<br/>luxury travel
                  </h2>
                  <div className="w-8 md:w-12 h-[2px] bg-white/60 mb-2 md:mb-3"></div>
                  <p className="text-xs md:text-sm font-heading leading-relaxed font-light drop-shadow-md opacity-90 tracking-wide">
                    Meticulously engineered for the visionary. We redefine the skies, offering unparalleled comfort, absolute privacy, and seamless efficiency.
                  </p>
                </div>
                <div className="flex flex-col items-start md:items-end gap-2 text-[8px] md:text-[9px] uppercase tracking-[0.2em] pb-2 hidden md:flex">
                  <div className="flex items-center gap-2 font-bold drop-shadow-md">
                    <span className="animate-bounce">↓</span> SCROLL DOWN
                  </div>
                  <div className="w-48 h-[1px] bg-white my-2"></div>
                  <div className="font-bold drop-shadow-md">TO START THE JOURNEY</div>
                </div>
              </div>
              
            </div>
          </section>

          {/* Space for scrolling animation */}
          <div className="h-[175dvh]"></div>

          {/* About Section */}
          <section id="about" className="relative text-white min-h-[100dvh] flex flex-col justify-center">
            <div className="px-6 md:px-10 py-32 md:py-48 max-w-7xl mx-auto w-full">
              <FadeIn>
                <h2 className="text-3xl md:text-[4.2vw] font-heading font-medium tracking-tight leading-[1.1] mb-12 md:mb-16 max-w-6xl drop-shadow-lg">
                  AeroLuxe® stands at the pinnacle of bespoke aviation. With a legacy spanning continents, we empower industry leaders with uncompromising precision and discreet luxury.
                </h2>
              </FadeIn>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-16 max-w-4xl border-t border-white/20 pt-16">
                <FadeIn delay={0}>
                  <h3 className="text-xl md:text-3xl font-heading font-medium tracking-tight mb-4">Absolute<br/><span className="italic font-light">Discretion</span></h3>
                  <div className="w-8 h-[2px] bg-white/60 mb-4"></div>
                  <p className="text-xs md:text-sm font-light leading-relaxed opacity-90 font-heading tracking-wide">
                    We curate journeys tailored to your exacting standards. Your privacy is our highest priority, ensuring every flight remains an exclusive sanctuary above the clouds.
                  </p>
                </FadeIn>
                <FadeIn delay={200}>
                  <h3 className="text-xl md:text-3xl font-heading font-medium tracking-tight mb-4">Mastery of<br/><span className="italic font-light">Time</span></h3>
                  <div className="w-8 h-[2px] bg-white/60 mb-4"></div>
                  <p className="text-xs md:text-sm font-light leading-relaxed opacity-90 font-heading tracking-wide">
                    Time is your most precious asset. Our seamless logistics and elite fleet ensure you bypass the ordinary, arriving refreshed and perfectly on schedule.
                  </p>
                </FadeIn>
              </div>
            </div>
          </section>

          {/* Additional spacing before fleet to ensure text appears perfectly on the CAD frame */}
          <div className="h-[200dvh]"></div>

          {/* Fleet Section - darker text for beige background */}
          <section id="fleet" className="h-[370dvh] relative text-[#1a1a1a]">
            <div className="sticky top-0 h-[100dvh] px-6 md:px-10 pt-24 pb-20 md:pt-24 md:pb-28 max-w-full mx-auto">
              <div className="grid grid-cols-12 h-full gap-4 md:gap-10">
                <div className="col-span-12 md:col-span-3 flex flex-col justify-between h-full pt-2 md:pt-6">
                  <div>
                    <div className="text-lg md:text-2xl font-heading font-light tracking-wider mb-1 md:mb-2 uppercase opacity-80">Vanguard</div>
                    <div className="text-6xl md:text-[6rem] font-heading font-bold tracking-tighter leading-none">850X</div>
                  </div>
                  
                  <div className="flex flex-col gap-4 md:gap-5 text-[9px] md:text-xs uppercase tracking-widest font-heading pb-4 md:pb-6 max-w-[320px] mt-8 md:mt-0">
                    
                    <div className="grid grid-cols-2 gap-6 border-b border-black/10 pb-3 md:pb-4">
                      <div>
                        <div className="opacity-50 mb-1.5 font-bold">Range</div>
                        <div className="font-bold text-black/90">13,890 KM</div>
                      </div>
                      <div>
                        <div className="opacity-50 mb-1.5 font-bold">Top Speed</div>
                        <div className="font-bold text-black/90">MACH 0.925</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6 border-b border-black/10 pb-3 md:pb-4">
                      <div>
                        <div className="opacity-50 mb-1.5 font-bold">Capacity</div>
                        <div className="font-bold text-black/90">14 GUESTS + 2 CREW</div>
                      </div>
                      <div>
                        <div className="opacity-50 mb-1.5 font-bold">Endurance</div>
                        <div className="font-bold text-black/90">16 HOURS</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6 border-b border-black/10 pb-3 md:pb-4">
                      <div>
                        <div className="opacity-50 mb-1.5 font-bold">Luggage</div>
                        <div className="font-bold text-black/90">6.25 M³</div>
                      </div>
                      <div>
                        <div className="opacity-50 mb-1.5 font-bold">Altitude</div>
                        <div className="font-bold text-black/90">15,500 M</div>
                      </div>
                    </div>

                    {/* Additional Specifications */}
                    <div className="pt-2">
                      <div className="opacity-50 mb-3 md:mb-4 font-bold">Dimensions</div>
                      <div className="flex flex-col gap-2 md:gap-3 text-black/90">
                        <div className="grid grid-cols-2 gap-6">
                          <div className="font-bold">LENGTH</div>
                          <div className="font-bold">16.33 M</div>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                          <div className="font-bold">WIDTH</div>
                          <div className="font-bold">2.59 M</div>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                          <div className="font-bold">HEIGHT</div>
                          <div className="font-bold">1.95 M</div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
                
                <div className="hidden md:block col-span-6"></div>
                
                <FadeIn delay={300} className="col-span-12 md:col-span-3 flex flex-col justify-start md:pt-10 pl-0 md:pl-10">
                  <h3 className="text-3xl md:text-5xl font-heading font-medium tracking-tight mb-6 md:mb-10 leading-[1.1]">The Apex of<br/><span className="italic font-light">Engineering</span></h3>
                  <div className="text-[9px] md:text-xs font-bold uppercase tracking-widest mb-4 md:mb-8 border-t border-black/10 pt-4 md:pt-6 opacity-70">
                    UNCOMPROMISING<br/>PERFORMANCE
                  </div>
                  <div className="flex flex-col gap-4 md:gap-6 text-sm font-heading font-light leading-relaxed max-w-[340px] opacity-90 tracking-wide">
                    <p>
                      An absolute masterpiece of modern aerodynamics. It brings continents closer, flying at near-supersonic speeds while maintaining a remarkably silent cabin environment.
                    </p>
                    <p className="hidden md:block">
                      Engineered for ultimate well-being, the cabin features 100% fresh air replenished every two minutes and an industry-leading low cabin altitude, drastically reducing jet lag.
                    </p>
                    <p className="hidden md:block">
                      Experience the largest panoramic windows in private aviation, flooding the bespoke interior with natural light and providing a serene sanctuary among the clouds.
                    </p>
                  </div>
                </FadeIn>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Advantages Section */}
      <section id="advantages" className="relative min-h-[100dvh] bg-[#cbc6bb] text-[#1a1a1a] z-20 overflow-hidden">
        <div className="max-w-7xl mx-auto min-h-[100dvh] flex flex-col">
          <div className="px-6 md:px-10 pt-24 md:pt-32 mb-10 md:mb-20">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#1a1a1a]">
              A BETTER WAY TO FLY
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row flex-1 h-full px-6 md:px-10 pb-20 md:pb-32 gap-10 md:gap-20">
            {/* Accordion Left Side */}
            <div className="w-full md:w-1/2 flex flex-col justify-start">
              <div className="flex flex-col border-t border-black/10">
                {advantages.map((adv, index) => (
                  <div key={index} className="border-b border-black/10 overflow-hidden transition-all duration-500">
                    <button 
                      className="w-full flex justify-between items-center py-6 md:py-8 text-left"
                      onClick={() => setActiveAccordion(activeAccordion === index ? null : index)}
                    >
                      <span className={`text-2xl md:text-4xl font-heading font-medium tracking-tight transition-colors ${activeAccordion === index ? 'text-black' : 'text-black/70'}`}>
                        {adv.title}
                      </span>
                      <span className="text-black transition-transform duration-300">
                        {activeAccordion === index ? <Minus size={24} strokeWidth={1.5} /> : <Plus size={24} strokeWidth={1.5} />}
                      </span>
                    </button>
                    
                    <div 
                      className={`transition-all duration-500 ease-in-out ${activeAccordion === index ? 'max-h-96 opacity-100 pb-8' : 'max-h-0 opacity-0 pb-0'}`}
                    >
                      <p className="text-xs md:text-sm font-body font-medium leading-relaxed max-w-sm text-black/80">
                        {adv.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side Image */}
            <div className="w-full md:w-1/2 flex items-center justify-center">
              <div className="w-full h-[500px] md:h-[700px] relative overflow-hidden bg-black shadow-2xl">
                {advantages.map((adv, index) => (
                  <div 
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      activeAccordion === index ? 'opacity-100 z-10' : 'opacity-0 z-0'
                    }`}
                  >
                    <img 
                      src={adv.img} 
                      alt={adv.title} 
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <div className="w-full bg-[#fcfbf9] text-[#1a1a1a] border-y border-black/5 py-6 px-6 md:px-10 flex justify-between items-center text-[10px] uppercase font-bold tracking-widest z-20 relative">
        <div>
          <div className="opacity-40 mb-1">Countries Supported</div>
          <div className="text-sm">174</div>
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 text-center hidden md:block">
          <div className="opacity-40 mb-1">Based in</div>
          <div className="text-sm">Dubai, UAE</div>
        </div>
        <div className="text-right">
          <div className="opacity-40 mb-2">Local Time</div>
          <div className="text-sm flex items-center justify-end gap-2">
            <RealTimeClock />
          </div>
        </div>
      </div>

      {/* Global Footer Section */}
      <section id="global" className="relative bg-[#050505] text-white overflow-hidden z-20">
        
        <CityTicker />

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
          <span className="text-[25vw] font-heading font-bold tracking-tighter select-none">Global</span>
        </div>

        <div className="px-6 md:px-20 pt-8 pb-24 md:pt-16 md:pb-32 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between relative z-10">
          
          <FadeIn className="w-full md:w-1/2 flex flex-col items-start mb-20 md:mb-0">
            <div className="flex flex-col items-start max-w-md">
              <h2 className="text-5xl md:text-[8rem] font-heading font-normal tracking-tighter mb-4 leading-none">5K+<br/>flights</h2>
              
              <p className="text-[10px] tracking-[0.3em] uppercase mb-6 md:mb-10 font-bold mt-10">Missions Accomplished</p>
              <div className="w-12 h-[2px] bg-white/40 mb-6 md:mb-8"></div>
              <p className="text-sm font-heading tracking-wide font-light leading-relaxed opacity-80 text-justify">
                Each journey is a testament to our expertise, precision, and unwavering dedication. From last-minute coastal hops to transatlantic business routes, AeroLuxe guarantees supreme safety and unparalleled service.
              </p>
            </div>
          </FadeIn>

          <div className="w-full md:w-1/2 h-[400px] md:h-[600px] flex items-center justify-center relative">
            <div className="relative w-[300px] h-[300px] md:w-[600px] md:h-[600px]">
              
              <div className="absolute inset-4 md:inset-8 rounded-full overflow-hidden bg-[#0a0a0a] shadow-[inset_-30px_-30px_60px_rgba(0,0,0,0.9),0_0_50px_rgba(255,255,255,0.05)] border border-white/10 flex items-center justify-center">
                
                {/* Earth Map (Correctly Scrolling) */}
                <div className="absolute w-[400%] h-[100%] top-0 left-0 animate-earth opacity-40 mix-blend-screen" style={{
                  backgroundImage: 'url("https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg")',
                  backgroundSize: '50% 100%',
                  backgroundRepeat: 'repeat-x',
                  filter: 'invert(1) brightness(0.8) contrast(1.2)'
                }}></div>

                {/* Tech Radar Rings */}
                <div className="absolute w-[150%] h-[150%] rounded-full border-[0.5px] border-white/5 animate-[ping_4s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
                <div className="absolute w-[100%] h-[100%] rounded-full border-[0.5px] border-white/10 animate-[ping_4s_cubic-bezier(0,0,0.2,1)_infinite_1s]"></div>
                <div className="absolute w-[50%] h-[50%] rounded-full border-[0.5px] border-white/15 animate-[ping_4s_cubic-bezier(0,0,0.2,1)_infinite_2s]"></div>
                
                {/* Crosshairs */}
                <div className="absolute w-full h-[1px] bg-white/10"></div>
                <div className="absolute h-full w-[1px] bg-white/10"></div>
                
                {/* Radar Sweep */}
                <div className="absolute inset-0 rounded-full animate-globe mix-blend-screen opacity-30 pointer-events-none" style={{ background: 'conic-gradient(from 0deg, transparent 70%, rgba(255,255,255,0.2) 100%)' }}></div>
                
                {/* 3D Inner Shadow overlay */}
                <div className="absolute inset-0 rounded-full shadow-[inset_-30px_-30px_60px_rgba(0,0,0,1),inset_10px_10px_30px_rgba(255,255,255,0.1)] md:shadow-[inset_-50px_-50px_80px_rgba(0,0,0,1),inset_20px_20px_40px_rgba(255,255,255,0.1)] z-10 pointer-events-none"></div>
              </div>

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] border border-white/10 rounded-full rotate-45"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[30%] border border-white/10 rounded-full -rotate-12"></div>
            </div>
          </div>
          
        </div>
        
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 md:px-20 py-8 flex flex-col md:flex-row justify-between items-center text-[8px] md:text-[10px] text-white/50 uppercase tracking-widest font-bold gap-4 md:gap-0">
            <div>© 2026 AEROLUXE AVIATION. ALL RIGHTS RESERVED</div>
            <div className="flex gap-6 md:gap-10">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <span>The First The Last</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

export default App;
