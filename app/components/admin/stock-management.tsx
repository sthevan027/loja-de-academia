'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface StockItem {
  id: string;
  name: string;
  currentStock: number;
  minimumStock: number;
  lastUpdate: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
}

export function StockManagement() {
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<StockItem | null>(null);

  useEffect(() => {
    fetchStockData();
    // Configurar atualização em tempo real
    const interval = setInterval(fetchStockData, 30000); // Atualiza a cada 30 segundos
    return () => clearInterval(interval);
  }, []);

  const fetchStockData = async () => {
    try {
      const response = await fetch('/api/admin/stock');
      const data = await response.json();
      setStockItems(data);
      setIsLoading(false);
    } catch (error) {
      toast.error('Erro ao carregar dados do estoque');
      setIsLoading(false);
    }
  };

  const handleStockUpdate = async (itemId: string, newStock: number) => {
    try {
      const response = await fetch(`/api/admin/stock/${itemId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stock: newStock }),
      });

      if (!response.ok) throw new Error('Erro ao atualizar estoque');

      toast.success('Estoque atualizado com sucesso');
      fetchStockData();
    } catch (error) {
      toast.error('Erro ao atualizar estoque');
    }
  };

  const getStatusBadge = (status: StockItem['status']) => {
    const statusMap = {
      in_stock: { label: 'Em Estoque', variant: 'success' },
      low_stock: { label: 'Estoque Baixo', variant: 'warning' },
      out_of_stock: { label: 'Sem Estoque', variant: 'destructive' },
    };
    const { label, variant } = statusMap[status];
    return <Badge variant={variant as any}>{label}</Badge>;
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerenciamento de Estoque</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produto</TableHead>
              <TableHead>Estoque Atual</TableHead>
              <TableHead>Estoque Mínimo</TableHead>
              <TableHead>Última Atualização</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stockItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>
                  {editingItem?.id === item.id ? (
                    <Input
                      type="number"
                      value={editingItem.currentStock}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          currentStock: parseInt(e.target.value),
                        })
                      }
                    />
                  ) : (
                    item.currentStock
                  )}
                </TableCell>
                <TableCell>{item.minimumStock}</TableCell>
                <TableCell>{new Date(item.lastUpdate).toLocaleString()}</TableCell>
                <TableCell>{getStatusBadge(item.status)}</TableCell>
                <TableCell>
                  {editingItem?.id === item.id ? (
                    <div className="space-x-2">
                      <Button
                        size="sm"
                        onClick={() => {
                          handleStockUpdate(item.id, editingItem.currentStock);
                          setEditingItem(null);
                        }}
                      >
                        Salvar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingItem(null)}
                      >
                        Cancelar
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => setEditingItem(item)}
                    >
                      Editar
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
} 