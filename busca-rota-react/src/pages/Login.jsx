import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Adicione esta linha
import GoBackButton from '../components/GoBackButton';

function Login() {
  const [activeTab, setActiveTab] = useState('login');
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [signInData, setSignInData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    nickname: ''
  });
  const navigate = useNavigate(); // Adicione esta linha

  function handleLoginChange(e) {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  }

  function handleSignInChange(e) {
    setSignInData({ ...signInData, [e.target.name]: e.target.value });
  }

  function handleLoginSubmit(e) {
    e.preventDefault();
    fetch(
      `http://localhost:8000/api/verifica_usuario/?username=${loginData.username}&senha=${loginData.password}`
    )
      .then(async (res) => {
        if (res.status === 204) {
          alert('Usuário ou senha inválidos!');
          return;
        }
        const data = await res.json();
        if (data.usuario && data.usuario.length > 0) {
          alert('Login realizado com sucesso!');
          localStorage.setItem('username', loginData.username);
          navigate('/user-profile', { replace: true });
        } else {
          alert(data.erro || data.Erro || 'Usuário ou senha inválidos!');
        }
      })
      .catch(() => {
        alert('Erro de conexão com o servidor');
      });
  }

  async function handleSignInSubmit(e) {
    e.preventDefault();
    if (signInData.password !== signInData.confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }
    try {
      const response = await fetch('http://localhost:8000/api/insere_usuario/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: signInData.username,
          senha: signInData.password,
          nickname: signInData.nickname
        })
      });
      const data = await response.json();
      if (response.ok) {
        alert('Cadastro realizado com sucesso!');
        setActiveTab('login');
        setSignInData({
          username: '',
          password: '',
          confirmPassword: '',
          nickname: ''
        });
      } else {
        alert(data.erro || data.Erro || 'Erro ao cadastrar usuário');
      }
    } catch (err) {
      alert('Erro de conexão com o servidor');
    }
  }

  return (
    <div>
      <GoBackButton />
      <h1 style={{ textAlign: 'center', marginTop: '50px', fontSize: '96px', fontFamily: "Turret Road"}}>Faça login ou cadastro</h1>
      <div className="login-container" style={{ maxWidth: 400, margin: '60px auto', padding: 32, border: '1px solid #ccc', borderRadius: 16, background: '#f9f9f9' }}>
        <div style={{ display: 'flex', marginBottom: 24 }}>
          <button
            style={{
              flex: 1,
              padding: 12,
              border: 'none',
              borderBottom: activeTab === 'login' ? '3px solid #1976d2' : '1px solid #ccc',
              background: activeTab === 'login' ? '#fff' : '#f0f0f0',
              fontWeight: activeTab === 'login' ? 'bold' : 'normal',
              cursor: 'pointer'
            }}
            onClick={() => setActiveTab('login')}
          >
            Log in
          </button>
          <button
            style={{
              flex: 1,
              padding: 12,
              border: 'none',
              borderBottom: activeTab === 'signin' ? '3px solid #1976d2' : '1px solid #ccc',
              background: activeTab === 'signin' ? '#fff' : '#f0f0f0',
              fontWeight: activeTab === 'signin' ? 'bold' : 'normal',
              cursor: 'pointer'
            }}
            onClick={() => setActiveTab('signin')}
          >
            Sign in
          </button>
        </div>
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label htmlFor="login-username">Usuário:</label>
              <input
                type="text"
                id="login-username"
                name="username"
                value={loginData.username}
                onChange={handleLoginChange}
                required
                style={{ width: '100%', padding: 8, marginTop: 4 }}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label htmlFor="login-password">Senha:</label>
              <input
                type="password"
                id="login-password"
                name="password"
                value={loginData.password}
                onChange={handleLoginChange}
                required
                style={{ width: '100%', padding: 8, marginTop: 4 }}
              />
            </div>
            <button type="submit" style={{ width: '100%', padding: 12, background: '#1976d2', color: '#fff', border: 'none', borderRadius: 8 }}>Login</button>
          </form>
        )}
        {activeTab === 'signin' && (
          <form onSubmit={handleSignInSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label htmlFor="signin-username">Usuário:</label>
              <input
                type="text"
                id="signin-username"
                name="username"
                value={signInData.username}
                onChange={handleSignInChange}
                required
                style={{ width: '100%', padding: 8, marginTop: 4 }}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label htmlFor="signin-password">Senha:</label>
              <input
                type="password"
                id="signin-password"
                name="password"
                value={signInData.password}
                onChange={handleSignInChange}
                required
                style={{ width: '100%', padding: 8, marginTop: 4 }}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label htmlFor="signin-confirm-password">Confirmar Senha:</label>
              <input
                type="password"
                id="signin-confirm-password"
                name="confirmPassword"
                value={signInData.confirmPassword}
                onChange={handleSignInChange}
                required
                style={{ width: '100%', padding: 8, marginTop: 4 }}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label htmlFor="signin-nickname">Nickname:</label>
              <input
                type="text"
                id="signin-nickname"
                name="nickname"
                value={signInData.nickname}
                onChange={handleSignInChange}
                required
                style={{ width: '100%', padding: 8, marginTop: 4 }}
              />
            </div>
            <button type="submit" style={{ width: '100%', padding: 12, background: '#1976d2', color: '#fff', border: 'none', borderRadius: 8 }}>Cadastrar</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Login;