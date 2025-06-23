import React from 'react';
import { useNavigate } from 'react-router-dom';

const GoBackButton = () => {
  const navigate = useNavigate();

  function handleGoBack() {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/', { replace: true }); // Vai para o menu se não houver histórico suficiente
    }
  }

  return (
    <button
      onClick={handleGoBack}
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
      aria-label="Voltar para a página anterior"
      title="Voltar para a página anterior"
    >
      <span style={{ display: 'inline-block', transform: 'translateX(-2px)' }}>←</span>
    </button>
  );
};

export default GoBackButton;