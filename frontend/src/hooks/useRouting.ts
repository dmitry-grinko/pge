import { useRoutingStore } from '@/store/routing.store';

export function useRouting() {
  const { pathname, navigate, getQueryParams } = useRoutingStore();

  return {
    isReady: true, // Always true for static export
    navigate,
    pathname,
    query: getQueryParams()
  };
} 