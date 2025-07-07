import React, { useState, useEffect } from 'react';
import { Search, MapPin, Star, Clock, Navigation, Filter, Sparkles, Heart, Zap, Gift } from 'lucide-react';

const CreativeThemePage: React.FC = () => {
  const [searchRadius, setSearchRadius] = useState('3km');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [userPoints, setUserPoints] = useState(15420);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const categories = [
    { name: 'レストラン・飲食店', icon: '🍽️', color: 'from-orange-400 to-red-400' },
    { name: '小売・ショッピング', icon: '🛍️', color: 'from-pink-400 to-purple-400' },
    { name: 'サービス・美容', icon: '💅', color: 'from-purple-400 to-indigo-400' },
    { name: 'エンターテイメント', icon: '🎭', color: 'from-indigo-400 to-blue-400' },
    { name: '医療・健康', icon: '🏥', color: 'from-blue-400 to-cyan-400' },
    { name: '教育・学習', icon: '📚', color: 'from-cyan-400 to-teal-400' }
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
      icon: '💅',
      gradient: 'from-purple-400 to-pink-400'
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
      icon: '🏥',
      gradient: 'from-blue-400 to-cyan-400'
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
      icon: '☕',
      gradient: 'from-orange-400 to-red-400'
    }
  ];

  const toggleCategory = (categoryName: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryName) 
        ? prev.filter(c => c !== categoryName)
        : [...prev, categoryName]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-mint-50 via-cyan-50 to-blue-50 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-mint-200 to-cyan-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-gradient-to-r from-teal-200 to-mint-200 rounded-full opacity-20 animate-pulse delay-2000"></div>
      </div>

      <header className="relative bg-white/70 backdrop-blur-xl shadow-xl border-b border-mint-200">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <button 
                className="lg:hidden p-3 rounded-2xl bg-gradient-to-r from-mint-400 to-cyan-400 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Filter className="w-6 h-6" />
              </button>
              
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-r from-mint-400 to-cyan-400 rounded-3xl flex items-center justify-center shadow-xl">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">✨</span>
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-mint-600 to-cyan-600 bg-clip-text text-transparent">
                    biid StoreConnect
                  </h1>
                  <p className="text-sm text-gray-600 hidden sm:block">田中 太郎 ✨ 会員ID: MT2345 ✨ 東京都新宿区</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative bg-gradient-to-r from-mint-100 to-cyan-100 border-2 border-mint-300 rounded-3xl px-6 py-4 shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-r from-mint-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-md">
                      <Gift className="w-5 h-5 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-pulse"></div>
                  </div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-mint-700 to-cyan-700 bg-clip-text text-transparent">
                    {userPoints.toLocaleString()} pt
                  </span>
                </div>
              </div>
              
              <div className="hidden lg:flex items-center space-x-3">
                <button className="p-3 rounded-2xl bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <Heart className="w-5 h-5" />
                </button>
                <button className="p-3 rounded-2xl bg-gradient-to-r from-blue-400 to-indigo-400 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <Clock className="w-5 h-5" />
                </button>
                <button className="p-3 rounded-2xl bg-gradient-to-r from-teal-400 to-mint-400 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <Zap className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex relative">
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        <div className={`fixed lg:relative inset-y-0 left-0 z-50 w-96 bg-white/80 backdrop-blur-xl shadow-2xl transform transition-transform duration-500 ease-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 overflow-y-auto border-r border-mint-200`}>
          <div className="p-8 space-y-8">
            <div className="relative bg-gradient-to-br from-mint-50 to-cyan-50 border-2 border-mint-200 rounded-3xl p-8 shadow-xl">
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">🔍</span>
              </div>
              
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-14 h-14 bg-gradient-to-r from-mint-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Filter className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-mint-700 to-cyan-700 bg-clip-text text-transparent">
                  検索条件
                </h3>
              </div>
              
              <button className="w-full bg-gradient-to-r from-mint-500 to-cyan-500 hover:from-mint-600 hover:to-cyan-600 text-white font-bold py-5 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 mb-8 transform hover:scale-105">
                <Navigation className="w-6 h-6 mr-3 inline" />
                現在地を取得 ✨
              </button>

              <div className="space-y-6">
                <div>
                  <label className="block text-lg font-bold bg-gradient-to-r from-mint-700 to-cyan-700 bg-clip-text text-transparent mb-4">
                    検索範囲
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {['500m', '1km', '3km', '5km'].map((radius) => (
                      <button
                        key={radius}
                        onClick={() => setSearchRadius(radius)}
                        className={`py-4 px-5 rounded-2xl text-sm font-bold transition-all duration-300 shadow-lg transform hover:scale-105 ${
                          searchRadius === radius
                            ? 'bg-gradient-to-r from-mint-500 to-cyan-500 text-white shadow-xl'
                            : 'bg-white border-2 border-mint-300 text-mint-700 hover:border-mint-400'
                        }`}
                      >
                        {radius}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-white/80 border-2 border-mint-300 rounded-2xl p-6 shadow-lg">
                  <p className="text-sm font-bold text-mint-600 mb-2">📍 現在地:</p>
                  <p className="text-lg font-bold text-mint-800">東京都新宿区西新宿1-1-1</p>
                  <p className="text-sm text-gray-600 mt-2">🔍 検索範囲: 半径{searchRadius}以内</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white/90 to-mint-50/90 border-2 border-mint-200 rounded-3xl p-8 shadow-xl">
              <h4 className="text-2xl font-bold bg-gradient-to-r from-mint-700 to-cyan-700 bg-clip-text text-transparent mb-6">
                カテゴリー ✨
              </h4>
              <div className="space-y-4">
                {categories.map((category) => (
                  <label key={category.name} className="flex items-center space-x-4 cursor-pointer p-4 rounded-2xl hover:bg-white/80 transition-all duration-300 group">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category.name)}
                      onChange={() => toggleCategory(category.name)}
                      className="w-6 h-6 rounded-lg border-2 border-mint-300 text-mint-600 focus:ring-mint-200"
                    />
                    <div className={`w-12 h-12 bg-gradient-to-r ${category.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <span className="text-xl">{category.icon}</span>
                    </div>
                    <span className="text-base font-semibold text-gray-700 group-hover:text-mint-700 transition-colors">
                      {category.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-white/90 to-cyan-50/90 border-2 border-cyan-200 rounded-3xl p-8 shadow-xl">
              <h4 className="text-2xl font-bold bg-gradient-to-r from-cyan-700 to-blue-700 bg-clip-text text-transparent mb-6">
                評価 ⭐
              </h4>
              <select className="w-full px-6 py-4 border-2 border-cyan-300 rounded-2xl focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 transition-all duration-300 bg-white/90 text-gray-700 font-semibold shadow-lg">
                <option>指定なし</option>
                <option>⭐⭐⭐⭐⭐ 4.5以上</option>
                <option>⭐⭐⭐⭐ 4.0以上</option>
                <option>⭐⭐⭐ 3.5以上</option>
              </select>
            </div>

            <div className="bg-gradient-to-br from-white/90 to-mint-50/90 border-2 border-mint-200 rounded-3xl p-8 shadow-xl">
              <h4 className="text-2xl font-bold bg-gradient-to-r from-mint-700 to-cyan-700 bg-clip-text text-transparent mb-6">
                📅 イベントカレンダー ✨
              </h4>
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <iframe 
                  src="https://calendar.google.com/calendar/embed?src=ja.japanese%23holiday%40group.v.calendar.google.com&ctz=Asia%2FTokyo&showTitle=0&showPrint=0&showCalendars=0&showTz=0&height=300&wkst=1&bgcolor=%23ffffff"
                  style={{ border: 0 }}
                  width="100%"
                  height="300"
                  frameBorder={0}
                  scrolling="no"
                  title="日本の祝日カレンダー"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 lg:ml-0">
          <div className="h-96 lg:h-[500px] bg-gradient-to-br from-mint-200 via-cyan-200 to-blue-200 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-mint-100/50 to-cyan-100/50"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative bg-white/90 backdrop-blur-xl border-2 border-mint-300 rounded-3xl p-10 text-center shadow-2xl">
                <div className="absolute -top-4 -right-4 w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center animate-bounce">
                  <span className="text-white text-lg">🗺️</span>
                </div>
                <MapPin className="w-24 h-24 text-mint-600 mx-auto mb-6" />
                <h3 className="text-3xl font-bold bg-gradient-to-r from-mint-700 to-cyan-700 bg-clip-text text-transparent mb-4">
                  近くのbiid加盟店
                </h3>
                <p className="text-xl text-gray-600 font-semibold">✨ 12件の素敵な店舗が見つかりました ✨</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center space-x-4">
                <div className="relative w-16 h-16 bg-gradient-to-r from-mint-500 to-cyan-500 rounded-3xl flex items-center justify-center shadow-xl">
                  <span className="text-white font-bold text-2xl">🏪</span>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-pulse"></div>
                </div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-mint-700 to-cyan-700 bg-clip-text text-transparent">
                  店舗一覧
                </h3>
              </div>
              <span className="text-lg text-gray-600 font-semibold bg-white/80 px-6 py-3 rounded-2xl border-2 border-mint-200 shadow-lg">
                ✨ {stores.length}件表示中 ✨
              </span>
            </div>

            <div className="grid gap-8">
              {stores.map((store) => (
                <div key={store.id} className="relative bg-white/90 backdrop-blur-xl border-2 border-mint-200 rounded-3xl p-8 shadow-2xl hover:shadow-3xl hover:border-mint-400 transition-all duration-500 transform hover:scale-105 group">
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center group-hover:animate-spin">
                    <span className="text-white text-sm">⭐</span>
                  </div>
                  
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
                    <div className="flex items-start space-x-6">
                      <div className={`relative w-20 h-20 bg-gradient-to-r ${store.gradient} rounded-3xl flex items-center justify-center text-3xl shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                        {store.icon}
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
                          <span className="text-xs">✨</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-2xl font-bold bg-gradient-to-r from-mint-800 to-cyan-800 bg-clip-text text-transparent mb-3">
                          {store.name}
                        </h4>
                        <p className="text-lg text-gray-600 font-semibold mb-4">{store.category}</p>
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                          <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-300 rounded-2xl px-4 py-2 shadow-md">
                            <Star className="w-5 h-5 text-yellow-500 fill-current" />
                            <span className="font-bold text-yellow-700">{store.rating}</span>
                            <span className="text-gray-600">(89件)</span>
                          </div>
                          <div className="flex items-center space-x-2 bg-gradient-to-r from-gray-100 to-slate-100 border-2 border-gray-300 rounded-2xl px-4 py-2 shadow-md">
                            <MapPin className="w-5 h-5 text-gray-500" />
                            <span className="font-semibold text-gray-700">{store.distance}</span>
                          </div>
                          <div className="flex items-center space-x-2 bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-300 rounded-2xl px-4 py-2 shadow-md">
                            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-green-700 font-bold">{store.status}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 mt-3 font-medium">📍 {store.address}</p>
                        <div className="flex items-center space-x-3 mt-4 bg-gradient-to-r from-mint-100 to-cyan-100 border-2 border-mint-300 rounded-2xl px-4 py-3 inline-flex shadow-lg">
                          <div className="w-8 h-8 bg-gradient-to-r from-mint-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-md">
                            <Gift className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-lg font-bold bg-gradient-to-r from-mint-700 to-cyan-700 bg-clip-text text-transparent">
                            獲得ポイント: {store.points}pt ✨ (還元率: 8%)
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-row lg:flex-col space-x-4 lg:space-x-0 lg:space-y-4">
                      <button className="flex-1 lg:flex-none bg-gradient-to-r from-mint-500 to-cyan-500 hover:from-mint-600 hover:to-cyan-600 text-white font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                        詳細を見る ✨
                      </button>
                      <button className="flex-1 lg:flex-none bg-gradient-to-r from-gray-100 to-slate-100 hover:from-gray-200 hover:to-slate-200 text-gray-700 font-bold py-4 px-8 rounded-2xl border-2 border-gray-300 hover:border-gray-400 transition-all duration-300 transform hover:scale-105 shadow-lg">
                        地図で確認 🗺️
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

export default CreativeThemePage;
