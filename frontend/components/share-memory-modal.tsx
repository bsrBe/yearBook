"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Check, BookOpen } from "lucide-react"

interface ShareMemoryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ShareMemoryModal({ open, onOpenChange }: ShareMemoryModalProps) {
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isError, setIsError] = useState(false)

  // Dummy variables for JWT and User ID - Replace with actual data fetching logic
  const dummyJwtToken = "YOUR_JWT_TOKEN"; // Replace with actual JWT token retrieval
  const dummyUserId = "YOUR_USER_ID"; // Replace with actual user ID retrieval

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setIsError(false)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/memories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${dummyJwtToken}` // Include JWT token in the header
        },
        body: JSON.stringify({ content }), // Send content and authorId
      })

      if (!response.ok) {
        setIsError(true)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      setIsSuccess(true)
    } catch (error) {
      setIsError(true)
      console.error("Failed to share memory:", error)
    } finally {
      setIsSubmitting(false)
        setContent("");
        setTimeout(() => {
        setIsSuccess(false);
        setContent("");
      }, 2000); // added this curly brace
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Share Your Memory
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Share a special memory, quote, or thought that captures your college experience.
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="py-10 flex flex-col items-center justify-center text-center">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-medium mb-2">Memory Shared!</h3>
            <p className="text-muted-foreground">
              Your memory has been added to the yearbook. Thank you for your contribution!
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="content">Your Memory</Label>
                <Textarea
                  id="content"
                  placeholder="Share a special moment, quote, or reflection..."
                  className="min-h-[150px]"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="author">Your Name</Label>
                <Input
                  id="author"
                  placeholder="How you want to be credited"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  This will be displayed publicly and linked to your student profile if you're a student.
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={!content.trim() || !author.trim() || isSubmitting}>
                {isSubmitting ? "Sharing..." : "Share Memory"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
