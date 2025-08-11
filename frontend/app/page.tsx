'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import Navigation from "./components/Navigation";

/**
 * HOME PAGE COMPONENT
 * 
 * This is the main landing page of the application
 * 
 * CONNECTIONS:
 * - Navigation component provides links to login/register
 * - Currently displays simple "hello world" message as requested
 * 
 * TO CUSTOMIZE:
 * - Replace "hello world" with actual homepage content
 * - Add hero section, features, or blog list
 * - Integrate with blog API to show recent posts
 * - Add authentication state to show different content for logged-in users
 */

export default function Home() {
  // Next.js router for navigation
  const router = useRouter();

  // Check if user is already authenticated when component mounts
  useEffect(() => {
    // Function to check if user is already logged in
    const checkExistingAuth = () => {
      try {
        // Check for existing JWT token in localStorage
        const token = localStorage.getItem('authToken');
        if (token) {
          // User is already authenticated, redirect to authenticated home
          console.log('User already authenticated, redirecting to authenticated home');
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <Navigation />
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Hello World
          </h1>
          <p className="text-gray-600 text-lg">
            Welcome to DevPost Blog Platform
          </p>
          
          {/* Optional: Add some quick links */}
          <div className="mt-8 space-x-4">
            <a 
              href="/login" 
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Get Started
            </a>
            <a 
              href="/register" 
              className="inline-block border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition duration-200"
            >
              Create Account
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
