import { notFound } from "next/navigation"
import { fetchProjectBySlug } from "@/lib/supabase"
import ProjectDetail from "@/components/project-detail"
import type { Metadata } from "next"

interface ProjectPageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const project = await fetchProjectBySlug(params.slug)

  if (!project) {
    return {
      title: "Project Not Found - Hamza Tahir",
      description: "The requested project could not be found.",
    }
  }

  const keywords = [project.category, ...project.technologies, "web development", "portfolio project", "Hamza Tahir"]

  return {
    title: `${project.title} - Portfolio Project`,
    description: project.description,
    keywords: keywords.join(", "),
    authors: [{ name: "Hamza Tahir", url: "https://hamzatahir.dev" }],
    openGraph: {
      title: project.title,
      description: project.description,
      images: project.image_url
        ? [
            {
              url: project.image_url,
              width: 1200,
              height: 630,
              alt: project.title,
            },
          ]
        : [],
      type: "article",
      publishedTime: project.created_at,
      modifiedTime: project.updated_at,
      authors: ["Hamza Tahir"],
      tags: project.technologies,
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.description,
      images: project.image_url ? [project.image_url] : [],
      creator: "@hamzatahir",
    },
    alternates: {
      canonical: `https://hamzatahir.dev/projects/${params.slug}`,
    },
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const project = await fetchProjectBySlug(params.slug)

  if (!project) {
    notFound()
  }

  // Generate structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.description,
    image: project.image_url,
    url: `https://hamzatahir.dev/projects/${params.slug}`,
    author: {
      "@type": "Person",
      name: "Hamza Tahir",
      url: "https://hamzatahir.dev",
    },
    dateCreated: project.created_at,
    dateModified: project.updated_at,
    keywords: project.technologies.join(", "),
    genre: project.category,
    workExample: project.live_url
      ? {
          "@type": "WebSite",
          url: project.live_url,
        }
      : undefined,
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <ProjectDetail project={project} />
    </>
  )
}

export async function generateStaticParams() {
  try {
    const { createServerClient } = await import("@/lib/supabase")
    const supabase = createServerClient()

    const { data: projects } = await supabase.from("projects").select("slug").eq("published", true)

    return (
      projects?.map((project) => ({
        slug: project.slug,
      })) || []
    )
  } catch (error) {
    console.error("Error generating static params:", error)
    return []
  }
}
