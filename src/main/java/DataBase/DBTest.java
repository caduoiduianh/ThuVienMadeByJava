package DataBase;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;

import java.time.LocalDate;
import Util.Date;

import DataAccessObject.BookObject;
import DataAccessObject.ReaderObject;
import ModelLibrary.Book;
import ModelLibrary.Reader;
import Service.LibraryService;
import ModelLibrary.Loan;

public class DBTest {

    public static void main(String[] args) throws Exception {

        // ==== TEST Date util ====
        LocalDate d = Date.parseDate("17/11/2025");
        System.out.println("Parsed      = " + d);                // 2025-11-17
        System.out.println("Formatted   = " + Date.format(d));   // 17/11/2025

        java.sql.Date sql = Date.toSqlDate(d);
        System.out.println("SQL Date    = " + sql);

        LocalDate back = Date.fromSqlDate(sql);
        System.out.println("Back to LDT = " + back);
        System.out.println("================================");

        // 1. Test kết nối DB
        try (Connection cn = Database.getConnection();
             Statement st = cn.createStatement()) {

            try (ResultSet rs = st.executeQuery("SELECT VERSION()")) {
                rs.next();
                System.out.println("MySQL version: " + rs.getString(1));
            }
            System.out.println("JDBC OK.");
        }

        // 2. Test BookObject
        BookObject bookDao = new BookObject();

        // Chạy lần đầu: mở comment để insert; lần sau có thể comment lại để khỏi trùng khóa
        // bookDao.insert(new Book("B001","Clean Code","Robert C. Martin",3,3));
        // bookDao.insert(new Book("B002","Effective Java","Joshua Bloch",2,2));

        System.out.println("=== BOOKS ===");
        for (Book b : bookDao.findAll()) {
            System.out.println(b);
        }

        // 3. Test ReaderObject
        ReaderObject readerDao = new ReaderObject();

        // Chạy lần đầu: mở comment, sau đó có thể tắt
        // readerDao.insert(new Reader("R001", "Nguyen Van A", 3));
        // readerDao.insert(new Reader("R002", "Tran Thi B", 2));

        System.out.println("=== READERS ===");
        for (Reader r : readerDao.findAll()) {
            System.out.println(r);
        }

        // 4. Test LibraryService (mượn sách)
        System.out.println("=== SERVICE TEST ===");
        LibraryService svc = new LibraryService();

        try {
            Loan l = svc.borrowLoan("L003", "B001", "R001");  // đổi mã loan cho khỏi trùng
            System.out.println("Borrowed: " + l);
        } catch (Exception e) {
            System.out.println("Borrow error: " + e.getMessage());
        }

        for (Loan l : svc.getAllLoans()) {
            System.out.println(l);
        }
    }
}
