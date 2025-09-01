"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle,
  Clock,
  Shield,
  Zap,
  MessageSquare,
  User,
  Briefcase,
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    projectType: "",
    budget: "",
    timeline: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const { error } = await supabase.from("contact_messages").insert([
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: `${formData.service} - ${formData.projectType}`,
          message: `Service: ${formData.service}
Project Type: ${formData.projectType}
Budget: ${formData.budget}
Timeline: ${formData.timeline}
Phone: ${formData.phone}

Message:
${formData.message}`,
          status: "unread",
        },
      ])

      if (error) throw error

      setIsSubmitted(true)
      toast.success("Message sent successfully!")

      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false)
        setFormData({
          name: "",
          email: "",
          phone: "",
          service: "",
          projectType: "",
          budget: "",
          timeline: "",
          message: "",
        })
      }, 19000)
    } catch (error) {
      console.error("Error submitting contact form:", error)
      toast.error("Failed to send message. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "mhamzatahir048@gmail.com",
      href: "mailto:mhamzatahir048@gmail.com",
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+92 (308) 502-6488",
      href: "tel:+923085026488",
    },
    {
      icon: MapPin,
      label: "Location",
      value: "Lahore Punjab Pakistan",
      href: "https://share.google/CAZ8Xka7M4w0OMDhy",
    },
  ]

  const trustIndicators = [
    { icon: Clock, text: "24h Response Time" },
    { icon: Shield, text: "100% Confidential" },
    { icon: CheckCircle, text: "Free Consultation" },
    { icon: Zap, text: "Quick Turnaround" },
  ]

  return (
    <section id="contact" className="py-20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4 px-4 py-2 text-sm font-medium">
            <MessageSquare className="w-4 h-4 mr-2" />
            Get In Touch
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Let's Work Together
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Ready to bring your project to life? Get in touch and let's discuss how we can create something amazing
            together.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <Card className="p-8 border-2 border-border/50 hover:border-primary/20 transition-all duration-300">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Briefcase className="w-6 h-6 text-primary" />
                  Project Details
                </CardTitle>
              </CardHeader>

              <CardContent className="px-0 pb-0">
                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-2 text-green-600">Message Sent Successfully!</h3>
                    <p className="text-muted-foreground mb-6">
                      Thank you for reaching out. I'll get back to you within 24 hours with a detailed response.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                      {trustIndicators.map((indicator, index) => (
                        <Badge key={index} variant="outline" className="px-3 py-1">
                          <indicator.icon className="w-3 h-3 mr-1" />
                          {indicator.text}
                        </Badge>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Full Name *
                        </Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          placeholder="John Doe"
                          required
                          className="h-12"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          Email Address *
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          placeholder="john@example.com"
                          required
                          className="h-12"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="+1 (555) 123-4567"
                        className="h-12"
                      />
                    </div>

                    {/* Project Details */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="service">Service Needed *</Label>
                        <Select value={formData.service} onValueChange={(value) => handleInputChange("service", value)}>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Select a service" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="web-development">Web Development</SelectItem>
                            <SelectItem value="mobile-development">Mobile Development</SelectItem>
                            <SelectItem value="ui-ux-design">UI/UX Design</SelectItem>
                            <SelectItem value="consultation">Consultation</SelectItem>
                            <SelectItem value="custom">Custom Project</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="projectType">Project Type</Label>
                        <Select
                          value={formData.projectType}
                          onValueChange={(value) => handleInputChange("projectType", value)}
                        >
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Select project type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new-website">New Website</SelectItem>
                            <SelectItem value="redesign">Website Redesign</SelectItem>
                            <SelectItem value="mobile-app">Mobile App</SelectItem>
                            <SelectItem value="e-commerce">E-commerce</SelectItem>
                            <SelectItem value="maintenance">Maintenance</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="budget">Budget Range</Label>
                        <Select value={formData.budget} onValueChange={(value) => handleInputChange("budget", value)}>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Select budget range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="under-5k">Under $5,000</SelectItem>
                            <SelectItem value="5k-10k">$5,000 - $10,000</SelectItem>
                            <SelectItem value="10k-25k">$10,000 - $25,000</SelectItem>
                            <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                            <SelectItem value="50k-plus">$50,000+</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="timeline">Timeline</Label>
                        <Select
                          value={formData.timeline}
                          onValueChange={(value) => handleInputChange("timeline", value)}
                        >
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Select timeline" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="asap">ASAP</SelectItem>
                            <SelectItem value="1-month">Within 1 month</SelectItem>
                            <SelectItem value="2-3-months">2-3 months</SelectItem>
                            <SelectItem value="3-6-months">3-6 months</SelectItem>
                            <SelectItem value="flexible">Flexible</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Project Description *</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => handleInputChange("message", e.target.value)}
                        placeholder="Tell me about your project, goals, and any specific requirements..."
                        rows={6}
                        required
                        className="resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-12 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold text-lg transition-all duration-300 hover:shadow-lg"
                    >
                      {isSubmitting ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full mr-2"
                        />
                      ) : (
                        <Send className="w-5 h-5 mr-2" />
                      )}
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Contact Info */}
            <Card className="p-6 border-2 border-border/50">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-xl">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="px-0 pb-0 space-y-4">
                {contactInfo.map((info, index) => (
                  <motion.a
                    key={index}
                    href={info.href}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                    whileHover={{ x: 5 }}
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <info.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">{info.label}</div>
                      <div className="font-medium">{info.value}</div>
                    </div>
                  </motion.a>
                ))}
              </CardContent>
            </Card>

            {/* Trust Indicators */}
            <Card className="p-6 border-2 border-border/50">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-xl">Why Choose Me?</CardTitle>
              </CardHeader>
              <CardContent className="px-0 pb-0 space-y-4">
                {trustIndicators.map((indicator, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <indicator.icon className="w-5 h-5 text-green-500" />
                    <span className="text-sm">{indicator.text}</span>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            {/* Process */}
            <Card className="p-6 border-2 border-border/50">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-xl">Next Steps</CardTitle>
              </CardHeader>
              <CardContent className="px-0 pb-0 space-y-4">
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      1
                    </div>
                    <div>
                      <div className="font-medium text-foreground">Send Your Message</div>
                      <div>Fill out the form with your project details</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      2
                    </div>
                    <div>
                      <div className="font-medium text-foreground">Initial Consultation</div>
                      <div>We'll schedule a call to discuss your needs</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      3
                    </div>
                    <div>
                      <div className="font-medium text-foreground">Proposal & Timeline</div>
                      <div>Receive a detailed proposal within 24 hours</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Contact
