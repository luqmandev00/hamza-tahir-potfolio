"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Code, Briefcase, MessageSquare, Settings, Plus, Eye, TrendingUp, Activity } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { getCurrentUser } from "@/lib/auth"
import AdminLayout from "@/components/admin/admin-layout"

const AdminDashboard = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    projects: 0,
    blogPosts: 0,
    snippets: 0,
    messages: 0,
    publishedProjects: 0,
    publishedPosts: 0,
    unreadMessages: 0,
  })
  const [recentActivity, setRecentActivity] = useState<any[]>([])

  useEffect(() => {
    checkAuth()
    fetchStats()
    fetchRecentActivity()
  }, [])

  const checkAuth = async () => {
    const { user } = await getCurrentUser()
    if (!user) {
      router.push("/admin/login")
      return
    }
    setLoading(false)
  }

  const fetchStats = async () => {
    try {
      // Fetch projects stats
      const { count: projectsCount } = await supabase.from("projects").select("*", { count: "exact", head: true })

      const { count: publishedProjectsCount } = await supabase
        .from("projects")
        .select("*", { count: "exact", head: true })
        .eq("published", true)

      // Fetch blog posts stats
      const { count: blogPostsCount } = await supabase.from("blog_posts").select("*", { count: "exact", head: true })

      const { count: publishedPostsCount } = await supabase
        .from("blog_posts")
        .select("*", { count: "exact", head: true })
        .eq("published", true)

      // Fetch snippets stats
      const { count: snippetsCount } = await supabase.from("code_snippets").select("*", { count: "exact", head: true })

      // Fetch messages stats
      const { count: messagesCount } = await supabase
        .from("contact_messages")
        .select("*", { count: "exact", head: true })

      const { count: unreadMessagesCount } = await supabase
        .from("contact_messages")
        .select("*", { count: "exact", head: true })
        .eq("status", "unread")

      setStats({
        projects: projectsCount || 0,
        blogPosts: blogPostsCount || 0,
        snippets: snippetsCount || 0,
        messages: messagesCount || 0,
        publishedProjects: publishedProjectsCount || 0,
        publishedPosts: publishedPostsCount || 0,
        unreadMessages: unreadMessagesCount || 0,
      })
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  const fetchRecentActivity = async () => {
    try {
      // Fetch recent projects
      const { data: recentProjects } = await supabase
        .from("projects")
        .select("id, title, created_at, published")
        .order("created_at", { ascending: false })
        .limit(3)

      // Fetch recent blog posts
      const { data: recentPosts } = await supabase
        .from("blog_posts")
        .select("id, title, created_at, published")
        .order("created_at", { ascending: false })
        .limit(3)

      // Fetch recent messages
      const { data: recentMessages } = await supabase
        .from("contact_messages")
        .select("id, name, subject, created_at, status")
        .order("created_at", { ascending: false })
        .limit(3)

      const activity = [
        ...(recentProjects?.map((p) => ({ ...p, type: "project" })) || []),
        ...(recentPosts?.map((p) => ({ ...p, type: "blog_post" })) || []),
        ...(recentMessages?.map((m) => ({ ...m, type: "message" })) || []),
      ]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 10)

      setRecentActivity(activity)
    } catch (error) {
      console.error("Error fetching recent activity:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  const statCards = [
    {
      title: "Total Projects",
      value: stats.projects,
      subtitle: `${stats.publishedProjects} published`,
      icon: Briefcase,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      title: "Blog Posts",
      value: stats.blogPosts,
      subtitle: `${stats.publishedPosts} published`,
      icon: FileText,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
    {
      title: "Code Snippets",
      value: stats.snippets,
      subtitle: "Ready to use",
      icon: Code,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
      title: "Messages",
      value: stats.messages,
      subtitle: `${stats.unreadMessages} unread`,
      icon: MessageSquare,
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
    },
  ]

  const quickActions = [
    {
      title: "New Project",
      description: "Add a new project to your portfolio",
      icon: Plus,
      href: "/admin/projects/new",
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      title: "Write Blog Post",
      description: "Create a new blog post",
      icon: FileText,
      href: "/admin/blog/new",
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      title: "Add Code Snippet",
      description: "Share a useful code snippet",
      icon: Code,
      href: "/admin/snippets/new",
      color: "bg-purple-500 hover:bg-purple-600",
    },
    {
      title: "Site Settings",
      description: "Manage site configuration",
      icon: Settings,
      href: "/admin/settings",
      color: "bg-gray-500 hover:bg-gray-600",
    },
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "project":
        return Briefcase
      case "blog_post":
        return FileText
      case "message":
        return MessageSquare
      default:
        return Activity
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case "project":
        return "text-blue-600"
      case "blog_post":
        return "text-green-600"
      case "message":
        return "text-orange-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's what's happening with your portfolio.</p>
          </div>
          <Button asChild>
            <a href="/" target="_blank" rel="noopener noreferrer">
              <Eye className="w-4 h-4 mr-2" />
              View Site
            </a>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.bgColor}`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Button variant="outline" className="w-full justify-start h-auto p-4" asChild>
                    <a href={action.href}>
                      <div className={`p-2 rounded-md ${action.color} text-white mr-4`}>
                        <action.icon className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium">{action.title}</div>
                        <div className="text-sm text-muted-foreground">{action.description}</div>
                      </div>
                    </a>
                  </Button>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((item, index) => {
                  const Icon = getActivityIcon(item.type)
                  return (
                    <motion.div
                      key={`${item.type}-${item.id}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                    >
                      <Icon className={`w-4 h-4 ${getActivityColor(item.type)}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {item.title || item.subject || `${item.name} sent a message`}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(item.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      {item.published !== undefined && (
                        <Badge variant={item.published ? "default" : "secondary"}>
                          {item.published ? "Published" : "Draft"}
                        </Badge>
                      )}
                      {item.status && (
                        <Badge variant={item.status === "unread" ? "destructive" : "secondary"}>{item.status}</Badge>
                      )}
                    </motion.div>
                  )
                })}
                {recentActivity.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">No recent activity</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminDashboard
