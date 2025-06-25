import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex flex-col flex-1 overflow-auto">
        <div className="flex-1 overflow-auto py-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout; 