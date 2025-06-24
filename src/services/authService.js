import { executeApiRequest } from './httpService';

export const login = async (email, password) => {
  const response = await executeApiRequest({
    method: 'POST',
    url: '/auth/login',
    data: { email, password },
  });

  return response;
};

export const register = async (name, email, password) => {
  const response = await executeApiRequest({
    method: 'POST',
    url: '/auth/register',
    data: { name, email, password },
  });
  return response;
};

export const getProfile = async () => {
  const response = await executeApiRequest({
    method: 'GET',
    url: '/auth/profile',
  });
  return response;
};

export const logout = async (refreshToken) => {
  const response = await executeApiRequest({
    method: 'POST',
    url: '/auth/logout',
    data: { refreshToken },
  });
  return response;
}; 