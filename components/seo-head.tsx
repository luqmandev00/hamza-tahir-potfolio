import Head from "next/head"

interface SEOHeadProps {
  title: string
  description: string
  canonical?: string
  ogImage?: string
  ogType?: string
  publishedTime?: string
  modifiedTime?: string
  tags?: string[]
  author?: string
  schema?: object
}

export default function SEOHead({
  title,
  description,
  canonical,
  ogImage = "/og-image.jpg",
  ogType = "website",
  publishedTime,
  modifiedTime,
  tags = [],
  author = "Hamza Tahir",
  schema,
}: SEOHeadProps) {
  const fullTitle = title.includes("Hamza Tahir") ? title : `${title} | Hamza Tahir`
  const url = canonical || "https://hamzatahir.dev"

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1" />

      {/* Canonical URL */}
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Hamza Tahir - Full-Stack Developer" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={ogImage} />
      <meta property="twitter:creator" content="@hamzatahir" />

      {/* Article specific meta tags */}
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {author && <meta property="article:author" content={author} />}
      {tags.length > 0 && tags.map((tag) => <meta key={tag} property="article:tag" content={tag} />)}

      {/* Keywords */}
      {tags.length > 0 && <meta name="keywords" content={tags.join(", ")} />}

      {/* Structured Data */}
      {schema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />}
    </Head>
  )
}
