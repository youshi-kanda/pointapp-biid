import React, { useState, useEffect } from 'react';
import { Search, MapPin, Star, Clock, Navigation, Filter, Menu, User, Bell, Bookmark } from 'lucide-react';

const UserThemeRedesign: React.FC = () => {
  const [searchRadius, setSearchRadius] = useState('3km');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [userPoints, setUserPoints] = useState(15420);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const categories = [
    'レストラン・飲食店',
    '小売・ショッピング', 
    'サービス・美容',
    'エンターテイメント',
    '医療・健康',
    '教育・学習'
  ];

  const stores = [
    {
      id: 1,
      name: 'ビューティーサロン麗',
      category: 'サービス・美容',
      rating: 4.8,
      distance: '0.6km',
      points: 480,
      status: '営業中',
      address: '東京都新宿区西新宿1-6-7',
      image: '💄'
    },
    {
      id: 2,
      name: 'ドラッグストア メディカル',
      category: '医療・健康',
      rating: 4.0,
      distance: '0.7km', 
      points: 320,
      status: '営業中',
      address: '東京都新宿区西新宿1-24-25',
      image: '🏥'
    },
    {
      id: 3,
      name: 'カフェ・ドルチェ',
      category: 'レストラン・飲食店',
      rating: 4.5,
      distance: '0.9km',
      points: 250,
      status: '営業中', 
      address: '東京都新宿区西新宿2-1-1',
      image: '☕'
    }
  ];

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-blue-500">
        <div className="px-4 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                className="lg:hidden p-2 rounded-xl bg-blue-100 hover:bg-blue-200 transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu className="w-6 h-6 text-blue-600" />
              </button>
              
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-2xl">🏪</span>
                </div>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-blue-800">biid StoreConnect</h1>
                  <p className="text-sm text-gray-600 hidden sm:block">田中 太郎 | 会員ID: MT2345 | 東京都新宿区</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl px-4 py-3 shadow-md">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm font-bold">P</span>
                  </div>
                  <span className="text-xl lg:text-2xl font-bold text-blue-800">{userPoints.toLocaleString()} pt</span>
                </div>
              </div>
              
              <div className="hidden lg:flex items-center space-x-3">
                <button className="p-3 rounded-xl bg-blue-100 hover:bg-blue-200 transition-colors shadow-md">
                  <Bookmark className="w-5 h-5 text-blue-600" />
                </button>
                <button className="p-3 rounded-xl bg-blue-100 hover:bg-blue-200 transition-colors shadow-md">
                  <Bell className="w-5 h-5 text-blue-600" />
                </button>
                <button className="p-3 rounded-xl bg-blue-100 hover:bg-blue-200 transition-colors shadow-md">
                  <User className="w-5 h-5 text-blue-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex relative">
        {/* Mobile Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`fixed lg:relative inset-y-0 left-0 z-50 w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 overflow-y-auto`}>
          <div className="p-6 space-y-6">
            {/* Search Section */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 shadow-md">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-md">
                  <Filter className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-blue-800">検索条件</h3>
              </div>
              
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-colors duration-200 mb-6">
                <Navigation className="w-5 h-5 mr-3 inline" />
                現在地を取得
              </button>

              <div className="space-y-6">
                <div>
                  <label className="block text-lg font-bold text-blue-800 mb-3">検索範囲</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['500m', '1km', '3km', '5km'].map((radius) => (
                      <button
                        key={radius}
                        onClick={() => setSearchRadius(radius)}
                        className={`py-3 px-4 rounded-xl text-sm font-bold transition-all duration-200 shadow-md ${
                          searchRadius === radius
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'bg-white border-2 border-blue-200 text-blue-600 hover:bg-blue-50'
                        }`}
                      >
                        {radius}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-white border-2 border-blue-200 rounded-xl p-4">
                  <p className="text-sm font-semibold text-blue-600 mb-2">現在地:</p>
                  <p className="text-base font-bold text-blue-800">東京都新宿区西新宿1-1-1</p>
                  <p className="text-sm text-gray-600 mt-1">検索範囲: 半径{searchRadius}以内</p>
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white border-2 border-blue-200 rounded-xl p-6 shadow-md">
              <h4 className="text-xl font-bold text-blue-800 mb-4">カテゴリー</h4>
              <div className="space-y-3">
                {categories.map((category) => (
                  <label key={category} className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-blue-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() => toggleCategory(category)}
                      className="w-5 h-5 rounded border-2 border-blue-300 text-blue-600 focus:ring-blue-200"
                    />
                    <span className="text-base font-medium text-gray-700">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Rating Filter */}
            <div className="bg-white border-2 border-blue-200 rounded-xl p-6 shadow-md">
              <h4 className="text-xl font-bold text-blue-800 mb-4">評価</h4>
              <select className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white text-gray-700 font-medium">
                <option>指定なし</option>
                <option>4.5以上</option>
                <option>4.0以上</option>
                <option>3.5以上</option>
              </select>
            </div>

            {/* Operating Status */}
            <div className="bg-white border-2 border-blue-200 rounded-xl p-6 shadow-md">
              <h4 className="text-xl font-bold text-blue-800 mb-4">営業状況</h4>
              <select className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white text-gray-700 font-medium">
                <option>指定なし</option>
                <option>営業中のみ</option>
                <option>24時間営業</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          {/* Map Section */}
          <div className="h-96 lg:h-[500px] bg-gradient-to-br from-blue-200 to-sky-300 relative border-b-4 border-blue-500">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white border-4 border-blue-500 rounded-2xl p-8 text-center shadow-2xl">
                <MapPin className="w-20 h-20 text-blue-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-blue-800 mb-3">近くのbiid加盟店</h3>
                <p className="text-lg text-gray-600 font-medium">12件の店舗が見つかりました</p>
              </div>
            </div>
          </div>

          {/* Store List */}
          <div className="p-6 lg:p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">🏪</span>
                </div>
                <h3 className="text-2xl font-bold text-blue-800">店舗一覧</h3>
              </div>
              <span className="text-lg text-gray-600 font-medium">{stores.length}件表示中</span>
            </div>

            <div className="grid gap-6">
              {stores.map((store) => (
                <div key={store.id} className="bg-white border-2 border-blue-200 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:border-blue-400 transition-all duration-300">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center text-2xl shadow-md">
                        {store.image}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-blue-800 mb-2">{store.name}</h4>
                        <p className="text-base text-gray-600 font-medium mb-3">{store.category}</p>
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                          <div className="flex items-center space-x-1 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="font-bold text-yellow-700">{store.rating}</span>
                            <span className="text-gray-600">(89件)</span>
                          </div>
                          <div className="flex items-center space-x-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1">
                            <MapPin className="w-4 h-4 text-gray-500" />
                            <span className="font-medium text-gray-700">{store.distance}</span>
                          </div>
                          <div className="flex items-center space-x-1 bg-green-50 border border-green-200 rounded-lg px-3 py-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-green-700 font-bold">{store.status}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 mt-2 font-medium">{store.address}</p>
                        <div className="flex items-center space-x-2 mt-3 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 inline-flex">
                          <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center">
                            <span className="text-white text-xs font-bold">P</span>
                          </div>
                          <span className="text-base font-bold text-blue-700">
                            獲得ポイント: {store.points}pt (還元率: 8%)
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-row lg:flex-col space-x-3 lg:space-x-0 lg:space-y-3">
                      <button className="flex-1 lg:flex-none bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-colors duration-200">
                        詳細を見る
                      </button>
                      <button className="flex-1 lg:flex-none bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 px-6 rounded-xl border-2 border-gray-200 transition-colors duration-200">
                        地図で確認
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserThemeRedesign;
