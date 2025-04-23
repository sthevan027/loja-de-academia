"use client"

import Link from "next/link"
import { useState } from "react"
import { Search, Heart, User, ShoppingCart, ChevronDown } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { useCart } from "@/context/cart-context"
import { categories } from "@/lib/categories"

export default function Navbar() {
  const [openCategory, setOpenCategory] = useState<string | null>(null)
  const { user } = useAuth()
  const { cartItems } = useCart()
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  const handleMouseEnter = (categoryId: string) => {
    setOpenCategory(categoryId)
  }

  const handleMouseLeave = () => {
    setOpenCategory(null)
  }

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold text-red-600">
          POWER FIT
        </Link>

        <nav className="hidden md:flex">
          {categories.map((category) => (
            <div
              key={category.id}
              className="relative mx-4"
              onMouseEnter={() => handleMouseEnter(category.id)}
              onMouseLeave={handleMouseLeave}
            >
              <button className="group flex items-center px-3 py-2 font-medium text-gray-800 hover:text-gray-600">
                {category.name.toUpperCase()}
                <ChevronDown
                  className={`ml-1 h-4 w-4 transition-transform duration-300 ${
                    openCategory === category.id ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openCategory === category.id && (
                <div className="absolute left-0 top-full mt-1 w-48 rounded-md bg-white p-4 shadow-lg transition-opacity duration-300">
                  {category.subcategories?.map((subcategory) => (
                    <Link
                      key={subcategory.id}
                      href={`/categorias/${category.slug}/${subcategory.slug}`}
                      className="block py-2 text-gray-700 transition-colors hover:text-black"
                      onClick={() => setOpenCategory(null)}
                    >
                      {subcategory.name}
                    </Link>
                  ))}
                  <Link
                    href={`/categorias/${category.slug}`}
                    className="mt-2 block border-t pt-2 text-gray-700 transition-colors hover:text-black"
                    onClick={() => setOpenCategory(null)}
                  >
                    Ver tudo
                  </Link>
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          <Link href="/carrinho" className="text-gray-700 hover:text-red-600">
            Carrinho
          </Link>
          <Link href="/conta" className="text-gray-700 hover:text-red-600">
            Minha Conta
          </Link>
        </div>
      </div>
    </header>
  )
}
