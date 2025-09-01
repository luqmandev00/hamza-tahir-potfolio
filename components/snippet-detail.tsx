"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Calendar, Copy, Check, ArrowLeft, Code2 } from "lucide-react"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import type { CodeSnippet } from "@/lib/supabase"

interface SnippetDetailProps {
  snippet: CodeSnippet
}

export default function SnippetDetail({ snippet }: SnippetDetailProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({})

  useEffect(() => {
    // Simulate loading for smooth animation
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedStates((prev) => ({ ...prev, [id]: true }))
      setTimeout(() => {
        setCopiedStates((prev) => ({ ...prev, [id]: false }))
      }, 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          {/* Back Button */}
          <div className="mb-8">
            <Button variant="ghost" asChild>
              <Link href="/snippets" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Snippets
              </Link>
            </Button>
          </div>

          {/* Snippet Header */}
          <div className="mb-12">
            <motion.h1
              className="text-4xl md:text-5xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {snippet.title}
            </motion.h1>

            <motion.p
              className="text-xl text-muted-foreground mb-6 max-w-3xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {snippet.description}
            </motion.p>

            <motion.div
              className="flex flex-wrap items-center gap-4 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                {new Date(snippet.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Code2 className="w-4 h-4" />
                {snippet.language}
              </div>
              {snippet.featured && <Badge className="bg-primary">Featured Snippet</Badge>}
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-4 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-8">
              {/* Code Block */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Card className="overflow-hidden">
                  <div className="flex items-center justify-between p-4 bg-muted border-b">
                    <div className="flex items-center gap-2">
                      <Code2 className="w-4 h-4" />
                      <span className="text-sm font-medium">{snippet.language}</span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(snippet.code || "", "main-code")}
                      className="h-8"
                    >
                      {copiedStates["main-code"] ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                  <CardContent className="p-0">
                    <pre className="p-6 overflow-x-auto text-sm">
                      <code className={`language-${snippet.language?.toLowerCase()}`}>{snippet.code}</code>
                    </pre>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Usage/Explanation */}
              {snippet.content && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                  <Card>
                    <CardContent className="p-8">
                      <h2 className="text-2xl font-bold mb-4">Usage & Explanation</h2>
                      <div
                        className="prose prose-gray dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: snippet.content }}
                      />
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Snippet Details */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}>
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Snippet Details</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Language:</span>
                        <p className="text-sm">{snippet.language}</p>
                      </div>
                      <Separator />
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Category:</span>
                        <p className="text-sm">{snippet.category}</p>
                      </div>
                      <Separator />
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Created:</span>
                        <p className="text-sm">{new Date(snippet.created_at).toLocaleDateString()}</p>
                      </div>
                      {snippet.updated_at && snippet.updated_at !== snippet.created_at && (
                        <>
                          <Separator />
                          <div>
                            <span className="text-sm font-medium text-muted-foreground">Updated:</span>
                            <p className="text-sm">{new Date(snippet.updated_at).toLocaleDateString()}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Tags */}
              {snippet.tags && snippet.tags.length > 0 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }}>
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-4">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {snippet.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Quick Actions */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9 }}>
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => copyToClipboard(snippet.code || "", "sidebar-copy")}
                      >
                        {copiedStates["sidebar-copy"] ? (
                          <Check className="w-4 h-4 mr-2" />
                        ) : (
                          <Copy className="w-4 h-4 mr-2" />
                        )}
                        Copy Code
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}
