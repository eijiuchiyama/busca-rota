import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import GoBackButton from '../components/GoBackButton';
import CommentsBox from '../components/CommentsBox';

function AirportDetail() {
  const { iata } = useParams();
  const [airport, setAirport] = useState(null);

  // Simula busca dos dados detalhados
  useEffect(() => {
    const fakeData = [
      {
        nome: 'Aeroporto Internacional de Guarulhos',
        iata: 'GRU',
        icao: 'SBGR',
        cidade: 'Guarulhos',
        pais: 'Brasil',
        latitude: -23.4356,
        longitude: -46.4731
      },
      {
        nome: 'Aeroporto Santos Dumont',
        iata: 'SDU',
        icao: 'SBRJ',
        cidade: 'Rio de Janeiro',
        pais: 'Brasil',
        latitude: -22.9105,
        longitude: -43.1631
      },
      {
        nome: 'Aeroporto de Confins',
        iata: 'CNF',
        icao: 'SBCF',
        cidade: 'Confins',
        pais: 'Brasil',
        latitude: -19.6244,
        longitude: -43.9711
      },
      {
        nome: 'Aeroporto de Congonhas',
        iata: 'CGH',
        icao: 'SBSP',
        cidade: 'São Paulo',
        pais: 'Brasil',
        latitude: -23.6261,
        longitude: -46.6566
      },
    ];
    const found = fakeData.find(a => a.iata === iata);
    setAirport(found);
  }, [iata]);

  if (!airport) {
    return <div>Carregando...</div>;
  }

  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${airport.longitude-0.05}%2C${airport.latitude-0.05}%2C${airport.longitude+0.05}%2C${airport.latitude+0.05}&layer=mapnik&marker=${airport.latitude}%2C${airport.longitude}`;

  return (
    <div>
      <GoBackButton />
      <div style={{ maxWidth: 1000, margin: '100px auto 0 auto', padding: 32, border: '1px solid #ccc', borderRadius: 16, background: '#f9f9f9' }}>
        <h1 style={{ fontSize: 48, marginBottom: 24 }}>{airport.nome}</h1>
        <div style={{ display: 'flex', gap: 32 }}>
          {/* Mapa à esquerda */}
          <div style={{ flex: 1, minWidth: 300 }}>
            <iframe
              title="Mapa do aeroporto"
              width="100%"
              height="300"
              frameBorder="0"
              src={mapUrl}
              style={{ borderRadius: 12, border: '1px solid #ccc' }}
              allowFullScreen
            ></iframe>
            <div style={{ fontSize: 12, textAlign: 'center', marginTop: 8 }}>
              <a
                href={`https://www.openstreetmap.org/?mlat=${airport.latitude}&mlon=${airport.longitude}#map=14/${airport.latitude}/${airport.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Ver no OpenStreetMap
              </a>
            </div>
          </div>
          {/* Informações à direita */}
          <div style={{ flex: 1, minWidth: 300 }}>
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