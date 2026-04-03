import React from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { RootState } from '../store';
import { fetchOneFact, fetchThreeFacts } from '../store';
import { CatFact } from '../types';
import Card from '../components/Card';

const FactsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { oneFact, threeFacts, loading } = useAppSelector((state: RootState) => state.facts);

  const buttonStyle = {
    background: '#3498db',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    margin: '10px 10px 10px 0'
  };

  return (
    <div>
      <h2 style={{ color: '#2c3e50', borderBottom: '2px solid #e9ecef', paddingBottom: '10px' }}>Факты о котах</h2>
      
      <button onClick={() => dispatch(fetchOneFact())} style={buttonStyle}>Один факт</button>
      <button onClick={() => dispatch(fetchThreeFacts())} style={buttonStyle}>Три факта</button>
      
      {loading && <div className="loading">Загрузка...</div>}
      {oneFact && <Card>🐱 {oneFact.fact}</Card>}
      {threeFacts.map((fact: CatFact, idx: number) => (
        <Card key={idx}>{idx + 1}. 🐱 {fact.fact}</Card>
      ))}
    </div>
  );
};

export default FactsPage;