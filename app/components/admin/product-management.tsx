'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const productSchema = z.object({
  name: z.string().min(3, 'Nome muito curto'),
  description: z.string().min(10, 'Descrição muito curta'),
  price: z.number().min(0, 'Preço inválido'),
  category: z.string().min(1, 'Selecione uma categoria'),
  subcategory: z.string().min(1, 'Selecione uma subcategoria'),
  stock: z.number().min(0, 'Estoque inválido'),
  image: z.string().url('URL da imagem inválida'),
});

type ProductForm = z.infer<typeof productSchema>;

export function ProductManagement() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([
    { id: '1', name: 'Homens' },
    { id: '2', name: 'Mulheres' },
    { id: '3', name: 'Acessórios' },
    { id: '4', name: 'Promoções' },
  ]);
  const [subcategories, setSubcategories] = useState([
    { id: '1', name: 'Oversized', categoryId: '1' },
    { id: '2', name: 'Dry Fit', categoryId: '1' },
    { id: '3', name: 'Shorts e Calças', categoryId: '1' },
    { id: '4', name: 'Camisetas e Regatas', categoryId: '1' },
  ]);

  const form = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      category: '',
      subcategory: '',
      stock: 0,
      image: '',
    },
  });

  const onSubmit = async (data: ProductForm) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Erro ao adicionar produto');

      toast.success('Produto adicionado com sucesso');
      form.reset();
      fetchProducts();
    } catch (error) {
      toast.error('Erro ao adicionar produto');
    } finally {
      setIsLoading(false);
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
          <CardTitle>Adicionar Novo Produto</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nome do Produto</Label>
                <Input {...form.register('name')} />
                {form.formState.errors.name && (
                  <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Preço</Label>
                <Input
                  type="number"
                  {...form.register('price', { valueAsNumber: true })}
                />
                {form.formState.errors.price && (
                  <p className="text-sm text-red-500">{form.formState.errors.price.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Categoria</Label>
                <Select
                  onValueChange={(value) => {
                    form.setValue('category', value);
                    form.setValue('subcategory', '');
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.category && (
                  <p className="text-sm text-red-500">{form.formState.errors.category.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Subcategoria</Label>
                <Select
                  onValueChange={(value) => form.setValue('subcategory', value)}
                  disabled={!form.watch('category')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma subcategoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {subcategories
                      .filter((sub) => sub.categoryId === form.watch('category'))
                      .map((subcategory) => (
                        <SelectItem key={subcategory.id} value={subcategory.id}>
                          {subcategory.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.subcategory && (
                  <p className="text-sm text-red-500">{form.formState.errors.subcategory.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Estoque</Label>
                <Input
                  type="number"
                  {...form.register('stock', { valueAsNumber: true })}
                />
                {form.formState.errors.stock && (
                  <p className="text-sm text-red-500">{form.formState.errors.stock.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>URL da Imagem</Label>
                <Input {...form.register('image')} />
                {form.formState.errors.image && (
                  <p className="text-sm text-red-500">{form.formState.errors.image.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Descrição</Label>
              <Textarea {...form.register('description')} />
              {form.formState.errors.description && (
                <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>
              )}
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Adicionando...' : 'Adicionar Produto'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Produtos Cadastrados</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Subcategoria</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Estoque</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>
                    {categories.find((c) => c.id === product.category)?.name}
                  </TableCell>
                  <TableCell>
                    {subcategories.find((s) => s.id === product.subcategory)?.name}
                  </TableCell>
                  <TableCell>R$ {product.price.toFixed(2)}</TableCell>
                  <TableCell>{product.stock}</TableCell>
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