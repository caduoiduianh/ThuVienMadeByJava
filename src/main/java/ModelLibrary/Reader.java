package ModelLibrary;

public class Reader {
    private String id;
    private String name;
    private String phone;    // NEW
    private int maxLoans;

    public Reader(String id, String name, int maxLoans) {
        this(id, name, null, maxLoans);
    }

    public Reader(String id, String name, String phone, int maxLoans) {
        this.id = id;
        this.name = name;
        this.phone = phone;
        this.maxLoans = maxLoans;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public int getMaxLoans() {
        return maxLoans;
    }

    public void setMaxLoans(int maxLoans) {
        this.maxLoans = maxLoans;
    }

    @Override
    public String toString() {
        return String.format("%s | %s | %s | %d",
                id, name, phone == null ? "" : phone, maxLoans);
    }
}
