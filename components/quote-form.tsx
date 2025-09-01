"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Send, CheckCircle, Clock, Shield, MessageSquare, Zap, Users, Award } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

interface FormData {
  name: string
  email: string
  company: string
  phone: string
  project_type: string
  budget: string
  timeline: string
  description: string
  requirements: string
}

const projectTypes = [
  { value: "web-development", label: "Web Development" },
  { value: "mobile-development", label: "Mobile Development" },
  { value: "ui-ux-design", label: "UI/UX Design" },
  { value: "e-commerce", label: "E-commerce Solution" },
  { value: "consultation", label: "Consultation" },
  { value: "other", label: "Other" },
]

const budgetRanges = [
  { value: "under-5k", label: "Under $5,000" },
  { value: "5k-10k", label: "$5,000 - $10,000" },
  { value: "10k-25k", label: "$10,000 - $25,000" },
  { value: "25k-50k", label: "$25,000 - $50,000" },
  { value: "over-50k", label: "Over $50,000" },
  { value: "discuss", label: "Let's Discuss" },
]

const timelines = [
  { value: "asap", label: "ASAP" },
  { value: "1-month", label: "1 Month" },
  { value: "2-3-months", label: "2-3 Months" },
  { value: "3-6-months", label: "3-6 Months" },
  { value: "flexible", label: "Flexible" },
]

interface QuoteFormProps {
  preSelectedService?: string
}

