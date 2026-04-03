import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { RootState } from '../store';
import { fetchPosts, createPost, updatePost, deletePost, clearPostsResults } from '../store';
import { Post } from '../types';
import Card from '../components/Card';

const PostsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { posts, loading, createResult, updateResult, deleteResult } = useAppSelector((state: RootState) => state.posts);
  
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');
  const [updateId, setUpdateId] = useState('');
  const [updateTitle, setUpdateTitle] = useState('');
  const [updateBody, setUpdateBody] = useState('');
  const [deleteId, setDeleteId] = useState('');

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  useEffect(() => {
    if (createResult || updateResult || deleteResult) {
      setTimeout(() => dispatch(clearPostsResults()), 3000);
    }
  }, [createResult, updateResult, deleteResult, dispatch]);

  const btn = { background: '#3498db', color: 'white', padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', margin: '5px' };
  const inp = { display: 'block', width: '40%', padding: '10px', margin: '8px 0 12px 0', border: '1px solid #ddd', borderRadius: '8px' };
  const textarea = { ...inp, minHeight: '80px' };

  return (
    <div>
      <h2 style={{ color: '#2c3e50', borderBottom: '2px solid #e9ecef', paddingBottom: '10px' }}>Управление записями</h2>
      
      <button onClick={() => dispatch(fetchPosts())} style={btn}>Загрузить записи</button>
      
      {loading && <div className="loading">Загрузка...</div>}
      {createResult && <div className="success">{createResult}</div>}
      {updateResult && <div className="success">{updateResult}</div>}
      {deleteResult && <div className="success">{deleteResult}</div>}
      
      {posts.map((post: Post) => (
        <Card key={post.id}>
          <b>№{post.id}</b><br />
          {post.title}<br />
          {post.body}
        </Card>
      ))}
      
      <h3>Добавить</h3>
      <input placeholder="Заголовок" value={newTitle} onChange={e => setNewTitle(e.target.value)} style={inp} />
      <textarea placeholder="Текст" value={newBody} onChange={e => setNewBody(e.target.value)} style={textarea} />
      <button onClick={() => { if (newTitle && newBody) { dispatch(createPost({ title: newTitle, body: newBody })); setNewTitle(''); setNewBody(''); } }} style={btn}>Создать</button>
      
      <h3>Изменить</h3>
      <input placeholder="Номер" value={updateId} onChange={e => setUpdateId(e.target.value)} style={inp} />
      <input placeholder="Новый заголовок" value={updateTitle} onChange={e => setUpdateTitle(e.target.value)} style={inp} />
      <textarea placeholder="Новый текст" value={updateBody} onChange={e => setUpdateBody(e.target.value)} style={textarea} />
      <button onClick={() => { if (updateId) { dispatch(updatePost({ id: parseInt(updateId), title: updateTitle, body: updateBody })); setUpdateId(''); setUpdateTitle(''); setUpdateBody(''); } }} style={btn}>Изменить</button>
      
      <h3>Удалить</h3>
      <input placeholder="Номер" value={deleteId} onChange={e => setDeleteId(e.target.value)} style={inp} />
      <button onClick={() => { if (deleteId) { dispatch(deletePost(parseInt(deleteId))); setDeleteId(''); } }} style={btn}>Удалить</button>
    </div>
  );
};

export default PostsPage;