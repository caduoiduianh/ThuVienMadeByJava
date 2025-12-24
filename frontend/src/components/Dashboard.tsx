import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { BookOpen, Users, BookCheck, AlertCircle } from 'lucide-react';

// 1. Cập nhật Interface để hứng thêm cái list activities
interface RecentActivity {
  id: string;
  member: string;
  book: string;
  action: string;
  date: string;
}

interface DashboardStats {
  totalBooks: number;
  totalMembers: number;
  borrowing: number;
  overdue: number;
  recentActivities: RecentActivity[]; // Thêm dòng này
}

export function Dashboard() {
  // 2. State mặc định
  const [statsData, setStatsData] = useState<DashboardStats>({
    totalBooks: 0,
    totalMembers: 0,
    borrowing: 0,
    overdue: 0,
    recentActivities: [], // Mặc định rỗng
  });

  // 3. Gọi API
  useEffect(() => {
    fetch('http://localhost:8080/api/dashboard/stats')
      .then((res) => {
        if (!res.ok) throw new Error('Lỗi kết nối');
        return res.json();
      })
      .then((data) => {
        console.log("Stats & Activities:", data);
        setStatsData(data);
      })
      .catch((err) => console.error(err));
  }, []);

  const stats = [
    {
      title: 'Tổng số sách',
      value: statsData.totalBooks,
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Thành viên',
      value: statsData.totalMembers,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Đang mượn',
      value: statsData.borrowing,
      icon: BookCheck,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Quá hạn',
      value: statsData.overdue,
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl text-gray-900 mb-2">Tổng quan</h2>
        <p className="text-gray-600">Thống kê hệ thống thư viện (Real-time)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-3xl text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <Icon className={`size-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 4. Render danh sách Hoạt động gần đây từ API */}
      <Card>
        <CardHeader>
          <CardTitle>Hoạt động gần đây (5 giao dịch mới nhất)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {statsData.recentActivities.length === 0 ? (
              <p className="text-center text-gray-500 py-4">Chưa có hoạt động nào.</p>
            ) : (
              statsData.recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">{activity.member}</p>
                    <p className="text-sm text-gray-600">{activity.book}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        activity.action === 'Mượn sách'
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-green-50 text-green-700'
                      }`}
                    >
                      {activity.action}
                    </span>
                    <span className="text-sm text-gray-500 w-24 text-right">
                      {activity.date}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}