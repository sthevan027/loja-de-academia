'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  specifications: {
    [key: string]: string;
  };
  image: string;
}

interface ProductComparisonProps {
  products: Product[];
  onAddProduct: (productId: string) => void;
  onRemoveProduct: (productId: string) => void;
}

export function ProductComparison({ products, onAddProduct, onRemoveProduct }: ProductComparisonProps) {
  const [selectedProduct, setSelectedProduct] = useState<string>('');

  const handleAddProduct = () => {
    if (selectedProduct) {
      onAddProduct(selectedProduct);
      setSelectedProduct('');
    }
  };

  const allSpecifications = Array.from(
    new Set(products.flatMap((product) => Object.keys(product.specifications)))
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparar Produtos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Select value={selectedProduct} onValueChange={setSelectedProduct}>
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder="Selecione um produto" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleAddProduct}>Adicionar</Button>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Especificação</TableHead>
                  {products.map((product) => (
                    <TableHead key={product.id}>
                      <div className="flex items-center justify-between">
                        <span>{product.name}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onRemoveProduct(product.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {allSpecifications.map((spec) => (
                  <TableRow key={spec}>
                    <TableCell className="font-medium">{spec}</TableCell>
                    {products.map((product) => (
                      <TableCell key={`${product.id}-${spec}`}>
                        {product.specifications[spec] || '-'}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell className="font-medium">Preço</TableCell>
                  {products.map((product) => (
                    <TableCell key={`${product.id}-price`}>
                      R$ {product.price.toFixed(2)}
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 