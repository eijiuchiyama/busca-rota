import React, { useState } from 'react';
import StringInput from '../components/StringInput';
import OptionsDropdown from '../components/OptionsDropdown';
import NavigationDropdown from '../components/NavigationDropdown';

function Home() {
  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');

  const options = ['Menor distância', 'Menor custo', 'Menor Tempo'];
  const [selectedOption, setSelectedOption] = useState(options[0]);
  
  function onSearch() {
    if (!departure || !destination) {
      alert('Preencha os campos de partida e destino!');
      return;
    }
    
    const searchParams = new URLSearchParams({
      departure: departure,
      destination: destination,
      option: selectedOption
    });

    window.location.href = `/search?${searchParams.toString()}`;
  }

  return (
    <div>
      <div style={{ position: 'absolute', top: 24, left: 24 }}>
        <NavigationDropdown />
      </div>
      <h1 style={{ textAlign: 'center', marginTop: '50px', fontSize: '96px', fontFamily: "Turret Road"}}>Busca-Rota</h1>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '32px' }}>
        <StringInput
          placeholder={"Aeroporto de Partida"}
          parameter={departure}
          onOptionChange={(e) => setDeparture(e.target.value)}
        />
        <StringInput
          placeholder={"Aeroporto de Destino"}
          parameter={destination}
          onOptionChange={(e) => setDestination(e.target.value)}
        />
        <OptionsDropdown
          options={options}
          selectedOption={selectedOption}
          onOptionChange={(e) => setSelectedOption(e.target.value)}
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
    </div>
  );
}

export default Home;