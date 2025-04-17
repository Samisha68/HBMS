import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { Providers } from "./providers"
import { NavBar } from "@/components/nav-bar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SwiftBed - Hospital Bed Management",
  description: "Streamlining Hospital Bed Utilization",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <NavBar />
          <main className="min-h-[calc(100vh-4rem)]">
            {children}
          </main>
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}