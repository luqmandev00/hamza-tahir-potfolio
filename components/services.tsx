"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Code, ShoppingCart, Smartphone, Palette, Search, Zap, ArrowRight, CheckCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import LazySection from "./lazy-section"
import { fetchHomeServices } from "@/lib/supabase"

interface Service {
  id: string
  title: string
  description: string
  icon: string
  features: string[]
  price_range: string
  show_on_home: boolean
}

const iconMap = {
  Code,
  ShoppingCart,
  Smartphone,
  Palette,
  Search,
  Zap,
}

export default function Services() {
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadServices = async () => {
      try {
        const data = await fetchHomeServices()
        setServices(data)
      } catch (error) {
        console.error("Error loading services:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadServices()
  }, [])

  if (isLoading) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="h-8 bg-muted rounded w-48 mx-auto mb-4 animate-pulse" />
            <div className="h-4 bg-muted rounded w-96 mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-6">
                <div className="h-12 w-12 bg-muted rounded-lg animate-pulse mb-4" />
                <div className="h-6 bg-muted rounded animate-pulse mb-2" />
                <div className="h-4 bg-muted rounded animate-pulse mb-4" />
                <div className="space-y-2 mb-4">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="h-4 bg-muted rounded animate-pulse" />
                  ))}
                </div>
                <div className="h-6 bg-muted rounded w-24 animate-pulse mb-4" />
                <div className="h-9 bg-muted rounded animate-pulse" />
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <LazySection animation="fade" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Services I Offer</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            I provide comprehensive web development services to help bring your ideas to life with modern technologies
            and best practices.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = iconMap[service.icon as keyof typeof iconMap] || Code

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 group border-0 bg-gradient-to-br from-background to-muted/50">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {service.price_range}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {service.title}
                    </CardTitle>
                    <CardDescription className="text-sm leading-relaxed">{service.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="space-y-3 mb-6">
                      {service.features.map((feature, featureIndex) => (
                        <motion.div
                          key={featureIndex}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 + featureIndex * 0.05 }}
                          className="flex items-center gap-3 text-sm"
                        >
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </motion.div>
                      ))}
                    </div>

                    <Button
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 bg-transparent"
                      variant="outline"
                    >
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Need Something Custom?</h3>
            <p className="text-muted-foreground mb-6">
              Don't see exactly what you're looking for? I'd love to discuss your unique project requirements and create
              a custom solution.
            </p>
            <Button size="lg">
              Let's Talk About Your Project
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </div>
    </LazySection>
  )
}
