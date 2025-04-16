"use client"

import type React from "react"

import { useState, useEffect, useMemo, useCallback } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { PageTransition, PageLoading } from "@/components/page-transition"
import { FloatingIcon } from "@/components/floating-icon"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { Star, Heart, MessageCircle, GraduationCap } from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "@/components/ui/use-toast"
import { ShareMemoryModal } from "@/components/share-memory-modal"

// Extract student ID from author name (for demo purposes)
// const getStudentId = (author: string) => {
//   const match = author.match(/Student (\d+)/)
//   return match ? match[1] : null
// }

import { fetchUserDetails } from "@/lib/utils"

export interface Memory {
  id: string;
  content: string;
  authorId: string;
  likes: string[];
  comments: string[];
  rotation?: number;
  color?: string;
  createdAt: Date;
}

export default function MemoriesPage() {
  const [memories, setMemories] = useState<Memory[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [users, setUsers] = useState<Record<string, any>>({});

  const authorIds = useMemo(() => {
    return Array.from(new Set(memories.map((memory) => memory.authorId)));
  }, [memories]);

  const fetchMemories = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      if (!apiUrl) {
        throw new Error("API URL is not defined");
      }
      const response = await fetch(`${apiUrl}/api/memories`, {
        method: "GET",
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch memories: ${response.statusText}`);
      }

      const data = await response.json();
      setMemories(data.memories);
    } catch (error) {
      setIsError(true);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem fetching memories. Please try again later.",
      })
      console.error("Failed to fetch memories:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMemories();
  }, [fetchMemories]);

  useEffect(() => {
    const fetchAllUsers = async () => {
      const usersData: Record<string, any> = {};

      if (authorIds.length > 0) {
        await Promise.all(
          authorIds.map(async (authorId) => {
            const user = await fetchUserDetails(authorId);
            if (user) {
              usersData[authorId] = user;
            }
          })
        );

        setUsers(usersData);
      }
    };

    if (authorIds.length > 0) {
      fetchAllUsers();
    }
  }, [authorIds]);

  const filteredMemories = memories.filter(
    (memory) =>
      memory.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (users[memory.authorId]?.name || "Unknown Author")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())

  )
  if (isLoading) {
    return <PageLoading />;
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">Failed to load memories.</p>
      </div>
    );
  }


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
                    {users[memory.authorId]?.id ? (
                        <Link
                          href={`/students/${users[memory.authorId]?.id}`}
                          className="font-medium hover:text-primary transition-colors"
                        >
                          {users[memory.authorId]?.name || "Unknown Author"}
                        </Link>
                      ) : (users[memory.authorId]?.name &&
                        <p className="font-medium">{users[memory.authorId]?.name}</p> ||
                         <p className="font-medium">Unknown Author</p>
                      )}
                      <div className="flex gap-3">
                        <button className="flex items-center text-sm text-muted-foreground hover:text-primary">
                          <Heart className="h-4 w-4 mr-1"/>
                          {memory.likes.length}
                        </button>
                        <button className="flex items-center text-sm text-muted-foreground hover:text-primary">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          {memory.comments.length}
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
