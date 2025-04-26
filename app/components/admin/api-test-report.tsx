'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface ApiTest {
  endpoint: string;
  method: string;
  status: 'success' | 'error' | 'pending';
  responseTime: number;
  lastTested: string;
  error?: string;
}

export function ApiTestReport() {
  const [tests, setTests] = useState<ApiTest[]>([
    {
      endpoint: '/api/products',
      method: 'GET',
      status: 'pending',
      responseTime: 0,
      lastTested: '',
    },
    {
      endpoint: '/api/categories',
      method: 'GET',
      status: 'pending',
      responseTime: 0,
      lastTested: '',
    },
    {
      endpoint: '/api/promotions',
      method: 'GET',
      status: 'pending',
      responseTime: 0,
      lastTested: '',
    },
    {
      endpoint: '/api/checkout',
      method: 'POST',
      status: 'pending',
      responseTime: 0,
      lastTested: '',
    },
    {
      endpoint: '/api/payment',
      method: 'POST',
      status: 'pending',
      responseTime: 0,
      lastTested: '',
    },
  ]);

  const runTests = async () => {
    const newTests = [...tests];
    
    for (let i = 0; i < newTests.length; i++) {
      const test = newTests[i];
      test.status = 'pending';
      test.lastTested = new Date().toISOString();
      
      try {
        const startTime = performance.now();
        const response = await fetch(test.endpoint, {
          method: test.method,
          headers: {
            'Content-Type': 'application/json',
          },
          ...(test.method === 'POST' && {
            body: JSON.stringify({
              test: true,
            }),
          }),
        });

        const endTime = performance.now();
        test.responseTime = endTime - startTime;
        
        if (response.ok) {
          test.status = 'success';
        } else {
          test.status = 'error';
          test.error = `Status: ${response.status}`;
        }
      } catch (error) {
        test.status = 'error';
        test.error = error instanceof Error ? error.message : 'Erro desconhecido';
      }
      
      setTests([...newTests]);
    }

    toast.success('Testes concluídos');
  };

  const getStatusBadge = (status: ApiTest['status']) => {
    const statusMap = {
      success: { label: 'Sucesso', variant: 'success' },
      error: { label: 'Erro', variant: 'destructive' },
      pending: { label: 'Pendente', variant: 'secondary' },
    };
    const { label, variant } = statusMap[status];
    return <Badge variant={variant as any}>{label}</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Relatório de Testes de API</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Button onClick={runTests}>Executar Testes</Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Endpoint</TableHead>
              <TableHead>Método</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tempo de Resposta (ms)</TableHead>
              <TableHead>Último Teste</TableHead>
              <TableHead>Erro</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tests.map((test, index) => (
              <TableRow key={index}>
                <TableCell>{test.endpoint}</TableCell>
                <TableCell>{test.method}</TableCell>
                <TableCell>{getStatusBadge(test.status)}</TableCell>
                <TableCell>{test.responseTime.toFixed(2)}</TableCell>
                <TableCell>
                  {test.lastTested ? new Date(test.lastTested).toLocaleString() : '-'}
                </TableCell>
                <TableCell>{test.error || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
} 