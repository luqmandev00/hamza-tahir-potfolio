"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Search,
  Mail,
  Trash2,
  Reply,
  Filter,
  Calendar,
  User,
  MessageSquare,
  Building,
  Phone,
  DollarSign,
  Clock,
  Briefcase,
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { supabase } from "@/lib/supabase"
import AdminLayout from "@/components/admin/admin-layout"
import { toast } from "sonner"

interface QuoteRequest {
  id: string
  name: string
  email: string
  company?: string
  phone?: string
  project_type: string
  budget?: string
  timeline?: string
  description: string
  requirements?: string
  status: string
  created_at: string
  updated_at: string
}

const AdminQuotes = () => {
  const [quotes, setQuotes] = useState<QuoteRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("All")
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null)
  const [replyText, setReplyText] = useState("")

  useEffect(() => {
    fetchQuotes()
  }, [])

  const fetchQuotes = async () => {
    try {
      const { data, error } = await supabase
        .from("quote_requests")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      setQuotes(data || [])
    } catch (error) {
      console.error("Error fetching quotes:", error)
      toast.error("Failed to fetch quote requests")
    } finally {
      setLoading(false)
    }
  }

  const updateQuoteStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase.from("quote_requests").update({ status }).eq("id", id)

      if (error) throw error
      setQuotes(quotes.map((q) => (q.id === id ? { ...q, status } : q)))
      toast.success("Status updated successfully")
    } catch (error) {
      console.error("Error updating quote status:", error)
      toast.error("Failed to update status")
    }
  }

  const deleteQuote = async (id: string) => {
    if (!confirm("Are you sure you want to delete this quote request?")) return

    try {
      const { error } = await supabase.from("quote_requests").delete().eq("id", id)

      if (error) throw error
      setQuotes(quotes.filter((q) => q.id !== id))
      toast.success("Quote request deleted successfully")
    } catch (error) {
      console.error("Error deleting quote:", error)
      toast.error("Failed to delete quote request")
    }
  }

  const filteredQuotes = quotes.filter((quote) => {
    const matchesSearch =
      quote.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.project_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.company?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = filterStatus === "All" || quote.status === filterStatus.toLowerCase()
    return matchesSearch && matchesStatus
  })

  const statuses = ["All", "Pending", "Reviewed", "Quoted", "Accepted", "Rejected"]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500"
      case "reviewed":
        return "bg-blue-500"
      case "quoted":
        return "bg-purple-500"
      case "accepted":
        return "bg-green-500"
      case "rejected":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getBudgetColor = (budget: string) => {
    switch (budget) {
      case "under-5k":
        return "text-green-600"
      case "5k-10k":
        return "text-blue-600"
      case "10k-25k":
        return "text-purple-600"
      case "25k-50k":
        return "text-orange-600"
      case "over-50k":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const formatProjectType = (type: string) => {
    return type
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  const formatBudget = (budget: string) => {
    switch (budget) {
      case "under-5k":
        return "Under $5,000"
      case "5k-10k":
        return "$5,000 - $10,000"
      case "10k-25k":
        return "$10,000 - $25,000"
      case "25k-50k":
        return "$25,000 - $50,000"
      case "over-50k":
        return "Over $50,000"
      case "discuss":
        return "Let's Discuss"
      default:
        return budget
    }
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
            <h1 className="text-3xl font-bold">Quote Requests</h1>
            <p className="text-muted-foreground">Manage incoming project quote requests</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{quotes.filter((q) => q.status === "pending").length} pending</Badge>
            <Badge variant="outline">{quotes.length} total</Badge>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search quotes, names, companies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                {statuses.map((status) => (
                  <Button
                    key={status}
                    variant={filterStatus === status ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus(status)}
                  >
                    <Filter className="w-3 h-3 mr-1" />
                    {status}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quotes List */}
        <div className="space-y-4">
          {filteredQuotes.map((quote, index) => (
            <motion.div
              key={quote.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={`cursor-pointer transition-all hover:shadow-md ${
                  quote.status === "pending" ? "border-l-4 border-l-primary" : ""
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-primary" />
                          <h3 className="font-semibold truncate">{formatProjectType(quote.project_type)}</h3>
                        </div>
                        <Badge className={getStatusColor(quote.status)}>{quote.status}</Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {quote.name}
                        </div>
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {quote.email}
                        </div>
                        {quote.company && (
                          <div className="flex items-center gap-1">
                            <Building className="w-3 h-3" />
                            {quote.company}
                          </div>
                        )}
                        {quote.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {quote.phone}
                          </div>
                        )}
                      </div>

                      {(quote.budget || quote.timeline) && (
                        <div className="flex items-center gap-4 text-sm mb-4">
                          {quote.budget && (
                            <div className={`flex items-center gap-1 ${getBudgetColor(quote.budget)}`}>
                              <DollarSign className="w-3 h-3" />
                              {formatBudget(quote.budget)}
                            </div>
                          )}
                          {quote.timeline && (
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              {quote.timeline}
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(quote.created_at).toLocaleDateString()}
                        </div>
                      </div>

                      <p className="text-muted-foreground line-clamp-2 mb-4">{quote.description}</p>

                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedQuote(quote)
                                if (quote.status === "pending") {
                                  updateQuoteStatus(quote.id, "reviewed")
                                }
                              }}
                            >
                              <MessageSquare className="w-4 h-4 mr-2" />
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Quote Request Details</DialogTitle>
                            </DialogHeader>
                            {selectedQuote && (
                              <div className="space-y-6">
                                {/* Contact Information */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div className="space-y-4">
                                    <h4 className="font-semibold">Contact Information</h4>
                                    <div className="space-y-2">
                                      <div>
                                        <label className="text-sm font-medium">Name</label>
                                        <p className="text-sm text-muted-foreground">{selectedQuote.name}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium">Email</label>
                                        <p className="text-sm text-muted-foreground">{selectedQuote.email}</p>
                                      </div>
                                      {selectedQuote.company && (
                                        <div>
                                          <label className="text-sm font-medium">Company</label>
                                          <p className="text-sm text-muted-foreground">{selectedQuote.company}</p>
                                        </div>
                                      )}
                                      {selectedQuote.phone && (
                                        <div>
                                          <label className="text-sm font-medium">Phone</label>
                                          <p className="text-sm text-muted-foreground">{selectedQuote.phone}</p>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  <div className="space-y-4">
                                    <h4 className="font-semibold">Project Details</h4>
                                    <div className="space-y-2">
                                      <div>
                                        <label className="text-sm font-medium">Project Type</label>
                                        <p className="text-sm text-muted-foreground">
                                          {formatProjectType(selectedQuote.project_type)}
                                        </p>
                                      </div>
                                      {selectedQuote.budget && (
                                        <div>
                                          <label className="text-sm font-medium">Budget Range</label>
                                          <p className={`text-sm ${getBudgetColor(selectedQuote.budget)}`}>
                                            {formatBudget(selectedQuote.budget)}
                                          </p>
                                        </div>
                                      )}
                                      {selectedQuote.timeline && (
                                        <div>
                                          <label className="text-sm font-medium">Timeline</label>
                                          <p className="text-sm text-muted-foreground">{selectedQuote.timeline}</p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <label className="text-sm font-medium">Project Description</label>
                                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                    {selectedQuote.description}
                                  </p>
                                </div>

                                {selectedQuote.requirements && (
                                  <div>
                                    <label className="text-sm font-medium">Additional Requirements</label>
                                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                      {selectedQuote.requirements}
                                    </p>
                                  </div>
                                )}

                                <div>
                                  <label className="text-sm font-medium">Reply</label>
                                  <Textarea
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    placeholder="Type your reply here..."
                                    rows={4}
                                    className="mt-2"
                                  />
                                </div>

                                <div className="flex gap-2">
                                  <Button
                                    onClick={() => {
                                      // Here you would typically send the email
                                      updateQuoteStatus(selectedQuote.id, "quoted")
                                      setReplyText("")
                                      toast.success("Reply sent! (In a real app, this would send an email)")
                                    }}
                                    disabled={!replyText.trim()}
                                  >
                                    <Reply className="w-4 h-4 mr-2" />
                                    Send Quote
                                  </Button>
                                  <Button
                                    variant="outline"
                                    onClick={() => updateQuoteStatus(selectedQuote.id, "reviewed")}
                                  >
                                    Mark as Reviewed
                                  </Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            updateQuoteStatus(quote.id, quote.status === "pending" ? "reviewed" : "pending")
                          }
                        >
                          {quote.status === "pending" ? "Mark Reviewed" : "Mark Pending"}
                        </Button>

                        <Button size="sm" variant="outline" onClick={() => deleteQuote(quote.id)}>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {filteredQuotes.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No quote requests found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminQuotes
