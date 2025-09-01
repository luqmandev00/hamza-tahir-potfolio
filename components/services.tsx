"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, ArrowRight, Sparkles, Star, Users, Clock, Award, TrendingUp } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface Service {
  id: string
  name: string
  description: string
  icon: string
  features: string[]
  price_range?: string
  order_index: number
  published: boolean
  created_at: string
  updated_at: string
}

const Services = () => {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("published", true)
        .order("order_index", { ascending: true })

      if (error) throw error
      setServices(data || [])
    } catch (error) {
      console.error("Error fetching services:", error)
      // Fallback to default services if database fails
      setServices([
        {
          id: "web-development",
          name: "Web Development",
          description: "Custom websites and web applications built with modern technologies",
          icon: "🌐",
          features: ["Responsive Design", "SEO Optimized", "Fast Performance", "Modern UI/UX", "CMS Integration"],
          price_range: "Starting at $2,500",
          order_index: 1,
          published: true,
          created_at: "",
          updated_at: "",
        },
        {
          id: "mobile-development",
          name: "Mobile Development",
          description: "Native and cross-platform mobile apps for iOS and Android",
          icon: "📱",
          features: [
            "Cross-Platform",
            "Native Performance",
            "App Store Ready",
            "Push Notifications",
            "Offline Support",
          ],
          price_range: "Starting at $5,000",
          order_index: 2,
          published: true,
          created_at: "",
          updated_at: "",
        },
        {
          id: "ui-ux-design",
          name: "UI/UX Design",
          description: "Beautiful and intuitive user interfaces that convert visitors",
          icon: "🎨",
          features: ["User Research", "Wireframing", "Prototyping", "Design System", "Usability Testing"],
          price_range: "Starting at $1,500",
          order_index: 3,
          published: true,
          created_at: "",
          updated_at: "",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const scrollToContact = (serviceType?: string) => {
    const contactSection = document.getElementById("contact")
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" })
      // Pre-select the service type in the contact form if available
      if (serviceType) {
        setTimeout(() => {
          const serviceSelect = document.querySelector('select[name="service"]') as HTMLSelectElement
          if (serviceSelect) {
            serviceSelect.value = serviceType
            serviceSelect.dispatchEvent(new Event("change", { bubbles: true }))
          }
        }, 500)
      }
    }
  }

  const stats = [
    { icon: Users, value: "50+", label: "Happy Clients" },
    { icon: Award, value: "100+", label: "Projects Completed" },
    { icon: Clock, value: "5+", label: "Years Experience" },
    { icon: TrendingUp, value: "98%", label: "Client Satisfaction" },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  }

  if (loading) {
    return (
      <section id="services" className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <div className="container mx-auto px-4 flex items-center justify-center">
          <motion.div
            className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          />
        </div>
      </section>
    )
  }

  return (
    <section id="services" className="py-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4"
              whileHover={{ scale: 1.05 }}
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">What I Offer</span>
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Premium Services
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Transform your digital presence with cutting-edge web solutions designed to drive growth and engagement
            </p>
          </motion.div>

          {/* Stats Section */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/20 transition-all duration-300"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <stat.icon className="w-8 h-8 mx-auto mb-3 text-primary" />
                <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {services.map((service, index) => {
              const isPopular = index === 1 // Make middle service popular

              return (
                <motion.div
                  key={service.id}
                  variants={itemVariants}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group relative"
                >
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                      <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold px-4 py-1 shadow-lg">
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  <Card
                    className={`h-full transition-all duration-300 hover:shadow-2xl border-2 group-hover:border-primary/30 relative overflow-hidden ${
                      isPopular ? "border-primary/20 shadow-lg" : "hover:border-primary/20"
                    }`}
                  >
                    {/* Card Background Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <CardHeader className="text-center pb-4 relative z-10">
                      {/* Icon */}
                      <motion.div
                        className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                        whileHover={{ rotate: 5 }}
                      >
                        <span className="text-3xl">{service.icon}</span>
                      </motion.div>

                      <CardTitle className="text-2xl mb-3 group-hover:text-primary transition-colors">
                        {service.title}
                      </CardTitle>
                      <p className="text-muted-foreground leading-relaxed">{service.description}</p>

                      {service.price_range && (
                        <motion.div whileHover={{ scale: 1.05 }} className="mt-4">
                          <Badge variant="outline" className="text-lg px-4 py-2 font-semibold">
                            {service.price_range}
                          </Badge>
                        </motion.div>
                      )}
                    </CardHeader>

                    <CardContent className="pt-0 relative z-10">
                      {/* Features List */}
                      <ul className="space-y-3 mb-8">
                        {service.features.map((feature, featureIndex) => (
                          <motion.li
                            key={featureIndex}
                            className="flex items-start gap-3"
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: featureIndex * 0.1 }}
                          >
                            <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Check className="w-3 h-3 text-primary" />
                            </div>
                            <span className="text-sm leading-relaxed">{feature}</span>
                          </motion.li>
                        ))}
                      </ul>

                      {/* CTA Button */}
                      <Button
                        onClick={() => scrollToContact(service.id)}
                        className={`w-full group/btn transition-all duration-300 ${
                          isPopular
                            ? "bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-lg"
                            : "hover:bg-primary hover:text-primary-foreground"
                        }`}
                        variant={isPopular ? "default" : "outline"}
                      >
                        <span>Get Started</span>
                        <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>

          {/* Bottom CTA */}
          <motion.div variants={itemVariants} className="text-center">
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 border border-primary/20">
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Need Something Custom?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Every project is unique. Let's discuss your specific requirements and create a tailored solution that
                perfectly fits your needs.
              </p>
              <Button
                onClick={() => scrollToContact("custom")}
                size="lg"
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Start Your Project
              </Button>
            </div>
          </motion.div>

          {services.length === 0 && (
            <motion.div variants={itemVariants} className="text-center py-12">
              <div className="bg-muted/50 rounded-lg p-8">
                <p className="text-muted-foreground text-lg">No services available at the moment.</p>
                <p className="text-sm text-muted-foreground mt-2">Please check back later or contact me directly.</p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  )
}

export default Services
