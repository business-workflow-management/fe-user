import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

// Set your API gateway base URL here
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

// Create a central axios instance for BE integration
export const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add a request interceptor to inject the access token for authenticated requests
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Helper to convert snake_case keys to camelCase
function toCamelCase(obj) {
  if (Array.isArray(obj)) {
    return obj.map(toCamelCase);
  } else if (obj && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      const camelKey = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
      acc[camelKey] = toCamelCase(obj[key]);
      return acc;
    }, {});
  }
  return obj;
}

// Add a response interceptor to unwrap the data field and convert keys to camelCase
api.interceptors.response.use(
  (response) => {
    let data = response.data && typeof response.data === 'object' && 'data' in response.data
      ? response.data.data
      : response.data;
    return toCamelCase(data);
  },
  (error) => Promise.reject(error)
);

/**
 * Executes an HTTP request using the central axios instance for BE integration.
 * @param {object} config - Axios request config (method, url, data, params, etc.)
 * @returns {Promise<object>}
 */
export const executeApiRequest = async (config) => {
  try {
    const data = await api(config);
    return data;
  } catch (error) {
    console.error('API Request Error:', error.response?.data || error.message);
    throw error.response?.data || new Error('Failed to execute API request');
  }
}; 