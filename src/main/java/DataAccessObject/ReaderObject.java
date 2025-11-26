package DataAccessObject;

import DataBase.Database;
import ModelLibrary.Reader;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class ReaderObject {

    private Reader map(ResultSet rs) throws SQLException {
        return new Reader(
                rs.getString("id"),
                rs.getString("name"),
                rs.getString("phone"),      // NEW
                rs.getInt("max_loans")
        );
    }


    // Lấy tất cả độc giả
    public List<Reader> findAll() throws SQLException {
        String sql = "SELECT * FROM readers ORDER BY id";
        try (Connection cn = Database.getConnection();
             PreparedStatement ps = cn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            List<Reader> out = new ArrayList<>();
            while (rs.next()) {
                out.add(map(rs));
            }
            return out;
        }
    }

    // Tìm theo id
    public Reader findById(String id) throws SQLException {
        String sql = "SELECT * FROM readers WHERE id = ?";
        try (Connection cn = Database.getConnection();
             PreparedStatement ps = cn.prepareStatement(sql)) {

            ps.setString(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() ? map(rs) : null;
            }
        }
    }

    // Tìm theo phone (dùng cho web mượn sách)
    public Reader findByPhone(String phone) throws SQLException {
        String sql = "SELECT * FROM readers WHERE phone = ?";
        try (Connection cn = Database.getConnection();
             PreparedStatement ps = cn.prepareStatement(sql)) {

            ps.setString(1, phone);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() ? map(rs) : null;
            }
        }
    }

    // Tìm theo tên + phone (dùng cho trả sách)
    // Tìm 1 reader theo tên + phone (giả sử cặp này là duy nhất)
    public Reader findByNameAndPhone(String name, String phone) throws SQLException {
        String sql = "SELECT * FROM readers WHERE name = ? AND phone = ?";

        try (Connection cn = Database.getConnection();
             PreparedStatement ps = cn.prepareStatement(sql)) {

            ps.setString(1, name);
            ps.setString(2, phone);

            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() ? map(rs) : null;
            }
        }
    }

    // Thêm độc giả
    public boolean insert(Reader r) throws SQLException {
        String sql = "INSERT INTO readers(id, name, phone, max_loans) VALUES(?, ?, ?, ?)";
        try (Connection cn = Database.getConnection();
             PreparedStatement ps = cn.prepareStatement(sql)) {
            ps.setString(1, r.getId());
            ps.setString(2, r.getName());
            ps.setString(3, r.getPhone());
            ps.setInt(4, r.getMaxLoans());
            return ps.executeUpdate() == 1;
        }
    }


    // Cập nhật
    public boolean update(Reader r) throws SQLException {
        String sql = "UPDATE readers SET name = ?, phone = ?, max_loans = ? WHERE id = ?";
        try (Connection cn = Database.getConnection();
             PreparedStatement ps = cn.prepareStatement(sql)) {
            ps.setString(1, r.getName());
            ps.setString(2, r.getPhone());
            ps.setInt(3, r.getMaxLoans());
            ps.setString(4, r.getId());
            return ps.executeUpdate() == 1;
        }
    }


    // Xóa
    public boolean delete(String id) throws SQLException {
        String sql = "DELETE FROM readers WHERE id = ?";
        try (Connection cn = Database.getConnection();
             PreparedStatement ps = cn.prepareStatement(sql)) {
            ps.setString(1, id);
            return ps.executeUpdate() == 1;
        }
    }

    // Đếm số phiếu mượn chưa trả
    public int countActiveLoans(String readerId) throws SQLException {
        String sql = "SELECT COUNT(*) " +
                "FROM loans " +
                "WHERE reader_id = ? AND return_date IS NULL";
        try (Connection cn = Database.getConnection();
             PreparedStatement ps = cn.prepareStatement(sql)) {
            ps.setString(1, readerId);
            try (ResultSet rs = ps.executeQuery()) {
                rs.next();
                return rs.getInt(1);
            }
        }
    }

}
