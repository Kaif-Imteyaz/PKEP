"use client"
import { ArrowLeft, Calendar, User, Clock, Tag, Download, Share2, Bookmark } from "lucide-react"
import { Badge } from "./ui/Badge"
import { Button } from "./ui/Button"

interface BlogDetailProps {
  blog: {
    id: string
    title: string
    content: string
    author: string
    date: string
    readTime: string
    tags: string[]
    district?: string
    department?: string
  }
  onBack: () => void
}

export function BlogDetail({ blog, onBack }: BlogDetailProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6">
        <button onClick={onBack} className="flex items-center text-primary-600 hover:text-primary-700 mb-6 font-medium">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to resources
        </button>

        <h1 className="font-bold text-2xl text-gray-900 mb-4">{blog.title}</h1>

        <div className="flex flex-wrap items-center text-sm text-gray-500 gap-x-4 gap-y-2 mb-6">
          <div className="flex items-center">
            <User className="h-4 w-4 mr-1" />
            {blog.author}
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {blog.date}
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {blog.readTime}
          </div>

          {blog.district && (
            <div className="flex items-center">
              <Tag className="h-4 w-4 mr-1" />
              {blog.district}
            </div>
          )}

          {blog.department && (
            <div className="flex items-center">
              <Tag className="h-4 w-4 mr-1" />
              {blog.department}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {blog.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex space-x-2 mb-8">
          <Button variant="outline" size="sm" icon={<Download className="h-4 w-4" />}>
            Download
          </Button>
          <Button variant="outline" size="sm" icon={<Share2 className="h-4 w-4" />}>
            Share
          </Button>
          <Button variant="outline" size="sm" icon={<Bookmark className="h-4 w-4" />}>
            Save
          </Button>
        </div>

        <div className="prose max-w-none">
          {/* Render content as HTML - in a real app, use a proper markdown/HTML renderer */}
          <div dangerouslySetInnerHTML={{ __html: blog.content }} />
        </div>
      </div>
    </div>
  )
}
