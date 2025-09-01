"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar, Clock, Search, ArrowRight, BookOpen, TrendingUp, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { supabase, type BlogPost } from "@/lib/supabase"

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")
  const [categories, setCategories] = useState<string[]>(["All"])

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("published", true)
        .order("published_at", { ascending: false })
        .limit(6)

      if (error) throw error

      const postData = data || []
      setPosts(postData)

      // Extract unique categories
      const uniqueCategories = ["All", ...new Set(postData.map((p) => p.category))]
      setCategories(uniqueCategories)
    } catch (error) {
      console.error("Error fetching blog posts:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = activeCategory === "All" || post.category === activeCategory
    return matchesSearch && matchesCategory
  })

  const featuredPost = filteredPosts.find((post) => post.featured)
  const regularPosts = filteredPosts.filter((post) => !post.featured)

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
      <section id="blog" className="py-24 bg-gradient-to-br from-muted/30 via-background to-muted/30">
        <div className="container mx-auto px-4 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </section>
    )
  }

  return (
    <section
      id="blog"
      className="py-24 bg-gradient-to-br from-muted/30 via-background to-muted/30 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          {/* Enhanced Header */}
          <motion.div variants={itemVariants} className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary-foreground px-4 py-2 rounded-full text-sm font-medium mb-6">
              <BookOpen className="w-4 h-4" />
              Latest Articles
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Blog & Insights
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Dive into my thoughts on web development, design trends, and technology insights. Learn from real-world
              experiences and practical tutorials.
            </p>
          </motion.div>

          {/* Enhanced Search and Filter */}
          <motion.div variants={itemVariants} className="mb-16">
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between max-w-4xl mx-auto">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  placeholder="Search articles, tutorials, insights..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 bg-background/80 backdrop-blur-sm border-2 focus:border-primary/50"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={activeCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveCategory(category)}
                    className={`transition-all duration-300 px-4 py-2 rounded-full ${
                      activeCategory === category
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                        : "hover:bg-primary/10 hover:border-primary/50"
                    }`}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Featured Post */}
          {featuredPost && activeCategory === "All" && (
            <motion.div variants={itemVariants} className="mb-16">
              <Link href={`/blog/${featuredPost.slug}`}>
                <Card className="overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 border-2 hover:border-primary/20 bg-card/80 backdrop-blur-sm cursor-pointer group">
                  <div className="lg:flex">
                    <div className="lg:w-1/2 relative overflow-hidden">
                      <Image
                        src={featuredPost.image_url || "/placeholder.svg?height=400&width=600"}
                        alt={featuredPost.title}
                        width={600}
                        height={400}
                        className="w-full h-64 lg:h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground flex items-center gap-1 px-3 py-1">
                          <TrendingUp className="w-3 h-3" />
                          Featured Article
                        </Badge>
                      </div>
                    </div>
                    <div className="lg:w-1/2 p-8 lg:p-12">
                      <Badge variant="outline" className="mb-4">
                        {featuredPost.category}
                      </Badge>
                      <h3 className="text-3xl font-bold mb-4 group-hover:text-primary transition-colors">
                        {featuredPost.title}
                      </h3>
                      <p className="text-muted-foreground mb-6 text-lg leading-relaxed">{featuredPost.excerpt}</p>

                      <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Hamza Tahir
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {featuredPost.published_at
                            ? new Date(featuredPost.published_at).toLocaleDateString()
                            : "Not published"}
                        </div>
                        {featuredPost.read_time && (
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {featuredPost.read_time} min read
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2 mb-6">
                        {featuredPost.tags.slice(0, 4).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <Button className="group">
                        Read Full Article
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          )}

          {/* Blog Posts Grid */}
          <motion.div variants={containerVariants} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {regularPosts.map((post, index) => (
              <motion.div key={post.id} variants={itemVariants} whileHover={{ y: -10, scale: 1.02 }} className="group">
                <Link href={`/blog/${post.slug}`}>
                  <Card className="overflow-hidden h-full transition-all duration-500 hover:shadow-xl hover:shadow-primary/10 border-2 hover:border-primary/20 bg-card/80 backdrop-blur-sm cursor-pointer">
                    <div className="relative overflow-hidden">
                      <Image
                        src={post.image_url || "/placeholder.svg?height=200&width=300"}
                        alt={post.title}
                        width={300}
                        height={200}
                        className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <Badge className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm" variant="secondary">
                        {post.category}
                      </Badge>
                    </div>

                    <CardContent className="p-6">
                      <h3 className="text-lg font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-3 leading-relaxed">{post.excerpt}</p>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {post.published_at ? new Date(post.published_at).toLocaleDateString() : "Not published"}
                        </div>
                        {post.read_time && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {post.read_time} min read
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {post.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {post.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{post.tags.length - 3}
                          </Badge>
                        )}
                      </div>

                      <Button variant="ghost" className="p-0 h-auto font-medium group-hover:text-primary">
                        Read More
                        <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {filteredPosts.length === 0 && (
            <motion.div variants={itemVariants} className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
                <BookOpen className="w-12 h-12 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-lg">No articles found matching your criteria.</p>
            </motion.div>
          )}

          {/* Enhanced CTA Section */}
          <motion.div variants={itemVariants} className="text-center">
            <div className="bg-gradient-to-r from-secondary/10 via-secondary/5 to-secondary/10 rounded-2xl p-8 border border-secondary/20">
              <h3 className="text-2xl font-bold mb-4">Explore More Articles</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Discover in-depth tutorials, industry insights, and practical guides covering web development, design
                patterns, and emerging technologies.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild className="group">
                  <Link href="/blog">
                    View All Articles
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="group">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Subscribe to Newsletter
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default Blog
