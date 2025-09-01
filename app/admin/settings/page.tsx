"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Save,
  Settings,
  Globe,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Facebook,
  Youtube,
  Trash2,
  Plus,
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import AdminLayout from "@/components/admin/admin-layout"
import { toast } from "sonner"

interface SettingsForm {
  // Site Information
  site_title: string
  site_description: string
  site_keywords: string
  site_logo: string
  favicon: string

  // Personal Information
  full_name: string
  tagline: string
  bio: string
  profile_image: string
  resume_url: string

  // Contact Information
  email: string
  phone: string
  location: string

  // Social Media
  github_url: string
  linkedin_url: string
  twitter_url: string
  instagram_url: string
  facebook_url: string
  youtube_url: string

  // SEO Settings
  meta_title: string
  meta_description: string
  og_image: string

  // Features
  enable_blog: boolean
  enable_projects: boolean
  enable_snippets: boolean
  enable_contact_form: boolean
  enable_dark_mode: boolean

  // Analytics
  google_analytics_id: string
  google_tag_manager_id: string

  // Email Settings
  contact_email: string
  smtp_host: string
  smtp_port: string
  smtp_username: string
  smtp_password: string

  // Maintenance
  maintenance_mode: boolean
  maintenance_message: string
}

const AdminSettings = () => {
  const [settings, setSettings] = useState<SettingsForm>({
    site_title: "",
    site_description: "",
    site_keywords: "",
    site_logo: "",
    favicon: "",
    full_name: "",
    tagline: "",
    bio: "",
    profile_image: "",
    resume_url: "",
    email: "",
    phone: "",
    location: "",
    github_url: "",
    linkedin_url: "",
    twitter_url: "",
    instagram_url: "",
    facebook_url: "",
    youtube_url: "",
    meta_title: "",
    meta_description: "",
    og_image: "",
    enable_blog: true,
    enable_projects: true,
    enable_snippets: true,
    enable_contact_form: true,
    enable_dark_mode: true,
    google_analytics_id: "",
    google_tag_manager_id: "",
    contact_email: "",
    smtp_host: "",
    smtp_port: "",
    smtp_username: "",
    smtp_password: "",
    maintenance_mode: false,
    maintenance_message: "",
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [skills, setSkills] = useState<string[]>([])
  const [newSkill, setNewSkill] = useState("")

  useEffect(() => {
    fetchSettings()
    fetchSkills()
  }, [])

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase.from("site_settings").select("*")

      if (error) throw error

      const settingsMap = data?.reduce(
        (acc, setting) => {
          acc[setting.key] = setting.value
          return acc
        },
        {} as Record<string, string>,
      )

      setSettings((prev) => ({ ...prev, ...settingsMap }))
    } catch (error) {
      console.error("Error fetching settings:", error)
      toast.error("Failed to load settings")
    } finally {
      setLoading(false)
    }
  }

  const fetchSkills = async () => {
    try {
      const { data, error } = await supabase.from("site_settings").select("value").eq("key", "skills").single()

      if (error && error.code !== "PGRST116") throw error

      if (data?.value) {
        setSkills(JSON.parse(data.value))
      }
    } catch (error) {
      console.error("Error fetching skills:", error)
    }
  }

  const handleInputChange = (key: keyof SettingsForm, value: string | boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const saveSettings = async () => {
    setSaving(true)
    try {
      const settingsArray = Object.entries(settings).map(([key, value]) => ({
        key,
        value: typeof value === "boolean" ? value.toString() : value,
        type: typeof value === "boolean" ? "boolean" : "string",
        description: getSettingDescription(key),
      }))

      // Save skills separately
      const skillsSetting = {
        key: "skills",
        value: JSON.stringify(skills),
        type: "json",
        description: "List of technical skills",
      }

      const allSettings = [...settingsArray, skillsSetting]

      for (const setting of allSettings) {
        const { error } = await supabase.from("site_settings").upsert(setting, { onConflict: "key" })

        if (error) throw error
      }

      toast.success("Settings saved successfully!")
    } catch (error) {
      console.error("Error saving settings:", error)
      toast.error("Failed to save settings")
    } finally {
      setSaving(false)
    }
  }

  const getSettingDescription = (key: string): string => {
    const descriptions: Record<string, string> = {
      site_title: "The main title of your website",
      site_description: "Brief description of your website",
      full_name: "Your full name",
      tagline: "Professional tagline or title",
      bio: "Short biography or about text",
      email: "Primary contact email",
      phone: "Contact phone number",
      location: "Your location or city",
      // Add more descriptions as needed
    }
    return descriptions[key] || ""
  }

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()])
      setNewSkill("")
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove))
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Settings className="w-8 h-8" />
              Site Settings
            </h1>
            <p className="text-muted-foreground">Configure your website settings and preferences</p>
          </div>
          <Button onClick={saveSettings} disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  General Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="site_title">Site Title</Label>
                    <Input
                      id="site_title"
                      value={settings.site_title}
                      onChange={(e) => handleInputChange("site_title", e.target.value)}
                      placeholder="Your Website Title"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="site_keywords">Keywords</Label>
                    <Input
                      id="site_keywords"
                      value={settings.site_keywords}
                      onChange={(e) => handleInputChange("site_keywords", e.target.value)}
                      placeholder="web developer, portfolio, freelancer"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="site_description">Site Description</Label>
                  <Textarea
                    id="site_description"
                    value={settings.site_description}
                    onChange={(e) => handleInputChange("site_description", e.target.value)}
                    placeholder="Brief description of your website"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="site_logo">Site Logo URL</Label>
                    <Input
                      id="site_logo"
                      value={settings.site_logo}
                      onChange={(e) => handleInputChange("site_logo", e.target.value)}
                      placeholder="https://example.com/logo.png"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="favicon">Favicon URL</Label>
                    <Input
                      id="favicon"
                      value={settings.favicon}
                      onChange={(e) => handleInputChange("favicon", e.target.value)}
                      placeholder="https://example.com/favicon.ico"
                    />
                  </div>
                </div>

                {/* Feature Toggles */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Features</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                      { key: "enable_blog", label: "Enable Blog" },
                      { key: "enable_projects", label: "Enable Projects" },
                      { key: "enable_snippets", label: "Enable Snippets" },
                      { key: "enable_contact_form", label: "Enable Contact Form" },
                      { key: "enable_dark_mode", label: "Enable Dark Mode" },
                    ].map(({ key, label }) => (
                      <div key={key} className="flex items-center space-x-2">
                        <Switch
                          id={key}
                          checked={settings[key as keyof SettingsForm] as boolean}
                          onCheckedChange={(checked) => handleInputChange(key as keyof SettingsForm, checked)}
                        />
                        <Label htmlFor={key}>{label}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Personal Information */}
          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      value={settings.full_name}
                      onChange={(e) => handleInputChange("full_name", e.target.value)}
                      placeholder="Your Full Name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tagline">Professional Tagline</Label>
                    <Input
                      id="tagline"
                      value={settings.tagline}
                      onChange={(e) => handleInputChange("tagline", e.target.value)}
                      placeholder="Full-Stack Developer & Designer"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={settings.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    placeholder="Tell us about yourself..."
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="profile_image">Profile Image URL</Label>
                    <Input
                      id="profile_image"
                      value={settings.profile_image}
                      onChange={(e) => handleInputChange("profile_image", e.target.value)}
                      placeholder="https://example.com/profile.jpg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="resume_url">Resume URL</Label>
                    <Input
                      id="resume_url"
                      value={settings.resume_url}
                      onChange={(e) => handleInputChange("resume_url", e.target.value)}
                      placeholder="https://example.com/resume.pdf"
                    />
                  </div>
                </div>

                {/* Skills Management */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Skills</h3>
                  <div className="flex gap-2">
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add a skill..."
                      onKeyPress={(e) => e.key === "Enter" && addSkill()}
                    />
                    <Button onClick={addSkill} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                        {skill}
                        <button onClick={() => removeSkill(skill)} className="ml-1 hover:text-destructive">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Information */}
          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={settings.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="your@email.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      value={settings.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Location
                  </Label>
                  <Input
                    id="location"
                    value={settings.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    placeholder="City, Country"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact_email">Contact Form Email</Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={settings.contact_email}
                    onChange={(e) => handleInputChange("contact_email", e.target.value)}
                    placeholder="Where contact form messages should be sent"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Social Media */}
          <TabsContent value="social">
            <Card>
              <CardHeader>
                <CardTitle>Social Media Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { key: "github_url", label: "GitHub", icon: Github },
                    { key: "linkedin_url", label: "LinkedIn", icon: Linkedin },
                    { key: "twitter_url", label: "Twitter", icon: Twitter },
                    { key: "instagram_url", label: "Instagram", icon: Instagram },
                    { key: "facebook_url", label: "Facebook", icon: Facebook },
                    { key: "youtube_url", label: "YouTube", icon: Youtube },
                  ].map(({ key, label, icon: Icon }) => (
                    <div key={key} className="space-y-2">
                      <Label htmlFor={key} className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        {label}
                      </Label>
                      <Input
                        id={key}
                        value={settings[key as keyof SettingsForm] as string}
                        onChange={(e) => handleInputChange(key as keyof SettingsForm, e.target.value)}
                        placeholder={`https://${label.toLowerCase()}.com/username`}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SEO Settings */}
          <TabsContent value="seo">
            <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="meta_title">Meta Title</Label>
                  <Input
                    id="meta_title"
                    value={settings.meta_title}
                    onChange={(e) => handleInputChange("meta_title", e.target.value)}
                    placeholder="SEO optimized title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meta_description">Meta Description</Label>
                  <Textarea
                    id="meta_description"
                    value={settings.meta_description}
                    onChange={(e) => handleInputChange("meta_description", e.target.value)}
                    placeholder="SEO meta description (150-160 characters)"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="og_image">Open Graph Image</Label>
                  <Input
                    id="og_image"
                    value={settings.og_image}
                    onChange={(e) => handleInputChange("og_image", e.target.value)}
                    placeholder="https://example.com/og-image.jpg"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="google_analytics_id">Google Analytics ID</Label>
                    <Input
                      id="google_analytics_id"
                      value={settings.google_analytics_id}
                      onChange={(e) => handleInputChange("google_analytics_id", e.target.value)}
                      placeholder="GA-XXXXXXXXX-X"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="google_tag_manager_id">Google Tag Manager ID</Label>
                    <Input
                      id="google_tag_manager_id"
                      value={settings.google_tag_manager_id}
                      onChange={(e) => handleInputChange("google_tag_manager_id", e.target.value)}
                      placeholder="GTM-XXXXXXX"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Advanced Settings */}
          <TabsContent value="advanced">
            <div className="space-y-6">
              {/* Email Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle>Email Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="smtp_host">SMTP Host</Label>
                      <Input
                        id="smtp_host"
                        value={settings.smtp_host}
                        onChange={(e) => handleInputChange("smtp_host", e.target.value)}
                        placeholder="smtp.gmail.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="smtp_port">SMTP Port</Label>
                      <Input
                        id="smtp_port"
                        value={settings.smtp_port}
                        onChange={(e) => handleInputChange("smtp_port", e.target.value)}
                        placeholder="587"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="smtp_username">SMTP Username</Label>
                      <Input
                        id="smtp_username"
                        value={settings.smtp_username}
                        onChange={(e) => handleInputChange("smtp_username", e.target.value)}
                        placeholder="your@email.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="smtp_password">SMTP Password</Label>
                      <Input
                        id="smtp_password"
                        type="password"
                        value={settings.smtp_password}
                        onChange={(e) => handleInputChange("smtp_password", e.target.value)}
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Maintenance Mode */}
              <Card>
                <CardHeader>
                  <CardTitle>Maintenance Mode</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="maintenance_mode"
                      checked={settings.maintenance_mode}
                      onCheckedChange={(checked) => handleInputChange("maintenance_mode", checked)}
                    />
                    <Label htmlFor="maintenance_mode">Enable Maintenance Mode</Label>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maintenance_message">Maintenance Message</Label>
                    <Textarea
                      id="maintenance_message"
                      value={settings.maintenance_message}
                      onChange={(e) => handleInputChange("maintenance_message", e.target.value)}
                      placeholder="We're currently performing maintenance. Please check back soon!"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}

export default AdminSettings
