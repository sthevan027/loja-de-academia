"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

// Atualizar a interface User para incluir o campo phone
interface User {
  id: string
  name: string
  email: string
  isAdmin: boolean
  phone?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  register: (name: string, email: string, password: string) => Promise<boolean>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  // Check if user is logged in on initial load
  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error("Failed to parse user from localStorage:", error)
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)

    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate a successful login for specific credentials
      if (email === "admin@powerfit.com" && password === "admin123") {
        const adminUser = {
          id: "1",
          name: "Administrador",
          email: "admin@powerfit.com",
          isAdmin: true,
        }

        setUser(adminUser)
        localStorage.setItem("user", JSON.stringify(adminUser))

        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo de volta, Administrador!",
        })

        return true
      } else if (email === "user@example.com" && password === "password") {
        const regularUser = {
          id: "2",
          name: "Usuário Teste",
          email: "user@example.com",
          isAdmin: false,
        }

        setUser(regularUser)
        localStorage.setItem("user", JSON.stringify(regularUser))

        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo de volta!",
        })

        return true
      }

      toast({
        title: "Erro no login",
        description: "Email ou senha incorretos.",
        variant: "destructive",
      })

      return false
    } catch (error) {
      console.error("Login error:", error)

      toast({
        title: "Erro no login",
        description: "Ocorreu um erro ao tentar fazer login.",
        variant: "destructive",
      })

      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    router.push("/")

    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso.",
    })
  }

  // Atualizar a função register para incluir o campo phone
  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true)

    try {
      // Em uma aplicação real, isso seria uma chamada à API
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Erro ao registrar usuário")
      }

      const userData = await response.json()

      setUser(userData)
      localStorage.setItem("user", JSON.stringify(userData))

      toast({
        title: "Registro realizado com sucesso",
        description: "Sua conta foi criada com sucesso!",
      })

      return true
    } catch (error) {
      console.error("Registration error:", error)

      toast({
        title: "Erro no registro",
        description: "Ocorreu um erro ao tentar criar sua conta.",
        variant: "destructive",
      })

      return false
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        register,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
