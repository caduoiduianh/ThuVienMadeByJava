package Util;

public final class Validation {

    private Validation() {
        // chặn khởi tạo
    }

    //true if String is null or only space
    public static boolean isNullOrBlank(String s) {
        return s == null || s.trim().isEmpty();
    }

    //The string must not Blank, if blank send IllegalArgumentException
    public static void requireNotBlank(String s, String fieldName) {
        if (isNullOrBlank(s)) {
            throw new IllegalArgumentException(fieldName + " không được để trống.");
        }
    }

    //Limit the string, send IllegalArgumentException if the String higher
    public static void requireMaxLength(String s, int max, String fieldName) {
        if (s != null && s.length() > max) {
            throw new IllegalArgumentException(
                    fieldName + " không được dài quá " + max + " ký tự.");
        }
    }

    // Int must >= 0
    public static void requireNonNegative(int value, String fieldName) {
        if (value < 0) {
            throw new IllegalArgumentException(fieldName + " không được âm.");
        }
    }

    //Int must > 0
    public static void requirePositive(int value, String fieldName) {
        if (value <= 0) {
            throw new IllegalArgumentException(fieldName + " phải lớn hơn 0.");
        }
    }
}