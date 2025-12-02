// src/components/BorrowingManagement.tsx

import { useEffect, useMemo, useState, FormEvent } from "react";
import { Button } from "./ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Plus, Search, CheckCircle, AlertTriangle, Clock } from "lucide-react";
import {
    getLoans,
    getBooks,
    getReaders,
    returnBook,
    Loan,
    Book,
    Reader,
} from "../api/LibraryApi";

type BorrowRecord = {
    id: string; // mã phiếu
    memberId: string;
    memberName: string;
    phone: string;
    bookTitle: string;
    borrowDate: string;
    dueDate: string;
    returnDate: string | null;
    status: "borrowed" | "returned" | "overdue";
    daysRemaining?: number;
};

export function BorrowingManagement() {
    const [records, setRecords] = useState<BorrowRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState<
        "all" | "borrowed" | "overdue" | "returned"
    >("all");

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [formData, setFormData] = useState({
        memberName: "",
        bookTitle: "",
    });

    // ===== Lấy loans + books + readers từ backend =====
    useEffect(() => {
        (async () => {
            try {
                setLoading(true);

                const [loans, books, readers] = await Promise.all([
                    getLoans(),
                    getBooks(),
                    getReaders(),
                ]);

                const bookMap = new Map<string, Book>(books.map((b) => [b.id, b]));
                const readerMap = new Map<string, Reader>(
                    readers.map((r) => [r.id, r])
                );

                const now = new Date();

                const mapped: BorrowRecord[] = loans.map((l: Loan) => {
                    const memberId = l.readerId || l.memberCode || "";
                    const reader = memberId ? readerMap.get(memberId) : undefined;
                    const book = l.bookId ? bookMap.get(l.bookId) : undefined;

                    const due = l.dueDate ? new Date(l.dueDate) : null;
                    let daysRemaining: number | undefined;
                    if (due && !isNaN(due.getTime())) {
                        const diffMs = due.getTime() - now.getTime();
                        daysRemaining = Math.round(diffMs / (1000 * 60 * 60 * 24));
                    }

                    let status: BorrowRecord["status"] = "borrowed";
                    const s = (l.status ?? "").toString().toLowerCase();
                    if (s === "returned") status = "returned";
                    else if (s === "overdue") status = "overdue";
                    else {
                        if (l.returnDate) status = "returned";
                        else if (typeof daysRemaining === "number" && daysRemaining < 0)
                            status = "overdue";
                    }

                    return {
                        id: l.id,
                        memberId,
                        memberName: reader?.name || l.memberName || "(Không rõ)",
                        phone: reader?.phone || l.borrowerPhone || "",
                        bookTitle: book?.title || l.bookTitle || "(Không rõ)",
                        borrowDate: l.borrowDate,
                        dueDate: l.dueDate,
                        returnDate: l.returnDate ?? null,
                        status,
                        daysRemaining,
                    };
                });

                setRecords(mapped);
            } catch (e: any) {
                console.error(e);
                setError(e.message ?? "Không tải được dữ liệu mượn trả từ server.");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    // ===== Thống kê =====
    const stats = useMemo(() => {
        const totalBorrowed = records.filter(
            (r) => r.status === "borrowed"
        ).length;
        const totalOverdue = records.filter((r) => r.status === "overdue").length;
        const totalReturned = records.filter(
            (r) => r.status === "returned"
        ).length;
        const dueSoon = records.filter(
            (r) =>
                r.status === "borrowed" &&
                typeof r.daysRemaining === "number" &&
                r.daysRemaining <= 3 &&
                r.daysRemaining >= 0
        ).length;
        return { totalBorrowed, totalOverdue, totalReturned, dueSoon };
    }, [records]);

    // ===== Lọc =====
    const filteredRecords = records.filter((record) => {
        const keyword = searchTerm.toLowerCase();
        const matchesSearch =
            record.id.toLowerCase().includes(keyword) ||
            record.memberName.toLowerCase().includes(keyword) ||
            record.memberId.toLowerCase().includes(keyword) ||
            record.bookTitle.toLowerCase().includes(keyword) ||
            record.phone.toLowerCase().includes(keyword);

        const matchesFilter =
            filterStatus === "all" || record.status === filterStatus;

        return matchesSearch && matchesFilter;
    });

    // ===== Form demo "Cho mượn sách" (giữ nguyên cho đẹp giao diện) =====
    const handleCreateLoan = (e: FormEvent) => {
        e.preventDefault();
        setIsDialogOpen(false);
        setFormData({ memberName: "", bookTitle: "" });
    };

    // ===== Xác nhận trả từ phía admin =====
    const handleReturn = async (record: BorrowRecord) => {
        if (record.status === "returned") return;

        try {
            const ok = await returnBook({ loanId: record.id });
            if (!ok) {
                alert("Trả sách thất bại hoặc phiếu đã được trả.");
                return;
            }

            const today = new Date().toISOString().slice(0, 10);
            setRecords((prev) =>
                prev.map((r) =>
                    r.id === record.id
                        ? {
                            ...r,
                            status: "returned",
                            returnDate: today,
                        }
                        : r
                )
            );
        } catch (e) {
            console.error(e);
            alert("Có lỗi xảy ra khi xác nhận trả sách.");
        }
    };

    const getStatusBadge = (
        status: BorrowRecord["status"],
        daysRemaining?: number
    ) => {
        switch (status) {
            case "borrowed":
                if (typeof daysRemaining === "number" && daysRemaining <= 3) {
                    return (
                        <Badge className="bg-orange-50 text-orange-700 hover:bg-orange-50">
                            Sắp hết hạn
                        </Badge>
                    );
                }
                return (
                    <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-50">
                        Đang mượn
                    </Badge>
                );
            case "returned":
                return (
                    <Badge className="bg-green-50 text-green-700 hover:bg-green-50">
                        Đã trả
                    </Badge>
                );
            case "overdue":
                return <Badge variant="destructive">Quá hạn</Badge>;
        }
    };

    if (loading) {
        return <div className="p-8">Đang tải danh sách mượn trả...</div>;
    }

    if (error) {
        return <div className="p-8 text-red-600">Lỗi: {error}</div>;
    }

    return (
        <div className="p-8">
            <div className="mb-8">
                <h2 className="text-2xl text-gray-900 mb-2">Quản lý mượn/trả sách</h2>
                <p className="text-gray-600">Theo dõi và quản lý việc mượn trả sách</p>
            </div>

            {/* Cards thống kê */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Đang mượn</p>
                                <p className="text-3xl text-gray-900">
                                    {stats.totalBorrowed}
                                </p>
                            </div>
                            <div className="bg-blue-50 p-3 rounded-lg">
                                <Clock className="size-6 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Quá hạn</p>
                                <p className="text-3xl text-gray-900">
                                    {stats.totalOverdue}
                                </p>
                            </div>
                            <div className="bg-red-50 p-3 rounded-lg">
                                <AlertTriangle className="size-6 text-red-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Sắp hết hạn</p>
                                <p className="text-3xl text-gray-900">{stats.dueSoon}</p>
                            </div>
                            <div className="bg-orange-50 p-3 rounded-lg">
                                <Clock className="size-6 text-orange-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Đã trả</p>
                                <p className="text-3xl text-gray-900">
                                    {stats.totalReturned}
                                </p>
                            </div>
                            <div className="bg-green-50 p-3 rounded-lg">
                                <CheckCircle className="size-6 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search + filter + dialog */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                    <Input
                        placeholder="Tìm theo mã phiếu, tên thành viên, mã thành viên, số điện thoại, tên sách..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>

                <div className="flex gap-2">
                    <select
                        value={filterStatus}
                        onChange={(e) =>
                            setFilterStatus(e.target.value as typeof filterStatus)
                        }
                        className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                        <option value="all">Tất cả</option>
                        <option value="borrowed">Đang mượn</option>
                        <option value="overdue">Quá hạn</option>
                        <option value="returned">Đã trả</option>
                    </select>

                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="gap-2 whitespace-nowrap">
                                <Plus className="size-4" />
                                Cho mượn sách
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Cho mượn sách mới (demo)</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleCreateLoan} className="space-y-4">
                                <div>
                                    <Label htmlFor="memberName">Tên thành viên</Label>
                                    <Input
                                        id="memberName"
                                        value={formData.memberName}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                memberName: e.target.value,
                                            })
                                        }
                                        placeholder="Nhập tên thành viên"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="bookTitle">Tên sách</Label>
                                    <Input
                                        id="bookTitle"
                                        value={formData.bookTitle}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                bookTitle: e.target.value,
                                            })
                                        }
                                        placeholder="Nhập tên sách"
                                        required
                                    />
                                </div>
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <p className="text-sm text-blue-900">
                                        Đây là form demo cho giao diện. Phiếu mượn thật được tạo
                                        từ phía người dùng ở màn “Thành viên”.
                                    </p>
                                </div>
                                <div className="flex justify-end gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsDialogOpen(false)}
                                    >
                                        Đóng
                                    </Button>
                                    <Button type="submit">OK</Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Bảng mượn trả */}
            <div className="bg-white rounded-lg border border-gray-200">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Mã phiếu</TableHead>
                            <TableHead>Mã TV</TableHead>
                            <TableHead>Thành viên</TableHead>
                            <TableHead>Số ĐT</TableHead>
                            <TableHead>Tên sách</TableHead>
                            <TableHead>Ngày mượn</TableHead>
                            <TableHead>Hạn trả</TableHead>
                            <TableHead>Ngày trả</TableHead>
                            <TableHead>Còn lại</TableHead>
                            <TableHead>Trạng thái</TableHead>
                            <TableHead className="text-right">Thao tác</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredRecords.map((record) => (
                            <TableRow key={record.id}>
                                {/* Mã phiếu */}
                                <TableCell>
                                    <span className="text-blue-600">{record.id}</span>
                                </TableCell>

                                {/* Mã TV */}
                                <TableCell>{record.memberId}</TableCell>

                                {/* Tên thành viên */}
                                <TableCell>{record.memberName}</TableCell>

                                {/* Số ĐT */}
                                <TableCell>{record.phone || "-"}</TableCell>

                                {/* Tên sách */}
                                <TableCell>{record.bookTitle}</TableCell>

                                {/* Ngày mượn / hạn trả / ngày trả */}
                                <TableCell>{record.borrowDate}</TableCell>
                                <TableCell>{record.dueDate}</TableCell>
                                <TableCell>{record.returnDate || "-"}</TableCell>

                                {/* Còn lại */}
                                <TableCell>
                                    {record.status !== "returned" &&
                                        typeof record.daysRemaining === "number" && (
                                            <span
                                                className={
                                                    record.daysRemaining < 0
                                                        ? "text-red-600"
                                                        : record.daysRemaining <= 3
                                                            ? "text-orange-600"
                                                            : "text-gray-600"
                                                }
                                            >
                        {record.daysRemaining < 0
                            ? `Quá ${Math.abs(record.daysRemaining)} ngày`
                            : `${record.daysRemaining} ngày`}
                      </span>
                                        )}
                                </TableCell>

                                {/* Trạng thái */}
                                <TableCell>
                                    {getStatusBadge(record.status, record.daysRemaining)}
                                </TableCell>

                                {/* Thao tác */}
                                <TableCell className="text-right">
                                    {record.status !== "returned" && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleReturn(record)}
                                            className="gap-2"
                                        >
                                            <CheckCircle className="size-4 text-green-600" />
                                            Xác nhận trả
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}

                        {filteredRecords.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={11} className="text-center py-6">
                                    Không có bản ghi phù hợp.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
