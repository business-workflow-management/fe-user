import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Facebook, 
  Instagram, 
  MessageCircle, 
  Globe, 
  Bot,
  Plus,
  Search,
  Sheet,
  Send,
  Wrench,
  X
} from 'lucide-react';
import { clsx } from 'clsx';
import { Heading, Button } from '../ui';

const NodePanel = ({ onAddNode, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const nodeTypes = [
    {
      type: 'google-sheets',
      label: 'Google Sheets',
      description: 'Read and write data from Google Sheets',
      icon: Sheet,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      type: 'telegram-bot',
      label: 'Telegram Bot',
      description: 'Send messages via Telegram bot',
      icon: Send,
      color: 'text-sky-600',
      bgColor: 'bg-sky-50',
      borderColor: 'border-sky-200'
    },
    {
      type: 'facebook',
      label: 'Facebook Pages',
      description: 'Create posts on Facebook pages',
      icon: Facebook,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      type: 'instagram',
      label: 'Instagram',
      description: 'Post to Instagram stories and feeds',
      icon: Instagram,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200'
    },
    {
      type: 'reddit',
      label: 'Reddit',
      description: 'Create posts on Reddit subreddits',
      icon: MessageCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
    {
      type: 'http-request',
      label: 'HTTP Request',
      description: 'Make API calls and webhooks',
      icon: Globe,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      borderColor: 'border-cyan-200'
    },
    {
      type: 'chatgpt',
      label: 'ChatGPT',
      description: 'Generate content with AI',
      icon: Bot,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-200'
    },
    {
      type: 'tools',
      label: 'Tools',
      description: 'Set variables, conditional logic, etc.',
      icon: Wrench,
      color: 'text-violet-600',
      bgColor: 'bg-violet-50',
      borderColor: 'border-violet-200'
    }
  ];

  const filteredNodes = nodeTypes.filter(node =>
    node.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    node.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddNode = (nodeType) => {
    onAddNode(nodeType.type);
  };

  return (
    <motion.div
      initial={{ x: '-100%' }}
      animate={{ x: 0 }}
      exit={{ x: '-100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed top-0 left-0 h-full w-80 bg-white shadow-lg border-r border-gray-200 flex flex-col z-30"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <Heading level={3} size="lg" weight="semibold">Add Node</Heading>
          <Button variant="ghost" size="sm" onClick={onClose} className="p-2">
            <X size={20} />
          </Button>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search components..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Node List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredNodes.map((nodeType) => {
          const Icon = nodeType.icon;
          return (
            <motion.div
              key={nodeType.type}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={clsx(
                'p-3 border rounded-lg cursor-pointer transition-all duration-200',
                nodeType.borderColor,
                nodeType.bgColor,
                'hover:shadow-md'
              )}
              onClick={() => handleAddNode(nodeType)}
            >
              <div className="flex items-center space-x-3">
                <div className={clsx('p-2 rounded-lg bg-white', nodeType.borderColor)}>
                  <Icon size={20} className={nodeType.color} />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">
                    {nodeType.label}
                  </h4>
                  <p className="text-xs text-gray-600 mt-1">
                    {nodeType.description}
                  </p>
                </div>
                <Plus size={16} className="text-gray-400" />
              </div>
            </motion.div>
          );
        })}

        {filteredNodes.length === 0 && (
          <div className="text-center py-8">
            <Search size={32} className="mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">No components found</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          Click on a component to add it to your workflow
        </p>
      </div>
    </motion.div>
  );
};

export default NodePanel; 