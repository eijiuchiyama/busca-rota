import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const NavigationDropdown = () => {
  const [open, setOpen] = useState(false);
  const username = localStorage.getItem('username');

  return (
    <div
      className="navigation-dropdown"
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button style={{ padding: '8px 16px', cursor: 'pointer', width: '200px' }}>Menu</button>
      {open && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            background: 'rgb(223, 223, 223)',
            border: '1px solid #ccc',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            zIndex: 1000,
            width: '200px'
          }}
        >
          {!username ? (
            <Link to="/login" style={{ display: 'block', padding: '8px', textDecoration: 'none', color: '#333' }}>
              Log In/Sign In
            </Link>
          ) : (
            <Link to="/user-profile" style={{ display: 'block', padding: '8px', textDecoration: 'none', color: '#333' }}>
              Profile
            </Link>
          )}
          <Link to="/all-airports" style={{ display: 'block', padding: '8px', textDecoration: 'none', color: '#333' }}>Aeroportos</Link>
          <Link to="/all-airlines" style={{ display: 'block', padding: '8px', textDecoration: 'none', color: '#333' }}>Companhias Aéreas</Link>
        </div>
      )}
    </div>
  );
};

export default NavigationDropdown;