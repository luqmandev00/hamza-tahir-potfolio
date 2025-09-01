import { notFound } from "next/navigation"
import { fetchSnippetBySlug } from "@/lib/supabase"
import SnippetDetail from "@/components/snippet-detail"
import type { Metadata } from "next"

interface SnippetPageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: SnippetPageProps): Promise<Metadata> {
  const snippet = await fetchSnippetBySlug(params.slug)

  if (!snippet) {
    return {
      title: "Code Snippet Not Found - Hamza Tahir",
      description: "The requested code snippet could not be found.",
    }
  }

  const keywords = [snippet.language, snippet.category, ...snippet.tags, "code snippet", "programming", "Hamza Tahir"]

  return {
    title: `${snippet.title} - Code Snippet`,
    description: snippet.description,
    keywords: keywords.join(", "),
    authors: [{ name: "Hamza Tahir", url: "https://hamzatahir.dev" }],
    openGraph: {
      title: snippet.title,
      description: snippet.description,
      type: "article",
      publishedTime: snippet.created_at,
      modifiedTime: snippet.updated_at,
      authors: ["Hamza Tahir"],
      tags: snippet.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: snippet.title,
      description: snippet.description,
      creator: "@hamzatahir",
    },
    alternates: {
      canonical: `https://hamzatahir.dev/snippets/${params.slug}`,
    },
  }
}

export default async function SnippetPage({ params }: SnippetPageProps) {
  const snippet = await fetchSnippetBySlug(params.slug)

  if (!snippet) {
    notFound()
  }

  // Generate structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: snippet.title,
    description: snippet.description,
    url: `https://hamzatahir.dev/snippets/${params.slug}`,
    dateCreated: snippet.created_at,
    dateModified: snippet.updated_at,
    author: {
      "@type": "Person",
      name: "Hamza Tahir",
      url: "https://hamzatahir.dev",
    },
    programmingLanguage: snippet.language,
    keywords: snippet.tags.join(", "),
    codeRepository: "https://hamzatahir.dev/snippets",
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <SnippetDetail snippet={snippet} />
    </>
  )
}

export async function generateStaticParams() {
  try {
    const { createServerClient } = await import("@/lib/supabase")
    const supabase = createServerClient()

    const { data: snippets } = await supabase.from("snippets").select("slug").eq("published", true)

    return (
      snippets?.map((snippet) => ({
        slug: snippet.slug,
      })) || []
    )
  } catch (error) {
    console.error("Error generating static params:", error)
    return []
  }
}
