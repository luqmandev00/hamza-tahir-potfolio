"use client"

import { useState, useEffect } from "react"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy, Check, Code, Filter, Search, Star, Download, Eye } from "lucide-react"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import PageProgress from "@/components/page-progress"
import { supabase, type CodeSnippet } from "@/lib/supabase"

const SnippetsArchive = () => {
  const [snippets, setSnippets] = useState<CodeSnippet[]>([])
  const [loading, setLoading] = useState(true)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [activeLanguage, setActiveLanguage] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")
  const [languages, setLanguages] = useState<string[]>(["All"])
  const [categories, setCategories] = useState<string[]>(["All"])

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

      if (error) throw error

      const snippetData = data || []
      setSnippets(snippetData)

      const uniqueLanguages = ["All", ...new Set(snippetData.map((s) => s.language))]
      const uniqueCategories = ["All", ...new Set(snippetData.map((s) => s.category))]
      setLanguages(uniqueLanguages)
      setCategories(uniqueCategories)
    } catch (error) {
      console.error("Error fetching code snippets:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredSnippets = snippets.filter((snippet) => {
    const matchesSearch =
      snippet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      snippet.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      snippet.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesLanguage = activeLanguage === "All" || snippet.language === activeLanguage
    const matchesCategory = activeCategory === "All" || snippet.category === activeCategory
    return matchesSearch && matchesLanguage && matchesCategory
  })

  const copyToClipboard = async (code: string, id: string) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error("Failed to copy code:", err)
    }
  }

  const downloadSnippet = (snippet: CodeSnippet) => {
    const fileExtension =
      snippet.language.toLowerCase() === "javascript"
        ? "js"
        : snippet.language.toLowerCase() === "typescript"
          ? "ts"
          : snippet.language.toLowerCase() === "python"
            ? "py"
            : snippet.language.toLowerCase() === "bash"
              ? "sh"
              : snippet.language.toLowerCase()

    const fileName = `${snippet.title.toLowerCase().replace(/\s+/g, "-")}.${fileExtension}`
    const blob = new Blob([snippet.code], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <PageProgress />
        <Header />
        <main className="pt-24 pb-20">
          <div className="container mx-auto px-4 flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <PageProgress />
      <Header />

      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" animate="visible" variants={containerVariants}>
            {/* Header */}
            <motion.div variants={itemVariants} className="text-center mb-16">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 gradient-text">Code Snippets Archive</h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                A curated collection of useful code snippets, utilities, and solutions I've developed over the years
              </p>
              <div className="mt-6 flex items-center justify-center gap-4 text-sm text-muted-foreground">
                <span>{filteredSnippets.length} snippets found</span>
                <span>•</span>
                <span>{snippets.filter((s) => s.featured).length} featured</span>
                <span>•</span>
                <span>{languages.length - 1} languages</span>
              </div>
            </motion.div>

            {/* Search and Filter Controls */}
            <motion.div variants={itemVariants} className="mb-12">
              <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search snippets, tags, or descriptions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-muted/50 border-border/50 focus:bg-background"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <div className="flex flex-wrap gap-2">
                    {languages.map((language) => (
                      <Button
                        key={language}
                        variant={activeLanguage === language ? "default" : "outline"}
                        size="sm"
                        onClick={() => setActiveLanguage(language)}
                        className="transition-all duration-300"
                      >
                        <Code className="w-3 h-3 mr-1" />
                        {language}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={activeCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveCategory(category)}
                      className="transition-all duration-300"
                    >
                      <Filter className="w-3 h-3 mr-1" />
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Snippets Grid */}
            <motion.div variants={containerVariants} className="grid lg:grid-cols-2 gap-8 mb-12">
              {filteredSnippets.map((snippet) => (
                <motion.div key={snippet.id} variants={itemVariants} whileHover={{ y: -5 }} className="group">
                  <Card className="h-full transition-all duration-300 hover:shadow-xl border-border/50 hover:border-primary/20">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2 flex items-center gap-2">
                            <Code className="w-5 h-5 text-primary" />
                            {snippet.title}
                            {snippet.featured && (
                              <Badge className="bg-gradient-to-r from-primary to-primary/80 flex items-center gap-1">
                                <Star className="w-3 h-3" />
                                Featured
                              </Badge>
                            )}
                          </CardTitle>

                          <p className="text-sm text-muted-foreground mb-3">{snippet.description}</p>

                          <div className="flex flex-wrap gap-2 mb-3">
                            <Badge variant="default" className="text-xs">
                              {snippet.language}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {snippet.category}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                snippet.difficulty === "beginner"
                                  ? "border-green-500 text-green-500"
                                  : snippet.difficulty === "intermediate"
                                    ? "border-yellow-500 text-yellow-500"
                                    : "border-red-500 text-red-500"
                              }`}
                            >
                              {snippet.difficulty}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              Usage: {snippet.usage_frequency}
                            </Badge>
                          </div>

                          <div className="flex flex-wrap gap-1 mb-3">
                            {snippet.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs border-border/50">
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          <div className="text-xs text-muted-foreground">
                            Last updated: {new Date(snippet.created_at).toLocaleDateString()}
                          </div>
                        </div>

                        <div className="flex gap-2 ml-4">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(snippet.code, snippet.id)}
                            className="flex-shrink-0"
                          >
                            {copiedId === snippet.id ? (
                              <Check className="w-4 h-4 text-green-500" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>

                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => downloadSnippet(snippet)}
                            className="flex-shrink-0"
                          >
                            <Download className="w-4 h-4" />
                          </Button>

                          <Button size="sm" variant="ghost" asChild className="flex-shrink-0">
                            <Link href={`/snippets/${snippet.slug}`}>
                              <Eye className="w-4 h-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <div className="relative">
                        <pre className="bg-muted/50 p-4 rounded-lg overflow-x-auto text-sm max-h-96 border border-border/50">
                          <code className="text-foreground">{snippet.code}</code>
                        </pre>

                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => copyToClipboard(snippet.code, snippet.id)}
                              className="text-xs"
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

                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => downloadSnippet(snippet)}
                              className="text-xs"
                            >
                              <Download className="w-3 h-3 mr-1" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/snippets/${snippet.slug}`}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Link>
                        </Button>
                        <span className="text-xs text-muted-foreground">
                          {new Date(snippet.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {/* No Results */}
            {filteredSnippets.length === 0 && (
              <motion.div variants={itemVariants} className="text-center py-12">
                <div className="text-6xl mb-4">💻</div>
                <h3 className="text-xl font-semibold mb-2">No snippets found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search terms or browse different languages and categories.
                </p>
                <Button
                  onClick={() => {
                    setSearchTerm("")
                    setActiveLanguage("All")
                    setActiveCategory("All")
                  }}
                >
                  Clear Filters
                </Button>
              </motion.div>
            )}

            {/* Stats Section */}
            <motion.div variants={itemVariants} className="mt-16 grid md:grid-cols-4 gap-6">
              <Card className="p-6 text-center">
                <div className="text-2xl font-bold text-primary mb-2">{snippets.length}</div>
                <div className="text-sm text-muted-foreground">Total Snippets</div>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-2xl font-bold text-primary mb-2">{snippets.filter((s) => s.featured).length}</div>
                <div className="text-sm text-muted-foreground">Featured</div>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-2xl font-bold text-primary mb-2">{languages.length - 1}</div>
                <div className="text-sm text-muted-foreground">Languages</div>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-2xl font-bold text-primary mb-2">{categories.length - 1}</div>
                <div className="text-sm text-muted-foreground">Categories</div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default SnippetsArchive
