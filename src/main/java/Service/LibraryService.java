package Service;

import DataAccessObject.BookObject;
import DataAccessObject.LoanObject;
import DataAccessObject.ReaderObject;
import ModelLibrary.Book;
import ModelLibrary.Loan;
import ModelLibrary.Reader;
import Web.dto.RecentActivity; // Cần import DTO này

import java.sql.SQLException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

public class LibraryService {

    private final BookObject bookDAO;
    private final ReaderObject readerDAO;
    private final LoanObject loanDAO;

    public static final int DEFAULT_LOAN_DAYS = 14;
    public static final int DEFAULT_MAX_LOANS = 3;

    public LibraryService() {
        this.bookDAO = new BookObject();
        this.readerDAO = new ReaderObject();
        this.loanDAO = new LoanObject();
    }

    // ===== BOOK =====

    public List<Book> getAllBooks() throws SQLException {
        return bookDAO.findAll();
    }

    public Book getBook(String id) throws SQLException {
        return bookDAO.findById(id);
    }

    public boolean addBook(Book b) throws SQLException {
        return bookDAO.insert(b);
    }

    public boolean updateBook(Book b) throws SQLException {
        return bookDAO.update(b);
    }

    public boolean deleteBook(String id) throws SQLException {
        return bookDAO.delete(id);
    }

    public List<Book> searchBookByTitle(String keyword) throws SQLException {
        return bookDAO.searchByTitle(keyword);
    }

    public List<Book> searchBookByAuthor(String keyword) throws SQLException {
        return bookDAO.searchByAuthor(keyword);
    }

    // ===== READER =====

    public List<Reader> getAllReaders() throws SQLException {
        return readerDAO.findAll();
    }

    public Reader getReader(String id) throws SQLException {
        return readerDAO.findById(id);
    }

    public boolean addReader(Reader r) throws SQLException {
        return readerDAO.insert(r);
    }

    public boolean updateReader(Reader r) throws SQLException {
        return readerDAO.update(r);
    }

    public boolean deleteReader(String id) throws SQLException {
        return readerDAO.delete(id);
    }

    // Tìm reader theo tên + phone (phục vụ web UI)
    public Reader findReaderByNamePhone(String name, String phone) throws SQLException {
        return readerDAO.findByNameAndPhone(name, phone);
    }

    // ===== LOAN (mượn / trả theo ID như console app cũ) =====

    public Loan borrowLoan(String loanId, String bookId, String readerId) throws SQLException {

        Book book = bookDAO.findById(bookId);
        if (book == null) {
            throw new IllegalArgumentException("Không tìm thấy sách: " + bookId);
        }

        Reader reader = readerDAO.findById(readerId);
        if (reader == null) {
            throw new IllegalArgumentException("Không tìm thấy độc giả: " + readerId);
        }

        if (book.getAvailableCopies() <= 0) {
            throw new IllegalStateException("Sách đã hết, không thể mượn!");
        }

        int activeLoans = readerDAO.countActiveLoans(readerId);
        if (activeLoans >= reader.getMaxLoans()) {
            throw new IllegalStateException(
                    "Độc giả đã mượn tối đa " + reader.getMaxLoans() + " cuốn, không thể mượn thêm.");
        }

        LocalDate today = LocalDate.now();
        LocalDate due = today.plusDays(DEFAULT_LOAN_DAYS);
        Loan loan = new Loan(loanId, bookId, readerId, today, due, null);

        try {
            if (!bookDAO.decrementAvailable(bookId)) {
                throw new IllegalStateException("Không thể trừ số lượng sách (có thể đã hết).");
            }

            if (!loanDAO.insert(loan)) {
                bookDAO.incrementAvailable(bookId);
                throw new IllegalStateException("Không thể tạo phiếu mượn sách!");
            }
        } catch (SQLException e) {
            bookDAO.incrementAvailable(bookId);
            throw e;
        }

        return loan;
    }

    public boolean returnBook(String loanId) throws SQLException {
        Loan loan = loanDAO.findById(loanId);
        if (loan == null) return false;
        if (loan.getReturnDate() != null) return false;

        LocalDate today = LocalDate.now();
        boolean updated = loanDAO.markReturned(loanId, today);
        if (updated) {
            bookDAO.incrementAvailable(loan.getBookId());
        }
        return updated;
    }

    public List<Loan> getAllLoans() throws SQLException {
        return loanDAO.findAll();
    }

    public List<Loan> getLoansByReader(String readerId) throws SQLException {
        return loanDAO.findByReader(readerId);
    }

    public List<Loan> getActiveLoansByReader(String readerId) throws SQLException {
        return loanDAO.findActiveByReader(readerId);
    }

    public List<Loan> getOverdueLoans() throws SQLException {
        return loanDAO.findOverdue(LocalDate.now());
    }

    // ===== THỐNG KÊ SIMPLE =====

    // Sách còn có thể mượn (available > 0)
    public List<Book> getAvailableBooks() throws SQLException {
        List<Book> all = bookDAO.findAll();
        List<Book> out = new ArrayList<>();
        for (Book b : all) {
            if (b.getAvailableCopies() > 0) {
                out.add(b);
            }
        }
        return out;
    }

