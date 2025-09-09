"use client"

import { createClient } from "@supabase/supabase-js"

// Environment variables with fallback
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Check if Supabase is configured
const isSupabaseConfigured = supabaseUrl && supabaseAnonKey && supabaseUrl !== "" && supabaseAnonKey !== ""

// Create Supabase client only if configured
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      db: {
        schema: "public",
      },
      global: {
        headers: {
          "x-application-name": "hamza-portfolio",
        },
      },
    })
  : null

// Cache system for better performance
const cache = new Map<string, { data: any; timestamp: number; ttl: number }>()

const CACHE_TTL = {
  projects: 5 * 60 * 1000, // 5 minutes
  blog: 10 * 60 * 1000, // 10 minutes
  services: 15 * 60 * 1000, // 15 minutes
  snippets: 10 * 60 * 1000, // 10 minutes
  default: 5 * 60 * 1000, // 5 minutes
}

// Cache utilities
export const cacheUtils = {
  get: (key: string) => {
    const cached = cache.get(key)
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data
    }
    cache.delete(key)
    return null
  },
  set: (key: string, data: any, ttl: number = CACHE_TTL.default) => {
    cache.set(key, { data, timestamp: Date.now(), ttl })
  },
  clear: (pattern?: string) => {
    if (pattern) {
      for (const key of cache.keys()) {
        if (key.includes(pattern)) {
          cache.delete(key)
        }
      }
    } else {
      cache.clear()
    }
  },
}

// Enhanced fetch with retry logic
async function fetchWithRetry<T>(operation: () => Promise<T>, maxRetries = 3, delay = 1000): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation()
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error)
      if (i === maxRetries - 1) throw error
      await new Promise((resolve) => setTimeout(resolve, delay * Math.pow(2, i)))
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
    image_url: "/placeholder.svg?height=400&width=600&text=E-commerce+Platform",
    technologies: ["Next.js", "Shopify", "TypeScript", "Tailwind CSS"],
    github_url: "https://github.com",
    live_url: "https://example.com",
    featured: true,
    slug: "ecommerce-platform",
    published: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Portfolio Website",
    description: "A responsive portfolio website with modern design",
    image_url: "/placeholder.svg?height=400&width=600&text=Portfolio+Website",
    technologies: ["React", "Next.js", "Framer Motion", "Tailwind CSS"],
    github_url: "https://github.com",
    live_url: "https://example.com",
    featured: true,
    slug: "portfolio-website",
    published: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Mobile App",
    description: "Cross-platform mobile application with React Native",
    image_url: "/placeholder.svg?height=400&width=600&text=Mobile+App",
    technologies: ["React Native", "TypeScript", "Firebase", "Expo"],
    github_url: "https://github.com",
    live_url: "https://example.com",
    featured: false,
    slug: "mobile-app",
    published: true,
    created_at: new Date().toISOString(),
  },
]

const mockBlogPosts = [
  {
    id: "1",
    title: "Getting Started with Next.js 14",
    excerpt: "Learn the latest features and improvements in Next.js 14",
    content: "Full blog post content here...",
    image_url: "/placeholder.svg?height=400&width=600&text=Next.js+14",
    published: true,
    slug: "getting-started-nextjs-14",
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Building Modern Web Applications",
    excerpt: "Best practices for building scalable web applications",
    content: "Full blog post content here...",
    image_url: "/placeholder.svg?height=400&width=600&text=Modern+Web+Apps",
    published: true,
    slug: "building-modern-web-applications",
    created_at: new Date().toISOString(),
  },
]

const mockSnippets = [
  {
    id: "1",
    title: "React Custom Hook for API Calls",
    description: "A reusable custom hook for handling API calls with loading states and error handling.",
    code: `import { useState, useEffect } from 'react';

export function useApi<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
}`,
    content: "A comprehensive custom hook for API calls with TypeScript support, loading states, and error handling.",
    language: "typescript",
    category: "React",
    tags: ["React", "TypeScript", "Hooks", "API"],
    featured: true,
    slug: "react-custom-hook-api-calls",
    published: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Next.js API Route with Error Handling",
    description: "A robust API route pattern with comprehensive error handling and validation.",
    code: `import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = schema.parse(body);
    
    // Process the data
    const result = await processData(validatedData);
    
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}`,
    content:
      "A robust API route pattern with Zod validation and comprehensive error handling for Next.js applications.",
    language: "typescript",
    category: "Next.js",
    tags: ["Next.js", "API", "Validation", "Error Handling"],
    featured: true,
    slug: "nextjs-api-route-error-handling",
    published: true,
    created_at: new Date().toISOString(),
  },
]

