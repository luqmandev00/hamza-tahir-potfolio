"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Calendar, Tag, ArrowLeft, Clock, Share2, Check } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import PageProgress from "@/components/page-progress"
import QuoteForm from "@/components/quote-form"
import { toast } from "sonner"
import type { BlogPost } from "@/lib/supabase"

interface BlogPostDetailProps {
  post: BlogPost
}

export default function BlogPostDetail({ post }: BlogPostDetailProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // Optimize loading with requestAnimationFrame
    const timer = requestAnimationFrame(() => {
      setTimeout(() => setIsLoading(false), 300)
    })
    return () => cancelAnimationFrame(timer)
  }, [])

  const handleShare = async () => {
    try {
      // Try native sharing first (mobile devices)
      if (navigator.share && navigator.canShare) {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        })
        return
      }

      // Fallback to clipboard
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      toast.success("Link copied to clipboard!")

      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Error sharing:", error)

      // Final fallback - try to copy manually
      try {
        const textArea = document.createElement("textarea")
        textArea.value = window.location.href
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand("copy")
        document.body.removeChild(textArea)

        setCopied(true)
        toast.success("Link copied to clipboard!")
        setTimeout(() => setCopied(false), 2000)
      } catch (fallbackError) {
        toast.error("Unable to share this post. Please copy the URL manually.")
      }
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <PageProgress />
        <Header />
        <div className="container mx-auto px-4 py-20 flex items-center justify-center">
          <div className="loading-spinner"></div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <PageProgress />
      <Header />

      <main className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {/* Back Button */}
          <div className="mb-8">
            <Button variant="ghost" asChild className="gradient-hover">
              <Link href="/blog" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Blog
              </Link>
            </Button>
          </div>

          {/* Blog Post Header */}
          <div className="mb-12">
            <motion.h1
              className="text-4xl md:text-5xl font-bold mb-4 gradient-text"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
            >
              {post.title}
            </motion.h1>

            <motion.p
              className="text-xl text-muted-foreground mb-6 max-w-3xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
            >
              {post.excerpt}
            </motion.p>

            <motion.div
              className="flex flex-wrap items-center gap-4 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                {new Date(post.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Tag className="w-4 h-4" />
                {post.category}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />5 min read
              </div>
              {post.featured && <Badge className="gradient-bg text-white">Featured Post</Badge>}
            </motion.div>

            <motion.div
              className="flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.4 }}
            >
              <Button onClick={handleShare} variant="outline" className="gradient-border bg-transparent">
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </>
                )}
              </Button>
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-4 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-8">
              {/* Blog Post Image */}
              {post.image_url && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  <Card className="overflow-hidden card-hover">
                    <Image
                      src={post.image_url || "/placeholder.svg"}
                      alt={post.title}
                      width={800}
                      height={500}
                      className="w-full h-auto object-cover"
                      priority
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 800px"
                    />
                  </Card>
                </motion.div>
              )}

              {/* Blog Post Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.4 }}
              >
                <Card className="card-hover">
                  <CardContent className="p-8">
                    <div className="rich-text-content" dangerouslySetInnerHTML={{ __html: post.content || "" }} />
                  </CardContent>
                </Card>
              </motion.div>

            
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                >
                  <Card className="card-hover">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-4 gradient-text">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="gradient-hover">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Post Details */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45, duration: 0.4 }}
              >
                <Card className="card-hover">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4 gradient-text">Post Details</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Category:</span>
                        <p className="text-sm">{post.category}</p>
                      </div>
                      <Separator />
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Published:</span>
                        <p className="text-sm">{new Date(post.created_at).toLocaleDateString()}</p>
                      </div>
                      <Separator />
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Reading Time:</span>
                        <p className="text-sm">5 minutes</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Share */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                <Card className="card-hover">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4 gradient-text">Share This Post</h3>
                    <Button onClick={handleShare} className="w-full btn-gradient">
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Share2 className="w-4 h-4 mr-2" />
                          Share Post
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
           {/* Quote Form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
              >
                <QuoteForm preSelectedService="content-writing" />
              </motion.div>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}
