import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AirportAutocompleteInput from '../components/AirportAutocompleteInput';
import OptionsDropdown from '../components/OptionsDropdown';
import NavigationDropdown from '../components/NavigationDropdown';
import MapWithAirports from '../components/MapWithAirports';

function Home() {
  const location = useLocation(); // Para acessar o estado passado pela navegação

  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');
  const [airportList, setAirportList] = useState([]);
  const [routeAirports, setRouteAirports] = useState(null);
  const [flights, setFlights] = useState([]);
  const [total, setTotal] = useState(null);

  const options = [
    'Menor Distância',
    'Menor Tempo',
    'Menor Custo Econômico',
    'Menor Custo Executivo',
    'Menor Custo Primeira Classe',
  ];
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

  // Preenche campos ao voltar do histórico do Profile
  useEffect(() => {
    if (location.state?.fromHistory && location.state.rotaSalva) {
      const rota = location.state.rotaSalva;
      setDeparture(rota.aeroporto_partida || '');
      setDestination(rota.aeroporto_chegada || '');
      setTotal(rota.total ?? null);

      // Define a opção correta de busca
      let opt = options[0];
      if (rota.tipo_busca === 'distancia') opt = 'Menor Distância';
      else if (rota.tipo_busca === 'tempo') opt = 'Menor Tempo';
      else if (rota.tipo_busca === 'preco') {
        const classe = rota.trajetos[0]?.classe;
        if (classe === 'economica') opt = 'Menor Custo Econômico';
        else if (classe === 'executiva') opt = 'Menor Custo Executivo';
        else if (classe === 'primeira') opt = 'Menor Custo Primeira Classe';
        else opt = 'Menor Custo Econômico';
      }
      setSelectedOption(opt);
      setSearchOption(opt);

      async function montarVoosComNome() {
        if (rota.trajetos && rota.trajetos.length > 0 && airportList.length > 0) {
          const rotaIatas = [rota.trajetos[0].origem, ...rota.trajetos.map(t => t.destino)];
          setRouteAirports(
            airportList.filter(a => rotaIatas.includes(a.iata))
          );
          const mappedFlights = await Promise.all(
            rota.trajetos.map(async v => {
              let companhiaNome = v.companhia;
              try {
                const res = await fetch(`http://localhost:8000/api/companhia/?id=${v.companhia}`);
                const data = await res.json();
                if (data.companhia && data.companhia.length > 0 && data.companhia[0].nome) {
                  companhiaNome = data.companhia[0].nome;
                }
              } catch {}
              return {
                horarioPartida: formatDateTime(v.partida),
                horarioChegada: formatDateTime(v.chegada),
                companhiaAerea: companhiaNome,
                companhiaID: v.companhia,
                distancia: v.distancia,
                tempoVoo: formatDateTime(v.tempo),
                classe: v.classe,
                preco: v.preco,
              };
            })
          );
          setFlights(mappedFlights);
        }
      }
      montarVoosComNome();
      return;
    }
  }, [location.state, airportList]);

  function formatDateTime(dtString) {
    if (!dtString) return '';
    // Se for formato ISO
    if (dtString.includes('T')) {
      const dt = new Date(dtString);
      const pad = n => n.toString().padStart(2, '0');
      return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())} ${pad(dt.getHours())}:${pad(dt.getMinutes())}:${pad(dt.getSeconds())}`;
    }
    // Se for HH:MM:SS ou H:MM:SS.ssssss
    const parts = dtString.split(':');
    if (parts.length >= 3) {
      const [h, m, s] = parts;
      const sInt = s.split('.')[0];
      const pad = n => n.toString().padStart(2, '0');
      return `${pad(h)}:${pad(m)}:${pad(sInt)}`;
    }
    // Caso não reconheça o formato, retorna original
    return dtString;
  }

  async function onSearch() {
    if (!departure || !destination) {
      alert('Preencha os campos de partida e destino!');
      return;
    }
    setSearchOption(selectedOption);

    let tipo_busca = '';
    let classe = '';
    if (selectedOption === 'Menor Distância') tipo_busca = 'distancia';
    else if (selectedOption === 'Menor Tempo') tipo_busca = 'tempo';
    else if (selectedOption.startsWith('Menor Custo')) {
      tipo_busca = 'preco';
      if (selectedOption === 'Menor Custo Econômico') classe = 'economica';
      else if (selectedOption === 'Menor Custo Executivo') classe = 'executiva';
      else if (selectedOption === 'Menor Custo Primeira Classe') classe = 'primeira';
    }

    const username = localStorage.getItem('username');
    let url = `http://localhost:8000/api/pesquisa/?partida=${encodeURIComponent(departure)}&chegada=${encodeURIComponent(destination)}&tipo_busca=${tipo_busca}`;
    if (tipo_busca === 'preco') {
      url += `&classe=${classe}`;
    }
    if (username) {
      url += `&username=${encodeURIComponent(username)}`;
    }
    console.log('url:', url);

    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.erro || data.Erro) {
        alert(data.erro || data.Erro);
        setRouteAirports(null);
        setFlights([]);
        return;
      }

      async function getCompanhiaNome(id) {
        try {
          const res = await fetch(`http://localhost:8000/api/companhia/?id=${id}`);
          const data = await res.json();
          return (data.companhia && data.companhia.length > 0 && data.companhia[0].nome) ? data.companhia[0].nome : id;
        } catch {
          return id;
        }
      }

      setTotal(data.total ?? null);

      if (Array.isArray(data.trajetos) && data.trajetos.length > 0) {
        const rotaIatas = [data.trajetos[0].origem, ...data.trajetos.map(t => t.destino)];
        setRouteAirports(
          airportList.filter(a => rotaIatas.includes(a.iata))
        );
        const mappedFlights = await Promise.all(
          data.trajetos.map(async v => {
            const companhiaNome = await getCompanhiaNome(v.companhia);
            return {
              horarioPartida: formatDateTime(v.partida),
              horarioChegada: formatDateTime(v.chegada),
              companhiaAerea: companhiaNome,
              companhiaID: v.companhia,
              distancia: v.distancia,
              tempoVoo: formatDateTime(v.tempo),
              classe: v.classe,
              preco: v.preco,
            };
          })
        );
        setFlights(mappedFlights);
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

  function formatSecondsToDuration(totalSeconds) {
    if (!totalSeconds || isNaN(totalSeconds)) return '0s';
    totalSeconds = Math.floor(totalSeconds);

    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    let result = [];
    if (days > 0) result.push(`${days} dia${days > 1 ? 's' : ''}`);
    if (hours > 0) result.push(`${hours}h`);
    if (minutes > 0) result.push(`${minutes}min`);
    if (seconds > 0 || result.length === 0) result.push(`${seconds}s`);
    return result.join(' ');
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
          style={{ minWidth: 320, maxWidth: 340 }}
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
        {total !== null && (
          <div style={{ textAlign: 'center', marginTop: 32, fontSize: 28, fontWeight: 600 }}>
            {searchOption === 'Menor Distância' && <>Total de distância: {total} km</>}
            {searchOption === 'Menor Tempo' && <>Total de tempo: {formatSecondsToDuration(total)}</>}
            {searchOption === 'Menor Custo Econômico' && <>Total de custo econômico: R$ {total}</>}
            {searchOption === 'Menor Custo Executivo' && <>Total de custo executivo: R$ {total}</>}
            {searchOption === 'Menor Custo Primeira Classe' && <>Total de custo primeira classe: R$ {total}</>}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;