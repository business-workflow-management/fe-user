import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      login: async (email, password) => {
        // Mock login - in real app, this would call the API
        // const response = await authAPI.login(email, password);
        
        // Mock response
        const mockUser = {
          id: '1',
          email: email,
          name: 'John Doe',
          avatar: 'https://via.placeholder.com/40',
        };
        
        const mockToken = 'mock-jwt-token-' + Date.now();
        
        set({
          user: mockUser,
          token: mockToken,
          isAuthenticated: true,
        });
        
        return { success: true, user: mockUser };
      },
      
      register: async (name, email, password) => {
        // Mock registration - in real app, this would call the API
        // const response = await authAPI.register(name, email, password);
        
        // Mock response
        const mockUser = {
          id: '1',
          email: email,
          name: name,
          avatar: 'https://via.placeholder.com/40',
        };
        
        const mockToken = 'mock-jwt-token-' + Date.now();
        
        set({
          user: mockUser,
          token: mockToken,
          isAuthenticated: true,
        });
        
        return { success: true, user: mockUser };
      },
      
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
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