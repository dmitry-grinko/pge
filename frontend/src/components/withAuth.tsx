'use client';

import { useEffect, ComponentType, useState } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { useRouting } from '@/hooks/useRouting';

export function withAuth<P extends object>(Component: ComponentType<P>) {
  return function WrappedComponent(props: P) {
    const { navigate, pathname } = useRouting();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const { checkAuth, initializeFromStorage } = useAuthStore();

    useEffect(() => {
      const verifyAuth = () => {
        if (typeof window === 'undefined') return;
        
        initializeFromStorage();
        const isAuthed = checkAuth();

        if (!isAuthed) {
          // Store the attempted URL to redirect back after login
          sessionStorage.setItem('redirectUrl', pathname);
          navigate('/login');
          return;
        }

        setIsAuthorized(true);
        setIsLoading(false);
      };

      verifyAuth();
    }, [navigate, pathname, checkAuth, initializeFromStorage]);

    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (!isAuthorized) {
      return null;
    }

    return <Component {...props} />;
  };
}

// Usage example:
// export default withAuth(DashboardPage); 