import { useState } from 'react';
import { BookManagement } from './components/BookManagement';
import { MemberManagement } from './components/MemberManagement';
import { BorrowingManagement } from './components/BorrowingManagement';
import { Dashboard } from './components/Dashboard';
import { LoginPage } from './components/LoginPage';
import { UserDashboard } from './components/UserDashboard';
import { Library, Users, BookOpen, LayoutDashboard, LogOut } from 'lucide-react';
import { Button } from './components/ui/button';

type UserRole = 'admin' | 'user';

interface User {
  username: string;
  role: UserRole;
}

export default function App() {
  const [activePage, setActivePage] = useState<'dashboard' | 'books' | 'members' | 'borrowing'>('dashboard');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Demo accounts
  const accounts = [
    { username: 'admin', password: 'admin123', role: 'admin' as UserRole },
    { username: 'user', password: 'user123', role: 'user' as UserRole },
  ];

  const handleLogin = (username: string, password: string) => {
    const account = accounts.find(
      (acc) => acc.username === username && acc.password === password
    );

    if (account) {
      setCurrentUser({ username: account.username, role: account.role });
      setLoginError(null);
    } else {
      setLoginError('Tên đăng nhập hoặc mật khẩu không đúng!');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActivePage('dashboard');
  };

  // Show login page if not logged in
  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} error={loginError} />;
  }

  // Show user dashboard for regular users
  if (currentUser.role === 'user') {
    return (
      <div className="flex h-screen bg-gray-50">
        {/* User Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-8">
              <Library className="size-8 text-blue-600" />
              <h1 className="text-xl text-gray-900">Thư Viện</h1>
            </div>
            
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Đăng nhập với vai trò</p>
              <p className="text-gray-900">{currentUser.username}</p>
              <p className="text-xs text-blue-600">Thành viên</p>
            </div>

            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full gap-2"
            >
              <LogOut className="size-4" />
              Đăng xuất
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <UserDashboard username={currentUser.username} />
        </main>
      </div>
    );
  }

  // Show admin dashboard
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <Library className="size-8 text-blue-600" />
            <h1 className="text-xl text-gray-900">Quản Lý Thư Viện</h1>
          </div>
          
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Đăng nhập với vai trò</p>
            <p className="text-gray-900">{currentUser.username}</p>
            <p className="text-xs text-blue-600">Quản trị viên</p>
          </div>

          <nav className="space-y-2 mb-6">
            <button
              onClick={() => setActivePage('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activePage === 'dashboard'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <LayoutDashboard className="size-5" />
              <span>Tổng quan</span>
            </button>
            
            <button
              onClick={() => setActivePage('books')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activePage === 'books'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Library className="size-5" />
              <span>Quản lý sách</span>
            </button>
            
            <button
              onClick={() => setActivePage('members')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activePage === 'members'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Users className="size-5" />
              <span>Quản lý thành viên</span>
            </button>
            
            <button
              onClick={() => setActivePage('borrowing')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activePage === 'borrowing'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <BookOpen className="size-5" />
              <span>Mượn/Trả sách</span>
            </button>
          </nav>

          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full gap-2"
          >
            <LogOut className="size-4" />
            Đăng xuất
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {activePage === 'dashboard' && <Dashboard />}
        {activePage === 'books' && <BookManagement />}
        {activePage === 'members' && <MemberManagement />}
        {activePage === 'borrowing' && <BorrowingManagement />}
      </main>
    </div>
  );
}