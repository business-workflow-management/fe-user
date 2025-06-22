import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { 
  dataFlowToReactFlowEdges, 
  reactFlowEdgesToDataFlow,
  createDataFlowConnection,
  updateNodeIdInConnections
} from '../utils/dataFlowTransformer';

const useProjectStore = create(
  persist(
    (set, get) => ({
      projectsByUserId: {},
      currentProjectByUserId: {},
      workflowHistory: [],
      
      getProjectsByUserId: (userId) => {
        if (!userId) return [];
        return get().projectsByUserId[userId] || [];
      },

      getCurrentProjectByUserId: (userId) => {
        if (!userId) return null;
        return get().currentProjectByUserId[userId] || null;
      },
      
      initializeMockData: (userId) => {
        if (!userId || get().projectsByUserId[userId]) return;

        const mockProjects = [
          {
            id: 'proj_1',
            name: 'Complex Social Media Campaign',
            description: 'Q4 Holiday promotion with multiple branches',
            status: 'active',
            createdAt: '2023-10-01T10:00:00Z',
            updatedAt: '2023-10-25T14:30:00Z',
            nodes: [
              { 
                id: 'node-1', 
                type: 'custom', 
                data: { 
                  id: 'node-1',
                  type: 'google-sheets',
                  label: 'Get Customer Data', 
                  sublabel: 'Fetch leads from spreadsheet',
                  connectionId: 'conn_google_1',
                  spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
                  range: 'Sheet1!A2:D'
                }, 
                status: 'pending', 
                position: { x: 50, y: 250 } 
              },
              { 
                id: 'node-2', 
                type: 'custom', 
                data: { 
                  id: 'node-2',
                  type: 'chatgpt',
                  label: 'Generate Ad Copy', 
                  sublabel: 'Create personalized ads',
                  connectionId: 'conn_openai_1',
                  prompt: 'Create a compelling Facebook ad for a customer named {{data.node-1.data.0.name}} who is interested in {{data.node-1.data.0.interests}}. Include their email {{data.node-1.data.0.email}} in the targeting.',
                  maxTokens: '150'
                }, 
                status: 'pending', 
                position: { x: 300, y: 150 } 
              },
              { 
                id: 'node-3', 
                type: 'custom', 
                data: { 
                  id: 'node-3',
                  type: 'facebook',
                  label: 'Facebook Post', 
                  sublabel: 'Post to brand page',
                  connectionId: 'conn_facebook_1',
                  pageId: '123456789',
                  content: '{{data.node-2.response.text}}',
                  imageUrl: '{{data.node-1.data.0.profileImage}}'
                }, 
                status: 'pending', 
                position: { x: 300, y: 350 } 
              },
              { 
                id: 'node-4', 
                type: 'custom', 
                data: { 
                  id: 'node-4',
                  type: 'telegram-bot',
                  label: 'Notify Team', 
                  sublabel: 'Send update to channel',
                  connectionId: 'conn_telegram_1',
                  chatId: '-1001234567890',
                  text: 'New campaign launched! Ad copy: {{data.node-2.response.text}} | Customer: {{data.node-1.data.0.name}}'
                }, 
                status: 'pending', 
                position: { x: 550, y: 250 } 
              },
              { 
                id: 'node-5', 
                type: 'custom', 
                data: { 
                  id: 'node-5',
                  type: 'tools',
                  label: 'Set Campaign ID', 
                  sublabel: 'Store campaign identifier',
                  variableName: 'campaignId',
                  value: 'campaign_{{data.node-1.metadata.title}}_{{data.node-1.data.0.name}}'
                }, 
                status: 'pending', 
                position: { x: 550, y: 450 } 
              },
            ],
            // New data flow connections structure
            dataFlowConnections: [
              {
                id: 'conn_1_2',
                sourceNodeId: 'node-1',
                targetNodeId: 'node-2',
                label: 'Customer data to ad generation'
              },
              {
                id: 'conn_1_3',
                sourceNodeId: 'node-1',
                targetNodeId: 'node-3',
                label: 'Customer data to Facebook post'
              },
              {
                id: 'conn_2_4',
                sourceNodeId: 'node-2',
                targetNodeId: 'node-4',
                label: 'Ad copy to team notification'
              },
              {
                id: 'conn_3_4',
                sourceNodeId: 'node-3',
                targetNodeId: 'node-4',
                label: 'Facebook post to team notification'
              },
              {
                id: 'conn_1_5',
                sourceNodeId: 'node-1',
                targetNodeId: 'node-5',
                label: 'Customer data to campaign ID'
              }
            ],
            // Legacy edges for backward compatibility (will be removed in future)
            edges: [
              { id: 'e1-2', source: 'node-1', target: 'node-2', sourceHandle: 'right', targetHandle: 'left', markerEnd: { type: 'arrowclosed' } },
              { id: 'e1-3', source: 'node-1', target: 'node-3', sourceHandle: 'right', targetHandle: 'left', markerEnd: { type: 'arrowclosed' } },
              { id: 'e2-4', source: 'node-2', target: 'node-4', sourceHandle: 'right', targetHandle: 'left', markerEnd: { type: 'arrowclosed' } },
              { id: 'e3-4', source: 'node-3', target: 'node-4', sourceHandle: 'right', targetHandle: 'left', markerEnd: { type: 'arrowclosed' } },
              { id: 'e1-5', source: 'node-1', target: 'node-5', sourceHandle: 'right', targetHandle: 'left', markerEnd: { type: 'arrowclosed' } },
            ],
            history: [],
          },
          {
            id: 'proj_2',
            name: 'Simple Newsletter',
            description: 'Weekly email blast to subscribers',
            status: 'draft',
            createdAt: '2023-11-05T12:00:00Z',
            updatedAt: '2023-11-05T12:00:00Z',
            nodes: [
              { 
                id: 'n1', 
                type: 'custom', 
                data: { 
                  id: 'n1',
                  type: 'http-request',
                  label: 'Get News Data', 
                  sublabel: 'Fetch latest news from API',
                  url: 'https://api.news.com/latest',
                  method: 'GET'
                }, 
                status: 'pending', 
                position: { x: 100, y: 100 } 
              },
              { 
                id: 'n2', 
                type: 'custom', 
                data: { 
                  id: 'n2',
                  type: 'chatgpt',
                  label: 'Draft Newsletter', 
                  sublabel: 'Summarize news content',
                  connectionId: 'conn_openai_1',
                  prompt: 'Create a newsletter summary of the following news: {{data.n1.data.articles}}',
                  maxTokens: '300'
                }, 
                status: 'pending', 
                position: { x: 350, y: 100 } 
              },
            ],
            dataFlowConnections: [
              {
                id: 'conn_n1_n2',
                sourceNodeId: 'n1',
                targetNodeId: 'n2',
                label: 'News data to newsletter generation'
              }
            ],
            edges: [{ id: 'en1-n2', source: 'n1', target: 'n2', markerEnd: { type: 'arrowclosed' } }],
            history: [],
          },
        ];
        
        set((state) => ({
          projectsByUserId: {
            ...state.projectsByUserId,
            [userId]: mockProjects,
          }
        }));
      },
      
      createProject: (userId, projectData) => {
        let createdProject = null;
        set((state) => {
          if (!userId) return state;
          const userProjects = state.projectsByUserId[userId] || [];
          const newProject = {
            id: `proj_${Date.now()}`,
            ...projectData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: 'draft',
            nodes: [],
            dataFlowConnections: [],
            edges: [],
            history: [],
          };
          createdProject = newProject;
          return {
            projectsByUserId: {
              ...state.projectsByUserId,
              [userId]: [...userProjects, newProject],
            }
          };
        });
        return createdProject;
      },
      
      updateProject: (userId, updatedProject) =>
        set((state) => {
          if (!userId) return state;
          const userProjects = state.projectsByUserId[userId] || [];
          const newProjects = userProjects.map((p) =>
            p.id === updatedProject.id
              ? { ...updatedProject, updatedAt: new Date().toISOString() }
              : p
          );
          return {
            projectsByUserId: {
              ...state.projectsByUserId,
              [userId]: newProjects,
            }
          };
        }),
      
      deleteProject: (userId, id) =>
        set((state) => {
          if (!userId) return state;
          const userProjects = state.projectsByUserId[userId] || [];
          const newProjects = userProjects.filter((p) => p.id !== id);
          return {
            projectsByUserId: {
              ...state.projectsByUserId,
              [userId]: newProjects,
            }
          };
        }),
      
      setCurrentProject: (userId, project) => {
        if (!userId) return;
        set((state) => ({
          currentProjectByUserId: {
            ...state.currentProjectByUserId,
            [userId]: project,
          }
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
      
      updateProjectEdges: (userId, projectId, edges) => {
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
                updatedProject = { ...project, edges, updatedAt: new Date().toISOString() };
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
                  edges: reactFlowEdges, // Keep legacy edges for backward compatibility
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
    }),
    {
      name: 'project-flow-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export { useProjectStore }; 