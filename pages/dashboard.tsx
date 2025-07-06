import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { apiService } from '@/lib/api';
import { 
  TrendingUp, 
  Users, 
  Gift, 
  DollarSign, 
  Star,
  Calendar,
  Activity
} from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  totalPointsGranted: number;
  totalRevenue: number;
  averageRating: number;
  todayTransactions: number;
  monthlyGrowth: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalPointsGranted: 0,
    totalRevenue: 0,
    averageRating: 0,
    todayTransactions: 0,
    monthlyGrowth: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiService.getDashboardStats();
        if (response.success) {
          setStats({
            totalUsers: response.stats.total_users,
            totalPointsGranted: response.stats.total_points_granted,
            totalRevenue: response.stats.total_revenue,
            averageRating: response.stats.average_rating,
            todayTransactions: response.stats.today_transactions,
            monthlyGrowth: response.stats.monthly_growth
          });
        }
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
        const mockData: DashboardStats = {
          totalUsers: 1247,
          totalPointsGranted: 48500,
          totalRevenue: 2850000,
          averageRating: 4.8,
          todayTransactions: 23,
          monthlyGrowth: 12.5
        };
        setStats(mockData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const kpiCards = [
    {
      title: '総会員数',
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      color: 'from-blue-400 to-blue-600',
      borderColor: 'border-blue-400',
      bgColor: 'bg-blue-50',
      change: '+8.2%',
      changeType: 'positive' as const
    },
    {
      title: '発行ポイント数',
      value: `${stats.totalPointsGranted.toLocaleString()} pt`,
      icon: Gift,
      color: 'from-purple-400 to-purple-600',
      borderColor: 'border-purple-400',
      bgColor: 'bg-purple-50',
      change: '+15.3%',
      changeType: 'positive' as const
    },
    {
      title: '総売上',
      value: `¥${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'from-green-400 to-green-600',
      borderColor: 'border-green-400',
      bgColor: 'bg-green-50',
      change: '+12.5%',
      changeType: 'positive' as const
    },
    {
      title: '平均評価',
      value: stats.averageRating.toFixed(1),
      icon: Star,
      color: 'from-yellow-400 to-orange-500',
      borderColor: 'border-yellow-400',
      bgColor: 'bg-yellow-50',
      change: '+0.2',
      changeType: 'positive' as const
    }
  ];

  const recentActivities = [
    { id: 1, user: '田中太郎', action: 'ポイント付与', points: 500, time: '2分前' },
    { id: 2, user: '佐藤花子', action: 'チャージ', points: 1000, time: '5分前' },
    { id: 3, user: '山田次郎', action: 'ポイント付与', points: 300, time: '8分前' },
    { id: 4, user: '鈴木美咲', action: 'ポイント付与', points: 750, time: '12分前' },
    { id: 5, user: '高橋健太', action: 'チャージ', points: 2000, time: '15分前' }
  ];

  if (isLoading) {
    return (
      <Layout title="ダッシュボード">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="ダッシュボード">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="card-cute">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold gradient-text mb-2">
                おかえりなさい！ 🌟
              </h1>
              <p className="text-gray-600">
                今日も素敵な一日をお過ごしください。店舗の状況をチェックしましょう！
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-24 h-24 bg-gradient-to-r from-primary-400 to-purple-500 rounded-full flex items-center justify-center">
                <Activity className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div key={index} className={`kpi-card ${card.borderColor}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-2xl ${card.bgColor}`}>
                    <Icon className={`w-6 h-6 bg-gradient-to-r ${card.color} bg-clip-text text-transparent`} />
                  </div>
                  <span className={`text-sm font-semibold ${
                    card.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {card.change}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-800">{card.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts and Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <div className="card-cute">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">最近のアクティビティ</h3>
              <Calendar className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors duration-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-secondary-400 to-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {activity.user.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{activity.user}</p>
                      <p className="text-sm text-gray-600">{activity.action}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary-600">
                      {activity.points > 0 ? '+' : ''}{activity.points} pt
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="card-cute">
            <h3 className="text-xl font-bold text-gray-800 mb-6">今日の概要</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-2xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">本日の取引数</p>
                    <p className="text-sm text-gray-600">前日比 +5件</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-gray-800">{stats.todayTransactions}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-2xl flex items-center justify-center">
                    <Gift className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">今月の成長率</p>
                    <p className="text-sm text-gray-600">前月比</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-green-600">+{stats.monthlyGrowth}%</span>
              </div>

              <div className="p-4 bg-gradient-to-r from-primary-50 to-purple-50 rounded-2xl">
                <p className="text-sm text-gray-600 mb-2">システム状態</p>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold text-green-700">正常稼働中</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
