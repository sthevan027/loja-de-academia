import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function PromoBanner() {
  return (
    <div className="relative overflow-hidden rounded-lg bg-black">
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>

      <div className="relative h-[300px] md:h-[400px] w-full">
        <Image
          src="/modern-gym-floor.png"
          alt="Promoções Power Fit"
          fill
          className="object-cover opacity-80"
          priority
        />
      </div>

      <div className="absolute inset-0 z-20 flex flex-col justify-center p-8 md:p-16">
        <div className="max-w-lg">
          <div className="inline-block bg-red-600 px-4 py-1 text-sm font-semibold text-white mb-4 rounded-md">
            TEMPO LIMITADO
          </div>
          <h1 className="mb-2 text-3xl md:text-5xl font-bold text-white">MEGA PROMOÇÃO</h1>
          <p className="mb-2 text-xl md:text-2xl font-semibold text-red-500">Até 50% de desconto</p>
          <p className="mb-6 text-white/80">
            Aproveite as melhores ofertas em produtos fitness. Promoção por tempo limitado!
          </p>
          <div className="flex flex-wrap gap-4">
            <Button className="bg-red-600 hover:bg-red-700">
              <Link href="#promocoes">Ver Ofertas</Link>
            </Button>
            <Button variant="outline" className="text-white border-white hover:bg-white/20">
              <Link href="/produtos">Todos os Produtos</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
