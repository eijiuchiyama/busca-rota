import React, { useState } from 'react';
import StringInput from './StringInput';

function AirportAutocompleteInput({ airportList, value, onChange, placeholder }) {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  function handleInputChange(e) {
    const val = e.target.value;
    onChange(val);

    if (val.length > 0) {
      const filtered = airportList.filter(a =>
        a.nome.toLowerCase().includes(val.toLowerCase()) ||
        a.iata.toLowerCase().includes(val.toLowerCase()) ||
        a.icao.toLowerCase().includes(val.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }

  function handleSelect(aeroporto) {
    onChange(aeroporto.iata);
    setShowSuggestions(false);
  }

  return (
    <div style={{ position: 'relative' }}>
      <StringInput
        placeholder={placeholder}
        parameter={value}
        onOptionChange={handleInputChange}
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul style={{
          position: 'absolute',
          top: '48px',
          left: 0,
          right: 0,
          background: '#fff',
          border: '1px solid #ccc',
          borderRadius: '0 0 8px 8px',
          zIndex: 10000,
          maxHeight: 200,
          overflowY: 'auto',
          listStyle: 'none',
          margin: 0,
          padding: 0
        }}>
          {suggestions.map(a => (
            <li
              key={a.iata}
              style={{ padding: 12, cursor: 'pointer' }}
              onMouseDown={() => handleSelect(a)}
            >
              {a.nome} ({a.iata} / {a.icao})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AirportAutocompleteInput;