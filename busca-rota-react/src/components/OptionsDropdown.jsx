import React from 'react';

const OptionsDropdown = ({ options, selectedOption, onOptionChange, style }) => {
  return (
    <select
      value={selectedOption}
      onChange={onOptionChange}
      style={{
        borderRadius: '12px',
        padding: '12px 24px',
        fontSize: '1.2rem',
        border: '1px solid #ccc',
        outline: 'none',
        width: '260px',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {options.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

export default OptionsDropdown;