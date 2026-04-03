import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import PostsPage from './pages/PostsPage';
import FactsPage from './pages/FactsPage';
import UsersPage from './pages/UsersPage';
import './index.css';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/posts" replace />} />
          <Route path="posts" element={<PostsPage />} />
          <Route path="facts" element={<FactsPage />} />
          <Route path="users" element={<UsersPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;