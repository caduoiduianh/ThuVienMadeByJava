package ModelLibrary;

public class Reader {
    private String id;
    private String name;
    private int maxLoans;

    public Reader() {}
    public Reader(String id, String name, int maxLoans) {
        this.id = id;
        this.name = name;
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

    public int getMaxLoans() {
        return maxLoans;
    }
    public void setMaxLoans(int maxLoans) {
        this.maxLoans = maxLoans;
    }

    public String toString() {
        return id + " | " + name + " | " + maxLoans;
    }
}