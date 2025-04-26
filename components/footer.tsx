import Link from "next/link"
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, Edit2 } from "lucide-react"
import { useFooter } from "@/context/FooterContext"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const { terms, setTerms, isEditing, setIsEditing, saveTerms, isLoading } = useFooter()
  const { data: session } = useSession()

  const handleEditClick = () => {
    if (!session) {
      setIsEditing(false)
      return
    }
    setIsEditing(!isEditing)
  }

  return (
    <footer className="bg-black text-white pt-8 pb-4">
      <div className="container mx-auto px-4">
        {/* Versão simplificada do rodapé */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          {/* Coluna 1 - Sobre */}
          <div>
            <h3 className="text-lg font-bold mb-4">
              POWER <span className="text-red-600">FIT</span>
            </h3>
            <p className="text-gray-400 mb-4 text-sm">
              Sua loja completa de produtos fitness. Roupas e acessórios de alta qualidade para seus treinos.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-red-500 transition-colors">
                <Facebook size={18} />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-red-500 transition-colors">
                <Instagram size={18} />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-red-500 transition-colors">
                <Twitter size={18} />
              </Link>
            </div>
          </div>

          {/* Coluna 2 - Links Rápidos */}
          <div>
            <h3 className="text-base font-semibold mb-4 border-b border-gray-800 pb-2">Links Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/produtos" className="text-gray-400 hover:text-red-500 transition-colors">
                  Produtos
                </Link>
              </li>
              <li>
                <Link href="/promocoes" className="text-gray-400 hover:text-red-500 transition-colors">
                  Promoções
                </Link>
              </li>
              <li>
                <Link href="/contato" className="text-gray-400 hover:text-red-500 transition-colors">
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 3 - Contato */}
          <div>
            <h3 className="text-base font-semibold mb-4 border-b border-gray-800 pb-2">Contato</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <MapPin className="mr-2 h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400">Av. Paulista, 1000 - São Paulo, SP</span>
              </li>
              <li className="flex items-center">
                <Phone className="mr-2 h-4 w-4 text-red-500" />
                <span className="text-gray-400">(11) 9999-9999</span>
              </li>
              <li className="flex items-center">
                <Mail className="mr-2 h-4 w-4 text-red-500" />
                <span className="text-gray-400">contato@powerfit.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright com edição */}
        <div className="text-center text-gray-500 text-xs border-t border-gray-800 pt-4">
          <div className="flex items-center justify-center gap-2">
            <p>&copy; {currentYear} Ritmoalpha. {terms}</p>
            {session && (
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-red-500 p-0 h-auto"
                onClick={handleEditClick}
                disabled={isLoading}
              >
                <Edit2 size={14} />
              </Button>
            )}
          </div>
          
          {isEditing && (
            <div className="mt-2 flex items-center justify-center gap-2">
              <Input
                type="text"
                value={terms}
                onChange={(e) => setTerms(e.target.value)}
                className="max-w-xs text-black"
                maxLength={500}
                disabled={isLoading}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={saveTerms}
                className="text-xs"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Salvar'
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </footer>
  )
}
