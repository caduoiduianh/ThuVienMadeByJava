// src/components/Dashboard.js
import React from 'react';
import './Dashboard.css';

function Dashboard({ role, username, onLogout }) {
  return (
    <div className="dash-root">
      <header className="dash-header">
        <h1>Thư viện Java</h1>
        <div className="user-info">
          <span>{username} ({role === 'admin' ? 'Admin' : 'Bạn đọc'})</span>
          <button className="btn-outline" onClick={onLogout}>
            Đăng xuất
          </button>
        </div>
      </header>

      <main className="dash-main">
        <section className="dash-section">
          <h2>Chức năng cơ bản</h2>
          <div className="card-grid">
            <button className="card-btn">Danh sách sách</button>
            <button className="card-btn">Mượn sách</button>
            <button className="card-btn">Trả sách</button>
            <button className="card-btn">Tìm sách</button>
          </div>
        </section>

        {role === 'admin' && (
          <section className="dash-section">
            <h2>Khu vực Admin</h2>
            <div className="card-grid">
              <button className="card-btn card-admin">
                Sách còn / đang mượn
              </button>
              <button className="card-btn card-admin">
                Danh sách quá hạn
              </button>
              <button className="card-btn card-admin">
                Thống kê độc giả
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
