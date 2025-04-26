'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const promotionSchema = z.object({
  name: z.string().min(3, 'Nome muito curto'),
  description: z.string().min(10, 'Descrição muito curta'),
  discount: z.number().min(0).max(100, 'Desconto inválido'),
  startDate: z.string().min(1, 'Data inicial obrigatória'),
  endDate: z.string().min(1, 'Data final obrigatória'),
  products: z.array(z.string()).min(1, 'Selecione pelo menos um produto'),
});

type PromotionForm = z.infer<typeof promotionSchema>;

export function PromotionManagement() {
  const [promotions, setPromotions] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<PromotionForm>({
    resolver: zodResolver(promotionSchema),
    defaultValues: {
      name: '',
      description: '',
      discount: 0,
      startDate: '',
      endDate: '',
      products: [],
    },
  });

  const onSubmit = async (data: PromotionForm) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/promotions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Erro ao adicionar promoção');

      toast.success('Promoção adicionada com sucesso');
      form.reset();
      fetchPromotions();
    } catch (error) {
      toast.error('Erro ao adicionar promoção');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPromotions = async () => {
    try {
      const response = await fetch('/api/admin/promotions');
      const data = await response.json();
      setPromotions(data);
    } catch (error) {
      toast.error('Erro ao carregar promoções');
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/admin/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      toast.error('Erro ao carregar produtos');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Adicionar Nova Promoção</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nome da Promoção</Label>
                <Input {...form.register('name')} />
                {form.formState.errors.name && (
                  <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Desconto (%)</Label>
                <Input
                  type="number"
                  {...form.register('discount', { valueAsNumber: true })}
                />
                {form.formState.errors.discount && (
                  <p className="text-sm text-red-500">{form.formState.errors.discount.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Data Inicial</Label>
                <Input
                  type="datetime-local"
                  {...form.register('startDate')}
                />
                {form.formState.errors.startDate && (
                  <p className="text-sm text-red-500">{form.formState.errors.startDate.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Data Final</Label>
                <Input
                  type="datetime-local"
                  {...form.register('endDate')}
                />
                {form.formState.errors.endDate && (
                  <p className="text-sm text-red-500">{form.formState.errors.endDate.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Descrição</Label>
              <Input {...form.register('description')} />
              {form.formState.errors.description && (
                <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Produtos</Label>
              <select
                multiple
                {...form.register('products')}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
              >
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
              {form.formState.errors.products && (
                <p className="text-sm text-red-500">{form.formState.errors.products.message}</p>
              )}
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Adicionando...' : 'Adicionar Promoção'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Promoções Ativas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Desconto</TableHead>
                <TableHead>Início</TableHead>
                <TableHead>Fim</TableHead>
                <TableHead>Produtos</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {promotions.map((promotion) => (
                <TableRow key={promotion.id}>
                  <TableCell>{promotion.name}</TableCell>
                  <TableCell>{promotion.discount}%</TableCell>
                  <TableCell>{new Date(promotion.startDate).toLocaleString()}</TableCell>
                  <TableCell>{new Date(promotion.endDate).toLocaleString()}</TableCell>
                  <TableCell>
                    {promotion.products.length} produtos
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      Editar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 