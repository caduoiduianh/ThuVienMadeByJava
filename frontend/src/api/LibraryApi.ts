// src/api/LibraryApi.ts

const API_BASE = "http://localhost:8080/api";

/**
 * BOOK – bản map cho frontend
 */
export interface Book {
    id: string;
    title: string;
    author: string;
    category: string;
    isbn: string;
    quantity: number;
    available: number;
}

export async function getBooks(): Promise<Book[]> {
    const res = await fetch(`${API_BASE}/books`);
    if (!res.ok) {
        throw new Error("Không tải được danh sách sách");
    }

    const raw = await res.json();

    return (raw as any[]).map((b) => ({
        id: String(b.id),
        title: b.title,
        author: b.author,
        category: b.category,
        isbn: b.isbn,
        quantity: Number(b.totalCopies ?? b.total_copies ?? 0),
        available: Number(b.availableCopies ?? b.available_copies ?? 0),
    }));
}
// ===== BOOK CRUD cho admin =====

export interface BookPayload {
    id: string;
    title: string;
    author: string;
    category: string;
    isbn: string;
    quantity: number;
    available: number;
}

function toBackendBook(b: BookPayload) {
    return {
        id: b.id,
        title: b.title,
        author: b.author,
        category: b.category,
        isbn: b.isbn,
        totalCopies: b.quantity,
        availableCopies: b.available,
    };
}

export async function createBook(payload: BookPayload): Promise<Book> {
    const res = await fetch(`${API_BASE}/books`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toBackendBook(payload)),
    });

    if (!res.ok) {
        throw new Error("Không thêm được sách mới");
    }

    const b = await res.json();
    return {
        id: String(b.id),
        title: b.title,
        author: b.author,
        category: b.category ?? "",
        isbn: b.isbn ?? "",
        quantity: Number(b.totalCopies ?? b.total_copies ?? 0),
        available: Number(b.availableCopies ?? b.available_copies ?? 0),
    };
}

export async function updateBookApi(id: string, payload: BookPayload): Promise<Book> {
    const res = await fetch(`${API_BASE}/books/${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toBackendBook(payload)),
    });

    if (!res.ok) {
        throw new Error("Không cập nhật được sách");
    }

    const b = await res.json();
    return {
        id: String(b.id),
        title: b.title,
        author: b.author,
        category: b.category ?? "",
        isbn: b.isbn ?? "",
        quantity: Number(b.totalCopies ?? b.total_copies ?? 0),
        available: Number(b.availableCopies ?? b.available_copies ?? 0),
    };
}

export async function deleteBookApi(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/books/${encodeURIComponent(id)}`, {
        method: "DELETE",
    });

    if (!res.ok) {
        throw new Error("Không xoá được sách");
    }
}


/**
 * READER – độc giả
 */
export interface Reader {
    id: string;
    name: string;
    phone: string;
    maxLoans: number;
}

export async function getReaders(): Promise<Reader[]> {
    const res = await fetch(`${API_BASE}/readers`);
    if (!res.ok) {
        throw new Error("Không tải được danh sách độc giả");
    }

    const raw = await res.json();
    return (raw as any[]).map((r) => ({
        id: String(r.id),
        name: r.name,
        phone: r.phone ?? "",
        maxLoans: Number(r.maxLoans ?? r.max_loans ?? 0),
    }));
}

/**
 * LOAN – phiếu mượn
 */
export interface Loan {
    id: string;
    // id thô để join với bảng khác
    readerId?: string;
    bookId?: string;

    // thông tin hiển thị
    memberCode: string; // mã TV (R001...)
    memberName: string;
    bookTitle: string;

    borrowDate: string;
    dueDate: string;
    returnDate?: string | null;
    status?: "borrowed" | "returned" | "overdue" | string;

    borrowerPhone?: string;
}

/**
 * Lấy tất cả phiếu mượn – dùng cho Admin
 */
