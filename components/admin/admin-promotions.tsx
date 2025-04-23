"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { CalendarIcon, Edit, MoreHorizontal, Plus, Trash2 } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { mockPromotions } from "@/lib/mock-data"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function AdminPromotions() {
  const [promotions, setPromotions] = useState(mockPromotions)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentPromotion, setCurrentPromotion] = useState<any>(null)
  const [newPromotion, setNewPromotion] = useState({
    name: "",
    code: "",
    discountType: "percentage",
    discountValue: 0,
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 30)),
    isActive: true,
    minPurchase: 0,
  })

  const { toast } = useToast()

  const handleAddPromotion = () => {
    const promotionId = Math.random().toString(36).substring(2, 9)

    const promotionToAdd = {
      id: promotionId,
      ...newPromotion,
    }

    setPromotions([...promotions, promotionToAdd])
    setNewPromotion({
      name: "",
      code: "",
      discountType: "percentage",
      discountValue: 0,
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 30)),
      isActive: true,
      minPurchase: 0,
    })
    setIsAddDialogOpen(false)

    toast({
      title: "Promoção adicionada",
      description: `${promotionToAdd.name} foi adicionada com sucesso.`,
    })
  }

  const handleEditPromotion = () => {
    if (!currentPromotion) return

    setPromotions(promotions.map((promotion) => (promotion.id === currentPromotion.id ? currentPromotion : promotion)))
    setIsEditDialogOpen(false)

    toast({
      title: "Promoção atualizada",
      description: `${currentPromotion.name} foi atualizada com sucesso.`,
    })
  }

  const handleDeletePromotion = () => {
    if (!currentPromotion) return

    setPromotions(promotions.filter((promotion) => promotion.id !== currentPromotion.id))
    setIsDeleteDialogOpen(false)

    toast({
      title: "Promoção removida",
      description: `${currentPromotion.name} foi removida com sucesso.`,
    })
  }

  const formatDiscount = (promotion: any) => {
    if (promotion.discountType === "percentage") {
      return `${promotion.discountValue}%`
    } else {
      return formatCurrency(promotion.discountValue)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h2 className="text-xl font-semibold">Promoções e Cupons</h2>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700">
              <Plus className="mr-2 h-4 w-4" />
              Nova Promoção
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Adicionar Nova Promoção</DialogTitle>
              <DialogDescription>Crie uma nova promoção ou cupom de desconto.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome da Promoção</Label>
                  <Input
                    id="name"
                    value={newPromotion.name}
                    onChange={(e) => setNewPromotion({ ...newPromotion, name: e.target.value })}
                    placeholder="Black Friday"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code">Código do Cupom</Label>
                  <Input
                    id="code"
                    value={newPromotion.code}
                    onChange={(e) => setNewPromotion({ ...newPromotion, code: e.target.value.toUpperCase() })}
                    placeholder="BLACKFRIDAY20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="discountType">Tipo de Desconto</Label>
                  <select
                    id="discountType"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={newPromotion.discountType}
                    onChange={(e) => setNewPromotion({ ...newPromotion, discountType: e.target.value })}
                  >
                    <option value="percentage">Porcentagem (%)</option>
                    <option value="fixed">Valor Fixo (R$)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discountValue">Valor do Desconto</Label>
                  <Input
                    id="discountValue"
                    type="number"
                    min="0"
                    step={newPromotion.discountType === "percentage" ? "1" : "0.01"}
                    value={newPromotion.discountValue}
                    onChange={(e) =>
                      setNewPromotion({ ...newPromotion, discountValue: Number.parseFloat(e.target.value) })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Data de Início</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(newPromotion.startDate, "PPP", { locale: ptBR })}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={newPromotion.startDate}
                        onSelect={(date) => date && setNewPromotion({ ...newPromotion, startDate: date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>Data de Término</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(newPromotion.endDate, "PPP", { locale: ptBR })}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={newPromotion.endDate}
                        onSelect={(date) => date && setNewPromotion({ ...newPromotion, endDate: date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="minPurchase">Valor Mínimo de Compra (R$)</Label>
                <Input
                  id="minPurchase"
                  type="number"
                  min="0"
                  step="0.01"
                  value={newPromotion.minPurchase}
                  onChange={(e) => setNewPromotion({ ...newPromotion, minPurchase: Number.parseFloat(e.target.value) })}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isActive"
                  checked={newPromotion.isActive}
                  onCheckedChange={(checked) => setNewPromotion({ ...newPromotion, isActive: checked === true })}
                />
                <Label htmlFor="isActive">Ativar Promoção</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancelar
              </Button>
              <Button className="bg-red-600 hover:bg-red-700" onClick={handleAddPromotion}>
                Adicionar Promoção
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Código</TableHead>
              <TableHead>Desconto</TableHead>
              <TableHead>Período</TableHead>
              <TableHead>Mín. Compra</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {promotions.length > 0 ? (
              promotions.map((promotion) => (
                <TableRow key={promotion.id}>
                  <TableCell className="font-medium">{promotion.name}</TableCell>
                  <TableCell>{promotion.code}</TableCell>
                  <TableCell>{formatDiscount(promotion)}</TableCell>
                  <TableCell>
                    {format(new Date(promotion.startDate), "dd/MM/yyyy")} -{" "}
                    {format(new Date(promotion.endDate), "dd/MM/yyyy")}
                  </TableCell>
                  <TableCell>
                    {promotion.minPurchase > 0 ? formatCurrency(promotion.minPurchase) : "Sem mínimo"}
                  </TableCell>
                  <TableCell>
                    {promotion.isActive ? (
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        Ativo
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                        Inativo
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Abrir menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => {
                            setCurrentPromotion(promotion)
                            setIsEditDialogOpen(true)
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => {
                            setCurrentPromotion(promotion)
                            setIsDeleteDialogOpen(true)
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => {
                            setPromotions(
                              promotions.map((p) => (p.id === promotion.id ? { ...p, isActive: !p.isActive } : p)),
                            )

                            toast({
                              title: promotion.isActive ? "Promoção desativada" : "Promoção ativada",
                              description: `${promotion.name} foi ${promotion.isActive ? "desativada" : "ativada"} com sucesso.`,
                            })
                          }}
                        >
                          {promotion.isActive ? "Desativar" : "Ativar"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  Nenhuma promoção encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Promotion Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Editar Promoção</DialogTitle>
            <DialogDescription>Atualize os detalhes da promoção.</DialogDescription>
          </DialogHeader>
          {currentPromotion && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Nome da Promoção</Label>
                  <Input
                    id="edit-name"
                    value={currentPromotion.name}
                    onChange={(e) => setCurrentPromotion({ ...currentPromotion, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-code">Código do Cupom</Label>
                  <Input
                    id="edit-code"
                    value={currentPromotion.code}
                    onChange={(e) => setCurrentPromotion({ ...currentPromotion, code: e.target.value.toUpperCase() })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-discountType">Tipo de Desconto</Label>
                  <select
                    id="edit-discountType"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={currentPromotion.discountType}
                    onChange={(e) => setCurrentPromotion({ ...currentPromotion, discountType: e.target.value })}
                  >
                    <option value="percentage">Porcentagem (%)</option>
                    <option value="fixed">Valor Fixo (R$)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-discountValue">Valor do Desconto</Label>
                  <Input
                    id="edit-discountValue"
                    type="number"
                    min="0"
                    step={currentPromotion.discountType === "percentage" ? "1" : "0.01"}
                    value={currentPromotion.discountValue}
                    onChange={(e) =>
                      setCurrentPromotion({ ...currentPromotion, discountValue: Number.parseFloat(e.target.value) })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Data de Início</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(new Date(currentPromotion.startDate), "PPP", { locale: ptBR })}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={new Date(currentPromotion.startDate)}
                        onSelect={(date) => date && setCurrentPromotion({ ...currentPromotion, startDate: date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>Data de Término</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(new Date(currentPromotion.endDate), "PPP", { locale: ptBR })}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={new Date(currentPromotion.endDate)}
                        onSelect={(date) => date && setCurrentPromotion({ ...currentPromotion, endDate: date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-minPurchase">Valor Mínimo de Compra (R$)</Label>
                <Input
                  id="edit-minPurchase"
                  type="number"
                  min="0"
                  step="0.01"
                  value={currentPromotion.minPurchase}
                  onChange={(e) =>
                    setCurrentPromotion({ ...currentPromotion, minPurchase: Number.parseFloat(e.target.value) })
                  }
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="edit-isActive"
                  checked={currentPromotion.isActive}
                  onCheckedChange={(checked) =>
                    setCurrentPromotion({ ...currentPromotion, isActive: checked === true })
                  }
                />
                <Label htmlFor="edit-isActive">Ativar Promoção</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button className="bg-red-600 hover:bg-red-700" onClick={handleEditPromotion}>
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Promotion Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir a promoção "{currentPromotion?.name}"? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeletePromotion}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
