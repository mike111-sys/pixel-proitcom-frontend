import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaBox, FaTags, FaSignOutAlt, FaLock, FaBars } from 'react-icons/fa';
import ProductManagement from '../components/admin/ProductManagement';
import CategoryManagement from '../components/admin/CategoryManagement';
import ChangePassword from '../components/admin/ChangePassword';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/admin/login');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                className="lg:hidden mr-2 text-gray-600 hover:text-purple-600"
                onClick={toggleSidebar}
              >
                <FaBars className="h-6 w-6" />
              </button>
          
              <h1 className="text-xl hidden sm:block font-semibold text-gray-900">Pixel Pro Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 hidden sm:inline">Welcome, {user.fullName}</span>
              <Link
                to="/admin/change-password"
                className="flex items-center text-gray-600 hover:text-purple-600 transition-colors"
              >
                <FaLock className="mr-2" />
                <span className="hidden sm:inline">Change Password</span>
                <span className="sm:hidden">Password</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center cursor-pointer text-gray-600 hover:text-red-600 transition-colors"
              >
                <FaSignOutAlt className="mr-2" />
                <span className="hidden sm:inline">Logout</span>
                <span className="sm:hidden">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 w-64 bg-white shadow-sm transform lg:transform-none lg:static lg:min-h-screen transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 z-50`}
        >
          <div className="flex justify-between items-center p-4 lg:hidden">
            <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
            <button
              className="text-gray-600 hover:text-purple-600"
              onClick={toggleSidebar}
            >
              <FaBars className="h-6 w-6" />
            </button>
          </div>
          <nav className="mt-8 lg:mt-8">
            <div className="px-4 space-y-2">
              <Link
                to="/admin"
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  location.pathname === '/admin'
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <FaBox className="mr-3" />
                Dashboard
              </Link>
              <Link
                to="/admin/products"
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  location.pathname.startsWith('/admin/products')
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <FaBox className="mr-3" />
                Products
              </Link>
              <Link
                to="/admin/categories"
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  location.pathname.startsWith('/admin/categories')
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <FaTags className="mr-3" />
                Categories
              </Link>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Routes>
            <Route path="/" element={<DashboardOverview />} />
            <Route path="/products/*" element={<ProductManagement />} />
            <Route path="/categories/*" element={<CategoryManagement />} />
            <Route path="/change-password" element={<ChangePassword />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

// Dashboard Overview Component
const DashboardOverview = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    featuredProducts: 0,
    newProducts: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {

      const API_URL = import.meta.env.VITE_API_URL;


      try {
        const [productsRes, categoriesRes, featuredRes, newRes] = await Promise.all([
          fetch(`${API_URL}/api/products?limit=1`),
          fetch(`${API_URL}/api/categories`),
          fetch(`${API_URL}/api/products/featured`),
          fetch(`${API_URL}/api/products/new`),
        ]);

        const [productsData, categoriesData, featuredData, newData] = await Promise.all([
          productsRes.json(),
          categoriesRes.json(),
          featuredRes.json(),
          newRes.json(),
        ]);

        setStats({
          totalProducts: productsData.pagination?.totalProducts || 0,
          totalCategories: categoriesData.length || 0,
          featuredProducts: featuredData.length || 0,
          newProducts: newData.length || 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <FaBox className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-xl sm:text-2xl font-semibold text-gray-900">{stats.totalProducts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <FaTags className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Categories</p>
              <p className="text-xl sm:text-2xl font-semibold text-gray-900">{stats.totalCategories}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <FaBox className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Featured Products</p>
              <p className="text-xl sm:text-2xl font-semibold text-gray-900">{stats.featuredProducts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <FaBox className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">New Products</p>
              <p className="text-xl sm:text-2xl font-semibold text-gray-900">{stats.newProducts}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link
              to="/admin/products"
              className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-gray-700">Manage Products</span>
              <FaBox className="text-gray-400" />
            </Link>
            <Link
              to="/admin/categories"
              className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-gray-700">Manage Categories</span>
              <FaTags className="text-gray-400" />
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="text-purple-600 text-sm">
            <p>Welcome to Pixel Pro Admin Dashboard!</p>
            <p className="mt-2">Use the sidebar to navigate between different sections.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;