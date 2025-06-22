import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Save, AlertTriangle } from 'lucide-react';
import { Button, Heading, Space, Flex, Select } from '../ui';
import HighlightableInput from '../ui/HighlightableInput';
import DataFlowHelper from './DataFlowHelper';
import { useProjectStore } from '../../stores/projectStore';
import { useConnectionsStore } from '../../stores/connectionsStore';
import { useAuthStore } from '../../stores/authStore';
import { extractDataFlowVariables } from '../../utils/variableParser';

const NodeEditor = ({ node, onUpdate, onClose, onUpdateNodeId }) => {
  const [formData, setFormData] = useState({});
  const [activeField, setActiveField] = useState(null);
  const [nodeId, setNodeId] = useState('');
  const [showIdWarning, setShowIdWarning] = useState(false);
  const { currentProject } = useProjectStore();
  const { getConnectionsByUserId, initializeMockConnections } = useConnectionsStore();
  const { user } = useAuthStore();

  // Get connections for the current user
  const connections = getConnectionsByUserId(user?.id) || [];

  useEffect(() => {
    if (user?.id) {
      initializeMockConnections(user.id);
    }
  }, [user?.id, initializeMockConnections]);

  useEffect(() => {
    if (node) {
      setFormData(node.data || {});
      setNodeId(node.id || '');
    } else {
      setFormData({});
      setNodeId('');
    }
  }, [node]);

  if (!node) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onUpdate({ ...node, data: formData });
  };

  const checkForReferences = (oldId) => {
    if (!currentProject) return [];
    
    const references = [];
    
    // Check all nodes for references to this node
    currentProject.nodes.forEach(n => {
      if (n.data) {
        const nodeDataStr = JSON.stringify(n.data);
        const variables = extractDataFlowVariables(nodeDataStr);
        variables.forEach(v => {
          if (v.nodeId === oldId) {
            references.push({
              nodeId: n.id,
              nodeLabel: n.data?.label || n.id,
              variable: v.fullMatch
            });
          }
        });
      }
    });
    
    return references;
  };

  const handleNodeIdChange = (e) => {
    const newId = e.target.value;
    setNodeId(newId);
    
    // Check for references to the old ID
    const references = checkForReferences(node.id);
    setShowIdWarning(references.length > 0);
    
    if (onUpdateNodeId && newId !== node.id) {
      onUpdateNodeId(node.id, newId);
    }
  };

  const handleInsertVariable = (variable) => {
    if (activeField) {
      const currentValue = formData[activeField] || '';
      const newValue = currentValue + variable;
      setFormData(prev => ({ ...prev, [activeField]: newValue }));
    }
  };

  const handleFieldFocus = (fieldName) => {
    setActiveField(fieldName);
  };

  const handleFieldBlur = () => {
    setActiveField(null);
  };

  const renderFields = () => {
    // Add null check for connections to prevent filter error
    const relevantConnections = (connections || []).filter(c => c.type === formData.type);
    
    switch (formData.type) {
      case 'google-sheets':
        return (
          <>
            <label className="block text-sm font-medium text-gray-700">Connection</label>
            <Select
              name="connectionId"
              value={formData.connectionId || ''}
              onChange={handleInputChange}
            >
              <option value="">Select a Google Sheets connection</option>
              {relevantConnections.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </Select>
            <label className="mt-4 block text-sm font-medium text-gray-700">Spreadsheet ID</label>
            <HighlightableInput
              type="text"
              name="spreadsheetId"
              placeholder="Enter Google Spreadsheet ID"
              value={formData.spreadsheetId || ''}
              onChange={handleInputChange}
              onFocus={() => handleFieldFocus('spreadsheetId')}
              onBlur={handleFieldBlur}
            />
            <label className="mt-4 block text-sm font-medium text-gray-700">Range</label>
            <HighlightableInput
              type="text"
              name="range"
              placeholder="e.g., Sheet1!A1:B2"
              value={formData.range || ''}
              onChange={handleInputChange}
              onFocus={() => handleFieldFocus('range')}
              onBlur={handleFieldBlur}
            />
          </>
        );
      case 'telegram-bot':
        return (
          <>
            <label className="block text-sm font-medium text-gray-700">Connection</label>
            <Select
              name="connectionId"
              value={formData.connectionId || ''}
              onChange={handleInputChange}
            >
              <option value="">Select a Telegram Bot connection</option>
              {relevantConnections.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </Select>
            <label className="mt-4 block text-sm font-medium text-gray-700">Chat ID</label>
            <HighlightableInput
              type="text"
              name="chatId"
              placeholder="Enter Target Chat ID"
              value={formData.chatId || ''}
              onChange={handleInputChange}
              onFocus={() => handleFieldFocus('chatId')}
              onBlur={handleFieldBlur}
            />
            <label className="mt-4 block text-sm font-medium text-gray-700">Message Text</label>
            <HighlightableInput
              as="textarea"
              name="text"
              value={formData.text || ''}
              onChange={handleInputChange}
              rows={4}
              placeholder="e.g., New lead from {{data.node1.output.name}}"
              onFocus={() => handleFieldFocus('text')}
              onBlur={handleFieldBlur}
            />
          </>
        );
      case 'tools':
        return (
          <>
            <label className="block text-sm font-medium text-gray-700">Variable Name</label>
            <HighlightableInput
              type="text"
              name="variableName"
              value={formData.variableName || ''}
              onChange={handleInputChange}
              onFocus={() => handleFieldFocus('variableName')}
              onBlur={handleFieldBlur}
            />
            <label className="mt-4 block text-sm font-medium text-gray-700">Value</label>
            <HighlightableInput
              as="textarea"
              name="value"
              value={formData.value || ''}
              onChange={handleInputChange}
              rows={3}
              placeholder="e.g., {{data.node1.output.count}} + 1"
              onFocus={() => handleFieldFocus('value')}
              onBlur={handleFieldBlur}
            />
          </>
        );
      case 'facebook':
        return (
          <>
            <label className="block text-sm font-medium text-gray-700">Connection</label>
            <Select
              name="connectionId"
              value={formData.connectionId || ''}
              onChange={handleInputChange}
            >
              <option value="">Select a Facebook connection</option>
              {relevantConnections.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </Select>
            <label className="mt-4 block text-sm font-medium text-gray-700">Page ID</label>
            <HighlightableInput
              type="text"
              name="pageId"
              placeholder="Enter Facebook Page ID"
              value={formData.pageId || ''}
              onChange={handleInputChange}
              onFocus={() => handleFieldFocus('pageId')}
              onBlur={handleFieldBlur}
            />
            <label className="mt-4 block text-sm font-medium text-gray-700">Content</label>
            <HighlightableInput
              as="textarea"
              name="content"
              value={formData.content || ''}
              onChange={handleInputChange}
              rows={4}
              placeholder="e.g., Check out this amazing product: {{data.node1.output.title}}"
              onFocus={() => handleFieldFocus('content')}
              onBlur={handleFieldBlur}
            />
            <label className="mt-4 block text-sm font-medium text-gray-700">Image URL (optional)</label>
            <HighlightableInput
              type="text"
              name="imageUrl"
              placeholder="https://example.com/image.png or {{data.node1.output.imageUrl}}"
              value={formData.imageUrl || ''}
              onChange={handleInputChange}
              onFocus={() => handleFieldFocus('imageUrl')}
              onBlur={handleFieldBlur}
            />
          </>
        );
      case 'instagram':
        return (
          <>
            <label className="block text-sm font-medium text-gray-700">Connection</label>
            <Select
              name="connectionId"
              value={formData.connectionId || ''}
              onChange={handleInputChange}
            >
              <option value="">Select an Instagram connection</option>
              {connections.filter(c => c.type === 'instagram').map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </Select>
            <label className="mt-4 block text-sm font-medium text-gray-700">Instagram User ID</label>
            <HighlightableInput
              type="text"
              name="userId"
              placeholder="Enter Instagram User ID"
              value={formData.userId || ''}
              onChange={handleInputChange}
              onFocus={() => handleFieldFocus('userId')}
              onBlur={handleFieldBlur}
            />
            <label className="mt-4 block text-sm font-medium text-gray-700">Image URL</label>
            <HighlightableInput
              type="text"
              name="imageUrl"
              placeholder="https://example.com/image.png or {{data.node1.output.imageUrl}}"
              value={formData.imageUrl || ''}
              onChange={handleInputChange}
              onFocus={() => handleFieldFocus('imageUrl')}
              onBlur={handleFieldBlur}
            />
            <label className="mt-4 block text-sm font-medium text-gray-700">Caption</label>
            <HighlightableInput
              as="textarea"
              name="content"
              value={formData.content || ''}
              onChange={handleInputChange}
              rows={3}
              placeholder="e.g., Amazing shot! {{data.node1.output.description}}"
              onFocus={() => handleFieldFocus('content')}
              onBlur={handleFieldBlur}
            />
          </>
        );
      case 'reddit':
        return (
          <>
            <label className="block text-sm font-medium text-gray-700">Access Token</label>
            <HighlightableInput
              type="text"
              name="accessToken"
              placeholder="e.g., {{env.REDDIT_TOKEN}}"
              value={formData.accessToken || ''}
              onChange={handleInputChange}
              onFocus={() => handleFieldFocus('accessToken')}
              onBlur={handleFieldBlur}
            />
            <label className="mt-4 block text-sm font-medium text-gray-700">Subreddit</label>
            <HighlightableInput
              type="text"
              name="subreddit"
              placeholder="e.g., 'reactjs'"
              value={formData.subreddit || ''}
              onChange={handleInputChange}
              onFocus={() => handleFieldFocus('subreddit')}
              onBlur={handleFieldBlur}
            />
            <label className="mt-4 block text-sm font-medium text-gray-700">Title</label>
            <HighlightableInput
              type="text"
              name="title"
              placeholder="e.g., {{data.node1.output.title}}"
              value={formData.title || ''}
              onChange={handleInputChange}
              onFocus={() => handleFieldFocus('title')}
              onBlur={handleFieldBlur}
            />
            <label className="mt-4 block text-sm font-medium text-gray-700">Content (for text post)</label>
            <HighlightableInput
              as="textarea"
              name="content"
              value={formData.content || ''}
              onChange={handleInputChange}
              rows={3}
              placeholder="e.g., {{data.node1.output.content}}"
              onFocus={() => handleFieldFocus('content')}
              onBlur={handleFieldBlur}
            />
            <label className="mt-4 block text-sm font-medium text-gray-700">URL (for link post)</label>
            <HighlightableInput
              type="text"
              name="url"
              placeholder="https://example.com/article or {{data.node1.output.url}}"
              value={formData.url || ''}
              onChange={handleInputChange}
              onFocus={() => handleFieldFocus('url')}
              onBlur={handleFieldBlur}
            />
          </>
        );
      case 'http-request':
        return (
          <>
            <label className="block text-sm font-medium text-gray-700">URL</label>
            <HighlightableInput
              type="text"
              name="url"
              placeholder="https://api.example.com/data"
              value={formData.url || ''}
              onChange={handleInputChange}
              onFocus={() => handleFieldFocus('url')}
              onBlur={handleFieldBlur}
            />
            <label className="mt-4 block text-sm font-medium text-gray-700">Method</label>
            <Select
              name="method"
              value={formData.method || 'GET'}
              onChange={handleInputChange}
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
            </Select>

            <label className="mt-4 block text-sm font-medium text-gray-700">Headers (JSON)</label>
            <HighlightableInput
              as="textarea"
              name="headers"
              rows={4}
              placeholder='{ "Content-Type": "application/json", "Authorization": "Bearer {{env.API_KEY}}" }'
              value={formData.headers || ''}
              onChange={handleInputChange}
              onFocus={() => handleFieldFocus('headers')}
              onBlur={handleFieldBlur}
            />

            {(formData.method === 'POST' || formData.method === 'PUT') && (
              <>
                <label className="mt-4 block text-sm font-medium text-gray-700">Body (JSON)</label>
                <HighlightableInput
                  as="textarea"
                  name="body"
                  rows={6}
                  placeholder='{ "key": "value", "nested": {{data.node1.output}} }'
                  value={formData.body || ''}
                  onChange={handleInputChange}
                  onFocus={() => handleFieldFocus('body')}
                  onBlur={handleFieldBlur}
                />
              </>
            )}
          </>
        );
      case 'chatgpt':
        return (
          <>
            <label className="block text-sm font-medium text-gray-700">Connection</label>
            <Select
              name="connectionId"
              value={formData.connectionId || ''}
              onChange={handleInputChange}
            >
              <option value="">Select an OpenAI connection</option>
              {relevantConnections.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </Select>
            <label className="mt-4 block text-sm font-medium text-gray-700">Prompt</label>
            <HighlightableInput
              as="textarea"
              name="prompt"
              value={formData.prompt || ''}
              onChange={handleInputChange}
              rows={6}
              placeholder="e.g., Summarize the following text: {{data.node1.output.text}}"
              onFocus={() => handleFieldFocus('prompt')}
              onBlur={handleFieldBlur}
            />
            <label className="mt-4 block text-sm font-medium text-gray-700">Max Tokens</label>
            <HighlightableInput
              type="number"
              name="maxTokens"
              placeholder="150"
              value={formData.maxTokens || ''}
              onChange={handleInputChange}
              onFocus={() => handleFieldFocus('maxTokens')}
              onBlur={handleFieldBlur}
            />
          </>
        );
      default:
        return <p>No specific configuration for this node type.</p>;
    }
  };

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: node ? 0 : '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed top-0 right-0 h-full w-96 bg-white shadow-lg border-l border-gray-200 flex flex-col z-30"
    >
      {/* Header */}
      <Flex 
        as="header" 
        justify="between" 
        align="center" 
        className="p-4 border-b border-gray-200"
      >
        <Heading level={3} size="lg" weight="semibold">
          Edit {formData.label || 'Node'}
        </Heading>
        <Button variant="ghost" size="sm" onClick={onClose} className="p-2">
          <X size={20} />
        </Button>
      </Flex>

      {/* Form */}
      <Space className="flex-1 overflow-y-auto p-6" size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Label</label>
            <input
              type="text"
              name="label"
              value={formData.label || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Sub-label / Description</label>
            <input
              type="text"
              name="sublabel"
              value={formData.sublabel || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Node Code (ID)</label>
            <div className="mt-1">
              <input
                type="text"
                name="nodeId"
                value={nodeId}
                onChange={handleNodeIdChange}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm font-mono"
                placeholder="e.g., node-1, sheets-reader, etc."
              />
              <p className="mt-1 text-xs text-gray-500">
                This ID is used in data flow variables like {'{{data.{nodeId}.field}}'}. 
                Changing it will affect all references to this node.
              </p>
              
              {/* Warning for ID changes */}
              {showIdWarning && (
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
                  <div className="flex items-start">
                    <AlertTriangle size={16} className="text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
                    <div className="text-xs text-yellow-800">
                      <p className="font-medium mb-1">Warning: This node is referenced in other nodes</p>
                      <p>Changing the node ID may break data flow variables. Please update any references manually.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          {renderFields()}
          
          {/* Data Flow Helper */}
          {currentProject && (
            <div className="mt-6">
              <DataFlowHelper
                projectNodes={currentProject.nodes}
                currentNodeId={node.id}
                onInsertVariable={handleInsertVariable}
              />
            </div>
          )}
        </div>
      </Space>

      {/* Footer */}
      <Flex 
        as="footer" 
        justify="end" 
        align="center" 
        className="p-4 border-t border-gray-200"
      >
        <Button onClick={handleSave} className="flex items-center">
          <Save size={16} className="mr-2" />
          Save Changes
        </Button>
      </Flex>
    </motion.div>
  );
};

export default NodeEditor; 