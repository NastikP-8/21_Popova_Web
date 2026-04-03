import React from 'react';
import { Outlet } from 'react-router-dom';
import Menu from './Menu';

const Layout: React.FC = () => {
  return (
    <div style={{ background: '#eef2f7', padding: '80px', minHeight: '100vh' }}>
      <Menu />
      <main style={{ background: 'white', padding: '25px', borderRadius: '16px', boxShadow: '0 2px 8px #141415' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;