package Web;

import Service.LibraryService;
import ModelLibrary.Book;
import ModelLibrary.Loan;
import ModelLibrary.Reader;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLException;
import java.time.LocalDate;
import java.util.List;

@Controller
public class LibraryController {

    private final LibraryService svc = new LibraryService();

    @GetMapping({"/", "/books"})
    public String books(Model model) throws SQLException {
        List<Book> list = svc.getAllBooks();
        model.addAttribute("books", list);
        return "Books"; // src/main/resources/templates/Books.html
    }

    @GetMapping("/readers")
    public String readers(Model model) throws SQLException {
        List<Reader> list = svc.getAllReaders();
        model.addAttribute("readers", list);
        return "Readers"; // Readers.html
    }

    @GetMapping("/loans")
    public String loans(Model model) throws SQLException {
        List<Loan> list = svc.getAllLoans();
        model.addAttribute("loans", list);
        return "Loans"; // Loans.html
    }

    @GetMapping("/borrow")
    public String borrowForm(Model model) throws SQLException {
        model.addAttribute("books", svc.getAvailableBooks());
        model.addAttribute("readers", svc.getAllReaders());
        return "Borrow"; // Borrow.html
    }

    @PostMapping("/borrow")
    public String doBorrow(@RequestParam String loanId,
                           @RequestParam String bookId,
                           @RequestParam String readerId,
                           Model model) throws SQLException {
        try {
            svc.borrowLoan(loanId, bookId, readerId);
            return "redirect:/loans";
        } catch (Exception e) {
            model.addAttribute("error", e.getMessage());
            model.addAttribute("books", svc.getAvailableBooks());
            model.addAttribute("readers", svc.getAllReaders());
            return "Borrow";
        }
    }

    @GetMapping("/return")
    public String returnForm(Model model) throws SQLException {
        model.addAttribute("loans", svc.getAllLoans());
        return "Return"; // Return.html
    }

    @PostMapping("/return")
    public String doReturn(@RequestParam String loanId, Model model) throws SQLException {
        boolean ok = svc.returnBook(loanId);
        if (!ok) model.addAttribute("error", "Không thể trả (đã trả hoặc không tồn tại).");
        return "redirect:/loans";
    }

    @GetMapping("/search/title")
    public String searchTitle(@RequestParam(required = false) String q, Model model) throws SQLException {
        List<Book> books = (q == null || q.isBlank()) ? svc.getAllBooks() : svc.searchBookByTitle(q);
        model.addAttribute("books", books);
        model.addAttribute("q", q);
        return "Books";
    }

    @GetMapping("/search/author")
    public String searchAuthor(@RequestParam(required = false) String q, Model model) throws SQLException {
        List<Book> books = (q == null || q.isBlank()) ? svc.getAllBooks() : svc.searchBookByAuthor(q);
        model.addAttribute("books", books);
        model.addAttribute("q", q);
        return "Books";
    }

    // Admin pages: available, borrowed, overdue
    @GetMapping("/admin/available")
    public String available(Model model) throws SQLException {
        model.addAttribute("books", svc.getAvailableBooks());
        return "Books";
    }

    @GetMapping("/admin/borrowed")
    public String borrowed(Model model) throws SQLException {
        model.addAttribute("books", svc.getBorrowedBooks());
        return "Books";
    }

    @GetMapping("/admin/overdue")
    public String overdue(Model model) throws SQLException {
        model.addAttribute("loans", svc.getOverdueLoans());
        return "Loans";
    }
}
