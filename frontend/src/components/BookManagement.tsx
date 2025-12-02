// src/components/BookManagement.tsx

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
import { Plus, Search, Edit, Trash2, BookOpen } from "lucide-react";
import {
    getBooks,
    Book,
    BookPayload,
    createBook,
    updateBookApi,
    deleteBookApi,
} from "../api/LibraryApi";

export function BookManagement() {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [searchTerm, setSearchTerm] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingBook, setEditingBook] = useState<Book | null>(null);

    const [formData, setFormData] = useState<BookPayload>({
        id: "",
        title: "",
        author: "",
        category: "",
        isbn: "",
        quantity: 1,
        available: 1,
    });

    // ===== load sách từ backend =====
    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const data = await getBooks();
                setBooks(data);
            } catch (e: any) {
                console.error(e);
                setError(e.message ?? "Không tải được danh sách sách từ server.");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const refreshBooks = async () => {
        try {
            const data = await getBooks();
            setBooks(data);
        } catch (e) {
            console.error(e);
        }
    };

    // ===== lọc sách theo search =====
    const filteredBooks = useMemo(() => {
        const kw = searchTerm.toLowerCase();
        return books.filter((b) => {
            if (!kw) return true;
            return (
                b.id.toLowerCase().includes(kw) ||
                b.title.toLowerCase().includes(kw) ||
                b.author.toLowerCase().includes(kw) ||
                (b.category ?? "").toLowerCase().includes(kw) ||
                (b.isbn ?? "").toLowerCase().includes(kw)
            );
        });
    }, [books, searchTerm]);

    // ===== open dialog thêm / sửa =====
    const openCreateDialog = () => {
        setEditingBook(null);
        setFormData({
            id: "",
            title: "",
            author: "",
            category: "",
            isbn: "",
            quantity: 1,
            available: 1,
        });
        setIsDialogOpen(true);
    };

    const openEditDialog = (book: Book) => {
        setEditingBook(book);
        setFormData({
            id: book.id,
            title: book.title,
            author: book.author,
            category: book.category ?? "",
            isbn: book.isbn ?? "",
            quantity: book.quantity,
            available: book.available,
        });
        setIsDialogOpen(true);
    };

    // ===== submit form =====
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const payload: BookPayload = {
            ...formData,
            id: formData.id.trim(),
            title: formData.title.trim(),
            author: formData.author.trim(),
            category: formData.category.trim(),
            isbn: formData.isbn.trim(),
            quantity: Number(formData.quantity) || 0,
            available:
                formData.available === undefined || formData.available === null
                    ? Number(formData.quantity) || 0
                    : Number(formData.available),
        };

        if (!payload.id || !payload.title || !payload.author) {
            alert("Vui lòng nhập ít nhất Mã sách, Tên sách và Tác giả.");
            return;
        }

        try {
            if (editingBook) {
                // update
                await updateBookApi(editingBook.id, payload);
            } else {
                // create
                await createBook(payload);
            }

            await refreshBooks();
            setIsDialogOpen(false);
            setEditingBook(null);
        } catch (e: any) {
            console.error(e);
            alert(e.message ?? "Không thể lưu sách, vui lòng thử lại.");
        }
    };

    // ===== xoá sách =====
    const handleDelete = async (book: Book) => {
        if (
            !window.confirm(
                `Bạn có chắc muốn xoá sách "${book.title}" (Mã: ${book.id})?`
            )
        ) {
            return;
        }

        try {
            await deleteBookApi(book.id);
            await refreshBooks();
        } catch (e: any) {
            console.error(e);
            alert(e.message ?? "Không thể xoá sách, vui lòng thử lại.");
        }
    };

    const getStatusBadge = (b: Book) => {
        if (b.available <= 0) {
            return <Badge variant="destructive">Hết sách</Badge>;
        }
        if (b.available < b.quantity) {
            return (
                <Badge className="bg-orange-50 text-orange-700 hover:bg-orange-50">
                    Đang được mượn
                </Badge>
            );
        }
        return (
            <Badge className="bg-green-50 text-green-700 hover:bg-green-50">
                Còn sẵn
            </Badge>
        );
    };

    if (loading) {
        return <div className="p-8">Đang tải danh sách sách...</div>;
    }

    if (error) {
        return <div className="p-8 text-red-600">Lỗi: {error}</div>;
    }

    return (
        <div className="p-8">
            <div className="mb-8">
                <h2 className="text-2xl text-gray-900 mb-2">Quản lý sách</h2>
                <p className="text-gray-600">
                    Quản lý danh sách sách trong thư viện
                </p>
            </div>

            {/* thanh search + nút thêm */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                    <Input
                        placeholder="Tìm kiếm theo tên sách, tác giả, ISBN..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2 whitespace-nowrap">
                            <Plus className="size-4" />
                            Thêm sách mới
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                        <DialogHeader>
                            <DialogTitle>
                                {editingBook ? "Chỉnh sửa sách" : "Thêm sách mới"}
                            </DialogTitle>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="id">Mã sách</Label>
                                    <Input
                                        id="id"
                                        value={formData.id}
                                        onChange={(e) =>
                                            setFormData({ ...formData, id: e.target.value })
                                        }
                                        placeholder="Ví dụ: B010"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="isbn">ISBN</Label>
                                    <Input
                                        id="isbn"
                                        value={formData.isbn}
                                        onChange={(e) =>
                                            setFormData({ ...formData, isbn: e.target.value })
                                        }
                                        placeholder="Tuỳ chọn"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="title">Tên sách</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) =>
                                        setFormData({ ...formData, title: e.target.value })
                                    }
                                    placeholder="Nhập tên sách"
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="author">Tác giả</Label>
                                <Input
                                    id="author"
                                    value={formData.author}
                                    onChange={(e) =>
                                        setFormData({ ...formData, author: e.target.value })
                                    }
                                    placeholder="Nhập tên tác giả"
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="category">Thể loại</Label>
                                <Input
                                    id="category"
                                    value={formData.category}
                                    onChange={(e) =>
                                        setFormData({ ...formData, category: e.target.value })
                                    }
                                    placeholder="Ví dụ: Lập trình, Thiết kế..."
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="quantity">Số lượng</Label>
                                    <Input
                                        id="quantity"
                                        type="number"
                                        min={0}
                                        value={formData.quantity}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                quantity: Number(e.target.value),
                                            })
                                        }
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="available">Có sẵn</Label>
                                    <Input
                                        id="available"
                                        type="number"
                                        min={0}
                                        value={formData.available}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                available: Number(e.target.value),
                                            })
                                        }
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Nếu bỏ trống, hệ thống sẽ dùng đúng số lượng bên trái.
                                    </p>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsDialogOpen(false)}
                                >
                                    Huỷ
                                </Button>
                                <Button type="submit">
                                    {editingBook ? "Cập nhật" : "Thêm mới"}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* bảng sách */}
            <div className="bg-white rounded-lg border border-gray-200">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Mã sách</TableHead>
                            <TableHead>Tên sách</TableHead>
                            <TableHead>Tác giả</TableHead>
                            <TableHead>Thể loại</TableHead>
                            <TableHead>ISBN</TableHead>
                            <TableHead>Số lượng</TableHead>
                            <TableHead>Có sẵn</TableHead>
                            <TableHead>Trạng thái</TableHead>
                            <TableHead className="text-right">Thao tác</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredBooks.map((b) => (
                            <TableRow key={b.id}>
                                <TableCell>{b.id}</TableCell>
                                <TableCell>{b.title}</TableCell>
                                <TableCell>{b.author}</TableCell>
                                <TableCell>{b.category || "-"}</TableCell>
                                <TableCell>{b.isbn || "-"}</TableCell>
                                <TableCell>{b.quantity}</TableCell>
                                <TableCell>{b.available}</TableCell>
                                <TableCell>{getStatusBadge(b)}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => openEditDialog(b)}
                                        >
                                            <Edit className="size-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="text-red-600"
                                            onClick={() => handleDelete(b)}
                                        >
                                            <Trash2 className="size-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}

                        {filteredBooks.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={9} className="text-center py-6">
                                    Không có sách nào phù hợp.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
