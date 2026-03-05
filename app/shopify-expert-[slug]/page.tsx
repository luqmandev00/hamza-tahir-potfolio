import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { fetchServiceAreaBySlug } from "@/lib/supabase"
import { createServerClient } from "@/lib/supabase"
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

export async function generateStaticParams() {
  const supabase = createServerClient()
  try {
    const { data: serviceAreas } = await supabase
      .from("service_areas")
      .select("slug")
      .eq("published", true)

    return (
      serviceAreas?.map((sa) => ({ slug: sa.slug })) || []
    )
  } catch (error) {
    console.error("Error generating static params for service areas:", error)
    return []
  }
}

export default async function ServiceAreaPage({ params }: ServiceAreaPageProps) {
  const serviceArea = await fetchServiceAreaBySlug(params.slug)
  if (!serviceArea) {
    notFound()
  }
  return <ServiceAreaPageClient serviceArea={serviceArea} params={params} />
}
