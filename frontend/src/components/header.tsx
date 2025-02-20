'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Header() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem('accessToken');
      const tokenExpiry = localStorage.getItem('tokenExpiry');
      const isAuthed = Boolean(token && tokenExpiry && Date.now() < parseInt(tokenExpiry));
      setIsAuthenticated(isAuthed);
    };

    // Check initially
    checkAuthStatus();

    // Add event listener for storage changes
    window.addEventListener('storage', checkAuthStatus);

    return () => {
      window.removeEventListener('storage', checkAuthStatus);
    };
  }, []);

  const handleSignOut = async () => {
    // Clear auth tokens
    localStorage.removeItem('accessToken');
    localStorage.removeItem('idToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('tokenExpiry');
    setIsAuthenticated(false);
    router.push('/login');
  };

  const title = 'Home Energy Monitoring App';

  return (
    <header className="w-full bg-white shadow-sm">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <Link 
            href="/" 
            className="text-xl font-medium text-gray-900 hover:text-blue-600 transition-colors"
          >
            {title}
          </Link>

          {/* Navigation */}
          <nav className="flex gap-4">
            {isAuthenticated ? (
              <button
                onClick={handleSignOut}
                className="inline-flex items-center justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Sign out
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/sign-up"
                  className="inline-flex items-center justify-center py-2 px-4 border border-blue-600 text-sm font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Sign up
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
