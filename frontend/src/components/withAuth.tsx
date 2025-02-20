'use client';

import { useRouter } from 'next/navigation';
import { useEffect, ComponentType, useState } from 'react';

export function withAuth<P extends object>(Component: ComponentType<P>) {
  return function WrappedComponent(props: P) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
      const checkAuth = async () => {
        try {
          // Check if user is authenticated (implement your auth check logic here)
          const isAuthed = /* your auth check logic */;
          setIsAuthenticated(isAuthed);

          // If not authenticated, redirect to login
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

      checkAuth();
    }, [router]);

    if (isLoading) {
      return <div>Loading...</div>; // Or your loading component
    }

    if (!isAuthenticated) {
      return null; // Don't render anything while redirecting
    }

    return <Component {...props} />;
  };
}

// Usage example:
// export default withAuth(DashboardPage); 