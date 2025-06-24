import { executeApiRequest } from './httpService';

export const getProjects = async (params = {}) => {
  const response = await executeApiRequest({
    method: 'GET',
    url: '/projects',
    params,
  });
  return response;
};

export const getProject = async (projectId) => {
  const response = await executeApiRequest({
    method: 'GET',
    url: `/projects/${projectId}`,
  });
  return response;
};

export const createProject = async (projectData) => {
  const response = await executeApiRequest({
    method: 'POST',
    url: '/projects',
    data: projectData,
  });
  return response;
};

export const updateProject = async (projectId, updateData) => {
  const response = await executeApiRequest({
    method: 'PATCH',
    url: `/projects/${projectId}`,
    data: updateData,
  });
  return response;
};

export const deleteProject = async (projectId) => {
  const response = await executeApiRequest({
    method: 'DELETE',
    url: `/projects/${projectId}`,
  });
  return response;
};

export const getProjectHistory = async (projectId) => {
  const response = await executeApiRequest({
    method: 'GET',
    url: `/projects/${projectId}/history`,
  });
  return response;
}; 