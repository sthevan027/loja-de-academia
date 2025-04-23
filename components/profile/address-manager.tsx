"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Loader2, Plus, Edit, Trash2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const addressSchema = z.object({
  street: z.string().min(3, { message: "Rua é obrigatória" }),
  number: z.string().min(1, { message: "Número é obrigatório" }),
  complement: z.string().optional(),
  neighborhood: z.string().min(2, { message: "Bairro é obrigatório" }),
  city: z.string().min(2, { message: "Cidade é obrigatória" }),
  state: z.string().length(2, { message: "Estado deve ter 2 caracteres" }),
  zipCode: z.string().min(8, { message: "CEP inválido" }),
  isDefault: z.boolean().default(false),
})

type AddressFormValues = z.infer<typeof addressSchema>

// Dados simulados de endereços
const mockAddresses = [
  {
    id: "1",
    street: "Rua das Flores",
    number: "123",
    complement: "Apto 101",
    neighborhood: "Centro",
    city: "São Paulo",
    state: "SP",
    zipCode: "01234-567",
    isDefault: true,
  },
  {
    id: "2",
    street: "Avenida Brasil",
    number: "456",
    complement: "",
    neighborhood: "Jardins",
    city: "Rio de Janeiro",
    state: "RJ",
    zipCode: "20000-123",
    isDefault: false,
  },
]

interface AddressManagerProps {
  userId: string
}

