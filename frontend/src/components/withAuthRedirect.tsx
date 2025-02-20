'use client';
import { useEffect, ComponentType, useState } from 'react';
import { AlreadyLoggedInPopup } from './AlreadyLoggedInPopup';

export function withAuthRedirect<P extends object>(Component: ComponentType<P>) {
  return function WrappedComponent(props: P) {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
      const checkAuth = async () => {
        try {
          const token = localStorage.getItem('accessToken');
          const tokenExpiry = localStorage.getItem('tokenExpiry');
          const isAuthed = Boolean(token && tokenExpiry && Date.now() < parseInt(tokenExpiry));
          setIsAuthenticated(isAuthed);
          console.log('isAuthenticated', isAuthenticated);
          
          if (isAuthed) {
            setShowPopup(true);
          }
        } catch (error) {
          console.error('Auth check failed:', error);
        } finally {
          setIsLoading(false);
        }
      };

      checkAuth();
    }, []);

    const handleSignOut = () => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('tokenExpiry');
      setIsAuthenticated(false);
      console.log('isAuthenticated', isAuthenticated);
      setShowPopup(false);
    };

    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (showPopup) {
      return <AlreadyLoggedInPopup onSignOut={handleSignOut} />;
    }

    return <Component {...props} />;
  };
} 