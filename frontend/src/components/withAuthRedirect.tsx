'use client';

import { useEffect, ComponentType, useState } from 'react';
import { AlreadyLoggedInPopup } from './AlreadyLoggedInPopup';
import { useAuthStore } from '@/store/auth.store';
import { useRoutingStore } from '@/store/routing.store';

export function withAuthRedirect<P extends object>(Component: ComponentType<P>) {
  return function WrappedComponent(props: P) {
    const { pathname, navigate } = useRoutingStore();
    const [showPopup, setShowPopup] = useState(false);
    const { checkAuth, logout, initializeFromStorage } = useAuthStore();

    useEffect(() => {
      const checkAuthStatus = () => {
        if (typeof window === 'undefined') return;
        
        initializeFromStorage();
        const isAuthed = checkAuth();

        if (isAuthed) {
          setShowPopup(true);
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

    if (showPopup) {
      return <AlreadyLoggedInPopup onSignOut={handleSignOut} onCancel={handleCancel} />;
    }

    return <Component {...props} />;
  };
} 