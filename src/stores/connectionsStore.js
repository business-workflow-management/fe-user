import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { encryptData, decryptData } from '../utils/crypto';

const useConnectionsStore = create(
  persist(
    (set, get) => ({
      connectionsByUserId: {},

      getConnectionsByUserId: (userId) => {
        if (!userId) return [];
        const encryptedConnections = get().connectionsByUserId[userId] || [];
        
        // Decrypt the credentials
        return encryptedConnections.map(connection => ({
          ...connection,
          credentials: decryptData(connection.credentials, userId)
        }));
      },

      initializeMockConnections: (userId) => {
        if (!userId || get().connectionsByUserId[userId]) return;
        
        const mockConnections = [
          {
            id: 'conn_google_1',
            name: 'My Personal Google Account',
            type: 'google-sheets',
            credentials: {
              token: 'MOCK_GOOGLE_TOKEN_PERSONAL_12345',
            },
            createdAt: new Date().toISOString(),
          },
          {
            id: 'conn_facebook_1',
            name: 'Work Facebook Page',
            type: 'facebook',
            credentials: {
              token: 'MOCK_FACEBOOK_TOKEN_WORK_67890',
            },
            createdAt: new Date().toISOString(),
          },
          {
            id: 'conn_openai_1',
            name: 'OpenAI API Key',
            type: 'chatgpt',
            credentials: {
              apiKey: 'MOCK_OPENAI_API_KEY_ABCDE',
            },
            createdAt: new Date().toISOString(),
          },
          {
            id: 'conn_telegram_1',
            name: 'My Test Telegram Bot',
            type: 'telegram-bot',
            credentials: {
              botToken: 'MOCK_TELEGRAM_BOT_TOKEN_12345',
            },
            createdAt: new Date().toISOString(),
          },
        ];

        // Encrypt credentials before storing
        const encryptedConnections = mockConnections.map(connection => ({
          ...connection,
          credentials: encryptData(connection.credentials, userId)
        }));

        set((state) => ({
          connectionsByUserId: {
            ...state.connectionsByUserId,
            [userId]: encryptedConnections,
          }
        }));
      },

      addConnection: (userId, connectionData) =>
        set((state) => {
          if (!userId) return state;
          const userConnections = state.connectionsByUserId[userId] || [];
          const newConnection = {
            id: `conn_${Date.now()}`,
            ...connectionData,
            credentials: encryptData(connectionData.credentials, userId),
            createdAt: new Date().toISOString(),
          };
          return {
            connectionsByUserId: {
              ...state.connectionsByUserId,
              [userId]: [...userConnections, newConnection],
            }
          };
        }),

      updateConnection: (userId, updatedConnection) =>
        set((state) => {
          if (!userId) return state;
          const userConnections = state.connectionsByUserId[userId] || [];
          const newConnections = userConnections.map((c) =>
            c.id === updatedConnection.id ? {
              ...updatedConnection,
              credentials: encryptData(updatedConnection.credentials, userId)
            } : c
          );
          return {
            connectionsByUserId: {
              ...state.connectionsByUserId,
              [userId]: newConnections,
            }
          };
        }),

      deleteConnection: (userId, id) =>
        set((state) => {
          if (!userId) return state;
          const userConnections = state.connectionsByUserId[userId] || [];
          const newConnections = userConnections.filter((c) => c.id !== id);
          return {
            connectionsByUserId: {
              ...state.connectionsByUserId,
              [userId]: newConnections,
            }
          };
        }),

      getConnectionById: (userId, id) => {
        if (!userId) return null;
        const userConnections = get().connectionsByUserId[userId] || [];
        const connection = userConnections.find((c) => c.id === id);
        if (!connection) return null;
        
        // Decrypt credentials
        return {
          ...connection,
          credentials: decryptData(connection.credentials, userId)
        };
      },
    }),
    {
      name: 'connections-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export { useConnectionsStore }; 