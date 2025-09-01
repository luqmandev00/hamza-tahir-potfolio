"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github, Eye, ArrowRight, Briefcase, Star, Calendar } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { supabase, type Project } from "@/lib/supabase"

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState("All")
  const [categories, setCategories] = useState<string[]>(["All"])

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("published", true)
        .eq("featured", true)
        .order("created_at", { ascending: false })
        .limit(6)

      if (error) throw error

      const projectData = data || []
      setProjects(projectData)

      // Extract unique categories
      const uniqueCategories = ["All", ...new Set(projectData.map((p) => p.category))]
      setCategories(uniqueCategories)
    } catch (error) {
      console.error("Error fetching projects:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProjects =
    activeFilter === "All" ? projects : projects.filter((project) => project.category === activeFilter)

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
      <section id="projects" className="py-24 bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="container mx-auto px-4 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </section>
    )
  }

  return (
    <section
      id="projects"
      className="py-24 bg-gradient-to-br from-background via-muted/20 to-background relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          {/* Enhanced Header */}
          <motion.div variants={itemVariants} className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Briefcase className="w-4 h-4" />
              Featured Work
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Featured Projects
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Discover my latest work showcasing innovative solutions, cutting-edge technologies, and exceptional user
              experiences across various industries.
            </p>
          </motion.div>

          {/* Enhanced Filter Buttons */}
          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-3 mb-16">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeFilter === category ? "default" : "outline"}
                onClick={() => setActiveFilter(category)}
                className={`transition-all duration-300 px-6 py-2 rounded-full ${
                  activeFilter === category
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                    : "hover:bg-primary/10 hover:border-primary/50"
                }`}
              >
                {category}
              </Button>
            ))}
          </motion.div>

          {/* Enhanced Projects Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  variants={itemVariants}
                  layout
                  whileHover={{ y: -15, scale: 1.02 }}
                  className="group"
                >
                  <Link href={`/projects/${project.slug}`}>
                    <Card className="overflow-hidden h-full transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 cursor-pointer border-2 hover:border-primary/20 bg-card/80 backdrop-blur-sm">
                      <div className="relative overflow-hidden">
                        <Image
                          src={project.image_url || "/placeholder.svg?height=300&width=400"}
                          alt={project.title}
                          width={400}
                          height={300}
                          className="w-full h-56 object-cover transition-all duration-500 group-hover:scale-110"
                        />

                        {/* Enhanced badges */}
                        <div className="absolute top-4 left-4 flex gap-2">
                          {project.featured && (
                            <Badge className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground flex items-center gap-1 px-3 py-1">
                              <Star className="w-3 h-3" />
                              Featured
                            </Badge>
                          )}
                          <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
                            {project.category}
                          </Badge>
                        </div>

                        {/* Enhanced overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center gap-3">
                          {project.live_url && (
                            <Button
                              size="sm"
                              className="bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30"
                              onClick={(e) => {
                                e.stopPropagation()
                                window.open(project.live_url, "_blank", "noopener,noreferrer")
                              }}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Live
                            </Button>
                          )}
                          {project.github_url && (
                            <Button
                              size="sm"
                              className="bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30"
                              onClick={(e) => {
                                e.stopPropagation()
                                window.open(project.github_url, "_blank", "noopener,noreferrer")
                              }}
                            >
                              <Github className="w-4 h-4 mr-2" />
                              Code
                            </Button>
                          )}
                        </div>
                      </div>

                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                          <Calendar className="w-3 h-3" />
                          {new Date(project.created_at).toLocaleDateString()}
                        </div>

                        <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-muted-foreground mb-4 text-sm leading-relaxed line-clamp-3">
                          {project.description}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-6">
                          {project.technologies.slice(0, 4).map((tech) => (
                            <Badge key={tech} variant="outline" className="text-xs px-2 py-1">
                              {tech}
                            </Badge>
                          ))}
                          {project.technologies.length > 4 && (
                            <Badge variant="outline" className="text-xs px-2 py-1">
                              +{project.technologies.length - 4}
                            </Badge>
                          )}
                        </div>

                        <div className="flex gap-2">
                          {project.live_url && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 group-hover:border-primary/50"
                              onClick={(e) => {
                                e.stopPropagation()
                                window.open(project.live_url, "_blank", "noopener,noreferrer")
                              }}
                            >
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Live Demo
                            </Button>
                          )}
                          {project.github_url && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="group-hover:border-primary/50"
                              onClick={(e) => {
                                e.stopPropagation()
                                window.open(project.github_url, "_blank", "noopener,noreferrer")
                              }}
                            >
                              <Github className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {filteredProjects.length === 0 && (
            <motion.div variants={itemVariants} className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
                <Briefcase className="w-12 h-12 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-lg">No projects found for the selected category.</p>
            </motion.div>
          )}

          {/* Enhanced CTA Section */}
          <motion.div variants={itemVariants} className="text-center">
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl p-8 border border-primary/20">
              <h3 className="text-2xl font-bold mb-4">Explore More Projects</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Discover my complete portfolio including client work, open-source contributions, and experimental
                projects across various technologies.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild className="group">
                  <Link href="/projects">
                    View All Projects
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="group">
                  <Github className="w-5 h-5 mr-2" />
                  GitHub Portfolio
                  <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default Projects
