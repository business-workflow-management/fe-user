import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FolderKanban,
  Shield,
  User,
  Sun,
  Moon,
  LogOut,
  Settings,
  Link2,
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { clsx } from 'clsx';
import toast from 'react-hot-toast';

const Tooltip = ({ text, children }) => {
  return (
    <div className="relative group flex items-center">
      {children}
      <div className="absolute left-full ml-4 w-auto min-w-max p-2 text-xs font-medium text-white bg-gray-800 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        {text}
      </div>
    </div>
  );
};

const SidebarIcon = ({ to, icon: Icon, text }) => (
  <Tooltip text={text}>
    <NavLink
      to={to}
      className={({ isActive }) =>
        clsx(
          'flex items-center justify-center p-3 rounded-lg transition-colors',
          isActive
            ? 'bg-primary-500 text-white'
            : 'text-gray-500 hover:bg-gray-200 hover:text-gray-800'
        )
      }
    >
      <Icon size={24} />
    </NavLink>
  </Tooltip>
);

const Sidebar = () => {
  const { logout } = useAuthStore();
  // Simple theme toggle for now
  const [theme, setTheme] = React.useState('light');

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
    // In a real app, you'd also apply this to the HTML element
    toast.success(`Switched to ${theme === 'light' ? 'dark' : 'light'} theme`);
  };

  return (
    <aside className="w-20 bg-gray-100 border-r border-gray-200 flex flex-col items-center justify-between p-4">
      {/* Main Navigation */}
      <nav className="flex flex-col items-center gap-4">
        <SidebarIcon to="/projects" icon={FolderKanban} text="Projects" />
        <SidebarIcon
          to="/settings/environment"
          icon={Shield}
          text="Environment Variables"
        />
        <SidebarIcon
          to="/settings/connections"
          icon={Link2}
          text="Connections"
        />
      </nav>

      {/* Bottom Actions */}
      <nav className="flex flex-col items-center gap-4">
        <Tooltip text="Profile">
          <button className="p-3 text-gray-500 hover:bg-gray-200 hover:text-gray-800 rounded-lg transition-colors">
            <User size={24} />
          </button>
        </Tooltip>
        <Tooltip text={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}>
          <button
            onClick={toggleTheme}
            className="p-3 text-gray-500 hover:bg-gray-200 hover:text-gray-800 rounded-lg transition-colors"
          >
            {theme === 'light' ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </Tooltip>
        <Tooltip text="Settings">
           <NavLink
            to="/settings/environment"
            className={({ isActive }) =>
              clsx(
                'flex items-center justify-center p-3 rounded-lg transition-colors',
                isActive
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-500 hover:bg-gray-200 hover:text-gray-800'
              )
            }
          >
            <Settings size={24} />
          </NavLink>
        </Tooltip>
        <Tooltip text="Logout">
          <button
            onClick={handleLogout}
            className="p-3 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
          >
            <LogOut size={24} />
          </button>
        </Tooltip>
      </nav>
    </aside>
  );
};

export default Sidebar; 