"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { PageTransition } from "@/components/page-transition"
import { FloatingIcon } from "@/components/floating-icon"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Star, Heart, MessageCircle, GraduationCap } from "lucide-react"
import { motion } from "framer-motion"
import { ShareMemoryModal } from "@/components/share-memory-modal"

// Extract student ID from author name (for demo purposes)
const getStudentId = (author: string) => {
  const match = author.match(/Student (\d+)/)
  return match ? match[1] : null
}

// Mock memories data
const memories = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  content:
    "The memories we've made will last a lifetime. I'll never forget the late nights studying, the campus events, and all the friends I've made along the way.",
  author: `Student ${i + 1}`,
  likes: Math.floor(Math.random() * 50) + 1,
  comments: Math.floor(Math.random() * 10),
  rotation: Math.random() * 6 - 3, // Random rotation between -3 and 3 degrees
  color:
    i % 4 === 0
      ? "bg-rosegold/20"
      : i % 4 === 1
        ? "bg-softblue/20"
        : i % 4 === 2
          ? "bg-lavender/20"
          : "bg-dustypink/20",
}))

export default function MemoriesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)

  const filteredMemories = memories.filter(
    (memory) =>
      memory.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      memory.author.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <PageTransition>
        <main className="flex-1 py-10 relative overflow-hidden">
          {/* Floating Icons */}
          <FloatingIcon className="absolute top-20 left-[10%] z-0 text-primary opacity-30">
            <GraduationCap size={32} />
          </FloatingIcon>
          <FloatingIcon className="absolute top-40 right-[15%] z-0 text-secondary opacity-30" delay={1}>
            <Star size={28} />
          </FloatingIcon>
          <FloatingIcon className="absolute bottom-40 left-[20%] z-0 text-accent opacity-30" delay={2}>
            <Heart size={24} />
          </FloatingIcon>

          <div className="container relative z-10">
            <div className="text-center mb-10">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Shared Memories</h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                A collection of thoughts, quotes, and memories from our graduating class.
              </p>
            </div>

            {/* Search */}
            <div className="max-w-md mx-auto mb-12">
              <Input
                placeholder="Search memories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-full"
              />
            </div>

            {/* Memory Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredMemories.map((memory, index) => (
                <motion.div
                  key={memory.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  style={
                    {
                      "--rotation": `${memory.rotation}deg`,
                    } as React.CSSProperties
                  }
                  className="memory-card"
                >
                  <div className={`rounded-lg p-6 shadow-md ${memory.color} border`}>
                    <blockquote className="text-lg font-playfair italic mb-4">"{memory.content}"</blockquote>
                    <div className="flex justify-between items-center">
                      {/* Link to student profile if it's a student */}
                      {getStudentId(memory.author) ? (
                        <Link
                          href={`/students/${getStudentId(memory.author)}`}
                          className="font-medium hover:text-primary transition-colors"
                        >
                          {memory.author}
                        </Link>
                      ) : (
                        <p className="font-medium">{memory.author}</p>
                      )}
                      <div className="flex gap-3">
                        <button className="flex items-center text-sm text-muted-foreground hover:text-primary">
                          <Heart className="h-4 w-4 mr-1" />
                          {memory.likes}
                        </button>
                        <button className="flex items-center text-sm text-muted-foreground hover:text-primary">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          {memory.comments}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredMemories.length === 0 && (
              <div className="text-center py-20">
                <h3 className="text-xl font-medium mb-2">No memories found</h3>
                <p className="text-muted-foreground">Try adjusting your search</p>
                <Button variant="outline" className="mt-4" onClick={() => setSearchQuery("")}>
                  Reset Search
                </Button>
              </div>
            )}

            {/* Add Memory */}
            <div className="text-center mt-16">
              <Button size="lg" className="rounded-full px-8" onClick={() => setIsShareModalOpen(true)}>
                Share Your Memory
              </Button>
            </div>
          </div>
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

      <ShareMemoryModal open={isShareModalOpen} onOpenChange={setIsShareModalOpen} />
    </div>
  )
}
