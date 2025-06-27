import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// Ícone padrão do Leaflet
const defaultIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Componente auxiliar para ajustar o zoom automaticamente
function FitBounds({ airports }) {
  const map = useMap();

  useEffect(() => {
    if (!airports || airports.length === 0) {
      map.setView([0, 0], 2);
      return;
    }
    if (airports.length === 1) {
      map.setView([airports[0].latitude, airports[0].longitude], 7);
      return;
    }
    const bounds = L.latLngBounds(
      airports.map(a => [a.latitude, a.longitude])
    );
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 10 });
  }, [airports, map]);

  return null;
}

// Componente para Polyline com Popup customizado
function PolylineWithPopup({ positions, info, selectedOption }) {
  const [hovered, setHovered] = useState(false);
  const [fixed, setFixed] = useState(false);
  const map = useMap();

  const midLat = (positions[0][0] + positions[1][0]) / 2;
  const midLng = (positions[0][1] + positions[1][1]) / 2;

  // Fecha popup fixo ao clicar fora do mapa
  useEffect(() => {
    if (!fixed) return;
    function handleMapClick() {
      setFixed(false);
    }
    map.on('click', handleMapClick);
    return () => map.off('click', handleMapClick);
  }, [fixed, map]);

  // Renderiza conteúdo do popup conforme opção selecionada
  function renderPopupContent() {
    return (
      <div>
        <div><strong>Horário de Partida:</strong> {info.horarioPartida || 'Desconhecido'}</div>
        <div><strong>Horário de Chegada:</strong> {info.horarioChegada || 'Desconhecido'}</div>
        <div>
          <strong>Companhia Aérea:</strong>{' '}
          {info.companhiaID ? (
            <Link
              to={`/airline/${info.companhiaID}`}
              style={{ color: '#1976d2', textDecoration: 'underline', cursor: 'pointer' }}
              target="_blank"
              rel="noopener noreferrer"
            >
              {info.companhiaAerea || info.companhiaID}
            </Link>
          ) : (
            info.companhiaAerea || info.companhiaID || 'Desconhecida'
          )}
        </div>
        {selectedOption === 'Menor Distância' && (
          <div><strong>Distância:</strong> {info.distancia || 'Desconhecida'} km</div>
        )}
        {selectedOption === 'Menor Tempo' && (
          <div><strong>Tempo de Voo:</strong> {info.tempoVoo || 'Desconhecido'}</div>
        )}
        {selectedOption.startsWith('Menor Custo') && (
          <>
            {info.classe === 'economica' && (
              <div><strong>Preço Econômico:</strong> {info.preco ? `R$ ${info.preco}` : 'Desconhecido'}</div>
            )}
            {info.classe === 'executiva' && (
              <div><strong>Preço Executivo:</strong> {info.preco ? `R$ ${info.preco}` : 'Desconhecido'}</div>
            )}
            {info.classe === 'primeira' && (
              <div><strong>Preço Primeira Classe:</strong> {info.preco ? `R$ ${info.preco}` : 'Desconhecido'}</div>
            )}
          </>
        )}
      </div>
    );
  }

  const showPopup = hovered || fixed;

  return (
    <>
      <Polyline
        positions={positions}
        color="blue"
        eventHandlers={{
          mouseover: () => { if (!fixed) setHovered(true); },
          mouseout: () => { if (!fixed) setHovered(false); },
          click: () => setFixed(f => !f),
        }}
      />
      {showPopup && (
        <Popup position={[midLat, midLng]} closeButton={false} autoPan={false}>
          {renderPopupContent()}
        </Popup>
      )}
    </>
  );
}

function MapWithAirports({ airports, flights, selectedOption, style }) {
  // Indexa aeroportos por IATA para busca rápida
  const airportByIata = {};
  if (airports) {
    for (const a of airports) {
      airportByIata[a.iata] = a;
    }
  }

  // Cria as linhas a partir dos voos/trajetos
  const lines = [];
  if (flights && flights.length > 0) {
    for (let i = 0; i < flights.length; i++) {
      const trajeto = flights[i];
      const origemAero = airportByIata[trajeto.origem];
      const destinoAero = airportByIata[trajeto.destino];
      if (origemAero && destinoAero) {
        lines.push({
          positions: [
            [origemAero.latitude, origemAero.longitude],
            [destinoAero.latitude, destinoAero.longitude]
          ],
          info: trajeto
        });
      }
    }
  }

  // Se não há aeroportos, mostra o mapa mundi centralizado
  const center = airports && airports.length
    ? [airports[0].latitude, airports[0].longitude]
    : [0, 0];

  return (
    <MapContainer
      center={center}
      zoom={airports && airports.length ? 4 : 2}
      style={style || { height: 400, width: '100%', marginTop: 32, borderRadius: 16 }}
      scrollWheelZoom={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds airports={airports} />
      {airports && airports.map(a => (
        <Marker
          key={a.iata}
          position={[a.latitude, a.longitude]}
          icon={defaultIcon}
        >
          <Popup>
            <strong>
              <Link to={`/airport/${a.iata}`} style={{ textDecoration: 'none', color: '#1976d2' }}>
                {a.nome}
              </Link>
            </strong> <br />
            IATA: {a.iata}<br />
            ICAO: {a.icao}
          </Popup>
        </Marker>
      ))}
      {lines.map((line, idx) => (
        <PolylineWithPopup
          key={idx}
          positions={line.positions}
          info={line.info}
          selectedOption={selectedOption}
        />
      ))}
    </MapContainer>
  );
}

export default MapWithAirports;