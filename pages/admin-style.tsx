import React, { useState, useEffect } from 'react';
import { Search, MapPin, Star, Clock, Navigation, Filter, Heart, Settings } from 'lucide-react';

const AdminStylePage: React.FC = () => {
  const [searchRadius, setSearchRadius] = useState('3km');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [userPoints, setUserPoints] = useState(15420);

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
      address: '東京都新宿区西新宿1-6-7'
    },
    {
      id: 2,
      name: 'ドラッグストア メディカル',
      category: '医療・健康',
      rating: 4.0,
      distance: '0.7km', 
      points: 320,
      status: '営業中',
      address: '東京都新宿区西新宿1-24-25'
    },
    {
      id: 3,
      name: 'カフェ・ドルチェ',
      category: 'レストラン・飲食店',
      rating: 4.5,
      distance: '0.9km',
      points: 250,
      status: '営業中', 
      address: '東京都新宿区西新宿2-1-1'
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-coral-50 to-salmon-50">
      <header className="bg-white/80 backdrop-blur-sm shadow-cute border-b border-coral-100">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-coral-400 to-salmon-500 rounded-2xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">B</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-coral-600 to-salmon-600 bg-clip-text text-transparent">biid StoreConnect</h1>
                <p className="text-sm text-gray-500">田中 太郎 | 会員ID: MT2345 | 東京都新宿区</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 card-cute px-4 py-2">
                <div className="w-6 h-6 bg-gradient-to-r from-coral-400 to-salmon-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">P</span>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-coral-600 to-salmon-600 bg-clip-text text-transparent">{userPoints.toLocaleString()} pt</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <button className="p-3 rounded-2xl bg-coral-100 hover:bg-coral-200 transition-colors">
                  <Heart className="w-5 h-5 text-coral-600" />
                </button>
                <button className="p-3 rounded-2xl bg-coral-100 hover:bg-coral-200 transition-colors">
                  <Clock className="w-5 h-5 text-coral-600" />
                </button>
                <button className="p-3 rounded-2xl bg-coral-100 hover:bg-coral-200 transition-colors">
                  <Settings className="w-5 h-5 text-coral-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        <div className="w-80 bg-white/90 backdrop-blur-sm shadow-pop h-screen overflow-y-auto">
          <div className="p-6">
            <div className="card-cute mb-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-coral-400 to-salmon-500 rounded-2xl flex items-center justify-center">
                  <Filter className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold bg-gradient-to-r from-coral-600 to-salmon-600 bg-clip-text text-transparent">検索条件</h3>
              </div>
              
              <button className="w-full px-6 py-3 rounded-2xl font-semibold text-white shadow-cute hover:shadow-pop transform hover:scale-105 transition-all duration-200 ease-in-out bg-gradient-to-r from-coral-400 to-coral-600 hover:from-coral-500 hover:to-coral-700 mb-4">
                <Navigation className="w-5 h-5 mr-2" />
                現在地を取得
              </button>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">検索範囲</label>
                  <div className="grid grid-cols-4 gap-2">
                    {['500m', '1km', '3km', '5km'].map((radius) => (
                      <button
                        key={radius}
                        onClick={() => setSearchRadius(radius)}
                        className={`py-2 px-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                          searchRadius === radius
                            ? 'bg-gradient-to-r from-coral-400 to-coral-600 text-white shadow-cute'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {radius}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-2">現在地:</p>
                  <p className="text-sm font-semibold text-gray-800">東京都新宿区西新宿1-1-1</p>
                  <p className="text-xs text-gray-500">検索範囲: 半径{searchRadius}以内</p>
                </div>
              </div>
            </div>

            <div className="card-cute mb-6">
              <h4 className="text-lg font-bold bg-gradient-to-r from-coral-600 to-salmon-600 bg-clip-text text-transparent mb-4">カテゴリー</h4>
              <div className="space-y-2">
                {categories.map((category) => (
                  <label key={category} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() => toggleCategory(category)}
                      className="w-5 h-5 rounded-lg border-2 border-coral-300 text-coral-500 focus:ring-coral-200"
                    />
                    <span className="text-sm font-medium text-gray-700">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="card-cute mb-6">
              <h4 className="text-lg font-bold bg-gradient-to-r from-coral-600 to-salmon-600 bg-clip-text text-transparent mb-4">評価</h4>
              <select className="w-full px-4 py-3 rounded-2xl border-2 border-coral-200 focus:border-coral-400 focus:ring-4 focus:ring-coral-100 transition-all duration-200 bg-white/90 backdrop-blur-sm">
                <option>指定なし</option>
                <option>4.5以上</option>
                <option>4.0以上</option>
                <option>3.5以上</option>
              </select>
            </div>

            <div className="card-cute">
              <h4 className="text-lg font-bold bg-gradient-to-r from-coral-600 to-salmon-600 bg-clip-text text-transparent mb-4">📅 イベントカレンダー</h4>
              <div className="rounded-2xl overflow-hidden">
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

        <div className="flex-1">
          <div className="h-96 bg-gradient-to-br from-coral-100 to-salmon-100 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="card-cute text-center">
                <MapPin className="w-16 h-16 text-coral-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold bg-gradient-to-r from-coral-600 to-salmon-600 bg-clip-text text-transparent mb-2">近くのbiid加盟店</h3>
                <p className="text-gray-600">12件の店舗が見つかりました</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-coral-400 to-salmon-600 rounded-2xl flex items-center justify-center">
                  <span className="text-white font-bold">店</span>
                </div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-coral-600 to-salmon-600 bg-clip-text text-transparent">店舗一覧</h3>
              </div>
              <span className="text-sm text-gray-500">{stores.length}件表示中</span>
            </div>

            <div className="grid gap-4">
              {stores.map((store) => (
                <div key={store.id} className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-cute hover:shadow-pop transition-all duration-300 p-6 border-l-4 border-coral-400 hover:scale-102 transform">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-coral-400 to-salmon-500 rounded-2xl flex items-center justify-center">
                        <span className="text-white font-bold text-lg">{store.name.charAt(0)}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-gray-800 mb-1">{store.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">{store.category}</p>
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="font-semibold">{store.rating}</span>
                            <span className="text-gray-500">(89件)</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span>{store.distance}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-green-600 font-semibold">{store.status}</span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{store.address}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <div className="w-5 h-5 bg-gradient-to-r from-coral-400 to-salmon-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">P</span>
                          </div>
                          <span className="text-sm font-semibold text-coral-600">
                            獲得ポイント: {store.points}pt (還元率: 8%)
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <button className="px-6 py-3 rounded-2xl font-semibold text-white shadow-cute hover:shadow-pop transform hover:scale-105 transition-all duration-200 ease-in-out bg-gradient-to-r from-coral-400 to-coral-600 hover:from-coral-500 hover:to-coral-700 text-sm">
                        詳細を見る
                      </button>
                      <button className="px-6 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-2xl font-semibold text-gray-700 transition-colors">
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

export default AdminStylePage;
