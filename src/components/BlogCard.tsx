"use client"
import { Calendar, User, Clock, Tag } from "lucide-react"
import { Badge } from "./ui/Badge"

interface BlogCardProps {
  id: string
  title: string
  excerpt: string
  author: string
  date: string
  readTime: string
  tags: string[]
  district?: string
  department?: string
  onClick: () => void
}

export function BlogCard({
  id,
  title,
  excerpt,
  author,
  date,
  readTime,
  tags,
  district,
  department,
  onClick,
}: BlogCardProps) {
  return (
    <div
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 overflow-hidden cursor-pointer"
      onClick={onClick}
    >
      <div className="p-6">
        <h3 className="font-semibold text-lg text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{excerpt}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex flex-wrap items-center text-xs text-gray-500 gap-x-4 gap-y-2">
          <div className="flex items-center">
            <User className="h-3.5 w-3.5 mr-1" />
            {author}
          </div>
          <div className="flex items-center">
            <Calendar className="h-3.5 w-3.5 mr-1" />
            {date}
          </div>
          <div className="flex items-center">
            <Clock className="h-3.5 w-3.5 mr-1" />
            {readTime}
          </div>

          {district && (
            <div className="flex items-center">
              <Tag className="h-3.5 w-3.5 mr-1" />
              {district}
            </div>
          )}

          {department && (
            <div className="flex items-center">
              <Tag className="h-3.5 w-3.5 mr-1" />
              {department}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
