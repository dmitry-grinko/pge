'use client';

import { useRouter } from 'next/navigation';
import { useEffect, ComponentType } from 'react';

export function withAuth<T extends object>(WrappedComponent: ComponentType<T>) {
  return function WithAuthComponent(props: T) {
    const router = useRouter();

    useEffect(() => {
      // Check for authentication token
      const token = localStorage.getItem('token');
      
      if (!token) {
        // Redirect to login if no token found
        router.push('/login');
        return;
      }

      // TODO: Add token validation logic here
      // For example, verify token expiration or make an API call to validate
      // If token is invalid, clear it and redirect to login
      // const isValidToken = validateToken(token);
      // if (!isValidToken) {
      //   localStorage.removeItem('token');
      //   router.push('/login');
      // }
    }, [router]);

    // You might want to add a loading state while checking authentication
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      return null; // or return a loading spinner
    }

    return <WrappedComponent {...props} />;
  };
}

// Usage example:
// export default withAuth(DashboardPage); 