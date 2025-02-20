'use client';

import { useEffect, ComponentType, useState } from 'react';
import { AlreadyLoggedInPopup } from './AlreadyLoggedInPopup';
import { useAuthStore } from '@/store/auth.store';
import { useRouting } from '@/hooks/useRouting';

export function withAuthRedirect<P extends object>(Component: ComponentType<P>) {
  return function WrappedComponent(props: P) {
    const { navigate } = useRouting();
    const [isLoading, setIsLoading] = useState(true);
    const [showPopup, setShowPopup] = useState(false);
    const { checkAuth, logout, initializeFromStorage } = useAuthStore();

    useEffect(() => {
      const checkAuthStatus = async () => {
        try {
          if (typeof window !== 'undefined') {
            initializeFromStorage();
            const isAuthed = checkAuth();

            if (isAuthed) {
              setShowPopup(true);
            }
          }
        } catch (error) {
          console.error('Auth check failed:', error);
        } finally {
          setIsLoading(false);
        }
      };

      checkAuthStatus();
    }, [checkAuth, initializeFromStorage]);

    const handleSignOut = () => {
      logout();
      setShowPopup(false);
    };

    const handleCancel = () => {
      setShowPopup(false);
      navigate('/dashboard');
    };

    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (showPopup) {
      return <AlreadyLoggedInPopup onSignOut={handleSignOut} onCancel={handleCancel} />;
    }

    return <Component {...props} />;
  };
} 