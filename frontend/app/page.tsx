"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { PageTransition } from "@/components/page-transition"
import { FloatingIcon } from "@/components/floating-icon"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { GraduationCap, Star, Heart } from "lucide-react"

interface Memory {
  id: string
  title: string
  content: string
  imageUrl: string
}

export default function Home() {
  const [memories, setMemories] = useState<Memory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMemories = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/memories`)
        if (!response.ok) {
          throw new Error(`API Error: ${response.statusText}`)
        }
        const data = await response.json()
        setMemories(data.slice(0, 3)) // Limit to the first 3 memories
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred.")
      } finally {
        setIsLoading(false)
      }
    }
    fetchMemories()
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <PageTransition>
        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative h-[80vh] overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center z-0"
              style={{
                backgroundImage: "url('/placeholder.svg?height=1080&width=1920')",
              }}
            />
            <div className="absolute inset-0 gradient-overlay z-10" />

            {/* Floating Icons */}
            <FloatingIcon className="absolute top-20 left-[10%] z-20 text-primary opacity-70">
              <GraduationCap size={24} />
            </FloatingIcon>
            <FloatingIcon className="absolute top-40 right-[15%] z-20 text-secondary opacity-70" delay={1}>
              <Star size={20} />
            </FloatingIcon>
            <FloatingIcon className="absolute bottom-40 left-[20%] z-20 text-accent opacity-70" delay={2}>
              <Heart size={18} />
            </FloatingIcon>

            <div className="relative container h-full flex flex-col items-center justify-center text-center z-20">
              <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight">Class of 2025</h1>
              <p className="text-xl md:text-2xl mb-8 max-w-2xl text-muted-foreground">
                A moment in time, forever online.
              </p>
              <Button asChild size="lg" className="rounded-full px-8 transition-all duration-300 hover:scale-105">
                <Link href="/students">Explore Yearbook</Link>
              </Button>
            </div>
          </section>

          {/* Featured Memories */}
          <section className="py-20 bg-accent/20">
            <div className="container">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Cherished Moments</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {isLoading &&
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="bg-background rounded-lg p-6 shadow-md">
                      <Skeleton className="aspect-video rounded-md mb-4" />
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-5/6" />
                    </div>
                  ))}

                {!isLoading &&
                  error && (
                    <Alert variant="destructive">
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                {!isLoading &&
                  !error &&
                  memories.map((memory) => (
                  <div
                    key={memory.id}
                    className="bg-background rounded-lg p-6 shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                  >
                    <div className="aspect-video rounded-md overflow-hidden mb-4">
                      {memory.imageUrl ? (
                        <Image
                          src={memory.imageUrl}
                          alt={memory.title}
                          width={500}
                          height={300}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Image src="/placeholder.jpg" alt="Placeholder" width={500} height={300} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{memory.title}</h3>
                    <p className="text-muted-foreground">{memory.content}</p>
                  </div>
                ))}


              </div>
              <div className="text-center mt-12">
                <Button asChild variant="outline">
                  <Link href="/memories">View All Memories</Link>
                </Button>
              </div>
            </div>
          </section>

          {/* Quote Section */}
          <section className="py-20">
            <div className="container max-w-4xl text-center">
              <blockquote className="text-2xl md:text-3xl font-playfair italic mb-6">
                "We didn't realize we were making memories, we just knew we were having fun."
              </blockquote>
              <cite className="text-muted-foreground">— Class President</cite>
            </div>
          </section>
        </main>

        <footer className="border-t py-6 bg-muted/30">
          <div className="container flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} University College. All rights reserved.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
                Privacy Policy
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
                Terms of Service
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
                Contact
              </Link>
            </div>
          </div>
        </footer>
      </PageTransition>
    </div>
  )
}
