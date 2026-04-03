import React from 'react';

interface CardProps {
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children }) => {
  return (
    <div style={{
      background: '#f8f9fa',
      padding: '12px 15px',
      margin: '12px 0',
      borderLeft: '3px solid #3498db',
      borderRadius: '8px'
    }}>
      {children}
    </div>
  );
};

export default Card;