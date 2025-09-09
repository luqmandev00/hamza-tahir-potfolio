"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Progress } from "@/components/ui/progress"

interface PageLoaderProps {
  isLoading: boolean
  onComplete?: () => void
}

export default function PageLoader({ isLoading, onComplete }: PageLoaderProps) {
  const [progress, setProgress] = useState(0)
  const [loadingText, setLoadingText] = useState("Loading...")

  const loadingTexts = ["Loading...", "Preparing content...", "Almost ready...", "Finalizing..."]

  useEffect(() => {
    if (!isLoading) return

    let progressInterval: NodeJS.Timeout
    let textInterval: NodeJS.Timeout

    // Progress animation
    progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          setTimeout(() => {
            onComplete?.()
          }, 500)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 200)

    // Text animation
    let textIndex = 0
    textInterval = setInterval(() => {
      textIndex = (textIndex + 1) % loadingTexts.length
      setLoadingText(loadingTexts[textIndex])
    }, 800)

    return () => {
      clearInterval(progressInterval)
      clearInterval(textInterval)
    }
  }, [isLoading, onComplete])

  useEffect(() => {
    if (!isLoading) {
      setProgress(0)
      setLoadingText("Loading...")
    }
  }, [isLoading])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
        >
          <div className="flex flex-col items-center space-y-6 p-8">
            {/* Animated Logo */}
            <motion.div
              animate={{
                rotate: 360,
                scale: [1, 1.1, 1],
              }}
              transition={{
                rotate: { duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
                scale: { duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
              }}
              className="relative"
            >
              <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg" />
              <motion.div
                animate={{ scale: [0.8, 1.2, 0.8] }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                className="absolute inset-2 rounded-full bg-white/20 backdrop-blur-sm"
              />
            </motion.div>

            {/* Loading Text */}
            <motion.h2
              key={loadingText}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-xl font-semibold text-foreground"
            >
              {loadingText}
            </motion.h2>

            {/* Progress Bar */}
            <div className="w-64 space-y-2">
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>0%</span>
                <span>{Math.round(progress)}%</span>
                <span>100%</span>
              </div>
            </div>

            {/* Animated Dots */}
            <div className="flex space-x-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: i * 0.2,
                  }}
                  className="h-2 w-2 rounded-full bg-primary"
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
