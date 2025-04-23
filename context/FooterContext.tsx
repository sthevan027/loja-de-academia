import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'

interface FooterContextType {
  terms: string
  setTerms: (terms: string) => void
  isEditing: boolean
  setIsEditing: (isEditing: boolean) => void
  saveTerms: () => Promise<void>
  isLoading: boolean
}

const FooterContext = createContext<FooterContextType | undefined>(undefined)

export function FooterProvider({ children }: { children: ReactNode }) {
  const [terms, setTerms] = useState('Todos os direitos reservados.')
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { data: session } = useSession()

  useEffect(() => {
    fetchTerms()
  }, [])

  const fetchTerms = async () => {
    try {
      const response = await fetch('/api/footer/terms')
      const data = await response.json()
      if (data.terms) {
        setTerms(data.terms)
      }
    } catch (error) {
      console.error('Erro ao buscar termos:', error)
    }
  }

  const saveTerms = async () => {
    if (!session) {
      toast.error('Você precisa estar logado para editar os termos')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/footer/terms', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ terms }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao salvar termos')
      }

      toast.success('Termos atualizados com sucesso!')
      setIsEditing(false)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao salvar termos')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <FooterContext.Provider 
      value={{ 
        terms, 
        setTerms, 
        isEditing, 
        setIsEditing, 
        saveTerms,
        isLoading 
      }}
    >
      {children}
    </FooterContext.Provider>
  )
}

export function useFooter() {
  const context = useContext(FooterContext)
  if (context === undefined) {
    throw new Error('useFooter must be used within a FooterProvider')
  }
  return context
} 