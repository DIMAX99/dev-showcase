'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * AUTHENTICATED HOME PAGE COMPONENT
 * 
 * This page is shown to users after they successfully log in
 * 
 * CONNECTIONS:
 * - Accessed after successful login from login page
 * - Should check for authentication token/state
 * - Currently displays simple "hello world" as requested
 * 
 * TO CUSTOMIZE:
 * - Add user dashboard content here
 * - Add blog listing or creation features
 * - Add user profile information
 * - Add logout functionality
 * - Connect to user context/state management
 */

export default function HomePage() {
  // Next.js router for navigation
  const router = useRouter();
  
  // State for user authentication check
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // State for loading while checking authentication
  const [isLoading, setIsLoading] = useState(true);

  // State for user data from stored session - typed as any for flexibility
  const [userData, setUserData] = useState<any>(null);

  // Empty function for form submission
  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add blog submission logic here
    const formData = new FormData(e.target as HTMLFormElement);
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const tags = formData.get('tags') as string;
    const taglist = tags.split(',').map(tag => tag.trim());

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:5000/api/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          content,
          tags: taglist
        })
      });

      if (response.ok) {
        const newBlog = await response.json(); 
        console.log('Blog created successfully:', newBlog);
        // Reset form
        (e.target as HTMLFormElement).reset();
      } else {
        console.error('Failed to create blog');
      }
    } catch (error) {
      console.error('Error creating blog:', error);
    }
  };

  // Check if user is authenticated when component mounts
  useEffect(() => {
    // Function to check authentication status
    const checkAuth = () => {
      try {
        // Check for JWT token in localStorage (session persistence)
        const token = localStorage.getItem('authToken');
        // Get stored user data
        const storedUserData = localStorage.getItem('userData');
        
        if (token && storedUserData) {
          // Token exists - user is authenticated
          setIsAuthenticated(true);
          // Parse and set user data
          setUserData(JSON.parse(storedUserData));
          console.log('User authenticated from stored session');
        } else {
          // No token found - redirect to login
          console.log('No authentication token found, redirecting to login');
          router.push('/login');
        }
      } catch (error) {
        // Handle authentication error (corrupted data, etc.)
        console.error('Authentication check failed:', error);
        // Clear corrupted data
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        // Redirect to login on error
        router.push('/login');
      } finally {
        // Set loading to false after check is complete
        setIsLoading(false);
      }
    };

    // Call the authentication check function
    checkAuth();
  }, [router]); // Dependency array includes router

  // Handle logout functionality
  const handleLogout = () => {
    try {
      // Clear authentication data from localStorage (destroys session)
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      
      // Clear user state
      setUserData(null);
      setIsAuthenticated(false);
      
      // Log logout action
      console.log('User logged out successfully');
      
      // Navigate back to login page
      router.push('/login');
    } catch (error) {
      // Handle logout error
      console.error('Logout failed:', error);
      // Force redirect even if error occurs
      router.push('/login');
    }
  };

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        {/* Loading container */}
        <div className="text-center">
          {/* Loading spinner */}
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          {/* Loading text */}
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login redirect if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        {/* Not authenticated container */}
        <div className="text-center">
          {/* Error message */}
          <p className="text-red-600 mb-4">Access denied. Please log in.</p>
          {/* Redirect message */}
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Main authenticated home page content
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navigation/Header section with dark theme */}
      <header className="bg-gray-800 shadow-lg border-b border-gray-700">
        {/* Header container with max width and padding */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header content - flex layout */}
          <div className="flex justify-between items-center py-4">
            {/* Logo/Brand section */}
            <div className="flex items-center">
              {/* Brand name with dark theme styling */}
              <h1 className="text-2xl font-bold text-white">DevPost Blog</h1>
            </div>
            
            {/* Navigation and user actions section */}
            <div className="flex items-center space-x-4">
              {/* Profile button */}
              <button
                onClick={() => router.push('/profile')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200 flex items-center space-x-2"
              >
                {/* Profile icon */}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Profile</span>
              </button>
              
              {/* Welcome message with user's name if available */}
              <span className="text-gray-300">
                Welcome back{userData?.name ? `, ${userData.name}` : ''}!
              </span>
              
              {/* Logout button */}
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content area with dark theme */}
      <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Blog creation section - Twitter-like interface */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6 border border-gray-700">
          {/* Create blog header */}
          <div className="flex items-center mb-4">
            {/* User avatar placeholder */}
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4">
              <span className="text-white font-bold text-lg">
                {userData?.name ? userData.name.charAt(0).toUpperCase() : 'U'}
              </span>
            </div>
            {/* Create blog title */}
            <h2 className="text-xl font-semibold text-white">Create a new blog post</h2>
          </div>
          
          {/* Blog creation form */}
          <form onSubmit={handleBlogSubmit} className="space-y-4">
            {/* Blog title input */}
            <div>
              <input
                type="text"
                id='title'
                name='title'
                placeholder="What's the title of your blog post?"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-lg"
              />
            </div>
            
            {/* Blog content textarea - Twitter-like */}
            <div>
              <textarea
                id='content'
                name='content'
                placeholder="What's on your mind? Share your thoughts..."
                rows={4}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 resize-none"
              />
            </div>
            
            {/* Tags input */}
            <div>
              <input
                type="text"
                id='tags'
                name='tags'
                placeholder="Add tags (separated by commas)"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              />
            </div>
            
            {/* Action buttons row */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-600">
              {/* Left side - character count and options */}
              <div className="flex items-center space-x-4 text-gray-400">
                {/* Character count placeholder */}
                <span className="text-sm">0 characters</span>

                {/* Attach options */}
                <div className="flex space-x-2">
                  {/* Image icon */}
                  <button type="button" className="p-2 hover:bg-gray-700 rounded-full transition duration-200">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </button>
                  
                  {/* Link icon */}
                  <button type="button" className="p-2 hover:bg-gray-700 rounded-full transition duration-200">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </button>
                </div> 
              </div>
              
              {/* Right side - publish button */}
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-medium transition duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed">
                Publish
              </button>
            </div>
          </form>
        </div>
        
        {/* Blog feed section placeholder */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
          {/* Feed header */}
          <div className="border-b border-gray-600 pb-4 mb-6">
            <h2 className="text-2xl font-bold text-white">Recent Blog Posts</h2>
            <p className="text-gray-400 mt-2">Discover the latest posts from the community</p>
          </div>
          
          {/* Placeholder for blog posts */}
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              {/* Blog icon */}
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No blog posts yet</h3>
            <p className="text-gray-500">Be the first to share your thoughts with the community!</p>
            
            {/* TODO comment for future development */}
            <div className="mt-8 p-4 bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-400">
                TODO: Blog feed will be implemented here - showing all blog posts from users
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
