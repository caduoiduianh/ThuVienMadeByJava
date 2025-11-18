package DataAccessObject;

import DataBase.Database;
import ModelLibrary.Loan;
import java.sql.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class LoanObject {

    // Load Map to Loan
    private Loan map(ResultSet rs) throws SQLException {
        String id = rs.getString("id");
        String bookId = rs.getString("book_id");
        String readerId = rs.getString("reader_id");

        Date loan = rs.getDate("loan_date");
        Date due  = rs.getDate("due_date");
        Date ret  = rs.getDate("return_date");

        LocalDate loanDate = loan.toLocalDate();
        LocalDate dueDate  = due.toLocalDate();
        LocalDate returnDate = (ret == null) ? null : ret.toLocalDate();

        return new Loan(id, bookId, readerId, loanDate, dueDate, returnDate);
    }

    // Select all loan
    public List<Loan> findAll() throws SQLException {
        String sql = "SELECT * FROM loans ORDER BY id";
        try (Connection cn = Database.getConnection();
             PreparedStatement ps = cn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            List<Loan> out = new ArrayList<>();
            while (rs.next()) {
                out.add(map(rs));
            }
            return out;
        }
    }

    // Find loan from id
    public Loan findById(String id) throws SQLException {
        String sql = "SELECT * FROM loans WHERE id = ?";
        try (Connection cn = Database.getConnection();
             PreparedStatement ps = cn.prepareStatement(sql)) {

            ps.setString(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() ? map(rs) : null;
            }
        }
    }

    // Find all loan of a reader
    public List<Loan> findByReader(String readerId) throws SQLException {
        String sql = "SELECT * FROM loans WHERE reader_id = ? ORDER BY loan_date DESC";
        try (Connection cn = Database.getConnection();
             PreparedStatement ps = cn.prepareStatement(sql)) {

            ps.setString(1, readerId);
            try (ResultSet rs = ps.executeQuery()) {
                List<Loan> out = new ArrayList<>();
                while (rs.next()) out.add(map(rs));
                return out;
            }
        }
    }

    // Reader's loan (1 reader not getting back)
    public List<Loan> findActiveByReader(String readerId) throws SQLException {
        String sql = "SELECT * FROM loans WHERE reader_id = ? AND return_date IS NULL ORDER BY loan_date DESC";
        try (Connection cn = Database.getConnection();
             PreparedStatement ps = cn.prepareStatement(sql)) {

            ps.setString(1, readerId);
            try (ResultSet rs = ps.executeQuery()) {
                List<Loan> out = new ArrayList<>();
                while (rs.next()) out.add(map(rs));
                return out;
            }
        }
    }

    // out dated loans
    public List<Loan> findOverdue(LocalDate today) throws SQLException {
        String sql = "SELECT * FROM loans WHERE due_date < ? AND return_date IS NULL ORDER BY due_date";
        try (Connection cn = Database.getConnection();
             PreparedStatement ps = cn.prepareStatement(sql)) {

            ps.setDate(1, Date.valueOf(today));
            try (ResultSet rs = ps.executeQuery()) {
                List<Loan> out = new ArrayList<>();
                while (rs.next()) out.add(map(rs));
                return out;
            }
        }
    }

    // New loan
    public boolean insert(Loan l) throws SQLException {
        String sql = "INSERT INTO loans(id, book_id, reader_id, loan_date, due_date, return_date) " +
                "VALUES (?,?,?,?,?,?)";
        try (Connection cn = Database.getConnection();
             PreparedStatement ps = cn.prepareStatement(sql)) {

            ps.setString(1, l.getId());
            ps.setString(2, l.getBookId());
            ps.setString(3, l.getReaderId());
            ps.setDate(4, Date.valueOf(l.getLoanDate()));
            ps.setDate(5, Date.valueOf(l.getDueDate()));
            // returnDate có thể null
            if (l.getReturnDate() == null) {
                ps.setNull(6, Types.DATE);
            } else {
                ps.setDate(6, Date.valueOf(l.getReturnDate()));
            }

            return ps.executeUpdate() == 1;
        }
    }

    // Loan remove ( return_date)
    public boolean markReturned(String loanId, LocalDate returnDate) throws SQLException {
        String sql = "UPDATE loans SET return_date = ? WHERE id = ? AND return_date IS NULL";
        try (Connection cn = Database.getConnection();
             PreparedStatement ps = cn.prepareStatement(sql)) {

            ps.setDate(1, Date.valueOf(returnDate));
            ps.setString(2, loanId);
            return ps.executeUpdate() == 1;
        }
    }

    // Delete a loan
    public boolean delete(String id) throws SQLException {
        String sql = "DELETE FROM loans WHERE id = ?";
        try (Connection cn = Database.getConnection();
             PreparedStatement ps = cn.prepareStatement(sql)) {

            ps.setString(1, id);
            return ps.executeUpdate() == 1;
        }
    }
}
