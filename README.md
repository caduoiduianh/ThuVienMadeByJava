# ThuVienMadeByJava

**Mô tả (VI):**  
Ứng dụng quản lý thư viện đơn giản viết bằng Java (console app & optional Web UI bằng Spring Boot).  
Hỗ trợ: quản lý sách, độc giả, phiếu mượn; chức năng mượn/trả; tìm kiếm; báo cáo cơ bản (dành cho admin).

**Description (EN):**  
Simple Library Management application written in Java (console app and optional Spring Boot Web UI).  
Features: books, readers, loans management; borrow/return flow; search; basic admin reports.

---

## Tính năng chính / Features
- Quản lý sách (CRUD) / Books (CRUD)  
- Quản lý độc giả (CRUD) / Readers (CRUD)  
- Tạo phiếu mượn, trả sách / Create loan, return book  
- Tìm kiếm theo tên sách / tác giả / Search by title / author  
- Thống kê cho Admin: sách còn mượn, sách đang được mượn, phiếu quá hạn / Admin reports

---

## Yêu cầu / Requirements
- Java 17+ (hoặc Java 21+)  
- Maven (hoặc dùng `./mvnw` wrapper có sẵn)  
- MySQL 8+ với database `librarydb` (xem SQL setup bên dưới)

---

## Cài đặt nhanh / Quick start

1. Clone repo:
```bash
git clone https://github.com/caduoiduianh/ThuVienMadeByJava.git
cd ThuVienMadeByJava

2: Cấu hình Database (chỉnh src/main/resources/db.properties)
db.url=jdbc:mysql://localhost:3306/librarydb?useSSL=false&serverTimezone=Asia/Ho_Chi_Minh&characterEncoding=utf8
db.user=library_user
db.pass=libpass123 (Hoặc theo mật khẩu root)

3: Tạo database & bảng ( Dùng MySQL):
CREATE DATABASE librarydb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE librarydb;

CREATE TABLE books (
  id VARCHAR(20) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  total_copies INT UNSIGNED NOT NULL,
  available_copies INT UNSIGNED NOT NULL
);

CREATE TABLE readers (
  id VARCHAR(20) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  max_loans INT UNSIGNED NOT NULL
);

CREATE TABLE loans (
  id VARCHAR(20) PRIMARY KEY,
  book_id VARCHAR(20) NOT NULL,
  reader_id VARCHAR(20) NOT NULL,
  loan_date DATE NOT NULL,
  due_date DATE NOT NULL,
  return_date DATE NULL,
  FOREIGN KEY (book_id) REFERENCES books(id),
  FOREIGN KEY (reader_id) REFERENCES readers(id)
);

4: Build & run: 
./mvnw clean package

Hoặc sử dụng:

./mvnw spring-boot:run ( nếu muốn chạy trên web )
Và truy cập http://localhost:8080


Cấu trúc dự án: 
src/main/java/
  DataBase/        # Database connection, DBTest
  DataAccessObject/ # BookObject, ReaderObject, LoanObject
  ModelLibrary/    # Book, Reader, Loan models
  Service/         # LibraryService (business logic)
  UserInterface/   # App (console UI)
  Web/              # Spring controllers
src/main/resources/
  db.properties
pom.xml

Tài khoản của Admin: 
username: admin
password: admin123 
Chú ý: Tài khoản admin chỉ dùng được hiện tại trong App.java và dùng app code như Intellij IEDA hoặc Visual Studio Code.


Ghi chú:
Kiểm tra db.properties để map connection; tránh commit mật khẩu công khai (nên dùng .env / secrets khi deploy).
Nếu cần deploy lên VPS: đóng gói jar (Spring Boot) hoặc deploy war; cấu hình MySQL remote/đám mây.