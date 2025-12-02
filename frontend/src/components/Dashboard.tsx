import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { BookOpen, Users, BookCheck, AlertCircle } from 'lucide-react';

export function Dashboard() {
  const stats = [
    {
      title: 'Tổng số sách',
      value: '1,234',
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Thành viên',
      value: '856',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Đang mượn',
      value: '342',
      icon: BookCheck,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Quá hạn',
      value: '23',
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
  ];

  const recentActivities = [
    { id: 1, member: 'Nguyễn Văn A', book: 'Lập trình Python', action: 'Mượn sách', date: '27/11/2024' },
    { id: 2, member: 'Trần Thị B', book: 'React từ đầu', action: 'Trả sách', date: '27/11/2024' },
    { id: 3, member: 'Lê Văn C', book: 'Node.js Cơ bản', action: 'Mượn sách', date: '26/11/2024' },
    { id: 4, member: 'Phạm Thị D', book: 'TypeScript Nâng cao', action: 'Trả sách', date: '26/11/2024' },
    { id: 5, member: 'Hoàng Văn E', book: 'Database Design', action: 'Mượn sách', date: '25/11/2024' },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl text-gray-900 mb-2">Tổng quan</h2>
        <p className="text-gray-600">Thống kê tổng quan hệ thống thư viện</p>
      </div>

      {/* Stats Grid */}
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

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Hoạt động gần đây</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
                <div className="flex-1">
                  <p className="text-gray-900">{activity.member}</p>
                  <p className="text-sm text-gray-600">{activity.book}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      activity.action === 'Mượn sách'
                        ? 'bg-blue-50 text-blue-700'
                        : 'bg-green-50 text-green-700'
                    }`}
                  >
                    {activity.action}
                  </span>
                  <span className="text-sm text-gray-500 w-24 text-right">{activity.date}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
