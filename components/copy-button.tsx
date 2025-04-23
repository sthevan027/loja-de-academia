"use client"

import { useState } from "react"
import { Copy, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

interface CopyButtonProps {
  textToCopy: string
  variant?: "default" | "outline" | "ghost"
}

export default function CopyButton({ textToCopy, variant = "ghost" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy)
    setCopied(true)

    toast({
      title: "Código copiado!",
      description: "O código foi copiado para a área de transferência.",
    })

    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button
      variant={variant}
      size="sm"
      onClick={handleCopy}
      className="text-white hover:text-white hover:bg-white/20 rounded-full"
    >
      {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
    </Button>
  )
}
