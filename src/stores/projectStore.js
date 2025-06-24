import { create } from 'zustand';
import * as projectService from '../services/projectService';
import {
  dataFlowToReactFlowEdges,
  reactFlowEdgesToDataFlow,
  createDataFlowConnection,
  updateNodeIdInConnections
} from '../utils/dataFlowTransformer';

const useProjectStore = create((set, get) => ({
  projectsByUserId: {},
  currentProjectByUserId: {},
  workflowHistory: [],

  getProjectsByUserId: (userId) => {
    return get().projectsByUserId[userId] || [];
  },

  getCurrentProjectByUserId: (userId) => {
    return get().currentProjectByUserId[userId] || null;
  },

  fetchProjects: async (userId) => {
    try {
      const data = await projectService.getProjects();
      set((state) => ({
        projectsByUserId: {
          ...state.projectsByUserId,
          [userId]: data.projects || [],
        },
      }));
    } catch (e) {}
  },

  fetchProject: async (userId, projectId) => {
    try {
      const data = await projectService.getProject(projectId);
      set((state) => ({
        currentProjectByUserId: {
          ...state.currentProjectByUserId,
          [userId]: data.project || null,
        },
      }));
    } catch (e) {}
  },

  createProject: async (userId, projectData) => {
    try {
      const data = await projectService.createProject(projectData);
      set((state) => ({
        projectsByUserId: {
          ...state.projectsByUserId,
          [userId]: [...(state.projectsByUserId[userId] || []), data.project],
        },
      }));
      return data.project;
    } catch (e) { return null; }
  },

  updateProject: async (userId, projectId, updateData) => {
    try {
      const data = await projectService.updateProject(projectId, updateData);
      set((state) => {
        const userProjects = state.projectsByUserId[userId] || [];
        const newProjects = userProjects.map((p) =>
          p.id === projectId ? data.project : p
        );
        return {
          projectsByUserId: {
            ...state.projectsByUserId,
            [userId]: newProjects,
          },
          currentProjectByUserId: {
            ...state.currentProjectByUserId,
            [userId]: data.project,
          },
        };
      });
      return data.project;
    } catch (e) { return null; }
  },

  deleteProject: async (userId, projectId) => {
    try {
      await projectService.deleteProject(projectId);
      set((state) => {
        const userProjects = state.projectsByUserId[userId] || [];
        const newProjects = userProjects.filter((p) => p.id !== projectId);
        return {
          projectsByUserId: {
            ...state.projectsByUserId,
            [userId]: newProjects,
          },
          currentProjectByUserId: {
            ...state.currentProjectByUserId,
            [userId]: null,
          },
        };
      });
    } catch (e) {}
  },

  fetchProjectHistory: async (userId, projectId) => {
    try {
      const data = await projectService.getProjectHistory(projectId);
      set((state) => {
        const userProjects = state.projectsByUserId[userId] || [];
        const newProjects = userProjects.map((p) =>
          p.id === projectId ? { ...p, history: data.history } : p
        );
        return {
          projectsByUserId: {
            ...state.projectsByUserId,
            [userId]: newProjects,
          },
          currentProjectByUserId: {
            ...state.currentProjectByUserId,
            [userId]: {
              ...state.currentProjectByUserId[userId],
              history: data.history,
            },
          },
        };
      });
    } catch (e) {}
  },

  setCurrentProject: (userId, project) => {
    set((state) => ({
      currentProjectByUserId: {
        ...state.currentProjectByUserId,
        [userId]: project,
      },
    }));
  },

  updateProjectNodes: (userId, projectId, nodes) => {
    return new Promise((resolve) => {
      set((state) => {
        if (!userId) {
          resolve(null);
          return state;
        }
        const userProjects = state.projectsByUserId[userId] || [];
        let updatedProject;
        const newProjects = userProjects.map((project) => {
          if (project.id === projectId) {
            updatedProject = { ...project, nodes, updatedAt: new Date().toISOString() };
            return updatedProject;
          }
          return project;
        });

        resolve(updatedProject);
        
        const currentProj = state.currentProjectByUserId[userId];
        if (currentProj?.id === projectId) {
          return {
            projectsByUserId: { ...state.projectsByUserId, [userId]: newProjects },
            currentProjectByUserId: { ...state.currentProjectByUserId, [userId]: updatedProject },
          };
        }
        return { projectsByUserId: { ...state.projectsByUserId, [userId]: newProjects } };
      });
    });
  },
  
  addWorkflowHistory: (userId, projectId, historyEntry) =>
    set((state) => {
      if (!userId) return state;
      const userProjects = state.projectsByUserId[userId] || [];
      const newProjects = userProjects.map((p) =>
        p.id === projectId
          ? { ...p, history: [historyEntry, ...(p.history || [])] }
          : p
      );
      return {
        projectsByUserId: {
          ...state.projectsByUserId,
          [userId]: newProjects,
        }
      };
    }),
  
  getProjectById: (userId, id) => {
    if (!userId) return null;
    const userProjects = get().projectsByUserId[userId] || [];
    return userProjects.find((p) => p.id === id);
  },
  
  getWorkflowHistory: (userId, projectId) => {
    if (!userId) return [];
    const state = get();
    return state.workflowHistory.filter((entry) => entry.projectId === projectId && entry.userId === userId);
  },

  // New data flow connection methods
  updateProjectDataFlowConnections: (userId, projectId, dataFlowConnections) => {
    return new Promise((resolve) => {
      set((state) => {
        if (!userId) {
          resolve(null);
          return state;
        }
        const userProjects = state.projectsByUserId[userId] || [];
        let updatedProject;
        const newProjects = userProjects.map((project) => {
          if (project.id === projectId) {
            updatedProject = { 
              ...project, 
              dataFlowConnections, 
              updatedAt: new Date().toISOString() 
            };
            return updatedProject;
          }
          return project;
        });

        resolve(updatedProject);
        
        const currentProj = state.currentProjectByUserId[userId];
        if (currentProj?.id === projectId) {
          return {
            projectsByUserId: { ...state.projectsByUserId, [userId]: newProjects },
            currentProjectByUserId: { ...state.currentProjectByUserId, [userId]: updatedProject },
          };
        }
        return { projectsByUserId: { ...state.projectsByUserId, [userId]: newProjects } };
      });
    });
  },

  addDataFlowConnection: (userId, projectId, sourceNodeId, targetNodeId, options = {}) => {
    return new Promise((resolve) => {
      set((state) => {
        if (!userId) {
          resolve(null);
          return state;
        }
        const userProjects = state.projectsByUserId[userId] || [];
        let updatedProject;
        const newProjects = userProjects.map((project) => {
          if (project.id === projectId) {
            const newConnection = createDataFlowConnection(sourceNodeId, targetNodeId, options);
            const updatedConnections = [...(project.dataFlowConnections || []), newConnection];
            updatedProject = { 
              ...project, 
              dataFlowConnections: updatedConnections, 
              updatedAt: new Date().toISOString() 
            };
            return updatedProject;
          }
          return project;
        });

        resolve(updatedProject);
        
        const currentProj = state.currentProjectByUserId[userId];
        if (currentProj?.id === projectId) {
          return {
            projectsByUserId: { ...state.projectsByUserId, [userId]: newProjects },
            currentProjectByUserId: { ...state.currentProjectByUserId, [userId]: updatedProject },
          };
        }
        return { projectsByUserId: { ...state.projectsByUserId, [userId]: newProjects } };
      });
    });
  },

  removeDataFlowConnection: (userId, projectId, connectionId) => {
    return new Promise((resolve) => {
      set((state) => {
        if (!userId) {
          resolve(null);
          return state;
        }
        const userProjects = state.projectsByUserId[userId] || [];
        let updatedProject;
        const newProjects = userProjects.map((project) => {
          if (project.id === projectId) {
            const updatedConnections = (project.dataFlowConnections || []).filter(
              conn => conn.id !== connectionId
            );
            updatedProject = { 
              ...project, 
              dataFlowConnections: updatedConnections, 
              updatedAt: new Date().toISOString() 
            };
            return updatedProject;
          }
          return project;
        });

        resolve(updatedProject);
        
        const currentProj = state.currentProjectByUserId[userId];
        if (currentProj?.id === projectId) {
          return {
            projectsByUserId: { ...state.projectsByUserId, [userId]: newProjects },
            currentProjectByUserId: { ...state.currentProjectByUserId, [userId]: updatedProject },
          };
        }
        return { projectsByUserId: { ...state.projectsByUserId, [userId]: newProjects } };
      });
    });
  },

  updateNodeIdInDataFlow: (userId, projectId, oldNodeId, newNodeId) => {
    return new Promise((resolve) => {
      set((state) => {
        if (!userId) {
          resolve(null);
          return state;
        }
        const userProjects = state.projectsByUserId[userId] || [];
        let updatedProject;
        const newProjects = userProjects.map((project) => {
          if (project.id === projectId) {
            const updatedConnections = updateNodeIdInConnections(
              project.dataFlowConnections || [], 
              oldNodeId, 
              newNodeId
            );
            updatedProject = { 
              ...project, 
              dataFlowConnections: updatedConnections, 
              updatedAt: new Date().toISOString() 
            };
            return updatedProject;
          }
          return project;
        });

        resolve(updatedProject);
        
        const currentProj = state.currentProjectByUserId[userId];
        if (currentProj?.id === projectId) {
          return {
            projectsByUserId: { ...state.projectsByUserId, [userId]: newProjects },
            currentProjectByUserId: { ...state.currentProjectByUserId, [userId]: updatedProject },
          };
        }
        return { projectsByUserId: { ...state.projectsByUserId, [userId]: newProjects } };
      });
    });
  },

  // Transform data flow connections to React Flow edges for visualization
  getReactFlowEdges: (userId, projectId) => {
    const state = get();
    const userProjects = state.projectsByUserId[userId] || [];
    const project = userProjects.find(p => p.id === projectId);
    if (!project) return [];
    
    return dataFlowToReactFlowEdges(project.dataFlowConnections || []);
  },

  // Update React Flow edges and sync back to data flow connections
  updateReactFlowEdges: (userId, projectId, reactFlowEdges) => {
    return new Promise((resolve) => {
      set((state) => {
        if (!userId) {
          resolve(null);
          return state;
        }
        const userProjects = state.projectsByUserId[userId] || [];
        let updatedProject;
        const newProjects = userProjects.map((project) => {
          if (project.id === projectId) {
            const dataFlowConnections = reactFlowEdgesToDataFlow(reactFlowEdges);
            updatedProject = { 
              ...project, 
              dataFlowConnections,
              updatedAt: new Date().toISOString() 
            };
            return updatedProject;
          }
          return project;
        });

        resolve(updatedProject);
        
        const currentProj = state.currentProjectByUserId[userId];
        if (currentProj?.id === projectId) {
          return {
            projectsByUserId: { ...state.projectsByUserId, [userId]: newProjects },
            currentProjectByUserId: { ...state.currentProjectByUserId, [userId]: updatedProject },
          };
        }
        return { projectsByUserId: { ...state.projectsByUserId, [userId]: newProjects } };
      });
    });
  },
}));

export { useProjectStore }; 