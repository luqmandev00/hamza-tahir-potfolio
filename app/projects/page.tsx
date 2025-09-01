"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ExternalLink, Github, Eye, Search, Filter, Calendar, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import PageProgress from "@/components/page-progress"
import { fetchProjects, type Project } from "@/lib/supabase"

const ProjectsArchive = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("date")

  const filters = ["All", "Client Work", "Open Source", "Personal", "E-commerce", "Web Apps"]

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchProjects()
      setProjects(data)
    } catch (err) {
      console.error("Error loading projects:", err)
      setError("Failed to load projects. Please try again later.")
      // Fallback to empty array to prevent crashes
      setProjects([])
    } finally {
      setLoading(false)
    }
  }

  const filteredProjects = projects.filter((project) => {
    const matchesFilter =
      activeFilter === "All" || project.category === activeFilter || project.subcategory === activeFilter
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.technologies &&
        project.technologies.some((tech) => tech.toLowerCase().includes(searchTerm.toLowerCase())))
    return matchesFilter && matchesSearch
  })

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortBy === "date") {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    }
    if (sortBy === "title") {
      return a.title.localeCompare(b.title)
    }
    if (sortBy === "featured") {
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
    }
    return 0
  })

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
            <div className="loading-dots">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <PageProgress />
        <Header />
        <main className="pt-24 pb-20">
          <div className="container mx-auto px-4 flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
              <p className="text-muted-foreground mb-6">{error}</p>
              <Button onClick={loadProjects} className="btn-gradient">
                Try Again
              </Button>
            </div>
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
              <h1 className="text-4xl md:text-6xl font-bold mb-4 gradient-text">Project Archive</h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                A comprehensive showcase of my development work, from client projects to open-source contributions
              </p>
              <div className="mt-6 flex items-center justify-center gap-4 text-sm text-muted-foreground">
                <span>{filteredProjects.length} projects found</span>
                <span>•</span>
                <span>{projects.filter((p) => p.featured).length} featured</span>
                <span>•</span>
                <span>{projects.filter((p) => p.status === "completed").length} completed</span>
              </div>
            </motion.div>

            {/* Search and Filter Controls */}
            <motion.div variants={itemVariants} className="mb-12">
              <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search projects, technologies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-muted/50 border-border/50 focus:bg-background focus:border-primary"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {filters.map((filter) => (
                    <Button
                      key={filter}
                      variant={activeFilter === filter ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveFilter(filter)}
                      className={`transition-all duration-300 ${
                        activeFilter === filter ? "btn-gradient text-white" : ""
                      }`}
                    >
                      <Filter className="w-3 h-3 mr-1" />
                      {filter}
                    </Button>
                  ))}
                </div>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 bg-muted/50 border border-border/50 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="date">Sort by Date</option>
                  <option value="title">Sort by Title</option>
                  <option value="featured">Sort by Featured</option>
                </select>
              </div>
            </motion.div>

            {/* Projects Grid */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeFilter}-${searchTerm}-${sortBy}`}
                className="grid lg:grid-cols-2 gap-8 mb-12"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                {sortedProjects.map((project) => (
                  <motion.div key={project.id} variants={itemVariants} layout whileHover={{ y: -5 }} className="group">
                    <Card className="overflow-hidden h-full card-hover border-border/50 hover:border-primary/20">
                      <div className="relative overflow-hidden">
                        <Image
                          src={project.image_url || "/placeholder.svg?height=400&width=600"}
                          alt={project.title}
                          width={600}
                          height={400}
                          className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                        />

                        {/* Overlay Badges */}
                        <div className="absolute top-4 left-4 flex gap-2">
                          {project.featured && (
                            <Badge className="btn-gradient text-white flex items-center gap-1">
                              <Star className="w-3 h-3" />
                              Featured
                            </Badge>
                          )}
                          <Badge variant="secondary" className="bg-background/80 text-foreground">
                            {project.category}
                          </Badge>
                        </div>

                        <Badge
                          className={`absolute top-4 right-4 ${
                            project.status === "completed"
                              ? "bg-green-500 text-white"
                              : project.status === "in-progress"
                                ? "bg-blue-500 text-white"
                                : "bg-orange-500 text-white"
                          }`}
                        >
                          {project.status}
                        </Badge>

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                          <Button size="sm" variant="secondary" asChild>
                            <Link href={`/projects/${project.slug}`}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </Link>
                          </Button>
                          {project.live_url && (
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => window.open(project.live_url, "_blank")}
                            >
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Live Demo
                            </Button>
                          )}
                          {project.github_url && (
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => window.open(project.github_url, "_blank")}
                            >
                              <Github className="w-4 h-4 mr-2" />
                              Source
                            </Button>
                          )}
                        </div>
                      </div>

                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            {new Date(project.created_at).toLocaleDateString()}
                          </div>
                          {project.duration && (
                            <span className="text-xs text-muted-foreground">{project.duration}</span>
                          )}
                        </div>

                        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{project.description}</p>

                        {/* Client Info */}
                        {project.client && (
                          <div className="mb-4">
                            <span className="text-xs font-medium text-muted-foreground">Client: </span>
                            <span className="text-xs text-foreground">{project.client}</span>
                          </div>
                        )}

                        {/* Tech Stack */}
                        {project.technologies && project.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {project.technologies.map((tech) => (
                              <Badge key={tech} variant="outline" className="text-xs border-border/50">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        )}

                        {/* Highlights */}
                        {project.highlights && project.highlights.length > 0 && (
                          <div className="mb-6">
                            <h4 className="text-sm font-medium mb-2">Key Highlights:</h4>
                            <ul className="text-xs text-muted-foreground space-y-1">
                              {project.highlights.slice(0, 3).map((highlight, index) => (
                                <li key={index} className="flex items-center gap-2">
                                  <div className="w-1 h-1 bg-primary rounded-full flex-shrink-0" />
                                  {highlight}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1" asChild>
                            <Link href={`/projects/${project.slug}`}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </Link>
                          </Button>
                          {project.github_url && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(project.github_url, "_blank")}
                            >
                              <Github className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* No Results */}
            {sortedProjects.length === 0 && !loading && (
              <motion.div variants={itemVariants} className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2">No projects found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search terms or browse different categories.
                </p>
                <Button
                  onClick={() => {
                    setSearchTerm("")
                    setActiveFilter("All")
                  }}
                  className="btn-gradient"
                >
                  Clear Filters
                </Button>
              </motion.div>
            )}

            {/* Stats Section */}
            {projects.length > 0 && (
              <motion.div variants={itemVariants} className="mt-16 grid md:grid-cols-4 gap-6">
                <Card className="p-6 text-center card-hover">
                  <div className="text-2xl font-bold gradient-text mb-2">{projects.length}</div>
                  <div className="text-sm text-muted-foreground">Total Projects</div>
                </Card>
                <Card className="p-6 text-center card-hover">
                  <div className="text-2xl font-bold gradient-text mb-2">
                    {projects.filter((p) => p.category === "Client Work").length}
                  </div>
                  <div className="text-sm text-muted-foreground">Client Projects</div>
                </Card>
                <Card className="p-6 text-center card-hover">
                  <div className="text-2xl font-bold gradient-text mb-2">
                    {projects.filter((p) => p.category === "Open Source").length}
                  </div>
                  <div className="text-sm text-muted-foreground">Open Source</div>
                </Card>
                <Card className="p-6 text-center card-hover">
                  <div className="text-2xl font-bold gradient-text mb-2">
                    {[...new Set(projects.flatMap((p) => p.technologies || []))].length}
                  </div>
                  <div className="text-sm text-muted-foreground">Technologies Used</div>
                </Card>
              </motion.div>
            )}
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default ProjectsArchive
