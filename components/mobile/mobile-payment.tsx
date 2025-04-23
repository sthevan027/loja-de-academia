'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  platforms: ('ios' | 'android' | 'web')[];
  description: string;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'pix',
    name: 'PIX',
    icon: '💰',
    platforms: ['ios', 'android', 'web'],
    description: 'Pagamento instantâneo via PIX'
  },
  {
    id: 'credit-card',
    name: 'Cartão de Crédito',
    icon: '💳',
    platforms: ['ios', 'android', 'web'],
    description: 'Pague com seu cartão de crédito'
  },
  {
    id: 'google-pay',
    name: 'Google Pay',
    icon: '📱',
    platforms: ['android'],
    description: 'Pagamento rápido e seguro com Google Pay'
  },
  {
    id: 'apple-pay',
    name: 'Apple Pay',
    icon: '🍎',
    platforms: ['ios'],
    description: 'Pagamento rápido e seguro com Apple Pay'
  }
];

interface MobilePaymentProps {
  platform: 'ios' | 'android' | 'other';
}

export function MobilePayment({ platform }: MobilePaymentProps) {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const availableMethods = paymentMethods.filter(method => 
    method.platforms.includes(platform) || method.platforms.includes('web')
  );

  const handlePayment = async () => {
    if (!selectedMethod) {
      toast.error('Selecione um método de pagamento');
      return;
    }

    setIsProcessing(true);

    try {
      // Simulação de processamento de pagamento
      await new Promise(resolve => setTimeout(resolve, 2000));

      switch (selectedMethod) {
        case 'pix':
          // Implementar integração com PIX
          toast.success('Pagamento via PIX iniciado!');
          break;
        case 'credit-card':
          // Implementar integração com cartão de crédito
          toast.success('Pagamento com cartão processado!');
          break;
        case 'google-pay':
          if (platform === 'android') {
            // Implementar integração com Google Pay
            toast.success('Pagamento via Google Pay iniciado!');
          }
          break;
        case 'apple-pay':
          if (platform === 'ios') {
            // Implementar integração com Apple Pay
            toast.success('Pagamento via Apple Pay iniciado!');
          }
          break;
      }
    } catch (error) {
      toast.error('Erro ao processar pagamento');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {availableMethods.map(method => (
          <Card
            key={method.id}
            className={`cursor-pointer transition-all ${
              selectedMethod === method.id ? 'border-primary ring-2 ring-primary' : ''
            }`}
            onClick={() => setSelectedMethod(method.id)}
          >
            <CardContent className="p-4">
              <div className="flex flex-col items-center space-y-2">
                <span className="text-3xl">{method.icon}</span>
                <span className="font-medium">{method.name}</span>
                <span className="text-sm text-gray-500 text-center">
                  {method.description}
                </span>
                <div className="flex space-x-1">
                  {method.platforms.map(p => (
                    <Badge key={p} variant="outline">
                      {p === 'ios' ? 'iOS' : p === 'android' ? 'Android' : 'Web'}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button
        className="w-full"
        onClick={handlePayment}
        disabled={!selectedMethod || isProcessing}
      >
        {isProcessing ? 'Processando...' : 'Pagar Agora'}
      </Button>

      {platform === 'ios' && (
        <p className="text-sm text-gray-500 text-center">
          No iOS, você pode usar Apple Pay para pagamentos rápidos e seguros.
        </p>
      )}

      {platform === 'android' && (
        <p className="text-sm text-gray-500 text-center">
          No Android, você pode usar Google Pay para pagamentos rápidos e seguros.
        </p>
      )}
    </div>
  );
} 