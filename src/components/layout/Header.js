import React, { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { LogOut, User, Settings, Bell } from 'lucide-react';
import { Button, Modal, Container, Heading, Flex, Space } from '../ui';

const Header = () => {
  const { user, logout } = useAuthStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <>
      <Container 
        as="header" 
        className="bg-white border-b border-gray-200 py-4"
        padding="none"
      >
        <Flex justify="between" align="center">
          {/* Logo */}
          <Flex align="center">
            <Heading level={1} size="xl" weight="bold" color="primary">
              Social Marketing Platform
            </Heading>
          </Flex>

          {/* Right side */}
          <Flex align="center" gap="md">
            {/* Notifications */}
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Bell size={20} />
            </button>

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <img
                  src={user?.avatar || 'https://via.placeholder.com/32'}
                  alt="User avatar"
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm font-medium text-gray-700">
                  {user?.name || 'User'}
                </span>
              </button>

              {/* Dropdown menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                  <button
                    onClick={() => {
                      setShowSettings(true);
                      setShowUserMenu(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <User size={16} className="mr-2" />
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      setShowSettings(true);
                      setShowUserMenu(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Settings size={16} className="mr-2" />
                    Settings
                  </button>
                  <hr className="my-1" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </Flex>
        </Flex>
      </Container>

      {/* Settings Modal */}
      <Modal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        title="Settings"
        size="lg"
      >
        <Space size="md">
          <p className="text-gray-600">
            Settings functionality will be implemented here.
          </p>
          <Flex justify="end">
            <Button onClick={() => setShowSettings(false)}>
              Close
            </Button>
          </Flex>
        </Space>
      </Modal>
    </>
  );
};

export default Header; 