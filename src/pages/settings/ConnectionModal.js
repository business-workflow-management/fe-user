import React, { useState, useEffect } from 'react';
import { Modal, Input, Button, Select, Heading } from '../../components/ui';
import { serviceProviderMap } from '../../services/serviceProvider';
import { Eye, EyeOff } from 'lucide-react';

const connectionTypes = Object.keys(serviceProviderMap)
  .filter(type => serviceProviderMap[type].requiresConnection)
  .map(type => ({
    value: type,
    label: serviceProviderMap[type].displayName || type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
  }));

const credentialFieldsConfig = {
  'google-sheets': [{ name: 'token', label: 'Access Token', type: 'password' }],
  'facebook': [{ name: 'token', label: 'Page Access Token', type: 'password' }],
  'instagram': [{ name: 'token', label: 'User Access Token', type: 'password' }],
  'reddit': [{ name: 'token', label: 'OAuth Access Token', type: 'password' }],
  'chatgpt': [{ name: 'apiKey', label: 'API Key', type: 'password' }],
  'telegram-bot': [{ name: 'botToken', label: 'Bot Token', type: 'password' }],
};

const ConnectionModal = ({ isOpen, onClose, onSave, connection }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState(connectionTypes[0].value);
  const [credentials, setCredentials] = useState({});
  const [visibleFields, setVisibleFields] = useState({});

  const isEditMode = !!connection;

  useEffect(() => {
    if (isEditMode && connection) {
      setName(connection.name);
      setType(connection.type);
      setCredentials(connection.credentials || {});
    } else {
      // Reset form for new connection
      setName('');
      setType(connectionTypes[0].value);
      setCredentials({});
    }
    // Reset visibility on open/close
    setVisibleFields({});
  }, [connection, isEditMode, isOpen]);

  const handleCredentialChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const toggleVisibility = (fieldName) => {
    setVisibleFields(prev => ({ ...prev, [fieldName]: !prev[fieldName] }));
  };

  const handleSave = () => {
    const connectionData = {
      ...(isEditMode && { id: connection.id }),
      name,
      type,
      credentials,
    };
    onSave(connectionData);
    onClose();
  };
  
  const currentFields = credentialFieldsConfig[type] || [];

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <Heading level={3} className="mb-6">{isEditMode ? 'Edit Connection' : 'Add New Connection'}</Heading>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Connection Name</label>
            <Input 
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., My Personal Google Account"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Service</label>
            <Select value={type} onChange={(e) => setType(e.target.value)} disabled={isEditMode}>
              {connectionTypes.map(connType => (
                <option key={connType.value} value={connType.value}>{connType.label}</option>
              ))}
            </Select>
          </div>
          
          {currentFields.map(field => (
             <div key={field.name} className="relative">
              <label className="block text-sm font-medium text-gray-700">{field.label}</label>
              <Input
                type={visibleFields[field.name] ? 'text' : field.type}
                name={field.name}
                value={credentials[field.name] || ''}
                onChange={handleCredentialChange}
                placeholder={`Enter your ${field.label}`}
                className="pr-10"
              />
              {field.type === 'password' && (
                <button
                  type="button"
                  onClick={() => toggleVisibility(field.name)}
                  className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                >
                  {visibleFields[field.name] ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>
            {isEditMode ? 'Save Changes' : 'Add Connection'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConnectionModal; 