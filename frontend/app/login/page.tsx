'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

/**
 * LOGIN PAGE COMPONENT
 * 
 * This is the main login page with dark theme and tech background
 * 
 * CONNECTIONS:
 * - Currently NOT connected to backend API (you'll need to add API calls)
 * - Form validation is basic (you can enhance it)
 * - Redirects to home page after login (change redirect path as needed)
 * 
 * TO CUSTOMIZE:
 * - Change background image by modifying the backgroundImage URL in the style prop
 * - Modify form fields in the JSX below
 * - Add API integration in the handleSubmit function
 * - Update redirect path after successful login
 * - Customize styling in the className attributes
 */

export default function LoginPage() {
  // Next.js router for navigation after successful login
  const router = useRouter();
  
  // State management for form data - stores email and password
  const [formData, setFormData] = useState({
    email: '', // User's email address
    password: '' // User's password
  });

  // State for loading and error handling during login process
  const [isLoading, setIsLoading] = useState(false); // Shows loading state during API call
  const [error, setError] = useState(''); // Stores error messages to display to user

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

  // Handle input changes - updates form state when user types
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Update the form data state with new input value
    setFormData({
      ...formData, // Spread existing form data
      [e.target.name]: e.target.value // Update the specific field that changed
    });
  };

  // Handle form submission - called when user clicks login button
  const handleSubmit = async (e: React.FormEvent) => {
    // Prevent default form submission behavior (page refresh)
    e.preventDefault();
    
    // Set loading state to true to show loading indicator
    setIsLoading(true);
    
    // Clear any previous error messages
    setError('');

    try {
      // Make API call to backend login endpoint
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST', // Use POST method for login
        headers: {
          'Content-Type': 'application/json', // Tell server we're sending JSON
        },
        body: JSON.stringify(formData), // Convert form data to JSON string
      });
      
      // Parse the JSON response from server
      const data = await response.json();
      
      // Check if login was successful (status 200-299)
      if (response.ok) {
        // Login successful - store authentication data
        
        // Store JWT token in localStorage for future API calls and session persistence
        localStorage.setItem('authToken', data.token);
        
        // Store user data in localStorage for easy access
        localStorage.setItem('userData', JSON.stringify(data.user));
        
        // Log success for debugging
        console.log('Login successful:', data);
        
        // Redirect to authenticated home page
        router.push('/home');
        
      } else {
        // Login failed - show error message from server
        setError(data.message || 'Login failed. Please try again.');
      }
      
    } catch (err) {
      // Handle network errors or other exceptions
      setError('Login failed. Please check your connection and try again.');
      console.error('Login error:', err); // Log error for debugging
    } finally {
      // Always set loading to false when request completes (success or error)
      setIsLoading(false);
    }
  };

  return (
    // Main container with full screen height, centered content, dark background
    <div 
      className="min-h-screen flex items-center justify-center bg-gray-900 relative overflow-hidden"
      style={{
        // Background image with dark overlay for better text readability
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=2025&q=80')`,
        backgroundSize: 'cover', // Make background image cover entire container
        backgroundPosition: 'center', // Center the background image
        backgroundAttachment: 'fixed' // Keep background fixed during scroll
      }}
    >
      {/* Background overlay for better text readability - adds extra dark layer */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      
      {/* Login Card - positioned above background with z-index */}
      <div className="relative z-10 w-full max-w-md p-8">
        {/* Card container with glass morphism effect and rounded corners */}
        <div className="bg-gray-800 bg-opacity-90 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-gray-700">
          {/* Header section with welcome text */}
          <div className="text-center mb-8">
            {/* Main heading */}
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            {/* Subtitle */}
            <p className="text-gray-300">Sign in to your account</p>
          </div>

          {/* Error Message - only shown when there's an error */}
          {error && (
            <div className="mb-4 p-3 bg-red-900 bg-opacity-50 border border-red-500 rounded-lg text-red-300 text-sm">
              {error} {/* Display the actual error message */}
            </div>
          )}

          {/* Login Form - handles user input and submission */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              {/* Email label */}
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              {/* Email input field */}
              <input
                type="email" // HTML5 email validation
                id="email" // Links to label
                name="email" // Used for form data key
                value={formData.email} // Controlled input - value from state
                onChange={handleChange} // Function called when user types
                required // HTML5 required validation
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="Enter your email" // Placeholder text
              />
            </div>

            {/* Password Field */}
            <div>
              {/* Password label */}
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              {/* Password input field */}
              <input
                type="password" // Hides password text
                id="password" // Links to label
                name="password" // Used for form data key
                value={formData.password} // Controlled input - value from state
                onChange={handleChange} // Function called when user types
                required // HTML5 required validation
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="Enter your password" // Placeholder text
              />
            </div>

            {/* Submit Button - changes appearance based on loading state */}
            <button
              type="submit" // Makes this button submit the form
              disabled={isLoading} // Disable button during loading
              className={`w-full py-3 px-4 rounded-lg font-medium transition duration-200 ${
                isLoading
                  ? 'bg-gray-600 cursor-not-allowed' // Disabled styles when loading
                  : 'bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50' // Normal styles
              } text-white`}
            >
              {/* Button text changes based on loading state */}
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Footer Links - navigation to other pages */}
          <div className="mt-6 text-center">
            {/* Sign up link for new users */}
            <p className="text-gray-400 text-sm">
              Don't have an account?{' '}
              {/* Link to register page */}
              <Link 
                href="/register" 
                className="text-blue-400 hover:text-blue-300 font-medium transition duration-200"
              >
                Sign up here
              </Link>
            </p>
          </div>

          {/* Optional: Forgot Password Link */}
          <div className="mt-4 text-center">
            {/* Forgot password link (currently placeholder) */}
            <Link 
              href="#" // TODO: Replace with actual forgot password page
              className="text-gray-400 hover:text-gray-300 text-sm transition duration-200"
            >
              Forgot your password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
