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

    public String getId() { return Id; }
    public String getBookId() { return BookId; }
    public String getReaderId() { return ReaderId; }
    public LocalDate getLoanDate() { return LoanDate; }
    public LocalDate getDueDate() { return DueDate; }
    public LocalDate getReturnDate() { return ReturnDate; }

    public void setId(String id) { this.Id = id; }
    public void setBookId(String bookId) { this.BookId = bookId; }
    public void setReaderId(String readerId) { this.ReaderId = readerId; }
    public void setLoanDate(LocalDate loanDate) { this.LoanDate = loanDate; }
    public void setDueDate(LocalDate dueDate) { this.DueDate = dueDate; }
    public void setReturnDate(LocalDate returnDate) { this.ReturnDate = returnDate; }

    public String toString(){
        return Id + " | " + BookId +
                " | Reader " + ReaderId +
                " | Loan: " + LoanDate +
                " | Due: " + DueDate +
                " | Return: " + ReturnDate;
    }

}