import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaShoppingCart, FaUser, FaPhone, FaChevronDown, FaChevronRight } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import * as ReactIcons from 'react-icons/fa';

interface Category {
  id: number;
  name: string;
  icon_name: string;
}

interface Product {
  id: number;
  name: string;
  category_id: number;
}

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [, setIsSearchOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);
  const { getTotalItems } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, productsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/categories'),
          axios.get('http://localhost:5000/api/products?limit=100')
        ]);
        setCategories(categoriesRes.data);
        setProducts(productsRes.data.products || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  const handleCall = () => {
    window.location.href = 'tel:0741238738';
  };

  const getIconComponent = (iconName: string) => {
    const IconComponent = (ReactIcons as any)[iconName];
    return IconComponent ? <IconComponent className="w-4 h-4" /> : <ReactIcons.FaBox className="w-4 h-4" />;
  };

  const getProductsByCategory = (categoryId: number) => {
    return products.filter(product => product.category_id === categoryId).slice(0, 8); // Limit to 8 products
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">PP</span>
            </div>
            <span className="text-xl font-bold text-gray-800">Pixel Pro</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-purple-600 transition-colors">
              Home
            </Link>
            <Link to="/products" className="text-gray-600 hover:text-purple-600 transition-colors">
              Products
            </Link>
            
            {/* Categories Dropdown */}
            <div className="relative group">
              <button
                className="flex items-center space-x-1 text-gray-600 hover:text-purple-600 transition-colors"
                onMouseEnter={() => setIsCategoriesOpen(true)}
                onMouseLeave={() => setIsCategoriesOpen(false)}
              >
                <span>Categories</span>
                <FaChevronDown className="text-xs" />
              </button>
              
              {/* Categories Dropdown Menu */}
              <div
                className={`absolute top-full left-0 mt-2 bg-white shadow-lg rounded-lg py-2 z-50 transition-all duration-200 ${
                  isCategoriesOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                }`}
                onMouseEnter={() => setIsCategoriesOpen(true)}
                onMouseLeave={() => setIsCategoriesOpen(false)}
              >
                {categories.map((category) => {
                  const categoryProducts = getProductsByCategory(category.id);
                  return (
                    <div
                      key={category.id}
                      className="relative group/category"
                      onMouseEnter={() => setHoveredCategory(category.id)}
                      onMouseLeave={() => setHoveredCategory(null)}
                    >
                      <div className="flex items-center justify-between px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors">
                        <Link
                          to={`/products?category=${encodeURIComponent(category.name)}`}
                          className="flex items-center space-x-2 flex-1"
                        >
                          {getIconComponent(category.icon_name)}
                          <span>{category.name}</span>
                        </Link>
                        {categoryProducts.length > 0 && (
                          <FaChevronRight className="text-xs text-gray-400" />
                        )}
                      </div>
                      
                      {/* Products Submenu */}
                      {categoryProducts.length > 0 && hoveredCategory === category.id && (
                        <div className="absolute left-full top-0 ml-1 bg-white shadow-lg rounded-lg py-2 min-w-64 z-50">
                          <div className="px-3 py-2 border-b border-gray-200">
                            <h3 className="text-sm font-semibold text-gray-800">{category.name} Products</h3>
                          </div>
                          <div className="max-h-64 overflow-y-auto">
                            {categoryProducts.map((product) => (
                              <Link
                                key={product.id}
                                to={`/product/${product.id}`}
                                className="block px-3 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                              >
                                {product.name}
                              </Link>
                            ))}
                            {categoryProducts.length === 8 && (
                              <Link
                                to={`/products?category=${encodeURIComponent(category.name)}`}
                                className="block px-3 py-2 text-sm text-purple-600 hover:bg-purple-50 font-medium transition-colors"
                              >
                                View all {category.name} products →
                              </Link>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            
            <button
              onClick={handleCall}
              className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors"
            >
              <FaPhone className="text-sm" />
              <span>Call Us</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-600"
              >
                <FaSearch />
              </button>
            </form>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Link to="/cart" className="relative text-gray-600 hover:text-purple-600 transition-colors">
              <FaShoppingCart className="text-xl" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </Link>

            {/* Admin/User */}
            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors">
                  <FaUser className="text-xl" />
                  <span className="hidden sm:block">{user.fullName}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link
                    to="/admin"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/admin/login"
                className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors"
              >
                <FaUser className="text-xl" />
                <span className="hidden sm:block">Admin</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 