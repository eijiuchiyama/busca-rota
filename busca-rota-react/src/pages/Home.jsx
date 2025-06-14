import React, { useState, useEffect } from 'react';
import AirportAutocompleteInput from '../components/AirportAutocompleteInput';
import OptionsDropdown from '../components/OptionsDropdown';
import NavigationDropdown from '../components/NavigationDropdown';
import MapWithAirports from '../components/MapWithAirports';

function Home() {
  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');
  const [airportList, setAirportList] = useState([]);
  const [routeAirports, setRouteAirports] = useState(null);

  const options = ['Menor distância', 'Menor custo', 'Menor Tempo'];
  const [selectedOption, setSelectedOption] = useState(options[0]);

  useEffect(() => {
    async function fetchAirports() {
      // Simulação de resposta do API
      const fakeApiResponse = [
        { nome: 'Aeroporto Internacional de Guarulhos', iata: 'GRU', icao: 'SBGR', latitude: -23.4356, longitude: -46.4731 },
        { nome: 'Aeroporto Santos Dumont', iata: 'SDU', icao: 'SBRJ', latitude: -22.9105, longitude: -43.1631 },
        { nome: 'Aeroporto de Confins', iata: 'CNF', icao: 'SBCF', latitude: -19.6244, longitude: -43.9711 },
        { nome: 'Aeroporto de Congonhas', iata: 'CGH', icao: 'SBSP', latitude: -23.6261, longitude: -46.6566 },
      ];
      setTimeout(() => setAirportList(fakeApiResponse), 200);
    }
    fetchAirports();
  }, []);

  async function onSearch() {
    if (!departure || !destination) {
      alert('Preencha os campos de partida e destino!');
      return;
    }
    // Simula chamada à API para buscar rota
    // Exemplo: retorna uma rota entre os aeroportos selecionados (pode ser mais de dois)
    const fakeRoute = airportList.filter(a =>
      [departure, destination].includes(a.iata)
    );
    setTimeout(() => setRouteAirports(fakeRoute), 500);
  }

  return (
    <div>
      <div style={{ position: 'absolute', top: 24, left: 24 }}>
        <NavigationDropdown />
      </div>
      <h1 style={{ textAlign: 'center', marginTop: '50px', fontSize: '96px', fontFamily: "Turret Road"}}>Busca-Rota</h1>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '32px' }}>
        <AirportAutocompleteInput
          airportList={airportList}
          value={departure}
          onChange={setDeparture}
          placeholder="Aeroporto de Partida"
        />
        <AirportAutocompleteInput
          airportList={airportList}
          value={destination}
          onChange={setDestination}
          placeholder="Aeroporto de Destino"
        />
        <OptionsDropdown
          options={options}
          selectedOption={selectedOption}
          onOptionChange={e => setSelectedOption(e.target.value)}
        />
        <button
          onClick={onSearch}
          style={{
            borderRadius: '12px',
            padding: '12px 24px',
            fontSize: '1.2rem',
            border: '0px',
            outline: 'none',
            width: '260px',
            boxSizing: 'border-box',
            background: 'rgb(58, 226, 43)',
            appearance: 'none',
          }}> Pesquisar </button>
      </div>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <MapWithAirports airports={routeAirports && routeAirports.length > 0 ? routeAirports : null} />
      </div>
    </div>
  );
}

export default Home;