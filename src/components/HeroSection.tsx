import { useState, useEffect } from 'react';
import Mobile_Radio from '../assets/mobile-radio.webp';
import Mobile_Radio_blur from '../assets/mobile-radio-blur.webp';
import Motorolla from '../assets/motorolla.webp';
import Motorolla_blur from '../assets/motorolla-blur.webp';
import Thuraya from '../assets/thuraya.webp';
import Thuraya_blur from '../assets/thuraya-blur.webp';
import { FaTags } from 'react-icons/fa';

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [typewriterText, setTypewriterText] = useState('');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const useImageLoader = (src: string) => {
    const [isLoaded, setIsLoaded] = useState(false);
  
    useEffect(() => {
      const image = new Image();
      image.src = src;
      image.onload = () => setIsLoaded(true);
      return () => {
        image.onload = null;
      };
    }, [src]);
  
    return isLoaded;
  };
  

 
  // Update your slide data to include loading state
  const slides = [
    {
      id: 0,
      title: "Satellite Communication",
      staticImage: Motorolla,
      blurImage: Motorolla_blur,
      description: "Stay connected anywhere with reliable, license-free Motorola satellite radios, built for clarity, durability, and long-range coverage.",
      buttonText: "Explore Radios",
      gradient: "from-blue-900 via-blue-800 to-indigo-900"
    },
    {
      id: 1,
      title: "Radio Communication",
      staticImage: Mobile_Radio,
      blurImage: Mobile_Radio_blur,
      description: "Powerful mobile radios from leading brands, ideal for clear, secure communication. Special discounts available on bulk orders.",
      buttonText: "View Collection",
      gradient: "from-purple-900 via-purple-800 to-pink-900"
    },
    {
      id: 2,
      title: "Garmin Products",
      staticImage: Thuraya,
      blurImage: Thuraya_blur,
      description: "Explore advanced Garmin solutions for navigation and satellite communication, perfect for professionals and adventurers in remote areas.",
      buttonText: "Discover More",
      gradient: "from-teal-900 via-teal-800 to-cyan-900"
    },
  ];

  const words = slides.map(slide => slide.title);

  // Enhanced typewriter effect
  useEffect(() => {
    const currentWord = words[currentWordIndex];
    const typeSpeed = isDeleting ? 50 : 80;
    const pauseTime = isDeleting ? 500 : 2000;

    const timer = setTimeout(() => {
      if (!isDeleting && typewriterText === currentWord) {
        setTimeout(() => setIsDeleting(true), pauseTime);
      } else if (isDeleting && typewriterText === '') {
        setIsDeleting(false);
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
      } else {
        setTypewriterText(prev => 
          isDeleting 
            ? prev.slice(0, -1)
            : currentWord.slice(0, prev.length + 1)
        );
      }
    }, typeSpeed);

    return () => clearTimeout(timer);
  }, [typewriterText, isDeleting, currentWordIndex, words]);

  // Auto-rotate slides
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isHovered) {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }
    }, 6000);
    return () => clearInterval(interval);
  }, [isHovered, slides.length]);


  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});
  // Use the custom hook for each image
   const isMotorollaLoaded = useImageLoader(Motorolla);
   const isMobileRadioLoaded = useImageLoader(Mobile_Radio);
   const isThurayaLoaded = useImageLoader(Thuraya);

   // Update loadedImages when images load
  useEffect(() => {
    setLoadedImages({
      0: isMotorollaLoaded,
      1: isMobileRadioLoaded,
      2: isThurayaLoaded
    });
  }, [isMotorollaLoaded, isMobileRadioLoaded, isThurayaLoaded]);



  return (
    <section className="relative w-full -mt-10 sm:-mt-0 lg:-mt-40 lg: min-h-[600px] lg:h-[800px] overflow-hidden bg-white">
      {/* Clean white background */}
      <div className="absolute inset-0 bg-white" />
      
      <div className="relative z-10 container mx-auto h-full px-6 sm:px-8 md:px-4 flex flex-col md:flex-row items-center justify-between py-8 md:py-0">
        
        {/* Left side - Text content */}
        <div className="w-full md:w-1/2 h-full flex flex-col justify-center p-4 md:pr-8 relative">
          {/* Pixel Pro Brand */}
          <div className="mb-1 md:mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 md:mb-4">
              <span className="text-black">Pixel</span>
              <span className="text-black ml-1 md:ml-2">Pro</span>
            </h2>
            <div className="h-1 w-24 md:w-36 bg-gradient-to-r from-gray-700 to-gray-900 rounded-full"></div>
          </div>
  
          {/* Enhanced title with typewriter effect */}
          <div className="mb-4 md:mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold text-black mb-2 min-h-[60px] md:min-h-[80px] flex items-center">
              <span className="text-yellow-500 break-words">{typewriterText}</span>
              <span className="text-yellow-500 animate-pulse ml-1">|</span>
            </h1>
          </div>
  
          {/* Mobile-only images */}
          <div className="w-full flex justify-center mb-6 md:hidden">
            <div className="w-4/5 max-w-xs">
               {/* Blur image (always shown) */}
    <img
      src={slides[currentSlide].blurImage}
      loading='lazy'
      alt={slides[currentSlide].title}
      className={`w-full h-auto object-contain transition-all duration-1000 ${
        loadedImages[currentSlide] ? 'opacity-0 absolute' : 'opacity-100'
      }`}
      style={{
        filter: 'blur(10px)',
        transform: 'scale(1.1)',
        transition: 'opacity 500ms ease-out'
      }}
    />
    {/* High quality image */}
    <img
      src={slides[currentSlide].staticImage}
      loading='lazy'
      alt={slides[currentSlide].title}
      className={`w-full h-auto object-contain transition-all duration-1000 ${
        loadedImages[currentSlide] ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        transition: 'opacity 500ms ease-in'
      }}
    />
            </div>
          </div>
  
          {/* Description */}
          <p className="text-base font-semibold sm:text-lg md:text-xl text-gray-700 mb-6 md:mb-8 max-w-lg leading-relaxed">
            {slides[currentSlide].description}
          </p>
  
          {/* Single button */}
          <div className="mb-6 md:mb-8">
            <button
              className="px-6 py-3 cursor-pointer sm:px-8 sm:py-4 bg-green-500 text-white rounded-full font-semibold text-base sm:text-lg hover:bg-green-600 transition-all duration-300 hover:scale-105 w-full sm:w-auto text-center"
              onClick={() => window.location.href = '/products'}
            >
              Explore all Products
            </button>
          </div>
        </div>
  
        {/* Right side - Rotating product images */}
        <div 
          className="w-full md:w-1/2 h-full flex flex-col items-center justify-center p-4 relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="w-full flex flex-col items-center">
            {/* Rotating image */}
            <div className="w-full hidden md:block max-w-md lg:max-w-lg relative">
              <div className="relative h-64 sm:h-80 md:h-96">
                {/* Blur image (always shown) */}
    <img
      src={slides[currentSlide].blurImage}
      loading='lazy'
      alt={slides[currentSlide].title}
      className={`w-full h-full object-contain absolute transition-all duration-1000 ${
        loadedImages[currentSlide] ? 'opacity-0' : 'opacity-100'
      }`}
      style={{
        filter: 'blur(10px)',
        transform: 'scale(1.1)',
        transition: 'opacity 500ms ease-out'
      }}
    />
    {/* High quality image */}
    <img
      src={slides[currentSlide].staticImage}
      loading='lazy'
      alt={slides[currentSlide].title}
      className={`w-full h-full object-contain relative z-10 transition-all duration-1000 ${
        loadedImages[currentSlide] ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        transition: 'opacity 500ms ease-in'
      }}
    />
              </div>
            </div>
          </div>
  
          {/* Slide indicators */}
          <div className="absolute bottom-4 md:bottom-44 left-0 right-0 flex justify-center gap-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full cursor-pointer transition-all duration-300 ${
                  currentSlide === index 
                    ? 'w-6 sm:w-8 bg-black' 
                    : 'w-2 bg-gray-400 hover:bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
  
      {/* Simple decorative corners */}
      <div className="absolute top-0 left-0 w-16 h-16 sm:w-24 sm:h-24 border-l-4 border-t-4 border-gray-300 opacity-40"></div>
      <div className="absolute bottom-0 right-0 w-16 h-16 sm:w-24 sm:h-24 border-r-4 border-b-4 border-gray-300 opacity-40"></div>
 
     {/* Desktop-only bottom card */}
<div className="hidden md:flex absolute bottom-4 left-1/2 transform -translate-x-1/2 w-11/12 lg:w-4/5 bg-white rounded-2xl shadow-xl border border-gray-200 p-6 items-center gap-4 text-gray-800">
  <FaTags className="text-yellow-500 w-6 h-6 flex-shrink-0" />
  <p className="text-lg">
    Discounts are awarded for bulky purchases. Enjoy amazing savings when you buy multiple units of our high-quality products. Shop more, save more!
  </p>
</div>

 
    </section>
  
  );
};

export default HeroSection;