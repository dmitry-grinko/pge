import { create } from 'zustand';

interface RoutingState {
  pathname: string;
  
  // Actions
  navigate: (path: string) => void;
  getQueryParams: () => Record<string, string>;
  setPathname: (path: string) => void;
}

export const useRoutingStore = create<RoutingState>((set, get) => ({
  pathname: typeof window !== 'undefined' ? window.location.pathname : '/',

  setPathname: (path: string) => {
    set({ pathname: path });
  },

  navigate: (path: string) => {
    // For auth-related navigation, use full page reload
    if (path.startsWith('/login') || path.startsWith('/dashboard')) {
      window.location.href = path;
      return;
    }
    
    // For other navigation, try to use history API
    try {
      window.history.pushState({}, '', path);
      get().setPathname(path);
    } catch {
      window.location.href = path;
    }
  },

  getQueryParams: () => {
    if (typeof window === 'undefined') return {};
    const params = new URLSearchParams(window.location.search);
    const query: Record<string, string> = {};
    params.forEach((value, key) => {
      query[key] = value;
    });
    return query;
  }
})); 