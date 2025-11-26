package Web;

import ModelLibrary.Book;
import ModelLibrary.Loan;
import ModelLibrary.Reader;
import Service.LibraryService;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLException;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173") // cho phép React gọi
public class LibraryRestController {

    private final LibraryService svc = new LibraryService();

    // ===== BOOKS =====

    @GetMapping("/books")
    public List<Book> getBooks() throws SQLException {
        return svc.getAllBooks();
    }

    // ===== LOANS =====

    @GetMapping("/loans")
    public List<Loan> getLoans() throws SQLException {
        return svc.getAllLoans();
    }

    @GetMapping("/loans/overdue")
    public List<Loan> getOverdueLoans() throws SQLException {
        return svc.getOverdueLoans();
    }

    // ===== READERS (cho admin nếu cần) =====

    @GetMapping("/readers")
    public List<Reader> getReaders() throws SQLException {
        return svc.getAllReaders();
    }

    // ===== USER: MƯỢN SÁCH TỪ WEB =====

    public static class BorrowWebRequest {
        private String readerName;
        private String phone;
        private String bookQuery;

        public String getReaderName() {
            return readerName;
        }
        public void setReaderName(String readerName) {
            this.readerName = readerName;
        }

        public String getPhone() {
            return phone;
        }
        public void setPhone(String phone) {
            this.phone = phone;
        }

        public String getBookQuery() {
            return bookQuery;
        }
        public void setBookQuery(String bookQuery) {
            this.bookQuery = bookQuery;
        }
    }

    @PostMapping("/borrow-web")
    public Loan borrowFromWeb(@RequestBody BorrowWebRequest req) throws SQLException {
        if (req.getReaderName() == null || req.getReaderName().isBlank()) {
            throw new IllegalArgumentException("Vui lòng nhập tên người mượn.");
        }
        if (req.getPhone() == null || req.getPhone().isBlank()) {
            throw new IllegalArgumentException("Vui lòng nhập số điện thoại.");
        }
        if (req.getBookQuery() == null || req.getBookQuery().isBlank()) {
            throw new IllegalArgumentException("Vui lòng nhập thông tin sách.");
        }

        // dùng hàm borrowFromWeb đã viết trong LibraryService
        return svc.borrowFromWeb(req.getReaderName(), req.getPhone(), req.getBookQuery());
    }

    // ===== USER: TRẢ SÁCH TỪ WEB (đơn giản theo loanId trước) =====

    public static class ReturnWebRequest {
        private String loanId;

        public String getLoanId() {
            return loanId;
        }
        public void setLoanId(String loanId) {
            this.loanId = loanId;
        }
    }

    @PostMapping("/return-web")
    public Map<String, Object> returnFromWeb(@RequestBody ReturnWebRequest req) throws SQLException {
        boolean ok = svc.returnBook(req.getLoanId());
        Map<String, Object> res = new HashMap<>();
        res.put("success", ok);
        res.put("timestamp", LocalDate.now().toString());
        return res;
    }
}
