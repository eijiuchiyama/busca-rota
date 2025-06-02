import React from 'react';
import { useNavigate } from 'react-router-dom';

const BackToMenuButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/')}
      style={{
        position: 'absolute',
        top: 24,
        left: 24,
        background: '#fff',
        color: '#000',
        border: '1px solid #ccc',
        borderRadius: '50%',
        width: 80,
        height: 80,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 30,
        cursor: 'pointer',
        zIndex: 1100,
      }}
      aria-label="Voltar para o menu"
      title="Voltar para o menu"
    >
      {/* Ícone de seta para a esquerda */}
      <span style={{ display: 'inline-block', transform: 'translateX(-2px)' }}>←</span>
    </button>
  );
};

export default BackToMenuButton;