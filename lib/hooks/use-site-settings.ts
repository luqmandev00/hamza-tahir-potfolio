"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

interface SiteSettings {
  site_title?: string
  site_description?: string
  full_name?: string
  tagline?: string
  bio?: string
  email?: string
  phone?: string
  location?: string
  github_url?: string
  linkedin_url?: string
  twitter_url?: string
  instagram_url?: string
  facebook_url?: string
  youtube_url?: string
  profile_image?: string
  resume_url?: string
  skills?: string[]
  enable_blog?: boolean
  enable_projects?: boolean
  enable_snippets?: boolean
  enable_contact_form?: boolean
  enable_dark_mode?: boolean
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.from("site_settings").select("*")

      if (error) throw error

      const settingsMap = data?.reduce((acc, setting) => {
        let value = setting.value

        // Parse JSON values
        if (setting.type === "json" && value) {
          try {
            value = JSON.parse(value)
          } catch (e) {
            console.error(`Error parsing JSON for ${setting.key}:`, e)
          }
        }

        // Parse boolean values
        if (setting.type === "boolean") {
          value = value === "true"
        }

        acc[setting.key] = value
        return acc
      }, {} as SiteSettings)

      setSettings(settingsMap || {})
      setError(null)
    } catch (error) {
      console.error("Error fetching site settings:", error)
      setError("Failed to load site settings")
    } finally {
      setLoading(false)
    }
  }

  const updateSetting = async (key: string, value: any) => {
    try {
      const settingValue = typeof value === "object" ? JSON.stringify(value) : value.toString()
      const settingType = typeof value === "boolean" ? "boolean" : typeof value === "object" ? "json" : "string"

      const { error } = await supabase.from("site_settings").upsert(
        {
          key,
          value: settingValue,
          type: settingType,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "key" },
      )

      if (error) throw error

      setSettings((prev) => ({ ...prev, [key]: value }))
      return { success: true }
    } catch (error) {
      console.error("Error updating setting:", error)
      return { success: false, error }
    }
  }

  return {
    settings,
    loading,
    error,
    updateSetting,
    refetch: fetchSettings,
  }
}
