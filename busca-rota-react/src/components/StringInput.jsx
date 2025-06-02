import React, { useState } from 'react';

const StringInput = ({ placeholder, parameter, onOptionChange }) => {
  return (
    <div>
      <input
        type="text"
        placeholder={placeholder}
        value={parameter}
        onChange={onOptionChange}
      />
    </div>
  );
};

export default StringInput;