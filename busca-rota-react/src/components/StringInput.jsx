import React, { useState } from 'react';

const StringInput = ({ placeholder, parameter, onOptionChange, style }) => {
  return (
    <div>
      <input
        type="text"
        placeholder={placeholder}
        value={parameter}
        onChange={onOptionChange}
        style={{
          borderRadius: '24px', 
          padding: '12px 24px',
          fontSize: '1.2rem',
          border: '1px solid #ccc',
          outline: 'none',
          width: '260px',
          boxSizing: 'border-box',
          ...style,
        }}
      />
    </div>
  );
};

export default StringInput;