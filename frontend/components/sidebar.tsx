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
      <nav className="grid gap-2 text-[#615fff]">
        <Link
          href="/"
          className="flex items-center gap-4 rounded-full px-6 py-3 text-lg font-semibold transition-colors hover:bg-[#615fff] hover:text-[#F5F5F5]"
        >
          <Home className="h-6 w-6" />
          <span>Inicio</span>
        </Link>
        <Link
          href="/explore"
          className="flex items-center gap-4 rounded-full px-6 py-3 text-lg font-semibold transition-colors hover:bg-[#615fff]  hover:text-[#F5F5F5]"
        >
          <Search className="h-6 w-6" />
          <span>Explorar</span>
        </Link>
        <Link
          href="/notifications"
          className="flex items-center gap-4 rounded-full px-6 py-3 text-lg font-semibold transition-colors hover:bg-[#615fff]  hover:text-[#F5F5F5]"
        >
          <Bell className="h-6 w-6" />
          <span>Notificações</span>
        </Link>
        <Link
          href="/messages"
          className="flex items-center gap-4 rounded-full px-6 py-3 text-lg font-semibold transition-colors hover:bg-[#615fff] hover:text-[#F5F5F5]"
        >
          <Mail className="h-6 w-6" />
          <span>Messagens</span>
        </Link>
        <Link
          href="/bookmarks"
          className="flex items-center gap-4 rounded-full px-6 py-3 text-lg font-semibold transition-colors hover:bg-[#615fff]  hover:text-[#F5F5F5]"
        >
          <Bookmark className="h-6 w-6" />
          <span>Marcações</span>
        </Link>
        <Link
          href="/profile"
          className="flex items-center gap-4 rounded-full px-6 py-3 text-lg font-semibold transition-colors hover:bg-[#615fff]  hover:text-[#F5F5F5]"
        >
          <User className="h-6 w-6" />
          <span>Perfil</span>
        </Link>
        <Link
          href="/settings"
          className="flex items-center gap-4 rounded-full px-6 py-3 text-lg font-semibold transition-colors hover:bg-[#615fff] hover:text-[#F5F5F5]"
        >
          <Settings className="h-6 w-6" />
          <span>Configurações</span>
        </Link>
      </nav>
      <Button className="w-full rounded-full bg-[#615fff] text-[#F5F5F5] hover:bg-[#615fff]/90">Post</Button>
    </aside>
  )
}