const mockServices = [
  {
    id: "1",
    title: "Web Development",
    description: "Custom web applications built with modern technologies",
    icon: "Code",
    features: ["Responsive Design", "Performance Optimization", "SEO Friendly"],
    price_range: "$2000 - $10000",
    show_on_home: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    title: "E-commerce Solutions",
    description: "Complete e-commerce platforms with Shopify and custom solutions",
    icon: "ShoppingCart",
    features: ["Payment Integration", "Inventory Management", "Analytics"],
    price_range: "$3000 - $15000",
    show_on_home: true,
    created_at: new Date().toISOString(),
  },
]

// Projects functions
export async function fetchProjects() {
  const cacheKey = "projects"
  const cached = cacheUtils.get(cacheKey)
  if (cached) return cached

  if (!supabase) {
    console.warn("Supabase not configured, using mock data")
    cacheUtils.set(cacheKey, mockProjects, CACHE_TTL.projects)
    return mockProjects
  }

  try {
    const data = await fetchWithRetry(async () => {
      const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false })

      if (error) throw error
      return data || []
    })

    cacheUtils.set(cacheKey, data, CACHE_TTL.projects)
    return data
  } catch (error) {
    console.error("Error fetching projects:", error)
    console.log("Using mock data as fallback")
    cacheUtils.set(cacheKey, mockProjects, CACHE_TTL.projects)
    return mockProjects
  }
}

export async function fetchFeaturedProjects() {
  const projects = await fetchProjects()
  return projects.filter((project: any) => project.featured).slice(0, 3)
}

export async function fetchProjectBySlug(slug: string) {
  const projects = await fetchProjects()
  return projects.find((project: any) => project.slug === slug)
}

// Blog functions
export async function fetchBlogPosts() {
  const cacheKey = "blog-posts"
  const cached = cacheUtils.get(cacheKey)
  if (cached) return cached

  if (!supabase) {
    console.warn("Supabase not configured, using mock data")
    cacheUtils.set(cacheKey, mockBlogPosts, CACHE_TTL.blog)
    return mockBlogPosts
  }

  try {
    const data = await fetchWithRetry(async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false })

      if (error) throw error
      return data || []
    })

    cacheUtils.set(cacheKey, data, CACHE_TTL.blog)
    return data
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    console.log("Using mock data as fallback")
    cacheUtils.set(cacheKey, mockBlogPosts, CACHE_TTL.blog)
    return mockBlogPosts
  }
}

export async function fetchBlogPostBySlug(slug: string) {
  const posts = await fetchBlogPosts()
  return posts.find((post: any) => post.slug === slug)
}

// Snippets functions
export async function fetchSnippets() {
  const cacheKey = "snippets"
  const cached = cacheUtils.get(cacheKey)
  if (cached) return cached

  if (!supabase) {
    console.warn("Supabase not configured, using mock data")
    cacheUtils.set(cacheKey, mockSnippets, CACHE_TTL.snippets)
    return mockSnippets
  }

  try {
    const data = await fetchWithRetry(async () => {
      const { data, error } = await supabase
        .from("snippets")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false })

      if (error) throw error
      return data || []
    })

    cacheUtils.set(cacheKey, data, CACHE_TTL.snippets)
    return data
  } catch (error) {
    console.error("Error fetching snippets:", error)
    console.log("Using mock data as fallback")
    cacheUtils.set(cacheKey, mockSnippets, CACHE_TTL.snippets)
    return mockSnippets
  }
}

export async function fetchSnippetBySlug(slug: string) {
  const snippets = await fetchSnippets()
  return snippets.find((snippet: any) => snippet.slug === slug)
}

export async function fetchFeaturedSnippets() {
  const snippets = await fetchSnippets()
  return snippets.filter((snippet: any) => snippet.featured).slice(0, 3)
}

// Services functions
export async function fetchServices() {
  const cacheKey = "services"
  const cached = cacheUtils.get(cacheKey)
  if (cached) return cached

  if (!supabase) {
    console.warn("Supabase not configured, using mock data")
    cacheUtils.set(cacheKey, mockServices, CACHE_TTL.services)
    return mockServices
  }

  try {
    const data = await fetchWithRetry(async () => {
      const { data, error } = await supabase.from("services").select("*").order("created_at", { ascending: false })

      if (error) throw error
      return data || []
    })

    cacheUtils.set(cacheKey, data, CACHE_TTL.services)
    return data
  } catch (error) {
    console.error("Error fetching services:", error)
    console.log("Using mock data as fallback")
    cacheUtils.set(cacheKey, mockServices, CACHE_TTL.services)
    return mockServices
  }
}

export async function fetchHomeServices() {
  const services = await fetchServices()
  return services.filter((service: any) => service.show_on_home)
}

