import React, { useEffect, useState } from 'react';

function CommentsBox({ iata, airlineId }) {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    // Simula busca de comentários
    const fakeComments = [
      { id: 1, Aeroporto_IATA: 'GRU', text: 'Ótimo aeroporto, muito organizado.', user: 'Maria', timestamp: '2024-06-10 14:23' },
      { id: 2, text: 'Concordo, sempre limpo.', user: 'João', timestamp: '2024-06-10 15:00', comentario_pai_id: 1 },
      { id: 3, Aeroporto_IATA: 'GRU', text: 'Fila grande no check-in.', user: 'Ana', timestamp: '2024-06-11 09:10' },
      { id: 4, Companhia_id: '1', text: 'LATAM tem bom atendimento.', user: 'Carlos', timestamp: '2024-06-12 16:45' },
      { id: 5, text: 'Achei o atendimento ruim.', user: 'Bruna', timestamp: '2024-06-13 10:00', comentario_pai_id: 4 },
      { id: 6, text: 'Concordo.', user: 'Gustavo', timestamp: '2024-06-10 17:00', comentario_pai_id: 2 },
      { id: 7, text: 'Na última vez estava tudo bagunçado.', user: 'Caique', timestamp: '2024-06-11 15:00', comentario_pai_id: 1 },
      { id: 8, text: 'Gosto do lugar.', user: 'Alberdo', timestamp: '2024-06-11 13:00', comentario_pai_id: 1 },
    ];

    let filtered = [];
    if (iata) {
      filtered = fakeComments.filter(
        c => c.Aeroporto_IATA === iata && !c.comentario_pai_id
      );
    } else if (airlineId) {
      filtered = fakeComments.filter(
        c => c.Companhia_id === airlineId && !c.comentario_pai_id
      );
    }
    // Inclui todas as respostas para renderização recursiva
    const allRelated = [
      ...filtered,
      ...fakeComments.filter(c => c.comentario_pai_id)
    ];
    setComments(allRelated);
  }, [iata, airlineId]);

  if (comments.length === 0) {
    return (
      <div style={{
        marginTop: 32,
        padding: 24,
        border: '1px solid #ccc',
        borderRadius: 16,
        background: '#f9f9f9',
        minWidth: 300,
      }}>
        <strong>Nenhum comentário encontrado.</strong>
      </div>
    );
  }

  function renderComments(parentId = null, isReply = false) {
    const filteredComments = comments.filter(c => (c.comentario_pai_id || null) === parentId);
    return filteredComments.map((c, idx) => (
      <li
        key={c.id}
        style={{
          borderBottom: !isReply && idx < filteredComments.length - 1 ? '1px solid #bbb' : 'none',
          marginLeft: isReply ? 32 : 0,
          textAlign: 'left',
        }}
      >
        <span style={{ fontWeight: 'bold' }}>
          {isReply && <span style={{ marginRight: 4 }}>↳</span>}
          {c.user}
        </span>
        <span style={{ color: '#888', fontSize: 12, marginLeft: 8 }}>({c.timestamp})</span>
        <span>: {c.text}</span>
        <ul style={{ marginTop: 8, paddingLeft: 0, listStyle: 'none' }}>
          {renderComments(c.id, true)}
        </ul>
      </li>
    ));
  }

  return (
    <div style={{
      marginTop: 32,
      padding: 24,
      border: '1px solid #ccc',
      borderRadius: 16,
      background: '#f9f9f9',
      minWidth: 300,
    }}>
      <strong>Comentários:</strong>
      <ul style={{ marginTop: 12, paddingLeft: 0, listStyle: 'none', textAlign: 'left' }}>
        {renderComments()}
      </ul>
    </div>
  );
}

export default CommentsBox;