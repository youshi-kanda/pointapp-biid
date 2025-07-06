'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { User } from '@/lib/api';
import { Nfc, Smartphone, User as UserIcon, AlertTriangle, CheckCircle } from 'lucide-react';

interface NFCReadResult {
  uid: string;
  timestamp: number;
}

interface NFCReadingEvent {
  serialNumber: string;
}

interface NDEFReader {
  addEventListener: (event: string, callback: (event: NFCReadingEvent) => void) => void;
  scan: () => Promise<void>;
}

export default function NFCProtoPage() {
  const [isReading, setIsReading] = useState(false);
  const [nfcSupported, setNfcSupported] = useState<boolean | null>(null);
  const [lastRead, setLastRead] = useState<NFCReadResult | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [manualUid, setManualUid] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    checkNFCSupport();
  }, []);

  const checkNFCSupport = () => {
    if (typeof window !== 'undefined' && 'NDEFReader' in window) {
      setNfcSupported(true);
      return true;
    } else {
      setNfcSupported(false);
      if (typeof window !== 'undefined') {
        toast.error('NFC is not supported on this device. Please use Android Chrome.');
      }
      return false;
    }
  };

  const handleNFCRead = async () => {
    if (!isClient || !checkNFCSupport()) return;

    setIsReading(true);
    setUser(null);

    try {
      const ndef = new (window as unknown as { NDEFReader: new () => NDEFReader }).NDEFReader();
      
      toast.info('Hold your NFC card near the device...');

      ndef.addEventListener('reading', async (event: NFCReadingEvent) => {
        const uid = event.serialNumber;
        const readResult: NFCReadResult = {
          uid: uid,
          timestamp: Date.now()
        };
        
        setLastRead(readResult);
        setIsReading(false);
        
        toast.success(`NFC UID read: ${uid}`);
        
        await lookupUserByUID(uid);
      });

      ndef.addEventListener('readingerror', () => {
        toast.error('Failed to read NFC tag. Please try again.');
        setIsReading(false);
      });

      await ndef.scan();
      
    } catch (error) {
      console.error('NFC read error:', error);
      toast.error('NFC reading failed. Make sure NFC is enabled and try again.');
      setIsReading(false);
    }
  };

  const lookupUserByUID = async (uid: string) => {
    try {
      setIsLoading(true);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/nfc/lookup/${uid}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user);
        toast.success(`User found: ${userData.user.username}`);
      } else if (response.status === 404) {
        toast.error('No user found for this NFC UID');
        setUser(null);
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.error('Error looking up user:', error);
      toast.error('Failed to lookup user. Please try again.');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualLookup = async () => {
    if (!manualUid.trim()) {
      toast.error('Please enter a valid NFC UID');
      return;
    }

    await lookupUserByUID(manualUid.trim());
  };

  const stopNFCReading = () => {
    setIsReading(false);
    toast.info('NFC reading stopped');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Nfc className="h-5 w-5" />
              NFC Prototype
            </CardTitle>
            <CardDescription>
              Read NFC UID and lookup user information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* NFC Support Status */}
            <div className={`flex items-center gap-2 p-3 rounded-lg ${
              nfcSupported === true ? 'bg-green-50' : 
              nfcSupported === false ? 'bg-red-50' : 'bg-gray-50'
            }`}>
              {nfcSupported === true ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-green-900">NFC is supported</span>
                </>
              ) : nfcSupported === false ? (
                <>
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <span className="text-red-900">NFC not supported</span>
                </>
              ) : (
                <>
                  <Smartphone className="h-4 w-4 text-gray-600" />
                  <span className="text-gray-900">Checking NFC support...</span>
                </>
              )}
            </div>

            {/* NFC Reading Controls */}
            <div className="space-y-3">
              <Button
                onClick={isReading ? stopNFCReading : handleNFCRead}
                disabled={nfcSupported === false || isLoading}
                className="w-full"
                size="lg"
                variant={isReading ? "destructive" : "default"}
              >
                <Nfc className="h-4 w-4 mr-2" />
                {isReading ? 'Stop Reading' : 'Start NFC Reading'}
              </Button>

              {isReading && (
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="animate-pulse">
                    <Nfc className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                    <p className="text-blue-900 font-medium">Waiting for NFC tag...</p>
                    <p className="text-blue-600 text-sm">Hold your NFC card near the device</p>
                  </div>
                </div>
              )}
            </div>

            {/* Manual UID Input */}
            <div className="space-y-2 border-t pt-4">
              <Label htmlFor="manual-uid">Manual UID Lookup</Label>
              <div className="flex gap-2">
                <Input
                  id="manual-uid"
                  placeholder="Enter NFC UID manually"
                  value={manualUid}
                  onChange={(e) => setManualUid(e.target.value)}
                  disabled={isLoading}
                />
                <Button
                  onClick={handleManualLookup}
                  disabled={isLoading || !manualUid.trim()}
                  variant="outline"
                >
                  Lookup
                </Button>
              </div>
            </div>

            {/* Last Read Result */}
            {lastRead && (
              <div className="p-3 bg-gray-100 rounded-lg">
                <p className="text-sm text-gray-600">Last Read:</p>
                <p className="font-mono text-sm">{lastRead.uid}</p>
                <p className="text-xs text-gray-500">
                  {new Date(lastRead.timestamp).toLocaleString()}
                </p>
              </div>
            )}

            {/* User Information */}
            {isLoading && (
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-blue-900">Looking up user...</span>
              </div>
            )}

            {user && (
              <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                <UserIcon className="h-4 w-4 text-green-600" />
                <div>
                  <p className="font-medium text-green-900">{user.username}</p>
                  <p className="text-sm text-green-600">Points: {user.points}</p>
                  <p className="text-sm text-green-600">Member ID: {user.member_id}</p>
                  <p className="text-sm text-green-600">Status: {user.status}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Device Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Device Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p><strong>User Agent:</strong> {isClient ? navigator.userAgent : 'Loading...'}</p>
              <p><strong>Platform:</strong> {isClient ? navigator.platform : 'Loading...'}</p>
              <p><strong>NFC Support:</strong> {isClient && typeof window !== 'undefined' && 'NDEFReader' in window ? 'Yes' : 'No'}</p>
              <p><strong>HTTPS:</strong> {isClient && typeof window !== 'undefined' ? (location.protocol === 'https:' ? 'Yes' : 'No') : 'Loading...'}</p>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• NFC reading requires Android Chrome with HTTPS</p>
              <p>• Make sure NFC is enabled in device settings</p>
              <p>• Hold NFC card close to the back of your device</p>
              <p>• Use manual input for testing without NFC hardware</p>
              <p>• The UID will be used to lookup user information</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
