import React, { useState } from 'react';
import { useEnvStore } from '../../stores/envStore';
import { useAuthStore } from '../../stores/authStore';
import { Container, Heading, Paragraph, Flex, Input, Button, Card, Space } from '../../components/ui';
import { Trash2, Plus, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import Layout from '../../components/layout/Layout';

const EnvironmentPage = () => {
  const { getEnvVarsByUserId, setEnvVar, deleteEnvVar } = useEnvStore();
  const { user } = useAuthStore();
  const [newVar, setNewVar] = useState({ key: '', value: '' });
  const [showValues, setShowValues] = useState({});

  // Get user-specific env vars
  const envVars = getEnvVarsByUserId(user?.id);

  const handleAddVar = () => {
    if (!user) {
      toast.error('You must be logged in to add variables.');
      return;
    }
    if (!newVar.key || !newVar.value) {
      toast.error('Both key and value are required.');
      return;
    }
    if (/\s/.test(newVar.key)) {
      toast.error('Variable keys cannot contain whitespace.');
      return;
    }
    setEnvVar(user.id, newVar.key, newVar.value);
    toast.success(`Variable '${newVar.key}' saved!`);
    setNewVar({ key: '', value: '' });
  };
  
  const handleDeleteVar = (key) => {
    if (!user) {
      toast.error('You must be logged in to delete variables.');
      return;
    }
    if (window.confirm(`Are you sure you want to delete the variable '${key}'?`)) {
      deleteEnvVar(user.id, key);
      toast.success(`Variable '${key}' deleted.`);
    }
  };

  const toggleShowValue = (key) => {
    setShowValues(prev => ({...prev, [key]: !prev[key]}));
  };

  return (
    <Layout>
      <Space size="lg">
        <div className="p-6">
          <Heading level={1}>Environment Variables</Heading>
          <Paragraph color="secondary">
            Manage your secret keys and tokens here. These are stored encrypted in your browser's local storage and are never sent to our servers.
          </Paragraph>

          <Card className="mt-8">
            <Heading level={3} className="p-4 border-b">Add New Variable</Heading>
            <Flex gap="md" align="end" className="p-4">
              <div className="flex-1">
                <label className="text-sm font-medium">Key</label>
                <Input 
                  placeholder="e.g., OPENAI_API_KEY"
                  value={newVar.key}
                  onChange={(e) => setNewVar({...newVar, key: e.target.value.toUpperCase().replace(/\s/g, '_')})}
                />
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium">Value</label>
                <Input 
                  type="password"
                  placeholder="Enter your secret value"
                  value={newVar.value}
                  onChange={(e) => setNewVar({...newVar, value: e.target.value})}
                />
              </div>
              <Button onClick={handleAddVar}><Plus className="mr-2" size={16} /> Add Variable</Button>
            </Flex>
          </Card>
          
          <Card className="mt-8">
            <Heading level={3} className="p-4 border-b">Saved Variables</Heading>
            <div className="p-4">
              {envVars.length === 0 ? (
                <Paragraph color="secondary" align="center" className="py-4">No variables saved yet.</Paragraph>
              ) : (
                <ul className="space-y-3">
                  {envVars.map(({ key, value }) => (
                    <li key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <Flex align="center" gap="md">
                        <code className="font-mono text-sm bg-gray-200 px-2 py-1 rounded">{key}</code>
                        <span className="text-gray-500 font-mono">
                          {showValues[key] ? value : '••••••••••••••••'}
                        </span>
                      </Flex>
                      <Flex gap="sm">
                        <Button variant="ghost" size="icon" onClick={() => toggleShowValue(key)}>
                          {showValues[key] ? <EyeOff size={16} /> : <Eye size={16} />}
                        </Button>
                        <Button variant="destructive-outline" size="icon" onClick={() => handleDeleteVar(key)}>
                          <Trash2 size={16} />
                        </Button>
                      </Flex>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Card>
        </div>
      </Space>
    </Layout>
  );
};

export default EnvironmentPage; 