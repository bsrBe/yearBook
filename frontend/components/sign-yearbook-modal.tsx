"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Pen, Check } from "lucide-react"

// Mock student data - in a real app, you'd fetch this from an API
const students = Array.from({ length: 24 }, (_, i) => ({
  id: i + 1,
  name: `Student ${i + 1}`,
}))

interface SignYearbookModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SignYearbookModal({ open, onOpenChange }: SignYearbookModalProps) {
  const [recipient, setRecipient] = useState("general")
  const [message, setMessage] = useState("")
  const [name, setName] = useState("")
  const [style, setStyle] = useState("casual")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = () => {
    setIsSubmitting(true)

    // Simulate API call to save the signature
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)

      // Reset form after success
      setTimeout(() => {
        setIsSuccess(false)
        setMessage("")
        setRecipient("general")
        setStyle("casual")
        onOpenChange(false)
      }, 1500)
    }, 1000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pen className="h-5 w-5 text-primary" />
            Sign the Yearbook
          </DialogTitle>
          <DialogDescription>Leave a personal message that will be treasured for years to come.</DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="py-10 flex flex-col items-center justify-center text-center">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-medium mb-2">Signature Added!</h3>
            <p className="text-muted-foreground">
              Your message has been added to the yearbook. Thank you for your contribution!
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="recipient">Who are you signing for?</Label>
                <Select value={recipient} onValueChange={setRecipient}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select recipient" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">The Entire Class</SelectItem>
                    {students.map((student) => (
                      <SelectItem key={student.id} value={student.id.toString()}>
                        {student.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="message">Your Message</Label>
                <Textarea
                  id="message"
                  placeholder="Write your heartfelt message here..."
                  className="min-h-[120px]"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  placeholder="How you want to be remembered"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label>Signature Style</Label>
                <RadioGroup value={style} onValueChange={setStyle} className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="casual" id="casual" />
                    <Label htmlFor="casual" className="font-sans">
                      Casual
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="elegant" id="elegant" />
                    <Label htmlFor="elegant" className="font-playfair italic">
                      Elegant
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="bold" id="bold" />
                    <Label htmlFor="bold" className="font-sans font-bold">
                      Bold
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={!message.trim() || !name.trim() || isSubmitting}>
                {isSubmitting ? "Signing..." : "Sign Yearbook"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