export default function QuoteForm({ preSelectedService }: QuoteFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    company: "",
    phone: "",
    project_type: preSelectedService || "",
    budget: "",
    timeline: "",
    description: "",
    requirements: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const { error: supabaseError } = await supabase.from("quote_requests").insert([
        {
          name: formData.name,
          email: formData.email,
          company: formData.company || null,
          phone: formData.phone || null,
          project_type: formData.project_type,
          budget: formData.budget || null,
          timeline: formData.timeline || null,
          description: formData.description,
          requirements: formData.requirements || null,
          status: "pending",
        },
      ])

      if (supabaseError) {
        console.error("Supabase error:", supabaseError)
        throw supabaseError
      }

      setIsSubmitted(true)
      toast.success("Quote request submitted successfully!")

      // Reset form after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false)
        setFormData({
          name: "",
          email: "",
          company: "",
          phone: "",
          project_type: preSelectedService || "",
          budget: "",
          timeline: "",
          description: "",
          requirements: "",
        })
      }, 5000)
    } catch (error) {
      console.error("Error submitting quote request:", error)
      setError("Failed to submit quote request. Please try again.")
      toast.error("Failed to submit quote request. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <section id="quote-form" className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/20" />
        <div className="container mx-auto px-4 relative z-10">
          <Card className="max-w-2xl mx-auto border-0 bg-card/80 backdrop-blur-sm shadow-2xl">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-foreground mb-4">Quote Request Submitted!</h3>
              <p className="text-muted-foreground mb-8 text-lg">
                Thank you for your interest! I'll review your requirements and get back to you within 24 hours with a
                detailed proposal.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center justify-center p-4 bg-background/50 rounded-lg">
                  <Clock className="w-5 h-5 text-primary mr-2" />
                  <span>24hr Response</span>
                </div>
                <div className="flex items-center justify-center p-4 bg-background/50 rounded-lg">
                  <Shield className="w-5 h-5 text-primary mr-2" />
                  <span>Secure & Private</span>
                </div>
                <div className="flex items-center justify-center p-4 bg-background/50 rounded-lg">
                  <Award className="w-5 h-5 text-primary mr-2" />
                  <span>Free Consultation</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    )
  }

  return (
    <section id="quote-form" className="py-20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 px-4 py-2 text-sm font-medium">
            <MessageSquare className="w-4 h-4 mr-2" />
            Get Quote
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Let's Build Something Amazing
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Tell me about your project and I'll provide you with a detailed quote and timeline within 24 hours.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card className="border-0 bg-card/80 backdrop-blur-sm shadow-2xl">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-bold text-foreground">Project Details</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium">
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="John Doe"
                        required
                        disabled={isSubmitting}
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="john@example.com"
                        required
                        disabled={isSubmitting}
                        className="h-12"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="company" className="text-sm font-medium">
                        Company
                      </Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => handleInputChange("company", e.target.value)}
                        placeholder="Your Company"
                        disabled={isSubmitting}
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium">
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="+1 (555) 123-4567"
                        disabled={isSubmitting}
                        className="h-12"
                      />
                    </div>
                  </div>

                  {/* Project Information */}
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="project_type" className="text-sm font-medium">
                        Project Type *
                      </Label>
                      <Select
                        name="project_type"
                        value={formData.project_type}
                        onValueChange={(value) => handleInputChange("project_type", value)}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {projectTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="budget" className="text-sm font-medium">
                        Budget Range
                      </Label>
                      <Select
                        value={formData.budget}
                        onValueChange={(value) => handleInputChange("budget", value)}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select budget" />
                        </SelectTrigger>
                        <SelectContent>
                          {budgetRanges.map((range) => (
                            <SelectItem key={range.value} value={range.value}>
                              {range.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timeline" className="text-sm font-medium">
                        Timeline
                      </Label>
                      <Select
                        value={formData.timeline}
                        onValueChange={(value) => handleInputChange("timeline", value)}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select timeline" />
                        </SelectTrigger>
                        <SelectContent>
                          {timelines.map((timeline) => (
                            <SelectItem key={timeline.value} value={timeline.value}>
                              {timeline.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Project Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-medium">
                      Project Description *
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder="Describe your project, goals, and what you're looking to achieve..."
                      required
                      disabled={isSubmitting}
                      rows={4}
                      className="resize-none"
                    />
                  </div>

                  {/* Additional Requirements */}
                  <div className="space-y-2">
                    <Label htmlFor="requirements" className="text-sm font-medium">
                      Additional Requirements
                    </Label>
                    <Textarea
                      id="requirements"
                      value={formData.requirements}
                      onChange={(e) => handleInputChange("requirements", e.target.value)}
                      placeholder="Any specific features, integrations, or technical requirements..."
                      disabled={isSubmitting}
                      rows={3}
                      className="resize-none"
                    />
                  </div>

                  {error && (
                    <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                      <p className="text-destructive text-sm">{error}</p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={
                      isSubmitting ||
                      !formData.name ||
                      !formData.email ||
                      !formData.project_type ||
                      !formData.description
                    }
                    className="w-full h-14 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-semibold text-lg rounded-xl transition-all duration-300 hover:shadow-lg disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Send Quote Request
                        <Send className="w-5 h-5 ml-3" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Process Card */}
            <Card className="border-0 bg-card/80 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-foreground flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-primary" />
                  What Happens Next?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-primary font-semibold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Review & Analysis</h4>
                    <p className="text-sm text-muted-foreground">
                      I'll carefully review your requirements and research your industry.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-primary font-semibold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Detailed Proposal</h4>
                    <p className="text-sm text-muted-foreground">
                      You'll receive a comprehensive proposal with timeline and pricing.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-primary font-semibold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Free Consultation</h4>
                    <p className="text-sm text-muted-foreground">
                      We'll schedule a call to discuss your project in detail.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trust Indicators */}
            <Card className="border-0 bg-card/80 backdrop-blur-sm shadow-xl">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-medium">24-hour response guarantee</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-blue-500" />
                    <span className="text-sm font-medium">Your information is secure</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-purple-500" />
                    <span className="text-sm font-medium">50+ satisfied clients</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Award className="w-5 h-5 text-orange-500" />
                    <span className="text-sm font-medium">98% client satisfaction rate</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card className="border-0 bg-gradient-to-br from-primary/10 to-secondary/10 backdrop-blur-sm shadow-xl">
              <CardContent className="p-6 text-center">
                <h3 className="font-bold text-foreground mb-2">Prefer to talk directly?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  I'm always happy to discuss your project over a call.
                </p>
                <Button variant="outline" className="w-full bg-transparent">
                  Schedule a Call
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
