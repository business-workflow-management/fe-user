import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import { useConnectionsStore } from '../../stores/connectionsStore';
import { useAuthStore } from '../../stores/authStore';
import { Button, Card, Heading, Paragraph, Container, Space } from '../../components/ui';
import { Plus, Trash2, Edit } from 'lucide-react';
import ConnectionModal from './ConnectionModal';

const ConnectionsPage = () => {
  const { user } = useAuthStore();
  const { 
    getConnectionsByUserId,
    initializeMockConnections, 
    deleteConnection,
    addConnection,
    updateConnection,
  } = useConnectionsStore();

  const connections = getConnectionsByUserId(user?.id);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingConnection, setEditingConnection] = useState(null);

  useEffect(() => {
    if (user?.id) {
      initializeMockConnections(user.id);
    }
  }, [user, initializeMockConnections]);

  const handleOpenModal = (connection = null) => {
    setEditingConnection(connection);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingConnection(null);
    setIsModalOpen(false);
  };

  const handleSaveConnection = (connectionData) => {
    if (!user?.id) return;
    if (connectionData.id) {
      updateConnection(user.id, connectionData);
    } else {
      addConnection(user.id, connectionData);
    }
  };

  const handleDelete = (connectionId) => {
    if (user?.id) {
      deleteConnection(user.id, connectionId);
    }
  };

  return (
    <Layout>
      <Space size="lg">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <Heading level={1}>Connections</Heading>
            <Button onClick={() => handleOpenModal()}>
              <Plus size={16} className="mr-2" />
              Add Connection
            </Button>
          </div>
          <Paragraph color="secondary" className="mb-8">
            Manage your connections to third-party services here. These credentials will be used by your workflows.
          </Paragraph>

          <div className="space-y-4">
            {connections.length === 0 ? (
              <Card className="p-8 text-center">
                <Paragraph>You haven't added any connections yet.</Paragraph>
              </Card>
            ) : (
              connections.map(conn => (
                <Card key={conn.id} className="p-4 flex justify-between items-center">
                  <div>
                    <Heading level={4} size="sm" className="font-semibold">{conn.name}</Heading>
                    <Paragraph size="sm" color="secondary" className="font-mono">{conn.type}</Paragraph>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenModal(conn)}>
                      <Edit size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(conn.id)}>
                      <Trash2 size={16} className="text-red-500" />
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>
          <ConnectionModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onSave={handleSaveConnection}
            connection={editingConnection}
          />
        </div>
      </Space>
    </Layout>
  );
};

export default ConnectionsPage; 