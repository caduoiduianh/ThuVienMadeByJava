package Web.dto;

public class RecentActivity {
    private String id;
    private String member;
    private String book;
    private String action; // "Mượn sách" hoặc "Đã trả"
    private String date;

    public RecentActivity(String id, String member, String book, String action, String date) {
        this.id = id;
        this.member = member;
        this.book = book;
        this.action = action;
        this.date = date;
    }

    // Getters
    public String getId() { return id; }
    public String getMember() { return member; }
    public String getBook() { return book; }
    public String getAction() { return action; }
    public String getDate() { return date; }
}