package DataAccessObject;

import DataBase.Database;
import ModelLibrary.Book;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class BookObject {

    private Book map(ResultSet rs) throws SQLException {
        return new Book(
                rs.getString("id"),
                rs.getString("title"),
                rs.getString("author"),
                rs.getInt("total_copies"),
                rs.getInt("available_copies")
        );
    }

    // Take all books
    public List<Book> findAll() throws SQLException {
        String sql = "SELECT * FROM books ORDER BY id";
        try (Connection cn = Database.getConnection();
             PreparedStatement ps = cn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            List<Book> out = new ArrayList<>();
            while (rs.next()) out.add(map(rs));
            return out;
        }
    }

    // Search from id
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

    // Add
    public boolean insert(Book b) throws SQLException {
        String sql = "INSERT INTO books(id,title,author,total_copies,available_copies) " +
                "VALUES (?,?,?,?,?)";
        try (Connection cn = Database.getConnection();
             PreparedStatement ps = cn.prepareStatement(sql)) {
            ps.setString(1, b.getId());
            ps.setString(2, b.getTitle());
            ps.setString(3, b.getAuthor());
            ps.setInt(4, b.getTotalCopies());
            ps.setInt(5, b.getAvailableCopies());
            return ps.executeUpdate() == 1;
        }
    }

    // Update
    public boolean update(Book b) throws SQLException {
        String sql = "UPDATE books SET title=?, author=?, total_copies=?, available_copies=? WHERE id=?";
        try (Connection cn = Database.getConnection();
             PreparedStatement ps = cn.prepareStatement(sql)) {
            ps.setString(1, b.getTitle());
            ps.setString(2, b.getAuthor());
            ps.setInt(3, b.getTotalCopies());
            ps.setInt(4, b.getAvailableCopies());
            ps.setString(5, b.getId());
            return ps.executeUpdate() == 1;
        }
    }

    // Delete
    public boolean delete(String id) throws SQLException {
        String sql = "DELETE FROM books WHERE id=?";
        try (Connection cn = Database.getConnection();
             PreparedStatement ps = cn.prepareStatement(sql)) {
            ps.setString(1, id);
            return ps.executeUpdate() == 1;
        }
    }

    // Decrease 1 when loan a book
    public boolean decrementAvailable(String bookId) throws SQLException {
        String sql = "UPDATE books SET available_copies = available_copies - 1 " +
                "WHERE id=? AND available_copies > 0";
        try (Connection cn = Database.getConnection();
             PreparedStatement ps = cn.prepareStatement(sql)) {
            ps.setString(1, bookId);
            return ps.executeUpdate() == 1;
        }
    }

    // Search from book
    public List<Book> searchByTitle(String kw) throws SQLException {
        String sql = "SELECT * FROM books WHERE LOWER(title) LIKE LOWER(?) ORDER BY title";
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

    // Search from author
    public List<Book> searchByAuthor(String kw) throws SQLException {
        String sql = "SELECT * FROM books WHERE LOWER(author) LIKE LOWER(?) ORDER BY author";
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
    //Increase 1 when gave back book
    public boolean incrementAvailable(String bookId) throws SQLException {
        String sql = "update books set available_copies = available_copies + 1" +
                     " where id=? AND available_copies > 0";
        try (Connection cn = Database.getConnection();
             PreparedStatement ps = cn.prepareStatement(sql)) {
                ps.setString(1, bookId);
                return ps.executeUpdate() == 1;
        }
    }
}
