// src/components/LoginPage.js
import React, { useState } from 'react';
import './LoginPage.css';

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]     = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // TẠM THỜI: hard-code account để demo
    // Sau này nối với Spring Boot API /login thì thay đoạn này.
    if (username === 'admin' && password === 'admin123') {
      onLogin({ username, role: 'admin' });
    } else if (username === 'user' && password === 'user123') {
      onLogin({ username, role: 'user' });
    } else {
      setError('Sai tên đăng nhập hoặc mật khẩu');
    }
  };

  return (
    <div className="login-root">
      <div className="login-card">
        <h1>Thư viện Java</h1>
        <p className="login-subtitle">Đăng nhập để quản lý sách</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tên đăng nhập</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="admin hoặc user"
              required
            />
          </div>

          <div className="form-group">
            <label>Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && <p className="error-text">{error}</p>}

          <button type="submit" className="btn-primary">
            Đăng nhập
          </button>

          <p className="hint">
            Admin: <b>admin / admin123</b> – User: <b>user / user123</b>
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
