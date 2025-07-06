import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { apiService } from '@/lib/api';
import { History, Search, Filter, Calendar, User, Gift } from 'lucide-react';

interface PointTransaction {
  id: number;
  userId: string;
  userName: string;
  points: number;
  reason: string;
  timestamp: string;
  type: 'grant' | 'redeem';
}

const PointsHistory: React.FC = () => {
  const [transactions, setTransactions] = useState<PointTransaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<PointTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    dateFrom: '',
    dateTo: ''
  });

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await apiService.getPointsHistory();
        if (response.success && response.transactions) {
          const formattedTransactions = response.transactions.map((t: any) => ({
            id: t.id,
            userId: t.user?.member_id || t.user?.username || 'Unknown',
            userName: `${t.user?.first_name || ''} ${t.user?.last_name || ''}`.trim() || t.user?.username || 'Unknown User',
            points: t.points_issued,
            reason: t.description || 'ポイント付与',
            timestamp: t.transaction_date,
            type: t.points_issued > 0 ? 'grant' : 'redeem'
          }));
          setTransactions(formattedTransactions);
          setFilteredTransactions(formattedTransactions);
        }
      } catch (error) {
        console.error('Failed to fetch points history:', error);
        const mockData: PointTransaction[] = [
          {
            id: 1,
            userId: 'U001',
            userName: '田中太郎',
            points: 500,
            reason: '商品購入特典',
            timestamp: '2025-01-06T10:30:00Z',
            type: 'grant'
          },
          {
            id: 2,
            userId: 'U002',
            userName: '佐藤花子',
            points: 300,
            reason: 'イベント参加ボーナス',
            timestamp: '2025-01-06T09:15:00Z',
            type: 'grant'
          }
        ];
        setTransactions(mockData);
        setFilteredTransactions(mockData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  useEffect(() => {
    let filtered = transactions;

    if (filters.search) {
      filtered = filtered.filter(transaction =>
        transaction.userName.toLowerCase().includes(filters.search.toLowerCase()) ||
        transaction.userId.toLowerCase().includes(filters.search.toLowerCase()) ||
        transaction.reason.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.type !== 'all') {
      filtered = filtered.filter(transaction => transaction.type === filters.type);
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(transaction =>
        new Date(transaction.timestamp) >= new Date(filters.dateFrom)
      );
    }

    if (filters.dateTo) {
      filtered = filtered.filter(transaction =>
        new Date(transaction.timestamp) <= new Date(filters.dateTo)
      );
    }

    setFilteredTransactions(filtered);
  }, [filters, transactions]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTotalPoints = () => {
    return filteredTransactions.reduce((sum, transaction) => sum + transaction.points, 0);
  };

  if (isLoading) {
    return (
      <Layout title="付与履歴">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="付与履歴">
      <div className="space-y-6">
        {/* Header */}
        <div className="card-cute">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-primary-400 to-purple-500 rounded-2xl flex items-center justify-center">
                <History className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold gradient-text">付与履歴</h1>
                <p className="text-gray-600">ポイント付与・利用の履歴を確認できます</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">合計ポイント</p>
              <p className="text-2xl font-bold text-primary-600">
                {getTotalPoints().toLocaleString()} pt
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card-cute">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-bold text-gray-800">フィルター</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="input-cute pl-12"
                placeholder="ユーザー名・理由で検索"
              />
            </div>

            {/* Type Filter */}
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="input-cute"
            >
              <option value="all">すべて</option>
              <option value="grant">付与</option>
              <option value="redeem">利用</option>
            </select>

            {/* Date From */}
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                className="input-cute pl-12"
              />
            </div>

            {/* Date To */}
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                className="input-cute pl-12"
              />
            </div>
          </div>

          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-gray-600">
              {filteredTransactions.length} 件の取引が見つかりました
            </p>
            <button
              onClick={() => setFilters({ search: '', type: 'all', dateFrom: '', dateTo: '' })}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              フィルターをリセット
            </button>
          </div>
        </div>

        {/* Transactions List */}
        <div className="card-cute">
          <h3 className="text-lg font-bold text-gray-800 mb-4">取引履歴</h3>
          
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">該当する取引履歴がありません</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      transaction.type === 'grant' 
                        ? 'bg-green-100' 
                        : 'bg-red-100'
                    }`}>
                      {transaction.type === 'grant' ? (
                        <Gift className="w-6 h-6 text-green-600" />
                      ) : (
                        <User className="w-6 h-6 text-red-600" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-semibold text-gray-800">{transaction.userName}</p>
                        <span className="text-sm text-gray-500">({transaction.userId})</span>
                      </div>
                      <p className="text-sm text-gray-600">{transaction.reason}</p>
                      <p className="text-xs text-gray-500">{formatDate(transaction.timestamp)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${
                      transaction.points > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.points > 0 ? '+' : ''}{transaction.points.toLocaleString()} pt
                    </p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      transaction.type === 'grant'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {transaction.type === 'grant' ? '付与' : '利用'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default PointsHistory;
