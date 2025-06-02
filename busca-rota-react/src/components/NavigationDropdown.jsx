import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const NavigationDropdown = () => {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="navigation-dropdown"
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button style={{ padding: '8px 16px', cursor: 'pointer' }}>Menu</button>
      {open && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            background: 'white',
            border: '1px solid #ccc',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            zIndex: 1000,
            minWidth: '160px'
          }}
        >
          <Link to="/login" style={{ display: 'block', padding: '8px', textDecoration: 'none', color: '#333' }}>Login / Sign In</Link>
          <Link to="/all-airports" style={{ display: 'block', padding: '8px', textDecoration: 'none', color: '#333' }}>All Airports</Link>
          <Link to="/all-airlines" style={{ display: 'block', padding: '8px', textDecoration: 'none', color: '#333' }}>All Airlines</Link>
        </div>
      )}
    </div>
  );
};

export default NavigationDropdown;