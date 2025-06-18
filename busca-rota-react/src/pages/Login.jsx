import React, { useState } from 'react';
import GoBackButton from '../components/GoBackButton';

function Login() {
  const [activeTab, setActiveTab] = useState('login');
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [signInData, setSignInData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    name: ''
  });

  function handleLoginChange(e) {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  }

  function handleSignInChange(e) {
    setSignInData({ ...signInData, [e.target.name]: e.target.value });
  }

  function handleLoginSubmit(e) {
    e.preventDefault();
    // Adicione aqui a lógica de login
    alert('Login realizado!');
  }

  function handleSignInSubmit(e) {
    e.preventDefault();
    if (signInData.password !== signInData.confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }
    // Adicione aqui a lógica de cadastro
    alert('Cadastro realizado!');
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
              <label htmlFor="signin-name">Nickname:</label>
              <input
                type="text"
                id="signin-name"
                name="name"
                value={signInData.name}
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