import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useProjectStore } from '../../stores/projectStore';
import { useAuthStore } from '../../stores/authStore';
import { useEnvStore } from '../../stores/envStore';
import FlowNode from '../../components/workspace/FlowNode';
import NodeEditor from '../../components/workspace/NodeEditor';
import NodePanel from '../../components/workspace/NodePanel';
import Layout from '../../components/layout/Layout';
import { 
  Play, 
  CheckCircle,
  XCircle,
  Clock,
  Plus,
  Save,
  ChevronLeft,
} from 'lucide-react';
import { Button, Card, Modal } from '../../components/ui';
import workflowExecutionService from '../../services/workflowExecutionService';
import { dataFlowToReactFlowEdges, reactFlowEdgesToDataFlow } from '../../utils/dataFlowTransformer';

const nodeTypes = {
  custom: FlowNode,
};

const ProjectWorkspace = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const { 
    getProjectsByUserId, 
    getCurrentProjectByUserId,
    setCurrentProject, 
    updateProject,
    addWorkflowHistory,
    fetchProject,
  } = useProjectStore();
  
  const { getEnvVarsByUserId } = useEnvStore();

  const projects = getProjectsByUserId(user?.id);
  const currentProject = getCurrentProjectByUserId(user?.id);
  const envVars = getEnvVarsByUserId(user?.id);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [showNodePanel, setShowNodePanel] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResults, setExecutionResults] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const reactFlowWrapper = useRef(null);

  // Fetch project by ID when page loads or projectId changes
  useEffect(() => {
    if (user?.id && projectId) {
      setIsLoading(true);
      fetchProject(user.id, projectId)
        .then(() => {
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Failed to fetch project:', error);
          setIsLoading(false);
        });
    }
  }, [user?.id, projectId, fetchProject]);

  // Set current project from URL param
  useEffect(() => {
    if (user?.id && projectId && (!currentProject || currentProject.id !== projectId)) {
      const foundProject = projects.find(p => p.id === projectId);
      if (foundProject) {
        setCurrentProject(user.id, foundProject);
      }
    }
  }, [user, projectId, projects, currentProject, setCurrentProject]);

  // Initialize nodes and edges from current project
  useEffect(() => {
    if (currentProject) {
      setNodes(currentProject.nodes || []);
      // Always use dataFlowConnections for edges
      const reactFlowEdges = dataFlowToReactFlowEdges(currentProject.dataFlowConnections || []);
      setEdges(reactFlowEdges);
    }
  }, [currentProject, setNodes, setEdges]);

  const handleSave = async () => {
    if (!currentProject || !user?.id) return;
    setIsSaving(true);
    const dataFlowConnections = reactFlowEdgesToDataFlow(edges);
    // Only include allowed fields for update
    const updateData = {
      name: currentProject.name,
      description: currentProject.description,
      status: currentProject.status,
      nodes,
      dataFlowConnections,
      nodePositions: currentProject.nodePositions || [],
    };
    await updateProject(user.id, currentProject.id, updateData);
    setTimeout(() => setIsSaving(false), 1500);
  };

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, markerEnd: { type: 'arrowclosed' } }, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const handleAddNode = (nodeType) => {
    const newNode = {
      id: `node-${Date.now()}`,
      type: 'custom',
      data: {
        id: `node-${Date.now()}`,
        type: nodeType,
        label: `New ${nodeType}`,
        sublabel: 'Configure this node',
        status: 'pending'
      },
      position: { 
        x: Math.random() * 400 + 100, 
        y: Math.random() * 300 + 100 
      },
    };
    setNodes((nds) => [...nds, newNode]);
    setShowNodePanel(false);
  };

  const handleUpdateNode = (updatedNode) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === updatedNode.id ? { ...node, data: updatedNode.data } : node
      )
    );
    setSelectedNode(null);
  };

  const handleUpdateNodeId = (oldId, newId) => {
    if (oldId === newId) return;
    
    // Update the node ID
    setNodes((nds) =>
      nds.map((node) =>
        node.id === oldId ? { ...node, id: newId } : node
      )
    );
    
    // Update edges that reference this node
    setEdges((eds) =>
      eds.map((edge) => ({
        ...edge,
        source: edge.source === oldId ? newId : edge.source,
        target: edge.target === oldId ? newId : edge.target,
      }))
    );
    
    // Update selected node if it's the one being changed
    if (selectedNode && selectedNode.id === oldId) {
      setSelectedNode({ ...selectedNode, id: newId });
    }
  };

  const handleExecuteWorkflow = async () => {
    if (!currentProject || !user?.id) return;
    
    setIsExecuting(true);
    setExecutionResults(null);
    
    try {
      // Convert React Flow edges back to data flow connections for execution
      const dataFlowConnections = reactFlowEdgesToDataFlow(edges);
      const projectWithCurrentData = { 
        ...currentProject, 
        nodes, 
        dataFlowConnections 
      };
      
      const results = await workflowExecutionService.executeWorkflow(projectWithCurrentData, envVars, user.id);
      
      addWorkflowHistory(user.id, currentProject.id, {
        executedAt: new Date().toISOString(),
        status: results.history.some(h => h.status === 'error') ? 'failed' : 'success',
        // other history data
      });
      setExecutionResults(results);
      setShowResults(true);
      
      // Update node statuses based on execution results
      const updatedNodes = nodes.map(node => {
        const historyEntry = results.history.find(h => h.nodeId === node.id);
        return {
          ...node,
          data: {
            ...node.data,
            status: historyEntry ? historyEntry.status : 'pending'
          }
        };
      });
      setNodes(updatedNodes);
      
    } catch (error) {
      console.error('Workflow execution failed:', error);
      alert('Workflow execution failed: ' + error.message);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleCloseResults = () => {
    setShowResults(false);
    setExecutionResults(null);
  };

  if (!currentProject) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          {isLoading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading project...</p>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-gray-500 mb-4">Project not found</p>
              <Button onClick={() => navigate('/projects')}>
                Back to Projects
              </Button>
            </div>
          )}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/projects')}>
              <ChevronLeft size={20} />
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{currentProject.name}</h1>
              <p className="text-sm text-gray-500">{currentProject.description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              variant="outline"
              className="flex items-center"
            >
              {isSaving ? (
                <>
                  <CheckCircle size={16} className="mr-2 text-green-500" />
                  Saved!
                </>
              ) : (
                <>
                  <Save size={16} className="mr-2" />
                  Save Project
                </>
              )}
            </Button>
            <Button
              onClick={handleExecuteWorkflow}
              disabled={isExecuting}
              className="flex items-center"
            >
              {isExecuting ? (
                <>
                  <Clock size={16} className="mr-2 animate-spin" />
                  Executing...
                </>
              ) : (
                <>
                  <Play size={16} className="mr-2" />
                  Execute Workflow
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowNodePanel(true)}
              className="flex items-center"
            >
              <Plus size={16} className="mr-2" />
              Add Node
            </Button>
          </div>
        </div>

        {/* Flow Canvas */}
        <div className="flex-1 relative" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            fitView
            attributionPosition="bottom-left"
            proOptions={{ hideAttribution: true }}
            defaultEdgeOptions={{ markerEnd: { type: 'arrowclosed' } }}
          >
            <Controls />
            <MiniMap />
            <Background variant="dots" gap={12} size={1} />
          </ReactFlow>
        </div>

        {/* Node Editor */}
        {selectedNode && (
          <NodeEditor
            node={selectedNode}
            onUpdate={handleUpdateNode}
            onClose={() => setSelectedNode(null)}
            onUpdateNodeId={handleUpdateNodeId}
          />
        )}

        {/* Node Panel */}
        {showNodePanel && (
          <>
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-20"
              onClick={() => setShowNodePanel(false)}
            />
            <NodePanel
              onAddNode={handleAddNode}
              onClose={() => setShowNodePanel(false)}
            />
          </>
        )}

        {/* Execution Results Modal */}
        {showResults && executionResults && (
          <Modal isOpen={showResults} onClose={handleCloseResults}>
            <div className="p-6 max-w-4xl max-h-96 overflow-y-auto">
              <h2 className="text-xl font-semibold mb-4">Workflow Execution Results</h2>
              
              <div className="space-y-4">
                {executionResults.history.map((entry, index) => {
                  const node = nodes.find(n => n.id === entry.nodeId);
                  return (
                    <Card key={index} className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{node?.data?.label || entry.nodeId}</h3>
                        <div className="flex items-center space-x-2">
                          {entry.status === 'success' && (
                            <CheckCircle size={16} className="text-green-500" />
                          )}
                          {entry.status === 'error' && (
                            <XCircle size={16} className="text-red-500" />
                          )}
                          <span className={`text-sm px-2 py-1 rounded ${
                            entry.status === 'success' ? 'bg-green-100 text-green-800' :
                            entry.status === 'error' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {entry.status}
                          </span>
                        </div>
                      </div>
                      
                      {entry.status === 'success' && entry.output && (
                        <div className="mt-2">
                          <details className="text-sm">
                            <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                              View Output
                            </summary>
                            <pre className="mt-2 p-2 bg-gray-50 rounded text-xs overflow-x-auto">
                              {JSON.stringify(entry.output, null, 2)}
                            </pre>
                          </details>
                        </div>
                      )}
                      
                      {entry.status === 'error' && entry.error && (
                        <div className="mt-2 text-sm text-red-600">
                          Error: {entry.error}
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
              
              <div className="mt-6 flex justify-end">
                <Button onClick={handleCloseResults}>
                  Close
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </Layout>
  );
};

export default ProjectWorkspace; 