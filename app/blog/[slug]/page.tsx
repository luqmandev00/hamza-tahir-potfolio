import { notFound } from "next/navigation"
import { fetchBlogPostBySlug } from "@/lib/supabase"
import BlogPostDetail from "@/components/blog-post-detail"
import type { Metadata } from "next"

interface BlogPageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const post = await fetchBlogPostBySlug(params.slug)

  if (!post) {
    return {
      title: "Blog Post Not Found - Hamza Tahir",
      description: "The requested blog post could not be found.",
    }
  }

  const keywords = [post.category, ...post.tags, "web development", "blog post", "tutorial", "Hamza Tahir"]

  return {
    title: `${post.title} - Blog`,
    description: post.excerpt,
    keywords: keywords.join(", "),
    authors: [{ name: "Hamza Tahir", url: "https://hamzatahir.dev" }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.image_url
        ? [
            {
              url: post.image_url,
              width: 1200,
              height: 630,
              alt: post.title,
            },
          ]
        : [],
      type: "article",
      publishedTime: post.created_at,
      modifiedTime: post.updated_at,
      authors: ["Hamza Tahir"],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: post.image_url ? [post.image_url] : [],
      creator: "@hamzatahir",
    },
    alternates: {
      canonical: `https://hamzatahir.dev/blog/${params.slug}`,
    },
  }
}

export default async function BlogPage({ params }: BlogPageProps) {
  const post = await fetchBlogPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  // Generate structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.image_url,
    url: `https://hamzatahir.dev/blog/${params.slug}`,
    datePublished: post.created_at,
    dateModified: post.updated_at,
    author: {
      "@type": "Person",
      name: "Hamza Tahir",
      url: "https://hamzatahir.dev",
    },
    publisher: {
      "@type": "Person",
      name: "Hamza Tahir",
      url: "https://hamzatahir.dev",
    },
    keywords: post.tags.join(", "),
    articleSection: post.category,
    wordCount: post.content ? post.content.split(" ").length : 0,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://hamzatahir.dev/blog/${params.slug}`,
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <BlogPostDetail post={post} />
    </>
  )
}

export async function generateStaticParams() {
  try {
    const { createServerClient } = await import("@/lib/supabase")
    const supabase = createServerClient()

    const { data: posts } = await supabase.from("blog_posts").select("slug").eq("published", true)

    return (
      posts?.map((post) => ({
        slug: post.slug,
      })) || []
    )
  } catch (error) {
    console.error("Error generating static params:", error)
    return []
  }
}
