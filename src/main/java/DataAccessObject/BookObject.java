package DataAccessObject;

import DataBase.Database;
import ModelLibrary.Book;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class BookObject {

    // Map 1 hàng từ ResultSet -> Book (đọc luôn category + isbn)
    private Book map(ResultSet rs) throws SQLException {
        Book b = new Book();

        b.setId(rs.getString("id"));
        b.setTitle(rs.getString("title"));
        b.setAuthor(rs.getString("author"));

        // 👇 2 cột mới trong DB
        b.setCategory(rs.getString("category"));
        b.setIsbn(rs.getString("isbn"));

        b.setTotalCopies(rs.getInt("total_copies"));
        b.setAvailableCopies(rs.getInt("available_copies"));

        return b;
    }

    // Lấy tất cả sách
    public List<Book> findAll() throws SQLException {
        String sql = "SELECT * FROM books ORDER BY id";
        try (Connection cn = Database.getConnection();
             PreparedStatement ps = cn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            List<Book> out = new ArrayList<>();
            while (rs.next()) {
                out.add(map(rs));
            }
            return out;
        }
    }

    // Lấy 1 sách theo id
    public Book findById(String id) throws SQLException {
        String sql = "SELECT * FROM books WHERE id = ?";
        try (Connection cn = Database.getConnection();
             PreparedStatement ps = cn.prepareStatement(sql)) {

            ps.setString(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() ? map(rs) : null;
            }
        }
    }

    // Thêm sách
    public boolean insert(Book b) throws SQLException {
        String sql = "INSERT INTO books(" +
                "id, title, author, category, isbn, total_copies, available_copies" +
                ") VALUES(?,?,?,?,?,?,?)";
        try (Connection cn = Database.getConnection();
             PreparedStatement ps = cn.prepareStatement(sql)) {

            ps.setString(1, b.getId());
            ps.setString(2, b.getTitle());
            ps.setString(3, b.getAuthor());
            ps.setString(4, b.getCategory());
            ps.setString(5, b.getIsbn());
            ps.setInt(6, b.getTotalCopies());
            ps.setInt(7, b.getAvailableCopies());

            return ps.executeUpdate() == 1;
        }
    }

    // Cập nhật sách
    public boolean update(Book b) throws SQLException {
        String sql = "UPDATE books SET " +
                "title = ?, " +
                "author = ?, " +
                "category = ?, " +
                "isbn = ?, " +
                "total_copies = ?, " +
                "available_copies = ? " +
                "WHERE id = ?";
        try (Connection cn = Database.getConnection();
             PreparedStatement ps = cn.prepareStatement(sql)) {

            ps.setString(1, b.getTitle());
            ps.setString(2, b.getAuthor());
            ps.setString(3, b.getCategory());
            ps.setString(4, b.getIsbn());
            ps.setInt(5, b.getTotalCopies());
            ps.setInt(6, b.getAvailableCopies());
            ps.setString(7, b.getId());

            return ps.executeUpdate() == 1;
        }
    }

    // Xóa sách
    public boolean delete(String id) throws SQLException {
        String sql = "DELETE FROM books WHERE id=?";
        try (Connection cn = Database.getConnection();
             PreparedStatement ps = cn.prepareStatement(sql)) {

            ps.setString(1, id);
            return ps.executeUpdate() == 1;
        }
    }

    // Giảm available_copies khi mượn
    public boolean decrementAvailable(String bookId) throws SQLException {
        String sql = "UPDATE books " +
                "SET available_copies = available_copies - 1 " +
                "WHERE id = ? AND available_copies > 0";
        try (Connection cn = Database.getConnection();
             PreparedStatement ps = cn.prepareStatement(sql)) {

            ps.setString(1, bookId);
            return ps.executeUpdate() == 1;
        }
    }

    // Tăng available_copies khi trả
    public boolean incrementAvailable(String bookId) throws SQLException {
        String sql = "UPDATE books " +
                "SET available_copies = available_copies + 1 " +
                "WHERE id = ? AND available_copies < total_copies";
        try (Connection cn = Database.getConnection();
             PreparedStatement ps = cn.prepareStatement(sql)) {

            ps.setString(1, bookId);
            return ps.executeUpdate() == 1;
        }
    }

    // Tìm theo tên sách
    public List<Book> searchByTitle(String kw) throws SQLException {
        String sql = "SELECT * FROM books " +
                "WHERE LOWER(title) LIKE LOWER(?) " +
                "ORDER BY title";
        try (Connection cn = Database.getConnection();
             PreparedStatement ps = cn.prepareStatement(sql)) {

            ps.setString(1, "%" + kw + "%");
            try (ResultSet rs = ps.executeQuery()) {
                List<Book> out = new ArrayList<>();
                while (rs.next()) out.add(map(rs));
                return out;
            }
        }
    }

    // Tìm theo tác giả
    public List<Book> searchByAuthor(String kw) throws SQLException {
        String sql = "SELECT * FROM books " +
                "WHERE LOWER(author) LIKE LOWER(?) " +
                "ORDER BY author";
        try (Connection cn = Database.getConnection();
             PreparedStatement ps = cn.prepareStatement(sql)) {

            ps.setString(1, "%" + kw + "%");
            try (ResultSet rs = ps.executeQuery()) {
                List<Book> out = new ArrayList<>();
                while (rs.next()) out.add(map(rs));
                return out;
            }
        }
    }
}
