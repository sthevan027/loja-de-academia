'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function BRMobileFeatures() {
  const [activeTab, setActiveTab] = useState<'pix' | 'boleto' | 'cartao' | 'local'>('pix');
  const [cpf, setCpf] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    // Verificar localização para lojas próximas
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Erro ao obter localização:', error);
        }
      );
    }
  }, []);

  const handlePixPayment = async () => {
    setIsProcessing(true);
    try {
      // Simulação de geração de PIX
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('PIX gerado com sucesso!');
      // Aqui você implementaria a geração real do PIX
    } catch (error) {
      toast.error('Erro ao gerar PIX');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBoletoPayment = async () => {
    setIsProcessing(true);
    try {
      // Simulação de geração de boleto
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Boleto gerado com sucesso!');
      // Aqui você implementaria a geração real do boleto
    } catch (error) {
      toast.error('Erro ao gerar boleto');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCartaoPayment = async () => {
    if (!cpf) {
      toast.error('Por favor, informe seu CPF');
      return;
    }
    setIsProcessing(true);
    try {
      // Simulação de pagamento com cartão
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Pagamento com cartão processado!');
      // Aqui você implementaria o processamento real do cartão
    } catch (error) {
      toast.error('Erro ao processar pagamento');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4">
        <Tabs defaultValue="pix" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="pix" className="flex-1">
              PIX
            </TabsTrigger>
            <TabsTrigger value="boleto" className="flex-1">
              Boleto
            </TabsTrigger>
            <TabsTrigger value="cartao" className="flex-1">
              Cartão
            </TabsTrigger>
            <TabsTrigger value="local" className="flex-1">
              Lojas Próximas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pix" className="p-4">
            <Card>
              <CardHeader>
                <CardTitle>Pagamento via PIX</CardTitle>
                <CardDescription>
                  Pague instantaneamente usando PIX
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>CPF (opcional)</Label>
                  <Input
                    placeholder="000.000.000-00"
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                  />
                </div>
                <Button
                  className="w-full"
                  onClick={handlePixPayment}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Gerando PIX...' : 'Gerar PIX'}
                </Button>
                <p className="text-sm text-gray-500 text-center">
                  O PIX será gerado e você poderá pagar usando seu banco
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="boleto" className="p-4">
            <Card>
              <CardHeader>
                <CardTitle>Pagamento via Boleto</CardTitle>
                <CardDescription>
                  Pague com boleto bancário
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>CPF (opcional)</Label>
                  <Input
                    placeholder="000.000.000-00"
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                  />
                </div>
                <Button
                  className="w-full"
                  onClick={handleBoletoPayment}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Gerando Boleto...' : 'Gerar Boleto'}
                </Button>
                <p className="text-sm text-gray-500 text-center">
                  O boleto será gerado e você poderá pagar em qualquer banco
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cartao" className="p-4">
            <Card>
              <CardHeader>
                <CardTitle>Pagamento com Cartão</CardTitle>
                <CardDescription>
                  Pague com cartão de crédito ou débito
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>CPF (obrigatório)</Label>
                  <Input
                    placeholder="000.000.000-00"
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                    required
                  />
                </div>
                <Button
                  className="w-full"
                  onClick={handleCartaoPayment}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processando...' : 'Pagar com Cartão'}
                </Button>
                <p className="text-sm text-gray-500 text-center">
                  Aceitamos todos os cartões de crédito e débito
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="local" className="p-4">
            <Card>
              <CardHeader>
                <CardTitle>Lojas Próximas</CardTitle>
                <CardDescription>
                  Encontre nossas lojas mais próximas
                </CardDescription>
              </CardHeader>
              <CardContent>
                {location ? (
                  <div className="space-y-4">
                    <p className="text-sm">
                      Sua localização: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                    </p>
                    <div className="space-y-2">
                      <h3 className="font-medium">Lojas próximas:</h3>
                      <ul className="space-y-2">
                        <li className="flex items-center justify-between p-2 bg-gray-100 rounded">
                          <span>Ritmoalpha Shopping Ibirapuera</span>
                          <Badge>1.2km</Badge>
                        </li>
                        <li className="flex items-center justify-between p-2 bg-gray-100 rounded">
                          <span>Ritmoalpha Shopping Morumbi</span>
                          <Badge>2.5km</Badge>
                        </li>
                        <li className="flex items-center justify-between p-2 bg-gray-100 rounded">
                          <span>Ritmoalpha Shopping Eldorado</span>
                          <Badge>3.8km</Badge>
                        </li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    Por favor, permita o acesso à sua localização para encontrar lojas próximas
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 