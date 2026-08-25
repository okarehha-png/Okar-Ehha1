// api.ts
// Clean abstraction for backend API calls.
// Currently mock-based for static SPA deployment, ready to be wired up to a real backend.

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const api = {
  get: async <T>(endpoint: string): Promise<T> => {
    // Return mock data or fetch from backend
    return Promise.resolve({} as T);
  },
  post: async <T>(endpoint: string, data: any): Promise<T> => {
    // Return mock success or fetch from backend
    return Promise.resolve({ success: true, ...data } as T);
  }
};
