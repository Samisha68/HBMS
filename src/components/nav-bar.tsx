"use client"

import { signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { BedDouble, LogOut, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Logo } from "@/components/ui/logo"

export function NavBar() {
  const { data: session } = useSession()

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const navigationLinks = [
    { href: "/", label: "Dashboard" },
    { href: "/beds", label: "Beds" },
    { href: "/feedback", label: "Feedback" }
  ]

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between bg-white dark:bg-gray-800 shadow-md px-4 md:px-6">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
        <Link href="/" className="flex items-center gap-2">
          <Logo size="small" />
        </Link>
      </div>

      <nav className="hidden md:flex md:items-center md:gap-6">
        {navigationLinks.map((link) => (
          <Link 
            key={link.href} 
            href={link.href} 
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {session ? (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={session.user?.image || undefined} alt={session.user?.name || "User"} />
            <AvatarFallback>{getInitials(session.user?.name)}</AvatarFallback>
          </Avatar>
          <div className="hidden md:block text-right">
            <div className="text-sm font-medium">{session.user?.name}</div>
            <div className="text-xs text-muted-foreground">{session.user?.email}</div>
          </div>
          <Button variant="ghost" size="icon" onClick={() => signOut()}>
            <LogOut className="h-5 w-5 text-red-500" />
            <span className="sr-only">Log out</span>
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <Link href="/auth/signin">
            <Button variant="ghost">Sign in</Button>
          </Link>
          <Link href="/auth/signup">
            <Button>Sign up</Button>
          </Link>
        </div>
      )}
    </header>
  )
} 