"use client"

import { notFound } from "next/navigation"
import { MapPin, Clock, CheckCircle, Star, ArrowRight, Phone, Mail, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import OptimizedImage from "@/components/optimized-image"
import { fetchServiceAreaBySlug } from "@/lib/supabase"

interface ServiceAreaPageProps {
  params: {
    slug: string
  }
}

const coreServices = [
  {
    title: "Shopify Store Setup",
    description: "Complete store configuration and theme customization",
    features: [
      "Theme selection & customization",
      "Product catalog setup",
      "Payment gateway integration",
      "Shipping configuration",
    ],
  },
  {
    title: "Custom Development",
    description: "Tailored solutions for unique business requirements",
    features: ["Custom app development", "Theme modifications", "API integrations", "Performance optimization"],
  },
  {
    title: "Store Migration",
    description: "Seamless migration from other platforms to Shopify",
    features: ["Data migration", "SEO preservation", "Design recreation", "Testing & validation"],
  },
  {
    title: "Ongoing Support",
    description: "Continuous maintenance and optimization services",
    features: ["Regular updates", "Performance monitoring", "Bug fixes", "Feature enhancements"],
  },
]

const workProcess = [
  {
    step: "01",
    title: "Free Consultation",
    description: "We discuss your business goals, requirements, and timeline to create a tailored strategy.",
  },
  {
    step: "02",
    title: "Store Audit & Planning",
    description: "Comprehensive analysis of your current setup and detailed project planning.",
  },
  {
    step: "03",
    title: "Development & Testing",
    description: "Custom development with rigorous testing to ensure everything works perfectly.",
  },
  {
    step: "04",
    title: "Launch & Training",
    description: "Smooth launch with comprehensive training for your team.",
  },
  {
    step: "05",
    title: "Ongoing Support",
    description: "Continuous support and optimization to help your store grow.",
  },
]

const portfolioProjects = [
  {
    title: "Fashion E-commerce Store",
    description: "Modern fashion store with advanced filtering and wishlist functionality",
    image: "/placeholder.svg?height=300&width=400&text=Fashion+Store",
    results: ["300% increase in conversions", "50% faster page load times", "Mobile-first design"],
  },
  {
    title: "Electronics Marketplace",
    description: "Multi-vendor marketplace with complex product configurations",
    image: "/placeholder.svg?height=300&width=400&text=Electronics+Store",
    results: ["500+ products migrated", "Custom comparison tool", "Integrated inventory system"],
  },
  {
    title: "Health & Beauty Brand",
    description: "Subscription-based store with custom product bundles",
    image: "/placeholder.svg?height=300&width=400&text=Beauty+Store",
    results: ["Subscription system", "Custom bundle builder", "Loyalty program integration"],
  },
]

export default async function ServiceAreaPageClient({ params }: ServiceAreaPageProps) {
  const serviceArea = await fetchServiceAreaBySlug(params.slug)

  if (!serviceArea) {
    notFound()
  }

  const cityName = serviceArea.title.split(" in ")[1] || serviceArea.slug

  return (
    <div className="min-h-screen">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: serviceArea.title,
            description: serviceArea.meta_description,
            address: {
              "@type": "PostalAddress",
              addressLocality: cityName,
            },
            serviceArea: cityName,
            priceRange: "$500-$15000",
            telephone: "+971-XX-XXX-XXXX",
            email: "hello@hamzatahir.com",
          }),
        }}
      />

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <OptimizedImage
            src={serviceArea.hero_image || "/placeholder.svg?height=800&width=1200&text=Hero+Background"}
            alt={`Shopify Expert in ${cityName}`}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="flex items-center justify-center gap-2 mb-6">
              <MapPin className="h-5 w-5" />
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                {cityName}
              </Badge>
            </div>

            <h1 className="text-4xl lg:text-6xl font-bold mb-6">{serviceArea.title}</h1>

            <p className="text-xl lg:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">{serviceArea.intro_text}</p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Hire a Shopify Expert in {cityName}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-black bg-transparent"
              >
                <Phone className="mr-2 h-5 w-5" />
                Free Consultation
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Why Choose a Local Shopify Expert in {cityName}?</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  As a certified Shopify expert based in the region, I understand the unique challenges and
                  opportunities of the {cityName} market. I combine global best practices with local market knowledge to
                  deliver exceptional results.
                </p>

                <div className="space-y-4">
                  {serviceArea.local_expertise.map((expertise, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{expertise}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <OptimizedImage
                  src="/placeholder.svg?height=400&width=500&text=Shopify+Expert"
                  alt="Shopify Expert"
                  width={500}
                  height={400}
                  className="rounded-lg shadow-lg"
                />
                <div className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground p-4 rounded-lg shadow-lg">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 fill-current" />
                    <span className="font-bold">5.0 Rating</span>
                  </div>
                  <p className="text-sm opacity-90">50+ Happy Clients</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Shopify Services in {cityName}</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive Shopify solutions tailored for {cityName} businesses
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {coreServices.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Success Stories</h2>
            <p className="text-xl text-muted-foreground">Recent Shopify projects that delivered exceptional results</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {portfolioProjects.map((project, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <OptimizedImage src={project.image} alt={project.title} fill className="object-cover" />
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{project.title}</CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {project.results.map((result, resultIndex) => (
                      <div key={resultIndex} className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm">{result}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How I Work</h2>
            <p className="text-xl text-muted-foreground">My proven 5-step process for Shopify success</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {workProcess.map((step, index) => (
                <div key={index} className="flex gap-6 items-start">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                      {step.step}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-xl text-muted-foreground">Common questions about Shopify services in {cityName}</p>
            </div>

            <Accordion type="single" collapsible className="w-full">
              {serviceArea.faq.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                  <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary/80">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-4xl font-bold mb-6">Ready to Grow Your Shopify Store in {cityName}?</h2>
            <p className="text-xl mb-8 opacity-90">
              Let's discuss your project and create a custom solution that drives results for your business.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                <Calendar className="mr-2 h-5 w-5" />
                Schedule Free Consultation
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-primary bg-transparent"
              >
                <Mail className="mr-2 h-5 w-5" />
                Get Project Quote
              </Button>
            </div>

            <div className="flex items-center justify-center gap-8 text-sm opacity-80">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Quick Response</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>Free Consultation</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                <span>5-Star Rated</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
