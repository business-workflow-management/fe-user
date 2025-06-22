import React from 'react';
import { Handle, Position } from 'reactflow';
import { 
  Facebook, 
  Instagram, 
  MessageCircle, 
  Globe, 
  Bot,
  Sheet,
  Send,
  Wrench
} from 'lucide-react';
import { clsx } from 'clsx';
import { Heading, Paragraph } from '../ui';

const nodeIcons = {
  'google-sheets': { icon: Sheet, color: 'text-green-600', label: 'Sheets' },
  'facebook': { icon: Facebook, color: 'text-blue-600', label: 'Facebook' },
  'instagram': { icon: Instagram, color: 'text-pink-600', label: 'Instagram' },
  'reddit': { icon: MessageCircle, color: 'text-orange-600', label: 'Reddit' },
  'http-request': { icon: Globe, color: 'text-cyan-600', label: 'HTTP' },
  'chatgpt': { icon: Bot, color: 'text-teal-500', label: 'AI' },
  'telegram-bot': { icon: Send, color: 'text-sky-500', label: 'Telegram' },
  'tools': { icon: Wrench, color: 'text-violet-500', label: 'Tools' },
  'default': { icon: Wrench, color: 'text-gray-600', label: 'Node' }
};

const FlowNode = ({ id, type, data, selected }) => {
  // Temporary debugging
  console.log('FlowNode render:', { id, type, data, selected });
  
  // Accept both top-level and data.type
  const nodeType = data?.type || type || 'default';
  const { status } = data;
  const { label, sublabel } = data;
  const { icon: Icon, color, label: typeLabel } = nodeIcons[nodeType] || nodeIcons['default'];

  console.log('Processed data:', { nodeType, status, label, sublabel, typeLabel, Icon: Icon?.name });

  const statusBorderColor = () => {
    switch (status) {
      case 'success': return 'border-green-500';
      case 'error': return 'border-red-500';
      case 'running': return 'border-yellow-500 animate-pulse-slow';
      default: return 'border-gray-300';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'success': return '✓';
      case 'error': return '✗';
      case 'running': return '⟳';
      default: return '';
    }
  };

  return (
    <div
      className={clsx(
        'w-44 h-48 p-3 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-200 border-2 bg-white shadow-sm text-center relative',
        statusBorderColor(),
        selected && 'ring-2 ring-blue-500'
      )}
    >
      <Handle type="target" position={Position.Top} id="top" className="!bg-gray-400" />
      <Handle type="target" position={Position.Left} id="left" className="!bg-gray-400" />
      
      {/* Type Label */}
      <div className="absolute top-2 left-2 right-2">
        <div className={clsx(
          'text-xs font-semibold px-2 py-1 rounded-full text-white',
          nodeType === 'google-sheets' ? 'bg-green-600' :
          nodeType === 'facebook' ? 'bg-blue-600' :
          nodeType === 'instagram' ? 'bg-pink-600' :
          nodeType === 'reddit' ? 'bg-orange-600' :
          nodeType === 'http-request' ? 'bg-cyan-600' :
          nodeType === 'chatgpt' ? 'bg-teal-600' :
          nodeType === 'telegram-bot' ? 'bg-sky-600' :
          nodeType === 'tools' ? 'bg-violet-600' :
          'bg-gray-600'
        )}>
          {typeLabel}
        </div>
      </div>

      {/* Status Indicator */}
      {status && status !== 'pending' && (
        <div className="absolute top-2 right-2">
          <div className={clsx(
            'w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white',
            status === 'success' ? 'bg-green-500' :
            status === 'error' ? 'bg-red-500' :
            status === 'running' ? 'bg-yellow-500' : 'bg-gray-500'
          )}>
            {getStatusIcon()}
          </div>
        </div>
      )}

      {/* Main Icon */}
      <div className={clsx(
        'w-16 h-16 rounded-2xl flex-shrink-0 flex items-center justify-center mt-4',
        nodeType === 'google-sheets' ? 'bg-green-100' :
        nodeType === 'facebook' ? 'bg-blue-100' :
        nodeType === 'instagram' ? 'bg-pink-100' :
        nodeType === 'reddit' ? 'bg-orange-100' :
        nodeType === 'http-request' ? 'bg-cyan-100' :
        nodeType === 'chatgpt' ? 'bg-teal-100' :
        nodeType === 'telegram-bot' ? 'bg-sky-100' :
        nodeType === 'tools' ? 'bg-violet-100' :
        'bg-gray-100'
      )}>
        <Icon size={32} className={color} />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1 flex flex-col justify-center">
        <Heading level={6} size="xs" weight="semibold" className="whitespace-normal mb-1">
          {label || 'Unnamed Node'}
        </Heading>
        <Paragraph size="xs" color="secondary" className="whitespace-normal mb-1">
          {sublabel || 'Action'}
        </Paragraph>
        
        {/* Node Code */}
        <div className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded">
          {data?.id || id}
        </div>
      </div>

      <Handle type="source" position={Position.Right} id="right" className="!bg-gray-400" />
      <Handle type="source" position={Position.Bottom} id="bottom" className="!bg-gray-400" />
    </div>
  );
};

export default React.memo(FlowNode); 