import React from 'react';
import BackToMenuButton from '../components/BackToMenuButton';

function Login() {
  return (
    <div className="login-container">
      <BackToMenuButton />
      <h2>Login / Sign In</h2>
      <form>
        <div>
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" name="username" required />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" required />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;