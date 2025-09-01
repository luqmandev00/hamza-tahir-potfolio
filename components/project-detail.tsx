"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ExternalLink, Github, Calendar, Tag, ArrowLeft, Clock, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import PageProgress from "@/components/page-progress"
import QuoteForm from "@/components/quote-form"
import type { Project } from "@/lib/supabase"

interface ProjectDetailProps {
  project: Project
}

export default function ProjectDetail({ project }: ProjectDetailProps) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Optimize loading with requestAnimationFrame
    const timer = requestAnimationFrame(() => {
      setTimeout(() => setIsLoading(false), 300)
    })
    return () => cancelAnimationFrame(timer)
  }, [])

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
              <Link href="/projects" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Projects
              </Link>
            </Button>
          </div>

          {/* Project Header */}
          <div className="mb-12">
            <motion.h1
              className="text-4xl md:text-5xl font-bold mb-4 gradient-text"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
            >
              {project.title}
            </motion.h1>

            <motion.p
              className="text-xl text-muted-foreground mb-6 max-w-3xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
            >
              {project.description}
            </motion.p>

            <motion.div
              className="flex flex-wrap items-center gap-4 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                {new Date(project.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Tag className="w-4 h-4" />
                {project.category}
              </div>
              {project.client && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="w-4 h-4" />
                  {project.client}
                </div>
              )}
              {project.duration && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  {project.duration}
                </div>
              )}
              {project.featured && <Badge className="gradient-bg text-white">Featured Project</Badge>}
            </motion.div>

            <motion.div
              className="flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.4 }}
            >
              {project.live_url && (
                <Button asChild className="btn-gradient">
                  <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Live Demo
                  </a>
                </Button>
              )}
              {project.github_url && (
                <Button variant="outline" asChild className="gradient-border bg-transparent">
                  <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                    <Github className="w-4 h-4 mr-2" />
                    View Code
                  </a>
                </Button>
              )}
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Project Image */}
              {project.image_url && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  <Card className="overflow-hidden card-hover">
                    <Image
                      src={project.image_url || "/placeholder.svg"}
                      alt={project.title}
                      width={800}
                      height={500}
                      className="w-full h-auto object-cover"
                      priority
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 800px"
                    />
                  </Card>
                </motion.div>
              )}

              {/* Project Content */}
              {project.content && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.4 }}
                >
                  <Card className="card-hover">
                    <CardContent className="p-8">
                      <h2 className="text-2xl font-bold mb-4 gradient-text">About This Project</h2>
                      <div className="rich-text-content" dangerouslySetInnerHTML={{ __html: project.content }} />
                    </CardContent>
                  </Card>
                </motion.div>
              )}

                         
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Technologies */}

               {/* Project Highlights */}
              {project.highlights && project.highlights.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                >
                  <Card className="card-hover">
                    <CardContent className="p-8">
                      <h3 className="text-xl font-bold mb-4 gradient-text">Key Highlights</h3>
                      <ul className="space-y-2">
                        {project.highlights.map((highlight, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="w-2 h-2 rounded-full gradient-bg mt-2 flex-shrink-0"></span>
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
              >
                <Card className="card-hover">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4 gradient-text">Technologies Used</h3>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies?.map((tech, index) => (
                        <Badge key={index} variant="secondary" className="gradient-hover">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Project Details */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45, duration: 0.4 }}
              >
                <Card className="card-hover">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4 gradient-text">Project Details</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Category:</span>
                        <p className="text-sm">{project.category}</p>
                      </div>
                      {project.subcategory && (
                        <>
                          <Separator />
                          <div>
                            <span className="text-sm font-medium text-muted-foreground">Subcategory:</span>
                            <p className="text-sm">{project.subcategory}</p>
                          </div>
                        </>
                      )}
                      <Separator />
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Status:</span>
                        <p className="text-sm capitalize">{project.status}</p>
                      </div>
                      <Separator />
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Created:</span>
                        <p className="text-sm">{new Date(project.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Links */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                <Card className="card-hover">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4 gradient-text">Links</h3>
                    <div className="space-y-3">
                      {project.live_url && (
                        <Button
                          variant="outline"
                          className="w-full justify-start gradient-hover bg-transparent"
                          asChild
                        >
                          <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Live Demo
                          </a>
                        </Button>
                      )}
                      {project.github_url && (
                        <Button
                          variant="outline"
                          className="w-full justify-start gradient-hover bg-transparent"
                          asChild
                        >
                          <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                            <Github className="w-4 h-4 mr-2" />
                            Source Code
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
            
          </div>
           {/* Quote Form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.4 }}
              >
                <QuoteForm
                  projectTitle={project.title}
                  projectType={project.category.toLowerCase().replace(/\s+/g, "-")}
                />
              </motion.div>
        </motion.div>
        
      </main>

      <Footer />
    </div>
  )
}
