package Util;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

//Set the date on: dd/mm/yyyy
public final class Date{
    private Date(){}

    public static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    public static LocalDate parseDate(String text){
        if ( text == null ) {
            return null;
        }
        try {
            return LocalDate.parse(text.trim(), DATE_FORMAT);
        }
        catch (DateTimeParseException e){
            throw new IllegalArgumentException("Định dạng ngày tháng năm không chính xác. Giá trị: " + text, e);
        }
    }
    public static String format(LocalDate date) {
        return date == null ? "" : date.format(DATE_FORMAT);
    }

    public static LocalDate fromSqlDate(java.sql.Date d) {
        return d == null ? null : d.toLocalDate();
    }

    public static java.sql.Date toSqlDate(LocalDate d) {
        return d == null ? null : java.sql.Date.valueOf(d);
    }
}
