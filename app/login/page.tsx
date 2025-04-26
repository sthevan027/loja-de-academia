"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2 } from "lucide-react"
import Image from "next/image"
import { useAuth } from "@/context/auth-context"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const { login } = useAuth()

  // Garantir que o componente está montado antes de usar hooks do cliente
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!mounted) return

    setError("")
    setIsLoading(true)

    try {
      const success = await login(email, password)

      if (success) {
        router.push("/")
      } else {
        setError("Email ou senha inválidos")
      }
    } catch (err) {
      setError("Ocorreu um erro ao fazer login. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  // Renderizar um placeholder durante a renderização do servidor
  if (!mounted) {
    return (
      <div className="flex min-h-screen">
        <div className="hidden w-1/2 bg-black lg:block"></div>
        <div className="flex w-full flex-col justify-center bg-white px-4 sm:px-6 md:px-8 lg:w-1/2 lg:px-12">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-bold text-gray-900">Entre na sua conta</h2>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      {/* Lado esquerdo - Imagem */}
      <div className="hidden w-1/2 bg-black lg:block">
        <div className="relative h-full w-full">
          <Image src="/images/gym-banner.png" alt="Fitness" fill className="object-cover opacity-80" />
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 p-12 text-white">
            <h1 className="mb-6 text-5xl font-bold">RITMOALPHA</h1>
            <p className="mb-8 text-center text-xl">Transforme seu corpo, transforme sua vida.</p>
            <div className="h-1 w-20 bg-red-600"></div>
          </div>
        </div>
      </div>

      {/* Lado direito - Formulário */}
      <div className="flex w-full flex-col justify-center bg-white px-4 sm:px-6 md:px-8 lg:w-1/2 lg:px-12">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-gray-900">Entre na sua conta</h2>
            <p className="mt-3 text-gray-600">
              Ou{" "}
              <Link href="/cadastro" className="font-medium text-red-600 transition-colors hover:text-red-500">
                crie uma nova conta
              </Link>
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 placeholder-gray-400 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 py-3 pl-10 pr-10 placeholder-gray-400 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Lembrar de mim
                </label>
              </div>
              <div className="text-sm">
                <Link href="/esqueci-senha" className="font-medium text-red-600 hover:text-red-500">
                  Esqueceu sua senha?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative flex w-full items-center justify-center rounded-lg bg-red-600 px-4 py-3 text-sm font-medium text-white transition-all hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:bg-red-400"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  <>
                    Entrar
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
