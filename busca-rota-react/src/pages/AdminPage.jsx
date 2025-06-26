import React, { useEffect, useState } from 'react';
import GoBackButton from '../components/GoBackButton';

function AdminPage() {
  const [activeTab, setActiveTab] = useState('usuarios');
  const [usuarios, setUsuarios] = useState([]);
  const [comentarios, setComentarios] = useState([]);
  const [loadingUsuarios, setLoadingUsuarios] = useState(true);
  const [loadingComentarios, setLoadingComentarios] = useState(true);

  useEffect(() => {
    async function fetchUsuarios() {
      setLoadingUsuarios(true);
      try {
        const res = await fetch('http://localhost:8000/api/todos_usuarios_postgres/');
        const data = await res.json();
        setUsuarios(data);
      } catch {
        setUsuarios([]);
      }
      setLoadingUsuarios(false);
    }
    async function fetchComentarios() {
      setLoadingComentarios(true);
      try {
        const res = await fetch('http://localhost:8000/api/todos_comentarios/');
        const data = await res.json();
        setComentarios(data);
      } catch {
        setComentarios([]);
      }
      setLoadingComentarios(false);
    }
    fetchUsuarios();
    fetchComentarios();
  }, []);

  function formatDateTime(dtString) {
    if (!dtString) return '';
    const dt = new Date(dtString);
    const pad = n => n.toString().padStart(2, '0');
    return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())} ${pad(dt.getHours())}:${pad(dt.getMinutes())}:${pad(dt.getSeconds())}`;
  }

  return (
    <div>
      <GoBackButton />
      <h1 style={{ textAlign: 'center', marginTop: 40, fontSize: 48 }}>
        Administrador Page
      </h1>
      <div style={{ maxWidth: 900, margin: '40px auto', padding: 32, border: '1px solid #ccc', borderRadius: 16, background: '#f9f9f9' }}>
        <div style={{ display: 'flex', marginBottom: 24 }}>
          <button
            style={{
              flex: 1,
              padding: 12,
              border: 'none',
              borderBottom: activeTab === 'usuarios' ? '3px solid #1976d2' : '1px solid #ccc',
              background: activeTab === 'usuarios' ? '#fff' : '#f0f0f0',
              fontWeight: activeTab === 'usuarios' ? 'bold' : 'normal',
              cursor: 'pointer'
            }}
            onClick={() => setActiveTab('usuarios')}
          >
            Usuários
          </button>
          <button
            style={{
              flex: 1,
              padding: 12,
              border: 'none',
              borderBottom: activeTab === 'comentarios' ? '3px solid #1976d2' : '1px solid #ccc',
              background: activeTab === 'comentarios' ? '#fff' : '#f0f0f0',
              fontWeight: activeTab === 'comentarios' ? 'bold' : 'normal',
              cursor: 'pointer'
            }}
            onClick={() => setActiveTab('comentarios')}
          >
            Comentários
          </button>
        </div>
        {activeTab === 'usuarios' && (
          <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: 8, padding: 16 }}>
            {loadingUsuarios ? (
              <div>Carregando usuários...</div>
            ) : usuarios.length === 0 ? (
              <div>Nenhum usuário encontrado.</div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 16 }}>
                <thead>
                  <tr style={{ background: '#f0f0f0' }}>
                    <th style={{ padding: 8, border: '1px solid #ddd' }}>Usuário</th>
                    <th style={{ padding: 8, border: '1px solid #ddd' }}>Nickname</th>
                    <th style={{ padding: 8, border: '1px solid #ddd' }}>Data de Cadastro</th>
                    <th style={{ padding: 8, border: '1px solid #ddd' }}>Admin</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map(u => (
                    <tr key={u.username}>
                      <td style={{ padding: 8, border: '1px solid #ddd' }}>{u.username}</td>
                      <td style={{ padding: 8, border: '1px solid #ddd' }}>{u.nickname}</td>
                      <td style={{ padding: 8, border: '1px solid #ddd' }}>{u.data_cadastro}</td>
                      <td style={{ padding: 8, border: '1px solid #ddd' }}>
                        {u.is_role_admin ? <span style={{ color: 'green', fontWeight: 'bold' }}>Sim</span> : 'Não'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
        {activeTab === 'comentarios' && (
          <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: 8, padding: 16 }}>
            {loadingComentarios ? (
              <div>Carregando comentários...</div>
            ) : comentarios.length === 0 ? (
              <div>Nenhum comentário encontrado.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {comentarios.map((c, idx) => (
                  <div key={idx} style={{ borderBottom: '1px solid #ddd', paddingBottom: 8 }}>
                    {c.conteudo && (
                      <div>
                        <strong>Comentário:</strong> {c.conteudo}
                      </div>
                    )}
                    {c.horario_postagem && (
                      <div>
                        <strong>Data:</strong> {formatDateTime(c.horario_postagem)}
                      </div>
                    )}
                    {c.usuario_username && (
                      <div>
                        <strong>Usuário:</strong> {c.usuario_username}
                      </div>
                    )}
                    {c.aeroporto_iata && (
                      <div>
                        <strong>Aeroporto:</strong> {c.aeroporto_iata}
                      </div>
                    )}
                    {c.companhia_id && (
                      <div>
                        <strong>Companhia:</strong> {c.companhia_id}
                      </div>
                    )}
                    {c.comentario_pai_id && (
                      <div>
                        <strong>Comentário Pai:</strong> {c.comentario_pai_id}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPage;