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
  const [flights, setFlights] = useState([]);

  const options = ['Menor distância', 'Menor custo', 'Menor Tempo'];
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const [searchOption, setSearchOption] = useState(options[0]);

  useEffect(() => {
    async function fetchAirports() {
      try {
        const res = await fetch('http://localhost:8000/api/todos_aeroportos/');
        const data = await res.json();
        setAirportList(data);
      } catch (err) {
        setAirportList([]);
      }
    }
    fetchAirports();
  }, []);

  async function onSearch() {
    if (!departure || !destination) {
      alert('Preencha os campos de partida e destino!');
      return;
    }
    setSearchOption(selectedOption);

    let tipo_busca = '';
    if (selectedOption === 'Menor distância') tipo_busca = 'distancia';
    else if (selectedOption === 'Menor custo') tipo_busca = 'preco';
    else if (selectedOption === 'Menor Tempo') tipo_busca = 'tempo';

    const classe = 'economica';

    let url = `http://localhost:8000/api/pesquisa/?partida=${encodeURIComponent(departure)}&chegada=${encodeURIComponent(destination)}&tipo_busca=${tipo_busca}`;
    if (tipo_busca === 'preco') {
      url += `&classe=${classe}`;
    }

    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.erro || data.Erro) {
        alert(data.erro || data.Erro);
        setRouteAirports(null);
        setFlights([]);
        return;
      }
      if (data.rotas && data.rotas.length > 0) {
        setRouteAirports(
          airportList.filter(a => data.rotas[0].rota && data.rotas[0].rota.includes(a.iata))
        );
        setFlights(data.rotas[0].voos || []);
      } else {
        setRouteAirports(null);
        setFlights([]);
        alert('Nenhuma rota encontrada!');
      }
    } catch (error) {
      console.error('Erro ao buscar rotas:', error);
      alert('Erro ao buscar rotas. Tente novamente mais tarde.');
    }
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
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <MapWithAirports
          airports={routeAirports && routeAirports.length > 0 ? routeAirports : null}
          flights={flights}
          selectedOption={searchOption}
          style={{ height: 800, width: '100%', marginTop: 32, borderRadius: 16 }}
        />
      </div>
    </div>
  );
}

export default Home;