import React, { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { authService } from '@/lib/auth';
import { 
  Home, 
  Gift, 
  History, 
  CreditCard, 
  Receipt, 
  Smartphone, 
  LogOut, 
  User,
  Menu,
  X
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title = 'biid Store' }) => {
  const router = useRouter();
  const [user, setUser] = useState(authService.getUser());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    authService.logout();
  };

  const navigation = [
    { name: 'ダッシュボード', href: '/dashboard', icon: Home },
    { name: 'ポイント付与', href: '/points/grant', icon: Gift },
    { name: '付与履歴', href: '/points/history', icon: History },
    { name: 'チャージ', href: '/charge', icon: CreditCard },
    { name: 'レシート', href: '/receipt', icon: Receipt },
    { name: 'NFC読取', href: '/nfc/lookup', icon: Smartphone },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-2xl bg-white/90 backdrop-blur-sm shadow-cute"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white/90 backdrop-blur-sm shadow-pop transform transition-transform duration-300 ease-in-out ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-20 border-b border-purple-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-400 to-purple-500 rounded-2xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">biid Store</h1>
                <p className="text-sm text-gray-500">店舗管理システム</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = router.pathname === item.href;
              return (
                <Link key={item.name} href={item.href}>
                  <div className={`nav-item ${isActive ? 'active' : ''}`}>
                    <Icon size={20} />
                    <span className="font-medium">{item.name}</span>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* User info */}
          <div className="p-4 border-t border-purple-100">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-secondary-400 to-blue-500 rounded-full flex items-center justify-center">
                <User size={20} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">{user?.first_name || '管理者'}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-2xl transition-colors duration-200"
            >
              <LogOut size={18} />
              <span>ログアウト</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-purple-100">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="lg:hidden w-10"></div>
              <h2 className="text-2xl font-bold gradient-text">{title}</h2>
              <div className="text-sm text-gray-500">
                最終更新: {new Date().toLocaleString('ja-JP')}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
