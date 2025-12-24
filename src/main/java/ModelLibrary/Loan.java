package ModelLibrary;

import java.time.LocalDate;

public class Loan {
    private String Id;
    private String ReaderId;
    private String BookId;
    private LocalDate LoanDate;
    private LocalDate DueDate;
    private LocalDate ReturnDate;

    public Loan() {}

    public Loan(String Id, String BookId, String ReaderId, LocalDate LoanDate, LocalDate dueDate, LocalDate returnDate) {
        this.Id = Id;
        this.ReaderId = ReaderId;
        this.BookId = BookId;
        this.LoanDate = LoanDate;
        this.DueDate = dueDate;
        this.ReturnDate = returnDate;
    }

    // Getters & Setters
    public String getId() { return Id; }
    public void setId(String id) { this.Id = id; }

    public String getBookId() { return BookId; }
    public void setBookId(String bookId) { this.BookId = bookId; }

    public String getReaderId() { return ReaderId; }
    public void setReaderId(String readerId) { this.ReaderId = readerId; }

    public LocalDate getLoanDate() { return LoanDate; }
    public void setLoanDate(LocalDate loanDate) { this.LoanDate = loanDate; }

    public LocalDate getDueDate() { return DueDate; }
    public void setDueDate(LocalDate dueDate) { this.DueDate = dueDate; }

    public LocalDate getReturnDate() { return ReturnDate; }
    public void setReturnDate(LocalDate returnDate) { this.ReturnDate = returnDate; }
    public boolean isOverdue() {
        // 1. Nếu đã trả rồi (ReturnDate có dữ liệu) -> Không bao giờ tính là quá hạn
        if (this.ReturnDate != null) {
            return false;
        }
        // 2. Nếu chưa trả -> So sánh ngày hiện tại với ngày Hạn trả (DueDate)
        // Nếu hôm nay (now) nằm SAU ngày DueDate -> Quá hạn (True)
        return LocalDate.now().isAfter(this.DueDate);
    }
    
    @Override
    public String toString() {
        return Id + " | " + BookId + " | " + ReaderId + " | " + LoanDate + " | " + DueDate;
    }
}