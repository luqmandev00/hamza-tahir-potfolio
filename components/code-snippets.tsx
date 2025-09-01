"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Copy, Check, Code, ArrowRight, Terminal, Zap, Star } from "lucide-react"
import Link from "next/link"
import { supabase, type CodeSnippet } from "@/lib/supabase"

const CodeSnippets = () => {
  const [snippets, setSnippets] = useState<CodeSnippet[]>([])
  const [loading, setLoading] = useState(true)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    fetchSnippets()
  }, [])

  const fetchSnippets = async () => {
    try {
      const { data, error } = await supabase
        .from("code_snippets")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(6)

      if (error) throw error
      setSnippets(data || [])
    } catch (error) {
      console.error("Error fetching code snippets:", error)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async (code: string, id: string) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error("Failed to copy code:", err)
    }
  }

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
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  }

  if (loading) {
    return (
      <section id="snippets" className="py-24 bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="container mx-auto px-4 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </section>
    )
  }

  return (
    <section
      id="snippets"
      className="py-24 bg-gradient-to-br from-background via-muted/20 to-background relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          {/* Enhanced Header */}
          <motion.div variants={itemVariants} className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent-foreground px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Terminal className="w-4 h-4" />
              Code Library
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Code Snippets
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Ready-to-use code snippets and utilities for various programming languages and frameworks. Copy, paste,
              and accelerate your development workflow.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {snippets.map((snippet, index) => (
              <motion.div
                key={snippet.id}
                variants={itemVariants}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group"
              >
                <Card className="h-full transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 border-2 hover:border-primary/20 bg-card/80 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-3 flex items-center gap-2 group-hover:text-primary transition-colors">
                          <Code className="w-5 h-5 text-primary" />
                          {snippet.title}
                          {snippet.featured && (
                            <Badge className="bg-gradient-to-r from-primary to-primary/80 flex items-center gap-1 px-2 py-1">
                              <Star className="w-3 h-3" />
                            </Badge>
                          )}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{snippet.description}</p>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="default" className="text-xs px-3 py-1">
                            {snippet.language}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={`text-xs px-3 py-1 ${
                              snippet.difficulty === "beginner"
                                ? "border-green-500 text-green-600"
                                : snippet.difficulty === "intermediate"
                                  ? "border-yellow-500 text-yellow-600"
                                  : "border-red-500 text-red-600"
                            }`}
                          >
                            {snippet.difficulty}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(snippet.code, snippet.id)}
                        className="flex-shrink-0 hover:bg-primary/10"
                      >
                        {copiedId === snippet.id ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="relative">
                      <pre className="bg-muted/50 p-4 rounded-lg overflow-x-auto text-sm max-h-48 border border-border/50">
                        <code className="text-foreground font-mono">{snippet.code}</code>
                      </pre>
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          className="text-xs bg-primary/20 backdrop-blur-sm border border-primary/30 hover:bg-primary/30"
                          onClick={() => copyToClipboard(snippet.code, snippet.id)}
                        >
                          {copiedId === snippet.id ? (
                            <>
                              <Check className="w-3 h-3 mr-1" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 mr-1" />
                              Copy
                            </>
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-4">
                      {snippet.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {snippet.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{snippet.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {snippets.length === 0 && (
            <motion.div variants={itemVariants} className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
                <Code className="w-12 h-12 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-lg">No code snippets available at the moment.</p>
            </motion.div>
          )}

          {/* Enhanced CTA Section */}
          <motion.div variants={itemVariants} className="text-center">
            <div className="bg-gradient-to-r from-accent/10 via-accent/5 to-accent/10 rounded-2xl p-8 border border-accent/20">
              <h3 className="text-2xl font-bold mb-4">Explore Code Library</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Access my complete collection of code snippets, utilities, and reusable components across multiple
                programming languages and frameworks.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild className="group">
                  <Link href="/snippets">
                    Browse All Snippets
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="group">
                  <Zap className="w-5 h-5 mr-2" />
                  Quick Start Guide
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default CodeSnippets
