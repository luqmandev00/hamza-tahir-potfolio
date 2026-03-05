"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import { Home, User, Briefcase, BookOpen, Image as ImageIcon, Sun, Moon, Code } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const Header = () => {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()
  const [time, setTime] = useState("")

  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => {
      const now = new Date()
      setTime(now.toLocaleTimeString("en-GB", { hour12: false }))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const navItems = [
    { name: "About", href: "/#about", icon: User },
    { name: "Work", href: "/projects", icon: Briefcase },
    { name: "Snippets", href: "/#snippets", icon: Code },
    { name: "Blog", href: "/blog", icon: BookOpen },
    { name: "Gallery", href: "/#gallery", icon: ImageIcon },
  ]

  if (!mounted) return null

  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex items-center justify-between px-8 pointer-events-none">
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center bg-[#0a0a0a]/80 backdrop-blur-md border border-white/10 rounded-full px-2 py-1.5 pointer-events-auto shadow-2xl"
      >
        <Link href="/">
          <motion.div
            whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }}
            className={`p-2.5 rounded-full transition-colors ${pathname === "/" ? "bg-white/10" : ""}`}
          >
            <Home className="w-4 h-4 text-white" />
          </motion.div>
        </Link>

        <div className="w-[1px] h-4 bg-white/10 mx-2" />

        <nav className="flex items-center gap-1">
          {navItems.map((item) => (
            <Link key={item.name} href={item.href}>
              <motion.div
                whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-white/70 hover:text-white transition-colors"
              >
                <item.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{item.name}</span>
              </motion.div>
            </Link>
          ))}
        </nav>

        <div className="w-[1px] h-4 bg-white/10 mx-2" />

        <motion.button
          whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2.5 rounded-full text-white/70 hover:text-white transition-colors"
        >
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </motion.button>
      </motion.header>

      <div className="hidden md:block text-white font-mono text-xl tracking-wider opacity-90">
        {time}
      </div>
    </div>
  )
}

export default Header