export default function AddressManager({ userId }: AddressManagerProps) {
  const [addresses, setAddresses] = useState(mockAddresses)
  const [isLoading, setIsLoading] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentAddress, setCurrentAddress] = useState<any>(null)
  const { toast } = useToast()

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
      zipCode: "",
      isDefault: false,
    },
  })

  const editForm = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
      zipCode: "",
      isDefault: false,
    },
  })

  // Atualizar o useEffect para carregar os endereços do usuário da API
  useEffect(() => {
    const fetchAddresses = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/user/addresses?userId=${userId}`)
        if (response.ok) {
          const data = await response.json()
          setAddresses(data)
        } else {
          toast({
            title: "Erro",
            description: "Não foi possível carregar seus endereços.",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Erro ao buscar endereços:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAddresses()
  }, [userId, toast])

  // Configurar o formulário de edição quando um endereço for selecionado
  useEffect(() => {
    if (currentAddress) {
      editForm.reset({
        street: currentAddress.street,
        number: currentAddress.number,
        complement: currentAddress.complement,
        neighborhood: currentAddress.neighborhood,
        city: currentAddress.city,
        state: currentAddress.state,
        zipCode: currentAddress.zipCode,
        isDefault: currentAddress.isDefault,
      })
    }
  }, [currentAddress, editForm])

  // Atualizar a função onAddSubmit para usar a API
  async function onAddSubmit(data: AddressFormValues) {
    setIsLoading(true)

    try {
      const response = await fetch("/api/user/addresses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          ...data,
        }),
      })

      if (!response.ok) {
        throw new Error("Erro ao adicionar endereço")
      }

      const newAddress = await response.json()

      // Se o novo endereço for definido como padrão, remover o padrão dos outros
      if (data.isDefault) {
        setAddresses(
          addresses.map((addr) => ({
            ...addr,
            isDefault: false,
          })),
        )
      }

      setAddresses([...addresses, newAddress])
      setIsAddDialogOpen(false)
      form.reset()

      toast({
        title: "Endereço adicionado",
        description: "Seu endereço foi adicionado com sucesso.",
      })
    } catch (error) {
      console.error("Erro ao adicionar endereço:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao adicionar o endereço.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Atualizar a função onEditSubmit para usar a API
  async function onEditSubmit(data: AddressFormValues) {
    setIsLoading(true)

    try {
      const response = await fetch(`/api/user/addresses?id=${currentAddress.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          ...data,
        }),
      })

      if (!response.ok) {
        throw new Error("Erro ao atualizar endereço")
      }

      const updatedAddress = await response.json()

      // Atualizar a lista de endereços
      setAddresses(
        addresses.map((addr) => {
          if (addr.id === currentAddress.id) {
            return updatedAddress
          }
          // Se o endereço editado for definido como padrão, remover o padrão dos outros
          if (data.isDefault && addr.isDefault) {
            return { ...addr, isDefault: false }
          }
          return addr
        }),
      )

      setIsEditDialogOpen(false)
      setCurrentAddress(null)

      toast({
        title: "Endereço atualizado",
        description: "Seu endereço foi atualizado com sucesso.",
      })
    } catch (error) {
      console.error("Erro ao atualizar endereço:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar o endereço.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Atualizar a função onDeleteAddress para usar a API
  async function onDeleteAddress() {
    setIsLoading(true)

    try {
      const response = await fetch(`/api/user/addresses?id=${currentAddress.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Erro ao excluir endereço")
      }

      setAddresses(addresses.filter((addr) => addr.id !== currentAddress.id))
      setIsDeleteDialogOpen(false)
      setCurrentAddress(null)

      toast({
        title: "Endereço removido",
        description: "Seu endereço foi removido com sucesso.",
      })
    } catch (error) {
      console.error("Erro ao remover endereço:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao remover o endereço.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading && addresses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Meus Endereços</CardTitle>
          <CardDescription>Gerencie seus endereços de entrega</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-red-600" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Meus Endereços</CardTitle>
          <CardDescription>Gerencie seus endereços de entrega</CardDescription>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700">
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Endereço
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Novo Endereço</DialogTitle>
              <DialogDescription>Preencha os dados do novo endereço abaixo.</DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onAddSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="street"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rua</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="complement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Complemento</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="neighborhood"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bairro</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cidade</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="UF" />
                            </SelectTrigger>
                            <SelectContent>
                              {[
                                "AC",
                                "AL",
                                "AP",
                                "AM",
                                "BA",
                                "CE",
                                "DF",
                                "ES",
                                "GO",
                                "MA",
                                "MT",
                                "MS",
                                "MG",
                                "PA",
                                "PB",
                                "PR",
                                "PE",
                                "PI",
                                "RJ",
                                "RN",
                                "RS",
                                "RO",
                                "RR",
                                "SC",
                                "SP",
                                "SE",
                                "TO",
                              ].map((state) => (
                                <SelectItem key={state} value={state}>
                                  {state}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CEP</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="00000-000" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isDefault"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-600"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Definir como endereço padrão</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-red-600 hover:bg-red-700" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      "Adicionar Endereço"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {addresses.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">Você ainda não possui endereços cadastrados.</p>
            <Button className="bg-red-600 hover:bg-red-700" onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Endereço
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {addresses.map((address) => (
              <div
                key={address.id}
                className="border rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">
                      {address.street}, {address.number}
                      {address.isDefault && (
                        <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                          Padrão
                        </span>
                      )}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {address.complement && `${address.complement}, `}
                    {address.neighborhood} - {address.city}/{address.state}
                  </p>
                  <p className="text-sm text-muted-foreground">CEP: {address.zipCode}</p>
                </div>
                <div className="flex gap-2 self-end md:self-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCurrentAddress(address)
                      setIsEditDialogOpen(true)
                    }}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => {
                      setCurrentAddress(address)
                      setIsDeleteDialogOpen(true)
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Excluir
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* Edit Address Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Endereço</DialogTitle>
            <DialogDescription>Atualize as informações do endereço.</DialogDescription>
          </DialogHeader>
          {currentAddress && (
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={editForm.control}
                    name="street"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rua</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={editForm.control}
                    name="number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={editForm.control}
                  name="complement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Complemento</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="neighborhood"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bairro</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={editForm.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cidade</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={editForm.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="UF" />
                            </SelectTrigger>
                            <SelectContent>
                              {[
                                "AC",
                                "AL",
                                "AP",
                                "AM",
                                "BA",
                                "CE",
                                "DF",
                                "ES",
                                "GO",
                                "MA",
                                "MT",
                                "MS",
                                "MG",
                                "PA",
                                "PB",
                                "PR",
                                "PE",
                                "PI",
                                "RJ",
                                "RN",
                                "RS",
                                "RO",
                                "RR",
                                "SC",
                                "SP",
                                "SE",
                                "TO",
                              ].map((state) => (
                                <SelectItem key={state} value={state}>
                                  {state}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={editForm.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CEP</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="00000-000" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="isDefault"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-600"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Definir como endereço padrão</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-red-600 hover:bg-red-700" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      "Salvar Alterações"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Address Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Endereço</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este endereço? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={onDeleteAddress} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Excluindo...
                </>
              ) : (
                "Excluir"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
