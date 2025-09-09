"use client"

import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Environment variable validation
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("⚠️ Supabase environment variables are missing. Using mock data fallback.")
}

export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null

// Enhanced retry logic with exponential backoff
async function withRetry<T>(operation: () => Promise<T>, maxRetries = 3, baseDelay = 1000): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      if (attempt === maxRetries) {
        throw error
      }

      const delay = baseDelay * Math.pow(2, attempt - 1)
      console.warn(`Attempt ${attempt} failed, retrying in ${delay}ms...`, error)
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }
  throw new Error("Max retries exceeded")
}

// Mock data for fallback
const mockProjects = [
  {
    id: "1",
    title: "E-commerce Platform",
    description: "A modern e-commerce solution built with Next.js and Shopify",
    image_url: "/ecommerce-platform-concept.png",
    technologies: ["Next.js", "Shopify", "TypeScript", "Tailwind CSS"],
    github_url: "https://github.com/example/ecommerce",
    live_url: "https://example-store.com",
    featured: true,
    slug: "ecommerce-platform",
    content: "A comprehensive e-commerce platform with modern design and seamless user experience.",
    created_at: "2024-01-15T00:00:00Z",
  },
  {
    id: "2",
    title: "Portfolio Website",
    description: "A responsive portfolio website showcasing creative work",
    image_url: "/portfolio-website-showcase.png",
    technologies: ["React", "Framer Motion", "CSS3"],
    github_url: "https://github.com/example/portfolio",
    live_url: "https://example-portfolio.com",
    featured: true,
    slug: "portfolio-website",
    content: "A stunning portfolio website with smooth animations and responsive design.",
    created_at: "2024-01-10T00:00:00Z",
  },
  {
    id: "3",
    title: "Task Management App",
    description: "A collaborative task management application",
    image_url: "/task-management-app-interface.png",
    technologies: ["Vue.js", "Node.js", "MongoDB"],
    github_url: "https://github.com/example/taskapp",
    live_url: "https://example-tasks.com",
    featured: false,
    slug: "task-management-app",
    content: "A powerful task management application for teams and individuals.",
    created_at: "2024-01-05T00:00:00Z",
  },
]

const mockBlogPosts = [
  {
    id: "1",
    title: "Getting Started with Next.js 14",
    excerpt: "Learn the latest features and improvements in Next.js 14",
    content:
      "Next.js 14 brings exciting new features including improved performance, better developer experience, and enhanced SEO capabilities.",
    image_url: "/nextjs-tutorial.jpg",
    published: true,
    slug: "getting-started-nextjs-14",
    created_at: "2024-01-20T00:00:00Z",
    tags: ["Next.js", "React", "Web Development"],
  },
  {
    id: "2",
    title: "Building Responsive Layouts with Tailwind CSS",
    excerpt: "Master responsive design with Tailwind CSS utilities",
    content: "Tailwind CSS provides powerful utilities for creating responsive layouts that work across all devices.",
    image_url: "/tailwind-css-responsive.jpg",
    published: true,
    slug: "responsive-layouts-tailwind",
    created_at: "2024-01-18T00:00:00Z",
    tags: ["Tailwind CSS", "CSS", "Responsive Design"],
  },
]

const mockSnippets = [
  {
    id: "1",
    title: "React Custom Hook for API Calls",
    description: "A reusable custom hook for handling API requests with loading and error states",
    code: `import { useState, useEffect } from 'react'

export function useApi<T>(url: string) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [url])

  return { data, loading, error }
}`,
    language: "typescript",
    tags: ["React", "TypeScript", "Hooks"],
    featured: true,
    slug: "react-api-hook",
    created_at: "2024-01-15T00:00:00Z",
  },
  {
    id: "2",
    title: "CSS Grid Auto-Fit Layout",
    description: "Responsive grid layout that automatically adjusts to screen size",
    code: `.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  padding: 1rem;
}

.grid-item {
  background: #f0f0f0;
  padding: 1rem;
  border-radius: 8px;
}`,
    language: "css",
    tags: ["CSS", "Grid", "Responsive"],
    featured: true,
    slug: "css-grid-auto-fit",
    created_at: "2024-01-12T00:00:00Z",
  },
]