    // Sách đang được mượn (available < total)
    public List<Book> getBorrowedBooks() throws SQLException {
        List<Book> all = bookDAO.findAll();
        List<Book> out = new ArrayList<>();
        for (Book b : all) {
            if (b.getAvailableCopies() < b.getTotalCopies()) {
                out.add(b);
            }
        }
        return out;
    }

    // ===== HỖ TRỢ WEB: tạo ID + tìm/ tạo Reader + chọn sách từ query =====

    // Rxxx, dựa trên ID reader hiện có trong DB
    private String genReaderId() throws SQLException {
        int max = 0;
        for (Reader r : readerDAO.findAll()) {
            String id = r.getId();
            if (id != null && id.startsWith("R")) {
                try {
                    int n = Integer.parseInt(id.substring(1));
                    if (n > max) max = n;
                } catch (NumberFormatException ignore) {
                }
            }
        }
        return String.format("R%03d", max + 1);
    }

    // Lxxxxxxxxxx – đơn giản dùng timestamp
    private String genLoanId() {
        return "L" + System.currentTimeMillis();
    }

    // Tìm reader theo (name, phone); nếu chưa có thì tạo mới
    private Reader findOrCreateReader(String name, String phone) throws SQLException {
        Reader r = readerDAO.findByNameAndPhone(name, phone);
        if (r != null) return r;

        String newId = genReaderId();

        // nếu class Reader của mày không có field phone thì đổi lại constructor cho đúng
        r = new Reader(newId, name, phone, DEFAULT_MAX_LOANS);
        readerDAO.insert(r);
        return r;
    }

    // Tìm 1 cuốn sách từ query (ID / title / author)
    private Book resolveBookFromQuery(String query) throws SQLException {
        if (query == null || query.isBlank()) {
            throw new IllegalArgumentException("Vui lòng nhập thông tin sách.");
        }

        // 1. thử theo ID
        Book byId = bookDAO.findById(query);
        if (byId != null) return byId;

        // 2. thử theo title
        List<Book> byTitle = bookDAO.searchByTitle(query);
        if (!byTitle.isEmpty()) {
            return byTitle.get(0);
        }

        // 3. thử theo author
        List<Book> byAuthor = bookDAO.searchByAuthor(query);
        if (!byAuthor.isEmpty()) {
            return byAuthor.get(0);
        }

        throw new IllegalArgumentException("Không tìm thấy sách phù hợp với: " + query);
    }

    // API cho Web: người dùng nhập tên + phone + query sách
    public Loan borrowFromWeb(String readerName, String phone, String bookQuery) throws SQLException {
        Reader reader = findOrCreateReader(readerName, phone);
        Book book = resolveBookFromQuery(bookQuery);
        String loanId = genLoanId();
        return borrowLoan(loanId, book.getId(), reader.getId());
    }

    // =============================================================
    // CẬP NHẬT: Lấy Dashboard Stats + 5 Hoạt động gần đây (Recent Activity)
    // =============================================================
    public Web.dto.DashboardStats getDashboardStats() throws SQLException {
        // 1. Lấy toàn bộ dữ liệu từ Database
        List<Book> books = bookDAO.findAll();
        List<Reader> readers = readerDAO.findAll();
        List<Loan> loans = loanDAO.findAll();

        // 2. Tính tổng số lượng
        int totalBooks = books.size();     // Tổng đầu sách
        int totalMembers = readers.size(); // Tổng thành viên

        // 3. Tính toán trạng thái mượn trả
        int borrowingCount = 0;
        int overdueCount = 0;

        for (Loan l : loans) {
            // Chỉ xét những phiếu Mượn chưa trả (ReturnDate là null)
            if (l.getReturnDate() == null) {
                borrowingCount++;

                // [OOP LOGIC] Gọi phương thức của đối tượng Loan
                if (l.isOverdue()) {
                    overdueCount++;
                }
            }
        }

        // 4. XỬ LÝ DANH SÁCH HOẠT ĐỘNG GẦN ĐÂY (Top 5)
        // Sắp xếp danh sách loans theo ngày mượn (mới nhất lên đầu)
        loans.sort(Comparator.comparing(Loan::getLoanDate).reversed());

        // Lấy 5 phần tử đầu tiên (hoặc ít hơn nếu danh sách chưa đủ 5)
        List<Loan> top5 = loans.subList(0, Math.min(loans.size(), 5));
        
        List<RecentActivity> activities = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");

        for (Loan l : top5) {
            // Vì bảng Loan chỉ lưu ID, cần query lấy Tên Sách và Tên Độc Giả
            Book b = bookDAO.findById(l.getBookId());
            Reader r = readerDAO.findById(l.getReaderId());

            String bookTitle = (b != null) ? b.getTitle() : "Sách đã xóa";
            String memberName = (r != null) ? r.getName() : "Khách vãng lai";
            
            // Nếu đã có ngày trả -> Action là "Đã trả", ngược lại là "Mượn sách"
            String action = (l.getReturnDate() != null) ? "Đã trả" : "Mượn sách";
            String dateStr = l.getLoanDate().format(formatter);

            // Thêm vào list hoạt động
            activities.add(new RecentActivity(l.getId(), memberName, bookTitle, action, dateStr));
        }

        // 5. Đóng gói kết quả vào Object DTO mới (bao gồm cả list activities)
        return new Web.dto.DashboardStats(totalBooks, totalMembers, borrowingCount, overdueCount, activities);
    }
}