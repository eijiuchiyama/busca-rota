import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import GoBackButton from '../components/GoBackButton';
import CommentsBox from '../components/CommentsBox';
import MapWithAirports from '../components/MapWithAirports';

function AirportDetail() {
  const { iata } = useParams();
  const [airport, setAirport] = useState(null);

  // Busca dos dados detalhados do aeroporto
  useEffect(() => {
    fetch(`http://localhost:8000/api/aeroporto/?iata=${iata}`)
      .then(res => res.json())
      .then(data => {
        if (data.aeroporto && data.aeroporto.length > 0) {
          setAirport(data.aeroporto[0]);
        } else {
          setAirport(null);
        }
      })
      .catch(() => setAirport(null));
  }, [iata]);

  if (!airport) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      <GoBackButton />
      <div style={{ maxWidth: 1000, margin: '100px auto 0 auto', padding: 32, border: '1px solid #ccc', borderRadius: 16, background: '#f9f9f9' }}>
        <h1 style={{ fontSize: 48, marginBottom: 24 }}>{airport.nome}</h1>
        <div style={{ display: 'flex', gap: 32 }}>
          {/* Mapa à esquerda */}
          <div style={{ flex: 1, minWidth: 300 }}>
            <MapWithAirports airports={[airport]} />
          </div>
          {/* Informações à direita */}
          <div style={{ flex: 1, minWidth: 300, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <p><strong>Código IATA:</strong> {airport.iata}</p>
            <p><strong>Código ICAO:</strong> {airport.icao}</p>
            <p><strong>Cidade:</strong> {airport.cidade}</p>
            <p><strong>País:</strong> {airport.pais}</p>
            <p><strong>Latitude:</strong> {airport.latitude}</p>
            <p><strong>Longitude:</strong> {airport.longitude}</p>
          </div>
        </div>
      </div>
      <CommentsBox iata={airport.iata} />
    </div>
  );
}

export default AirportDetail;