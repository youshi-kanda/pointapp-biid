import React, { useState } from 'react';
import { 
  MapPin, 
  Search, 
  Filter,
  Star,
  Clock,
  Navigation,
  Phone,
  Globe,
  Heart,
  Gift,
  Menu,
  X,
  User,
  LogOut
} from 'lucide-react';

interface Store {
  id: number;
  name: string;
  category: string;
  rating: number;
  reviews: number;
  distance: string;
  address: string;
  points: number;
  pointsRate: number;
  status: 'open' | 'closed' | 'closing_soon';
  phone?: string;
  website?: string;
  position: { x: number; y: number };
}

const MockMap: React.FC = () => {
  const [selectedDistance, setSelectedDistance] = useState('3km');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  const mockStores: Store[] = [
    {
      id: 1,
      name: 'ビューティーサロン麗',
      category: 'サービス・美容',
      rating: 4.8,
      reviews: 89,
      distance: '0.6km',
      address: '東京都新宿区西新宿1-6-7',
      points: 480,
      pointsRate: 8,
      status: 'open',
      phone: '03-1234-5678',
      position: { x: 65, y: 45 }
    },
    {
      id: 2,
      name: 'ドラッグストア メディカル',
      category: '小売・ショッピング',
      rating: 4.5,
      reviews: 156,
      distance: '0.8km',
      address: '東京都新宿区新宿3-15-2',
      points: 320,
      pointsRate: 5,
      status: 'open',
      position: { x: 45, y: 35 }
    },
    {
      id: 3,
      name: 'ブックストア&カフェ',
      category: 'レストラン・飲食店',
      rating: 4.6,
      reviews: 234,
      distance: '1.2km',
      address: '東京都新宿区歌舞伎町1-2-3',
      points: 250,
      pointsRate: 4,
      status: 'closing_soon',
      position: { x: 55, y: 25 }
    },
    {
      id: 4,
      name: 'ファッション新NOVA',
      category: '小売・ショッピング',
      rating: 4.3,
      reviews: 78,
      distance: '1.5km',
      address: '東京都新宿区渋谷2-4-1',
      points: 180,
      pointsRate: 3,
      status: 'open',
      position: { x: 35, y: 55 }
    },
    {
      id: 5,
      name: '新宿総合クリニック',
      category: '医療・健康',
      rating: 4.7,
      reviews: 145,
      distance: '0.9km',
      address: '東京都新宿区新宿1-8-5',
      points: 400,
      pointsRate: 6,
      status: 'open',
      position: { x: 75, y: 35 }
    }
  ];

  const categories = [
    'レストラン・飲食店',
    '小売・ショッピング', 
    'サービス・美容',
    'エンターテイメント',
    '医療・健康',
    '教育・学習'
  ];

  const distanceOptions = ['500m', '1km', '3km', '5km'];

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const filteredStores = mockStores.filter(store => {
    const matchesSearch = store.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(store.category);
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'text-green-600';
      case 'closed': return 'text-red-600';
      case 'closing_soon': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open': return '営業中';
      case 'closed': return '閉店';
      case 'closing_soon': return '間もなく閉店';
      default: return '不明';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-purple-100">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-400 to-purple-500 rounded-2xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">biid Store</h1>
                <p className="text-sm text-gray-500">店舗管理システム</p>
              </div>
            </div>
            <h2 className="text-2xl font-bold gradient-text">近くのbiid加盟店</h2>
            <div className="text-sm text-gray-500">
              最終更新: {new Date().toLocaleString('ja-JP')}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="p-6">
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-200px)]"></div>
        {/* Left Sidebar - Search & Filters */}
        <div className="w-full lg:w-80 space-y-4">
          {/* Search Bar */}
          <div className="card-cute">
            <div className="flex items-center space-x-3 mb-4">
              <Filter className="w-5 h-5 text-primary-600" />
              <h3 className="text-lg font-bold gradient-text">検索条件</h3>
            </div>
            
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="店舗名で検索"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-cute pl-10"
              />
            </div>

            <button className="btn-primary w-full mb-4">
              <Navigation className="w-4 h-4 mr-2" />
              現在地を取得
            </button>
          </div>

          {/* Distance Filter */}
          <div className="card-cute">
            <h4 className="font-semibold text-gray-800 mb-3">検索範囲</h4>
            <p className="text-sm text-gray-600 mb-2">現在地:</p>
            <p className="text-sm font-medium text-gray-800 mb-4">東京都新宿区西新宿1-1-1</p>
            <p className="text-sm text-gray-600 mb-3">検索範囲:</p>
            <p className="text-sm font-medium text-gray-800 mb-4">半径3km以内</p>
            
            <div className="grid grid-cols-2 gap-2">
              {distanceOptions.map((distance) => (
                <button
                  key={distance}
                  onClick={() => setSelectedDistance(distance)}
                  className={`px-4 py-2 rounded-2xl font-medium transition-all duration-200 ${
                    selectedDistance === distance
                      ? 'bg-gradient-to-r from-primary-400 to-primary-600 text-white shadow-cute'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {distance}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div className="card-cute">
            <h4 className="font-semibold text-gray-800 mb-3">カテゴリー</h4>
            <div className="space-y-2">
              {categories.map((category) => (
                <label key={category} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => toggleCategory(category)}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">{category}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Rating Filter */}
          <div className="card-cute">
            <h4 className="font-semibold text-gray-800 mb-3">評価</h4>
            <select className="input-cute">
              <option value="">指定なし</option>
              <option value="4.5">4.5以上</option>
              <option value="4.0">4.0以上</option>
              <option value="3.5">3.5以上</option>
            </select>
          </div>

          {/* Business Hours */}
          <div className="card-cute">
            <h4 className="font-semibold text-gray-800 mb-3">営業状況</h4>
            <div className="space-y-2">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-primary-600 border-gray-300 rounded" />
                <span className="text-sm text-gray-700">営業中のみ</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Side - Map and Store List */}
        <div className="flex-1 space-y-4">
          {/* Map Area */}
          <div className="card-cute h-96 lg:h-2/3 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold gradient-text">近くのbiid加盟店</h3>
              <span className="text-sm text-primary-600 font-semibold">{filteredStores.length}件</span>
            </div>
            
            {/* Mock Map Background */}
            <div className="relative w-full h-full bg-gradient-to-br from-blue-100 via-green-50 to-blue-50 rounded-2xl overflow-hidden">
              {/* Map Grid Pattern */}
              <div className="absolute inset-0 opacity-20">
                <div className="grid grid-cols-8 grid-rows-6 h-full w-full">
                  {Array.from({ length: 48 }).map((_, i) => (
                    <div key={i} className="border border-gray-300"></div>
                  ))}
                </div>
              </div>
              
              {/* Streets */}
              <div className="absolute top-1/3 left-0 right-0 h-2 bg-gray-300 opacity-60"></div>
              <div className="absolute top-2/3 left-0 right-0 h-1 bg-gray-300 opacity-40"></div>
              <div className="absolute left-1/4 top-0 bottom-0 w-1 bg-gray-300 opacity-40"></div>
              <div className="absolute left-3/4 top-0 bottom-0 w-2 bg-gray-300 opacity-60"></div>
              
              {/* Parks/Green Areas */}
              <div className="absolute top-1/4 right-1/4 w-16 h-12 bg-green-200 rounded-lg opacity-70"></div>
              <div className="absolute bottom-1/4 left-1/3 w-12 h-8 bg-green-200 rounded-lg opacity-70"></div>
              
              {/* Store Markers */}
              {filteredStores.map((store) => (
                <div
                  key={store.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                  style={{ left: `${store.position.x}%`, top: `${store.position.y}%` }}
                  onClick={() => setSelectedStore(store)}
                >
                  <div className="relative">
                    <div className="w-8 h-8 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full flex items-center justify-center shadow-cute hover:shadow-pop transform hover:scale-110 transition-all duration-200">
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                    {selectedStore?.id === store.id && (
                      <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white rounded-2xl shadow-pop p-4 min-w-64 z-10">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-bold text-gray-800">{store.name}</h4>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedStore(null);
                            }}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            ×
                          </button>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{store.category}</p>
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium ml-1">{store.rating}</span>
                          </div>
                          <span className="text-sm text-gray-500">({store.reviews})</span>
                          <span className={`text-sm font-medium ${getStatusColor(store.status)}`}>
                            {getStatusText(store.status)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{store.address}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-primary-600 font-semibold">
                            獲得ポイント: {store.points}pt (還元率: {store.pointsRate}%)
                          </span>
                          <button className="btn-primary text-xs px-3 py-1">
                            地図で確認
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {/* Current Location */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-blue-500 rounded-full opacity-30 animate-ping"></div>
              </div>
              
              {/* Zoom Controls */}
              <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
                <button className="w-10 h-10 bg-white rounded-lg shadow-cute flex items-center justify-center hover:shadow-pop transition-all duration-200">
                  <span className="text-lg font-bold text-gray-600">+</span>
                </button>
                <button className="w-10 h-10 bg-white rounded-lg shadow-cute flex items-center justify-center hover:shadow-pop transition-all duration-200">
                  <span className="text-lg font-bold text-gray-600">−</span>
                </button>
              </div>
            </div>
          </div>

          {/* Store List */}
          <div className="card-cute">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold gradient-text">店舗一覧</h3>
              <button className="text-sm text-primary-600 hover:text-primary-700">
                詳細を見る
              </button>
            </div>
            
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {filteredStores.map((store) => (
                <div key={store.id} className="p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors duration-200 cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-12 h-12 bg-gradient-to-r from-secondary-400 to-blue-500 rounded-2xl flex items-center justify-center">
                          <Gift className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800">{store.name}</h4>
                          <p className="text-sm text-gray-600">{store.category}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 mb-2">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium ml-1">{store.rating}</span>
                          <span className="text-sm text-gray-500 ml-1">({store.reviews}件)</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600 ml-1">{store.distance}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className={`text-sm font-medium ml-1 ${getStatusColor(store.status)}`}>
                            {getStatusText(store.status)}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{store.address}</p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-primary-600 font-semibold">
                          獲得ポイント: {store.points}pt (還元率: {store.pointsRate}%)
                        </span>
                        <div className="flex space-x-2">
                          {store.phone && (
                            <button className="p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
                              <Phone className="w-4 h-4 text-gray-600" />
                            </button>
                          )}
                          {store.website && (
                            <button className="p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
                              <Globe className="w-4 h-4 text-gray-600" />
                            </button>
                          )}
                          <button className="p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
                            <Heart className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MockMap;
