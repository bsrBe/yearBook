"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { PageTransition } from "@/components/page-transition"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter } from "lucide-react"
import { motion } from "framer-motion"

// Mock student data
const students = Array.from({ length: 24 }, (_, i) => ({
  id: i + 1,
  name: `Student ${i + 1}`,
  quote: "This is where I'll leave my mark on the world.",
  department: i % 3 === 0 ? "Science" : i % 3 === 1 ? "Arts" : "Business",
  image: `/placeholder.svg?height=400&width=400&text=Student ${i + 1}`,
}))
import { Skeleton } from "@/components/ui/skeleton";


interface Student {
  _id: string;
  name: string;
  quote: string;
  department: string;
  profilePicture: string;
}

export default function StudentsPage () {
  const [searchQuery, setSearchQuery] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setStudents(data);
      } catch (err: any) {
        console.error('Failed to fetch students:', err);
        setError("Failed to load students. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.quote.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = departmentFilter === "all" || student.department === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  const departmentOptions = Array.from(new Set(students.map(student => student.department)));

  return (
    <div className="min-h-screen flex flex-col bg-muted/5">
      <Navbar />
      <PageTransition>
        <main className="flex-1 py-10 ">
          <div className="container">
            <div className="text-center mb-10">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Graduating Class</h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Browse through our amazing students and their parting words as they embark on new journeys.
              </p>
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                  <strong className="font-bold">Error: </strong>
                  <span className="block sm:inline">{error}</span>
                </div>
              )}
            </div>
            {/*search*/}
            <div className="flex flex-col md:flex-row gap-4 mb-10 max-w-3xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by name or quote..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2 items-center">
                <Filter className="text-muted-foreground h-4 w-4" />
                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Departments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {departmentOptions.map((department) => (
                      <SelectItem key={department} value={department}>{department}</SelectItem>
                    ))}
                  </SelectContent>

                </Select>
              </div>
            </div>

            {/* Student Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredStudents.map((student, index) => (
                <motion.div
                  key={student.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Link href={`/students/${student.id}`}>
                    <div className="group bg-background rounded-lg p-6 shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1 text-center flex flex-col justify-between">
                      {loading ? (
                         <div className="space-y-4">
                         <Skeleton className="w-32 h-32 mx-auto rounded-full" />
                         <Skeleton className="w-48 h-6 mx-auto" />
                         <Skeleton className="w-full h-4 mx-auto" />
                         <Skeleton className="w-24 h-4 mx-auto mt-3" />
                       </div>
                      ) : (
                        <>
                         <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-primary/20 group-hover:border-primary transition-colors duration-300">
                         <img
                           src={student.profilePicture}
                           alt={student.name}
                           className="w-full h-full object-cover"
                         />
                       </div>
                        <h3 className="text-xl font-bold mb-2">{student.name}</h3>
                        <p className="text-sm text-muted-foreground italic line-clamp-2">"{student.quote}"</p>
                        <div className="mt-3">
                         <span className="inline-block px-3 py-1 rounded-full text-xs bg-secondary/30 text-secondary-foreground">
                           {student.department}
                         </span>
                         </div>
                         </>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {filteredStudents.length === 0 && (
              <div className="text-center py-20">
                <h3 className="text-xl font-medium mb-2">No students found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery("")
                    setDepartmentFilter("all")
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            )}
          </div>
        </main>

        <footer className="border-t py-6 bg-muted/10">
          <div className="container flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} University Yearbook. All rights reserved.</p>

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
