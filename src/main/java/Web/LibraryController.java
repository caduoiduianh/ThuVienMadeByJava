package Web;

import ModelLibrary.Book;
import ModelLibrary.Loan;
import ModelLibrary.Reader;
import Service.LibraryService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Controller
public class LibraryController {

    private final LibraryService svc = new LibraryService();

    // ===== TRANG CHỦ =====
    @GetMapping("/")
    public String index() {
        return "index";
    }

    // ===== LIST CƠ BẢN =====

    @GetMapping("/books")
    public String listBooks(Model model) throws SQLException {
        model.addAttribute("books", svc.getAllBooks());
        return "books";
    }

    @GetMapping("/readers")
    public String listReaders(Model model) throws SQLException {
        model.addAttribute("readers", svc.getAllReaders());
        return "readers";
    }

    @GetMapping("/loans")
    public String listLoans(Model model) throws SQLException {
        model.addAttribute("loans", svc.getAllLoans());
        return "loans";
    }

    // ===== TÌM SÁCH THEO TÊN =====

    @GetMapping("/search/title")
    public String searchTitleForm(Model model) {
        model.addAttribute("keyword", "");
        model.addAttribute("books", Collections.emptyList());
        return "search-title";
    }

    @PostMapping("/search/title")
    public String searchTitleSubmit(@RequestParam("keyword") String keyword,
                                    Model model) throws SQLException {
        List<Book> books = svc.searchBookByTitle(keyword);
        model.addAttribute("keyword", keyword);
        model.addAttribute("books", books);
        return "search-title";
    }

    // ===== TÌM SÁCH THEO TÁC GIẢ =====

    @GetMapping("/search/authors")
    public String searchAuthorForm(Model model) {
        model.addAttribute("keyword", "");
        model.addAttribute("books", Collections.emptyList());
        return "search-authors";
    }

    @PostMapping("/search/authors")
    public String searchAuthorSubmit(@RequestParam("keyword") String keyword,
                                     Model model) throws SQLException {
        List<Book> books = svc.searchBookByAuthor(keyword);
        model.addAttribute("keyword", keyword);
        model.addAttribute("books", books);
        return "search-authors";
    }

    // ===== FORM MƯỢN SÁCH: người dùng nhập tên + phone + query sách =====

    @GetMapping("/borrow")
    public String borrowForm(Model model) {
        model.addAttribute("loanForm", new BorrowForm());
        model.addAttribute("success", null);
        return "borrow";
    }

    @PostMapping("/borrow")
    public String borrowSubmit(@ModelAttribute("loanForm") BorrowForm form,
                               Model model) throws SQLException {
        try {
            Loan loan = svc.borrowFromWeb(form.getReaderName(), form.getPhone(), form.getBookQuery());
            model.addAttribute("success", true);
            model.addAttribute("loan", loan);
        } catch (IllegalArgumentException | IllegalStateException e) {
            model.addAttribute("success", false);
            model.addAttribute("error", e.getMessage());
        }
        return "borrow";
    }

    // ===== FORM TRẢ SÁCH: nhập tên + phone, chọn sách đang mượn để trả =====

    @GetMapping("/return")
    public String returnForm(Model model) {
        model.addAttribute("returnForm", new ReturnForm());
        model.addAttribute("loans", Collections.emptyList());
        model.addAttribute("done", false);
        return "return";
    }

    @PostMapping("/return")
    public String returnSubmit(@ModelAttribute("returnForm") ReturnForm form,
                               Model model) throws SQLException {

        // 1. tìm reader theo tên + phone
        Reader reader = svc.findReaderByNamePhone(form.getReaderName(), form.getPhone());
        if (reader == null) {
            model.addAttribute("error", "Không tìm thấy độc giả với tên + số điện thoại này.");
            model.addAttribute("loans", Collections.emptyList());
            model.addAttribute("done", false);
            return "return";
        }

        form.setReaderId(reader.getId());

        // 2. nếu chưa chọn sách -> load danh sách sách đang mượn để user tick
        if (form.getSelectedLoanIds() == null || form.getSelectedLoanIds().isEmpty()) {
            List<Loan> activeLoans = svc.getActiveLoansByReader(reader.getId());
            if (activeLoans.isEmpty()) {
                model.addAttribute("error", "Độc giả này không còn cuốn nào đang mượn.");
            }
            model.addAttribute("loans", activeLoans);
            model.addAttribute("done", false);
            return "return";
        }

        // 3. nếu đã chọn sách -> tiến hành trả từng loanId
        boolean allOK = true;
        for (String loanId : form.getSelectedLoanIds()) {
            boolean ok = svc.returnBook(loanId);
            if (!ok) allOK = false;
        }

        List<Loan> remaining = svc.getActiveLoansByReader(reader.getId());
        model.addAttribute("loans", remaining);
        model.addAttribute("allOK", allOK);
        model.addAttribute("done", true);
        return "return";
    }

    // ======= FORM CLASS =======

    public static class BorrowForm {
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

    public static class ReturnForm {
        private String readerName;
        private String phone;
        private String readerId;                  // lưu ID sau khi tìm được reader
        private List<String> selectedLoanIds = new ArrayList<>();

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

        public String getReaderId() {
            return readerId;
        }

        public void setReaderId(String readerId) {
            this.readerId = readerId;
        }

        public List<String> getSelectedLoanIds() {
            return selectedLoanIds;
        }

        public void setSelectedLoanIds(List<String> selectedLoanIds) {
            this.selectedLoanIds = selectedLoanIds;
        }
    }
}
