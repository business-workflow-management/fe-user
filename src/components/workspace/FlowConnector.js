import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Flex } from '../ui';

const FlowConnector = ({ onAdd }) => {
  const [hovered, setHovered] = useState(false);
  
  return (
    <Flex 
      align="center" 
      justify="center" 
      className="w-20 h-32"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="w-full border-t-2 border-dashed border-gray-300 relative" />
      {hovered && (
        <button 
          onClick={onAdd} 
          className="absolute bg-white p-1 rounded-full shadow-lg border border-gray-300 hover:bg-primary-500 hover:text-white transition-all"
        >
          <Plus size={16} />
        </button>
      )}
    </Flex>
  );
};

export default FlowConnector; 