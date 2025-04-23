"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Plus, X } from "lucide-react"

interface Category {
  id: number
  name: string
  slug: string
}

interface FilterOption {
  id: number
  label: string
}

interface Filter {
  id: number
  name: string
  options: FilterOption[]
}

interface ProductFormProps {
  product?: any
  onSubmit: (data: any) => void
  isSubmitting: boolean
}

export default function ProductForm({ product, onSubmit, isSubmitting }: ProductFormProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [filters, setFilters] = useState<Filter[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>(product?.category?.id.toString() || "")
  const [selectedFilters, setSelectedFilters] = useState<Record<number, number[]>>({})
  const [images, setImages] = useState<string[]>(product?.images || [""])
  const [formData, setFormData] = useState({
    name: product?.name || "",
    slug: product?.slug || "",
    description: product?.description || "",
    price: product?.price || "",
    discountPrice: product?.discountPrice || "",
    stock: product?.stock || "0",
    featured: product?.featured || false,
  })

  const { toast } = useToast()

  // Carregar categorias
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("/api/admin/categories")
        if (response.ok) {
          const data = await response.json()
          setCategories(data)
        }
      } catch (error) {
        console.error("Erro ao carregar categorias:", error)
      }
    }

    fetchCategories()
  }, [])

  // Carregar filtros quando a categoria é selecionada
  useEffect(() => {
    async function fetchFilters() {
      if (!selectedCategory) return

      try {
        const category = categories.find((c) => c.id.toString() === selectedCategory)
        if (!category) return

        const response = await fetch(`/api/admin/filters?category=${category.slug}`)
        if (response.ok) {
          const data = await response.json()
          setFilters(data)
        }
      } catch (error) {
        console.error("Erro ao carregar filtros:", error)
      }
    }

    fetchFilters()
  }, [selectedCategory, categories])

  // Carregar filtros do produto
  useEffect(() => {
    async function fetchProductFilters() {
      if (!product?.id) return

      try {
        const response = await fetch(`/api/admin/products/${product.id}/filters`)
        if (response.ok) {
          const data = await response.json()

          // Converter para o formato esperado
          const filterMap: Record<number, number[]> = {}
          data.forEach((filter: any) => {
            filterMap[filter.id] = filter.options.map((option: any) => option.id)
          })

          setSelectedFilters(filterMap)
        }
      } catch (error) {
        console.error("Erro ao carregar filtros do produto:", error)
      }
    }

    fetchProductFilters()
  }, [product?.id])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData({ ...formData, featured: checked })
  }

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value)
    // Limpar filtros selecionados ao mudar de categoria
    setSelectedFilters({})
  }

  const handleFilterChange = (filterId: number, optionId: number, checked: boolean) => {
    setSelectedFilters((prev) => {
      const newFilters = { ...prev }

      if (!newFilters[filterId]) {
        newFilters[filterId] = []
      }

      if (checked) {
        newFilters[filterId] = [...newFilters[filterId], optionId]
      } else {
        newFilters[filterId] = newFilters[filterId].filter((id) => id !== optionId)
      }

      if (newFilters[filterId].length === 0) {
        delete newFilters[filterId]
      }

      return newFilters
    })
  }

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...images]
    newImages[index] = value
    setImages(newImages)
  }

  const addImageField = () => {
    setImages([...images, ""])
  }

  const removeImageField = (index: number) => {
    if (images.length > 1) {
      const newImages = [...images]
      newImages.splice(index, 1)
      setImages(newImages)
    } else {
      toast({
        title: "Erro",
        description: "O produto deve ter pelo menos uma imagem",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validar campos obrigatórios
    if (!formData.name || !formData.slug || !formData.price || !selectedCategory) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      })
      return
    }

    // Validar imagens
    const validImages = images.filter((img) => img.trim() !== "")
    if (validImages.length === 0) {
      toast({
        title: "Erro",
        description: "Adicione pelo menos uma imagem",
        variant: "destructive",
      })
      return
    }

    // Preparar dados para envio
    const productData = {
      ...formData,
      price: Number.parseFloat(formData.price),
      discountPrice: formData.discountPrice ? Number.parseFloat(formData.discountPrice) : null,
      stock: Number.parseInt(formData.stock),
      categoryId: Number.parseInt(selectedCategory),
      images: validImages,
      filterOptions: Object.values(selectedFilters).flat(),
    }

    onSubmit(productData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Nome do Produto *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Nome do produto"
              required
            />
          </div>

          <div>
            <Label htmlFor="slug">Slug *</Label>
            <Input
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleInputChange}
              placeholder="slug-do-produto"
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Categoria *</Label>
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Descrição do produto"
              rows={5}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Preço (R$) *</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <Label htmlFor="discountPrice">Preço Promocional (R$)</Label>
              <Input
                id="discountPrice"
                name="discountPrice"
                type="number"
                step="0.01"
                min="0"
                value={formData.discountPrice}
                onChange={handleInputChange}
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="stock">Estoque *</Label>
            <Input
              id="stock"
              name="stock"
              type="number"
              min="0"
              value={formData.stock}
              onChange={handleInputChange}
              placeholder="0"
              required
            />
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Checkbox id="featured" checked={formData.featured} onCheckedChange={handleCheckboxChange} />
            <Label htmlFor="featured" className="cursor-pointer">
              Produto em Destaque
            </Label>
          </div>

          <div className="space-y-2">
            <Label>Imagens do Produto *</Label>
            {images.map((image, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  value={image}
                  onChange={(e) => handleImageChange(index, e.target.value)}
                  placeholder="URL da imagem"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeImageField(index)}
                  disabled={images.length === 1}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={addImageField} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Imagem
            </Button>
          </div>
        </div>
      </div>

      {/* Filtros do produto */}
      {selectedCategory && filters.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Filtros do Produto</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filters.map((filter) => (
                <div key={filter.id} className="space-y-2">
                  <h4 className="font-medium">{filter.name}</h4>
                  <div className="space-y-2">
                    {filter.options.map((option) => (
                      <div key={option.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`filter-${filter.id}-${option.id}`}
                          checked={selectedFilters[filter.id]?.includes(option.id) || false}
                          onCheckedChange={(checked) => handleFilterChange(filter.id, option.id, checked === true)}
                        />
                        <Label htmlFor={`filter-${filter.id}-${option.id}`} className="cursor-pointer">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={() => window.history.back()}>
          Cancelar
        </Button>
        <Button type="submit" className="bg-red-600 hover:bg-red-700" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {product ? "Atualizar Produto" : "Criar Produto"}
        </Button>
      </div>
    </form>
  )
}
