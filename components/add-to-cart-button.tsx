"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { useToast } from "@/components/ui/use-toast"
import type { Product, ProductSize } from "@/types/product"

interface AddToCartButtonProps {
  product: Product
  showQuantity?: boolean
}

export default function AddToCartButton({ product, showQuantity = true }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState<ProductSize | undefined>(undefined)
  const { addToCart } = useCart()
  const { toast } = useToast()

  const handleAddToCart = () => {
    // Verificar se o produto precisa de tamanho e se um tamanho foi selecionado
    if (product.availableSizes && product.availableSizes.length > 0 && !selectedSize) {
      toast({
        title: "Selecione um tamanho",
        description: "Por favor, selecione um tamanho antes de adicionar ao carrinho.",
        variant: "destructive",
      })
      return
    }

    // Adicionar ao carrinho com o tamanho selecionado
    addToCart(
      {
        ...product,
        selectedSize,
      },
      quantity,
    )

    // Resetar o estado
    setQuantity(1)
    setSelectedSize(undefined)
  }

  return (
    <div className="flex flex-col">
      {/* Seleção de tamanho */}
      {product.availableSizes && product.availableSizes.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-2">Tamanho</h3>
          <div className="flex flex-wrap gap-2">
            {product.availableSizes.map((size) => (
              <div
                key={size.toString()}
                className={`size-selector ${selectedSize === size ? "selected" : ""}`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </div>
            ))}
          </div>
          <style jsx>{`
            .size-selector {
              display: inline-flex;
              align-items: center;
              justify-content: center;
              width: 40px;
              height: 40px;
              border: 1px solid #e2e8f0;
              border-radius: 0.375rem;
              font-size: 0.875rem;
              cursor: pointer;
              transition: all 0.2s;
            }
            .size-selector:hover {
              border-color: #ef4444;
              background-color: #fef2f2;
            }
            .size-selector.selected {
              border-color: #ef4444;
              background-color: #ef4444;
              color: white;
            }
          `}</style>
        </div>
      )}

      {showQuantity && (
        <div className="flex items-center mb-4">
          <span className="mr-4">Quantidade:</span>
          <div className="flex items-center">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-l-full"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              -
            </Button>
            <div className="flex h-8 w-12 items-center justify-center border-y border-input bg-transparent">
              {quantity}
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-r-full"
              onClick={() => setQuantity(quantity + 1)}
            >
              +
            </Button>
          </div>
        </div>
      )}

      <Button className="bg-red-600 hover:bg-red-700 rounded-full" onClick={handleAddToCart}>
        <ShoppingCart className="mr-2 h-4 w-4" />
        Adicionar ao Carrinho
      </Button>
    </div>
  )
}
