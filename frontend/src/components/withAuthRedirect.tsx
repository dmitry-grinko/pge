'use client';
import { useRouter } from 'next/navigation';
import { useEffect, ComponentType, useState } from 'react';
import { AlreadyLoggedInPopup } from './AlreadyLoggedInPopup';
import { useAuthStore } from '@/store/auth.store';

export function withAuthRedirect<P extends object>(Component: ComponentType<P>) {
  return function WrappedComponent(props: P) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [showPopup, setShowPopup] = useState(false);
    const { checkAuth, logout, initializeFromStorage } = useAuthStore();

    useEffect(() => {
      const checkAuthStatus = async () => {
        try {
          initializeFromStorage();
          const isAuthed = checkAuth();

          if (isAuthed) {
            router.push('/dashboard'); // Redirect to dashboard if already authenticated
          }
        } catch (error) {
          console.error('Auth check failed:', error);
        } finally {
          setIsLoading(false);
        }
      };

      checkAuthStatus();
    }, [router, checkAuth, initializeFromStorage]);

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