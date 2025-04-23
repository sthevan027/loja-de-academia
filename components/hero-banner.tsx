import Image from "next/image"
import Link from "next/link"

export default function HeroBanner() {
  return (
    <section className="relative h-[70vh] w-full overflow-hidden bg-gray-100">
      <Image src="/images/power-fit-logo.png" alt="Power Fit" fill priority className="object-cover" />

      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
        <h1 className="text-5xl md:text-7xl font-bold mb-8 text-center">SUPERE SEUS LIMITES</h1>
        <Link
          href="/produtos"
          className="bg-red-600 hover:bg-red-700 text-white font-medium px-8 py-3 rounded-sm transition-colors"
        >
          COMPRAR AGORA
        </Link>
      </div>
    </section>
  )
}
