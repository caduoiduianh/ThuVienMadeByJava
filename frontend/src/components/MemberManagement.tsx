import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';

interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  membershipDate: string;
  status: 'active' | 'inactive';
  borrowedBooks: number;
}

export function MemberManagement() {
  const [members, setMembers] = useState<Member[]>([
    { id: '1', name: 'Nguyễn Văn A', email: 'nguyenvana@email.com', phone: '0901234567', membershipDate: '15/01/2024', status: 'active', borrowedBooks: 2 },
    { id: '2', name: 'Trần Thị B', email: 'tranthib@email.com', phone: '0901234568', membershipDate: '20/02/2024', status: 'active', borrowedBooks: 1 },
    { id: '3', name: 'Lê Văn C', email: 'levanc@email.com', phone: '0901234569', membershipDate: '05/03/2024', status: 'active', borrowedBooks: 3 },
    { id: '4', name: 'Phạm Thị D', email: 'phamthid@email.com', phone: '0901234570', membershipDate: '10/04/2024', status: 'inactive', borrowedBooks: 0 },
    { id: '5', name: 'Hoàng Văn E', email: 'hoangvane@email.com', phone: '0901234571', membershipDate: '25/05/2024', status: 'active', borrowedBooks: 2 },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [formData, setFormData] = useState<Omit<Member, 'id'>>({
    name: '',
    email: '',
    phone: '',
    membershipDate: new Date().toLocaleDateString('vi-VN'),
    status: 'active',
    borrowedBooks: 0,
  });

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.phone.includes(searchTerm)
  );

  const handleOpenDialog = (member?: Member) => {
    if (member) {
      setEditingMember(member);
      setFormData({
        name: member.name,
        email: member.email,
        phone: member.phone,
        membershipDate: member.membershipDate,
        status: member.status,
        borrowedBooks: member.borrowedBooks,
      });
    } else {
      setEditingMember(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        membershipDate: new Date().toLocaleDateString('vi-VN'),
        status: 'active',
        borrowedBooks: 0,
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMember) {
      setMembers(members.map((member) => (member.id === editingMember.id ? { ...formData, id: member.id } : member)));
    } else {
      setMembers([...members, { ...formData, id: Date.now().toString() }]);
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setMembers(members.filter((member) => member.id !== id));
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl text-gray-900 mb-2">Quản lý thành viên</h2>
        <p className="text-gray-600">Quản lý danh sách thành viên thư viện</p>
      </div>

      {/* Search and Add */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <Input
            placeholder="Tìm kiếm theo tên, email, số điện thoại..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()} className="gap-2">
              <Plus className="size-4" />
              Thêm thành viên
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingMember ? 'Chỉnh sửa thành viên' : 'Thêm thành viên mới'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Họ và tên</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="status">Trạng thái</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  required
                >
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Không hoạt động</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Hủy
                </Button>
                <Button type="submit">{editingMember ? 'Cập nhật' : 'Thêm mới'}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Họ và tên</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Số điện thoại</TableHead>
              <TableHead>Ngày đăng ký</TableHead>
              <TableHead>Sách đang mượn</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMembers.map((member) => (
              <TableRow key={member.id}>
                <TableCell>{member.name}</TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell>{member.phone}</TableCell>
                <TableCell>{member.membershipDate}</TableCell>
                <TableCell>{member.borrowedBooks}</TableCell>
                <TableCell>
                  {member.status === 'active' ? (
                    <Badge className="bg-green-50 text-green-700 hover:bg-green-50">Hoạt động</Badge>
                  ) : (
                    <Badge variant="secondary">Không hoạt động</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenDialog(member)}
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(member.id)}
                    >
                      <Trash2 className="size-4 text-red-600" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
