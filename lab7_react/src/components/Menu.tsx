import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Menu: React.FC = () => {
  const location = useLocation();

  return (
    <nav style={{
      background: '#2c3e50',
      padding: '12px 20px',
      borderRadius: '12px',
      marginBottom: '20px',
      display: 'flex',
      gap: '12px',
      justifyContent: 'center'
    }}>
      <Link to="/posts" style={{
        background: location.pathname === '/posts' ? '#1abc9c' : '#3498db',
        color: 'white',
        padding: '8px 20px',
        borderRadius: '8px',
        textDecoration: 'none'
      }}>Записи</Link>
      <Link to="/facts" style={{
        background: location.pathname === '/facts' ? '#1abc9c' : '#3498db',
        color: 'white',
        padding: '8px 20px',
        borderRadius: '8px',
        textDecoration: 'none'
      }}>Факты</Link>
      <Link to="/users" style={{
        background: location.pathname === '/users' ? '#1abc9c' : '#3498db',
        color: 'white',
        padding: '8px 20px',
        borderRadius: '8px',
        textDecoration: 'none'
      }}>Пользователи</Link>
    </nav>
  );
};

export default Menu;