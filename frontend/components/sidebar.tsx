import { Bell, Bookmark, Home, Mail, Search, Settings, User } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  return (
    <aside className={cn("space-y-6", className)}>
      <nav className="grid gap-2">
        <Link
          href="/"
          className="flex items-center gap-4 rounded-full px-6 py-3 text-lg font-semibold text-[#205295] transition-colors hover:bg-[#2a2b2d]"
        >
          <Home className="h-6 w-6" />
          <span>Inicio</span>
        </Link>
        <Link
          href="/explore"
          className="flex items-center gap-4 rounded-full px-6 py-3 text-lg font-semibold transition-colors hover:bg-[#2a2b2d]"
        >
          <Search className="h-6 w-6" />
          <span>Explorar</span>
        </Link>
        <Link
          href="/notifications"
          className="flex items-center gap-4 rounded-full px-6 py-3 text-lg font-semibold transition-colors hover:bg-[#2a2b2d]"
        >
          <Bell className="h-6 w-6" />
          <span>Notificações</span>
        </Link>
        <Link
          href="/messages"
          className="flex items-center gap-4 rounded-full px-6 py-3 text-lg font-semibold transition-colors hover:bg-[#2a2b2d]"
        >
          <Mail className="h-6 w-6" />
          <span>Messagens</span>
        </Link>
        <Link
          href="/bookmarks"
          className="flex items-center gap-4 rounded-full px-6 py-3 text-lg font-semibold transition-colors hover:bg-[#2a2b2d]"
        >
          <Bookmark className="h-6 w-6" />
          <span>Marcações</span>
        </Link>
        <Link
          href="/profile"
          className="flex items-center gap-4 rounded-full px-6 py-3 text-lg font-semibold transition-colors hover:bg-[#2a2b2d]"
        >
          <User className="h-6 w-6" />
          <span>Perfil</span>
        </Link>
        <Link
          href="/settings"
          className="flex items-center gap-4 rounded-full px-6 py-3 text-lg font-semibold transition-colors hover:bg-[#2a2b2d]"
        >
          <Settings className="h-6 w-6" />
          <span>Configurações</span>
        </Link>
      </nav>
      <Button className="w-full rounded-full bg-[#205295] text-black hover:bg-[#205295]/90">Post</Button>
    </aside>
  )
}

