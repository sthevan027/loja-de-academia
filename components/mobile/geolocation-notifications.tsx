'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function GeolocationNotifications() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    // Verificar permissão de notificações
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }

    // Registrar service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('Service Worker registrado com sucesso:', registration);
        })
        .catch(error => {
          console.error('Erro ao registrar Service Worker:', error);
        });
    }
  }, []);

  const requestLocationPermission = async () => {
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      setLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      });

      toast.success('Localização obtida com sucesso!');
    } catch (error) {
      toast.error('Erro ao obter localização. Verifique as permissões.');
    }
  };

  const requestNotificationPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);

      if (permission === 'granted') {
        toast.success('Notificações ativadas com sucesso!');
      } else {
        toast.error('Permissão para notificações negada.');
      }
    } catch (error) {
      toast.error('Erro ao solicitar permissão de notificações.');
    }
  };

  return (
    <div className="space-y-4 p-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Geolocalização</h3>
        {location ? (
          <p className="text-sm text-gray-600">
            Sua localização: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
          </p>
        ) : (
          <Button onClick={requestLocationPermission}>
            Permitir Localização
          </Button>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Notificações</h3>
        {notificationPermission === 'granted' ? (
          <p className="text-sm text-gray-600">Notificações ativadas</p>
        ) : (
          <Button onClick={requestNotificationPermission}>
            Ativar Notificações
          </Button>
        )}
      </div>
    </div>
  );
} 