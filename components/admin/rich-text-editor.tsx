"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Link,
  ImageIcon,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Undo,
  Redo,
  Type,
  Highlighter,
  Table,
  Video,
  FileText,
  Subscript,
  Superscript,
  Indent,
  Outdent,
  RotateCcw,
  Save,
  Eye,
  Code2,
  Heading,
  PilcrowIcon,
  Hash,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  showPreview?: boolean
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Start writing...",
  className,
  disabled = false,
  showPreview = true,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [isActive, setIsActive] = useState<Record<string, boolean>>({})
  const [showPreviewMode, setShowPreviewMode] = useState(false)
  const [showSourceCode, setShowSourceCode] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [tableRows, setTableRows] = useState(3)
  const [tableCols, setTableCols] = useState(3)
  const [videoUrl, setVideoUrl] = useState("")

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value
    }
  }, [value])

  const executeCommand = (command: string, value?: string) => {
    if (disabled) return

    document.execCommand(command, false, value)
    updateActiveStates()
    handleContentChange()
  }

  const updateActiveStates = () => {
    const states: Record<string, boolean> = {}

    states.bold = document.queryCommandState("bold")
    states.italic = document.queryCommandState("italic")
    states.underline = document.queryCommandState("underline")
    states.strikeThrough = document.queryCommandState("strikeThrough")
    states.insertUnorderedList = document.queryCommandState("insertUnorderedList")
    states.insertOrderedList = document.queryCommandState("insertOrderedList")
    states.justifyLeft = document.queryCommandState("justifyLeft")
    states.justifyCenter = document.queryCommandState("justifyCenter")
    states.justifyRight = document.queryCommandState("justifyRight")
    states.justifyFull = document.queryCommandState("justifyFull")
    states.subscript = document.queryCommandState("subscript")
    states.superscript = document.queryCommandState("superscript")

    setIsActive(states)
  }

  const handleContentChange = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const insertLink = () => {
    if (linkUrl) {
      executeCommand("createLink", linkUrl)
      setLinkUrl("")
      toast.success("Link inserted successfully!")
    }
  }

  const insertImage = () => {
    if (imageUrl) {
      executeCommand("insertImage", imageUrl)
      setImageUrl("")
      toast.success("Image inserted successfully!")
    }
  }

  const insertTable = () => {
    let tableHTML = "<table border='1' style='border-collapse: collapse; width: 100%; margin: 1rem 0;'>"
    for (let i = 0; i < tableRows; i++) {
      tableHTML += "<tr>"
      for (let j = 0; j < tableCols; j++) {
        tableHTML +=
          i === 0 ? "<th style='padding: 8px; background: #f5f5f5;'>Header</th>" : "<td style='padding: 8px;'>Cell</td>"
      }
      tableHTML += "</tr>"
    }
    tableHTML += "</table><br>"

    executeCommand("insertHTML", tableHTML)
    toast.success("Table inserted successfully!")
  }

  const insertVideo = () => {
    if (videoUrl) {
      let embedCode = ""

      // YouTube
      if (videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be")) {
        const videoId = videoUrl.includes("youtu.be")
          ? videoUrl.split("/").pop()?.split("?")[0]
          : videoUrl.split("v=")[1]?.split("&")[0]
        embedCode = `<div style="margin: 1rem 0;"><iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen style="max-width: 100%; height: auto;"></iframe></div>`
      }
      // Vimeo
      else if (videoUrl.includes("vimeo.com")) {
        const videoId = videoUrl.split("/").pop()
        embedCode = `<div style="margin: 1rem 0;"><iframe src="https://player.vimeo.com/video/${videoId}" width="560" height="315" frameborder="0" allowfullscreen style="max-width: 100%; height: auto;"></iframe></div>`
      }
      // Direct video URL
      else {
        embedCode = `<div style="margin: 1rem 0;"><video controls width="560" height="315" style="max-width: 100%; height: auto;"><source src="${videoUrl}" type="video/mp4">Your browser does not support the video tag.</video></div>`
      }

      executeCommand("insertHTML", embedCode + "<br>")
      setVideoUrl("")
      toast.success("Video inserted successfully!")
    }
  }

  const formatBlock = (tag: string) => {
    executeCommand("formatBlock", tag)
  }

  const changeTextColor = (color: string) => {
    executeCommand("foreColor", color)
  }

  const changeBackgroundColor = (color: string) => {
    executeCommand("hiliteColor", color)
  }

  const changeFontSize = (size: string) => {
    executeCommand("fontSize", size)
  }

  const changeFontFamily = (font: string) => {
    executeCommand("fontName", font)
  }

  const insertHorizontalRule = () => {
    executeCommand("insertHorizontalRule")
  }

  const clearFormatting = () => {
    executeCommand("removeFormat")
    toast.success("Formatting cleared!")
  }

  const saveContent = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML
      localStorage.setItem("editor-backup", content)
      toast.success("Content saved to local backup!")
    }
  }

  const restoreContent = () => {
    const backup = localStorage.getItem("editor-backup")
    if (backup && editorRef.current) {
      editorRef.current.innerHTML = backup
      onChange(backup)
      toast.success("Content restored from backup!")
    } else {
      toast.error("No backup found!")
    }
  }

  const colors = [
    "#000000",
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00",
    "#FF00FF",
    "#00FFFF",
    "#800000",
    "#008000",
    "#000080",
    "#808000",
    "#800080",
    "#008080",
    "#C0C0C0",
    "#808080",
    "#FF9999",
    "#99FF99",
    "#9999FF",
    "#FFFF99",
    "#FF99FF",
    "#99FFFF",
    "#8B5CF6",
    "#A855F7",
    "#C084FC",
    "#DDD6FE",
    "#EDE9FE",
    "#F3F4F6",
  ]

  const fonts = [
    "Arial",
    "Helvetica",
    "Times New Roman",
    "Courier New",
    "Verdana",
    "Georgia",
    "Palatino",
    "Garamond",
    "Bookman",
    "Comic Sans MS",
    "Trebuchet MS",
    "Arial Black",
    "Impact",
    "Lucida Console",
    "Tahoma",
    "Century Gothic",
  ]

  const fontSizes = ["1", "2", "3", "4", "5", "6", "7"]
  const fontSizeLabels = ["8pt", "10pt", "12pt", "14pt", "18pt", "24pt", "36pt"]

  // All heading and paragraph options
  const headingOptions = [
    { command: "formatBlock", icon: Heading1, label: "Heading 1", value: "h1", shortcut: "Ctrl+Alt+1" },
    { command: "formatBlock", icon: Heading2, label: "Heading 2", value: "h2", shortcut: "Ctrl+Alt+2" },
    { command: "formatBlock", icon: Heading3, label: "Heading 3", value: "h3", shortcut: "Ctrl+Alt+3" },
    { command: "formatBlock", icon: Heading, label: "Heading 4", value: "h4", shortcut: "Ctrl+Alt+4" },
    { command: "formatBlock", icon: Hash, label: "Heading 5", value: "h5", shortcut: "Ctrl+Alt+5" },
    { command: "formatBlock", icon: Hash, label: "Heading 6", value: "h6", shortcut: "Ctrl+Alt+6" },
    { command: "formatBlock", icon: PilcrowIcon, label: "Paragraph", value: "p", shortcut: "Ctrl+Alt+0" },
    { command: "formatBlock", icon: FileText, label: "Preformatted", value: "pre", shortcut: "Ctrl+Alt+P" },
    { command: "formatBlock", icon: Quote, label: "Blockquote", value: "blockquote", shortcut: "Ctrl+Alt+Q" },
  ]

  const toolbarButtons = [
    { command: "bold", icon: Bold, label: "Bold", shortcut: "Ctrl+B" },
    { command: "italic", icon: Italic, label: "Italic", shortcut: "Ctrl+I" },
    { command: "underline", icon: Underline, label: "Underline", shortcut: "Ctrl+U" },
    { command: "strikeThrough", icon: Strikethrough, label: "Strikethrough" },
    { type: "separator" },
    { command: "subscript", icon: Subscript, label: "Subscript" },
    { command: "superscript", icon: Superscript, label: "Superscript" },
    { type: "separator" },
    { command: "insertUnorderedList", icon: List, label: "Bullet List" },
    { command: "insertOrderedList", icon: ListOrdered, label: "Numbered List" },
    { command: "indent", icon: Indent, label: "Indent" },
    { command: "outdent", icon: Outdent, label: "Outdent" },
    { type: "separator" },
    { command: "justifyLeft", icon: AlignLeft, label: "Align Left" },
    { command: "justifyCenter", icon: AlignCenter, label: "Align Center" },
    { command: "justifyRight", icon: AlignRight, label: "Align Right" },
    { command: "justifyFull", icon: AlignJustify, label: "Justify" },
    { type: "separator" },
    { command: "undo", icon: Undo, label: "Undo", shortcut: "Ctrl+Z" },
    { command: "redo", icon: Redo, label: "Redo", shortcut: "Ctrl+Y" },
  ]

  if (showSourceCode) {
    return (
      <div className={cn("border border-border rounded-lg overflow-hidden", className)}>
        <div className="border-b border-border bg-muted/30 p-2 flex justify-between items-center">
          <span className="text-sm font-medium">HTML Source Code</span>
          <Button type="button" variant="outline" size="sm" onClick={() => setShowSourceCode(false)}>
            <Eye className="w-4 h-4 mr-2" />
            Visual Editor
          </Button>
        </div>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full min-h-[400px] p-4 font-mono text-sm resize-none focus:outline-none bg-background"
          disabled={disabled}
          placeholder="Enter HTML code here..."
        />
      </div>
    )
  }

  if (showPreviewMode) {
    return (
      <div className={cn("border border-border rounded-lg overflow-hidden", className)}>
        <div className="border-b border-border bg-muted/30 p-2 flex justify-between items-center">
          <span className="text-sm font-medium">Preview Mode</span>
          <Button type="button" variant="outline" size="sm" onClick={() => setShowPreviewMode(false)}>
            <Type className="w-4 h-4 mr-2" />
            Edit Mode
          </Button>
        </div>
        <div className="p-4 min-h-[400px] rich-text-content" dangerouslySetInnerHTML={{ __html: value }} />
      </div>
    )
  }

  return (
    <div className={cn("border border-border rounded-lg overflow-hidden", className)}>
      {/* Main Toolbar */}
      <div className="border-b border-border bg-muted/30 p-2">
        {/* First Row - Headings and Paragraphs */}
        <div className="flex flex-wrap gap-1 mb-2 pb-2 border-b border-border/50">
          <span className="text-xs font-medium text-muted-foreground px-2 py-1">Format:</span>
          {headingOptions.map((option, index) => {
            const Icon = option.icon
            return (
              <Button
                key={index}
                type="button"
                variant="ghost"
                size="sm"
                disabled={disabled}
                onClick={() => formatBlock(option.value)}
                className="h-8 px-2 text-xs"
                title={`${option.label} (${option.shortcut})`}
              >
                <Icon className="h-3 w-3 mr-1" />
                {option.label}
              </Button>
            )
          })}
        </div>

        {/* Second Row - Font Controls */}
        <div className="flex flex-wrap gap-1 mb-2">
          <select
            onChange={(e) => changeFontFamily(e.target.value)}
            className="px-2 py-1 text-xs border rounded bg-background"
            disabled={disabled}
            defaultValue=""
          >
            <option value="">Font Family</option>
            {fonts.map((font) => (
              <option key={font} value={font} style={{ fontFamily: font }}>
                {font}
              </option>
            ))}
          </select>

          <select
            onChange={(e) => changeFontSize(e.target.value)}
            className="px-2 py-1 text-xs border rounded bg-background"
            disabled={disabled}
            defaultValue=""
          >
            <option value="">Size</option>
            {fontSizes.map((size, index) => (
              <option key={size} value={size}>
                {fontSizeLabels[index]}
              </option>
            ))}
          </select>

          {/* Color Controls */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 px-2"
                disabled={disabled}
                title="Text Color"
              >
                <Type className="h-4 w-4 mr-1" />
                <span className="text-xs">Color</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64">
              <div className="space-y-2">
                <Label className="text-xs font-medium">Text Color</Label>
                <div className="grid grid-cols-8 gap-1">
                  {colors.map((color) => (
                    <button
                      key={color}
                      className="w-6 h-6 rounded border border-border hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                      onClick={() => changeTextColor(color)}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 px-2"
                disabled={disabled}
                title="Highlight Color"
              >
                <Highlighter className="h-4 w-4 mr-1" />
                <span className="text-xs">Highlight</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64">
              <div className="space-y-2">
                <Label className="text-xs font-medium">Highlight Color</Label>
                <div className="grid grid-cols-8 gap-1">
                  {colors.map((color) => (
                    <button
                      key={color}
                      className="w-6 h-6 rounded border border-border hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                      onClick={() => changeBackgroundColor(color)}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Third Row - Main Formatting */}
        <div className="flex flex-wrap gap-1">
          {toolbarButtons.map((button, index) => {
            if (button.type === "separator") {
              return <div key={index} className="w-px bg-border mx-1" />
            }

            const Icon = button.icon!
            const isActiveButton = isActive[button.command]

            return (
              <Button
                key={index}
                type="button"
                variant={isActiveButton ? "default" : "ghost"}
                size="sm"
                disabled={disabled}
                onClick={() => executeCommand(button.command)}
                className="h-8 w-8 p-0"
                title={`${button.label}${button.shortcut ? ` (${button.shortcut})` : ""}`}
              >
                <Icon className="h-4 w-4" />
              </Button>
            )
          })}

          <div className="w-px bg-border mx-1" />

          {/* Insert Controls */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                disabled={disabled}
                title="Insert Link"
              >
                <Link className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-2">
                <Label htmlFor="link-url">Link URL</Label>
                <Input
                  id="link-url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                />
                <Button onClick={insertLink} size="sm" className="w-full btn-gradient">
                  Insert Link
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                disabled={disabled}
                title="Insert Image"
              >
                <ImageIcon className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-2">
                <Label htmlFor="image-url">Image URL</Label>
                <Input
                  id="image-url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
                <Button onClick={insertImage} size="sm" className="w-full btn-gradient">
                  Insert Image
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                disabled={disabled}
                title="Insert Table"
              >
                <Table className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="table-rows">Rows</Label>
                    <Input
                      id="table-rows"
                      type="number"
                      value={tableRows}
                      onChange={(e) => setTableRows(Number(e.target.value))}
                      min="1"
                      max="20"
                    />
                  </div>
                  <div>
                    <Label htmlFor="table-cols">Columns</Label>
                    <Input
                      id="table-cols"
                      type="number"
                      value={tableCols}
                      onChange={(e) => setTableCols(Number(e.target.value))}
                      min="1"
                      max="10"
                    />
                  </div>
                </div>
                <Button onClick={insertTable} size="sm" className="w-full btn-gradient">
                  Insert Table ({tableRows}×{tableCols})
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                disabled={disabled}
                title="Insert Video"
              >
                <Video className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-2">
                <Label htmlFor="video-url">Video URL</Label>
                <Input
                  id="video-url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="YouTube, Vimeo, or direct video URL"
                />
                <div className="text-xs text-muted-foreground">Supports YouTube, Vimeo, and direct video links</div>
                <Button onClick={insertVideo} size="sm" className="w-full btn-gradient">
                  Insert Video
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={insertHorizontalRule}
            className="h-8 w-8 p-0"
            title="Horizontal Rule"
            disabled={disabled}
          >
            <div className="w-4 h-px bg-current" />
          </Button>

          <div className="w-px bg-border mx-1" />

          {/* Utility Controls */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearFormatting}
            className="h-8 w-8 p-0"
            title="Clear Formatting"
            disabled={disabled}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={saveContent}
            className="h-8 w-8 p-0"
            title="Save Backup"
            disabled={disabled}
          >
            <Save className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={restoreContent}
            className="h-8 w-8 p-0"
            title="Restore Backup"
            disabled={disabled}
          >
            <FileText className="h-4 w-4" />
          </Button>

          <div className="w-px bg-border mx-1" />

          {/* View Controls */}
          {showPreview && (
            <>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowPreviewMode(true)}
                className="h-8 w-8 p-0"
                title="Preview"
                disabled={disabled}
              >
                <Eye className="h-4 w-4" />
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowSourceCode(true)}
                className="h-8 w-8 p-0"
                title="Source Code"
                disabled={disabled}
              >
                <Code2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable={!disabled}
        className={cn(
          "min-h-[400px] p-4 focus:outline-none bg-background",
          "rich-text-content",
          disabled && "opacity-50 cursor-not-allowed",
        )}
        onInput={handleContentChange}
        onKeyUp={updateActiveStates}
        onMouseUp={updateActiveStates}
        onFocus={() => updateActiveStates()}
        suppressContentEditableWarning={true}
        data-placeholder={placeholder}
        style={{
          minHeight: "400px",
        }}
      />

      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: hsl(var(--muted-foreground));
          pointer-events: none;
          font-style: italic;
        }
      `}</style>
    </div>
  )
}
