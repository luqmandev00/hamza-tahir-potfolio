"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Hero from "@/components/hero"
import About from "@/components/about"
import Services from "@/components/services"
import Projects from "@/components/projects"
import Blog from "@/components/blog"
import Contact from "@/components/contact"
import PageLoader from "@/components/page-loader"
import LazySection from "@/components/lazy-section"
import { Suspense } from "react"

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    // Preload critical resources
    const preloadResources = async () => {
      const criticalImages = [
        "/placeholder.svg?height=600&width=800&text=Hero+Image",
        "/placeholder.svg?height=400&width=400&text=Profile+Photo",
      ]

      const imagePromises = criticalImages.map((src) => {
        return new Promise((resolve, reject) => {
          const img = new Image()
          img.onload = resolve
          img.onerror = reject
          img.src = src
        })
      })

      try {
        await Promise.allSettled(imagePromises)
      } catch (error) {
        console.log("Some images failed to preload, continuing anyway")
      }
    }

    preloadResources()
  }, [])

  const handleLoadingComplete = () => {
    setIsLoading(false)
    setTimeout(() => setShowContent(true), 100)
  }

  return (
    <div className="min-h-screen">
      <AnimatePresence>{isLoading && <PageLoader onComplete={handleLoadingComplete} />}</AnimatePresence>

      <AnimatePresence>
        {showContent && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <Suspense fallback={<PageLoader isLoading={true} />}>
              <LazySection animation="none">
                <Hero />
              </LazySection>

              <LazySection animation="fade" delay={0.1}>
                <About />
              </LazySection>

              <LazySection animation="slide-up" delay={0.2}>
                <Services />
              </LazySection>

              <LazySection animation="fade" delay={0.3}>
                <Projects />
              </LazySection>

              <LazySection animation="slide-up" delay={0.4}>
                <Blog />
              </LazySection>

              <LazySection animation="slide-up" delay={0.5}>
                <Contact />
              </LazySection>
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