export async function getLoans(): Promise<Loan[]> {
    const res = await fetch(`${API_BASE}/loans`);
    if (!res.ok) {
        throw new Error("Không tải được danh sách phiếu mượn");
    }

    const raw = await res.json();
    return (raw as any[]).map((l) => ({
        id: String(l.id ?? l.loanId ?? ""),

        readerId:
            l.readerId ??
            l.reader_id ??
            l.memberCode ??
            l.maThanhVien ??
            "",
        bookId: l.bookId ?? l.book_id ?? "",

        memberCode:
            l.readerId ??
            l.readerCode ??
            l.memberCode ??
            l.maThanhVien ??
            "",

        memberName:
            l.readerName ??
            l.memberName ??
            l.borrowerName ??
            l.name ??
            "",

        borrowerPhone: l.borrowerPhone ?? l.phone ?? "",
        bookTitle: l.bookTitle ?? l.bookName ?? "",

        borrowDate: l.loanDate ?? l.borrowDate ?? l.ngayMuon ?? "",
        dueDate: l.dueDate ?? l.hanTra ?? "",
        returnDate: l.returnDate ?? l.ngayTra ?? null,
        status: l.status as any,
    }));
}

/**
 * Danh sách phiếu quá hạn (nếu cần)
 */
export async function getOverdueLoans(): Promise<Loan[]> {
    const res = await fetch(`${API_BASE}/loans/overdue`);
    if (!res.ok) {
        throw new Error("Không tải được danh sách quá hạn");
    }

    const raw = await res.json();
    return (raw as any[]).map((l) => ({
        id: String(l.id ?? l.loanId ?? ""),

        readerId:
            l.readerId ??
            l.reader_id ??
            l.memberCode ??
            l.maThanhVien ??
            "",
        bookId: l.bookId ?? l.book_id ?? "",

        memberCode:
            l.readerId ??
            l.readerCode ??
            l.memberCode ??
            l.maThanhVien ??
            "",
        memberName:
            l.readerName ??
            l.memberName ??
            l.borrowerName ??
            l.name ??
            "",
        borrowerPhone: l.borrowerPhone ?? l.phone ?? "",
        bookTitle: l.bookTitle ?? l.bookName ?? "",
        borrowDate: l.loanDate ?? l.borrowDate ?? l.ngayMuon ?? "",
        dueDate: l.dueDate ?? l.hanTra ?? "",
        returnDate: l.returnDate ?? l.ngayTra ?? null,
        status: (l.status as any) ?? "overdue",
    }));
}

/**
 * API cho user mượn / trả sách – dùng cho UserDashboard
 */

export interface BorrowPayload {
    name: string;
    phone: string;
    bookQuery: string; // có thể là tên sách, mã sách,...
}

export async function borrowBook(payload: BorrowPayload): Promise<Loan> {
    const res = await fetch(`${API_BASE}/borrow`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        throw new Error("Mượn sách thất bại");
    }

    const l = await res.json();
    return {
        id: String(l.id ?? l.loanId ?? ""),
        readerId:
            l.readerId ??
            l.reader_id ??
            l.memberCode ??
            l.maThanhVien ??
            "",
        bookId: l.bookId ?? l.book_id ?? "",

        memberCode:
            l.readerId ??
            l.readerCode ??
            l.memberCode ??
            l.maThanhVien ??
            "",
        memberName:
            l.readerName ??
            l.memberName ??
            l.borrowerName ??
            payload.name,
        borrowerPhone: l.borrowerPhone ?? l.phone ?? payload.phone,
        bookTitle: l.bookTitle ?? l.bookName ?? "",
        borrowDate: l.borrowDate ?? l.loanDate ?? "",
        dueDate: l.dueDate ?? "",
        returnDate: l.returnDate ?? null,
        status: l.status as any,
    };
}

export interface ReturnPayload {
    loanId: string; // mã phiếu mượn, ví dụ: "L001"
}

export async function returnBook(payload: ReturnPayload): Promise<boolean> {
    const res = await fetch(`${API_BASE}/return`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        throw new Error("Trả sách thất bại");
    }

    const data = await res.json();
    return Boolean(data);
}
