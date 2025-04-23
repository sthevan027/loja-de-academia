"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { User, LogOut } from "lucide-react"
import { useAuth } from "@/context/auth-context"

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [logout, setLogout] = useState(() => {})

  useEffect(() => {
    try {
      const auth = useAuth()
      setUser(auth.user)
      setLogout(() => auth.logout)
    } catch (error) {
      console.error("AuthProvider não disponível:", error)
    }
  }, [])

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const handleLogout = () => {
    logout()
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={toggleMenu}
        className="mx-2 text-gray-700 hover:text-red-600"
        aria-label={user ? "Menu do usuário" : "Entrar"}
      >
        <User className="h-6 w-6" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md bg-white p-2 shadow-lg">
          {user ? (
            <>
              <div className="border-b border-gray-100 px-4 py-2">
                <p className="font-medium">{user?.name}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
              <Link
                href="/minha-conta"
                className="block px-4 py-2 text-sm hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                Minha Conta
              </Link>
              <Link
                href="/meus-pedidos"
                className="block px-4 py-2 text-sm hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                Meus Pedidos
              </Link>
              {user?.isAdmin && (
                <Link
                  href="/admin"
                  className="block px-4 py-2 text-sm hover:bg-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  Painel Admin
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="block px-4 py-2 text-sm hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                Entrar
              </Link>
              <Link
                href="/cadastro"
                className="block px-4 py-2 text-sm hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                Cadastrar
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  )
}
