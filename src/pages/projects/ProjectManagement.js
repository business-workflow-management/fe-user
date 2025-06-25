import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Play, 
  Clock, 
  Calendar, 
  MoreVertical,
  Trash2
} from 'lucide-react';
import { useProjectStore } from '../../stores/projectStore';
import { useAuthStore } from '../../stores/authStore';
import Layout from '../../components/layout/Layout';
import { 
  Container, 
  Card, 
  Button, 
  Input, 
  Modal, 
  Space, 
  Flex, 
  Grid, 
  Heading, 
  Paragraph 
} from '../../components/ui';

const ProjectManagement = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { 
    getProjectsByUserId, 
    createProject, 
    deleteProject, 
    fetchProjects 
  } = useProjectStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
  });

  const projects = getProjectsByUserId(user?.id);

  useEffect(() => {
    if (user?.id) {
      fetchProjects(user.id);
    }
  }, [user?.id, fetchProjects]);

  const filteredProjects = projects.filter(Boolean).filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || project.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleCreateProject = async () => {
    if (!newProject.name.trim()) {
      toast.error('Project name is required');
      return;
    }

    if (!user?.id) {
      toast.error('User not authenticated');
      return;
    }

    console.log('Creating project:', { userId: user.id, projectData: newProject });

    // Create the project and get the created project
    const createdProject = await createProject(user.id, newProject);
    
    // Reset form and close modal
    setNewProject({ name: '', description: '' });
    setShowCreateModal(false);
    
    // Show success message
    toast.success('Project created successfully!');
    
    // Redirect to workspace immediately
    if (createdProject) {
      console.log('Redirecting to workspace:', `/workspace/${createdProject.id}`);
      navigate(`/workspace/${createdProject.id}`);
    } else {
      console.error('Failed to create project');
      toast.error('Failed to create project. Please try again.');
    }
  };

  const handleDeleteProject = () => {
    if (selectedProject && user?.id) {
      deleteProject(user.id, selectedProject.id);
      setShowDeleteModal(false);
      setSelectedProject(null);
      toast.success('Project deleted successfully!');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-success-100 text-success-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'paused':
        return 'bg-warning-100 text-warning-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <Play size={12} className="text-success-600" />;
      case 'draft':
        return <Edit size={12} className="text-gray-600" />;
      case 'paused':
        return <Clock size={12} className="text-warning-600" />;
      default:
        return <Edit size={12} className="text-gray-600" />;
    }
  };

  return (
    <Layout>
      <div className="px-8 w-full">
        <Space size="lg">
          {/* Header */}
          <Flex justify="between" align="center">
            <Space size="sm">
              <Heading level={1} size="2xl" weight="bold" color="default">
                Projects
              </Heading>
              <Paragraph size="sm" color="secondary">
                Manage your social media marketing workflows
              </Paragraph>
            </Space>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus size={16} className="mr-2" />
              New Project
            </Button>
          </Flex>

          {/* Filters */}
          <Card>
            <Flex align="center" gap="lg">
              <Flex className="flex-1">
                <div className="relative w-full">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </Flex>
              <Flex align="center" gap="sm">
                <Filter size={16} className="text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="paused">Paused</option>
                </select>
              </Flex>
            </Flex>
          </Card>

          {/* Projects Grid */}
          <Grid cols={3} gap="lg" className="md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="hover:shadow-md transition-shadow">
                <Flex direction="col" className="h-full">
                  <Flex justify="between" align="start">
                    <Flex direction="col" className="flex-1">
                      <Flex align="center" gap="sm" className="mb-2">
                        <Heading level={3} size="lg" weight="semibold" color="default">
                          {project.name}
                        </Heading>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                          {getStatusIcon(project.status)}
                          <span className="ml-1 capitalize">{project.status}</span>
                        </span>
                      </Flex>
                      <Paragraph size="sm" color="secondary" className="mb-4">
                        {project.description}
                      </Paragraph>
                      <Flex align="center" gap="lg" className="text-xs text-gray-500">
                        <Flex align="center" gap="xs">
                          <Calendar size={12} />
                          {format(new Date(project.createdAt), 'MMM dd, yyyy')}
                        </Flex>
                        <Flex align="center" gap="xs">
                          <Clock size={12} />
                          {format(new Date(project.updatedAt), 'MMM dd, yyyy')}
                        </Flex>
                      </Flex>
                    </Flex>
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <MoreVertical size={16} />
                    </button>
                  </Flex>
                  
                  <Flex justify="between" align="center" className="mt-4">
                    <Paragraph size="sm" color="secondary">
                      {project.nodes?.length || 0} nodes
                    </Paragraph>
                    <Flex gap="sm">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedProject(project)}
                      >
                        <Edit size={14} className="mr-1" />
                        Edit
                      </Button>
                      <Link to={`/workspace/${project.id}`}>
                        <Button size="sm">
                          <Play size={14} className="mr-1" />
                          Open
                        </Button>
                      </Link>
                    </Flex>
                  </Flex>
                </Flex>
              </Card>
            ))}
          </Grid>

          {/* Empty State */}
          {filteredProjects.length === 0 && (
            <Card className="text-center py-12">
              <Space size="md">
                <div className="text-gray-400">
                  <Plus size={48} className="mx-auto" />
                </div>
                <Heading level={3} size="lg" weight="medium" color="default">
                  No projects found
                </Heading>
                <Paragraph size="base" color="secondary">
                  {searchTerm || filterStatus !== 'all' 
                    ? 'Try adjusting your search or filters'
                    : 'Get started by creating your first project'
                  }
                </Paragraph>
                {!searchTerm && filterStatus === 'all' && (
                  <Button onClick={() => setShowCreateModal(true)}>
                    <Plus size={16} className="mr-2" />
                    Create Project
                  </Button>
                )}
              </Space>
            </Card>
          )}

          {/* Create Project Modal */}
          <Modal
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            title="Create New Project"
          >
            <Space size="md">
              <Input
                label="Project Name"
                value={newProject.name}
                onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter project name"
              />
              <Input
                label="Description"
                value={newProject.description}
                onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter project description"
              />
              <Flex justify="end" gap="sm">
                <Button
                  variant="secondary"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateProject}>
                  Create Project
                </Button>
              </Flex>
            </Space>
          </Modal>

          {/* Delete Confirmation Modal */}
          <Modal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            title="Delete Project"
          >
            <Space size="md">
              <Paragraph size="base" color="secondary">
                Are you sure you want to delete "{selectedProject?.name}"? This action cannot be undone.
              </Paragraph>
              <Flex justify="end" gap="sm">
                <Button
                  variant="secondary"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="error"
                  onClick={handleDeleteProject}
                >
                  <Trash2 size={16} className="mr-2" />
                  Delete
                </Button>
              </Flex>
            </Space>
          </Modal>
        </Space>
      </div>
    </Layout>
  );
};

export default ProjectManagement; 