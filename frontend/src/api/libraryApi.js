// frontend/src/api/libraryApi.js
const API_BASE = "http://localhost:8080/api";

async function handleResponse(res) {
  if (!res.ok) {
    let msg = "Request failed";
    try {
      const text = await res.text();
      msg = text || res.statusText;
    } catch {
      // ignore
    }
    throw new Error(msg);
  }
  // Nếu không có body (204) thì trả về {}
  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return {};
  }
  return res.json();
}

export async function fetchBooks() {
  const res = await fetch(`${API_BASE}/books`);
  return handleResponse(res);
}

export async function getAllLoans() {
  const res = await fetch(`${API_BASE}/loans`);
  return handleResponse(res);
}

export async function getOverdueLoans() {
  const res = await fetch(`${API_BASE}/loans/overdue`);
  return handleResponse(res);
}

// User mượn sách từ web
export async function borrowFromWeb({ readerName, phone, bookQuery }) {
  const res = await fetch(`${API_BASE}/borrow-web`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ readerName, phone, bookQuery })
  });
  return handleResponse(res);
}

// User trả sách theo loanId
export async function returnFromWeb(loanId) {
  const res = await fetch(`${API_BASE}/return-web`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ loanId })
  });
  return handleResponse(res);
}
