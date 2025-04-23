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
    default: "Power Fit - Equipamentos de Academia",
    template: "%s | Power Fit"
  },
  description: "Loja especializada em equipamentos e roupas para academia. Encontre os melhores produtos fitness com os melhores preços.",
  keywords: ["academia", "fitness", "equipamentos", "roupas", "suplementos", "acessórios"],
  authors: [{ name: "Power Fit" }],
  creator: "Power Fit",
  publisher: "Power Fit",
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
    title: "Power Fit - Equipamentos de Academia",
    description: "Loja especializada em equipamentos e roupas para academia",
    siteName: "Power Fit",
  },
  twitter: {
    card: "summary_large_image",
    title: "Power Fit - Equipamentos de Academia",
    description: "Loja especializada em equipamentos e roupas para academia",
    creator: "@powerfit",
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
