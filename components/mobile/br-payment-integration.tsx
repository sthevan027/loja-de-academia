'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PaymentMethod {
  id: string;
  name: string;
  gateway: 'mercadopago' | 'pagseguro' | 'pagarme' | 'cielo';
  icon: string;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'pix',
    name: 'PIX',
    gateway: 'mercadopago',
    icon: '💰'
  },
  {
    id: 'boleto',
    name: 'Boleto',
    gateway: 'pagseguro',
    icon: '📄'
  },
  {
    id: 'credit-card',
    name: 'Cartão de Crédito',
    gateway: 'cielo',
    icon: '💳'
  },
  {
    id: 'debit-card',
    name: 'Cartão de Débito',
    gateway: 'pagarme',
    icon: '💳'
  }
];

export function BRPaymentIntegration() {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cpf, setCpf] = useState('');
  const [installments, setInstallments] = useState('1');

  const handlePayment = async () => {
    if (!selectedMethod) {
      toast.error('Selecione um método de pagamento');
      return;
    }

    setIsProcessing(true);

    try {
      const method = paymentMethods.find(m => m.id === selectedMethod);
      if (!method) return;

      // Simulação de integração com o gateway
      await new Promise(resolve => setTimeout(resolve, 2000));

      switch (method.gateway) {
        case 'mercadopago':
          // Implementar integração com Mercado Pago
          toast.success('Pagamento via Mercado Pago iniciado!');
          break;
        case 'pagseguro':
          // Implementar integração com PagSeguro
          toast.success('Pagamento via PagSeguro iniciado!');
          break;
        case 'pagarme':
          // Implementar integração com Pagar.me
          toast.success('Pagamento via Pagar.me iniciado!');
          break;
        case 'cielo':
          // Implementar integração com Cielo
          toast.success('Pagamento via Cielo iniciado!');
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
      <Card>
        <CardHeader>
          <CardTitle>Pagamento</CardTitle>
          <CardDescription>
            Escolha sua forma de pagamento preferida
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>CPF</Label>
            <Input
              placeholder="000.000.000-00"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Método de Pagamento</Label>
            <Select
              value={selectedMethod || ''}
              onValueChange={setSelectedMethod}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um método" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map(method => (
                  <SelectItem key={method.id} value={method.id}>
                    <div className="flex items-center space-x-2">
                      <span>{method.icon}</span>
                      <span>{method.name}</span>
                      <span className="text-xs text-gray-500">
                        ({method.gateway})
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedMethod === 'credit-card' && (
            <div className="space-y-2">
              <Label>Parcelas</Label>
              <Select
                value={installments}
                onValueChange={setInstallments}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o número de parcelas" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(num => (
                    <SelectItem key={num} value={num.toString()}>
                      {num}x
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <Button
            className="w-full"
            onClick={handlePayment}
            disabled={!selectedMethod || isProcessing}
          >
            {isProcessing ? 'Processando...' : 'Pagar Agora'}
          </Button>

          <div className="text-sm text-gray-500">
            <p>Métodos de pagamento disponíveis:</p>
            <ul className="list-disc list-inside mt-2">
              <li>PIX (Mercado Pago)</li>
              <li>Boleto (PagSeguro)</li>
              <li>Cartão de Crédito (Cielo)</li>
              <li>Cartão de Débito (Pagar.me)</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 