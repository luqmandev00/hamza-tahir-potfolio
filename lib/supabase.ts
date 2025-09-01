import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Singleton pattern to prevent multiple instances
let supabaseInstance: ReturnType<typeof createClient> | null = null

export const supabase = (() => {
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  }
  return supabaseInstance
})()

// Server-side client for admin operations
export const createServerClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  })
}

// Types
export interface Project {
  id: string
  title: string
  description: string
  content: string
  image_url?: string
  technologies: string[]
  category: string
  subcategory?: string
  status: "planning" | "in-progress" | "completed" | "on-hold"
  featured: boolean
  client?: string
  duration?: string
  live_url?: string
  github_url?: string
  highlights?: string[]
  slug: string
  published: boolean
  created_at: string
  updated_at: string
}

export interface BlogPost {
  id: string
  title: string
  content: string
  excerpt: string
  image_url?: string
  category: string
  tags: string[]
  featured: boolean
  slug: string
  published: boolean
  created_at: string
  updated_at: string
}

export interface Snippet {
  id: string
  title: string
  description: string
  code: string
  language: string
  category: string
  tags: string[]
  featured: boolean
  slug: string
  published: boolean
  created_at: string
  updated_at: string
}

export interface SiteSettings {
  id: string
  site_name: string
  site_description: string
  site_url: string
  logo_url?: string
  favicon_url?: string
  social_links: {
    twitter?: string
    github?: string
    linkedin?: string
    email?: string
  }
  features: {
    blog_enabled: boolean
    projects_enabled: boolean
    snippets_enabled: boolean
    contact_enabled: boolean
    analytics_enabled: boolean
  }
  seo: {
    meta_title: string
    meta_description: string
    og_image?: string
  }
  email: {
    smtp_host?: string
    smtp_port?: number
    smtp_user?: string
    smtp_pass?: string
    from_email?: string
  }
  maintenance_mode: boolean
  created_at: string
  updated_at: string
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  subject?: string
  message: string
  status: "unread" | "read" | "replied"
  created_at: string
}

// Helper functions with better error handling
export const fetchProjects = async () => {
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Supabase error:", error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error("Error fetching projects:", error)
    return []
  }
}

export const fetchProjectBySlug = async (slug: string) => {
  try {
    const { data, error } = await supabase.from("projects").select("*").eq("slug", slug).eq("published", true).single()

    if (error) {
      console.error("Supabase error:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error fetching project:", error)
    return null
  }
}

export const fetchBlogPosts = async () => {
  try {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Supabase error:", error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return []
  }
}

export const fetchBlogPostBySlug = async (slug: string) => {
  try {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .single()

    if (error) {
      console.error("Supabase error:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error fetching blog post:", error)
    return null
  }
}

export const fetchSnippets = async () => {
  try {
    const { data, error } = await supabase
      .from("snippets")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Supabase error:", error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error("Error fetching snippets:", error)
    return []
  }
}

export const fetchSnippetBySlug = async (slug: string) => {
  try {
    const { data, error } = await supabase.from("snippets").select("*").eq("slug", slug).eq("published", true).single()

    if (error) {
      console.error("Supabase error:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error fetching snippet:", error)
    return null
  }
}
