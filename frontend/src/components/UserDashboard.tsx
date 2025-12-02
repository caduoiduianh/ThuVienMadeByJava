// src/components/UserDashboard.tsx

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
    borrowBook,
    returnBook,
    getBooks,
    Book,
    Loan,
} from "../api/LibraryApi";
import { CheckCircle, BookOpen, RotateCcw } from "lucide-react";

interface UserDashboardProps {
    currentUser?: {
        username: string;
        role: string;
    };
}

export function UserDashboard({ currentUser }: UserDashboardProps) {
    // --- state mượn sách ---
    const [name, setName] = useState(currentUser?.username ?? "");
    const [phone, setPhone] = useState("");
    const [bookQuery, setBookQuery] = useState("");
    const [borrowMsg, setBorrowMsg] = useState<string | null>(null);
    const [borrowLoading, setBorrowLoading] = useState(false);

    // --- state trả sách ---
    const [loanId, setLoanId] = useState("");
    const [returnMsg, setReturnMsg] = useState<string | null>(null);
    const [returnLoading, setReturnLoading] = useState(false);

    // --- danh sách sách từ backend ---
    const [books, setBooks] = useState<Book[]>([]);
    const [bookSearch, setBookSearch] = useState("");

    useEffect(() => {
        (async () => {
            try {
                const data = await getBooks();
                setBooks(data);
            } catch (e) {
                console.error("Không tải được danh sách sách:", e);
            }
        })();
    }, []);

    const visibleBooks = useMemo(() => {
        const kw = bookSearch.toLowerCase();
        return books.filter((b) => {
            if (!kw) return true;
            return (
                b.id.toLowerCase().includes(kw) ||
                b.title.toLowerCase().includes(kw) ||
                b.author.toLowerCase().includes(kw)
            );
        });
    }, [books, bookSearch]);

    // ====== handle mượn sách ======
    const handleBorrow = async (e: FormEvent) => {
        e.preventDefault();
        setBorrowMsg(null);

        if (!name.trim() || !phone.trim() || !bookQuery.trim()) {
            setBorrowMsg("Vui lòng nhập đầy đủ họ tên, số điện thoại và sách muốn mượn.");
            return;
        }

        try {
            setBorrowLoading(true);
            const loan: Loan = await borrowBook({
                name: name.trim(),
                phone: phone.trim(),
                bookQuery: bookQuery.trim(),
            });

            setBorrowMsg(
                `Mượn sách thành công. Mã phiếu: ${loan.id} – hạn trả: ${loan.dueDate}`
            );
            setBookQuery("");
        } catch (e: any) {
            console.error(e);
            setBorrowMsg(e.message ?? "Mượn sách thất bại, vui lòng thử lại.");
        } finally {
            setBorrowLoading(false);
        }
    };

    // ====== handle trả sách ======
    const handleReturn = async (e: FormEvent) => {
        e.preventDefault();
        setReturnMsg(null);

        if (!loanId.trim()) {
            setReturnMsg("Vui lòng nhập mã phiếu mượn.");
            return;
        }

        try {
            setReturnLoading(true);
            const ok = await returnBook({ loanId: loanId.trim() });
            if (!ok) {
                setReturnMsg("Không tìm thấy phiếu mượn hoặc phiếu đã được trả trước đó.");
            } else {
                setReturnMsg("Trả sách thành công. Cảm ơn bạn!");
            }
            setLoanId("");
        } catch (e: any) {
            console.error(e);
            setReturnMsg(e.message ?? "Có lỗi xảy ra khi trả sách.");
        } finally {
            setReturnLoading(false);
        }
    };

    // ====== chọn sách từ bảng cho nhanh ======
    const handleChooseBook = (book: Book) => {
        // dùng MÃ SÁCH để query cho chắc
        setBookQuery(book.id);
        setBorrowMsg(
            `Đã chọn sách "${book.title}" (Mã: ${book.id}). Bạn có thể bấm "Gửi yêu cầu mượn sách".`
        );
    };

    return (
        <div className="p-8 space-y-8">
            <div>
                <h2 className="text-2xl text-gray-900 mb-2">
                    Xin chào, bạn đọc{currentUser?.username ? ` ${currentUser.username}` : ""}.
                </h2>
                <p className="text-gray-600">
                    Bạn có thể thực hiện mượn và trả sách trực tiếp tại đây.
                </p>
            </div>

            {/* Khối mượn + trả */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Form mượn sách */}
                <Card>
                    <CardContent className="p-6 space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <BookOpen className="size-5 text-blue-600" />
                            <h3 className="text-lg font-semibold text-gray-900">
                                Mượn sách
                            </h3>
                        </div>

                        <form className="space-y-4" onSubmit={handleBorrow}>
                            <div>
                                <Label>Họ tên</Label>
                                <Input
                                    placeholder="Nhập họ tên"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <Label>Số điện thoại</Label>
                                <Input
                                    placeholder="Nhập số điện thoại"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <Label>
                                    Sách muốn mượn (có thể nhập tên, mã sách hoặc bấm chọn ở danh sách phía dưới)
                                </Label>
                                <Input
                                    placeholder="Ví dụ: Clean Code, B001..."
                                    value={bookQuery}
                                    onChange={(e) => setBookQuery(e.target.value)}
                                    required
                                />
                            </div>

                            {borrowMsg && (
                                <p className="text-sm text-blue-700 bg-blue-50 p-3 rounded-lg">
                                    {borrowMsg}
                                </p>
                            )}

                            <Button
                                type="submit"
                                disabled={borrowLoading}
                                className="w-full md:w-auto"
                            >
                                {borrowLoading ? "Đang gửi yêu cầu..." : "Gửi yêu cầu mượn sách"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Form trả sách */}
                <Card>
                    <CardContent className="p-6 space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <RotateCcw className="size-5 text-green-600" />
                            <h3 className="text-lg font-semibold text-gray-900">
                                Trả sách
                            </h3>
                        </div>

                        <form className="space-y-4" onSubmit={handleReturn}>
                            <div>
                                <Label>Mã phiếu mượn</Label>
                                <Input
                                    placeholder="Nhập mã phiếu, ví dụ: L001"
                                    value={loanId}
                                    onChange={(e) => setLoanId(e.target.value)}
                                    required
                                />
                            </div>

                            {returnMsg && (
                                <p className="text-sm text-green-700 bg-green-50 p-3 rounded-lg">
                                    {returnMsg}
                                </p>
                            )}

                            <Button
                                type="submit"
                                disabled={returnLoading}
                                className="w-full md:w-auto"
                            >
                                {returnLoading ? "Đang xử lý..." : "Xác nhận trả sách"}
                            </Button>
                        </form>

                        <p className="text-xs text-gray-500 mt-2">
                            Lưu ý: Mã phiếu mượn có thể xem trong phần quản lý của thủ thư (Admin)
                            hoặc trên giấy biên nhận.
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Danh sách sách trong thư viện */}
            <Card>
                <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                Danh sách sách hiện có trong thư viện
                            </h3>
                            <p className="text-gray-600 text-sm">
                                Bấm vào nút &quot;Chọn để mượn&quot; để hệ thống tự điền thông tin
                                sách lên form phía trên.
                            </p>
                        </div>
                        <div className="w-full md:w-64">
                            <Input
                                placeholder="Tìm theo mã, tên sách, tác giả..."
                                value={bookSearch}
                                onChange={(e) => setBookSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto border rounded-lg">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2 text-left">Mã sách</th>
                                <th className="px-4 py-2 text-left">Tên sách</th>
                                <th className="px-4 py-2 text-left">Tác giả</th>
                                <th className="px-4 py-2 text-left">Thể loại</th>
                                <th className="px-4 py-2 text-left">Có sẵn</th>
                                <th className="px-4 py-2 text-right">Hành động</th>
                            </tr>
                            </thead>
                            <tbody>
                            {visibleBooks.map((b) => (
                                <tr key={b.id} className="border-t">
                                    <td className="px-4 py-2">{b.id}</td>
                                    <td className="px-4 py-2">{b.title}</td>
                                    <td className="px-4 py-2">{b.author}</td>
                                    <td className="px-4 py-2">{b.category || "-"}</td>
                                    <td className="px-4 py-2">
                                        {b.available}/{b.quantity}
                                    </td>
                                    <td className="px-4 py-2 text-right">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleChooseBook(b)}
                                        >
                                            Chọn để mượn
                                        </Button>
                                    </td>
                                </tr>
                            ))}

                            {visibleBooks.length === 0 && (
                                <tr>
                                    <td
                                        className="px-4 py-4 text-center text-gray-500"
                                        colSpan={6}
                                    >
                                        Không có sách nào phù hợp với từ khóa tìm kiếm.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
