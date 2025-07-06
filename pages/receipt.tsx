import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { apiService } from '@/lib/api';
import { Receipt as ReceiptIcon, Download, Calendar, CreditCard, Building, Smartphone } from 'lucide-react';

interface ChargeRecord {
  id: number;
  amount: number;
  fee: number;
  total: number;
  paymentMethod: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
  transactionId: string;
}

const Receipt: React.FC = () => {
  const [chargeHistory, setChargeHistory] = useState<ChargeRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState<ChargeRecord | null>(null);

  useEffect(() => {
    const fetchChargeHistory = async () => {
      try {
        const mockData: ChargeRecord[] = [
          {
            id: 1,
            amount: 10000,
            fee: 360,
            total: 10360,
            paymentMethod: 'credit_card',
            timestamp: '2025-01-06T10:30:00Z',
            status: 'completed',
            transactionId: 'TXN-20250106-001'
          },
          {
            id: 2,
            amount: 5000,
            fee: 0,
            total: 5000,
            paymentMethod: 'bank_transfer',
            timestamp: '2025-01-05T14:20:00Z',
            status: 'completed',
            transactionId: 'TXN-20250105-002'
          },
          {
            id: 3,
            amount: 20000,
            fee: 500,
            total: 20500,
            paymentMethod: 'mobile_payment',
            timestamp: '2025-01-04T09:15:00Z',
            status: 'completed',
            transactionId: 'TXN-20250104-003'
          }
        ];
        setChargeHistory(mockData);
      } catch (error) {
        console.error('Failed to fetch charge history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChargeHistory();
  }, []);

  const getPaymentMethodInfo = (method: string) => {
    const methods = {
      credit_card: { name: 'クレジットカード', icon: CreditCard },
      bank_transfer: { name: '銀行振込', icon: Building },
      mobile_payment: { name: 'モバイル決済', icon: Smartphone }
    };
    return methods[method as keyof typeof methods] || { name: method, icon: CreditCard };
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

  const generatePDF = (record: ChargeRecord) => {
    const receiptContent = `
biid Store チャージレシート
========================

取引ID: ${record.transactionId}
日時: ${formatDate(record.timestamp)}
決済方法: ${getPaymentMethodInfo(record.paymentMethod).name}

チャージ金額: ¥${record.amount.toLocaleString()}
手数料: ¥${record.fee.toLocaleString()}
合計: ¥${record.total.toLocaleString()}

ステータス: ${record.status === 'completed' ? '完了' : record.status}

ありがとうございました。
    `;

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${record.transactionId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <Layout title="レシート">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="レシート">
      <div className="space-y-6">
        {/* Header */}
        <div className="card-cute">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center">
                <ReceiptIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold gradient-text">レシート</h1>
                <p className="text-gray-600">チャージ履歴とレシートをダウンロードできます</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">総チャージ回数</p>
              <p className="text-2xl font-bold text-green-600">{chargeHistory.length} 回</p>
            </div>
          </div>
        </div>

        {/* Charge History */}
        <div className="card-cute">
          <h3 className="text-xl font-bold text-gray-800 mb-6">チャージ履歴</h3>
          
          {chargeHistory.length === 0 ? (
            <div className="text-center py-12">
              <ReceiptIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">チャージ履歴がありません</p>
            </div>
          ) : (
            <div className="space-y-4">
              {chargeHistory.map((record) => {
                const paymentInfo = getPaymentMethodInfo(record.paymentMethod);
                const PaymentIcon = paymentInfo.icon;
                
                return (
                  <div
                    key={record.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                        <PaymentIcon className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="font-semibold text-gray-800">
                            ¥{record.total.toLocaleString()}
                          </p>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            record.status === 'completed'
                              ? 'bg-green-100 text-green-700'
                              : record.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {record.status === 'completed' ? '完了' : 
                             record.status === 'pending' ? '処理中' : '失敗'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{paymentInfo.name}</p>
                        <p className="text-xs text-gray-500">
                          {formatDate(record.timestamp)} | {record.transactionId}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setSelectedReceipt(record)}
                        className="px-4 py-2 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-colors duration-200 text-sm font-medium"
                      >
                        詳細
                      </button>
                      <button
                        onClick={() => generatePDF(record)}
                        className="px-4 py-2 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition-colors duration-200 text-sm font-medium flex items-center space-x-1"
                      >
                        <Download size={16} />
                        <span>PDF</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Receipt Detail Modal */}
        {selectedReceipt && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-pop max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ReceiptIcon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold gradient-text">チャージレシート</h3>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-2xl">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">取引ID</p>
                        <p className="font-semibold">{selectedReceipt.transactionId}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">日時</p>
                        <p className="font-semibold">{formatDate(selectedReceipt.timestamp)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">決済方法</p>
                        <p className="font-semibold">{getPaymentMethodInfo(selectedReceipt.paymentMethod).name}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">ステータス</p>
                        <p className="font-semibold">
                          {selectedReceipt.status === 'completed' ? '完了' : selectedReceipt.status}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">チャージ金額</span>
                      <span className="font-semibold">¥{selectedReceipt.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">手数料</span>
                      <span className="font-semibold">¥{selectedReceipt.fee.toLocaleString()}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between">
                        <span className="font-bold text-gray-800">合計</span>
                        <span className="font-bold text-lg text-green-600">
                          ¥{selectedReceipt.total.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={() => setSelectedReceipt(null)}
                    className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 transition-colors duration-200"
                  >
                    閉じる
                  </button>
                  <button
                    onClick={() => generatePDF(selectedReceipt)}
                    className="flex-1 btn-primary flex items-center justify-center space-x-2"
                  >
                    <Download size={18} />
                    <span>PDF出力</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Receipt;
