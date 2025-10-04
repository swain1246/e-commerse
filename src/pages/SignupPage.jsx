import React, { useState, useEffect } from 'react';
import { FaShoppingCart, FaUser, FaLock, FaEye, FaEyeSlash, FaEnvelope, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const SignupPage = () => {
  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  // Auto-hide toast after 3 seconds
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast({ show: false, message: '', type: '' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Check if user already exists
      const existingUsers = JSON.parse(localStorage.getItem('shopHubUsers') || '[]');
      const userExists = existingUsers.some(user => user.email === formData.email);
      
      if (userExists) {
        setToast({
          show: true,
          message: 'An account with this email already exists.',
          type: 'error'
        });
        setIsLoading(false);
        return;
      }
      
      // Create new user
      const newUser = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString()
      };
      
      // Save to localStorage
      localStorage.setItem('shopHubUsers', JSON.stringify([...existingUsers, newUser]));
      
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
      setErrors({});
      setIsLoading(false);
      
      // Show success toast
      setToast({
        show: true,
        message: 'Account created successfully! Redirecting to login...',
        type: 'success'
      });
      
      // Redirect to login page after 2 seconds
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
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
          {/* Signup Form Section */}
          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
              <p className="text-gray-400">Join ShopHub to start your shopping journey</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name Input */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="text-gray-500" />
                  </div>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className={`w-full pl-10 pr-3 py-3 bg-gray-700 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition text-white ${
                      errors.fullName ? 'border-red-500' : 'border-gray-600'
                    }`}
                  />
                </div>
                {errors.fullName && <p className="mt-1 text-sm text-red-400">{errors.fullName}</p>}
              </div>

              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-500" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
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
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
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
                <p className="mt-1 text-xs text-gray-400">Must be at least 8 characters</p>
              </div>

              {/* Confirm Password Input */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-500" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-10 py-3 bg-gray-700 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition text-white ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-600'
                    }`}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <FaEyeSlash className="text-gray-500 hover:text-gray-300" />
                    ) : (
                      <FaEye className="text-gray-500 hover:text-gray-300" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>}
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    type="checkbox"
                    required
                    className="h-4 w-4 text-teal-500 focus:ring-teal-500 border-gray-600 rounded bg-gray-700"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="text-gray-300">
                    I agree to the{' '}
                    <a href="#" className="text-teal-400 hover:text-teal-300">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-teal-400 hover:text-teal-300">
                      Privacy Policy
                    </a>
                  </label>
                </div>
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
                    Creating Account...
                  </>
                ) : 'Create Account'}
              </button>

              {/* Login Link */}
              <div className="text-center">
                <a href="/" className="text-teal-400 hover:text-teal-300 font-medium">
                  Already have an account? Sign in
                </a>
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

export default SignupPage;