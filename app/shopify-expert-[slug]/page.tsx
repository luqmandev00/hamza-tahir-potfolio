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
