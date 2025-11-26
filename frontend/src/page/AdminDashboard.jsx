// frontend/src/page/AdminDashboard.jsx
import { useEffect, useState } from "react";
import { getAllLoans, getOverdueLoans } from "../api/libraryApi";
import "./AdminDashboard.css";

export default function AdminDashboard({ onLogout }) {
  const [loans, setLoans] = useState([]);
  const [overdues, setOverdues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [all, od] = await Promise.all([
          getAllLoans(),
          getOverdueLoans()
        ]);
        setLoans(all);
        setOverdues(od);
      } catch (e) {
        setError(e.message || "Lỗi tải dữ liệu admin");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>Admin - Thống kê thư viện</h1>
        <button onClick={onLogout}>Đăng xuất</button>
      </header>

      {error && <div className="error-box">{error}</div>}

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <>
          <section className="panel">
            <h2>Tất cả phiếu mượn</h2>
            {loans.length === 0 ? (
              <p>Chưa có phiếu mượn nào.</p>
            ) : (
              <table className="loan-table">
                <thead>
                  <tr>
                    <th>Mã phiếu</th>
                    <th>Mã sách</th>
                    <th>Mã độc giả</th>
                    <th>Ngày mượn</th>
                    <th>Hạn trả</th>
                    <th>Ngày trả</th>
                  </tr>
                </thead>
                <tbody>
                  {loans.map((l) => (
                    <tr key={l.id}>
                      <td>{l.id}</td>
                      <td>{l.bookId}</td>
                      <td>{l.readerId}</td>
                      <td>{l.loanDate}</td>
                      <td>{l.dueDate}</td>
                      <td>{l.returnDate || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>

          <section className="panel">
            <h2>Phiếu mượn quá hạn</h2>
            {overdues.length === 0 ? (
              <p>Không có phiếu quá hạn.</p>
            ) : (
              <table className="loan-table overdue">
                <thead>
                  <tr>
                    <th>Mã phiếu</th>
                    <th>Mã sách</th>
                    <th>Mã độc giả</th>
                    <th>Ngày mượn</th>
                    <th>Hạn trả</th>
                  </tr>
                </thead>
                <tbody>
                  {overdues.map((l) => (
                    <tr key={l.id}>
                      <td>{l.id}</td>
                      <td>{l.bookId}</td>
                      <td>{l.readerId}</td>
                      <td>{l.loanDate}</td>
                      <td>{l.dueDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        </>
      )}
    </div>
  );
}
