import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/admin');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(username, password);
      if (!success) {
        setError('Invalid username or password');
      }
    } catch (error) {
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-200 via-yellow-100 to-yellow-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        className="max-w-md w-full space-y-8"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div>
          <motion.div 
            className="mb-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link 
              to="/" 
              className="inline-flex items-center text-black font-semibold hover:text-yellow-800 transition-colors duration-200 bg-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg"
            >
              ← Go back Home
            </Link>
          </motion.div>
          <motion.div 
            className="text-center bg-black rounded-t-xl px-8 py-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <motion.h2 
              className="text-3xl font-extrabold text-yellow-400"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              Pixel Pro Technology Admin
            </motion.h2>
            <motion.p 
              className="mt-2 text-sm text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              Sign in to your admin account
            </motion.p>
          </motion.div>
        </div>
        
        <motion.form 
          className="space-y-0" 
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <motion.div 
            className="bg-white rounded-b-xl shadow-2xl border-4 border-black"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <AnimatePresence>
              {error && (
                <motion.div 
                  className="mx-8 mt-6 bg-yellow-100 border-2 border-black text-black px-4 py-3 rounded-lg font-semibold"
                  initial={{ opacity: 0, scale: 0.9, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="p-8 space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <label htmlFor="username" className="block text-sm font-bold text-black mb-2">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  </div>
                  <motion.input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="appearance-none relative block w-full pl-10 pr-3 py-3 border-2 border-black placeholder-gray-600 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 bg-white font-medium transition-all duration-200"
                    placeholder="Enter your username"
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <label htmlFor="password" className="block text-sm font-bold text-black mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  </div>
                  <motion.input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none relative block w-full pl-10 pr-12 py-3 border-2 border-black placeholder-gray-600 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 bg-white font-medium transition-all duration-200"
                    placeholder="Enter your password"
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  />
                  <motion.button
                    type="button"
                    className="absolute cursor-pointer inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.1 }}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="h-5 w-5 text-black hover:text-yellow-600 transition-colors" />
                    ) : (
                      <FaEye className="h-5 w-5 text-black hover:text-yellow-600 transition-colors" />
                    )}
                  </motion.button>
                </div>
              </motion.div>

              <motion.div 
                className="pt-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="group cursor-pointer relative w-full flex justify-center py-3 px-4 border-2 border-black text-lg font-bold rounded-lg text-black bg-yellow-400 hover:bg-yellow-300 focus:outline-none focus:ring-4 focus:ring-yellow-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  <AnimatePresence mode="wait">
                    {loading ? (
                      <motion.div 
                        key="loading"
                        className="animate-spin rounded-full h-6 w-6 border-b-2 border-black"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                      />
                    ) : (
                      <motion.span
                        key="signin"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                      >
                        Sign in
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;