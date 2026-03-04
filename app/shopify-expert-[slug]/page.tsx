import type { Metadata } from "next"
import { fetchServiceAreaBySlug } from "@/lib/supabase"
import ServiceAreaPageClient from "./ServiceAreaPageClient"

interface ServiceAreaPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: ServiceAreaPageProps): Promise<Metadata> {
  const serviceArea = await fetchServiceAreaBySlug(params.slug)

  if (!serviceArea) {
    return {
      title: "Service Area Not Found",
      description: "The requested service area could not be found.",
    }
  }

  return {
    title: serviceArea.meta_title,
    description: serviceArea.meta_description,
    openGraph: {
      title: serviceArea.meta_title,
      description: serviceArea.meta_description,
      images: serviceArea.hero_image ? [serviceArea.hero_image] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: serviceArea.meta_title,
      description: serviceArea.meta_description,
      images: serviceArea.hero_image ? [serviceArea.hero_image] : [],
    },
  }
}

export default async function ServiceAreaPage({ params }: ServiceAreaPageProps) {
  return <ServiceAreaPageClient params={params} />
}

export async function generateStaticParams() {
  try {
    const supabase = (await import("@supabase/supabase-js")).createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.SUPABASE_SERVICE_ROLE_KEY || ""
    )

    const { data: serviceAreas } = await supabase.from("service_areas").select("slug")

    return (
      serviceAreas?.map((area) => ({
        slug: area.slug,
      })) || []
    )
  } catch (error) {
    console.error("Error generating service area static params:", error)
    return []
  }
}
