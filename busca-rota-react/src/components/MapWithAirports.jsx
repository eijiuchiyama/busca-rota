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
  const [showPopup, setShowPopup] = useState(false);
  const map = useMap();

  // Calcula o ponto médio para exibir o popup
  const midLat = (positions[0][0] + positions[1][0]) / 2;
  const midLng = (positions[0][1] + positions[1][1]) / 2;

  useEffect(() => {
    if (!showPopup) return;
    // Fecha popup se o mouse sair do mapa
    const close = () => setShowPopup(false);
    map.on('mouseout', close);
    return () => map.off('mouseout', close);
  }, [showPopup, map]);

  // Renderiza conteúdo do popup conforme opção selecionada
  function renderPopupContent() {
    return (
      <div>
        <div><strong>Horário de Partida:</strong> {info.horarioPartida}</div>
        <div><strong>Horário de Chegada:</strong> {info.horarioChegada}</div>
        <div><strong>Companhia Aérea:</strong> {info.companhiaAerea}</div>
        <div><strong>Modelo de Avião:</strong> {info.modeloAviao}</div>
        {selectedOption === 'Menor distância' && (
          <div><strong>Distância:</strong> {info.distancia || 'Desconhecida'} km</div>
        )}
        {selectedOption === 'Menor Tempo' && (
          <div><strong>Tempo de Voo:</strong> {info.tempoVoo || 'Desconhecido'}</div>
        )}
        {selectedOption === 'Menor custo' && (
          <>
            <div><strong>Preço Econômico:</strong> {info.precoEconomico ? `R$ ${info.precoEconomico}` : 'Desconhecido'}</div>
            <div><strong>Preço Executivo:</strong> {info.precoExecutivo ? `R$ ${info.precoExecutivo}` : 'Desconhecido'}</div>
            <div><strong>Preço Primeira Classe:</strong> {info.precoPrimeiraClasse ? `R$ ${info.precoPrimeiraClasse}` : 'Desconhecido'}</div>
          </>
        )}
      </div>
    );
  }

  return (
    <>
      <Polyline
        positions={positions}
        color="blue"
        eventHandlers={{
          mouseover: () => setShowPopup(true),
          mouseout: () => setShowPopup(false),
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
  // Se não há aeroportos, mostra o mapa mundi centralizado
  const center = airports && airports.length
    ? [airports[0].latitude, airports[0].longitude]
    : [0, 0];

  // Cria as linhas entre aeroportos consecutivos
  const lines = [];
  if (airports && airports.length > 1) {
    for (let i = 0; i < airports.length - 1; i++) {
      lines.push({
        positions: [
          [airports[i].latitude, airports[i].longitude],
          [airports[i + 1].latitude, airports[i + 1].longitude]
        ],
        info: flights && flights[i] ? flights[i] : {}
      });
    }
  }

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