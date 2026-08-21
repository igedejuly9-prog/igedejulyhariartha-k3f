"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import {
  LayoutDashboard,
  Package,
  Ship,
  Users,
  Route,
  Wallet,
  Menu,
  X,
  Anchor,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const nav = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/pengiriman", label: "Pengiriman", icon: Package },
  { href: "/kapal", label: "Kapal", icon: Ship },
  { href: "/pelanggan", label: "Pelanggan", icon: Users },
  { href: "/rute", label: "Jadwal & Rute", icon: Route },
  { href: "/pembayaran", label: "Pembayaran", icon: Wallet },
]

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  return (
    <nav className="flex flex-col gap-1 px-3">
      {nav.map((item) => {
        const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
        const Icon = item.icon
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            )}
          >
            <Icon className="size-4 shrink-0" />
            <span className="truncate">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}

function Brand() {
  return (
    <div className="flex items-center gap-2.5 px-5 py-5">
      <div className="flex size-9 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
        <Anchor className="size-5" />
      </div>
      <div className="leading-tight">
        <p className="font-heading text-base font-bold text-sidebar-foreground">Bahari</p>
        <p className="text-xs text-sidebar-foreground/60">Angkutan Laut</p>
      </div>
    </div>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="no-print fixed inset-y-0 left-0 z-30 hidden w-60 flex-col bg-sidebar lg:flex">
        <Brand />
        <NavLinks />
        <div className="mt-auto px-5 py-4 text-xs text-sidebar-foreground/50">
          {"Sistem Manajemen Bahari"}
        </div>
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="no-print fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-foreground/40" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 flex w-60 flex-col bg-sidebar">
            <div className="flex items-center justify-between">
              <Brand />
              <Button
                variant="ghost"
                size="icon"
                className="mr-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                onClick={() => setOpen(false)}
              >
                <X className="size-5" />
              </Button>
            </div>
            <NavLinks onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex flex-1 flex-col lg:pl-60">
        <header className="no-print sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-background/80 px-4 py-3 backdrop-blur lg:hidden">
          <Button variant="outline" size="icon" onClick={() => setOpen(true)}>
            <Menu className="size-5" />
          </Button>
          <span className="font-heading font-bold">Bahari</span>
        </header>
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  )
}
