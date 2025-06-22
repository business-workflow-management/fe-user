import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { encryptData, decryptData } from '../utils/crypto';

const useEnvStore = create(
  persist(
    (set, get) => ({
      // Restructure to store env vars per user
      envVarsByUserId: {},

      // Helper to get vars for a specific user
      getEnvVarsByUserId: (userId) => {
        if (!userId) return [];
        const encryptedVars = get().envVarsByUserId[userId] || [];
        
        // Decrypt the values
        return encryptedVars.map(({ key, value }) => ({
          key,
          value: decryptData(value, userId)
        }));
      },
      
      setEnvVar: (userId, key, value) =>
        set((state) => {
          if (!userId || !key) return state;
          const userVars = state.envVarsByUserId[userId] || [];
          const existingIndex = userVars.findIndex((v) => v.key === key);
          
          // Encrypt the value before storing
          const encryptedValue = encryptData(value, userId);
          
          let newVars;
          if (existingIndex > -1) {
            newVars = userVars.map(v => v.key === key ? { key, value: encryptedValue } : v);
          } else {
            newVars = [...userVars, { key, value: encryptedValue }];
          }

          return {
            envVarsByUserId: {
              ...state.envVarsByUserId,
              [userId]: newVars,
            },
          };
        }),

      deleteEnvVar: (userId, key) =>
        set((state) => {
          if (!userId || !key) return state;
          const userVars = state.envVarsByUserId[userId] || [];
          const newVars = userVars.filter((v) => v.key !== key);
          
          return {
            envVarsByUserId: {
              ...state.envVarsByUserId,
              [userId]: newVars,
            },
          };
        }),
    }),
    {
      name: 'env-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export { useEnvStore }; 