package DataAccessObject;

import ModelLibrary.Loan;

import java.time.LocalDate;

public class LoanDBTest {
    public static void main(String[] args) throws Exception {
        LoanObject dao = new LoanObject();

        // tạo 1 loan mới: nhớ là B001, R001 đã tồn tại trong DB
        Loan l = new Loan(
                "L001",
                "B001",
                "R001",
                LocalDate.now(),
                LocalDate.now().plusDays(14),
                null
        );

        dao.insert(l);

        System.out.println("=== ALL LOANS ===");
        for (Loan loan : dao.findAll()) {
            System.out.println(loan);
        }
    }
}
