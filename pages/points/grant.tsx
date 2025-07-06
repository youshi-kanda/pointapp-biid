import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { apiService } from '@/lib/api';
import { Gift, User, Hash, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';

const GrantPoints: React.FC = () => {
  const [formData, setFormData] = useState({
    uid: '',
    points: '',
    reason: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [userInfo, setUserInfo] = useState<any>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleLookupUser = async () => {
    if (!formData.uid.trim()) {
      setMessage({ type: 'error', text: 'UIDを入力してください' });
      return;
    }

    setIsLoading(true);
    try {
      const mockUser = {
        id: 1,
        name: '田中太郎',
        email: 'tanaka@example.com',
        currentPoints: 1520,
        memberSince: '2024-01-15'
      };
      setUserInfo(mockUser);
      setMessage({ type: 'success', text: 'ユーザーが見つかりました' });
    } catch (error) {
      setMessage({ type: 'error', text: 'ユーザーが見つかりませんでした' });
      setUserInfo(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.uid.trim() || !formData.points.trim()) {
      setMessage({ type: 'error', text: 'UIDとポイント数を入力してください' });
      return;
    }

    const points = parseInt(formData.points);
    if (isNaN(points) || points <= 0) {
      setMessage({ type: 'error', text: '有効なポイント数を入力してください' });
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      setMessage({ type: 'success', text: `${points}ポイントを付与しました！` });
      setFormData({ uid: '', points: '', reason: '' });
      setUserInfo(null);
    } catch (error) {
      setMessage({ type: 'error', text: 'ポイント付与に失敗しました' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout title="ポイント付与">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="card-cute text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-primary-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Gift className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-2">ポイント付与</h1>
          <p className="text-gray-600">お客様にポイントを付与しましょう！</p>
        </div>

        {/* Message */}
        {message && (
          <div className={`p-4 rounded-2xl flex items-center space-x-3 ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600" />
            )}
            <span className={`font-medium ${
              message.type === 'success' ? 'text-green-700' : 'text-red-700'
            }`}>
              {message.text}
            </span>
          </div>
        )}

        {/* User Lookup */}
        <div className="card-cute">
          <h3 className="text-xl font-bold text-gray-800 mb-4">ユーザー検索</h3>
          <div className="flex space-x-3">
            <div className="flex-1 relative">
              <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                name="uid"
                value={formData.uid}
                onChange={handleChange}
                className="input-cute pl-12"
                placeholder="UID または会員番号を入力"
              />
            </div>
            <button
              type="button"
              onClick={handleLookupUser}
              disabled={isLoading}
              className="btn-secondary whitespace-nowrap"
            >
              {isLoading ? '検索中...' : '検索'}
            </button>
          </div>
        </div>

        {/* User Info */}
        {userInfo && (
          <div className="card-cute border-l-4 border-blue-400">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-gray-800">{userInfo.name}</h4>
                <p className="text-gray-600">{userInfo.email}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                    現在のポイント: {userInfo.currentPoints.toLocaleString()} pt
                  </span>
                  <span className="text-sm text-gray-500">
                    会員登録: {userInfo.memberSince}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Grant Form */}
        <div className="card-cute">
          <h3 className="text-xl font-bold text-gray-800 mb-6">ポイント付与フォーム</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="points" className="block text-sm font-semibold text-gray-700 mb-2">
                付与ポイント数 *
              </label>
              <div className="relative">
                <Gift className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="number"
                  id="points"
                  name="points"
                  value={formData.points}
                  onChange={handleChange}
                  className="input-cute pl-12"
                  placeholder="例: 500"
                  min="1"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="reason" className="block text-sm font-semibold text-gray-700 mb-2">
                付与理由（任意）
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 text-gray-400" size={20} />
                <textarea
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  className="input-cute pl-12 h-24 resize-none"
                  placeholder="例: 商品購入特典、イベント参加ボーナスなど"
                />
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => {
                  setFormData({ uid: '', points: '', reason: '' });
                  setUserInfo(null);
                  setMessage(null);
                }}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 transition-colors duration-200"
              >
                リセット
              </button>
              <button
                type="submit"
                disabled={isLoading || !formData.uid || !formData.points}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>付与中...</span>
                  </div>
                ) : (
                  'ポイント付与'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Quick Actions */}
        <div className="card-cute">
          <h3 className="text-xl font-bold text-gray-800 mb-4">クイックアクション</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[100, 300, 500, 1000].map((points) => (
              <button
                key={points}
                onClick={() => setFormData(prev => ({ ...prev, points: points.toString() }))}
                className="p-3 bg-gradient-to-r from-accent-100 to-orange-100 hover:from-accent-200 hover:to-orange-200 rounded-2xl text-center transition-all duration-200 hover:scale-105"
              >
                <span className="font-bold text-accent-700">{points} pt</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default GrantPoints;
