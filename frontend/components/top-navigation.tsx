"use client"

import { Bell, Home, Mail, Menu, Search, User } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

export function TopNavigation() {
  const [isSearchActive, setIsSearchActive] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-gray-800 bg-[#615fff]/90 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-[#F5F5F5] text-[#212121]">
              <nav className="grid gap-6 py-6">
                <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-[#3f51b5]">
                  <Home className="h-5 w-5" />
                  Home
                </Link>
                <Link href="/profile" className="flex items-center gap-2 text-lg font-semibold">
                  <User className="h-5 w-5" />
                  Profile
                </Link>
                <Link href="/notifications" className="flex items-center gap-2 text-lg font-semibold">
                  <Bell className="h-5 w-5" />
                  Notifications
                </Link>
                <Link href="/messages" className="flex items-center gap-2 text-lg font-semibold">
                  <Mail className="h-5 w-5" />
                  Messages
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          <Link href="/" className="text-xl font-bold text-[#F5F5F5]">
            Lumin
          </Link>
        </div>

        <div
          className={cn(
            "absolute left-0 flex w-full items-center justify-center px-4 transition-all duration-200 md:static md:w-auto md:translate-y-0 md:px-0",
            isSearchActive ? "translate-y-0" : "-translate-y-full md:translate-y-0",
          )}
        >
          <div className="relative w-[500px] max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              placeholder="Pesquisar"
              className="w-full bg-[#f5f5f5] pl-10 text-[#212121] placeholder:text-gray-700 focus-visible:ring-[#f5f5f5]"
              onFocus={() => setIsSearchActive(true)}
              onBlur={() => setIsSearchActive(false)}
            />
          </div>
        </div>

        <div className="flex items-center gap-5">
          <Button
            variant="ghost"
            size="icon"
            className="text-white md:hidden"
            onClick={() => setIsSearchActive(!isSearchActive)}
          >
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
          <Button variant="ghost" size="icon" className="hidden text-white md:flex">
            <Home className="h-5 w-5" />
            <span className="sr-only">Home</span>
          </Button>
          <Button variant="ghost" size="icon" className="hidden text-white md:flex">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>
          <Button variant="ghost" size="icon" className="hidden text-white md:flex">
            <Mail className="h-5 w-5" />
            <span className="sr-only">Messages</span>
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 overflow-hidden rounded-full bg-[#3F51B5]">
            <Image src="/photo-tiago-2.jpg" width={32} height={32} alt="Profile" className="h-full w-full object-cover" />
            <span className="sr-only">Profile</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
