import React from 'react';

const OptionsDropdown = ({ options, selectedOption, onOptionChange }) => {
  return (
    <select value={selectedOption} onChange={onOptionChange}>
      {options.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

export default OptionsDropdown;