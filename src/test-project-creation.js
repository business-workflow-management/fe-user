/**
 * Test script for project creation flow
 * Run this in the browser console to test the project creation functionality
 */

// Test the data flow transformer utilities
import { 
  createDataFlowConnection,
  dataFlowToReactFlowEdges,
  reactFlowEdgesToDataFlow,
  validateDataFlowConnections
} from './utils/dataFlowTransformer';

// Test project creation flow
export const testProjectCreation = () => {
  console.log('🧪 Testing Project Creation Flow...');
  
  // Test 1: Data Flow Transformer
  console.log('\n1. Testing Data Flow Transformer:');
  const testConnection = createDataFlowConnection('node-1', 'node-2', {
    label: 'Test connection',
    condition: 'node-1.status === "success"'
  });
  console.log('Created connection:', testConnection);
  
  const testEdges = dataFlowToReactFlowEdges([testConnection]);
  console.log('Transformed to edges:', testEdges);
  
  const backToConnections = reactFlowEdgesToDataFlow(testEdges);
  console.log('Transformed back to connections:', backToConnections);
  
  // Test 2: Project Store (if available)
  console.log('\n2. Testing Project Store:');
  try {
    const { useProjectStore } = require('./stores/projectStore');
    const store = useProjectStore.getState();
    console.log('Store methods available:', Object.keys(store));
  } catch (error) {
    console.log('Store not available in test environment');
  }
  
  // Test 3: Navigation (if available)
  console.log('\n3. Testing Navigation:');
  try {
    const { useNavigate } = require('react-router-dom');
    console.log('React Router available');
  } catch (error) {
    console.log('React Router not available in test environment');
  }
  
  console.log('\n✅ Project creation flow test completed!');
  console.log('\nTo test manually:');
  console.log('1. Go to the Projects page');
  console.log('2. Click "New Project"');
  console.log('3. Fill in name and description');
  console.log('4. Click "Create Project"');
  console.log('5. Should redirect to workspace automatically');
};

// Test the data flow examples
export const testDataFlowExamples = () => {
  console.log('🧪 Testing Data Flow Examples...');
  
  try {
    const { runDataFlowExamples } = require('./examples/dataFlowExample');
    runDataFlowExamples();
  } catch (error) {
    console.log('Data flow examples not available:', error.message);
  }
};

// Run all tests
export const runAllTests = () => {
  console.log('🚀 Running All Tests...\n');
  testProjectCreation();
  console.log('\n' + '='.repeat(50) + '\n');
  testDataFlowExamples();
  console.log('\n🎉 All tests completed!');
};

// Export for browser console usage
if (typeof window !== 'undefined') {
  window.testProjectCreation = testProjectCreation;
  window.testDataFlowExamples = testDataFlowExamples;
  window.runAllTests = runAllTests;
  
  console.log('🧪 Test functions available:');
  console.log('- testProjectCreation()');
  console.log('- testDataFlowExamples()');
  console.log('- runAllTests()');
} 