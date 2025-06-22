import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Copy, Info } from 'lucide-react';
import { extractDataFlowVariables } from '../../utils/variableParser';

const DataFlowHelper = ({ 
  projectNodes, 
  currentNodeId, 
  onInsertVariable, 
  className = '' 
}) => {
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  const [expandedFields, setExpandedFields] = useState(new Set());

  // Get nodes that come before the current node in the flow
  const getPreviousNodes = () => {
    // For now, return all nodes except the current one
    // In a real implementation, you'd trace the actual flow using edges
    return projectNodes.filter(node => node.id !== currentNodeId);
  };

  const toggleNodeExpansion = (nodeId) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const toggleFieldExpansion = (fieldKey) => {
    const newExpanded = new Set(expandedFields);
    if (newExpanded.has(fieldKey)) {
      newExpanded.delete(fieldKey);
    } else {
      newExpanded.add(fieldKey);
    }
    setExpandedFields(newExpanded);
  };

  const insertVariable = (nodeId, fieldPath) => {
    const variable = `{{data.${nodeId}.${fieldPath}}}`;
    onInsertVariable(variable);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  // Mock output data structure for each node type
  const getNodeOutputStructure = (nodeType) => {
    const structures = {
      'google-sheets': {
        'data': 'Array of rows from spreadsheet',
        'data.0': 'First row data',
        'data.0.name': 'Name from first row',
        'data.0.email': 'Email from first row',
        'metadata': 'Spreadsheet metadata',
        'metadata.title': 'Spreadsheet title',
        'metadata.rowCount': 'Number of rows'
      },
      'facebook': {
        'postId': 'ID of created post',
        'postUrl': 'URL of the post',
        'engagement': 'Engagement metrics',
        'engagement.likes': 'Number of likes',
        'engagement.comments': 'Number of comments'
      },
      'instagram': {
        'mediaId': 'ID of uploaded media',
        'mediaUrl': 'URL of the media',
        'engagement': 'Engagement metrics',
        'engagement.likes': 'Number of likes'
      },
      'reddit': {
        'postId': 'ID of created post',
        'postUrl': 'URL of the post',
        'upvotes': 'Number of upvotes',
        'comments': 'Number of comments'
      },
      'telegram-bot': {
        'messageId': 'ID of sent message',
        'chatId': 'Target chat ID',
        'timestamp': 'Message timestamp',
        'status': 'Message status'
      },
      'chatgpt': {
        'response': 'AI generated response',
        'response.text': 'Response text content',
        'tokens': 'Token usage',
        'tokens.prompt': 'Prompt tokens used',
        'tokens.completion': 'Completion tokens used'
      },
      'http-request': {
        'status': 'HTTP status code',
        'data': 'Response data',
        'data.name': 'Name from response',
        'data.email': 'Email from response',
        'headers': 'Response headers'
      },
      'tools': {
        'value': 'Set variable value',
        'variableName': 'Name of the variable'
      }
    };
    
    return structures[nodeType] || {
      'output': 'Node output data',
      'status': 'Execution status',
      'timestamp': 'Execution timestamp'
    };
  };

  const renderFieldItem = (nodeId, fieldPath, description) => {
    const fullPath = `${nodeId}.${fieldPath}`;
    const variable = `{{data.${fullPath}}}`;
    
    return (
      <div key={fullPath} className="flex items-center justify-between py-1 px-3 hover:bg-gray-50">
        <div className="flex-1 min-w-0">
          <div className="text-sm text-gray-700 truncate">{fieldPath}</div>
          <div className="text-xs text-gray-500 truncate">{description}</div>
        </div>
        <div className="flex items-center space-x-1 ml-2">
          <button
            onClick={() => insertVariable(nodeId, fieldPath)}
            className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
            title="Insert variable"
          >
            <Copy size={14} />
          </button>
          <button
            onClick={() => copyToClipboard(variable)}
            className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded"
            title="Copy to clipboard"
          >
            <Copy size={14} />
          </button>
        </div>
      </div>
    );
  };

  const renderNodeFields = (node) => {
    const outputStructure = getNodeOutputStructure(node.type);
    const isExpanded = expandedNodes.has(node.id);
    
    return (
      <div key={node.id} className="border-l border-gray-200 ml-4">
        <div className="flex items-center py-2">
          <button
            onClick={() => toggleNodeExpansion(node.id)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          <div className="ml-2 flex-1">
            <div className="text-sm font-medium text-gray-900">{node.data?.label || node.id}</div>
            <div className="text-xs text-gray-500">{node.type}</div>
          </div>
        </div>
        
        {isExpanded && (
          <div className="ml-6 space-y-1">
            {Object.entries(outputStructure).map(([fieldPath, description]) => 
              renderFieldItem(node.id, fieldPath, description)
            )}
          </div>
        )}
      </div>
    );
  };

  const previousNodes = getPreviousNodes();

  if (previousNodes.length === 0) {
    return (
      <div className={`bg-blue-50 border border-blue-200 rounded-md p-4 ${className}`}>
        <div className="flex items-center">
          <Info size={16} className="text-blue-600 mr-2" />
          <span className="text-sm text-blue-800">
            No previous nodes available. Add nodes to your workflow to reference their data.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gray-50 border border-gray-200 rounded-md ${className}`}>
      <div className="px-4 py-3 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-900">Available Data from Previous Nodes</h3>
        <p className="text-xs text-gray-500 mt-1">
          Click the copy icon to insert variables into your current node
        </p>
      </div>
      
      <div className="p-4 space-y-2 max-h-64 overflow-y-auto">
        {previousNodes.map(renderNodeFields)}
      </div>
      
      <div className="px-4 py-3 border-t border-gray-200 bg-gray-100">
        <div className="text-xs text-gray-600">
          <strong>Format:</strong> {'{{data.nodeId.fieldPath}}'}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Use dot notation for nested fields (e.g., data.0.name)
        </div>
      </div>
    </div>
  );
};

export default DataFlowHelper; 