"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowDown, Github, Linkedin, Mail, Sparkles, Phone, Facebook} from "lucide-react"
import { useEffect, useState } from "react"
import { useSiteSettings } from "@/lib/hooks/use-site-settings"

const Hero = () => {
  const { settings, loading } = useSiteSettings()
  const [displayText, setDisplayText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  const titles = [
    settings.tagline || "Full Stack Developer",
    "WordPress Expert",
    "Shopify Specialist",
    "Problem Solver",
  ]

  useEffect(() => {
    const currentTitle = titles[currentIndex]
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (displayText.length < currentTitle.length) {
            setDisplayText(currentTitle.slice(0, displayText.length + 1))
          } else {
            setTimeout(() => setIsDeleting(true), 2000)
          }
        } else {
          if (displayText.length > 0) {
            setDisplayText(displayText.slice(0, -1))
          } else {
            setIsDeleting(false)
            setCurrentIndex((prev) => (prev + 1) % titles.length)
          }
        }
      },
      isDeleting ? 50 : 100,
    )

    return () => clearTimeout(timeout)
  }, [displayText, currentIndex, isDeleting]) // Removed titles from dependencies

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      const headerHeight = 80
      const elementPosition = element.offsetTop - headerHeight
      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      })
    }
  }

  if (loading) {
    return (
      <section id="home" className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </section>
    )
  }

  const fullName = settings.full_name || "Hamza Tahir"
  const bio =
    settings.bio ||
    "I craft exceptional digital experiences through modern web development, specializing in WordPress, Shopify, and full-stack solutions that drive business growth and user engagement."
  const resumeUrl = settings.resume_url || "#"

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
      {/* Enhanced Background Animation */}
      <div className="absolute inset-0 -z-10">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />

        {/* Animated Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

        {/* Floating Particles */}
        {[...Array(100)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-primary to-primary/50 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 2,
            }}
          />
        ))}

        {/* Large Floating Elements */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`large-${i}`}
            className="absolute w-32 h-32 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full blur-xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 10 + Math.random() * 5,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          {/* Greeting */}
          <motion.div
            className="flex items-center justify-center gap-2 mb-6"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
            <span className="text-muted-foreground font-medium">Welcome to my digital space</span>
            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Hi, I'm{" "}
            <span className="gradient-text bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent animate-gradient-shift">
              {fullName}
            </span>
          </motion.h1>

          <motion.div
            className="text-2xl md:text-4xl lg:text-5xl text-muted-foreground mb-8 h-16 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <span className="font-light">I'm a </span>
            <span className="ml-2 font-semibold text-primary">
              {displayText}
              <motion.span
                className="animate-pulse text-primary"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
              >
                |
              </motion.span>
            </span>
          </motion.div>

          <motion.p
            className="text-lg md:text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {bio}
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Button
              size="lg"
              className="px-8 py-4 text-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => scrollToSection("#projects")}
            >
              <motion.span whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                View My Work
              </motion.span>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-4 text-lg border-primary/30 hover:border-primary hover:bg-primary/10 transition-all duration-300"
              onClick={() => scrollToSection("#contact")}
            >
              <motion.span whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                Get In Touch
              </motion.span>
            </Button>
          </motion.div>

          <motion.div
            className="flex justify-center space-x-6 mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            {[
              {
                icon: Phone,
                href: "https://wa.me/message/LXOEJFHQLQHKK1",
                label: "WhatsApp",
                color: "hover:text-gray-900 dark:hover:text-gray-100",
              },
                 {
                icon: Facebook,
                href: "https://www.facebook.com/Hamzatahir13/",
                label: "Facebook",
                color: "hover:text-gray-900 dark:hover:text-gray-100",
              },
              {
                icon: Linkedin,
                href: settings.linkedin_url || "https://www.linkedin.com/in/muhammad-hamza-tahir/",
                label: "LinkedIn",
                color: "hover:text-blue-600",
              },
              {
                icon: Mail,
                href: "#contact",
                label: "Email",
                color: "hover:text-primary",
              },
            ].map(({ icon: Icon, href, label, color }) => (
              <motion.a
                key={label}
                href={href}
                className={`p-4 rounded-full bg-muted/50 backdrop-blur-sm border border-border/50 ${color} transition-all duration-300 hover:scale-110 hover:shadow-lg`}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={
                  href.startsWith("#")
                    ? (e) => {
                        e.preventDefault()
                        scrollToSection(href)
                      }
                    : undefined
                }
              >
                <Icon className="w-6 h-6" />
                <span className="sr-only">{label}</span>
              </motion.a>
            ))}
          </motion.div>

          <motion.div
            className="animate-bounce"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <button
              onClick={() => scrollToSection("#about")}
              className="text-muted-foreground hover:text-primary transition-colors group"
            >
              <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}>
                <ArrowDown className="w-8 h-8 mx-auto group-hover:scale-110 transition-transform" />
              </motion.div>
              <span className="sr-only">Scroll to About section</span>
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero
