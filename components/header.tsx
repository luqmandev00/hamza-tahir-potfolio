"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import {
  Home,
  User,
  Briefcase,
  BookOpen,
  Image as ImageIcon,
  Sun,
  Moon,
  Menu,
  X,
  Code,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Header = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const [time, setTime] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-GB", { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const navItems = [
    { name: "About", href: "/#about", icon: User },
    { name: "Work", href: "/projects", icon: Briefcase },
    { name: "Snippets", href: "/#snippets", icon: Code },
    { name: "Blog", href: "/blog", icon: BookOpen },
    { name: "Gallery", href: "/#gallery", icon: ImageIcon },
  ];

  if (!mounted) return null;

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");
  const toggleMobile = () => setMobileOpen((open) => !open);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-md shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* brand */}
        <Link href="/" className="flex items-center text-white font-bold text-lg">
          <Home className="w-6 h-6 mr-2" />
          Hamza Tahir
        </Link>

        {/* desktop navigation */}
        <nav className="hidden md:flex space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center text-white/70 hover:text-white transition-colors ${
                pathname === item.href ? "text-white" : ""
              }`}
            >
              <item.icon className="w-5 h-5 mr-1" />
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* right side controls */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-white/70 hover:text-white transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <span className="font-mono text-sm text-white hidden sm:inline">{time}</span>

          {/* mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md text-white/70 hover:text-white transition-colors"
            onClick={toggleMobile}
            aria-label="Toggle mobile menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* mobile panel */}
      <div
        className={`md:hidden bg-[#0a0a0a]/95 backdrop-blur-md transition-max-h duration-300 overflow-hidden ${
          mobileOpen ? "max-h-screen" : "max-h-0"
        }`}
      >
        <nav className="flex flex-col px-4 py-3 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center text-white/70 hover:text-white transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              <item.icon className="w-5 h-5 mr-2" />
              <span className="text-base font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;