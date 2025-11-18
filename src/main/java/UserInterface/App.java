package UserInterface;

import ModelLibrary.Book;
import ModelLibrary.Reader;
import ModelLibrary.Loan;
import Service.LibraryService;

import java.sql.SQLException;
import java.util.List;
import java.util.Scanner;

public class App {

    private static final Scanner sc = new Scanner(System.in);

    public static void main(String[] args) {
        LibraryService svc = new LibraryService();

        // Đăng nhập đơn giản: admin có thêm chức năng thống kê
        boolean isAdmin = loginAsAdmin();

        while (true) {
            printMenu(isAdmin);
            System.out.print("Chọn chức năng: ");
            String choice = sc.nextLine().trim();

            try {
                switch (choice) {
                    case "1":
                        listBooks(svc);
                        break;
                    case "2":
                        listReaders(svc);
                        break;
                    case "3":
                        borrowBookUI(svc);
                        break;
                    case "4":
                        returnBookUI(svc);
                        break;
                    case "5":
                        listLoans(svc);
                        break;
                    case "6":
                        searchBookByTitleUI(svc);
                        break;
                    case "7":
                        searchBookByAuthorUI(svc);
                        break;
                    case "8":
                        if (isAdmin) {
                            listAvailableBooksUI(svc);
                        } else {
                            System.out.println("Chức năng này chỉ dành cho Admin.");
                        }
                        break;
                    case "9":
                        if (isAdmin) {
                            listBorrowedBooksUI(svc);
                        } else {
                            System.out.println("Chức năng này chỉ dành cho Admin.");
                        }
                        break;
                    case "10":
                        if (isAdmin) {
                            listOverdueLoansUI(svc);
                        } else {
                            System.out.println("Chức năng này chỉ dành cho Admin.");
                        }
                        break;
                    case "0":
                        System.out.println("Thoát chương trình.");
                        return;
                    default:
                        System.out.println("Lựa chọn không hợp lệ!");
                }
            } catch (SQLException e) {
                System.out.println("Lỗi SQL: " + e.getMessage());
            } catch (Exception e) {
                System.out.println("Lỗi: " + e.getMessage());
            }

            System.out.println();
            System.out.println("Nhấn Enter để tiếp tục...");
            sc.nextLine();
        }
    }

    // Đăng nhập admin đơn giản (user = admin, pass = admin123)
    private static boolean loginAsAdmin() {
        System.out.println("===== ĐĂNG NHẬP =====");
        System.out.print("Nhập tên đăng nhập (admin để vào chế độ Admin, Enter để bỏ qua): ");
        String user = sc.nextLine().trim();
        if (!"admin".equalsIgnoreCase(user)) {
            System.out.println("Đăng nhập với vai trò người dùng thường.");
            return false;
        }
        System.out.print("Nhập mật khẩu: ");
        String pass = sc.nextLine().trim();
        if ("admin123".equals(pass)) {
            System.out.println("Đăng nhập Admin thành công.");
            return true;
        } else {
            System.out.println("Sai mật khẩu. Đăng nhập với vai trò người dùng thường.");
            return false;
        }
    }

    private static void printMenu(boolean isAdmin) {
        System.out.println("========= QUẢN LÝ THƯ VIỆN =========");
        System.out.println("1. Danh sách sách");
        System.out.println("2. Danh sách độc giả");
        System.out.println("3. Mượn sách");
        System.out.println("4. Trả sách");
        System.out.println("5. Danh sách phiếu mượn");
        System.out.println("6. Tìm kiếm sách theo tên");
        System.out.println("7. Tìm kiếm sách theo tác giả");
        if (isAdmin) {
            System.out.println("8. (Admin) Danh sách sách còn có thể mượn");
            System.out.println("9. (Admin) Danh sách sách đang được mượn");
            System.out.println("10. (Admin) Danh sách phiếu mượn quá hạn");
        }
        System.out.println("0. Thoát");
        System.out.println("====================================");
    }

    // 1. Print the list of book
    private static void listBooks(LibraryService svc) throws SQLException {
        List<Book> books = svc.getAllBooks();
        System.out.println("=== DANH SÁCH SÁCH ===");
        if (books.isEmpty()) {
            System.out.println("(Không có sách nào)");
        } else {
            for (Book b : books) {
                System.out.println(b);
            }
        }
    }

