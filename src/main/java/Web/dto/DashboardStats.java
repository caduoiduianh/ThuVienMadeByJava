package Web.dto;

import java.util.List;

public class DashboardStats {
    private int totalBooks;
    private int totalMembers;
    private int borrowing;
    private int overdue;
    
    // Thêm dòng này để chứa danh sách hoạt động
    private List<RecentActivity> recentActivities;

    public DashboardStats(int totalBooks, int totalMembers, int borrowing, int overdue, List<RecentActivity> recentActivities) {
        this.totalBooks = totalBooks;
        this.totalMembers = totalMembers;
        this.borrowing = borrowing;
        this.overdue = overdue;
        this.recentActivities = recentActivities;
    }

    // Getters
    public int getTotalBooks() { return totalBooks; }
    public int getTotalMembers() { return totalMembers; }
    public int getBorrowing() { return borrowing; }
    public int getOverdue() { return overdue; }
    public List<RecentActivity> getRecentActivities() { return recentActivities; }
}