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

  return <BlogPostDetail post={post} />
}

export async function generateStaticParams() {
  try {
    const supabase = (await import("@supabase/supabase-js")).createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.SUPABASE_SERVICE_ROLE_KEY || ""
    )

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
