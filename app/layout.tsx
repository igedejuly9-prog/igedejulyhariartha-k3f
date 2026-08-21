import { Analytics } from "@vercel/analytics/next"
import type { Metadata, Viewport } from "next"
import { Inter, Plus_Jakarta_Sans } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" })

export const metadata: Metadata = {
  title: "Bahari — Manajemen Angkutan Laut",
  description: "Aplikasi manajemen bisnis angkutan laut: pengiriman, kapal, pelanggan, rute, pembayaran, dan laporan.",
  generator: "v0.app",
}

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#1e3a5f",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" className={`${inter.variable} ${jakarta.variable} bg-background`}>
      <body className="font-sans antialiased">
        {children}
        <Toaster richColors position="top-right" />
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
