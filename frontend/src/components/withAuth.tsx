'use client';

import { useRouter } from 'next/navigation';
import { useEffect, ComponentType, useState } from 'react';
import { useAuthStore } from '@/store/auth.store';

export function withAuth<P extends object>(Component: ComponentType<P>) {
  return function WrappedComponent(props: P) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const { checkAuth, initializeFromStorage } = useAuthStore();

    useEffect(() => {
      const verifyAuth = async () => {
        try {
          initializeFromStorage();
          const isAuthed = checkAuth();

          if (!isAuthed) {
            router.push('/login');
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          router.push('/login');
        } finally {
          setIsLoading(false);
        }
      };

      verifyAuth();
    }, [router, checkAuth, initializeFromStorage]);

    if (isLoading) {
      return <div>Loading...</div>;
    }

    return <Component {...props} />;
  };
}

// Usage example:
// export default withAuth(DashboardPage); 