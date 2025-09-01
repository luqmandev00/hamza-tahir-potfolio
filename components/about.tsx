"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Code, User, Calendar } from "lucide-react"
import { useSiteSettings } from "@/lib/hooks/use-site-settings"
import Image from "next/image"
import { useState, useEffect } from "react"

const About = () => {
  const { settings, loading } = useSiteSettings()
  const [skillProgress, setSkillProgress] = useState<{ [key: string]: number }>({})

  const skills = settings.skills || [
    "JavaScript/TypeScript",
    "React/Next.js",
    "WordPress",
    "Shopify",
    "PHP",
    "Node.js",
    "Python",
    "Database Design",
  ]

  const skillLevels: Record<string, number> = {
    "JavaScript/TypeScript": 95,
    "React/Next.js": 90,
    WordPress: 95,
    Shopify: 88,
    PHP: 85,
    "Node.js": 82,
    Python: 78,
    "Database Design": 85,
  }

  useEffect(() => {
    // Animate progress bars on component mount
    const timer = setTimeout(() => {
      const progressValues: { [key: string]: number } = {}
      skills.forEach((skill) => {
        progressValues[skill] = skillLevels[skill] || 80
      })
      setSkillProgress(progressValues)
    }, 500)

    return () => clearTimeout(timer)
  }, [skills])

  const timeline = [
    {
      year: "2024",
      title: "Senior Full Stack Developer",
      company: "Freelance",
      description: "Leading complex e-commerce projects and custom web applications",
      type: "work",
    },
    {
      year: "2023",
      title: "WordPress & Shopify Specialist",
      company: "Digital Agency",
      description: "Developed 50+ WordPress sites and 20+ Shopify stores",
      type: "work",
    },
    {
      year: "2022",
      title: "Full Stack Web Developer",
      company: "Tech Startup",
      description: "Built scalable web applications using modern tech stack",
      type: "work",
    },
    {
      year: "2021",
      title: "Computer Science Degree",
      company: "University",
      description: "Bachelor of Science in Computer Science",
      type: "education",
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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
      <section id="about" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </section>
    )
  }

  const fullName = settings.full_name || "Hamza Tahir"
  const bio =
    settings.bio ||
    "I'm a passionate full-stack developer who loves turning complex problems into simple, beautiful solutions. My journey began with curiosity about how websites work, and it has evolved into a career dedicated to creating exceptional digital experiences."
  const profileImage = settings.profile_image || "/placeholder.svg?height=400&width=400"

  return (
    <section id="about" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">About Me</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Passionate developer with 4+ years of experience creating digital solutions that make a difference
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Story Section */}
            <motion.div variants={itemVariants}>
              <Card className="p-8">
                <CardContent className="p-0">
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <User className="w-6 h-6 text-primary" />
                    My Story
                  </h3>

                  {profileImage && (
                    <div className="mb-6 flex justify-center">
                      <Image
                        src={profileImage || "https://media.licdn.com/dms/image/v2/D4D03AQFJmCMo6-2e8A/profile-displayphoto-shrink_800_800/B4DZW5lS0VH4Ac-/0/1742575317339?e=1759363200&v=beta&t=D8h8R6pW6piz-HAlY0UM-A1CVCftnt9jNupsJlQ-mfM"}
                        alt={fullName}
                        width={200}
                        height={200}
                        className="rounded-full object-cover"
                      />
                    </div>
                  )}

                  <div className="space-y-4 text-muted-foreground">
                    <p>{bio}</p>
                    <p>
                      Specializing in WordPress and Shopify development, I've helped businesses of all sizes establish
                      their online presence and drive growth through custom web solutions. I believe in writing clean,
                      maintainable code and staying up-to-date with the latest technologies.
                    </p>
                    <p>
                      When I'm not coding, you'll find me exploring new technologies, contributing to open-source
                      projects, or sharing knowledge through blog posts and tutorials.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-8">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-primary">50+</div>
                      <div className="text-sm text-muted-foreground">Projects Completed</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-primary">4+</div>
                      <div className="text-sm text-muted-foreground">Years Experience</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Skills Section */}
            <motion.div variants={itemVariants}>
              <Card className="p-8">
                <CardContent className="p-0">
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Code className="w-6 h-6 text-primary" />
                    Technical Skills
                  </h3>
                  <div className="space-y-6">
                    {skills.map((skill, index) => {
                      const level = skillLevels[skill] || 80
                      const currentProgress = skillProgress[skill] || 0

                      return (
                        <motion.div
                          key={skill}
                          initial={{ opacity: 0, x: -50 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">{skill}</span>
                            <span className="text-sm text-muted-foreground">{level}%</span>
                          </div>
                          <Progress value={currentProgress}   className="h-2 [&>div]:bg-primary" />
                          
                        </motion.div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Timeline Section */}
          {/* Timeline Section */}
<motion.div variants={itemVariants} className="mt-20">
  <h3 className="text-3xl font-bold text-center mb-16 flex items-center justify-center gap-2">
    <Calendar className="w-8 h-8 text-primary" />
    Experience & Education
  </h3>

  <div className="relative max-w-5xl mx-auto px-4">
    {/* Vertical timeline line (desktop only) */}
    <div className="hidden md:block absolute left-1/2 top-0 w-1 h-full bg-border -translate-x-1/2"></div>

    {timeline.map((item, index) => {
      const isLeft = index % 2 === 0

      return (
        <motion.div
          key={index}
          className="mb-12 flex flex-col md:flex-row items-center md:items-start"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.2 }}
        >
          {/* Left column (for desktop alternating layout) */}
          <div
            className={`hidden md:flex w-5/12 ${
              isLeft ? "justify-end pr-8" : "justify-start pl-8"
            }`}
          >
            {isLeft && (
              <Card className="shadow-lg max-w-md w-full">
                <CardContent className="p-6">
                  <h4 className="font-bold text-xl mb-1">{item.title}</h4>
                  <p className="text-primary font-medium mb-2">{item.company}</p>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Timeline Dot + Year */}
          <div className="relative flex items-center justify-center md:w-2/12 mb-6 md:mb-0">
            <div className="w-8 h-8 bg-primary rounded-full shadow-md flex items-center justify-center">
              <span className="sr-only">{item.year}</span>
            </div>
            <span className="absolute -bottom-6 text-xs font-semibold text-muted-foreground md:static md:ml-2">
              {item.year}
            </span>
          </div>

          {/* Right column (for desktop alternating layout) */}
          <div
            className={`hidden md:flex w-5/12 ${
              isLeft ? "justify-start pl-8" : "justify-end pr-8"
            }`}
          >
            {!isLeft && (
              <Card className="shadow-lg max-w-md w-full">
                <CardContent className="p-6">
                  <h4 className="font-bold text-xl mb-1">{item.title}</h4>
                  <p className="text-primary font-medium mb-2">{item.company}</p>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Mobile Layout (always full width under dot) */}
          <div className="md:hidden w-full">
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <h4 className="font-bold text-xl mb-1">{item.title}</h4>
                <p className="text-primary font-medium mb-2">{item.company}</p>
                <p className="text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      )
    })}
  </div>
</motion.div>

        </motion.div>
      </div>
    </section>
  )
}

export default About
