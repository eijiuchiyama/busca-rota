import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import GoBackButton from '../components/GoBackButton';

function AirlineDetail() {
  const { id } = useParams();
  const [airline, setAirline] = useState(null);

  // Simula busca dos dados detalhados
  useEffect(() => {
    const fakeData = [
      { id: '1', nome: 'LATAM Airlines' },
      { id: '2', nome: 'Gol Linhas Aéreas' },
      { id: '3', nome: 'Azul Linhas Aéreas' },
      { id: '4', nome: 'Avianca Brasil' },
    ];
    const found = fakeData.find(a => a.id === id);
    setAirline(found);
  }, [id]);

  if (!airline) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      <GoBackButton />
      <div style={{ maxWidth: 600, margin: '100px auto 0 auto', padding: 32, border: '1px solid #ccc', borderRadius: 16, background: '#f9f9f9' }}>
        <h1 style={{ fontSize: 48, marginBottom: 24 }}>{airline.nome}</h1>
      </div>
    </div>
  );
}

export default AirlineDetail;