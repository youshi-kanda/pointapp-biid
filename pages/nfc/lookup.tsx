import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { apiService } from '@/lib/api';
import { Smartphone, Wifi, User, Gift, AlertCircle, CheckCircle, Zap } from 'lucide-react';
import { useRouter } from 'next/router';

interface NFCUser {
  id: number;
  name: string;
  email: string;
  currentPoints: number;
  memberSince: string;
  uid: string;
}

const NFCLookup: React.FC = () => {
  const router = useRouter();
  const [isScanning, setIsScanning] = useState(false);
  const [foundUser, setFoundUser] = useState<NFCUser | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [manualUID, setManualUID] = useState('');

  const startNFCScanning = async () => {
    if (!('NDEFReader' in window)) {
      setMessage({ 
        type: 'error', 
        text: 'このブラウザはNFC機能をサポートしていません。手動でUIDを入力してください。' 
      });
      return;
    }

    try {
      setIsScanning(true);
      setMessage({ type: 'info', text: 'NFCカードをスマートフォンに近づけてください...' });

      
      setTimeout(async () => {
        try {
          const mockUID = 'NFC-' + Math.random().toString(36).substr(2, 8).toUpperCase();
          await lookupUser(mockUID);
        } catch (error) {
          setMessage({ type: 'error', text: 'NFCスキャンに失敗しました' });
        } finally {
          setIsScanning(false);
        }
      }, 3000);

    } catch (error) {
      setMessage({ type: 'error', text: 'NFC機能の開始に失敗しました' });
      setIsScanning(false);
    }
  };

  const lookupUser = async (uid: string) => {
    try {
      const mockUser: NFCUser = {
        id: Math.floor(Math.random() * 1000),
        name: '田中太郎',
        email: 'tanaka@example.com',
        currentPoints: 1520,
        memberSince: '2024-01-15',
        uid: uid
      };
      
      setFoundUser(mockUser);
      setMessage({ type: 'success', text: 'ユーザーが見つかりました！' });
    } catch (error) {
      setMessage({ type: 'error', text: 'ユーザーが見つかりませんでした' });
      setFoundUser(null);
    }
  };

  const handleManualLookup = async () => {
    if (!manualUID.trim()) {
      setMessage({ type: 'error', text: 'UIDを入力してください' });
      return;
    }
    await lookupUser(manualUID);
  };

  const redirectToGrant = () => {
    if (foundUser) {
      router.push(`/points/grant?uid=${foundUser.uid}&name=${encodeURIComponent(foundUser.name)}`);
    }
  };

  const stopScanning = () => {
    setIsScanning(false);
    setMessage(null);
  };

  return (
    <Layout title="NFC読取">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="card-cute text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Smartphone className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-2">NFC読取</h1>
          <p className="text-gray-600">NFCカードからユーザー情報を読み取ります</p>
        </div>

        {/* Message */}
        {message && (
          <div className={`p-4 rounded-2xl flex items-center space-x-3 ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200' 
              : message.type === 'error'
              ? 'bg-red-50 border border-red-200'
              : 'bg-blue-50 border border-blue-200'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : message.type === 'error' ? (
              <AlertCircle className="w-5 h-5 text-red-600" />
            ) : (
              <Wifi className="w-5 h-5 text-blue-600" />
            )}
            <span className={`font-medium ${
              message.type === 'success' ? 'text-green-700' : 
              message.type === 'error' ? 'text-red-700' : 'text-blue-700'
            }`}>
              {message.text}
            </span>
          </div>
        )}

        {/* NFC Scanning */}
        <div className="card-cute">
          <h3 className="text-xl font-bold text-gray-800 mb-6">NFCスキャン</h3>
          
          <div className="text-center">
            {isScanning ? (
              <div className="space-y-6">
                <div className="relative">
                  <div className="w-32 h-32 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full flex items-center justify-center mx-auto animate-pulse">
                    <Wifi className="w-16 h-16 text-white" />
                  </div>
                  <div className="absolute inset-0 rounded-full border-4 border-blue-300 animate-ping"></div>
                </div>
                <p className="text-lg font-semibold text-gray-800">スキャン中...</p>
                <p className="text-gray-600">NFCカードをデバイスに近づけてください</p>
                <button
                  onClick={stopScanning}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 transition-colors duration-200"
                >
                  キャンセル
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="w-32 h-32 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto">
                  <Smartphone className="w-16 h-16 text-blue-600" />
                </div>
                <button
                  onClick={startNFCScanning}
                  className="btn-primary flex items-center space-x-2 mx-auto"
                >
                  <Zap className="w-5 h-5" />
                  <span>NFCスキャン開始</span>
                </button>
                <p className="text-sm text-gray-500">
                  ※ NFC機能が利用できない場合は、下記の手動入力をご利用ください
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Manual UID Input */}
        <div className="card-cute">
          <h3 className="text-xl font-bold text-gray-800 mb-4">手動UID入力</h3>
          <div className="flex space-x-3">
            <input
              type="text"
              value={manualUID}
              onChange={(e) => setManualUID(e.target.value)}
              className="flex-1 input-cute"
              placeholder="UID または会員番号を入力"
            />
            <button
              onClick={handleManualLookup}
              className="btn-secondary whitespace-nowrap"
            >
              検索
            </button>
          </div>
        </div>

        {/* Found User */}
        {foundUser && (
          <div className="card-cute border-l-4 border-green-400">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-800">{foundUser.name}</h4>
                  <p className="text-gray-600">{foundUser.email}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full">
                      現在のポイント: {foundUser.currentPoints.toLocaleString()} pt
                    </span>
                    <span className="text-sm text-gray-500">
                      UID: {foundUser.uid}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    会員登録: {foundUser.memberSince}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  setFoundUser(null);
                  setManualUID('');
                  setMessage(null);
                }}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 transition-colors duration-200"
              >
                リセット
              </button>
              <button
                onClick={redirectToGrant}
                className="flex-1 btn-primary flex items-center justify-center space-x-2"
              >
                <Gift className="w-5 h-5" />
                <span>ポイント付与へ</span>
              </button>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="card-cute bg-gradient-to-r from-purple-50 to-pink-50">
          <h3 className="text-lg font-bold text-gray-800 mb-4">使用方法</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-primary-600 font-bold text-xs">1</span>
              </div>
              <p>「NFCスキャン開始」ボタンを押してスキャンモードを開始します</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-primary-600 font-bold text-xs">2</span>
              </div>
              <p>お客様のNFCカードをスマートフォンに近づけます</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-primary-600 font-bold text-xs">3</span>
              </div>
              <p>ユーザー情報が表示されたら「ポイント付与へ」ボタンでポイント付与画面に移動します</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NFCLookup;
