"use client"

import { useState } from "react";
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Search, GraduationCap } from "lucide-react"
import { SignYearbookModal } from "@/components/sign-yearbook-modal"
import { SearchModal } from "@/components/search-modal";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";


export function Navbar() {
  const pathname = usePathname()
  const [isSignModalOpen, setIsSignModalOpen] = useState(false)
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-primary" />
          <Link href="/" className="font-playfair text-xl font-bold">
            Class of 2025
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname === "/" ? "text-foreground" : "text-muted-foreground",
            )}
          >
            Home
          </Link>
          <Link
            href="/students"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname.startsWith("/students") ? "text-foreground" : "text-muted-foreground",
            )}
          >
            Students
          </Link>
          <Link
            href="/memories"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname === "/memories" ? "text-foreground" : "text-muted-foreground",
            )}
          >
            Memories
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSearchModalOpen(true)}
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Placeholder for user info (will be replaced later) */}
          {/* {isLoggedIn ? (
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          ) : null} */}
          <Button variant="ghost" className="hidden md:flex">Login/Register</Button>
          <Button disabled={false} variant="outline" className="hidden md:flex" onClick={() => setIsSignModalOpen(true)}>
            Sign Yearbook
          </Button>
        </div>
      </div >

      <SignYearbookModal open={isSignModalOpen} onOpenChange={setIsSignModalOpen} />
      <SearchModal open={isSearchModalOpen} onOpenChange={setIsSearchModalOpen} />
    </header>
  )
}
