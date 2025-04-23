"use client"

import Link from "next/link"
import { useState } from "react"
import { Search, Heart, ShoppingCart, ChevronDown } from "lucide-react"
import UserMenu from "./user-menu"

export default function Navbar() {
  const [openCategory, setOpenCategory] = useState<string | null>(null)

  // Funções para lidar com eventos de mouse
  const handleMouseEnter = (category: string) => {
    setOpenCategory(category)
  }

  const handleMouseLeave = () => {
    setOpenCategory(null)
  }

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <h1 className="text-xl font-bold tracking-tight">POWER FIT</h1>
        </Link>

        {/* Navegação principal */}
        <nav className="hidden md:flex">
          <div
            className="relative mx-4"
            onMouseEnter={() => handleMouseEnter("homens")}
            onMouseLeave={handleMouseLeave}
          >
            <button className="flex items-center px-3 py-2 font-medium text-gray-700 hover:text-red-600">
              HOMENS
              <ChevronDown
                className={`ml-1 h-4 w-4 transition-transform duration-200 ${
                  openCategory === "homens" ? "rotate-180" : ""
                }`}
              />
            </button>
            {openCategory === "homens" && (
              <div className="absolute left-0 top-full mt-1 w-48 rounded-md bg-white p-4 shadow-lg">
                <Link href="/categorias/roupas-masculinas" className="block py-2 hover:text-red-600">
                  Camisetas
                </Link>
                <Link href="/categorias/roupas-masculinas" className="block py-2 hover:text-red-600">
                  Regatas
                </Link>
                <Link href="/categorias/roupas-masculinas" className="block py-2 hover:text-red-600">
                  Shorts
                </Link>
                <Link href="/categorias/roupas-masculinas" className="block py-2 hover:text-red-600">
                  Ver tudo
                </Link>
              </div>
            )}
          </div>

          <div
            className="relative mx-4"
            onMouseEnter={() => handleMouseEnter("feminino")}
            onMouseLeave={handleMouseLeave}
          >
            <button className="flex items-center px-3 py-2 font-medium text-gray-700 hover:text-red-600">
              FEMININO
              <ChevronDown
                className={`ml-1 h-4 w-4 transition-transform duration-200 ${
                  openCategory === "feminino" ? "rotate-180" : ""
                }`}
              />
            </button>
            {openCategory === "feminino" && (
              <div className="absolute left-0 top-full mt-1 w-48 rounded-md bg-white p-4 shadow-lg">
                <Link href="/categorias/roupas-femininas" className="block py-2 hover:text-red-600">
                  Tops
                </Link>
                <Link href="/categorias/roupas-femininas" className="block py-2 hover:text-red-600">
                  Leggings
                </Link>
                <Link href="/categorias/roupas-femininas" className="block py-2 hover:text-red-600">
                  Regatas
                </Link>
                <Link href="/categorias/roupas-femininas" className="block py-2 hover:text-red-600">
                  Ver tudo
                </Link>
              </div>
            )}
          </div>

          <div
            className="relative mx-4"
            onMouseEnter={() => handleMouseEnter("acessorios")}
            onMouseLeave={handleMouseLeave}
          >
            <button className="flex items-center px-3 py-2 font-medium text-gray-700 hover:text-red-600">
              ACESSÓRIOS
              <ChevronDown
                className={`ml-1 h-4 w-4 transition-transform duration-200 ${
                  openCategory === "acessorios" ? "rotate-180" : ""
                }`}
              />
            </button>
            {openCategory === "acessorios" && (
              <div className="absolute left-0 top-full mt-1 grid w-[600px] grid-cols-2 rounded-md bg-white p-4 shadow-lg">
                <div className="p-4">
                  <h3 className="mb-4 font-bold">ACESSÓRIOS</h3>
                  <Link href="/categorias/acessorios" className="block py-2 hover:text-red-600">
                    Bonés
                  </Link>
                  <Link href="/categorias/acessorios" className="block py-2 hover:text-red-600">
                    Meias
                  </Link>
                  <Link href="/categorias/acessorios" className="block py-2 hover:text-red-600">
                    Luvas
                  </Link>
                  <Link href="/categorias/acessorios" className="block py-2 hover:text-red-600">
                    Óculos
                  </Link>
                  <Link href="/categorias/acessorios" className="block py-2 hover:text-red-600">
                    Garrafas
                  </Link>
                  <Link href="/categorias/acessorios" className="block py-2 hover:text-red-600">
                    Ver tudo
                  </Link>
                </div>
                <div className="p-4">
                  <div className="mb-4">
                    <h4 className="mb-2 text-sm font-semibold">Confira nossos óculos</h4>
                    <div className="relative h-32 w-full overflow-hidden rounded bg-gray-200">
                      <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold tracking-widest text-white">
                        ÓCULOS
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="mb-2 text-sm font-semibold">Confira nossas luvas</h4>
                    <div className="relative h-32 w-full overflow-hidden rounded bg-gray-200">
                      <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold tracking-widest text-white">
                        LUVAS
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div
            className="relative mx-4"
            onMouseEnter={() => handleMouseEnter("promocoes")}
            onMouseLeave={handleMouseLeave}
          >
            <button className="flex items-center px-3 py-2 font-medium text-green-600 hover:text-green-700">
              PROMOÇÕES
              <ChevronDown
                className={`ml-1 h-4 w-4 transition-transform duration-200 ${
                  openCategory === "promocoes" ? "rotate-180" : ""
                }`}
              />
            </button>
            {openCategory === "promocoes" && (
              <div className="absolute left-0 top-full mt-1 w-48 rounded-md bg-white p-4 shadow-lg">
                <Link href="/promocoes" className="block py-2 hover:text-green-600">
                  Ofertas da Semana
                </Link>
                <Link href="/promocoes" className="block py-2 hover:text-green-600">
                  Liquidação
                </Link>
                <Link href="/promocoes" className="block py-2 hover:text-green-600">
                  Combos
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* Barra de pesquisa e ícones */}
        <div className="flex items-center">
          <div className="relative mr-4 hidden md:block">
            <input
              type="text"
              placeholder="O que você procura?"
              className="w-64 rounded-md border border-gray-300 px-4 py-2 pr-10 focus:border-gray-400 focus:outline-none"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <Search className="h-5 w-5" />
            </button>
          </div>

          <button className="mx-2 text-gray-700 hover:text-red-600">
            <Heart className="h-6 w-6" />
          </button>

          <UserMenu />

          <button className="relative mx-2 text-gray-700 hover:text-red-600">
            <ShoppingCart className="h-6 w-6" />
            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
              0
            </span>
          </button>
        </div>
      </div>
    </header>
  )
}
