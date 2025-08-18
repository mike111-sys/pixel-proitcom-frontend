import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaPhone } from 'react-icons/fa';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ErrorBoundary from './components/ErrorBoundary';
import Contact from './pages/Contact';

const Loader = () => (
  <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
    <div className="flex flex-col items-center">
      <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  </div>
);

// Floating Call Button (mobile only)
const CallNowButton = () => {
  return (
    <a
      href="tel:0741238738"
      className="fixed bottom-4 left-4 flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-full shadow-lg md:hidden z-40"
    >
      <FaPhone className="text-lg animate-pulse" />
      <motion.span
        key="callnow"
        initial={{ opacity: 0, width: 0 }}
        animate={{ opacity: [0, 1, 1, 0], width: ['0ch', '7.5ch', '7.5ch', '0ch'] }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="overflow-hidden whitespace-nowrap"
      >
        Call Now
      </motion.span>
    </a>
  );
};

const Layout = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timeout);
  }, [location]);

  const hideLayout = location.pathname.startsWith('/admin');

  if (loading) {
    // Show ONLY loader (no Navbar/Footer)
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {!hideLayout && <Navbar />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      {!hideLayout && <Footer />}
      {!hideLayout && <CallNowButton />}
    </div>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <Router>
            <Layout />
          </Router>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