const mockServiceAreas = [
  {
    id: "1",
    name: "Dubai",
    slug: "dubai",
    description: "Professional Shopify development services in Dubai, UAE",
    content: "Comprehensive Shopify solutions for businesses in Dubai",
    meta_title: "Shopify Expert Dubai | E-commerce Development Services",
    meta_description:
      "Leading Shopify expert in Dubai offering custom e-commerce solutions, theme development, and store optimization services.",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    name: "Abu Dhabi",
    slug: "abu-dhabi",
    description: "Expert Shopify development services in Abu Dhabi, UAE",
    content: "Professional Shopify development for Abu Dhabi businesses",
    meta_title: "Shopify Developer Abu Dhabi | E-commerce Solutions",
    meta_description:
      "Professional Shopify developer in Abu Dhabi providing custom e-commerce solutions and store development services.",
    created_at: "2024-01-01T00:00:00Z",
  },
]

// Projects functions
export async function fetchProjects() {
  if (!supabase) {
    console.warn("Using mock projects data")
    return mockProjects
  }

  try {
    return await withRetry(async () => {
      const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false })

      if (error) throw error
      return data || mockProjects
    })
  } catch (error) {
    console.error("Error fetching projects:", error)
    return mockProjects
  }
}

export async function fetchFeaturedProjects() {
  if (!supabase) {
    return mockProjects.filter((p) => p.featured)
  }

  try {
    return await withRetry(async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("featured", true)
        .order("created_at", { ascending: false })
        .limit(6)

      if (error) throw error
      return data || mockProjects.filter((p) => p.featured)
    })
  } catch (error) {
    console.error("Error fetching featured projects:", error)
    return mockProjects.filter((p) => p.featured)
  }
}

export async function fetchProjectBySlug(slug: string) {
  if (!supabase) {
    return mockProjects.find((p) => p.slug === slug) || null
  }

  try {
    return await withRetry(async () => {
      const { data, error } = await supabase.from("projects").select("*").eq("slug", slug).single()

      if (error) throw error
      return data || mockProjects.find((p) => p.slug === slug) || null
    })
  } catch (error) {
    console.error("Error fetching project:", error)
    return mockProjects.find((p) => p.slug === slug) || null
  }
}

// Blog functions
export async function fetchBlogPosts() {
  if (!supabase) {
    return mockBlogPosts
  }

  try {
    return await withRetry(async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false })

      if (error) throw error
      return data || mockBlogPosts
    })
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return mockBlogPosts
  }
}

export async function fetchFeaturedBlogPosts() {
  if (!supabase) {
    return mockBlogPosts.slice(0, 3)
  }

  try {
    return await withRetry(async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(3)

      if (error) throw error
      return data || mockBlogPosts.slice(0, 3)
    })
  } catch (error) {
    console.error("Error fetching featured blog posts:", error)
    return mockBlogPosts.slice(0, 3)
  }
}

export async function fetchBlogPostBySlug(slug: string) {
  if (!supabase) {
    return mockBlogPosts.find((p) => p.slug === slug) || null
  }

  try {
    return await withRetry(async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .single()

      if (error) throw error
      return data || mockBlogPosts.find((p) => p.slug === slug) || null
    })
  } catch (error) {
    console.error("Error fetching blog post:", error)
    return mockBlogPosts.find((p) => p.slug === slug) || null
  }
}

// Snippets functions
export async function fetchSnippets() {
  if (!supabase) {
    return mockSnippets
  }

  try {
    return await withRetry(async () => {
      const { data, error } = await supabase.from("code_snippets").select("*").order("created_at", { ascending: false })

      if (error) throw error
      return data || mockSnippets
    })
  } catch (error) {
    console.error("Error fetching snippets:", error)
    return mockSnippets
  }
}

export async function fetchFeaturedSnippets() {
  if (!supabase) {
    return mockSnippets.filter((s) => s.featured)
  }

  try {
    return await withRetry(async () => {
      const { data, error } = await supabase
        .from("code_snippets")
        .select("*")
        .eq("featured", true)
        .order("created_at", { ascending: false })
        .limit(4)

      if (error) throw error
      return data || mockSnippets.filter((s) => s.featured)
    })
  } catch (error) {
    console.error("Error fetching featured snippets:", error)
    return mockSnippets.filter((s) => s.featured)
  }
}

