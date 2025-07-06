'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { apiClient, User, Store, PointIssueResponse } from '@/lib/api';
import { QrCode, Scan, CheckCircle, User as UserIcon, Store as StoreIcon } from 'lucide-react';

export default function IssuePage() {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState<string>('');
  const [user, setUser] = useState<User | null>(null);
  const [store, setStore] = useState<Store | null>(null);
  const [amount, setAmount] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastTransaction, setLastTransaction] = useState<PointIssueResponse | null>(null);

  useEffect(() => {
    const mockStore: Store = {
      id: 1,
      name: 'Demo Coffee Shop',
      owner_name: 'John Doe',
      email: 'demo@coffeeshop.com',
      phone: '03-1234-5678',
      address: 'Tokyo, Shibuya',
      registration_date: new Date().toISOString(),
      point_rate: 0.1,
      status: 'active',
      balance: 50000,
      monthly_fee: 5000,
      latitude: 35.6762,
      longitude: 139.6503,
      category: 'cafe',
      features: 'wifi,parking'
    };
    setStore(mockStore);
  }, []);

  const handleQRScan = async () => {
    setIsScanning(true);
    
    try {
      if ('BarcodeDetector' in window) {
        const barcodeDetector = new (window as unknown as { BarcodeDetector: new (options: { formats: string[] }) => { detect: (canvas: HTMLCanvasElement) => Promise<{ rawValue: string }[]> } }).BarcodeDetector({
          formats: ['qr_code']
        });
        
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        
        const video = document.createElement('video');
        video.srcObject = stream;
        video.play();
        
        video.addEventListener('loadedmetadata', async () => {
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          
          const detectQR = async () => {
            if (video.readyState === video.HAVE_ENOUGH_DATA) {
              canvas.width = video.videoWidth;
              canvas.height = video.videoHeight;
              context?.drawImage(video, 0, 0);
              
              try {
                const barcodes = await barcodeDetector.detect(canvas);
                if (barcodes.length > 0) {
                  const qrData = barcodes[0].rawValue;
                  setScannedData(qrData);
                  await handleQRData(qrData);
                  stream.getTracks().forEach(track => track.stop());
                  return;
                }
              } catch (error) {
                console.error('QR detection error:', error);
              }
            }
            
            if (isScanning) {
              requestAnimationFrame(detectQR);
            }
          };
          
          detectQR();
        });
        
      } else {
        const qrData = prompt('QR Code scanning not supported. Please enter member ID manually:');
        if (qrData) {
          setScannedData(qrData);
          await handleQRData(qrData);
        }
      }
    } catch (error) {
      console.error('Camera access error:', error);
      toast.error('Camera access denied. Please enter member ID manually.');
      
      const qrData = prompt('Please enter member ID:');
      if (qrData) {
        setScannedData(qrData);
        await handleQRData(qrData);
      }
    } finally {
      setIsScanning(false);
    }
  };

  const handleQRData = async (qrData: string) => {
    try {
      setIsLoading(true);
      
      let memberId = qrData;
      
      try {
        const parsed = JSON.parse(qrData);
        memberId = parsed.member_id || parsed.id || qrData;
      } catch {
      }
      
      const userData = await apiClient.getUserByMemberId(memberId);
      setUser(userData);
      
      toast.success(`User found: ${userData.username}`);
    } catch (error) {
      console.error('Error fetching user:', error);
      toast.error('User not found. Please check the QR code.');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleIssuePoints = async () => {
    if (!user || !store || !amount) {
      toast.error('Please scan QR code and enter amount');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      setIsLoading(true);
      
      const response = await apiClient.issuePoints({
        user_id: user.id,
        store_id: store.id,
        amount: amountNum,
        description: `Point issuance at ${store.name}`
      });

      if (response.success) {
        setLastTransaction(response);
        toast.success(`Successfully issued ${response.transaction?.points_issued} points!`);
        
        setUser(null);
        setScannedData('');
        setAmount('');
      } else {
        toast.error(response.error || 'Failed to issue points');
      }
    } catch (error) {
      console.error('Error issuing points:', error);
      toast.error('Failed to issue points. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              Point Issuance
            </CardTitle>
            <CardDescription>
              Scan customer QR code to issue points
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {store && (
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                <StoreIcon className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900">{store.name}</p>
                  <p className="text-sm text-blue-600">Point Rate: {(store.point_rate * 100).toFixed(0)}%</p>
                </div>
              </div>
            )}

            <Button
              onClick={handleQRScan}
              disabled={isScanning || isLoading}
              className="w-full"
              size="lg"
            >
              <Scan className="h-4 w-4 mr-2" />
              {isScanning ? 'Scanning...' : 'Scan QR Code'}
            </Button>

            {scannedData && (
              <div className="p-3 bg-gray-100 rounded-lg">
                <p className="text-sm text-gray-600">Scanned Data:</p>
                <p className="font-mono text-sm">{scannedData}</p>
              </div>
            )}

            {user && (
              <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                <UserIcon className="h-4 w-4 text-green-600" />
                <div>
                  <p className="font-medium text-green-900">{user.username}</p>
                  <p className="text-sm text-green-600">Current Points: {user.points}</p>
                  <p className="text-sm text-green-600">Member ID: {user.member_id}</p>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="amount">Purchase Amount (¥)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter purchase amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={isLoading}
              />
              {amount && store && (
                <p className="text-sm text-gray-600">
                  Points to issue: {Math.floor(parseFloat(amount || '0') * store.point_rate)}
                </p>
              )}
            </div>

            <Button
              onClick={handleIssuePoints}
              disabled={!user || !amount || isLoading}
              className="w-full"
              size="lg"
            >
              {isLoading ? 'Processing...' : 'Issue Points'}
            </Button>
          </CardContent>
        </Card>

        {lastTransaction && lastTransaction.success && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                Transaction Complete
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p><strong>Transaction ID:</strong> {lastTransaction.transaction?.transaction_id}</p>
                <p><strong>Amount:</strong> ¥{lastTransaction.transaction?.amount}</p>
                <p><strong>Points Issued:</strong> {lastTransaction.transaction?.points_issued}</p>
                <p><strong>Status:</strong> {lastTransaction.transaction?.status}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
