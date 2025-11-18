package DataBase;

import java.io.InputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.util.Properties;

public class Database {
    private static String URL, USER, PASS;

    static {
        try {
            Properties p = new Properties();

            // load db.properties from classpath
            ClassLoader cl = Thread.currentThread().getContextClassLoader();
            InputStream in = cl.getResourceAsStream("db.properties");
            if (in == null) in = Database.class.getResourceAsStream("/db.properties");
            if (in == null) throw new IllegalStateException("Không tìm thấy db.properties");

            p.load(in);

            // Select from key
            URL  = p.getProperty("db.url");
            USER = p.getProperty("db.user");
            PASS = p.getProperty("db.pass");

            if (URL == null || URL.trim().isEmpty())
                throw new IllegalStateException("Thiếu khóa 'db.url' trong db.properties");

            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (Exception e) {
            throw new RuntimeException("Load DB config failed", e);
        }
    }

    public static Connection getConnection() throws java.sql.SQLException {
        return DriverManager.getConnection(URL, USER, PASS);
    }
}
