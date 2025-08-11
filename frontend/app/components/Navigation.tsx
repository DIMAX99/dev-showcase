import Link from 'next/link';

/**
 * NAVIGATION COMPONENT
 * 
 * Simple navigation bar for moving between pages
 * 
 * TO CUSTOMIZE:
 * - Add more navigation links as needed
 * - Change styling/colors
 * - Add authentication state to show different links for logged-in users
 * - Add active link highlighting
 */

export default function Navigation() {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo/Brand */}
        <Link href="/" className="text-xl font-bold hover:text-blue-400 transition duration-200">
          DevPost Blog
        </Link>

        {/* Navigation Links */}
        <div className="flex space-x-4">
          <Link 
            href="/" 
            className="hover:text-blue-400 transition duration-200 px-3 py-2 rounded"
          >
            Home
          </Link>
          <Link 
            href="/login" 
            className="hover:text-blue-400 transition duration-200 px-3 py-2 rounded"
          >
            Login
          </Link>
          <Link 
            href="/register" 
            className="bg-blue-600 hover:bg-blue-700 transition duration-200 px-4 py-2 rounded"
          >
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
}
