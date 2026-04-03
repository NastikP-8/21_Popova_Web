import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { RootState } from '../store';
import { fetchOneUser, fetchFiveUsers, updateUser, deleteUser, clearUsersResults } from '../store';
import { RandomUser } from '../types';
import Card from '../components/Card';

const UsersPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { oneUser, fiveUsers, loading, updateResult, deleteResult } = useAppSelector((state: RootState) => state.users);
  
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [deleteUserId, setDeleteUserId] = useState('');

  useEffect(() => {
    if (updateResult || deleteResult) {
      setTimeout(() => dispatch(clearUsersResults()), 3000);
    }
  }, [updateResult, deleteResult, dispatch]);

  const handleUpdateUser = () => {
    if (!userId) return;
    const updateData: any = {};
    if (userName) updateData.name = userName;
    if (userEmail) updateData.email = userEmail;
    if (Object.keys(updateData).length === 0) return;
    dispatch(updateUser({ id: parseInt(userId), data: updateData }));
    setUserId('');
    setUserName('');
    setUserEmail('');
  };

  const handleDeleteUser = () => {
    if (!deleteUserId) return;
    dispatch(deleteUser(parseInt(deleteUserId)));
    setDeleteUserId('');
  };

  const buttonStyle = {
    background: '#3498db',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    margin: '10px 10px 10px 0'
  };

  const inputStyle = {
    display: 'block',
    width: '40%',
    padding: '10px',
    margin: '8px 0 12px 0',
    border: '1px solid #ddd',
    borderRadius: '8px'
  };

  return (
    <div>
      <h2 style={{ color: '#2c3e50', borderBottom: '2px solid #e9ecef', paddingBottom: '10px' }}>Пользователи</h2>
      
      <h3>Случайные пользователи</h3>
      <button onClick={() => dispatch(fetchOneUser())} style={buttonStyle}>Один пользователь</button>
      <button onClick={() => dispatch(fetchFiveUsers())} style={buttonStyle}>Пять пользователей</button>
      
      {loading && <div className="loading">Загрузка...</div>}
      {updateResult && <div className="success">{updateResult}</div>}
      {deleteResult && <div className="success">{deleteResult}</div>}
      
      {oneUser && (
        <Card>
          <b>{oneUser.name.first} {oneUser.name.last}</b><br />
          📧 {oneUser.email}<br />
          📍 {oneUser.location.city}<br />
          📞 {oneUser.phone || 'не указан'}
        </Card>
      )}
      
      {fiveUsers.map((user: RandomUser, idx: number) => (
        <Card key={idx}>
          <b>{user.name.first} {user.name.last}</b><br />
          📧 {user.email}
        </Card>
      ))}
      
      <h3>Обновить информацию о пользователе</h3>
      <input placeholder="ID пользователя" value={userId} onChange={e => setUserId(e.target.value)} style={inputStyle} />
      <input placeholder="Новое имя" value={userName} onChange={e => setUserName(e.target.value)} style={inputStyle} />
      <input placeholder="Новый email" value={userEmail} onChange={e => setUserEmail(e.target.value)} style={inputStyle} />
      <button onClick={handleUpdateUser} style={buttonStyle}>Обновить</button>
      
      <h3>Удалить пользователя</h3>
      <input placeholder="ID пользователя" value={deleteUserId} onChange={e => setDeleteUserId(e.target.value)} style={inputStyle} />
      <button onClick={handleDeleteUser} style={buttonStyle}>Удалить</button>
    </div>
  );
};

export default UsersPage;