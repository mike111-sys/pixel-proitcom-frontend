import { FaFacebook, FaInstagram, FaMapMarkerAlt, FaPhone, FaEnvelope, FaHome, FaBox, FaArrowUp, FaTiktok, FaWhatsapp } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Logo from "../assets/logo.webp";
import Logo_blur from "../assets/logo-blur.webp";
import { FaBook } from 'react-icons/fa6';
import { BiConversation } from 'react-icons/bi';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [showScroll, setShowScroll] = useState(false);

useEffect(() => {
  const handleScroll = () => {
    if (window.scrollY > 300) {
      setShowScroll(true);
    } else {
      setShowScroll(false);
    }
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);


  return (
    <footer className="bg-white  text-black border-t border-gray-200">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          
          {/* About Section */}
          <motion.div 
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
  viewport={{ once: true }}
  className="space-y-4 text-center md:text-left flex flex-col items-center md:items-start"
>
  <div className="flex justify-center md:justify-start">
  {/* Wrapper for blur + real image */}
  <div className="relative h-20 w-64">
    {/* Blurred placeholder - always visible but behind */}
    <img
      src={Logo_blur}
      loading='lazy'
      alt="Pixel Pro blurred"
      className="absolute inset-0 h-full w-full object-contain"
      style={{ filter: 'blur(5px)' }}
    />
    {/* Actual logo - fades in when loaded */}
    <img
      src={Logo}
      alt="Pixel Pro"
      className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-1000 ${
        logoLoaded ? "opacity-100" : "opacity-0"
      }`}
      onLoad={() => {
        // Small timeout to ensure the transition is visible
        setTimeout(() => setLogoLoaded(true), 50);
      }}
      loading="lazy"
    />
  </div>
  
</div>
<h3 className="text-3xl font-bold">Pixelpro Technology</h3>
  <p className="text-gray-600 max-w-sm">
  Your one-stop shop for premium tech accessories and gadgets. Quality products at affordable prices.
  </p>
  <div className="flex justify-center md:justify-start space-x-4">
    
  <a
    href="https://facebook.com"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Facebook"
  >
    <FaFacebook className="text-xl text-gray-500 hover:text-yellow-500 transition-colors cursor-pointer" />
    </a>
    <a
    href="https://www.tiktok.com/@pixelpro.technolo?_t=ZM-8zYWNFEoYIa&_r=1"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Twitter"
  >
    <FaTiktok className="text-xl text-gray-500 hover:text-yellow-500 transition-colors cursor-pointer" />
    </a>

    <a
    href="https://www.instagram.com/pixelpro_technology?igsh=dWc0cHM5YzFlZHFs&utm_source=qr"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Instagram"
  >
    <FaInstagram className="text-xl text-gray-500 hover:text-yellow-500 transition-colors cursor-pointer" />
    </a>
    
    <a
    href="https://wa.me/254713731333"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="YouTube"
  >
    <FaWhatsapp className="text-xl text-gray-500 hover:text-green-500 transition-colors cursor-pointer" />
    </a>
  </div>
</motion.div>

          {/* Quick Links */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
             className="space-y-4 text-center md:text-left"
          >
            <h3 className="text-lg font-bold border-b-2 border-yellow-400 pb-2 inline-block">Quick Links</h3>
  <ul className="space-y-2">
    <li className="flex justify-center md:justify-start items-center space-x-3">
      <FaHome className="text-yellow-500" />
      <a href="/" className="hover:text-yellow-500 hover:underline transition-colors">Home</a>
    </li>
  <li className="flex justify-center md:justify-start items-center space-x-3">
    <FaBox className="text-yellow-500" />
    <a href="/products" className="hover:text-yellow-500 hover:underline transition-colors">Products</a>
  </li>

  <li className="flex justify-center md:justify-start items-center space-x-3">
    <FaPhone className="text-yellow-500" />
    <a href="/contact" className="hover:text-yellow-500 hover:underline transition-colors">Contact Us</a>
  </li>
  <li className="flex justify-center md:justify-start items-center space-x-3">
    <FaBook className="text-yellow-500" />
    <a href="/blog" className="hover:text-yellow-500 hover:underline transition-colors">Blogs</a>
  </li>
  <li className="flex justify-center md:justify-start items-center space-x-3">
    <BiConversation className="text-yellow-500" />
    <a href="/reviews" className="hover:text-yellow-500 hover:underline transition-colors">Customer Reviews</a>
  </li>
  
</ul>
          </motion.div>

         

          {/* Contact Info */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="space-y-4 text-center md:text-left flex flex-col items-center md:items-start"
          >
            <h3 className="text-lg font-bold border-b-2 border-yellow-400 pb-2 inline-block">Contact Us</h3>
  <div className="space-y-3">
    <div className="flex justify-center md:justify-start items-start space-x-3">
      <FaMapMarkerAlt className="text-yellow-500 mt-1" />
      <div className="flex flex-col">
        <p>Koinange Street, Cianda House,</p>
        <p>2nd Floor Suite 210</p>
      </div>
    </div>
    <div className="flex justify-center md:justify-start items-center space-x-3">
      <FaPhone className="text-yellow-500" />
      <a href="tel:+254713731333" className="hover:text-yellow-500 hover:underline transition-colors">+254 713 731 333</a>
    </div>
    <div className="flex justify-center md:justify-start items-center space-x-3">
      <FaEnvelope className="text-yellow-500" />
      <a href="mailto:info@pixelproit.com" className="hover:text-yellow-500 hover:underline transition-colors">info@pixelproit.com</a>
    </div>
  </div>
</motion.div>
        </div>

        {/* Newsletter */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 bg-gray-50 rounded-lg p-6"
        >
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-xl font-bold mb-2">Subscribe to Our Newsletter</h3>
            <p className="text-gray-600 mb-4">Get the latest updates on new products and upcoming sales</p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                required
              />
              <button 
                type="submit" 
                className="px-6 py-2 bg-yellow-500 cursor-pointer text-white font-medium rounded-lg hover:bg-yellow-600 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </motion.div>
      </div>

      {/* Copyright Section */}
      <div className="bg-black text-white py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-center md:text-left">
                &copy; {currentYear} Pixelpro Technology. All rights reserved.
              </p>
            </div>
            <div className="flex flex-col items-center md:flex-row md:space-x-6">
              <div className="mb-2 md:mb-0">
                <p className="text-gray-400">
                  Powered by <a href="https://ujuzicreations.co.ke" target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:text-yellow-300 hover:underline transition-colors">U.D.C</a>
                </p>
              </div>
         
            </div>
          </div>
        </div>
      </div>
      {showScroll && (
  <button
    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    className="fixed bottom-6 cursor-pointer right-6 bg-yellow-500 text-white p-3 rounded-full shadow-lg 
               hover:bg-yellow-600 transition-colors"
    aria-label="Scroll to top"
  >
    <FaArrowUp />
  </button>
)}

    </footer>
  );
};

export default Footer;