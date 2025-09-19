import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaShoppingCart, FaPhone, FaChevronDown, FaChevronRight } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import * as ReactIcons from 'react-icons/fa';
import Logo from "../assets/logo.webp";
import Logo_blur from "../assets/logo-blur.webp";
import { LuContact } from 'react-icons/lu';

interface Category {
  id: number;
  name: string;
  icon_name: string;
}

interface Subcategory {
  id: number;
  name: string;
  category_id: number;
  icon_name: string;
}

interface Product {
  id: number;
  name: string;
  category_id: number;
  subcategory_id?: number;
  subcategory_name?: string;
}

const Navbar = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [openCategory, setOpenCategory] = useState<number | null>(null);
  const [openMobileCategory, setOpenMobileCategory] = useState<number | null>(null);
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { getTotalItems } = useCart();
  const navigate = useNavigate();

  const Loader = () => (
    <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );


  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true); // Set loading to true when starting fetch
        const API_URL = import.meta.env.VITE_API_URL;
  
        const [categoriesRes, subcategoriesRes, productsRes] = await Promise.all([
          axios.get(`${API_URL}/api/categories`),
          axios.get(`${API_URL}/api/subcategories`),
          axios.get(`${API_URL}/api/products?limit=100`)
        ]);
        setCategories(categoriesRes.data);
        setSubcategories(subcategoriesRes.data);
        setProducts(productsRes.data.products || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false); // Set loading to false when done (success or error)
      }
    };
  
    fetchData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleCall = () => {
    window.location.href = 'tel:0713731333';
  };

  const getIconComponent = (iconName: string) => {
    const IconComponent = (ReactIcons as any)[iconName];
    return IconComponent ? <IconComponent className="w-5 h-5 text-yellow-500" /> : <ReactIcons.FaBox className="w-5 h-5 text-yellow-500" />;
  };

  const getSubcategoriesByCategory = (categoryId: number) => {
    return subcategories.filter(sub => sub.category_id === categoryId);
  };

  const getProductsBySubcategory = (subcategoryId: number) => {
    return products.filter(product => product.subcategory_id === subcategoryId).slice(0, 4);
  };

  const getProductsByCategory = (categoryId: number) => {
    return products.filter(product => product.category_id === categoryId).slice(0, 8);
  };

  // Limit main categories to 4 (move the 5th to otherCategories)
  const mainCategories = categories.slice(0, 4);
  const otherCategories = categories.slice(4);

  const CategoryDropdown = ({ category, }: { category: Category, isOther?: boolean }) => {
    const categorySubcategories = getSubcategoriesByCategory(category.id);
    const categoryProducts = getProductsByCategory(category.id);

    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="absolute top-full left-0 mt-1 bg-white shadow-2xl rounded-xl py-4 min-w-80 z-30 border border-gray-100"
      >
        <div className="px-5 py-3 border-b border-gray-200">
          <Link
                              to={`/products?category=${encodeURIComponent(category.name)}&subcategory=${encodeURIComponent(category.name)}`}
          className="text-base font-semibold text-gray-800 hover:text-purple-600 underline flex items-center space-x-3">
            {getIconComponent(category.icon_name)}
            <span>{category.name}</span>
          </Link>
        </div>
        <div className="max-h-72 overflow-y-auto">
          {categorySubcategories.map((subcategory) => {
            const subcategoryProducts = getProductsBySubcategory(subcategory.id);
            return (
              <div key={subcategory.id} className="border-b border-gray-50 last:border-b-0">
                <div className="px-5 py-3 bg-gray-50">
                  <p
                    className="flex items-center space-x-3 text-base font-medium text-gray-700  transition-colors duration-200"
                  >
                    {getIconComponent(subcategory.icon_name)}
                    <span>{subcategory.name}</span>
                  </p>
                </div>
                {subcategoryProducts.length > 0 && (
                  <div className="pl-8">
                    {subcategoryProducts.map((product) => (
                      <Link
                        key={product.id}
                        to={`/product/${product.id}`}
                        className="block px-4 py-2 text-sm text-gray-600 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200"
                      >
                        {product.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          
          {categorySubcategories.length === 0 && categoryProducts.length > 0 && (
            <div>
              {categoryProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="block px-5 py-3 text-base text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200"
                >
                  {product.name}
                </Link>
              ))}
              {categoryProducts.length === 8 && (
                <Link
                  to={`/products?category=${encodeURIComponent(category.name)}`}
                  className="block px-5 py-3 text-base text-purple-600 hover:bg-purple-50 font-medium transition-colors duration-200"
                >
                  View all {category.name} products →
                </Link>
              )}
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  const OtherAccessoriesDropdown = () => (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="absolute top-full left-0 mt-2 bg-white shadow-2xl rounded-xl py-4 min-w-96 z-30 border border-gray-100"
    >
      <div className="px-5 py-3 border-b border-gray-200">
        <h3 className="text-base font-semibold text-gray-800 underline flex items-center space-x-3">
          <ReactIcons.FaEllipsisH className="w-5 h-5 text-yellow-500" />
          <span>Other Accessories</span>
        </h3>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {otherCategories.map((category) => {
          const categorySubcategories = getSubcategoriesByCategory(category.id);
          return (
            <div key={category.id} className="border-b border-gray-50 last:border-b-0">
              <div className="px-5 py-3 bg-gray-50">
                <span className="flex items-center space-x-3 text-base font-medium text-gray-700">
                  {getIconComponent(category.icon_name)}
                  <span>{category.name}</span>
                </span>
              </div>
              {categorySubcategories.map((subcategory) => {
                const subcategoryProducts = getProductsBySubcategory(subcategory.id);
                return (
                  <div key={subcategory.id} className="pl-5">
                    <div className="px-5 py-2 bg-gray-25">
                      <Link
                        to={`/products?category=${encodeURIComponent(category.name)}&subcategory=${encodeURIComponent(subcategory.name)}`}
                        className="flex items-center space-x-3 text-sm font-medium text-gray-600 hover:text-purple-600 transition-colors duration-200"
                      >
                        {getIconComponent(subcategory.icon_name)}
                        <span>{subcategory.name}</span>
                      </Link>
                    </div>
                    {subcategoryProducts.length > 0 && (
                      <div className="pl-8">
                        {subcategoryProducts.map((product) => (
                          <Link
                            key={product.id}
                            to={`/product/${product.id}`}
                            className="block px-4 py-2 text-sm text-gray-500 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200"
                          >
                          {product.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </motion.div>
  );

  const MobileMenuButton = () => (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      className="lg:hidden flex flex-col items-center justify-center w-10 h-10 rounded-lg bg-purple-50 focus:outline-none"
      aria-label="Toggle menu"
    >
      <motion.span
        animate={{
          rotate: isMobileMenuOpen ? 45 : 0,
          y: isMobileMenuOpen ? 7 : 0,
          width: isMobileMenuOpen ? '1.5rem' : '1.25rem'
        }}
        className="block w-5 h-0.5 bg-purple-600 mb-1.5 transition-all"
      />
      <motion.span
        animate={{ opacity: isMobileMenuOpen ? 0 : 1 }}
        className="block w-5 h-0.5 bg-purple-600 mb-1.5"
      />
      <motion.span
        animate={{
          rotate: isMobileMenuOpen ? -45 : 0,
          y: isMobileMenuOpen ? -7 : 0,
          width: isMobileMenuOpen ? '1.5rem' : '1.25rem'
        }}
        className="block w-5 h-0.5 bg-purple-600 transition-all"
      />
    </motion.button>
  );

  return (
    <>
<nav className="bg-white shadow-lg fixed top-0 left-0 right-0 z-50 lg:relative">

 {/* Show loader when data is loading */}
 {isLoading && <Loader />}

      {/* Main Navbar */}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Row */}

        <div className="flex justify-between items-center py-1 lg:py-2">
        <div className="hidden lg:flex justify-between items-center py-1 lg:py-2 fixed  top-0 left-0 right-0 bg-white z-50 shadow-sm px-4 sm:px-6 lg:px-8">

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-4 flex-shrink-0">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative w-36 h-16 md:w-48 lg:w-72 lg:h-20"
            >
              <img
                src={Logo_blur}
                loading='lazy'
                alt="Pixel Pro"
                className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-300 ${
                  logoLoaded ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <img
                src={Logo}
                loading='lazy'
                alt="Pixel Pro"
                className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-300 ${
                  logoLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setLogoLoaded(true)}
              />
            </motion.div>
          </Link>

          {/* Desktop Search - Hidden on mobile */}
          <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileFocus={{ scale: 1.01 }}
                className="relative"
              >
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-base"
                />
                <button
                  type="submit"
                  className="absolute cursor-pointer right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-600"
                >
                  <FaSearch className="text-xl cursor-pointer" />
                </button>
              </motion.div>
            </form>
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCall}
              className="flex cursor-pointer items-center space-x-3 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg"
            >
              <FaPhone className="text-xl animate-pulse" />
              <span>Call Now</span>
            </motion.button>

            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Link to="/cart" className="relative text-gray-600 hover:text-yellow-600 transition-colors">
                <FaShoppingCart className="text-2xl text-yellow-400" />
                {getTotalItems() > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold"
                  >
                    {getTotalItems()}
                  </motion.span>
                )}
              </Link>
            </motion.div>
            </div>
            </div>
          </div>

       {/* Mobile Top Row */}
<div className="lg:hidden  flex items-center justify-between w-full py-2">
  {/* Logo */}
  <Link to="/" className="flex-shrink-0">
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative w-36 h-12"
    >
      <img
        src={Logo_blur}
        loading='lazy'
        alt="Pixel Pro"
        className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-300 ${
          logoLoaded ? 'opacity-0' : 'opacity-100'
        }`}
      />
      <img
        src={Logo}
        loading='lazy'
        alt="Pixel Pro"
        className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-300 ${
          logoLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => setLogoLoaded(true)}
      />
    </motion.div>
  </Link>

  {/* Cart + Menu */}
  <div className="flex items-center space-x-4">
    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
      <Link to="/cart" className="relative text-gray-600 hover:text-yellow-600">
        <FaShoppingCart className="text-2xl text-yellow-400" />
        {getTotalItems() > 0 && (
          <motion.span 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold"
          >
            {getTotalItems()}
          </motion.span>
        )}
      </Link>
    </motion.div>
    <MobileMenuButton />
  </div>
</div>
</div>

        {/* Mobile Search - Hidden on desktop */}
        <div className="lg:hidden mb-2">
          <motion.form 
            onSubmit={handleSearch}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative"
          >
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-base shadow-sm"
            />
            <button
              type="submit"
              className="absolute cursor-pointer right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-600"
            >
              <FaSearch className="text-xl" />
            </button>
          </motion.form>
        </div>

       {/* Bottom Row - Desktop Navigation */}
       <div className="pt-0 lg:pt-20">
<div className="hidden lg:flex items-center justify-center border-t border-gray-300 divide-x divide-gray-400">
  
  {/* Home Link */}
  <motion.div whileHover={{ y: -2 }}>
    <Link
      to="/"
      className="flex items-center hover:text-purple-600 gap-2 px-3 py-3 text-gray-700 font-medium transition-colors hover:bg-purple-50 text-base"
    >
      <ReactIcons.FaHome className="w-5 h-5 text-green-500" />
      Home
    </Link>
  </motion.div>

  {/* Main Categories */}
  {mainCategories.map((category) => (
    <motion.div 
      key={category.id} 
      className=" relative"
      whileHover={{ y: -2 }}
    >
      <button
        className="flex  items-center cursor-pointer hover:text-purple-600 text-nowrap gap-2 px-3 py-3 text-gray-700 font-medium transition-colors text-base"
        onClick={() => setOpenCategory(openCategory === category.id ? null : category.id)}
      >
        {getIconComponent(category.icon_name)}
        <span>{category.name}</span>
        <FaChevronDown
          className={`text-sm transition-transform ${openCategory === category.id ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {openCategory === category.id && (
          <CategoryDropdown category={category} />
        )}
      </AnimatePresence>
    </motion.div>
  ))}

  {/* Other Categories */}
  {otherCategories.length > 0 && (
    <motion.div 
      className="relative"
      whileHover={{ y: -2 }}
    >
      <button
        className="flex cursor-pointer hover:text-purple-600 text-nowrap items-center gap-2 px-3 py-3 text-gray-700 font-medium transition-colors text-base"
        onClick={() => setOpenCategory(openCategory === -1 ? null : -1)}
      >
        <ReactIcons.FaEllipsisH className="w-5 h-5 text-yellow-500" />
        <span>Other Products</span>
        <FaChevronDown
          className={`text-sm transition-transform ${openCategory === -1 ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {openCategory === -1 && <OtherAccessoriesDropdown />}
      </AnimatePresence>
    </motion.div>
  )}

  {/* Contact Us Link */}
  <motion.div whileHover={{ y: -2 }}>
    <Link
      to="/contact"
      className="flex items-center gap-2 px-3 py-3 text-nowrap text-gray-700 hover:text-purple-600 font-medium transition-colors hover:bg-purple-50 text-base"
    >
      <LuContact className="w-5 h-5 text-green-500" />
      Contact Us
    </Link>
  </motion.div>

</div>
</div>

      {/* Mobile Menu */}
<AnimatePresence>
  {isMobileMenuOpen && (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: '80vh' }} // Set a fixed height (e.g., 80% of viewport)
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="lg:hidden bg-white shadow-lg fixed top-32 left-0 right-0 overflow-y-auto z-40"
      style={{ maxHeight: 'calc(100vh - 8rem)' }} // Ensure it doesn't go below screen
    >
      <div className="px-4 py-6 space-y-6">
        {/* Mobile Navigation Links */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Link
              to="/products"
              className="flex items-center justify-center space-x-2 py-3 px-4 bg-purple-50 text-purple-600 rounded-lg shadow-sm text-base font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <ReactIcons.FaBoxOpen className="w-5 h-5" />
              <span>All Products</span>
            </Link>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Link
              to="/contact"
              className="flex items-center justify-center space-x-2 py-3 px-4 bg-gray-50 text-green-500 hover:bg-purple-50 hover:text-purple-600 rounded-lg shadow-sm text-base font-medium transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <LuContact className="w-5 h-5 text-green-500" />
              <span>Contact Us</span>
            </Link>
          </motion.div>
        </div>

        {/* Categories and Subcategories (Mobile) */}
<motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.3 }}
  className="space-y-4 pt-4 border-t border-gray-200"
>
  {/* Main Categories */}
  {mainCategories.map((category, index) => (
    <motion.div
      key={category.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 + index * 0.05 }}
      className="bg-white rounded-lg shadow-sm overflow-hidden"
    >
      <button
        className="flex cursor-pointer items-center justify-between w-full py-4 px-5 text-gray-700 font-medium text-base"
        onClick={() => setOpenMobileCategory(openMobileCategory === category.id ? null : category.id)}
      >
        <div className="flex items-center space-x-3">
          {getIconComponent(category.icon_name)}
          <span>{category.name}</span>
        </div>
        <motion.div
          animate={{ rotate: openMobileCategory === category.id ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <FaChevronRight className="text-sm" />
        </motion.div>
      </button>

      <AnimatePresence>
        {openMobileCategory === category.id && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="pl-8 bg-gray-50 overflow-hidden"
          >
            {getSubcategoriesByCategory(category.id).map((subcategory) => {
              const subcategoryProducts = getProductsBySubcategory(subcategory.id);
              return (
                <div key={subcategory.id} className="pl-4">
                  <p className="flex font-bold items-center space-x-3 py-3 px-4 text-sm text-gray-600">
                    {getIconComponent(subcategory.icon_name)}
                    <span>{subcategory.name}</span>
                  </p>

                  {/* Products under this subcategory */}
                  {subcategoryProducts.length > 0 && (
                    <div className="pl-6">
                      {subcategoryProducts.map((product) => (
                        <Link
                          key={product.id}
                          to={`/product/${product.id}`}
                          className="block py-1 text-xs text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded"
                        >
                          - {product.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  ))}

  {/* Other Accessories (only once) */}
  {otherCategories.length > 0 && (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white rounded-lg shadow-sm overflow-hidden"
    >
      <button
        className="flex items-center justify-between w-full py-4 px-5 text-gray-700 font-medium text-base"
        onClick={() => setOpenMobileCategory(openMobileCategory === -1 ? null : -1)}
      >
        <div className="flex items-center space-x-3">
          <ReactIcons.FaEllipsisH className="w-5 h-5 text-yellow-500" />
          <span>Other Products</span>
        </div>
        <motion.div
          animate={{ rotate: openMobileCategory === -1 ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <FaChevronRight className="text-sm" />
        </motion.div>
      </button>

      <AnimatePresence>
        {openMobileCategory === -1 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="pl-8 bg-gray-50 overflow-hidden"
          >
            {otherCategories.map((category) => (
              <div key={category.id} className="pl-4">
                <p className="flex font-bold items-center space-x-3 py-3 px-4 text-sm text-gray-600">
                  {getIconComponent(category.icon_name)}
                  <span>{category.name}</span>
                </p>

                {getSubcategoriesByCategory(category.id).map((subcategory) => {
                  const subcategoryProducts = getProductsBySubcategory(subcategory.id);
                  return (
                    <div key={subcategory.id} className="pl-4">
                      <p className="flex items-center space-x-3 py-2 px-4 text-xs text-gray-600">
                        {getIconComponent(subcategory.icon_name)}
                        <span>{subcategory.name}</span>
                      </p>
                      {subcategoryProducts.length > 0 && (
                        <div className="pl-6">
                          {subcategoryProducts.map((product) => (
                            <Link
                              key={product.id}
                              to={`/product/${product.id}`}
                              className="block py-1 text-xs text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded"
                            >
                              - {product.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )}
</motion.div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
    <div className="lg:hidden pt-32" />
    </>
  );
};

export default Navbar;