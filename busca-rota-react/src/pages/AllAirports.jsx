import React, { useState } from 'react';
import BackToMenuButton from '../components/BackToMenuButton';
import StringInput from '../components/StringInput';

function AllAirports() {
  const [airport, setAirport] = useState('');

  return (
    <div>
      <BackToMenuButton />
      <h1 style={{ textAlign: 'center', marginTop: '50px', fontSize: '96px', fontFamily: "Turret Road"}}>Aeroportos</h1>
      <StringInput
          placeholder={"Filtro de nome dos Aeroportos"}
          parameter={airport}
          onOptionChange={(e) => setAirport(e.target.value)}
          style={{ margin: '20px auto', display: 'block', width: '600px' }}
      />
    </div>
  );
}

export default AllAirports;