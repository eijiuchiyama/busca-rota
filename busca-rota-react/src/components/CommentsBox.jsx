import React, { useEffect, useState } from 'react';

function CommentsBox({ iata, airlineId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState('');
  const username = localStorage.getItem('username');

  async function fetchComments() {
    setLoading(true);
    let url = 'http://localhost:8000/api/comentarios_relacionados/';
    if (iata) {
      url += `?iata=${encodeURIComponent(iata)}`;
    } else if (airlineId) {
      url += `?id=${encodeURIComponent(airlineId)}`;
    } else {
      setComments([]);
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.comentarios) {
        setComments(data.comentarios);
      } else {
        setComments([]);
      }
    } catch (e) {
      setComments([]);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchComments();
  }, [iata, airlineId]);

  async function handleSubmit(e) {
    e.preventDefault();
    setPosting(true);
    setError('');
    const body = {
      conteudo: newComment,
      username: username,
      iata: iata || undefined,
      id: airlineId || undefined,
    };
    try {
      const res = await fetch('http://localhost:8000/api/insere_comentario/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        setNewComment('');
        fetchComments();
      } else {
        setError(data.erro || data.Erro || 'Erro ao postar comentário');
      }
    } catch {
      setError('Erro ao conectar ao servidor');
    }
    setPosting(false);
  }

  function formatDateTime(dtString) {
    if (!dtString) return '';
    const dt = new Date(dtString);
    const pad = n => n.toString().padStart(2, '0');
    return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())} ${pad(dt.getHours())}:${pad(dt.getMinutes())}:${pad(dt.getSeconds())}`;
  }

  function renderComments(parentId = null, isReply = false) {
    const filteredComments = comments
      .map((c, idx) => ({ ...c, _idx: idx }))
      .filter(c => (c.comentario_pai_id || null) === parentId);

    return filteredComments.map((c, idx) => (
      <li
        key={
          (c.horario_postagem || '') +
          (c.usuario_username || '') +
          (c.aeroporto_iata || '') +
          (c.comentario_pai_id || '') +
          c._idx
        }
        style={{
          borderBottom: !isReply && idx < filteredComments.length - 1 ? '1px solid #bbb' : 'none',
          marginLeft: isReply ? 32 : 0,
          textAlign: 'left',
        }}
      >
        <span style={{ fontWeight: 'bold' }}>
          {isReply && <span style={{ marginRight: 4 }}>↳</span>}
          {c.usuario_username}
        </span>
        <span style={{ color: '#888', fontSize: 12, marginLeft: 8 }}>
          ({formatDateTime(c.horario_postagem)})
        </span>
        <span>: {c.conteudo}</span>
        <ul style={{ marginTop: 8, paddingLeft: 0, listStyle: 'none' }}>
          {renderComments(c._idx, true)}
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
      {username && (
        <form onSubmit={handleSubmit} style={{ marginBottom: 16 }}>
          <textarea
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            rows={3}
            style={{ width: '100%', borderRadius: 8, padding: 8, resize: 'vertical' }}
            placeholder="Digite seu comentário..."
            disabled={posting}
            required
          />
          <button
            type="submit"
            disabled={posting || !newComment.trim()}
            style={{
              marginTop: 8,
              padding: '6px 16px',
              borderRadius: 8,
              border: 'none',
              background: '#1976d2',
              color: '#fff',
              cursor: posting ? 'not-allowed' : 'pointer'
            }}
          >
            {posting ? 'Enviando...' : 'Postar'}
          </button>
          {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
        </form>
      )}
      {loading ? (
        <div><strong>Carregando comentários...</strong></div>
      ) : comments.length === 0 ? (
        <div><strong>Nenhum comentário encontrado.</strong></div>
      ) : (
        <ul style={{ marginTop: 12, paddingLeft: 0, listStyle: 'none', textAlign: 'left' }}>
          {renderComments()}
        </ul>
      )}
    </div>
  );
}

export default CommentsBox;