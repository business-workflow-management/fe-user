/**
 * Data Flow Transformer
 * Handles conversion between business data flow and React Flow edges
 */

/**
 * Business logic data flow connection
 * @typedef {Object} DataFlowConnection
 * @property {string} id - Unique identifier for the connection
 * @property {string} sourceNodeId - Source node ID
 * @property {string} targetNodeId - Target node ID
 * @property {string} [condition] - Optional condition for conditional flows
 * @property {string} [label] - Optional label for the connection
 * @property {Object} [metadata] - Additional metadata
 */

/**
 * React Flow edge for visualization
 * @typedef {Object} ReactFlowEdge
 * @property {string} id - Edge ID
 * @property {string} source - Source node ID
 * @property {string} target - Target node ID
 * @property {string} [sourceHandle] - Source handle
 * @property {string} [targetHandle] - Target handle
 * @property {Object} [markerEnd] - Arrow marker
 * @property {Object} [style] - Edge styling
 * @property {Object} [data] - Edge data
 */

/**
 * Convert business data flow connections to React Flow edges
 * @param {DataFlowConnection[]} dataFlowConnections - Business logic connections
 * @returns {ReactFlowEdge[]} React Flow edges for visualization
 */
export const dataFlowToReactFlowEdges = (dataFlowConnections = []) => {
  return dataFlowConnections.map(connection => ({
    id: connection.id,
    source: connection.sourceNodeId,
    target: connection.targetNodeId,
    sourceHandle: 'right',
    targetHandle: 'left',
    markerEnd: { type: 'arrowclosed' },
    style: { stroke: '#2563eb', strokeWidth: 2 },
    data: {
      condition: connection.condition,
      label: connection.label,
      metadata: connection.metadata
    }
  }));
};

/**
 * Convert React Flow edges to business data flow connections
 * @param {ReactFlowEdge[]} reactFlowEdges - React Flow edges
 * @returns {DataFlowConnection[]} Business logic connections
 */
export const reactFlowEdgesToDataFlow = (reactFlowEdges = []) => {
  return reactFlowEdges.map(edge => ({
    id: edge.id,
    sourceNodeId: edge.source,
    targetNodeId: edge.target,
    condition: edge.data?.condition,
    label: edge.data?.label,
    metadata: edge.data?.metadata || {}
  }));
};

/**
 * Validate data flow connections
 * @param {DataFlowConnection[]} connections - Data flow connections
 * @param {Array} nodes - Project nodes
 * @returns {Object} Validation result
 */
export const validateDataFlowConnections = (connections, nodes) => {
  const errors = [];
  const nodeIds = nodes.map(node => node.id);
  
  connections.forEach(connection => {
    if (!nodeIds.includes(connection.sourceNodeId)) {
      errors.push(`Connection ${connection.id}: Source node "${connection.sourceNodeId}" not found`);
    }
    if (!nodeIds.includes(connection.targetNodeId)) {
      errors.push(`Connection ${connection.id}: Target node "${connection.targetNodeId}" not found`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Get all connections that have a specific node as source
 * @param {DataFlowConnection[]} connections - Data flow connections
 * @param {string} nodeId - Node ID
 * @returns {DataFlowConnection[]} Outgoing connections
 */
export const getOutgoingConnections = (connections, nodeId) => {
  return connections.filter(connection => connection.sourceNodeId === nodeId);
};

/**
 * Get all connections that have a specific node as target
 * @param {DataFlowConnection[]} connections - Data flow connections
 * @param {string} nodeId - Node ID
 * @returns {DataFlowConnection[]} Incoming connections
 */
export const getIncomingConnections = (connections, nodeId) => {
  return connections.filter(connection => connection.targetNodeId === nodeId);
};

/**
 * Create a new data flow connection
 * @param {string} sourceNodeId - Source node ID
 * @param {string} targetNodeId - Target node ID
 * @param {Object} options - Additional options
 * @returns {DataFlowConnection} New connection
 */
export const createDataFlowConnection = (sourceNodeId, targetNodeId, options = {}) => {
  return {
    id: `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    sourceNodeId,
    targetNodeId,
    condition: options.condition,
    label: options.label,
    metadata: options.metadata || {}
  };
};

/**
 * Remove connections involving a specific node
 * @param {DataFlowConnection[]} connections - Data flow connections
 * @param {string} nodeId - Node ID to remove connections for
 * @returns {DataFlowConnection[]} Filtered connections
 */
export const removeNodeConnections = (connections, nodeId) => {
  return connections.filter(connection => 
    connection.sourceNodeId !== nodeId && connection.targetNodeId !== nodeId
  );
};

/**
 * Update node IDs in connections (useful when node IDs change)
 * @param {DataFlowConnection[]} connections - Data flow connections
 * @param {string} oldNodeId - Old node ID
 * @param {string} newNodeId - New node ID
 * @returns {DataFlowConnection[]} Updated connections
 */
export const updateNodeIdInConnections = (connections, oldNodeId, newNodeId) => {
  return connections.map(connection => ({
    ...connection,
    sourceNodeId: connection.sourceNodeId === oldNodeId ? newNodeId : connection.sourceNodeId,
    targetNodeId: connection.targetNodeId === oldNodeId ? newNodeId : connection.targetNodeId
  }));
}; 