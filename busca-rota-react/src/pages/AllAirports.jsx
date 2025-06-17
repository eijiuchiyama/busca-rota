import React, { useState, useEffect } from 'react';
import GoBackButton from '../components/GoBackButton';
import StringInput from '../components/StringInput';
import { useNavigate } from 'react-router-dom';

function AllAirports() {
  const [airport, setAirport] = useState('');
  const [airports, setAirports] = useState([]);
  const navigate = useNavigate();

  // Busca real da API de aeroportos
  useEffect(() => {
    fetch('http://localhost:8000/api/todos_aeroportos/')
      .then(res => res.json())
      .then(data => setAirports(data))
      .catch(err => {
        console.error(err);
        setAirports([]);
      });
  }, []);

  // Filtro opcional pelo nome digitado
  const filteredAirports = airports.filter(a => {
    const search = airport.toLowerCase();
    return (
      (a.nome && a.nome.toLowerCase().includes(search)) ||
      (a.iata && a.iata.toLowerCase().includes(search)) ||
      (a.icao && a.icao.toLowerCase().includes(search)) ||
      (a.cidade && a.cidade.toLowerCase().includes(search)) ||
      (a.pais && a.pais.toLowerCase().includes(search))
    );
  });

  return (
    <div>
      <GoBackButton />
      <h1 style={{ textAlign: 'center', marginTop: '50px', fontSize: '96px', fontFamily: "Turret Road"}}>Aeroportos</h1>
      <StringInput
        placeholder={"Filtro de nome dos Aeroportos"}
        parameter={airport}
        onOptionChange={(e) => setAirport(e.target.value)}
        style={{ margin: '20px auto', display: 'block', width: '600px' }}
      />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
        {filteredAirports.map(a => (
          <div
            key={a.iata}
            onClick={() => navigate(`/airport/${a.iata}`)}
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
            <p style={{ margin: '8px 0 0 0' }}>
              <strong>IATA:</strong> {a.iata} <br />
              <strong>ICAO:</strong> {a.icao} <br />
              <strong>Cidade:</strong> {a.cidade} <br />
              <strong>País:</strong> {a.pais}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllAirports;