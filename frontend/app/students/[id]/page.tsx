"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { PageTransition } from "@/components/page-transition"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Heart, Share2, BookmarkPlus, Pen } from "lucide-react"
import { motion } from "framer-motion"
import { SignYearbookModal } from "@/components/sign-yearbook-modal"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"

const API_URL = process.env.NEXT_PUBLIC_API_URL


export default function StudentPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const student = getStudent(params.id)
  const [isSignModalOpen, setIsSignModalOpen] = useState(false)

  return (
    <StudentContent id={params.id} />
  )
}

interface Student {
  _id: string;
  name: string;
  quote: string;
  department: string;
  image: string;
  hobbies: string[];
  rememberFor: string;
  achievements: string[];
  signatures: {
    _id: string;
    author: string;
    message: string;
    style: string;
  }[];
}

const StudentContent = ({ id }: { id: string }) => {
  const [student, setStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await fetch(`${API_URL}/api/users/${id}`);
        const data = await response.json();
        setStudent(data.user);
      } catch (error) {
        toast.error("Failed to load student data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchStudent();
  }, [id]);
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <PageTransition>
        <main className="flex-1 py-10">
          <div className="container max-w-4xl">
            <Button variant="ghost" className="mb-6 group" onClick={() => router.push("/students")}>
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Gallery
            </Button>

            <div className="grid md:grid-cols-2 gap-10 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                {isLoading ? <Skeleton className="w-full h-[400px]" /> :
                  <div className="rounded-2xl overflow-hidden shadow-lg border">
                    <img src={student?.image || "/placeholder.svg"} alt={student?.name} className="w-full h-auto" />
                  </div>
                }
              </motion.div>

                <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                    className="space-y-6"
              >
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">{student.name}</h1>
                  <div className="inline-block px-3 py-1 rounded-full text-sm bg-secondary/30 text-secondary-foreground">
                    {student.department}
                  </div>
                </div>

                <blockquote className="text-xl italic font-playfair border-l-4 border-primary pl-4 py-2">
                    "{student.quote}"
                </blockquote>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Hobbies</h3>
                    {/* <div className="flex flex-wrap gap-2">
                      {student.hobbies.map((hobby, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 rounded-full text-sm bg-accent/30 text-accent-foreground"
                        >
                          {hobby}
                        </span>
                      ))}
                    </div> */}
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Remember Me For</h3>
                    {/* <p className="text-muted-foreground">{student.rememberFor}</p> */}
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Achievements</h3>
                   {/* <ul className="list-disc list-inside text-muted-foreground">
                      {student.achievements.map((achievement, index) => (
                        <li key={index}>{achievement}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button variant="outline" size="icon">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <BookmarkPlus className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="ml-auto" onClick={() => setIsSignModalOpen(true)}>
                    <Pen className="h-4 w-4 mr-2" />
                    Sign
                  </Button>
                </div>
              </motion.div>
            </div>

            {/* Signatures Section */}
            <div className="mt-16">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Yearbook Signatures</h2>
                <Button variant="outline" size="sm" onClick={() => setIsSignModalOpen(true)}>
                  <Pen className="h-4 w-4 mr-2" />
                  Add Your Signature
                </Button>
              </div>

              <div className="grid gap-4">
               {/*  {student.signatures.map((signature) => (
                  <div key={signature.id} className="border rounded-lg p-6 bg-muted/20">
                    <blockquote
                      className={`mb-4 ${
                        signature.style === "elegant"
                          ? "font-playfair italic"
                          : signature.style === "bold"
                            ? "font-sans font-bold"
                            : "font-sans"
                      }`}
                    >
                      "{signature.message}"
                    </blockquote>
                    <p className="text-right text-muted-foreground">— {signature.author}</p>
                  </div>
                ))} */}

                {/* {student.signatures.length === 0 && (
                  <div className="text-center py-10 border rounded-lg">
                    <p className="text-muted-foreground">No signatures yet. Be the first to sign!</p>
                    <Button variant="outline" className="mt-4" onClick={() => setIsSignModalOpen(true)}>
                      Sign Yearbook
                    </Button>
                  </div>
                )}
               */}</div>
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

      <SignYearbookModal open={isSignModalOpen} onOpenChange={setIsSignModalOpen} />
    </div>
  )
}

