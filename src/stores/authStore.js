import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as authService from '../services/authService';
import { jwtDecode } from 'jwt-decode';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      login: async (email, password) => {
        try {
          const data = await authService.login(email, password);
          console.log('Login API response:', data);
          let user = data.user;
          if (!user && data.accessToken) {
            try {
              const decoded = jwtDecode(data.accessToken);
              console.log('Decoded JWT:', decoded);
              user = {
                id: decoded.sub,
                email: decoded.email,
                name: decoded.name || decoded.username || '',
                ...decoded
              };
              console.log('Mapped user:', user);
            } catch (e) {
              user = null;
              console.error('JWT decode error:', e);
            }
          }
          set({
            user,
            token: data.accessToken,
            isAuthenticated: true,
          });
          return { success: true, user };
        } catch (error) {
          set({ user: null, token: null, isAuthenticated: false });
          return { success: false, error };
        }
      },
      
      register: async (name, email, password) => {
        try {
          const data = await authService.register(name, email, password);
          let user = data.user;
          if (!user && data.accessToken) {
            try {
              const decoded = jwtDecode(data.accessToken);
              console.log('Decoded JWT (register):', decoded);
              user = {
                id: decoded.sub,
                email: decoded.email,
                name: decoded.name || decoded.username || '',
                ...decoded
              };
              console.log('Mapped user (register):', user);
            } catch (e) {
              user = null;
              console.error('JWT decode error (register):', e);
            }
          }
          set({
            user,
            token: data.accessToken,
            isAuthenticated: true,
          });
          return { success: true, user };
        } catch (error) {
          set({ user: null, token: null, isAuthenticated: false });
          return { success: false, error };
        }
      },
      
      logout: async () => {
        try {
          await authService.logout();
        } catch (e) {}
        set({ user: null, token: null, isAuthenticated: false });
      },
      
      fetchProfile: async () => {
        try {
          const data = await authService.getProfile();
          set({ user: data.user });
        } catch (e) {}
      },
      
      updateUser: (userData) => {
        set((state) => ({
          user: { ...state.user, ...userData },
        }));
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);

export { useAuthStore }; 