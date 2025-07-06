import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { apiService } from '@/lib/api';
import { CreditCard, DollarSign, Smartphone, Building, CheckCircle, AlertCircle } from 'lucide-react';

const Charge: React.FC = () => {
  const [formData, setFormData] = useState({
    amount: '',
    paymentMethod: 'credit_card'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const paymentMethods = [
    {
      id: 'credit_card',
      name: 'クレジットカード',
      icon: CreditCard,
      description: 'Visa, MasterCard, JCB対応',
      fee: '3.6%'
    },
    {
      id: 'bank_transfer',
      name: '銀行振込',
      icon: Building,
      description: '各種銀行対応',
      fee: '無料'
    },
    {
      id: 'mobile_payment',
      name: 'モバイル決済',
      icon: Smartphone,
      description: 'PayPay, LINE Pay等',
      fee: '2.5%'
    }
  ];

  const quickAmounts = [1000, 3000, 5000, 10000, 20000, 50000];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleQuickAmount = (amount: number) => {
    setFormData(prev => ({ ...prev, amount: amount.toString() }));
  };

  const calculateFee = (amount: number, method: string) => {
    const selectedMethod = paymentMethods.find(m => m.id === method);
    if (!selectedMethod || selectedMethod.fee === '無料') return 0;
    
    const feeRate = parseFloat(selectedMethod.fee.replace('%', '')) / 100;
    return Math.floor(amount * feeRate);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const amount = parseInt(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      setMessage({ type: 'error', text: '有効な金額を入力してください' });
      return;
    }

    if (amount < 100) {
      setMessage({ type: 'error', text: '最小チャージ金額は100円です' });
      return;
    }

    if (amount > 100000) {
      setMessage({ type: 'error', text: '最大チャージ金額は100,000円です' });
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate payment processing
      
      setMessage({ 
        type: 'success', 
        text: `¥${amount.toLocaleString()}のチャージが完了しました！` 
      });
      setFormData({ amount: '', paymentMethod: 'credit_card' });
    } catch (error) {
      setMessage({ type: 'error', text: 'チャージに失敗しました。もう一度お試しください。' });
    } finally {
      setIsLoading(false);
    }
  };

  const selectedMethod = paymentMethods.find(m => m.id === formData.paymentMethod);
  const amount = parseInt(formData.amount) || 0;
  const fee = calculateFee(amount, formData.paymentMethod);
  const total = amount + fee;

  return (
    <Layout title="チャージ">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="card-cute text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <DollarSign className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-2">チャージ</h1>
          <p className="text-gray-600">店舗アカウントにチャージしましょう！</p>
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

        {/* Quick Amount Selection */}
        <div className="card-cute">
          <h3 className="text-xl font-bold text-gray-800 mb-4">クイック選択</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {quickAmounts.map((amount) => (
              <button
                key={amount}
                onClick={() => handleQuickAmount(amount)}
                className={`p-4 rounded-2xl border-2 transition-all duration-200 hover:scale-105 ${
                  formData.amount === amount.toString()
                    ? 'border-primary-400 bg-primary-50 text-primary-700'
                    : 'border-gray-200 hover:border-primary-300 hover:bg-primary-50'
                }`}
              >
                <span className="font-bold text-lg">¥{amount.toLocaleString()}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Charge Form */}
        <div className="card-cute">
          <h3 className="text-xl font-bold text-gray-800 mb-6">チャージフォーム</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Amount Input */}
            <div>
              <label htmlFor="amount" className="block text-sm font-semibold text-gray-700 mb-2">
                チャージ金額 *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className="input-cute pl-12"
                  placeholder="例: 10000"
                  min="100"
                  max="100000"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                最小: ¥100 / 最大: ¥100,000
              </p>
            </div>

            {/* Payment Method Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                決済方法 *
              </label>
              <div className="space-y-3">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <label
                      key={method.id}
                      className={`flex items-center p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                        formData.paymentMethod === method.id
                          ? 'border-primary-400 bg-primary-50'
                          : 'border-gray-200 hover:border-primary-300 hover:bg-primary-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={formData.paymentMethod === method.id}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className="flex items-center space-x-4 flex-1">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                          formData.paymentMethod === method.id
                            ? 'bg-primary-100'
                            : 'bg-gray-100'
                        }`}>
                          <Icon className={`w-5 h-5 ${
                            formData.paymentMethod === method.id
                              ? 'text-primary-600'
                              : 'text-gray-600'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">{method.name}</p>
                          <p className="text-sm text-gray-600">{method.description}</p>
                        </div>
                        <div className="text-right">
                          <span className={`text-sm font-medium ${
                            method.fee === '無料' ? 'text-green-600' : 'text-gray-600'
                          }`}>
                            手数料: {method.fee}
                          </span>
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Summary */}
            {amount > 0 && (
              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl">
                <h4 className="font-semibold text-gray-800 mb-3">お支払い内容</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">チャージ金額:</span>
                    <span className="font-medium">¥{amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">手数料:</span>
                    <span className="font-medium">¥{fee.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-800">合計:</span>
                      <span className="font-bold text-lg">¥{total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !formData.amount}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>処理中...</span>
                </div>
              ) : (
                `¥${total.toLocaleString()}をチャージする`
              )}
            </button>
          </form>
        </div>

        {/* Security Notice */}
        <div className="card-cute border-l-4 border-blue-400">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-2xl flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">安全なお取引</h4>
              <p className="text-sm text-gray-600">
                すべての決済情報は暗号化され、安全に処理されます。
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Charge;
