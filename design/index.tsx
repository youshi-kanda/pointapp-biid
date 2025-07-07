import React, { useState } from 'react';
import AdminStyleUserInterface from './案1_admin_style';
import UserThemeRedesign from './案2_user_theme';
import CreativeDesign from './案3_creative';

const DesignShowcase: React.FC = () => {
  const [currentDesign, setCurrentDesign] = useState<'admin' | 'user' | 'creative'>('admin');

  const designs = [
    { key: 'admin' as const, name: '案1: 管理画面スタイル', component: AdminStyleUserInterface },
    { key: 'user' as const, name: '案2: ユーザーテーマ再設計', component: UserThemeRedesign },
    { key: 'creative' as const, name: '案3: クリエイティブ新デザイン', component: CreativeDesign }
  ];

  const CurrentComponent = designs.find(d => d.key === currentDesign)?.component || AdminStyleUserInterface;

  return (
    <div className="min-h-screen">
      {/* Design Selector */}
      <div className="fixed top-4 right-4 z-50 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-4">
        <h3 className="text-sm font-bold text-gray-800 mb-3">デザイン案選択</h3>
        <div className="space-y-2">
          {designs.map((design) => (
            <button
              key={design.key}
              onClick={() => setCurrentDesign(design.key)}
              className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                currentDesign === design.key
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {design.name}
            </button>
          ))}
        </div>
      </div>

      {/* Current Design */}
      <CurrentComponent />
    </div>
  );
};

export default DesignShowcase;