// Service Areas functions
export async function fetchServiceAreas() {
  const cacheKey = "service-areas"
  const cached = cacheUtils.get(cacheKey)
  if (cached) return cached

  if (!supabase) {
    console.warn("Supabase not configured, using mock data")
    const mockServiceAreas = [
      {
        id: "1",
        slug: "dubai",
        title: "Shopify Expert in Dubai",
        meta_title: "Shopify Expert in Dubai | Professional Shopify Development",
        meta_description:
          "Looking for a Shopify Expert in Dubai? I help businesses in Dubai design, develop, and grow their Shopify stores.",
        intro_text:
          "I am a certified Shopify expert helping Dubai businesses build powerful online stores tailored to the UAE market.",
        hero_image: "/placeholder.svg?height=600&width=1200&text=Dubai+Shopify+Expert",
        faq: [
          {
            question: "How much does a Shopify expert in Dubai cost?",
            answer: "Pricing depends on project scope, starting from $500 for setup services.",
          },
          {
            question: "Can you integrate UAE payment gateways?",
            answer: "Yes, I support PayTabs, Telr, Stripe, and other UAE-compliant gateways.",
          },
        ],
        local_expertise: [
          "Knowledge of UAE payment gateways",
          "Familiar with shipping providers (Aramex, Fetchr, DHL)",
          "Work in Dubai time zone",
          "Understanding of UAE e-commerce regulations",
        ],
        active: true,
        created_at: new Date().toISOString(),
      },
      {
        id: "2",
        slug: "abu-dhabi",
        title: "Shopify Expert in Abu Dhabi",
        meta_title: "Shopify Expert in Abu Dhabi | Professional Shopify Development",
        meta_description:
          "Looking for a Shopify Expert in Abu Dhabi? I help businesses in Abu Dhabi design, develop, and grow their Shopify stores.",
        intro_text:
          "I am a certified Shopify expert helping Abu Dhabi businesses build powerful online stores tailored to the UAE market.",
        hero_image: "/placeholder.svg?height=600&width=1200&text=Abu+Dhabi+Shopify+Expert",
        faq: [
          {
            question: "How much does a Shopify expert in Abu Dhabi cost?",
            answer: "Pricing depends on project scope, starting from $500 for setup services.",
          },
          {
            question: "Do you work with Abu Dhabi government entities?",
            answer: "Yes, I have experience working with government and enterprise clients in Abu Dhabi.",
          },
        ],
        local_expertise: [
          "Knowledge of UAE payment gateways",
          "Experience with Abu Dhabi government requirements",
          "Work in Abu Dhabi time zone",
          "Understanding of UAE e-commerce regulations",
        ],
        active: true,
        created_at: new Date().toISOString(),
      },
    ]
    cacheUtils.set(cacheKey, mockServiceAreas, CACHE_TTL.services)
    return mockServiceAreas
  }

  try {
    const data = await fetchWithRetry(async () => {
      const { data, error } = await supabase
        .from("service_areas")
        .select("*")
        .eq("active", true)
        .order("created_at", { ascending: false })

      if (error) throw error
      return data || []
    })

    cacheUtils.set(cacheKey, data, CACHE_TTL.services)
    return data
  } catch (error) {
    console.error("Error fetching service areas:", error)
    return []
  }
}

export async function fetchServiceAreaBySlug(slug: string) {
  const serviceAreas = await fetchServiceAreas()
  return serviceAreas.find((area: any) => area.slug === slug)
}

// Contact form submission
export async function submitContactForm(formData: {
  name: string
  email: string
  message: string
  subject?: string
}) {
  if (!supabase) {
    console.warn("Supabase not configured, simulating form submission")
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return { success: true, message: "Message sent successfully!" }
  }

  try {
    const { error } = await supabase.from("contact_messages").insert([
      {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        subject: formData.subject || "Contact Form Submission",
        created_at: new Date().toISOString(),
      },
    ])

    if (error) throw error

    return { success: true, message: "Message sent successfully!" }
  } catch (error) {
    console.error("Error submitting contact form:", error)
    return { success: false, message: "Failed to send message. Please try again." }
  }
}

// Quote form submission
export async function submitQuoteForm(formData: {
  name: string
  email: string
  company?: string
  project_type: string
  budget_range: string
  timeline: string
  description: string
}) {
  if (!supabase) {
    console.warn("Supabase not configured, simulating quote submission")
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return { success: true, message: "Quote request sent successfully!" }
  }

  try {
    const { error } = await supabase.from("quote_requests").insert([
      {
        ...formData,
        created_at: new Date().toISOString(),
      },
    ])

    if (error) throw error

    return { success: true, message: "Quote request sent successfully!" }
  } catch (error) {
    console.error("Error submitting quote form:", error)
    return { success: false, message: "Failed to send quote request. Please try again." }
  }
}

// Health check
export async function checkSupabaseConnection() {
  if (!supabase) {
    return { connected: false, message: "Supabase not configured" }
  }

  try {
    const { data, error } = await supabase.from("projects").select("count").limit(1)

    if (error) throw error

    return { connected: true, message: "Connected successfully" }
  } catch (error) {
    console.error("Supabase connection error:", error)
    return { connected: false, message: "Connection failed" }
  }
}
