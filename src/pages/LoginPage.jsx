import React, { useState, useEffect } from 'react';
import { FaShoppingCart, FaUser, FaLock, FaEye, FaEyeSlash, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext'; // Import the context hook

const LoginPage = () => {
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  
  // Use the context
  const { login } = useShop();

  // Auto-hide toast after 3 seconds
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast({ show: false, message: '', type: '' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simple validation
    const newErrors = {};
    if (!email.trim()) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      try {
        // Get users from localStorage
        const users = JSON.parse(localStorage.getItem('shopHubUsers') || '[]');
        
        // Find user by email
        const user = users.find(u => u.email === email);
        
        if (!user) {
          // User not found
          setToast({
            show: true,
            message: 'Account not available. Please sign up.',
            type: 'error'
          });
          setIsLoading(false);
          return;
        }
        
        // Check password
        if (user.password !== password) {
          // Invalid password
          setToast({
            show: true,
            message: 'Invalid User ID or password.',
            type: 'error'
          });
          setIsLoading(false);
          return;
        }
        
        // Login successful
        // Remove password from user object before storing
        const { password: userPassword, ...userWithoutPassword } = user;
        
        // Update context with user data
        login(userWithoutPassword);
        
        // Show success toast
        setToast({
          show: true,
          message: 'Login successful! Redirecting...',
          type: 'success'
        });
        
        setIsLoading(false);
        
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          window.location.href = '/product';
        }, 2000);
      } catch (error) {
        console.error('Login error:', error);
        setToast({
          show: true,
          message: 'An error occurred during login.',
          type: 'error'
        });
        setIsLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg flex items-center ${
          toast.type === 'success' ? 'bg-teal-600' : 'bg-red-600'
        }`}>
          {toast.type === 'success' ? (
            <FaCheckCircle className="text-white text-xl mr-3" />
          ) : (
            <FaExclamationCircle className="text-white text-xl mr-3" />
          )}
          <span className="text-white font-medium">{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <header className="bg-gray-800 shadow-lg py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <FaShoppingCart className="text-teal-400 text-3xl mr-2" />
            <h1 className="text-3xl font-bold text-white">ShopHub</h1>
          </div>
          <p className="text-center text-gray-300 mt-1">Your premium shopping destination</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
        <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700">
          {/* Login Form Section */}
          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Welcome Back!</h2>
              <p className="text-gray-400">Sign in to access your account</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="text-gray-500" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={`w-full pl-10 pr-3 py-3 bg-gray-700 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition text-white ${
                      errors.email ? 'border-red-500' : 'border-gray-600'
                    }`}
                  />
                </div>
                {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-500" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-10 py-3 bg-gray-700 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition text-white ${
                      errors.password ? 'border-red-500' : 'border-gray-600'
                    }`}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="text-gray-500 hover:text-gray-300" />
                    ) : (
                      <FaEye className="text-gray-500 hover:text-gray-300" />
                    )}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password}</p>}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-teal-500 focus:ring-teal-500 border-gray-600 rounded bg-gray-700"
                  />
                  <label htmlFor="remember" className="ml-2 block text-sm text-gray-300">
                    Remember me
                  </label>
                </div>
                <a href="#" className="text-sm font-medium text-teal-400 hover:text-teal-300">
                  Forgot password?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-medium py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing In...
                  </>
                ) : 'Sign In'}
              </button>

              {/* Signup Link */}
              <div className="text-center mt-6">
                <p className="text-gray-400">
                  Don't have an account?{' '}
                  <Link to="/signup" className="text-teal-400 hover:text-teal-300 font-medium">
                    Sign up
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 py-6 border-t border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2023 ShopHub. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-teal-400 text-sm">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-teal-400 text-sm">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-teal-400 text-sm">Help Center</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;