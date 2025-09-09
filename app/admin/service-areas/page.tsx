"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Plus, Edit, Eye, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { fetchServiceAreas } from "@/lib/supabase"

interface ServiceArea {
  id: string
  slug: string
  title: string
  meta_title: string
  meta_description: string
  intro_text: string
  hero_image?: string
  faq: Array<{ question: string; answer: string }>
  local_expertise: string[]
  active: boolean
  created_at: string
}

export default function ServiceAreasPage() {
  const [serviceAreas, setServiceAreas] = useState<ServiceArea[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingArea, setEditingArea] = useState<ServiceArea | null>(null)

  useEffect(() => {
    loadServiceAreas()
  }, [])

  const loadServiceAreas = async () => {
    try {
      const data = await fetchServiceAreas()
      setServiceAreas(data)
    } catch (error) {
      console.error("Error loading service areas:", error)
      toast({
        title: "Error",
        description: "Failed to load service areas",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleActive = async (id: string, active: boolean) => {
    try {
      // In a real app, this would update the database
      setServiceAreas((prev) => prev.map((area) => (area.id === id ? { ...area, active } : area)))
      toast({
        title: "Success",
        description: `Service area ${active ? "activated" : "deactivated"}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update service area",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service area?")) return

    try {
      setServiceAreas((prev) => prev.filter((area) => area.id !== id))
      toast({
        title: "Success",
        description: "Service area deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete service area",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="h-8 bg-muted rounded w-48 animate-pulse mb-2" />
            <div className="h-4 bg-muted rounded w-96 animate-pulse" />
          </div>
          <div className="h-10 bg-muted rounded w-32 animate-pulse" />
        </div>

        <div className="grid gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-6 bg-muted rounded w-64 animate-pulse mb-2" />
                <div className="h-4 bg-muted rounded w-48 animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-muted rounded w-full animate-pulse mb-2" />
                <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Service Areas</h1>
          <p className="text-muted-foreground">Manage your Shopify expert service area pages</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingArea(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Service Area
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingArea ? "Edit Service Area" : "Add New Service Area"}</DialogTitle>
              <DialogDescription>
                Create or edit a service area page for your Shopify expert services.
              </DialogDescription>
            </DialogHeader>
            <ServiceAreaForm
              area={editingArea}
              onSave={() => {
                setIsDialogOpen(false)
                loadServiceAreas()
              }}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {serviceAreas.map((area) => (
          <Card key={area.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <CardTitle className="text-xl">{area.title}</CardTitle>
                    <Badge variant={area.active ? "default" : "secondary"}>{area.active ? "Active" : "Inactive"}</Badge>
                  </div>
                  <CardDescription className="text-sm">
                    /{area.slug} • {area.meta_description}
                  </CardDescription>
                </div>

                <div className="flex items-center gap-2">
                  <Switch checked={area.active} onCheckedChange={(checked) => handleToggleActive(area.id, checked)} />
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Introduction</h4>
                  <p className="text-sm text-muted-foreground line-clamp-2">{area.intro_text}</p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Local Expertise ({area.local_expertise.length})</h4>
                  <div className="flex flex-wrap gap-2">
                    {area.local_expertise.slice(0, 3).map((expertise, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {expertise}
                      </Badge>
                    ))}
                    {area.local_expertise.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{area.local_expertise.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">FAQ ({area.faq.length} questions)</h4>
                  <div className="text-sm text-muted-foreground">
                    {area.faq.length > 0 ? <span>"{area.faq[0].question}"</span> : <span>No FAQ items</span>}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(`/shopify-expert-${area.slug}`, "_blank")}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Preview
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingArea(area)
                      setIsDialogOpen(true)
                    }}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(area.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {serviceAreas.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-muted-foreground mb-4">
                <div className="text-4xl mb-4">🌍</div>
                <h3 className="text-lg font-medium mb-2">No service areas yet</h3>
                <p className="text-sm">Create your first service area page to start attracting local clients.</p>
              </div>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Service Area
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

function ServiceAreaForm({
  area,
  onSave,
  onCancel,
}: {
  area: ServiceArea | null
  onSave: () => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    slug: area?.slug || "",
    title: area?.title || "",
    meta_title: area?.meta_title || "",
    meta_description: area?.meta_description || "",
    intro_text: area?.intro_text || "",
    hero_image: area?.hero_image || "",
    local_expertise: area?.local_expertise.join("\n") || "",
    faq: area?.faq.map((f) => `Q: ${f.question}\nA: ${f.answer}`).join("\n\n") || "",
    active: area?.active ?? true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // In a real app, this would save to the database
      toast({
        title: "Success",
        description: `Service area ${area ? "updated" : "created"} successfully`,
      })
      onSave()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save service area",
        variant: "destructive",
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
            placeholder="dubai"
            required
          />
          <p className="text-xs text-muted-foreground mt-1">URL: /shopify-expert-{formData.slug}</p>
        </div>

        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
            placeholder="Shopify Expert in Dubai"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="meta_title">Meta Title</Label>
        <Input
          id="meta_title"
          value={formData.meta_title}
          onChange={(e) => setFormData((prev) => ({ ...prev, meta_title: e.target.value }))}
          placeholder="Shopify Expert in Dubai | Professional Shopify Development"
          required
        />
      </div>

      <div>
        <Label htmlFor="meta_description">Meta Description</Label>
        <Textarea
          id="meta_description"
          value={formData.meta_description}
          onChange={(e) => setFormData((prev) => ({ ...prev, meta_description: e.target.value }))}
          placeholder="Looking for a Shopify Expert in Dubai? I help businesses..."
          rows={3}
          required
        />
      </div>

      <div>
        <Label htmlFor="intro_text">Introduction Text</Label>
        <Textarea
          id="intro_text"
          value={formData.intro_text}
          onChange={(e) => setFormData((prev) => ({ ...prev, intro_text: e.target.value }))}
          placeholder="I am a certified Shopify expert helping Dubai businesses..."
          rows={3}
          required
        />
      </div>

      <div>
        <Label htmlFor="hero_image">Hero Image URL</Label>
        <Input
          id="hero_image"
          value={formData.hero_image}
          onChange={(e) => setFormData((prev) => ({ ...prev, hero_image: e.target.value }))}
          placeholder="https://example.com/hero-image.jpg"
        />
      </div>

      <div>
        <Label htmlFor="local_expertise">Local Expertise (one per line)</Label>
        <Textarea
          id="local_expertise"
          value={formData.local_expertise}
          onChange={(e) => setFormData((prev) => ({ ...prev, local_expertise: e.target.value }))}
          placeholder="Knowledge of UAE payment gateways&#10;Familiar with shipping providers&#10;Work in Dubai time zone"
          rows={4}
        />
      </div>

      <div>
        <Label htmlFor="faq">FAQ (Q: question, A: answer format)</Label>
        <Textarea
          id="faq"
          value={formData.faq}
          onChange={(e) => setFormData((prev) => ({ ...prev, faq: e.target.value }))}
          placeholder="Q: How much does a Shopify expert cost?&#10;A: Pricing depends on project scope...&#10;&#10;Q: Can you integrate payment gateways?&#10;A: Yes, I support all major gateways..."
          rows={6}
        />
      </div>

      <div className="flex items-center justify-between pt-6 border-t">
        <div className="flex items-center space-x-2">
          <Switch
            id="active"
            checked={formData.active}
            onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, active: checked }))}
          />
          <Label htmlFor="active">Active</Label>
        </div>

        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">{area ? "Update" : "Create"} Service Area</Button>
        </div>
      </div>
    </form>
  )
}
