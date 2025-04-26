import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Navbar from "@/components/navbar"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/context/auth-context"
import { CartProvider } from "@/context/cart-context"
import { FooterProvider } from "@/context/FooterContext"
import Footer from "@/components/footer"

// Otimizar carregamento da fonte
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: {
    default: "Ritmoalpha - Equipamentos de Academia",
    template: "%s | Ritmoalpha"
  },
  description: "Loja especializada em equipamentos e roupas para academia. Encontre os melhores produtos fitness com os melhores preços.",
  keywords: ["academia", "fitness", "equipamentos", "roupas", "suplementos", "acessórios"],
  authors: [{ name: "Ritmoalpha" }],
  creator: "Ritmoalpha",
  publisher: "Ritmoalpha",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    title: "Ritmoalpha - Equipamentos de Academia",
    description: "Loja especializada em equipamentos e roupas para academia",
    siteName: "Ritmoalpha",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ritmoalpha - Equipamentos de Academia",
    description: "Loja especializada em equipamentos e roupas para academia",
    creator: "@ritmoalpha",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "seu-codigo-google",
    yandex: "seu-codigo-yandex",
    yahoo: "seu-codigo-yahoo",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="min-h-screen flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AuthProvider>
            <CartProvider>
              <FooterProvider>
                <Navbar />
                <main className="flex-grow">{children}</main>
                <Footer />
              </FooterProvider>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
