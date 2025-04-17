"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

export default function FeedbackPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    // Show loading state briefly
    setTimeout(() => {
      // Show success message
      toast({
        title: "Thank you!",
        description: "Thanks for your valuable feedback. We'll definitely reach out to it.",
        duration: 5000, // Show for 5 seconds
      })

      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      })
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="container mx-auto p-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Hospital Contact Information</CardTitle>
            <CardDescription>Get in touch with us directly</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Email</Label>
              <p className="text-sm text-muted-foreground">contact@swiftbed.com</p>
            </div>
            <div>
              <Label>Phone Number</Label>
              <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
            </div>
            <div>
              <Label>Address</Label>
              <p className="text-sm text-muted-foreground">
                123 Hospital Street<br />
                City, State 12345
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Send us a Message</CardTitle>
            <CardDescription>We value your feedback</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter your name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="Enter your email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  required
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  placeholder="Enter subject"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  required
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  placeholder="Enter your message"
                  className="min-h-[100px]"
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 
