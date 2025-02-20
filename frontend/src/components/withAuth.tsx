'use client';

import { useRouter } from 'next/navigation';
import { useEffect, ComponentType } from 'react';

export function withAuth<T extends object>(WrappedComponent: ComponentType<T>) {
  return function WithAuthComponent(props: T) {
    const router = useRouter();

    useEffect(() => {
      const accessToken = localStorage.getItem('accessToken');
      const tokenExpiry = localStorage.getItem('tokenExpiry');
      
      if (!accessToken || !tokenExpiry) {
        router.push('/login');
        return;
      }

      // Check if token is expired
      if (Date.now() > parseInt(tokenExpiry, 10)) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('idToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('tokenExpiry');
        router.push('/login');
        return;
      }
    }, [router]);

    const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (!accessToken) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}

// Usage example:
// export default withAuth(DashboardPage); 