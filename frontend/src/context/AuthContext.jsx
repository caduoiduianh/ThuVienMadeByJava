// src/context/AuthContext.jsx
import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // user: { username, role } hoặc null nếu chưa login
  const [user, setUser] = useState(null);

  // Đăng nhập đơn giản: check username/password tại frontend
  const login = (username, password) => {
    // Tạm: nếu là admin/admin123 -> role ADMIN
    if (username === "admin" && password === "admin123") {
      const u = { username, role: "ADMIN" };
      setUser(u);
      return { ok: true, user: u };
    }

    // User thường: cho pass luôn (bài tập)
    if (username && password) {
      const u = { username, role: "USER" };
      setUser(u);
      return { ok: true, user: u };
    }

    return { ok: false, message: "Sai tài khoản hoặc mật khẩu" };
  };

  const logout = () => {
    setUser(null);
  };

  const value = { user, login, logout, isAdmin: user?.role === "ADMIN" };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// custom hook cho tiện
export function useAuth() {
  return useContext(AuthContext);
}
