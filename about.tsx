"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Code, User, Calendar } from "lucide-react"
import { useSiteSettings } from "@/lib/hooks/use-site-settings"
import Image from "next/image"
import { useState, useEffect, useMemo } from "react"

const About = () => {
  const { settings, loading } = useSiteSettings()
  const [skillProgress, setSkillProgress] = useState<{ [key: string]: number }>({})

  const fullName = settings.full_name || "Hamza Tahir"
  const profileImage = settings.profile_image || "/placeholder.svg?height=400&width=400"

  const bioContent = settings.bio ? (
    <p className="text-base leading-relaxed text-muted-foreground">{settings.bio}</p>
  ) : (
    <>
      <p className="text-base leading-relaxed text-muted-foreground">
        Hi, I’m <strong>Hamza Tahir</strong>, a passionate web developer who enjoys building modern web applications and automation tools that help businesses grow online.
      </p>
      <p className="mt-4 text-base leading-relaxed text-muted-foreground">
        I specialize in creating fast, responsive, and user-friendly websites using technologies like <strong>JavaScript, TypeScript, React, Next.js, HTML, CSS, and Tailwind CSS</strong>. My focus is not only on building good-looking interfaces but also on developing reliable systems that improve business workflows and save time.
      </p>
      <p className="mt-4 text-base leading-relaxed text-muted-foreground">
        Over time, I have worked on several projects including <strong>Shopify applications, automation systems, WhatsApp integrations, and custom web tools</strong>. I enjoy solving real problems with technology and building solutions that make daily operations easier for businesses.
      </p>
      <p className="mt-4 text-base leading-relaxed text-muted-foreground">
        One of my main areas of interest is <strong>Shopify app development and automation</strong>. I work on tools that help store owners automate notifications, manage customer communication, and improve their store operations. I also explore new technologies such as <strong>AI tools, APIs, and SaaS platforms</strong> to create smarter digital products.
      </p>
      <p className="mt-4 text-base leading-relaxed text-muted-foreground">
        I believe in continuous learning and always try to improve my skills by working on new ideas and challenging projects. My goal is to build useful products, provide high-quality solutions to clients, and grow as a developer.
      </p>
      <p className="mt-4 text-base leading-relaxed text-muted-foreground">
        If you’re looking for someone to help build a website, develop a custom tool, or automate parts of your business workflow, feel free to get in touch.
      </p>
    </>
  )

  const skills = useMemo(
    () =>
      settings.skills || [
        "JavaScript/TypeScript",
        "React/Next.js",
        "WordPress",
        "Shopify",
        "PHP",
        "Node.js",
        "Python",
        "Database Design",
      ],
    [settings.skills],
  )

  const skillLevels: Record<string, number> = useMemo(
    () => ({
      "JavaScript/TypeScript": 95,
      "React/Next.js": 90,
      WordPress: 95,
      Shopify: 88,
      PHP: 85,
      "Node.js": 82,
      Python: 78,
      "Database Design": 85,
    }),
    [],
  )

  const timeline = useMemo(
    () => [
      {
        year: "2024",
        title: "Senior Full Stack Developer",
        company: "Freelance",
        description: "Delivering high-impact e-commerce and SaaS platforms for SMBs.",
        type: "work",
      },
      {
        year: "2023",
        title: "WordPress & Shopify Specialist",
        company: "Digital Agency",
        description: "Built 50+ WordPress sites and 20+ Shopify stores with custom integrations.",
        type: "work",
      },
      {
        year: "2022",
        title: "Full Stack Web Developer",
        company: "Tech Startup",
        description: "Built scalable web apps with modern React and Node.js architectures.",
        type: "work",
      },
      {
        year: "2021",
        title: "Computer Science Degree",
        company: "University",
        description: "BSc in Computer Science with a focus on software engineering.",
        type: "education",
      },
    ],
    [],
  )

  const keyStats = useMemo(
    () => [
      {
        icon: Calendar,
        label: "Years of Experience",
        value: "8+",
      },
      {
        icon: Code,
        label: "Projects Delivered",
        value: "80+",
      },
      {
        icon: User,
        label: "Satisfied Clients",
        value: "40+",
      },
    ],
    [],
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      const progressValues: { [key: string]: number } = {}
      skills.forEach((skill) => {
        progressValues[skill] = skillLevels[skill] || 80
      })
      setSkillProgress(progressValues)
    }, 500)

    return () => clearTimeout(timer)
  }, [skills, skillLevels])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.14,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }

  if (loading) {
    return (
      <section id="about" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 flex items-center justify-center">
          <div className="animate-spin rounded-full h-28 w-28 border-y-2 border-primary"></div>
        </div>
      </section>
    )
  }

  return (
    <>
      <motion.section
        id="about"
        className="py-20 bg-muted/30"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        <div className="container mx-auto px-4">
          <motion.div variants={itemVariants} className="grid gap-12 lg:grid-cols-12 lg:items-start">
            {/* left: full-height hero image */}
            <div className="lg:col-span-5">
              <div className="relative w-full h-[520px] sm:h-[620px] lg:h-[720px] overflow-hidden rounded-3xl border border-border shadow-2xl">
                <Image
                  src={profileImage}
                  alt={fullName}
                  fill
                  className="object-cover"
                  priority
                />

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-black/0" />
              </div>
            </div>

            {/* right: content */}
            <div className="lg:col-span-7 flex flex-col gap-10">
              <motion.div variants={itemVariants} className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-3xl font-semibold">About</h3>
                  <span className="text-sm text-muted-foreground">Quick snapshot</span>
                </div>

                <p className="text-base leading-relaxed text-muted-foreground">
                  {bio}
                </p>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {keyStats.map((stat) => {
                    const Icon = stat.icon
                    return (
                      <Card
                        key={stat.label}
                        className="border border-primary/10 bg-primary/5 shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg"
                      >
                        <CardContent className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 text-primary">
                              <Icon className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="text-sm font-medium">{stat.label}</div>
                              <div className="text-lg font-semibold">{stat.value}</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        id="skills-experience"
        className="py-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-10">
            <motion.div variants={itemVariants} className="space-y-4">
              <h2 className="text-4xl font-bold">Skills & Experience</h2>
              <p className="max-w-2xl text-base text-muted-foreground">
                A closer look at the tools I use and the milestones that shaped my career.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="grid gap-10 lg:grid-cols-2">
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold">Skills</h3>

                <div className="grid gap-4">
                  {skills.map((skill) => {
                    const max = skillLevels[skill] || 80
                    const value = skillProgress[skill] || 0

                    return (
                      <Card
                        key={skill}
                        className="border border-primary/10 bg-primary/5 shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg"
                      >
                        <CardContent className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{skill}</span>
                            <span className="text-sm text-muted-foreground">{max}%</span>
                          </div>
                          <Progress value={value} className="h-2 rounded-full" />
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl font-semibold">Experience</h3>

                <div className="relative border-l border-muted/40 pl-6">
                  {timeline.map((item) => (
                    <div key={item.year + item.title} className="relative mb-8">
                      <span className="absolute -left-3 top-1 h-5 w-5 rounded-full bg-primary ring-4 ring-background" />
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-semibold text-primary">{item.year}</span>
                          <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                            {item.type}
                          </span>
                        </div>
                        <h4 className="text-lg font-semibold">{item.title}</h4>
                        <p className="text-sm font-medium text-primary">{item.company}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </>
  )
}

export default About
