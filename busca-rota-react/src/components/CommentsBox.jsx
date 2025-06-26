import React, { useEffect, useState } from 'react';

function CommentsBox({ iata, airlineId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [replyerror, setReplyError] = useState('');
  const [hoveredIdx, setHoveredIdx] = useState(null);
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

  async function handleReplySubmit(e, comentarioPaiId) {
    e.preventDefault();
    setPosting(true);
    setReplyError('');
    const body = {
      conteudo: replyContent,
      username: username,
      comentario_pai: comentarioPaiId,
    };
    try {
      const res = await fetch('http://localhost:8000/api/insere_comentario/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        setReplyContent('');
        setReplyingTo(null);
        fetchComments();
      } else {
        setReplyError(data.erro || data.Erro || 'Erro ao postar resposta');
      }
    } catch {
      setReplyError('Erro ao conectar ao servidor');
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
    const filteredComments = comments.filter(c => (c.comentario_pai_id ?? null) === parentId);

    return filteredComments.map((c) => (
      <li
        key={c.id}
        style={{
          borderBottom: !isReply ? '1px solid #bbb' : 'none',
          marginLeft: isReply ? 32 : 0,
          textAlign: 'left',
          position: 'relative'
        }}
        onMouseEnter={() => setHoveredIdx(c.id)}
        onMouseLeave={() => setHoveredIdx(null)}
      >
        <span style={{ fontWeight: 'bold' }}>
          {isReply && <span style={{ marginRight: 4 }}>↳</span>}
          {c.usuario_nickname}
        </span>
        <span style={{ color: '#888', fontSize: 12, marginLeft: 8 }}>
          ({formatDateTime(c.horario_postagem)})
        </span>
        <span>: {c.conteudo}</span>
        {username && hoveredIdx === c.id && (
          <button
            style={{
              marginLeft: 12,
              fontSize: 12,
              background: 'none',
              border: 'none',
              color: '#1976d2',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
            onClick={() => {
              setReplyingTo(c.id);
              setReplyContent('');
              setReplyError('');
            }}
          >
            Responder
          </button>
        )}
        {replyingTo === c.id && (
          <form onSubmit={e => handleReplySubmit(e, c.id)} style={{ marginTop: 8 }}>
            <textarea
              value={replyContent}
              onChange={e => setReplyContent(e.target.value)}
              rows={2}
              style={{ width: '100%', borderRadius: 8, padding: 8, resize: 'vertical' }}
              placeholder="Digite sua resposta..."
              disabled={posting}
              required
            />
            <div>
              <button
                type="submit"
                disabled={posting || !replyContent.trim()}
                style={{
                  marginTop: 4,
                  padding: '4px 12px',
                  borderRadius: 8,
                  border: 'none',
                  background: '#1976d2',
                  color: '#fff',
                  cursor: posting ? 'not-allowed' : 'pointer'
                }}
              >
                {posting ? 'Enviando...' : 'Responder'}
              </button>
              <button
                type="button"
                onClick={() => setReplyingTo(null)}
                style={{
                  marginLeft: 8,
                  marginTop: 4,
                  padding: '4px 12px',
                  borderRadius: 8,
                  border: 'none',
                  background: '#ccc',
                  color: '#333',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
            </div>
            {replyerror && <div style={{ color: 'red', marginTop: 8 }}>{replyerror}</div>}
          </form>
        )}
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