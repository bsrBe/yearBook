"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, User, BookOpen, X, Loader2 } from "lucide-react"

// Mock data for search results
const mockStudents = Array.from({ length: 24 }, (_, i) => ({
  id: i + 1,
  name: `Student ${i + 1}`,
  department: i % 3 === 0 ? "Science" : i % 3 === 1 ? "Arts" : "Business",
  image: `/placeholder.svg?height=100&width=100&text=S${i + 1}`,
}))

const mockMemories = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  content: `Memory ${i + 1}: The memories we've made will last a lifetime. I'll never forget the late nights studying.`,
  author: `Student ${(i % 24) + 1}`,
}))

interface SearchModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SearchModal({ open, onOpenChange }: SearchModalProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState({
    students: [] as typeof mockStudents,
    memories: [] as typeof mockMemories,
  })

  // Simulate search API call
  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults({ students: [], memories: [] })
      return
    }

    const query = searchQuery.toLowerCase()
    setIsLoading(true)

    // Simulate API delay
    const timer = setTimeout(() => {
      const filteredStudents = mockStudents.filter(
        (student) => student.name.toLowerCase().includes(query) || student.department.toLowerCase().includes(query),
      )

      const filteredMemories = mockMemories.filter(
        (memory) => memory.content.toLowerCase().includes(query) || memory.author.toLowerCase().includes(query),
      )

      setResults({
        students: filteredStudents,
        memories: filteredMemories,
      })
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const handleNavigation = (path: string) => {
    router.push(path)
    onOpenChange(false)
    setSearchQuery("")
  }

  const totalResults = results.students.length + results.memories.length

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 gap-0 overflow-hidden max-h-[80vh]">
        <div className="flex items-center border-b p-4">
          <Search className="h-5 w-5 text-muted-foreground mr-2 flex-shrink-0" />
          <Input
            placeholder="Search for students, memories, quotes..."
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-2"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
          {searchQuery && !isLoading && (
            <Button variant="ghost" size="icon" className="flex-shrink-0" onClick={() => setSearchQuery("")}>
              <X className="h-4 w-4" />
            </Button>
          )}
          {isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground flex-shrink-0" />}
        </div>

        <div className="overflow-y-auto max-h-[calc(80vh-60px)]">
          {searchQuery.trim() ? (
            <>
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="p-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all">All ({totalResults})</TabsTrigger>
                  <TabsTrigger value="students">Students ({results.students.length})</TabsTrigger>
                  <TabsTrigger value="memories">Memories ({results.memories.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-4 space-y-6">
                  {totalResults === 0 && !isLoading ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No results found for "{searchQuery}"</p>
                    </div>
                  ) : (
                    <>
                      {results.students.length > 0 && (
                        <div>
                          <h3 className="font-medium mb-3 text-sm text-muted-foreground">Students</h3>
                          <div className="space-y-2">
                            {results.students.slice(0, 3).map((student) => (
                              <div
                                key={student.id}
                                className="flex items-center p-2 rounded-md hover:bg-muted cursor-pointer"
                                onClick={() => handleNavigation(`/students/${student.id}`)}
                              >
                                <div className="w-10 h-10 rounded-full overflow-hidden mr-3 flex-shrink-0">
                                  <img
                                    src={student.image || "/placeholder.svg"}
                                    alt={student.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div>
                                  <p className="font-medium">{student.name}</p>
                                  <p className="text-sm text-muted-foreground">{student.department}</p>
                                </div>
                              </div>
                            ))}
                            {results.students.length > 3 && (
                              <Button
                                variant="ghost"
                                className="w-full text-primary"
                                onClick={() => setActiveTab("students")}
                              >
                                View all {results.students.length} students
                              </Button>
                            )}
                          </div>
                        </div>
                      )}

                      {results.memories.length > 0 && (
                        <div>
                          <h3 className="font-medium mb-3 text-sm text-muted-foreground">Memories</h3>
                          <div className="space-y-2">
                            {results.memories.slice(0, 3).map((memory) => (
                              <div
                                key={memory.id}
                                className="p-2 rounded-md hover:bg-muted cursor-pointer"
                                onClick={() => handleNavigation(`/memories?highlight=${memory.id}`)}
                              >
                                <p className="line-clamp-2">{memory.content}</p>
                                <p className="text-sm text-muted-foreground mt-1">By {memory.author}</p>
                              </div>
                            ))}
                            {results.memories.length > 3 && (
                              <Button
                                variant="ghost"
                                className="w-full text-primary"
                                onClick={() => setActiveTab("memories")}
                              >
                                View all {results.memories.length} memories
                              </Button>
                            )}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </TabsContent>

                <TabsContent value="students" className="mt-4">
                  {results.students.length === 0 && !isLoading ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No students found for "{searchQuery}"</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {results.students.map((student) => (
                        <div
                          key={student.id}
                          className="flex items-center p-2 rounded-md hover:bg-muted cursor-pointer"
                          onClick={() => handleNavigation(`/students/${student.id}`)}
                        >
                          <div className="w-10 h-10 rounded-full overflow-hidden mr-3 flex-shrink-0">
                            <img
                              src={student.image || "/placeholder.svg"}
                              alt={student.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium">{student.name}</p>
                            <p className="text-sm text-muted-foreground">{student.department}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="memories" className="mt-4">
                  {results.memories.length === 0 && !isLoading ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No memories found for "{searchQuery}"</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {results.memories.map((memory) => (
                        <div
                          key={memory.id}
                          className="p-3 rounded-md hover:bg-muted cursor-pointer border"
                          onClick={() => handleNavigation(`/memories?highlight=${memory.id}`)}
                        >
                          <p className="line-clamp-3">{memory.content}</p>
                          <p className="text-sm text-muted-foreground mt-2">By {memory.author}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </>
          ) : (
            <div className="p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-muted p-3">
                  <Search className="h-6 w-6 text-muted-foreground" />
                </div>
              </div>
              <h3 className="font-medium mb-2">Search the yearbook</h3>
              <p className="text-muted-foreground text-sm mb-4">Find students, memories, quotes, and more</p>
              <div className="grid grid-cols-2 gap-2 mt-6">
                <Button
                  variant="outline"
                  className="flex items-center justify-center gap-2"
                  onClick={() => handleNavigation("/students")}
                >
                  <User className="h-4 w-4" />
                  <span>Browse Students</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center justify-center gap-2"
                  onClick={() => handleNavigation("/memories")}
                >
                  <BookOpen className="h-4 w-4" />
                  <span>View Memories</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
