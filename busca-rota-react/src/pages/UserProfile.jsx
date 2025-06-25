import React, { useState } from 'react';
import GoBackButton from '../components/GoBackButton';

function UserProfile() {
  const username = localStorage.getItem('username');
  const nickname = localStorage.getItem('nickname');
  const [activeTab, setActiveTab] = useState('history');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');

  function handleLogout() {
    localStorage.removeItem('username');
    localStorage.removeItem('nickname');
    window.location.href = '/';
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
    // Verifica se a senha antiga está correta antes de atualizar
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
    // Se passou na verificação, atualiza a senha
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

  return (
    <div>
      <GoBackButton />
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
          <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: 8, padding: 16, minHeight: 120 }}>
            {/* Aqui futuramente será exibido o histórico do usuário via API */}
            <p>Seu histórico de pesquisa aparecerá aqui.</p>
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