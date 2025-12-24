package Web;

import Service.LibraryService;
import ModelLibrary.Loan;
import ModelLibrary.Book;
import Web.dto.BorrowRequest;
import Web.dto.ReturnRequest;
import ModelLibrary.Reader;


import org.springframework.web.bind.annotation.*;

import java.sql.SQLException;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class LibraryRestController {

    private final LibraryService libraryService = new LibraryService();

    // ===== BOOK =====
    @GetMapping("/books")
    public List<Book> getBooks() throws SQLException {
        return libraryService.getAllBooks();
    }
    // ===== BOOK CRUD cho trang admin =====

    @PostMapping("/books")
    public Book createBook(@RequestBody Book book) throws SQLException {
        // Nếu availableCopies chưa set thì mặc định = totalCopies
        if (book.getAvailableCopies() == 0) {
            book.setAvailableCopies(book.getTotalCopies());
        }
        libraryService.addBook(book);
        return book;
    }

    @PutMapping("/books/{id}")
    public Book updateBook(@PathVariable String id, @RequestBody Book book) throws SQLException {
        book.setId(id);
        libraryService.updateBook(book);
        return book;
    }

    @DeleteMapping("/books/{id}")
    public boolean deleteBook(@PathVariable String id) throws SQLException {
        return libraryService.deleteBook(id);
    }


    // ===== READERS =====
    @GetMapping("/readers")
    public List<Reader> getReaders() throws SQLException {
        return libraryService.getAllReaders();
    }

    // ===== LOAN =====
    @GetMapping("/loans")
    public List<Loan> getLoans() throws SQLException {
        return libraryService.getAllLoans();
    }

    @GetMapping("/loans/overdue")
    public List<Loan> getOverdue() throws SQLException {
        return libraryService.getOverdueLoans();
    }

    // ===== BORROW =====
    @PostMapping("/borrow")
    public Loan borrow(@RequestBody BorrowRequest req) throws SQLException {
        return libraryService.borrowFromWeb(
                req.getName(),
                req.getPhone(),
                req.getBookQuery()
        );
    }

    // ===== RETURN =====
    @PostMapping("/return")
    public boolean returnBook(@RequestBody ReturnRequest req) throws SQLException {
        return libraryService.returnBook(req.getLoanId());
    }
    // =======CALL API======
    @GetMapping("/dashboard/stats")
    public Web.dto.DashboardStats getStats() throws SQLException {
        // Gọi xuống Service để lấy số liệu đã tính toán bằng OOP
        return libraryService.getDashboardStats();
    }
}
