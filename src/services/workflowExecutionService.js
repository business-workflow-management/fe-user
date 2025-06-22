import { parseAllVariables, extractDataFlowVariables } from '../utils/variableParser';
import { getService } from './serviceProvider';
import { useConnectionsStore } from '../stores/connectionsStore';

class WorkflowExecutionService {
  constructor() {
    this.nodeOutputs = {};
    this.executionHistory = [];
  }

  /**
   * Execute a workflow by processing nodes in topological order
   * @param {Object} project - The project containing nodes and dataFlowConnections
   * @param {Object} envVars - Environment variables for {{env.var}} resolution
   * @param {string} userId - The ID of the user executing the workflow
   * @returns {Object} Execution results with outputs and history
   */
  async executeWorkflow(project, envVars = {}, userId) {
    this.nodeOutputs = {};
    this.executionHistory = [];
    
    const { nodes, dataFlowConnections } = project;
    
    // Create adjacency list for topological sorting
    const graph = this.buildDependencyGraph(nodes, dataFlowConnections);
    const executionOrder = this.topologicalSort(graph);
    
    console.log('Execution order:', executionOrder);
    
    // Execute nodes in order
    for (const nodeId of executionOrder) {
      const node = nodes.find(n => n.id === nodeId);
      if (!node) continue;
      
      try {
        const result = await this.executeNode(node, envVars, userId);
        this.nodeOutputs[nodeId] = result;
        this.executionHistory.push({
          nodeId,
          status: 'success',
          timestamp: new Date().toISOString(),
          output: result
        });
      } catch (error) {
        console.error(`Error executing node ${nodeId}:`, error);
        this.executionHistory.push({
          nodeId,
          status: 'error',
          timestamp: new Date().toISOString(),
          error: error.message
        });
      }
    }
    
    return {
      outputs: this.nodeOutputs,
      history: this.executionHistory
    };
  }

  /**
   * Build dependency graph from nodes and data flow connections
   */
  buildDependencyGraph(nodes, dataFlowConnections) {
    const graph = {};
    
    // Initialize all nodes
    nodes.forEach(node => {
      graph[node.id] = { dependencies: [], dependents: [] };
    });
    
    // Add data flow connections
    dataFlowConnections.forEach(connection => {
      if (graph[connection.sourceNodeId] && graph[connection.targetNodeId]) {
        graph[connection.sourceNodeId].dependents.push(connection.targetNodeId);
        graph[connection.targetNodeId].dependencies.push(connection.sourceNodeId);
      }
    });
    
    return graph;
  }

  /**
   * Topological sort to determine execution order
   */
  topologicalSort(graph) {
    const visited = new Set();
    const temp = new Set();
    const order = [];
    
    const visit = (nodeId) => {
      if (temp.has(nodeId)) {
        throw new Error(`Circular dependency detected involving node ${nodeId}`);
      }
      
      if (visited.has(nodeId)) return;
      
      temp.add(nodeId);
      
      // Visit all dependencies first
      graph[nodeId].dependencies.forEach(dep => visit(dep));
      
      temp.delete(nodeId);
      visited.add(nodeId);
      order.push(nodeId);
    };
    
    Object.keys(graph).forEach(nodeId => {
      if (!visited.has(nodeId)) {
        visit(nodeId);
      }
    });
    
    return order;
  }

  /**
   * Execute a single node
   */
  async executeNode(node, envVars, userId) {
    const nodeType = node.data?.type;
    console.log(`Executing node: ${node.id} (${nodeType})`);
    
    const processedData = this.processNodeData(node.data, envVars);
    const service = getService(nodeType);

    if (service) {
      let credentials = {};
      if (processedData.connectionId) {
        const connection = useConnectionsStore.getState().getConnectionById(userId, processedData.connectionId);
        if (connection) {
          credentials = connection.credentials;
        } else {
          throw new Error(`Connection with ID "${processedData.connectionId}" not found for node ${node.id}`);
        }
      }
      return await service(processedData, credentials);
    }

    // Fallback for nodes not in serviceProvider (e.g., 'tools')
    return await this.mockNodeExecution(nodeType, processedData);
  }

  /**
   * Process node data by resolving all variables
   */
  processNodeData(data, envVars) {
    if (!data || typeof data !== 'object') {
      return data;
    }
    
    const processed = {};
    
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string') {
        processed[key] = parseAllVariables(value, envVars, this.nodeOutputs);
      } else if (typeof value === 'object') {
        processed[key] = this.processNodeData(value, envVars);
      } else {
        processed[key] = value;
      }
    }
    
    return processed;
  }

  /**
   * Mock execution for different node types
   */
  async mockNodeExecution(nodeType, data) {
    // Simulate async execution
    await new Promise(resolve => setTimeout(resolve, 500));
    
    switch (nodeType) {
      case 'tools':
        return {
          value: data.value,
          variableName: data.variableName
        };
        
      default:
        console.warn(`No service or mock execution found for node type: ${nodeType}`);
        return {
          output: 'Node executed successfully (mock)',
          status: 'completed',
          timestamp: new Date().toISOString()
        };
    }
  }

  /**
   * Get execution status for a specific node
   */
  getNodeStatus(nodeId) {
    const historyEntry = this.executionHistory.find(h => h.nodeId === nodeId);
    return historyEntry ? historyEntry.status : 'pending';
  }

  /**
   * Get output for a specific node
   */
  getNodeOutput(nodeId) {
    return this.nodeOutputs[nodeId] || null;
  }

  /**
   * Validate data flow variables in a project
   */
  validateProject(project) {
    const errors = [];
    const { nodes, dataFlowConnections } = project;
    
    // Check for circular dependencies
    try {
      const graph = this.buildDependencyGraph(nodes, dataFlowConnections);
      this.topologicalSort(graph);
    } catch (error) {
      errors.push(error.message);
    }
    
    // Check for invalid variable references
    nodes.forEach(node => {
      if (node.data) {
        const variables = extractDataFlowVariables(JSON.stringify(node.data));
        variables.forEach(({ nodeId }) => {
          const referencedNode = nodes.find(n => n.id === nodeId);
          if (!referencedNode) {
            errors.push(`Node "${node.id}" references non-existent node "${nodeId}"`);
          }
        });
      }
    });
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

const workflowExecutionService = new WorkflowExecutionService();
export default workflowExecutionService; 