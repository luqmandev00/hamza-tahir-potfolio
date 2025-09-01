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
  MailOpen,
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
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { supabase, type ContactMessage } from "@/lib/supabase"
import AdminLayout from "@/components/admin/admin-layout"

interface ExtendedContactMessage extends ContactMessage {
  company?: string
  phone?: string
  project_type?: string
  budget_range?: string
  timeline?: string
  how_did_you_hear?: string
}

const AdminMessages = () => {
  const [messages, setMessages] = useState<ExtendedContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("All")
  const [selectedMessage, setSelectedMessage] = useState<ExtendedContactMessage | null>(null)
  const [replyText, setReplyText] = useState("")

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      setMessages(data || [])
    } catch (error) {
      console.error("Error fetching messages:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateMessageStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase.from("contact_messages").update({ status }).eq("id", id)

      if (error) throw error
      setMessages(messages.map((m) => (m.id === id ? { ...m, status } : m)))
    } catch (error) {
      console.error("Error updating message status:", error)
    }
  }

  const markAsReplied = async (id: string) => {
    try {
      const { error } = await supabase
        .from("contact_messages")
        .update({ replied: true, status: "replied" })
        .eq("id", id)

      if (error) throw error
      setMessages(messages.map((m) => (m.id === id ? { ...m, replied: true, status: "replied" } : m)))
    } catch (error) {
      console.error("Error marking as replied:", error)
    }
  }

  const deleteMessage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return

    try {
      const { error } = await supabase.from("contact_messages").delete().eq("id", id)

      if (error) throw error
      setMessages(messages.filter((m) => m.id !== id))
    } catch (error) {
      console.error("Error deleting message:", error)
    }
  }

  const filteredMessages = messages.filter((message) => {
    const matchesSearch =
      message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.company?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = filterStatus === "All" || message.status === filterStatus.toLowerCase()
    return matchesSearch && matchesStatus
  })

  const statuses = ["All", "Unread", "Read", "Replied"]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "unread":
        return "bg-red-500"
      case "read":
        return "bg-blue-500"
      case "replied":
        return "bg-green-500"
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
      case "50k-plus":
        return "text-red-600"
      default:
        return "text-gray-600"
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
            <h1 className="text-3xl font-bold">Contact Messages</h1>
            <p className="text-muted-foreground">Manage incoming contact form messages and project inquiries</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{messages.filter((m) => m.status === "unread").length} unread</Badge>
            <Badge variant="outline">{messages.length} total</Badge>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search messages, names, companies..."
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

        {/* Messages List */}
        <div className="space-y-4">
          {filteredMessages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={`cursor-pointer transition-all hover:shadow-md ${
                  message.status === "unread" ? "border-l-4 border-l-primary" : ""
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          {message.status === "unread" ? (
                            <Mail className="w-4 h-4 text-primary" />
                          ) : (
                            <MailOpen className="w-4 h-4 text-muted-foreground" />
                          )}
                          <h3 className="font-semibold truncate">{message.subject || "No Subject"}</h3>
                        </div>
                        <Badge className={getStatusColor(message.status)}>{message.status}</Badge>
                        {message.replied && (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            Replied
                          </Badge>
                        )}
                        {message.project_type && <Badge variant="secondary">{message.project_type}</Badge>}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {message.name}
                        </div>
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {message.email}
                        </div>
                        {message.company && (
                          <div className="flex items-center gap-1">
                            <Building className="w-3 h-3" />
                            {message.company}
                          </div>
                        )}
                        {message.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {message.phone}
                          </div>
                        )}
                      </div>

                      {(message.budget_range || message.timeline) && (
                        <div className="flex items-center gap-4 text-sm mb-4">
                          {message.budget_range && (
                            <div className={`flex items-center gap-1 ${getBudgetColor(message.budget_range)}`}>
                              <DollarSign className="w-3 h-3" />
                              {message.budget_range.replace("-", " - ").replace("k", "K").replace("plus", "+")}
                            </div>
                          )}
                          {message.timeline && (
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              {message.timeline}
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(message.created_at).toLocaleDateString()}
                        </div>
                        {message.how_did_you_hear && <div>Source: {message.how_did_you_hear}</div>}
                      </div>

                      <p className="text-muted-foreground line-clamp-2 mb-4">{message.message}</p>

                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedMessage(message)
                                if (message.status === "unread") {
                                  updateMessageStatus(message.id, "read")
                                }
                              }}
                            >
                              <MessageSquare className="w-4 h-4 mr-2" />
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Message Details</DialogTitle>
                            </DialogHeader>
                            {selectedMessage && (
                              <div className="space-y-6">
                                {/* Contact Information */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div className="space-y-4">
                                    <h4 className="font-semibold">Contact Information</h4>
                                    <div className="space-y-2">
                                      <div>
                                        <label className="text-sm font-medium">Name</label>
                                        <p className="text-sm text-muted-foreground">{selectedMessage.name}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium">Email</label>
                                        <p className="text-sm text-muted-foreground">{selectedMessage.email}</p>
                                      </div>
                                      {selectedMessage.company && (
                                        <div>
                                          <label className="text-sm font-medium">Company</label>
                                          <p className="text-sm text-muted-foreground">{selectedMessage.company}</p>
                                        </div>
                                      )}
                                      {selectedMessage.phone && (
                                        <div>
                                          <label className="text-sm font-medium">Phone</label>
                                          <p className="text-sm text-muted-foreground">{selectedMessage.phone}</p>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  <div className="space-y-4">
                                    <h4 className="font-semibold">Project Details</h4>
                                    <div className="space-y-2">
                                      {selectedMessage.project_type && (
                                        <div>
                                          <label className="text-sm font-medium">Project Type</label>
                                          <p className="text-sm text-muted-foreground">
                                            {selectedMessage.project_type}
                                          </p>
                                        </div>
                                      )}
                                      {selectedMessage.budget_range && (
                                        <div>
                                          <label className="text-sm font-medium">Budget Range</label>
                                          <p className={`text-sm ${getBudgetColor(selectedMessage.budget_range)}`}>
                                            {selectedMessage.budget_range
                                              .replace("-", " - ")
                                              .replace("k", "K")
                                              .replace("plus", "+")}
                                          </p>
                                        </div>
                                      )}
                                      {selectedMessage.timeline && (
                                        <div>
                                          <label className="text-sm font-medium">Timeline</label>
                                          <p className="text-sm text-muted-foreground">{selectedMessage.timeline}</p>
                                        </div>
                                      )}
                                      {selectedMessage.how_did_you_hear && (
                                        <div>
                                          <label className="text-sm font-medium">How they heard about you</label>
                                          <p className="text-sm text-muted-foreground">
                                            {selectedMessage.how_did_you_hear}
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <label className="text-sm font-medium">Subject</label>
                                  <p className="text-sm text-muted-foreground">{selectedMessage.subject}</p>
                                </div>

                                <div>
                                  <label className="text-sm font-medium">Message</label>
                                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                    {selectedMessage.message}
                                  </p>
                                </div>

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
                                      markAsReplied(selectedMessage.id)
                                      setReplyText("")
                                      alert("Reply sent! (In a real app, this would send an email)")
                                    }}
                                    disabled={!replyText.trim()}
                                  >
                                    <Reply className="w-4 h-4 mr-2" />
                                    Send Reply
                                  </Button>
                                  <Button variant="outline" onClick={() => markAsReplied(selectedMessage.id)}>
                                    Mark as Replied
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
                            updateMessageStatus(message.id, message.status === "unread" ? "read" : "unread")
                          }
                        >
                          {message.status === "unread" ? "Mark Read" : "Mark Unread"}
                        </Button>

                        <Button size="sm" variant="outline" onClick={() => deleteMessage(message.id)}>
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

          {filteredMessages.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No messages found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminMessages
