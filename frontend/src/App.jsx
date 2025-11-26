import { useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

import LoginPage from "./page/LoginPage.jsx";
import UserHome from "./page/UserHome.jsx";
import AdminDashboard from "./page/AdminDashboard.jsx";

function App() {
  const navigate = useNavigate();

  // Lấy role từ localStorage ngay lúc khởi tạo state
  const [role, setRole] = useState(() => {
    return localStorage.getItem("role"); // null | 'admin' | 'user'
  });

  const handleLogin = (username, password) => {
    // Logic bài tập:
    // - nếu username === 'admin' && password === 'admin123' → admin
    // - ngược lại → user thường
    let newRole = "user";
    if (username === "admin" && password === "admin123") {
      newRole = "admin";
    }

    setRole(newRole);
    localStorage.setItem("role", newRole);

    if (newRole === "admin") {
      navigate("/admin");
    } else {
      navigate("/user");
    }
  };

  const handleLogout = () => {
    setRole(null);
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <Routes>
      <Route path="/" element={<LoginPage onLogin={handleLogin} />} />

      <Route
        path="/user"
        element={
          role ? (
            <UserHome role={role} onLogout={handleLogout} />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      <Route
        path="/admin"
        element={
          role === "admin" ? (
            <AdminDashboard onLogout={handleLogout} />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      {/* fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
