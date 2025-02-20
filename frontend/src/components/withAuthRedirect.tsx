'use client';
import { useEffect, ComponentType, useState } from 'react';
import { AlreadyLoggedInPopup } from './AlreadyLoggedInPopup';
import { useAuthStore } from '@/store/auth.store';

export function withAuthRedirect<P extends object>(Component: ComponentType<P>) {
  return function WrappedComponent(props: P) {
    const [isLoading, setIsLoading] = useState(true);
    const [showPopup, setShowPopup] = useState(false);
    const { checkAuth, logout, initializeFromStorage } = useAuthStore();

    useEffect(() => {
      const verifyAuth = () => {
        initializeFromStorage();
        const isAuthed = checkAuth();
        
        if (isAuthed) {
          setShowPopup(true);
        }
        setIsLoading(false);
      };

      verifyAuth();
    }, [initializeFromStorage, checkAuth]);

    const handleSignOut = () => {
      logout();
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