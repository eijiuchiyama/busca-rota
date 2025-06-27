import React, { useState, useEffect } from 'react';
import GoBackButton from '../components/GoBackButton';
import { useNavigate } from 'react-router-dom';

function UserProfile() {
  const username = localStorage.getItem('username');
  const nickname = localStorage.getItem('nickname');
  const [activeTab, setActiveTab] = useState('history');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  // Histórico
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState('');
  const [historyAmount, setHistoryAmount] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    async function checkAdmin() {
      if (!username) return;
      try {
        const res = await fetch(`http://localhost:8000/api/verifica_admin/?username=${encodeURIComponent(username)}`);
        const data = await res.json();
        setIsAdmin(data.is_admin === true);
      } catch {
        setIsAdmin(false);
      }
    }
    checkAdmin();
  }, [username]);

  // Buscar histórico ao abrir aba
  useEffect(() => {
    if (activeTab !== 'history' || !username) return;
    setHistoryLoading(true);
    setHistoryError('');
    fetch(`http://localhost:8000/api/retorna_rotas/?username=${encodeURIComponent(username)}&quantidade=${historyAmount}`)
      .then(res => res.json())
      .then(data => {
        setHistory(data.rotas || []);
        setHistoryLoading(false);
      })
      .catch(() => {
        setHistory([]);
        setHistoryError('Erro ao carregar histórico.');
        setHistoryLoading(false);
      });
  }, [activeTab, username, historyAmount]);

  function handleLogout() {
    localStorage.removeItem('username');
    localStorage.removeItem('nickname');
    window.location.href = '/';
  }

  // Função para formatar o total conforme tipo de busca
  function formatTotal(tipo, total) {
    if (tipo === 'distancia') return `Total de distância: ${total} km`;
    if (tipo === 'tempo') return `Total de tempo: ${formatSecondsToDuration(total)}`;
    if (tipo === 'preco') return `Total de custo: R$ ${total}`;
    return `Total: ${total}`;
  }

  // Função para formatar segundos em tempo legível
  function formatSecondsToDuration(totalSeconds) {
    if (!totalSeconds || isNaN(totalSeconds)) return '0s';
    totalSeconds = Math.floor(totalSeconds);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    let result = [];
    if (days > 0) result.push(`${days} dia${days > 1 ? 's' : ''}`);
    if (hours > 0) result.push(`${hours}h`);
    if (minutes > 0) result.push(`${minutes}min`);
    if (seconds > 0 || result.length === 0) result.push(`${seconds}s`);
    return result.join(' ');
  }

  // Função para formatar ISO em tempo legível
  function formatDateTime(dtString) {
  if (!dtString) return '';
  const dt = new Date(dtString);
  const pad = n => n.toString().padStart(2, '0');
  return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())} ${pad(dt.getHours())}:${pad(dt.getMinutes())}:${pad(dt.getSeconds())}`;
}

  // Função para traduzir tipo_busca para label amigável
  function tipoBuscaLabel(tipo, classe) {
    if (tipo === 'distancia') return 'Menor Distância';
    if (tipo === 'tempo') return 'Menor Tempo';
    if (tipo === 'preco') {
      if (classe === 'economica') return 'Menor Custo Econômico';
      if (classe === 'executiva') return 'Menor Custo Executivo';
      if (classe === 'primeira') return 'Menor Custo Primeira Classe';
    }
    return tipo;
  }

  // Ao clicar no histórico, navega para Home e passa dados via state
  function handleHistoryClick(item) {
    navigate('/', {
      state: {
        fromHistory: true,
        rotaSalva: item,
      }
    });
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    setPasswordMessage('');
    if (newPassword !== confirmPassword) {
      setPasswordMessage('As senhas novas não coincidem!');
      return;
    }
    if (!oldPassword) {
      setPasswordMessage('Informe a senha atual.');
      return;
    }
    try {
      const verifyRes = await fetch(
        `http://localhost:8000/api/verifica_usuario/?username=${encodeURIComponent(username)}&senha=${encodeURIComponent(oldPassword)}`
      );
      if (verifyRes.status === 204) {
        setPasswordMessage('Senha atual incorreta!');
        return;
      }
      const verifyData = await verifyRes.json();
      if (!verifyData.usuario || verifyData.usuario.length === 0) {
        setPasswordMessage('Senha atual incorreta!');
        return;
      }
    } catch {
      setPasswordMessage('Erro ao verificar senha atual');
      return;
    }
    try {
      const res = await fetch('http://localhost:8000/api/atualiza_senha/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username,
          nova_senha: newPassword,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setPasswordMessage('Senha alterada com sucesso!');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordMessage(data.erro || data.Erro || 'Erro ao alterar senha');
      }
    } catch {
      setPasswordMessage('Erro ao conectar ao servidor');
    }
  }

  async function handleClearHistory() {
    if (!window.confirm('Tem certeza que deseja excluir todo o seu histórico?')) return;
    try {
      const res = await fetch('http://localhost:8000/api/exclui_historico/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });
      const data = await res.json();
      if (res.ok) {
        setHistory([]);
        alert('Histórico excluído com sucesso!');
      } else {
        alert(data.erro || data.Erro || 'Erro ao excluir histórico');
      }
    } catch {
      alert('Erro ao conectar ao servidor');
    }
  }

  return (
    <div>
      <GoBackButton />
      {isAdmin && (
        <div style={{ position: 'absolute', top: 24, right: 24 }}>
          <button
            onClick={() => navigate('/admin')}
            style={{
              padding: '10px 24px',
              background: '#1976d2',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              fontWeight: 'bold',
              fontSize: 16,
              cursor: 'pointer',
              boxShadow: '0 2px 8px #0002'
            }}
          >
            Página do Admin
          </button>
        </div>
      )}
      <h1 style={{ textAlign: 'center', marginTop: 40, fontSize: 48 }}>Bem Vindo! {nickname}</h1>
      <div style={{ maxWidth: 500, margin: '40px auto', padding: 32, border: '1px solid #ccc', borderRadius: 16, background: '#f9f9f9' }}>
        <div style={{ display: 'flex', marginBottom: 24 }}>
          <button
            style={{
              flex: 1,
              padding: 12,
              border: 'none',
              borderBottom: activeTab === 'history' ? '3px solid #1976d2' : '1px solid #ccc',
              background: activeTab === 'history' ? '#fff' : '#f0f0f0',
              fontWeight: activeTab === 'history' ? 'bold' : 'normal',
              cursor: 'pointer'
            }}
            onClick={() => setActiveTab('history')}
          >
            Histórico de Pesquisa
          </button>
          <button
            style={{
              flex: 1,
              padding: 12,
              border: 'none',
              borderBottom: activeTab === 'password' ? '3px solid #1976d2' : '1px solid #ccc',
              background: activeTab === 'password' ? '#fff' : '#f0f0f0',
              fontWeight: activeTab === 'password' ? 'bold' : 'normal',
              cursor: 'pointer'
            }}
            onClick={() => setActiveTab('password')}
          >
            Mudar Senha
          </button>
        </div>
        {activeTab === 'history' && (
          <div>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <label htmlFor="historyAmount" style={{ marginRight: 8 }}>Mostrar:</label>
                <select
                  id="historyAmount"
                  value={historyAmount}
                  onChange={e => setHistoryAmount(Number(e.target.value))}
                  style={{ padding: '6px 12px', borderRadius: 6, fontSize: 16 }}
                >
                  <option value={5}>5 mais recentes</option>
                  <option value={10}>10 mais recentes</option>
                  <option value={20}>20 mais recentes</option>
                  <option value={50}>50 mais recentes</option>
                </select>
              </div>
              <button
                onClick={handleClearHistory}
                style={{
                  padding: '6px 18px',
                  background: '#d32f2f',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  fontWeight: 'bold',
                  fontSize: 15,
                  cursor: 'pointer'
                }}
              >
                Limpar Histórico
              </button>
            </div>
            <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: 8, padding: 16, minHeight: 120 }}>
              {historyLoading && <p>Carregando histórico...</p>}
              {historyError && <p style={{ color: 'red' }}>{historyError}</p>}
              {!historyLoading && !historyError && history.length === 0 && (
                <p>Nenhum histórico de pesquisa encontrada.</p>
              )}
              {!historyLoading && !historyError && history.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {history
                    .slice()
                    .sort((a, b) => new Date(b.hora_pesquisa) - new Date(a.hora_pesquisa))
                    .map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleHistoryClick(item)}
                        style={{
                          cursor: 'pointer',
                          border: '1px solid #1976d2',
                          borderRadius: 8,
                          padding: 16,
                          background: '#f5faff',
                          transition: 'background 0.2s',
                          boxShadow: '0 2px 8px #1976d220',
                          fontSize: 18,
                          fontWeight: 500,
                        }}
                      >
                        <div>
                          <span style={{ fontWeight: 700 }}>{item.aeroporto_partida}</span>
                          {' '}→{' '}
                          <span style={{ fontWeight: 700 }}>{item.aeroporto_chegada}</span>
                        </div>
                        <div style={{ marginTop: 4, color: '#1976d2' }}>
                          {tipoBuscaLabel(item.tipo_busca, item.trajetos[0].classe)}
                        </div>
                        <div style={{ marginTop: 4 }}>
                          {formatTotal(item.tipo_busca, item.total)}
                        </div>
                        <div style={{ marginTop: 4, fontSize: 14, color: '#555' }}>
                          Pesquisado em: {formatDateTime(item.hora_pesquisa)}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}
        {activeTab === 'password' && (
          <form onSubmit={handleChangePassword}>
            <div style={{ marginBottom: 16 }}>
              <label>Senha atual:</label>
              <input
                type="password"
                value={oldPassword}
                onChange={e => setOldPassword(e.target.value)}
                required
                style={{ width: '100%', padding: 8, marginTop: 4 }}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label>Nova senha:</label>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
                style={{ width: '100%', padding: 8, marginTop: 4 }}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label>Confirmar nova senha:</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                style={{ width: '100%', padding: 8, marginTop: 4 }}
              />
            </div>
            <button type="submit" style={{ width: '100%', padding: 12, background: '#1976d2', color: '#fff', border: 'none', borderRadius: 8 }}>
              Alterar Senha
            </button>
            {passwordMessage && (
              <div style={{ marginTop: 16, color: passwordMessage.includes('sucesso') ? 'green' : 'red' }}>
                {passwordMessage}
              </div>
            )}
          </form>
        )}
      </div>
      <div style={{ textAlign: 'center', marginTop: 24 }}>
        <button
          onClick={handleLogout}
          style={{ padding: 12, background: '#d32f2f', color: '#fff', border: 'none', borderRadius: 8, minWidth: 120 }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default UserProfile;