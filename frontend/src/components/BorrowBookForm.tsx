import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { BookOpen, Calendar } from 'lucide-react';

interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  available: number;
}

interface BorrowBookFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (bookIds: string[]) => void;
  username: string;
}

export function BorrowBookForm({ open, onOpenChange, onSubmit, username }: BorrowBookFormProps) {
  const [selectedBooks, setSelectedBooks] = useState<string[]>([]);

  // Available books
  const availableBooks: Book[] = [
    { id: '1', title: 'Lập trình Python', author: 'Nguyễn Văn A', category: 'Công nghệ', available: 8 },
    { id: '2', title: 'React từ đầu', author: 'Trần Thị B', category: 'Công nghệ', available: 5 },
    { id: '3', title: 'TypeScript Nâng cao', author: 'Phạm Thị D', category: 'Công nghệ', available: 4 },
    { id: '4', title: 'Database Design', author: 'Hoàng Văn E', category: 'Công nghệ', available: 12 },
    { id: '5', title: 'Nghệ thuật lãnh đạo', author: 'Lê Văn F', category: 'Kinh tế', available: 15 },
    { id: '6', title: 'Marketing Cơ bản', author: 'Trần Văn G', category: 'Kinh tế', available: 7 },
    { id: '7', title: 'Clean Code', author: 'Robert Martin', category: 'Công nghệ', available: 10 },
    { id: '8', title: 'Design Patterns', author: 'Gang of Four', category: 'Công nghệ', available: 6 },
  ];

  const handleToggleBook = (bookId: string) => {
    setSelectedBooks((prev) =>
      prev.includes(bookId)
        ? prev.filter((id) => id !== bookId)
        : [...prev, bookId]
    );
  };

  const handleSubmit = () => {
    if (selectedBooks.length > 0) {
      onSubmit(selectedBooks);
      setSelectedBooks([]);
      onOpenChange(false);
    }
  };

  const selectedBooksData = availableBooks.filter((book) =>
    selectedBooks.includes(book.id)
  );

  const maxBooksAllowed = 5;
  const canSelectMore = selectedBooks.length < maxBooksAllowed;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Đăng ký mượn sách</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Info */}
          <div className="bg-blue-50 p-4 rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-sm text-blue-900">
              <Calendar className="size-4" />
              <span>Thời hạn mượn: 14 ngày</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-blue-900">
              <BookOpen className="size-4" />
              <span>
                Đã chọn: {selectedBooks.length}/{maxBooksAllowed} sách
              </span>
            </div>
          </div>

          {/* Available Books List */}
          <div>
            <Label className="mb-3 block">Chọn sách muốn mượn</Label>
            <ScrollArea className="h-[400px] border rounded-lg p-4">
              <div className="space-y-3">
                {availableBooks.map((book) => {
                  const isSelected = selectedBooks.includes(book.id);
                  const isDisabled = !canSelectMore && !isSelected;

                  return (
                    <div
                      key={book.id}
                      className={`flex items-start gap-3 p-4 rounded-lg border transition-colors ${
                        isSelected
                          ? 'bg-blue-50 border-blue-200'
                          : 'bg-white hover:bg-gray-50'
                      } ${isDisabled ? 'opacity-50' : ''}`}
                    >
                      <Checkbox
                        id={`book-${book.id}`}
                        checked={isSelected}
                        onCheckedChange={() => handleToggleBook(book.id)}
                        disabled={isDisabled}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <Label
                          htmlFor={`book-${book.id}`}
                          className="cursor-pointer"
                        >
                          <p className="text-gray-900 mb-1">{book.title}</p>
                          <p className="text-sm text-gray-600">
                            {book.author} • {book.category}
                          </p>
                        </Label>
                      </div>
                      <Badge
                        variant={book.available > 0 ? 'default' : 'destructive'}
                        className={
                          book.available > 0
                            ? 'bg-green-50 text-green-700 hover:bg-green-50'
                            : ''
                        }
                      >
                        Còn: {book.available}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>

          {/* Selected Books Summary */}
          {selectedBooks.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Sách đã chọn:</p>
              <div className="space-y-1">
                {selectedBooksData.map((book) => (
                  <p key={book.id} className="text-sm text-gray-900">
                    • {book.title}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={selectedBooks.length === 0}
            >
              Xác nhận mượn ({selectedBooks.length} sách)
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
