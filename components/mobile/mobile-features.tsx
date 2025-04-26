'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { GeolocationNotifications } from './geolocation-notifications';
import { MobilePayment } from './mobile-payment';
import { PWAInstall } from './pwa-install';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function MobileFeatures() {
  const [activeTab, setActiveTab] = useState<'geolocation' | 'notifications' | 'payment' | 'pwa'>('geolocation');
  const [isOnline, setIsOnline] = useState(true);
  const [platform, setPlatform] = useState<'ios' | 'android' | 'other'>('other');
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Detectar plataforma
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('iphone') || userAgent.includes('ipad')) {
      setPlatform('ios');
    } else if (userAgent.includes('android')) {
      setPlatform('android');
    }

    // Verificar status da conexão
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Verificar nível da bateria
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setBatteryLevel(battery.level * 100);
        battery.addEventListener('levelchange', () => {
          setBatteryLevel(battery.level * 100);
        });
      });
    }

    // Verificar modo escuro
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(darkModeMediaQuery.matches);
    darkModeMediaQuery.addEventListener('change', (e) => setIsDarkMode(e.matches));

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
      {/* Barra de status */}
      <div className={`p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm">{isOnline ? 'Online' : 'Offline'}</span>
            </div>
            {batteryLevel !== null && (
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-sm">{Math.round(batteryLevel)}%</span>
              </div>
            )}
            <Badge variant={platform === 'ios' ? 'default' : 'secondary'}>
              {platform === 'ios' ? 'iOS' : platform === 'android' ? 'Android' : 'Web'}
            </Badge>
          </div>
          <PWAInstall />
        </div>
      </div>

      {/* Navegação */}
      <Tabs defaultValue="geolocation" className="w-full">
        <TabsList className={`w-full ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <TabsTrigger value="geolocation" className="flex-1">
            📍 Localização
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex-1">
            🔔 Notificações
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex-1">
            💳 Pagamento
          </TabsTrigger>
          <TabsTrigger value="pwa" className="flex-1">
            📱 PWA
          </TabsTrigger>
        </TabsList>

        <TabsContent value="geolocation" className="p-4">
          <Card className={isDarkMode ? 'bg-gray-800' : ''}>
            <CardHeader>
              <CardTitle>Geolocalização</CardTitle>
              <CardDescription>
                Permita o acesso à sua localização para encontrar lojas próximas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GeolocationNotifications />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="p-4">
          <Card className={isDarkMode ? 'bg-gray-800' : ''}>
            <CardHeader>
              <CardTitle>Notificações</CardTitle>
              <CardDescription>
                Receba alertas sobre promoções e status do pedido
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button
                  className="w-full"
                  onClick={() => {
                    if ('Notification' in window) {
                      Notification.requestPermission().then(permission => {
                        if (permission === 'granted') {
                          toast.success('Notificações ativadas!');
                        } else {
                          toast.error('Permissão negada para notificações');
                        }
                      });
                    }
                  }}
                >
                  Ativar Notificações
                </Button>
                {platform === 'ios' && (
                  <p className="text-sm text-gray-500">
                    No iOS, você também precisa ativar as notificações nas configurações do dispositivo.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment" className="p-4">
          <Card className={isDarkMode ? 'bg-gray-800' : ''}>
            <CardHeader>
              <CardTitle>Pagamento</CardTitle>
              <CardDescription>
                Escolha sua forma de pagamento preferida
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MobilePayment platform={platform} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pwa" className="p-4">
          <Card className={isDarkMode ? 'bg-gray-800' : ''}>
            <CardHeader>
              <CardTitle>Instalar App</CardTitle>
              <CardDescription>
                Instale o Ritmoalpha para uma experiência melhor
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    Acesso offline
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    Notificações push
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    Experiência nativa
                  </li>
                  {platform === 'ios' && (
                    <li className="flex items-center">
                      <span className="mr-2">✓</span>
                      Suporte ao Apple Pay
                    </li>
                  )}
                  {platform === 'android' && (
                    <li className="flex items-center">
                      <span className="mr-2">✓</span>
                      Suporte ao Google Pay
                    </li>
                  )}
                </ul>
                <PWAInstall />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 