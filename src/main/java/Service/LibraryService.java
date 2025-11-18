package Service;

import DataAccessObject.BookObject;
import DataAccessObject.ReaderObject;
import DataAccessObject.LoanObject;
import ModelLibrary.Book;
import ModelLibrary.Loan;
import ModelLibrary.Reader;

import java.sql.SQLException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class LibraryService {

    private final BookObject bookDAO;
    private final ReaderObject readerDAO;
    private final LoanObject loanDAO;

    public static final int DEFAULT_LOAN_DAYS = 14;

    public LibraryService() {
        this.bookDAO = new BookObject();
        this.readerDAO = new ReaderObject();
        this.loanDAO = new LoanObject();
    }

    // Book

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

    //Reader

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

    // Loan

    public Loan borrowLoan(String loanId, String bookId, String readerId) throws SQLException {

        Book book = bookDAO.findById(bookId);
        if (book == null) {
            throw new IllegalArgumentException("Không tìm thấy sách: " + bookId);
        }

        Reader reader = readerDAO.findById(readerId);
        if (reader == null) {
            throw new IllegalArgumentException("Không tìm thấy độc giả: " + readerId);
        }

        //Check book
        if (book.getAvailableCopies() <= 0) {
            throw new IllegalStateException("Sách đã hết, không thể mượn!");
        }

        //Check reader limit
        int activeLoans = readerDAO.countActiveLoans(readerId);
        if (activeLoans >= reader.getMaxLoans()) {
            throw new IllegalStateException(
                    "Độc giả đã mượn tối đa " + reader.getMaxLoans() + " cuốn, không thể mượn thêm.");
        }

        //Create loan
        LocalDate today = LocalDate.now();
        LocalDate due = today.plusDays(DEFAULT_LOAN_DAYS);
        Loan loan = new Loan(loanId, bookId, readerId, today, due, null);

        //Update DB: decrease the available, then insert loan
        try {
            if (!bookDAO.decrementAvailable(bookId)) {
                throw new IllegalStateException("Không thể trừ số lượng sách (có thể đã hết).");
            }

            if (!loanDAO.insert(loan)) {
                // If insert loan fail -> Refund book
                bookDAO.incrementAvailable(bookId);
                throw new IllegalStateException("Không thể tạo phiếu mượn sách!");
            }
        } catch (SQLException e) {
            // SQL error -> Return back book then take the error
            bookDAO.incrementAvailable(bookId);
            throw e;
        }

        return loan;
    }

    public boolean returnBook(String loanId) throws SQLException {
        Loan loan = loanDAO.findById(loanId);
        if (loan == null) {
            return false; // cannot find loan
        }
        if (loan.getReturnDate() != null) {
            return false; // already returned
        }

        LocalDate today = LocalDate.now();
        boolean updated = loanDAO.markReturned(loanId, today);
        if (updated) {
            // increase back
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

    // Statical

    // Book can loan (available > 0)
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

    // Book is now loaning (available < total)
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
}
