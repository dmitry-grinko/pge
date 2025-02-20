'use client';

import { useEffect, ComponentType, useState } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { useRouting } from '@/hooks/useRouting';

export function withAuth<P extends object>(Component: ComponentType<P>) {
  return function WrappedComponent(props: P) {
    const { navigate, isReady } = useRouting();
    const [isLoading, setIsLoading] = useState(true);
    const { checkAuth, initializeFromStorage } = useAuthStore();

    useEffect(() => {
      if (!isReady) return;

      const verifyAuth = async () => {
        try {
          initializeFromStorage();
          const isAuthed = checkAuth();

          if (!isAuthed) {
            await navigate('/login');
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          await navigate('/login');
        } finally {
          setIsLoading(false);
        }
      };

      verifyAuth();
    }, [isReady, navigate, checkAuth, initializeFromStorage]);

    if (!isReady || isLoading) {
      return <div>Loading...</div>;
    }

    return <Component {...props} />;
  };
}

// Usage example:
// export default withAuth(DashboardPage); 