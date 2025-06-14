import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect } from 'react';

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
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 8 });
  }, [airports, map]);

  return null;
}

function MapWithAirports({ airports }) {
  // Se não há aeroportos, mostra o mapa mundi centralizado
  const center = airports && airports.length
    ? [airports[0].latitude, airports[0].longitude]
    : [0, 0];

  // Cria as linhas entre aeroportos consecutivos
  const lines = [];
  if (airports && airports.length > 1) {
    for (let i = 0; i < airports.length - 1; i++) {
      lines.push([
        [airports[i].latitude, airports[i].longitude],
        [airports[i + 1].latitude, airports[i + 1].longitude]
      ]);
    }
  }

  return (
    <MapContainer
      center={center}
      zoom={airports && airports.length ? 4 : 2}
      style={{ height: 400, width: '100%', marginTop: 32, borderRadius: 16 }}
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
            <strong>{a.nome}</strong><br />
            IATA: {a.iata}<br />
            ICAO: {a.icao}
          </Popup>
        </Marker>
      ))}
      {lines.map((line, idx) => (
        <Polyline key={idx} positions={line} color="blue" />
      ))}
    </MapContainer>
  );
}

export default MapWithAirports;