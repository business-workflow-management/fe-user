/**
 * Data Flow Architecture Example
 * 
 * This example demonstrates how the new data flow architecture separates
 * business logic from visualization concerns.
 */

import { 
  dataFlowToReactFlowEdges, 
  reactFlowEdgesToDataFlow,
  createDataFlowConnection,
  validateDataFlowConnections,
  getOutgoingConnections,
  getIncomingConnections
} from '../utils/dataFlowTransformer';

// Example 1: Creating a simple workflow
const exampleWorkflow = () => {
  console.log('=== Example 1: Simple Workflow ===');
  
  // Business logic connections (independent of visualization)
  const dataFlowConnections = [
    createDataFlowConnection('node-1', 'node-2', {
      label: 'Customer data to ad generation',
      metadata: { priority: 'high' }
    }),
    createDataFlowConnection('node-2', 'node-3', {
      label: 'Ad copy to Facebook post',
      condition: 'node-2.status === "success"'
    }),
    createDataFlowConnection('node-1', 'node-4', {
      label: 'Customer data to notification',
      metadata: { priority: 'medium' }
    })
  ];
  
  console.log('Data Flow Connections:', dataFlowConnections);
  
  // Transform to React Flow edges for visualization
  const reactFlowEdges = dataFlowToReactFlowEdges(dataFlowConnections);
  console.log('React Flow Edges:', reactFlowEdges);
  
  // Transform back to business logic
  const backToConnections = reactFlowEdgesToDataFlow(reactFlowEdges);
  console.log('Back to Connections:', backToConnections);
  
  return { dataFlowConnections, reactFlowEdges };
};

// Example 2: Validation and querying
const exampleValidation = () => {
  console.log('\n=== Example 2: Validation and Querying ===');
  
  const nodes = [
    { id: 'node-1', type: 'google-sheets' },
    { id: 'node-2', type: 'chatgpt' },
    { id: 'node-3', type: 'facebook' },
    { id: 'node-4', type: 'telegram' }
  ];
  
  const connections = [
    createDataFlowConnection('node-1', 'node-2'),
    createDataFlowConnection('node-2', 'node-3'),
    createDataFlowConnection('node-1', 'node-4'),
    // This will cause a validation error
    createDataFlowConnection('node-1', 'non-existent-node')
  ];
  
  // Validate connections
  const validation = validateDataFlowConnections(connections, nodes);
  console.log('Validation Result:', validation);
  
  // Query connections
  const outgoingFromNode1 = getOutgoingConnections(connections, 'node-1');
  const incomingToNode3 = getIncomingConnections(connections, 'node-3');
  
  console.log('Outgoing from node-1:', outgoingFromNode1);
  console.log('Incoming to node-3:', incomingToNode3);
  
  return { validation, outgoingFromNode1, incomingToNode3 };
};

// Example 3: Complex workflow with conditions
const exampleComplexWorkflow = () => {
  console.log('\n=== Example 3: Complex Workflow ===');
  
  const complexConnections = [
    createDataFlowConnection('data-source', 'processor', {
      label: 'Raw data to processor',
      condition: 'data-source.recordCount > 0'
    }),
    createDataFlowConnection('processor', 'ai-generator', {
      label: 'Processed data to AI',
      condition: 'processor.status === "success" && processor.data.length > 0'
    }),
    createDataFlowConnection('ai-generator', 'facebook-poster', {
      label: 'AI content to Facebook',
      condition: 'ai-generator.response.quality > 0.8'
    }),
    createDataFlowConnection('ai-generator', 'instagram-poster', {
      label: 'AI content to Instagram',
      condition: 'ai-generator.response.hasImage === true'
    }),
    createDataFlowConnection('facebook-poster', 'notifier', {
      label: 'Facebook success to notification',
      condition: 'facebook-poster.status === "success"'
    }),
    createDataFlowConnection('instagram-poster', 'notifier', {
      label: 'Instagram success to notification',
      condition: 'instagram-poster.status === "success"'
    })
  ];
  
  console.log('Complex Workflow Connections:', complexConnections);
  
  // Transform to React Flow edges
  const complexEdges = dataFlowToReactFlowEdges(complexConnections);
  console.log('Complex React Flow Edges:', complexEdges);
  
  return { complexConnections, complexEdges };
};

// Example 4: Migration from legacy edges
const exampleMigration = () => {
  console.log('\n=== Example 4: Migration from Legacy Edges ===');
  
  // Legacy React Flow edges (old format)
  const legacyEdges = [
    {
      id: 'e1-2',
      source: 'node-1',
      target: 'node-2',
      sourceHandle: 'right',
      targetHandle: 'left',
      markerEnd: { type: 'arrowclosed' }
    },
    {
      id: 'e2-3',
      source: 'node-2',
      target: 'node-3',
      sourceHandle: 'right',
      targetHandle: 'left',
      markerEnd: { type: 'arrowclosed' }
    }
  ];
  
  console.log('Legacy Edges:', legacyEdges);
  
  // Migrate to new data flow connections
  const migratedConnections = reactFlowEdgesToDataFlow(legacyEdges);
  console.log('Migrated Connections:', migratedConnections);
  
  // Transform back to new React Flow format
  const newEdges = dataFlowToReactFlowEdges(migratedConnections);
  console.log('New React Flow Edges:', newEdges);
  
  return { legacyEdges, migratedConnections, newEdges };
};

// Run all examples
export const runDataFlowExamples = () => {
  console.log('🚀 Running Data Flow Architecture Examples\n');
  
  const example1 = exampleWorkflow();
  const example2 = exampleValidation();
  const example3 = exampleComplexWorkflow();
  const example4 = exampleMigration();
  
  console.log('\n✅ All examples completed successfully!');
  console.log('\nKey Benefits of the New Architecture:');
  console.log('1. Business logic is separated from visualization');
  console.log('2. Easy to test and validate data flow logic');
  console.log('3. Framework-agnostic data flow management');
  console.log('4. Better maintainability and extensibility');
  console.log('5. Support for complex conditions and metadata');
  
  return {
    example1,
    example2,
    example3,
    example4
  };
};

// Export individual examples for testing
export {
  exampleWorkflow,
  exampleValidation,
  exampleComplexWorkflow,
  exampleMigration
}; 