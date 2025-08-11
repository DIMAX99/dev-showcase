'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

/**
 * REGISTER PAGE COMPONENT
 * 
 * This is the main registration page with dark theme and tech background
 * 
 * CONNECTIONS:
 * - Currently NOT connected to backend API (you'll need to add API calls)
 * - Form validation is basic (you can enhance it)
 * - Redirects to login page after registration (change redirect path as needed)
 * 
 * TO CUSTOMIZE:
 * - Change background image by modifying the backgroundImage URL in the style prop
 * - Modify form fields in the JSX below (add/remove fields as needed)
 * - Add API integration in the handleSubmit function
 * - Update redirect path after successful registration
 * - Customize styling in the className attributes
 * - Add password confirmation validation
 */

export default function RegisterPage() {
  // Next.js router for navigation after successful registration
  const router = useRouter();
  
  // State management for form data
  const [formData, setFormData] = useState({
    name: '', // User's full name
    email: '', // User's email address
    password: '', // User's password
    confirmPassword: '' // Password confirmation
  });

  // State for loading and error handling
  const [isLoading, setIsLoading] = useState(false); // Shows loading state during API call
  const [error, setError] = useState(''); // Stores error messages to display to user
  const [success, setSuccess] = useState(''); // Stores success messages to display to user

  // Check if user is already authenticated when component mounts
  useEffect(() => {
    // Function to check if user is already logged in
    const checkExistingAuth = () => {
      try {
        // Check for existing JWT token in localStorage
        const token = localStorage.getItem('authToken');
        if (token) {
          // User is already authenticated, redirect to home
          console.log('User already authenticated, redirecting to home');
          router.push('/home');
        }
      } catch (error) {
        // Handle any errors in checking authentication
        console.error('Error checking existing authentication:', error);
        // Clear potentially corrupted data
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      }
    };

    // Call the authentication check function
    checkExistingAuth();
  }, [router]); // Dependency array includes router

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Basic form validation
  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    // Client-side validation
    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      // TODO: Add API call to backend here
      // Example:
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        }),
      });
      
      console.log('Register form submitted:', formData);
      
      // TODO: Handle successful registration
      // - Show success message
      // - Redirect to login page
      // - Clear form
      setSuccess('Registration successful! Please login.');
      
    } catch (err) {
      setError('Registration failed. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-gray-900 relative overflow-hidden py-8"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Background overlay for better text readability */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      
      {/* Register Card */}
      <div className="relative z-10 w-full max-w-md p-8">
        <div className="bg-gray-800 bg-opacity-90 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-gray-700">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-gray-300">Join our community today</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-900 bg-opacity-50 border border-red-500 rounded-lg text-red-300 text-sm">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-3 bg-green-900 bg-opacity-50 border border-green-500 rounded-lg text-green-300 text-sm">
              {success}
            </div>
          )}

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="Enter your full name"
              />
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="Enter your email"
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="Create a password"
              />
              <p className="text-xs text-gray-400 mt-1">Must be at least 6 characters long</p>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="Confirm your password"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg font-medium transition duration-200 ${
                isLoading
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50'
              } text-white`}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Already have an account?{' '}
              <Link 
                href="/login" 
                className="text-blue-400 hover:text-blue-300 font-medium transition duration-200"
              >
                Sign in here
              </Link>
            </p>
          </div>

          {/* Terms and Privacy */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              By creating an account, you agree to our{' '}
              <Link href="#" className="text-blue-400 hover:text-blue-300">Terms of Service</Link>
              {' '}and{' '}
              <Link href="#" className="text-blue-400 hover:text-blue-300">Privacy Policy</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
