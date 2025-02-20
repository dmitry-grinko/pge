import { useEffect, useState } from 'react';

export function useRouting() {
  const [pathname, setPathname] = useState('/');

  useEffect(() => {
    // Update pathname on client-side only
    setPathname(window.location.pathname);
  }, []);

  const navigate = (path: string) => {
    window.location.href = path;
  };

  // Parse query params from URL
  const getQueryParams = () => {
    if (typeof window === 'undefined') return {};
    const params = new URLSearchParams(window.location.search);
    const query: Record<string, string> = {};
    params.forEach((value, key) => {
      query[key] = value;
    });
    return query;
  };

  return {
    isReady: true, // Always true for static export
    navigate,
    pathname,
    query: getQueryParams()
  };
} 