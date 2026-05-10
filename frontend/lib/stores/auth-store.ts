'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';
import { authApi } from '../api/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  
  // Actions
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: true,
      isAuthenticated: false,
      isAdmin: false,

      setAuth: (user: User, token: string) => {
        localStorage.setItem('token', token);
        set({
          user,
          token,
          isAuthenticated: true,
          isAdmin: user.role === 'admin',
          isLoading: false,
        });
      },

      logout: () => {
        localStorage.removeItem('token');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isAdmin: false,
          isLoading: false,
        });
      },

      checkAuth: async () => {
        const token = localStorage.getItem('token');
        
        if (!token) {
          set({ isLoading: false, isAuthenticated: false });
          return;
        }

        try {
          const response = await authApi.getMe();
          if (response.success && response.data?.user) {
            set({
              user: response.data.user,
              token,
              isAuthenticated: true,
              isAdmin: response.data.user.role === 'admin',
              isLoading: false,
            });
          } else {
            get().logout();
          }
        } catch {
          get().logout();
        }
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        isAdmin: state.isAdmin,
      }),
    }
  )
);
