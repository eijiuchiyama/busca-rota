import React, { useState, useEffect } from 'react';
import GoBackButton from '../components/GoBackButton';
import StringInput from '../components/StringInput';
import { useNavigate } from 'react-router-dom';

function AllAirlines() {
  const [airline, setAirline] = useState('');
  const [airlines, setAirlines] = useState([]);
  const navigate = useNavigate();

  // Simula retorno da API
  useEffect(() => {
    const fakeData = [
      { id: '1', nome: 'LATAM Airlines' },
      { id: '2', nome: 'Gol Linhas Aéreas' },
      { id: '3', nome: 'Azul Linhas Aéreas' },
      { id: '4', nome: 'Avianca Brasil' },
    ];
    setTimeout(() => setAirlines(fakeData), 10);
  }, []);

  const filteredAirlines = airlines.filter(a =>
    a.nome.toLowerCase().includes(airline.toLowerCase())
  );

  return (
    <div>
      <GoBackButton />
      <h1 style={{ textAlign: 'center', marginTop: '50px', fontSize: '96px', fontFamily: "Turret Road"}}>Companhias Aéreas</h1>
      <StringInput
        placeholder={"Filtro de nome das Companhias Aéreas"}
        parameter={airline}
        onOptionChange={(e) => setAirline(e.target.value)}
        style={{ margin: '20px auto', display: 'block', width: '600px' }}
      />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
        {filteredAirlines.map(a => (
          <div
            key={a.id}
            onClick={() => navigate(`/airline/${a.id}`)}
            style={{
              cursor: 'pointer',
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '24px',
              minWidth: '220px',
              background: '#f9f9f9',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}
          >
            <h2 style={{ margin: 0 }}>{a.nome}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllAirlines;