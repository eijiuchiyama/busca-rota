import React, { useState } from 'react';
import BackToMenuButton from '../components/BackToMenuButton';
import StringInput from '../components/StringInput';

function AllAirlines() {
  const [airline, setAirline] = useState('');

  return (
    <div>
      <BackToMenuButton />
      <h1 style={{ textAlign: 'center', marginTop: '50px', fontSize: '96px', fontFamily: "Turret Road"}}>Companhias Aéreas</h1>
      <StringInput
          placeholder={"Filtro de nome das Companhias Aéreas"}
          parameter={airline}
          onOptionChange={(e) => setAirline(e.target.value)}
          style={{ margin: '20px auto', display: 'block', width: '600px' }}
      />
    </div>
  );
}

export default AllAirlines;