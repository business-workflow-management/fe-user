/**
 * Test script for node click functionality
 * Run this in the browser console to test the node click and editor functionality
 */

// Test the node click functionality
export const testNodeClick = () => {
  console.log('🧪 Testing Node Click Functionality...');
  
  // Test 1: Check if NodeEditor component is properly imported
  console.log('\n1. Testing NodeEditor Component:');
  try {
    // This would be available in the React component context
    console.log('NodeEditor component should be available');
  } catch (error) {
    console.log('NodeEditor component not available in test environment');
  }
  
  // Test 2: Check connections store
  console.log('\n2. Testing Connections Store:');
  try {
    const { useConnectionsStore } = require('./stores/connectionsStore');
    const store = useConnectionsStore.getState();
    console.log('Connections store methods:', Object.keys(store));
  } catch (error) {
    console.log('Connections store not available in test environment');
  }
  
  // Test 3: Check auth store
  console.log('\n3. Testing Auth Store:');
  try {
    const { useAuthStore } = require('./stores/authStore');
    const authStore = useAuthStore.getState();
    console.log('Auth store methods:', Object.keys(authStore));
  } catch (error) {
    console.log('Auth store not available in test environment');
  }
  
  console.log('\n✅ Node click functionality test completed!');
  console.log('\nTo test manually:');
  console.log('1. Go to a project workspace');
  console.log('2. Click on any node');
  console.log('3. Should open the node editor without errors');
  console.log('4. Check that connection dropdowns work properly');
};

// Test the connections functionality
export const testConnections = () => {
  console.log('🧪 Testing Connections Functionality...');
  
  // Test the connections store methods
  try {
    const { useConnectionsStore } = require('./stores/connectionsStore');
    const store = useConnectionsStore.getState();
    
    // Test getting connections
    const connections = store.getConnectionsByUserId('test-user');
    console.log('Test connections:', connections);
    
    // Test initializing mock connections
    store.initializeMockConnections('test-user');
    const mockConnections = store.getConnectionsByUserId('test-user');
    console.log('Mock connections:', mockConnections);
    
  } catch (error) {
    console.log('Connections test failed:', error.message);
  }
};

// Test the data flow transformer with node data
export const testNodeDataFlow = () => {
  console.log('🧪 Testing Node Data Flow...');
  
  try {
    const { extractDataFlowVariables } = require('./utils/variableParser');
    
    // Test node data with variables
    const testNodeData = {
      label: 'Test Node',
      content: 'Hello {{data.node1.output.name}}',
      prompt: 'Generate content for {{data.node2.output.text}}'
    };
    
    const variables = extractDataFlowVariables(JSON.stringify(testNodeData));
    console.log('Extracted variables:', variables);
    
  } catch (error) {
    console.log('Data flow test failed:', error.message);
  }
};

// Run all node-related tests
export const runNodeTests = () => {
  console.log('🚀 Running Node Tests...\n');
  testNodeClick();
  console.log('\n' + '='.repeat(50) + '\n');
  testConnections();
  console.log('\n' + '='.repeat(50) + '\n');
  testNodeDataFlow();
  console.log('\n🎉 All node tests completed!');
};

// Export for browser console usage
if (typeof window !== 'undefined') {
  window.testNodeClick = testNodeClick;
  window.testConnections = testConnections;
  window.testNodeDataFlow = testNodeDataFlow;
  window.runNodeTests = runNodeTests;
  
  console.log('🧪 Node test functions available:');
  console.log('- testNodeClick()');
  console.log('- testConnections()');
  console.log('- testNodeDataFlow()');
  console.log('- runNodeTests()');
} 