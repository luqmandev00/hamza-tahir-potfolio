"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2, Eye, Filter, MoreHorizontal, Copy, Code } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { supabase, type CodeSnippet } from "@/lib/supabase"
import AdminLayout from "@/components/admin/admin-layout"

const AdminSnippets = () => {
  const [snippets, setSnippets] = useState<CodeSnippet[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterLanguage, setFilterLanguage] = useState("All")
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    fetchSnippets()
  }, [])

  const fetchSnippets = async () => {
    try {
      const { data, error } = await supabase.from("code_snippets").select("*").order("created_at", { ascending: false })

      if (error) throw error
      setSnippets(data || [])
    } catch (error) {
      console.error("Error fetching snippets:", error)
    } finally {
      setLoading(false)
    }
  }

  const deleteSnippet = async (id: string) => {
    if (!confirm("Are you sure you want to delete this code snippet?")) return

    try {
      const { error } = await supabase.from("code_snippets").delete().eq("id", id)

      if (error) throw error
      setSnippets(snippets.filter((s) => s.id !== id))
    } catch (error) {
      console.error("Error deleting snippet:", error)
    }
  }

  const togglePublished = async (id: string, published: boolean) => {
    try {
      const { error } = await supabase.from("code_snippets").update({ published: !published }).eq("id", id)

      if (error) throw error
      setSnippets(snippets.map((s) => (s.id === id ? { ...s, published: !published } : s)))
    } catch (error) {
      console.error("Error updating snippet:", error)
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

  const filteredSnippets = snippets.filter((snippet) => {
    const matchesSearch =
      snippet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      snippet.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLanguage = filterLanguage === "All" || snippet.language === filterLanguage
    return matchesSearch && matchesLanguage
  })

  const languages = ["All", ...Array.from(new Set(snippets.map((s) => s.language)))]

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Code Snippets</h1>
            <p className="text-muted-foreground">Manage your code snippet library</p>
          </div>
          <Button asChild>
            <a href="/admin/snippets/new">
              <Plus className="w-4 h-4 mr-2" />
              New Snippet
            </a>
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search snippets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                {languages.map((language) => (
                  <Button
                    key={language}
                    variant={filterLanguage === language ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterLanguage(language)}
                  >
                    <Filter className="w-3 h-3 mr-1" />
                    {language}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Snippets Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredSnippets.map((snippet, index) => (
            <motion.div
              key={snippet.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2 flex items-center gap-2">
                        <Code className="w-5 h-5 text-primary" />
                        {snippet.title}
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
                        {snippet.featured && <Badge className="bg-primary text-xs">Featured</Badge>}
                        <Badge variant={snippet.published ? "default" : "secondary"} className="text-xs">
                          {snippet.published ? "Published" : "Draft"}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {snippet.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <a href={`/admin/snippets/${snippet.id}/edit`}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </a>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => togglePublished(snippet.id, snippet.published)}>
                          <Eye className="w-4 h-4 mr-2" />
                          {snippet.published ? "Unpublish" : "Publish"}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => copyToClipboard(snippet.code, snippet.id)}>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Code
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => deleteSnippet(snippet.id)} className="text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm max-h-48 border">
                      <code className="text-foreground">{snippet.code}</code>
                    </pre>

                    <div className="absolute top-2 right-2 flex gap-1">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => copyToClipboard(snippet.code, snippet.id)}
                        className="text-xs"
                      >
                        {copiedId === snippet.id ? "Copied!" : "Copy"}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
                    <span>Usage: {snippet.usage_frequency}</span>
                    <span>{new Date(snippet.created_at).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredSnippets.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <h3 className="text-lg font-semibold mb-2">No code snippets found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || filterLanguage !== "All"
                  ? "Try adjusting your search or filter criteria."
                  : "Get started by creating your first code snippet."}
              </p>
              <Button asChild>
                <a href="/admin/snippets/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Snippet
                </a>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  )
}

export default AdminSnippets
