"use client"
import { Button } from "@/components/ui/button"
import { Heart, ArrowUp } from "lucide-react"

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8 items-center">
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold text-primary mb-2">Hamza Tahir</h3>
            <p className="text-muted-foreground">Full Stack Developer specializing in WordPress & Shopify</p>
          </div>

          <div className="text-center">
            <p className="text-muted-foreground flex items-center justify-center gap-1">
              Made with <Heart className="w-4 h-4 text-red-500 fill-current" /> 
            </p>
          </div>

          <div className="text-center md:text-right">
            <Button variant="outline" size="sm" onClick={scrollToTop} className="mb-4">
              <ArrowUp className="w-4 h-4 mr-2" />
              Back to Top
            </Button>
            <p className="text-sm text-muted-foreground">© {currentYear} Hamza Tahir. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
