'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * USER PROFILE PAGE COMPONENT
 * 
 * This page shows the user's profile information and their blog posts
 * 
 * CONNECTIONS:
 * - Accessed from home page via profile button
 * - Requires authentication to access
 * - Shows user data and personal blog posts
 * 
 * TO CUSTOMIZE:
 * - Add more profile fields (bio, social links, etc.)
 * - Add profile picture upload functionality
 * - Add user's blog posts listing
 * - Add profile editing capabilities
 * - Connect to user API endpoints for data updates
 */

export default function ProfilePage() {
  // Next.js router for navigation
  const router = useRouter();
  
  // State for user authentication check
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // State for loading while checking authentication
  const [isLoading, setIsLoading] = useState(true);

  // State for user data from stored session - typed as any for flexibility
  const [userData, setUserData] = useState<any>(null);

  // State for edit mode
  const [isEditing, setIsEditing] = useState(false);

  // State for editable user data
  const [editData, setEditData] = useState({
    name: '',
    email: '',
    bio: ''
  });

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
          const parsedUserData = JSON.parse(storedUserData);
          setUserData(parsedUserData);
          // Initialize edit data with current user data
          setEditData({
            name: parsedUserData.name || '',
            email: parsedUserData.email || '',
            bio: parsedUserData.bio || ''
          });
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

  // Handle back to home navigation
  const handleBackToHome = () => {
    // Navigate back to authenticated home page
    router.push('/home');
  };

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

  // Handle edit mode toggle
  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing - reset edit data to original values
      setEditData({
        name: userData.name || '',
        email: userData.email || '',
        bio: userData.bio || ''
      });
    }
    // Toggle edit mode
    setIsEditing(!isEditing);
  };

  // Handle input changes in edit mode
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // Update edit data state
    setEditData({
      ...editData,
      [e.target.name]: e.target.value
    });
  };

  // Handle save profile changes
  const handleSaveProfile = () => {
    try {
      // TODO: Make API call to update user profile
      // const response = await fetch('/api/user/update', {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      //   },
      //   body: JSON.stringify(editData)
      // });
      
      // For now, just update local storage
      const updatedUserData = { ...userData, ...editData };
      localStorage.setItem('userData', JSON.stringify(updatedUserData));
      setUserData(updatedUserData);
      
      // Exit edit mode
      setIsEditing(false);
      
      console.log('Profile updated successfully');
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        {/* Loading container */}
        <div className="text-center">
          {/* Loading spinner */}
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          {/* Loading text */}
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login redirect if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        {/* Not authenticated container */}
        <div className="text-center">
          {/* Error message */}
          <p className="text-red-400 mb-4">Access denied. Please log in.</p>
          {/* Redirect message */}
          <p className="text-gray-300">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Main profile page content
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navigation/Header section with dark theme */}
      <header className="bg-gray-800 shadow-lg border-b border-gray-700">
        {/* Header container with max width and padding */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header content - flex layout */}
          <div className="flex justify-between items-center py-4">
            {/* Left side - back button and title */}
            <div className="flex items-center space-x-4">
              {/* Back to home button */}
              <button
                onClick={handleBackToHome}
                className="text-gray-300 hover:text-white transition duration-200 flex items-center space-x-2"
              >
                {/* Back arrow icon */}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Back to Home</span>
              </button>
              
              {/* Page title */}
              <h1 className="text-2xl font-bold text-white">Profile</h1>
            </div>
            
            {/* Right side - logout button */}
            <div className="flex items-center space-x-4">
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

      {/* Main content area */}
      <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Profile information card */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6 border border-gray-700">
          {/* Profile header */}
          <div className="flex items-start justify-between mb-6">
            {/* Profile info section */}
            <div className="flex items-center space-x-6">
              {/* User avatar */}
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-2xl">
                  {userData?.name ? userData.name.charAt(0).toUpperCase() : 'U'}
                </span>
              </div>
              
              {/* User details */}
              <div>
                {/* User name */}
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={editData.name}
                    onChange={handleInputChange}
                    className="text-2xl font-bold bg-gray-700 text-white px-3 py-1 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <h2 className="text-2xl font-bold text-white">{userData?.name || 'User Name'}</h2>
                )}
                
                {/* User email */}
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={editData.email}
                    onChange={handleInputChange}
                    className="text-gray-300 bg-gray-700 px-3 py-1 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1 block"
                  />
                ) : (
                  <p className="text-gray-300">{userData?.email || 'user@example.com'}</p>
                )}
                
                {/* Join date */}
                <p className="text-gray-400 text-sm mt-1">
                  Joined {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
            
            {/* Edit button */}
            <div className="flex space-x-2">
              {isEditing ? (
                <>
                  {/* Save button */}
                  <button
                    onClick={handleSaveProfile}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-200"
                  >
                    Save
                  </button>
                  {/* Cancel button */}
                  <button
                    onClick={handleEditToggle}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition duration-200"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={handleEditToggle}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
          
          {/* Bio section */}
          <div className="border-t border-gray-600 pt-4">
            <h3 className="text-lg font-semibold text-white mb-2">Bio</h3>
            {isEditing ? (
              <textarea
                name="bio"
                value={editData.bio}
                onChange={handleInputChange}
                placeholder="Tell us about yourself..."
                rows={3}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            ) : (
              <p className="text-gray-300">
                {userData?.bio || 'No bio added yet. Click "Edit Profile" to add one!'}
              </p>
            )}
          </div>
        </div>
        
        {/* User's blog posts section */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
          {/* Posts header */}
          <div className="border-b border-gray-600 pb-4 mb-6">
            <h2 className="text-2xl font-bold text-white">My Blog Posts</h2>
            <p className="text-gray-400 mt-2">Your published articles and thoughts</p>
          </div>
          
          {/* Placeholder for user's blog posts */}
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              {/* Blog icon */}
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No blog posts yet</h3>
            <p className="text-gray-500 mb-4">Start writing and share your thoughts with the world!</p>
            
            {/* Go to home to create post button */}
            <button
              onClick={handleBackToHome}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition duration-200"
            >
              Create Your First Post
            </button>
            
            {/* TODO comment for future development */}
            <div className="mt-8 p-4 bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-400">
                TODO: User's blog posts will be displayed here - fetched from API
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
