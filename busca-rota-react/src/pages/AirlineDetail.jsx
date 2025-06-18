import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import GoBackButton from '../components/GoBackButton';
import CommentsBox from '../components/CommentsBox';

function AirlineDetail() {
  const { id } = useParams();
  const [airline, setAirline] = useState(null);

  // Busca dos dados detalhados da companhia aérea
    useEffect(() => {
      fetch(`http://localhost:8000/api/companhia/?id=${id}`)
        .then(res => res.json())
        .then(data => {
          if (data.companhia && data.companhia.length > 0) {
            setAirline(data.companhia[0]);
          } else {
            setAirline(null);
          }
        })
        .catch(() => setAirline(null));
    }, [id]);

  if (!airline) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      <GoBackButton />
      <div style={{ maxWidth: 600, margin: '100px auto 0 auto', padding: 32, border: '1px solid #ccc', borderRadius: 16, background: '#f9f9f9' }}>
        <h1 style={{ fontSize: 48, marginBottom: 24 }}>{airline.nome}</h1>
      </div>
      <CommentsBox airlineId={airline.id} />
    </div>
  );
}

export default AirlineDetail;