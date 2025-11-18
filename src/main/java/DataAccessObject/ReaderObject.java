package DataAccessObject;

import DataBase.Database;
import ModelLibrary.Reader;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class ReaderObject {
    private Reader map(ResultSet rs) throws SQLException {
        return new Reader(
                rs.getString("id"),
                rs.getString("name"),
                rs.getInt("max_loans")
        );
    }
    // Find from id
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

    // Add new reader
    public boolean insert(Reader r) throws SQLException {
        String sql = "insert into readers(id, name, max_loans) values(?, ?, ?)";
        try (Connection cn = Database.getConnection();
             PreparedStatement ps = cn.prepareStatement(sql)){
            ps.setString(1, r.getId());
            ps.setString(2, r.getName());
            ps.setInt(3, r.getMaxLoans());
            return ps.executeUpdate() == 1;
        }
    }
    //Update reader
    public boolean update(Reader r) throws SQLException {
        String sql = "update readers set name = ?, max_loans = ? where id = ?";
        try (Connection cn = Database.getConnection();
             PreparedStatement ps = cn.prepareStatement(sql)){
            ps.setString(1, r.getName());
            ps.setInt(2, r.getMaxLoans());
            ps.setString(3, r.getId());
            return ps.executeUpdate() == 1;
        }
    }
    // Delete reader
    public boolean delete(String Id) throws SQLException {
        String sql = "delete from readers where id = ?";
        try (Connection cn = Database.getConnection();
             PreparedStatement ps = cn.prepareStatement(sql)){
            ps.setString(1, Id);
            return ps.executeUpdate() == 1;
        }
    }
    //Count the numbers of reader loaning (not getting back)
    public int countActiveLoans(String readerId) throws SQLException {
        // Count from Table loans
        String sql = "select count(*) from loans where reader_id = ? and return_date is null";
        try (Connection cn = Database.getConnection();
             PreparedStatement ps = cn.prepareStatement(sql)){
            ps.setString(1, readerId);
            try (ResultSet rs = ps.executeQuery()){
                rs.next();
                return rs.getInt(1);
            }
        }
    }
    //LibraryService Called
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

}