    // 2. Print the list of reader
    private static void listReaders(LibraryService svc) throws SQLException {
        List<Reader> readers = svc.getAllReaders();
        System.out.println("=== DANH SÁCH ĐỘC GIẢ ===");
        if (readers.isEmpty()) {
            System.out.println("(Không có độc giả nào)");
        } else {
            for (Reader r : readers) {
                System.out.println(r);
            }
        }
    }

    // 3. Borrow books
    private static void borrowBookUI(LibraryService svc) throws SQLException {
        System.out.print("Nhập mã phiếu mượn (loanId): ");
        String loanId = sc.nextLine().trim();

        System.out.print("Nhập mã sách (bookId): ");
        String bookId = sc.nextLine().trim();

        System.out.print("Nhập mã độc giả (readerId): ");
        String readerId = sc.nextLine().trim();

        try {
            Loan loan = svc.borrowLoan(loanId, bookId, readerId);
            System.out.println("Mượn sách thành công:");
            System.out.println(loan);
        } catch (IllegalArgumentException | IllegalStateException e) {
            System.out.println("Không thể mượn: " + e.getMessage());
        }
    }

    // 4. Return book
    private static void returnBookUI(LibraryService svc) throws SQLException {
        System.out.print("Nhập mã phiếu mượn (loanId) cần trả: ");
        String loanId = sc.nextLine().trim();

        boolean ok = svc.returnBook(loanId);
        if (ok) {
            System.out.println("Trả sách thành công.");
        } else {
            System.out.println("Không trả được sách.");
        }
    }

    // 5. Print the list of loan
    private static void listLoans(LibraryService svc) throws SQLException {
        List<Loan> loans = svc.getAllLoans();
        System.out.println("=== DANH SÁCH PHIẾU MƯỢN ===");
        if (loans.isEmpty()) {
            System.out.println("(Chưa có phiếu mượn nào)");
        } else {
            for (Loan l : loans) {
                System.out.println(l);
            }
        }
    }

    // 6. Tìm kiếm sách theo tên
    private static void searchBookByTitleUI(LibraryService svc) throws SQLException {
        System.out.print("Nhập từ khóa tên sách: ");
        String keyword = sc.nextLine().trim();
        List<Book> books = svc.searchBookByTitle(keyword);
        System.out.println("=== KẾT QUẢ TÌM KIẾM THEO TÊN ===");
        if (books.isEmpty()) {
            System.out.println("(Không tìm thấy sách phù hợp)");
        } else {
            for (Book b : books) {
                System.out.println(b);
            }
        }
    }

    // 7. Tìm kiếm sách theo tác giả
    private static void searchBookByAuthorUI(LibraryService svc) throws SQLException {
        System.out.print("Nhập tên tác giả: ");
        String keyword = sc.nextLine().trim();
        List<Book> books = svc.searchBookByAuthor(keyword);
        System.out.println("=== KẾT QUẢ TÌM KIẾM THEO TÁC GIẢ ===");
        if (books.isEmpty()) {
            System.out.println("(Không tìm thấy sách phù hợp)");
        } else {
            for (Book b : books) {
                System.out.println(b);
            }
        }
    }

    // (Admin) List of book can loan
    private static void listAvailableBooksUI(LibraryService svc) throws SQLException {
        List<Book> books = svc.getAvailableBooks();
        System.out.println("=== SÁCH CÒN CÓ THỂ MƯỢN (available > 0) ===");
        if (books.isEmpty()) {
            System.out.println("(Không có sách nào còn có thể mượn)");
        } else {
            for (Book b : books) {
                System.out.println(b);
            }
        }
    }

    // (Admin) List of book in loan
    private static void listBorrowedBooksUI(LibraryService svc) throws SQLException {
        List<Book> books = svc.getBorrowedBooks();
        System.out.println("=== SÁCH ĐANG ĐƯỢC MƯỢN (available < total) ===");
        if (books.isEmpty()) {
            System.out.println("(Không có sách nào đang được mượn)");
        } else {
            for (Book b : books) {
                System.out.println(b);
            }
        }
    }

    // (Admin) List of  overdues loan
    private static void listOverdueLoansUI(LibraryService svc) throws SQLException {
        List<Loan> loans = svc.getOverdueLoans();
        System.out.println("=== DANH SÁCH PHIẾU MƯỢN QUÁ HẠN ===");
        if (loans.isEmpty()) {
            System.out.println("(Không có phiếu mượn quá hạn nào)");
        } else {
            for (Loan l : loans) {
                System.out.println(l);
            }
        }
    }
}
