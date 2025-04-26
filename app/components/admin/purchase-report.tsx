'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface Purchase {
  id: string;
  date: string;
  customer: string;
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  paymentMethod: string;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
}

export function PurchaseReport() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [filteredPurchases, setFilteredPurchases] = useState<Purchase[]>([]);
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');

  useEffect(() => {
    fetchPurchases();
  }, []);

  useEffect(() => {
    filterPurchases();
  }, [purchases, dateFilter, statusFilter, paymentFilter]);

  const fetchPurchases = async () => {
    try {
      const response = await fetch('/api/admin/purchases');
      const data = await response.json();
      setPurchases(data);
    } catch (error) {
      toast.error('Erro ao carregar compras');
    }
  };

  const filterPurchases = () => {
    let filtered = [...purchases];

    if (dateFilter) {
      filtered = filtered.filter(purchase => 
        new Date(purchase.date).toISOString().split('T')[0] === dateFilter
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(purchase => purchase.status === statusFilter);
    }

    if (paymentFilter !== 'all') {
      filtered = filtered.filter(purchase => purchase.paymentMethod === paymentFilter);
    }

    setFilteredPurchases(filtered);
  };

  const getStatusBadge = (status: Purchase['status']) => {
    const statusMap = {
      pending: { label: 'Pendente', variant: 'warning' },
      completed: { label: 'Concluído', variant: 'success' },
      cancelled: { label: 'Cancelado', variant: 'destructive' },
    };
    const { label, variant } = statusMap[status];
    return <Badge variant={variant as any}>{label}</Badge>;
  };

  const getTotalSales = () => {
    return filteredPurchases
      .filter(purchase => purchase.status === 'completed')
      .reduce((total, purchase) => total + purchase.total, 0);
  };

  const getAverageTicket = () => {
    const completedPurchases = filteredPurchases.filter(purchase => purchase.status === 'completed');
    if (completedPurchases.length === 0) return 0;
    return getTotalSales() / completedPurchases.length;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Relatório de Compras</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="space-y-2">
              <Label>Data</Label>
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="completed">Concluído</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Método de Pagamento</Label>
              <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o método" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="credit_card">Cartão de Crédito</SelectItem>
                  <SelectItem value="pix">PIX</SelectItem>
                  <SelectItem value="boleto">Boleto</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Ações</Label>
              <Button className="w-full" onClick={fetchPurchases}>
                Atualizar
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Total de Vendas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  R$ {getTotalSales().toFixed(2)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Ticket Médio</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  R$ {getAverageTicket().toFixed(2)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Total de Pedidos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {filteredPurchases.length}
                </p>
              </CardContent>
            </Card>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Itens</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Pagamento</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPurchases.map((purchase) => (
                <TableRow key={purchase.id}>
                  <TableCell>
                    {new Date(purchase.date).toLocaleString()}
                  </TableCell>
                  <TableCell>{purchase.customer}</TableCell>
                  <TableCell>
                    <ul className="list-disc list-inside">
                      {purchase.items.map((item, index) => (
                        <li key={index}>
                          {item.quantity}x {item.name}
                        </li>
                      ))}
                    </ul>
                  </TableCell>
                  <TableCell>R$ {purchase.total.toFixed(2)}</TableCell>
                  <TableCell>{getStatusBadge(purchase.status)}</TableCell>
                  <TableCell>{purchase.paymentMethod}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 