import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ProjectManagement from './pages/projects/ProjectManagement';
import ProjectWorkspace from './pages/workspace/ProjectWorkspace';
import EnvironmentPage from './pages/settings/EnvironmentPage';
import ConnectionsPage from './pages/settings/ConnectionsPage';
import { useAuthStore } from './stores/authStore';

function App() {
  const { user, loading } = useAuthStore();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-screen bg-gray-50">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={user ? <ProjectManagement /> : <Navigate to="/login" />} />
        <Route path="/projects" element={user ? <ProjectManagement /> : <Navigate to="/login" />} />
        <Route path="/workspace/:projectId" element={user ? <ProjectWorkspace /> : <Navigate to="/login" />} />
        <Route path="/settings/environment" element={user ? <EnvironmentPage /> : <Navigate to="/login" />} />
        <Route path="/settings/connections" element={user ? <ConnectionsPage /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App; 