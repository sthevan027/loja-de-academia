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

const categorySchema = z.object({
  name: z.string().min(3, 'Nome muito curto'),
  slug: z.string().min(3, 'Slug muito curto'),
  description: z.string().min(10, 'Descrição muito curta'),
});

const subcategorySchema = z.object({
  name: z.string().min(3, 'Nome muito curto'),
  slug: z.string().min(3, 'Slug muito curto'),
  categoryId: z.string().min(1, 'Selecione uma categoria'),
});

type CategoryForm = z.infer<typeof categorySchema>;
type SubcategoryForm = z.infer<typeof subcategorySchema>;

export function CategoryManagement() {
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const categoryForm = useForm<CategoryForm>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
    },
  });

  const subcategoryForm = useForm<SubcategoryForm>({
    resolver: zodResolver(subcategorySchema),
    defaultValues: {
      name: '',
      slug: '',
      categoryId: '',
    },
  });

  const onSubmitCategory = async (data: CategoryForm) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Erro ao adicionar categoria');

      toast.success('Categoria adicionada com sucesso');
      categoryForm.reset();
      fetchCategories();
    } catch (error) {
      toast.error('Erro ao adicionar categoria');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitSubcategory = async (data: SubcategoryForm) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/subcategories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Erro ao adicionar subcategoria');

      toast.success('Subcategoria adicionada com sucesso');
      subcategoryForm.reset();
      fetchSubcategories();
    } catch (error) {
      toast.error('Erro ao adicionar subcategoria');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      toast.error('Erro ao carregar categorias');
    }
  };

  const fetchSubcategories = async () => {
    try {
      const response = await fetch('/api/admin/subcategories');
      const data = await response.json();
      setSubcategories(data);
    } catch (error) {
      toast.error('Erro ao carregar subcategorias');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Adicionar Nova Categoria</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={categoryForm.handleSubmit(onSubmitCategory)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nome da Categoria</Label>
                <Input {...categoryForm.register('name')} />
                {categoryForm.formState.errors.name && (
                  <p className="text-sm text-red-500">{categoryForm.formState.errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Slug</Label>
                <Input {...categoryForm.register('slug')} />
                {categoryForm.formState.errors.slug && (
                  <p className="text-sm text-red-500">{categoryForm.formState.errors.slug.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Descrição</Label>
              <Input {...categoryForm.register('description')} />
              {categoryForm.formState.errors.description && (
                <p className="text-sm text-red-500">{categoryForm.formState.errors.description.message}</p>
              )}
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Adicionando...' : 'Adicionar Categoria'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Adicionar Nova Subcategoria</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={subcategoryForm.handleSubmit(onSubmitSubcategory)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nome da Subcategoria</Label>
                <Input {...subcategoryForm.register('name')} />
                {subcategoryForm.formState.errors.name && (
                  <p className="text-sm text-red-500">{subcategoryForm.formState.errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Slug</Label>
                <Input {...subcategoryForm.register('slug')} />
                {subcategoryForm.formState.errors.slug && (
                  <p className="text-sm text-red-500">{subcategoryForm.formState.errors.slug.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Categoria</Label>
                <select
                  {...subcategoryForm.register('categoryId')}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                >
                  <option value="">Selecione uma categoria</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {subcategoryForm.formState.errors.categoryId && (
                  <p className="text-sm text-red-500">{subcategoryForm.formState.errors.categoryId.message}</p>
                )}
              </div>
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Adicionando...' : 'Adicionar Subcategoria'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Categorias Cadastradas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{category.slug}</TableCell>
                  <TableCell>{category.description}</TableCell>
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

      <Card>
        <CardHeader>
          <CardTitle>Subcategorias Cadastradas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subcategories.map((subcategory) => (
                <TableRow key={subcategory.id}>
                  <TableCell>{subcategory.name}</TableCell>
                  <TableCell>{subcategory.slug}</TableCell>
                  <TableCell>
                    {categories.find((c) => c.id === subcategory.categoryId)?.name}
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