import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export function useRouting() {
  const [isReady, setIsReady] = useState(true); // Start with true for static export
  const [pathname, setPathname] = useState('/');

  useEffect(() => {
    // Update pathname on client-side only
    setPathname(window.location.pathname);
  }, []);

  const navigate = async (path: string) => {
    window.location.href = path;
  };

  return {
    isReady,
    navigate,
    pathname,
    query: {} // Static export doesn't need query params
  };
} 