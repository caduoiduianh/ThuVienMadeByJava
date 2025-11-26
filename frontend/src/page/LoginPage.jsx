import { useState } from 'react';
import "../components/LoginPage.css"; // tí nữa tao chỉ thêm style

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      setError('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.');
      return;
    }

    setError('');
    onLogin(username.trim(), password.trim());
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">Library Management</h1>
        <p className="login-subtitle">
          Đăng nhập để sử dụng hệ thống (admin / người dùng thường)
        </p>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Tên đăng nhập</label>
            <input
              type="text"
              placeholder="admin hoặc tên bất kỳ"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Mật khẩu</label>
            <input
              type="password"
              placeholder="admin123 cho Admin"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-primary">
            Đăng nhập
          </button>

          <div className="hint">
            <strong>Gợi ý:</strong> admin / admin123 → vào trang Admin
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
