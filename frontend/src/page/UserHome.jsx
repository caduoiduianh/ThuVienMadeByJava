// frontend/src/page/UserHome.jsx
import { useEffect, useState } from "react";
import { fetchBooks, borrowFromWeb, returnFromWeb } from "../api/libraryApi";
import "./UserHome.css";

export default function UserHome({ role, onLogout }) {
  const [books, setBooks] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [error, setError] = useState("");

  const [borrowForm, setBorrowForm] = useState({
    readerName: "",
    phone: "",
    bookQuery: ""
  });
  const [borrowResult, setBorrowResult] = useState(null);

  const [returnLoanId, setReturnLoanId] = useState("");
  const [returnMessage, setReturnMessage] = useState("");

  // load sách khi vào trang
  useEffect(() => {
    (async () => {
      try {
        setLoadingBooks(true);
        const data = await fetchBooks();
        setBooks(data);
      } catch (e) {
        setError(e.message || "Lỗi tải danh sách sách");
      } finally {
        setLoadingBooks(false);
      }
    })();
  }, []);

  const handleBorrowChange = (e) => {
    const { name, value } = e.target;
    setBorrowForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBorrowSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBorrowResult(null);

    try {
      const loan = await borrowFromWeb({
        readerName: borrowForm.readerName,
        phone: borrowForm.phone,
        bookQuery: borrowForm.bookQuery
      });
      setBorrowResult(loan);
    } catch (e) {
      setError(e.message || "Không thể mượn sách");
    }
  };

  const handleReturnSubmit = async (e) => {
    e.preventDefault();
    setReturnMessage("");
    setError("");

    try {
      const res = await returnFromWeb(returnLoanId);
      if (res.success) {
        setReturnMessage(`Trả sách thành công cho phiếu mượn ${returnLoanId}`);
      } else {
        setReturnMessage(`Không trả được sách cho phiếu mượn ${returnLoanId}`);
      }
    } catch (e) {
      setError(e.message || "Lỗi khi trả sách");
    }
  };

  return (
    <div className="user-home">
      <header className="user-header">
        <h1>Thư viện online</h1>
        <div>
          <span>Role: {role}</span>
          <button onClick={onLogout}>Đăng xuất</button>
        </div>
      </header>

      {error && <div className="error-box">{error}</div>}

      {/* Danh sách sách */}
      <section className="panel">
        <h2>Danh sách sách hiện có</h2>
        {loadingBooks ? (
          <p>Đang tải sách...</p>
        ) : books.length === 0 ? (
          <p>Không có sách nào.</p>
        ) : (
          <table className="book-table">
            <thead>
              <tr>
                <th>Mã</th>
                <th>Tên sách</th>
                <th>Tác giả</th>
                <th>Kho</th>
              </tr>
            </thead>
            <tbody>
              {books.map((b) => (
                <tr key={b.id}>
                  <td>{b.id}</td>
                  <td>{b.title}</td>
                  <td>{b.author}</td>
                  <td>
                    {b.availableCopies}/{b.totalCopies}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Form mượn sách */}
      <section className="panel">
        <h2>Mượn sách</h2>
        <form onSubmit={handleBorrowSubmit} className="form-card">
          <div className="form-group">
            <label>Họ tên người mượn</label>
            <input
              name="readerName"
              value={borrowForm.readerName}
              onChange={handleBorrowChange}
              placeholder="VD: Nguyễn Văn A"
              required
            />
          </div>

          <div className="form-group">
            <label>Số điện thoại</label>
            <input
              name="phone"
              value={borrowForm.phone}
              onChange={handleBorrowChange}
              placeholder="VD: 0912345678"
              required
            />
          </div>

          <div className="form-group">
            <label>Sách muốn mượn (mã / tên / tác giả)</label>
            <input
              name="bookQuery"
              value={borrowForm.bookQuery}
              onChange={handleBorrowChange}
              placeholder="VD: B001 hoặc Clean Code hoặc Robert C. Martin"
              required
            />
          </div>

          <button type="submit">Gửi yêu cầu mượn</button>
        </form>

        {borrowResult && (
          <div className="success-box">
            <p>Đã tạo phiếu mượn:</p>
            <ul>
              <li>Mã phiếu: {borrowResult.id}</li>
              <li>Mã sách: {borrowResult.bookId}</li>
              <li>Mã độc giả: {borrowResult.readerId}</li>
              <li>Ngày mượn: {borrowResult.loanDate}</li>
              <li>Hạn trả: {borrowResult.dueDate}</li>
            </ul>
          </div>
        )}
      </section>

      {/* Form trả sách đơn giản theo loanId */}
      <section className="panel">
        <h2>Trả sách</h2>
        <form onSubmit={handleReturnSubmit} className="form-card">
          <div className="form-group">
            <label>Mã phiếu mượn (Loan ID)</label>
            <input
              value={returnLoanId}
              onChange={(e) => setReturnLoanId(e.target.value)}
              placeholder="VD: L001 hoặc L173262834..."
              required
            />
          </div>
          <button type="submit">Xác nhận trả</button>
        </form>

        {returnMessage && <div className="info-box">{returnMessage}</div>}
      </section>
    </div>
  );
}