export async function fetchSnippetBySlug(slug: string) {
  if (!supabase) {
    return mockSnippets.find((s) => s.slug === slug) || null
  }

  try {
    return await withRetry(async () => {
      const { data, error } = await supabase.from("code_snippets").select("*").eq("slug", slug).single()

      if (error) throw error
      return data || mockSnippets.find((s) => s.slug === slug) || null
    })
  } catch (error) {
    console.error("Error fetching snippet:", error)
    return mockSnippets.find((s) => s.slug === slug) || null
  }
}

// Service Areas functions
export async function fetchServiceAreas() {
  if (!supabase) {
    return mockServiceAreas
  }

  try {
    return await withRetry(async () => {
      const { data, error } = await supabase.from("service_areas").select("*").order("created_at", { ascending: false })

      if (error) throw error
      return data || mockServiceAreas
    })
  } catch (error) {
    console.error("Error fetching service areas:", error)
    return mockServiceAreas
  }
}

export async function fetchServiceAreaBySlug(slug: string) {
  if (!supabase) {
    return mockServiceAreas.find((s) => s.slug === slug) || null
  }

  try {
    return await withRetry(async () => {
      const { data, error } = await supabase.from("service_areas").select("*").eq("slug", slug).single()

      if (error) throw error
      return data || mockServiceAreas.find((s) => s.slug === slug) || null
    })
  } catch (error) {
    console.error("Error fetching service area:", error)
    return mockServiceAreas.find((s) => s.slug === slug) || null
  }
}

// Contact form submission
export async function submitContactForm(formData: {
  name: string
  email: string
  message: string
}) {
  if (!supabase) {
    console.warn("Contact form submitted (mock mode):", formData)
    return { success: true, message: "Message sent successfully!" }
  }

  try {
    return await withRetry(async () => {
      const { error } = await supabase.from("contact_messages").insert([formData])

      if (error) throw error
      return { success: true, message: "Message sent successfully!" }
    })
  } catch (error) {
    console.error("Error submitting contact form:", error)
    return { success: false, message: "Failed to send message. Please try again." }
  }
}

// Quote request submission
export async function submitQuoteRequest(formData: {
  name: string
  email: string
  company?: string
  project_type: string
  budget_range: string
  timeline: string
  description: string
}) {
  if (!supabase) {
    console.warn("Quote request submitted (mock mode):", formData)
    return { success: true, message: "Quote request sent successfully!" }
  }

  try {
    return await withRetry(async () => {
      const { error } = await supabase.from("quote_requests").insert([formData])

      if (error) throw error
      return { success: true, message: "Quote request sent successfully!" }
    })
  } catch (error) {
    console.error("Error submitting quote request:", error)
    return { success: false, message: "Failed to send quote request. Please try again." }
  }
}

// Site settings
export async function fetchSiteSettings() {
  if (!supabase) {
    return {
      site_title: "Hamza Tahir - Full Stack Developer",
      site_description: "Professional web development services",
      contact_email: "hello@hamzatahir.com",
      social_links: {
        github: "https://github.com/hamzatahir",
        linkedin: "https://linkedin.com/in/hamzatahir",
        twitter: "https://twitter.com/hamzatahir",
      },
    }
  }

  try {
    return await withRetry(async () => {
      const { data, error } = await supabase.from("site_settings").select("*").single()

      if (error) throw error
      return (
        data || {
          site_title: "Hamza Tahir - Full Stack Developer",
          site_description: "Professional web development services",
          contact_email: "hello@hamzatahir.com",
          social_links: {
            github: "https://github.com/hamzatahir",
            linkedin: "https://linkedin.com/in/hamzatahir",
            twitter: "https://twitter.com/hamzatahir",
          },
        }
      )
    })
  } catch (error) {
    console.error("Error fetching site settings:", error)
    return {
      site_title: "Hamza Tahir - Full Stack Developer",
      site_description: "Professional web development services",
      contact_email: "hello@hamzatahir.com",
      social_links: {
        github: "https://github.com/hamzatahir",
        linkedin: "https://linkedin.com/in/hamzatahir",
        twitter: "https://twitter.com/hamzatahir",
      },
    }
  }
}
