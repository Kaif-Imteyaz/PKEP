"use client"

import { useState, useEffect, useRef } from "react"
import {
  Users,
  Workflow,
  ListTodo,
  Target,
  Shield,
  Users2,
  Search,
  Filter,
  X,
  ChevronDown,
  ArrowLeft,
  Download,
  Share2,
  Bookmark,
  Tag,
  Calendar,
  Clock,
} from "lucide-react"
import { punjabDistricts, punjabDepartments, expandedArticles } from "../lib/punjab-data"

type Article = {
  id: string
  title: string
  description: string
  readTime: string
  district?: string
  department?: string
  subThemes?: string[]
}

type Category = {
  id: string
  title: string
  description: string
  icon: any
  articles: Article[]
}

type Blog = {
  id: string
  title: string
  content: string
  excerpt: string
  date: string
  readTime: string
  tags: string[]
  district?: string
  department?: string
  subThemes?: string[]
}

// Sample blogs data
const blogs: Blog[] = [
  {
    id: "blog-1",
    title: "Improving Citizen Services in Rural Punjab",
    excerpt:
      "Strategies for enhancing service delivery in rural areas through technology adoption and process optimization.",
    content: `<h2>Improving Citizen Services in Rural Punjab</h2>
      <p>Rural areas in Punjab face unique challenges in service delivery. This article explores effective strategies that have been implemented across various districts.</p>
      <p>Key approaches include:</p>
      <ul>
        <li>Mobile service delivery units</li>
        <li>Digital kiosks in village centers</li>
        <li>Training local representatives as service facilitators</li>
        <li>Simplified application processes for common services</li>
      </ul>
      <p>Case studies from Moga, Bathinda, and Faridkot demonstrate significant improvements in citizen satisfaction and service efficiency.</p>`,
    date: "April 15, 2025",
    readTime: "8 min read",
    tags: ["Rural Development", "Technology", "Service Delivery"],
    district: "Bathinda",
    department: "Rural Development & Panchayats",
    subThemes: ["Technology", "Governance"],
  },
  {
    id: "blog-2",
    title: "Digital Transformation in Revenue Department",
    excerpt:
      "How the Revenue Department in Ludhiana implemented digital solutions to streamline land record management.",
    content: `<h2>Digital Transformation in Revenue Department</h2>
      <p>The Revenue Department in Ludhiana has undergone a significant digital transformation over the past two years. This case study examines the implementation process and outcomes.</p>
      <p>The transformation included:</p>
      <ul>
        <li>Digitization of historical land records</li>
        <li>Implementation of blockchain for property transactions</li>
        <li>Mobile applications for field officers</li>
        <li>Integrated dashboard for monitoring service delivery</li>
      </ul>
      <p>Results show a 60% reduction in processing time and 40% increase in revenue collection efficiency.</p>`,
    date: "March 28, 2025",
    readTime: "12 min read",
    tags: ["Digital Transformation", "Land Records", "Process Optimization"],
    district: "Ludhiana",
    department: "Revenue",
    subThemes: ["Technology", "Management"],
  },
  {
    id: "blog-3",
    title: "Collaborative Governance Model in Amritsar",
    excerpt: "A case study on inter-departmental collaboration for integrated urban development in Amritsar.",
    content: `<h2>Collaborative Governance Model in Amritsar</h2>
      <p>Amritsar has pioneered a collaborative governance model that brings together multiple departments for integrated urban development. This article details the framework and implementation.</p>
      <p>The model features:</p>
      <ul>
        <li>Joint planning committees with representatives from all key departments</li>
        <li>Shared digital platforms for project management</li>
        <li>Unified citizen interface for all government services</li>
        <li>Regular coordination meetings with defined accountability</li>
      </ul>
      <p>The approach has resulted in faster project completion, reduced redundancies, and improved citizen satisfaction.</p>`,
    date: "February 10, 2025",
    readTime: "15 min read",
    tags: ["Urban Development", "Collaboration", "Governance"],
    district: "Amritsar",
    department: "Local Government",
    subThemes: ["Governance", "Management"],
  },
  {
    id: "blog-4",
    title: "Agricultural Innovation in Patiala",
    excerpt:
      "How the Agriculture Department in Patiala is promoting sustainable farming practices through technology and education.",
    content: `<h2>Agricultural Innovation in Patiala</h2>
      <p>The Agriculture Department in Patiala has implemented several innovative programs to promote sustainable farming. This article explores the initiatives and their impact.</p>
      <p>Key programs include:</p>
      <ul>
        <li>Farmer education centers with demonstration plots</li>
        <li>Mobile soil testing laboratories</li>
        <li>Weather prediction and crop advisory services</li>
        <li>Direct market linkages for organic produce</li>
      </ul>
      <p>Early results show increased adoption of sustainable practices and improved farm incomes.</p>`,
    date: "January 22, 2025",
    readTime: "10 min read",
    tags: ["Agriculture", "Sustainability", "Innovation"],
    district: "Patiala",
    department: "Agriculture",
    subThemes: ["Agriculture", "Technology"],
  },
  {
    id: "blog-5",
    title: "Education Reform in Jalandhar",
    excerpt: "A comprehensive approach to improving educational outcomes in government schools in Jalandhar district.",
    content: `<h2>Education Reform in Jalandhar</h2>
      <p>Jalandhar district has implemented a comprehensive education reform program that has shown promising results. This article details the approach and outcomes.</p>
      <p>The reform includes:</p>
      <ul>
        <li>Teacher training and professional development programs</li>
        <li>Technology integration in classrooms</li>
        <li>Community engagement initiatives</li>
        <li>Data-driven performance monitoring</li>
      </ul>
      <p>Student attendance has increased by 25% and learning outcomes have improved across all grade levels.</p>`,
    date: "December 5, 2024",
    readTime: "14 min read",
    tags: ["Education", "Reform", "Community Engagement"],
    district: "Jalandhar",
    department: "Education",
    subThemes: ["Education", "Management"],
  },
]

// Enhanced categories with district, department, and subTheme tags
const categories: Category[] = [
  {
    id: "1",
    title: "Leadership and Team Development",
    description: "Build strong teams and develop leadership skills",
    icon: Users,
    articles: [
      {
        id: "1-1",
        title: "Building High-Performance Teams in Public Service",
        description: "Learn proven strategies for developing and leading effective government teams",
        readTime: "12 min read",
        district: "Amritsar",
        department: "Personnel",
        subThemes: ["Leadership", "Management"],
      },
      {
        id: "1-2",
        title: "Emotional Intelligence in Public Administration",
        description: "Understanding and applying EQ principles in government leadership",
        readTime: "15 min read",
        district: "Ludhiana",
        department: "Governance Reforms",
        subThemes: ["Leadership", "Management"],
      },
      {
        id: "1-3",
        title: "Motivating Public Sector Teams",
        description: "Techniques for inspiring and engaging government employees",
        readTime: "10 min read",
        district: "Patiala",
        department: "Personnel",
        subThemes: ["Leadership", "Management"],
      },
    ],
  },
  {
    id: "2",
    title: "Performance Management and Goal Setting",
    description: "Set and achieve organizational goals effectively",
    icon: Target,
    articles: [
      {
        id: "2-1",
        title: "SMART Goals in Public Administration",
        description: "Framework for setting measurable and achievable departmental objectives",
        readTime: "8 min read",
        district: "Jalandhar",
        department: "Governance Reforms",
        subThemes: ["Management", "Policy"],
      },
      {
        id: "2-2",
        title: "KPI Development for Government Services",
        description: "Creating meaningful performance indicators for public service delivery",
        readTime: "14 min read",
        district: "Mohali",
        department: "Personnel",
        subThemes: ["Management", "Policy"],
      },
      {
        id: "2-3",
        title: "Performance Review Best Practices",
        description: "Conducting effective performance evaluations in government settings",
        readTime: "11 min read",
        district: "Bathinda",
        department: "Personnel",
        subThemes: ["Management", "Leadership"],
      },
    ],
  },
  {
    id: "3",
    title: "Process Optimization and Workflow Management",
    description: "Streamline workflows and improve efficiency",
    icon: Workflow,
    articles: [
      {
        id: "3-1",
        title: "Lean Management in Government",
        description: "Applying lean principles to optimize public service delivery",
        readTime: "13 min read",
        district: "Ludhiana",
        department: "Governance Reforms",
        subThemes: ["Management", "Policy"],
      },
      {
        id: "3-2",
        title: "Digital Transformation of Government Processes",
        description: "Modernizing workflows through technology adoption",
        readTime: "16 min read",
        district: "Mohali",
        department: "Information Technology",
        subThemes: ["Technology", "Management"],
      },
      {
        id: "3-3",
        title: "Process Mapping for Public Services",
        description: "Techniques for analyzing and improving service delivery workflows",
        readTime: "9 min read",
        district: "Amritsar",
        department: "Governance Reforms",
        subThemes: ["Management", "Policy"],
      },
    ],
  },
  {
    id: "4",
    title: "Task Delegation and Prioritization",
    description: "Manage workload and delegate effectively",
    icon: ListTodo,
    articles: [
      {
        id: "4-1",
        title: "Effective Delegation in Public Administration",
        description: "Strategies for distributing work while maintaining accountability",
        readTime: "10 min read",
        district: "Patiala",
        department: "Personnel",
        subThemes: ["Management", "Leadership"],
      },
      {
        id: "4-2",
        title: "Time Management for Government Officers",
        description: "Prioritization techniques for handling multiple responsibilities",
        readTime: "12 min read",
        district: "Jalandhar",
        department: "Personnel",
        subThemes: ["Management", "Leadership"],
      },
      {
        id: "4-3",
        title: "Managing Cross-Departmental Projects",
        description: "Coordinating tasks across different government agencies",
        readTime: "15 min read",
        district: "Bathinda",
        department: "Governance Reforms",
        subThemes: ["Management", "Governance"],
      },
    ],
  },
  {
    id: "5",
    title: "Risk and Crisis Management",
    description: "Identify and mitigate organizational risks",
    icon: Shield,
    articles: [
      {
        id: "5-1",
        title: "Public Sector Risk Assessment Framework",
        description: "Comprehensive approach to identifying and managing government risks",
        readTime: "14 min read",
        district: "Mohali",
        department: "Finance",
        subThemes: ["Management", "Governance"],
      },
      {
        id: "5-2",
        title: "Crisis Communication in Government",
        description: "Effective communication strategies during public emergencies",
        readTime: "11 min read",
        district: "Amritsar",
        department: "Information Technology",
        subThemes: ["Management", "Governance"],
      },
      {
        id: "5-3",
        title: "Business Continuity Planning",
        description: "Ensuring continuous public service delivery during disruptions",
        readTime: "13 min read",
        district: "Ludhiana",
        department: "Governance Reforms",
        subThemes: ["Management", "Policy"],
      },
    ],
  },
  {
    id: "6",
    title: "Citizen Engagement",
    description: "Improve public service delivery and citizen satisfaction",
    icon: Users2,
    articles: [
      {
        id: "6-1",
        title: "Digital Citizen Engagement Strategies",
        description: "Leveraging technology for better citizen interaction",
        readTime: "12 min read",
        district: "Jalandhar",
        department: "Information Technology",
        subThemes: ["Technology", "Governance"],
      },
      {
        id: "6-2",
        title: "Citizen Feedback Systems",
        description: "Implementing effective feedback mechanisms for public services",
        readTime: "9 min read",
        district: "Patiala",
        department: "Governance Reforms",
        subThemes: ["Technology", "Management"],
      },
      {
        id: "6-3",
        title: "Community Outreach Programs",
        description: "Building strong relationships with local communities",
        readTime: "11 min read",
        district: "Bathinda",
        department: "Rural Development & Panchayats",
        subThemes: ["Social Welfare", "Governance"],
      },
    ],
  },
]

// Define the subthemes
const subThemes = [
  "Leadership",
  "Management",
  "Technology",
  "Policy",
  "Finance",
  "Healthcare",
  "Education",
  "Agriculture",
  "Infrastructure",
  "Environment",
  "Social Welfare",
  "Governance",
]

// Custom Badge component
function Badge({ children, variant = "default", className = "" }) {
  const variantClasses = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-primary-100 text-primary-800",
    secondary: "bg-purple-100 text-purple-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    danger: "bg-red-100 text-red-800",
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  )
}

// Custom Button component
function Button({
  children,
  variant = "default",
  size = "md",
  onClick,
  className = "",
  icon,
  iconPosition = "left",
  disabled = false,
}) {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none"

  const variantClasses = {
    default: "bg-gray-100 text-gray-800 hover:bg-gray-200",
    primary: "bg-primary-600 text-white hover:bg-primary-700",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
    secondary: "bg-purple-600 text-white hover:bg-purple-700",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-700",
    link: "bg-transparent text-primary-600 hover:text-primary-700 hover:underline p-0",
  }

  const sizeClasses = {
    sm: "text-sm px-3 py-1.5",
    md: "text-sm px-4 py-2",
    lg: "text-base px-5 py-2.5",
  }

  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && iconPosition === "left" && <span className="mr-2">{icon}</span>}
      {children}
      {icon && iconPosition === "right" && <span className="ml-2">{icon}</span>}
    </button>
  )
}

// Dropdown component
function Dropdown({ label, options, selectedValues, onChange }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const toggleDropdown = () => setIsOpen(!isOpen)

  const handleOptionClick = (option) => {
    onChange(option)
  }

  const selectedCount = selectedValues.length

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none"
      >
        <span className="flex items-center">
          {label}
          {selectedCount > 0 && (
            <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-medium rounded-full bg-primary-100 text-primary-800">
              {selectedCount}
            </span>
          )}
        </span>
        <ChevronDown className="w-4 h-4 ml-2" />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          <div className="p-2">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => {
                // Filter options based on search input
                // This would need to be implemented with state management
              }}
            />
          </div>
          <ul className="py-1">
            {options.map((option) => (
              <li key={option}>
                <label className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedValues.includes(option)}
                    onChange={() => handleOptionClick(option)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded cursor-pointer mr-2"
                  />
                  {option}
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// FilterMenu component
function FilterMenu({ isOpen, onClose, selectedFilters, onFilterChange, onClearFilters }) {
  return (
    <>
      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose}></div>}

      {/* Filter menu */}
      <div
        className={`fixed right-0 top-0 h-full w-80 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } overflow-y-auto`}
      >
        <div className="p-4 border-b sticky top-0 bg-white z-10 flex items-center justify-between">
          <h3 className="font-semibold text-lg flex items-center">
            <Filter className="h-5 w-5 mr-2 text-primary-600" />
            Filters
          </h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* District filter */}
          <div>
            <h4 className="font-medium mb-2 text-gray-900">District</h4>
            <Dropdown
              label="Select Districts"
              options={punjabDistricts}
              selectedValues={selectedFilters.districts}
              onChange={(district) => onFilterChange("districts", district)}
            />
          </div>

          {/* Department filter */}
          <div>
            <h4 className="font-medium mb-2 text-gray-900">Department</h4>
            <Dropdown
              label="Select Departments"
              options={punjabDepartments}
              selectedValues={selectedFilters.departments}
              onChange={(department) => onFilterChange("departments", department)}
            />
          </div>

          {/* Sub-theme filter */}
          <div>
            <h4 className="font-medium mb-2 text-gray-900">Sub Theme</h4>
            <Dropdown
              label="Select Sub Themes"
              options={subThemes}
              selectedValues={selectedFilters.subThemes}
              onChange={(theme) => onFilterChange("subThemes", theme)}
            />
          </div>

          {/* Clear filters button */}
          <Button variant="outline" onClick={onClearFilters} className="w-full mt-4">
            Clear All Filters
          </Button>
        </div>
      </div>
    </>
  )
}

// ResourceCard component for unified display of resources
function ResourceCard({ resource, onClick }) {
  // Determine if it's a blog or category article
  const isBlog = "excerpt" in resource

  // Get appropriate data based on resource type
  const title = resource.title
  const description = isBlog ? resource.excerpt : resource.description
  const tags = isBlog ? resource.tags : resource.subThemes || []
  const district = resource.district
  const department = resource.department
  const readTime = resource.readTime
  const date = isBlog ? resource.date : null

  // Get icon for category
  const Icon = !isBlog && resource.icon ? resource.icon : null

  return (
    <div
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 overflow-hidden cursor-pointer h-full"
      onClick={onClick}
    >
      <div className="p-6 flex flex-col h-full">
        {/* Title with optional icon */}
        <div className="flex items-start gap-3 mb-2">
          {Icon && (
            <div className="p-2 bg-primary-50 rounded-lg shrink-0">
              <Icon className="h-5 w-5 text-primary-600" />
            </div>
          )}
          <h3 className="font-semibold text-lg text-gray-900">{title}</h3>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">{description}</p>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag, index) => (
              <Badge key={`${tag}-${index}`} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Metadata */}
        <div className="flex flex-wrap items-center text-xs text-gray-500 gap-x-4 gap-y-2 mt-auto">
          {date && (
            <div className="flex items-center">
              <Calendar className="h-3.5 w-3.5 mr-1" />
              {date}
            </div>
          )}

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

// ResourceDetail component
function ResourceDetail({ resource, onBack }) {
  // Determine if it's a blog or an article from a category
  const isBlog = "content" in resource

  const title = resource.title
  const content = isBlog ? resource.content : resource.fullContent
  const tags = isBlog ? resource.tags : resource.subThemes || []
  const district = resource.district
  const department = resource.department
  const date = isBlog ? resource.date : resource.publishDate
  const readTime = resource.readTime

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6">
        <button onClick={onBack} className="flex items-center text-primary-600 hover:text-primary-700 mb-6 font-medium">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to resources
        </button>

        <h1 className="font-bold text-2xl text-gray-900 mb-4">{title}</h1>

        <div className="flex flex-wrap items-center text-sm text-gray-500 gap-x-4 gap-y-2 mb-6">
          {date && (
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {date}
            </div>
          )}

          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {readTime}
          </div>

          {district && (
            <div className="flex items-center">
              <Tag className="h-4 w-4 mr-1" />
              {district}
            </div>
          )}

          {department && (
            <div className="flex items-center">
              <Tag className="h-4 w-4 mr-1" />
              {department}
            </div>
          )}
        </div>

        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {tags.map((tag, index) => (
              <Badge key={`${tag}-${index}`} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}

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
          <div dangerouslySetInnerHTML={{ __html: content || "" }} />
        </div>
      </div>
    </div>
  )
}

export function ResourceHub() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [selectedResource, setSelectedResource] = useState(null)
  const [selectedResourceType, setSelectedResourceType] = useState(null) // "blog", "article", or "category"

  // Filter state
  const [selectedFilters, setSelectedFilters] = useState({
    districts: [] as string[],
    departments: [] as string[],
    subThemes: [] as string[],
  })

  // Count active filters
  const activeFilterCount =
    selectedFilters.districts.length + selectedFilters.departments.length + selectedFilters.subThemes.length

  // Handle filter changes
  const handleFilterChange = (filterType: "districts" | "departments" | "subThemes", value: string) => {
    setSelectedFilters((prev) => {
      const currentValues = [...prev[filterType]]
      const index = currentValues.indexOf(value)

      if (index === -1) {
        // Add the value if it doesn't exist
        return {
          ...prev,
          [filterType]: [...currentValues, value],
        }
      } else {
        // Remove the value if it exists
        currentValues.splice(index, 1)
        return {
          ...prev,
          [filterType]: currentValues,
        }
      }
    })
  }

  // Clear all filters
  const clearFilters = () => {
    setSelectedFilters({
      districts: [],
      departments: [],
      subThemes: [],
    })
  }

  // Prepare all resources for unified display
  const allResources = [
    // Add blogs
    ...blogs.map((blog) => ({
      ...blog,
      type: "blog",
    })),

    // Add categories
    ...categories.map((category) => ({
      ...category,
      type: "category",
    })),

    // Add articles from categories
    ...categories.flatMap((category) =>
      category.articles.map((article) => ({
        ...article,
        type: "article",
        categoryId: category.id,
        categoryTitle: category.title,
      })),
    ),
  ]

  // Filter resources based on search and filters
  const filteredResources = allResources.filter((resource) => {
    // First filter by search query
    let matchesSearch = false

    if (resource.title?.toLowerCase().includes(searchQuery.toLowerCase())) {
      matchesSearch = true
    } else if (resource.description?.toLowerCase().includes(searchQuery.toLowerCase())) {
      matchesSearch = true
    } else if (resource.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())) {
      matchesSearch = true
    } else if (resource.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))) {
      matchesSearch = true
    } else if (resource.subThemes?.some((theme) => theme.toLowerCase().includes(searchQuery.toLowerCase()))) {
      matchesSearch = true
    }

    if (!matchesSearch) return false

    // If no filters are selected, show all resources
    if (activeFilterCount === 0) return true

    // Check if resource matches the selected filters
    const matchesDistrict =
      selectedFilters.districts.length === 0 ||
      (resource.district && selectedFilters.districts.includes(resource.district))

    const matchesDepartment =
      selectedFilters.departments.length === 0 ||
      (resource.department && selectedFilters.departments.includes(resource.department))

    const matchesSubTheme =
      selectedFilters.subThemes.length === 0 ||
      (resource.subThemes && resource.subThemes.some((theme) => selectedFilters.subThemes.includes(theme)))

    return matchesDistrict && matchesDepartment && matchesSubTheme
  })

  // Handle resource selection
  const handleResourceClick = (resource) => {
    setSelectedResource(resource)
    setSelectedResourceType(resource.type)
  }

  // Get article content from expanded articles data
  const getArticleContent = (articleId) => {
    return expandedArticles[articleId]
  }

  // Reset resource selection
  const handleBackClick = () => {
    setSelectedResource(null)
    setSelectedResourceType(null)
  }

  // Handle category selection to show its articles
  const handleCategoryClick = (category) => {
    setSelectedResource(category)
    setSelectedResourceType("category")
  }

  return (
    <div className="space-y-8 pb-24">
      <div className="text-center px-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Resource Hub</h1>
        <p className="mt-2 text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
          Access curated resources and best practices to enhance your management skills
        </p>
      </div>

      {/* Search bar with filter button */}
      <div className="flex items-center justify-between gap-4 px-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <button
          onClick={() => setIsFilterOpen(true)}
          className="p-2 rounded-md bg-white border border-gray-300 hover:bg-gray-50 relative"
        >
          <Filter className="h-5 w-5 text-gray-500" />
          {activeFilterCount > 0 && (
            <span className="absolute -top-2 -right-2 inline-flex items-center justify-center w-5 h-5 text-xs font-medium rounded-full bg-primary-600 text-white">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Filter menu */}
      <FilterMenu
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        selectedFilters={selectedFilters}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
      />

      {/* Main content */}
      <div className="px-4">
        {selectedResourceType === "blog" ? (
          // Blog detail view
          <ResourceDetail resource={selectedResource} onBack={handleBackClick} />
        ) : selectedResourceType === "article" ? (
          // Article detail view
          <ResourceDetail
            resource={{
              ...selectedResource,
              ...getArticleContent(selectedResource.id),
            }}
            onBack={handleBackClick}
          />
        ) : selectedResourceType === "category" ? (
          // Category detail view with its articles
          <div>
            <button
              onClick={handleBackClick}
              className="mb-6 text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to resources
            </button>

            <div className="mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{selectedResource.title}</h2>
              <p className="mt-2 text-gray-600 text-sm sm:text-base">{selectedResource.description}</p>
            </div>

            {/* Articles in this category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {selectedResource.articles
                .filter((article) => {
                  // Apply filters to articles
                  const matchesDistrict =
                    selectedFilters.districts.length === 0 ||
                    (article.district && selectedFilters.districts.includes(article.district))

                  const matchesDepartment =
                    selectedFilters.departments.length === 0 ||
                    (article.department && selectedFilters.departments.includes(article.department))

                  const matchesSubTheme =
                    selectedFilters.subThemes.length === 0 ||
                    (article.subThemes && article.subThemes.some((theme) => selectedFilters.subThemes.includes(theme)))

                  return matchesDistrict && matchesDepartment && matchesSubTheme
                })
                .map((article) => (
                  <ResourceCard
                    key={article.id}
                    resource={{
                      ...article,
                      type: "article",
                    }}
                    onClick={() =>
                      handleResourceClick({
                        ...article,
                        type: "article",
                      })
                    }
                  />
                ))}
            </div>
          </div>
        ) : (
          // Resources grid view
          <div>
            {filteredResources.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources.map((resource, index) => (
                  <ResourceCard
                    key={`${resource.type}-${resource.id}-${index}`}
                    resource={resource}
                    onClick={() => {
                      if (resource.type === "category") {
                        handleCategoryClick(resource)
                      } else {
                        handleResourceClick(resource)
                      }
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No resources match your search or filters.</p>
                <div className="flex justify-center gap-4 mt-4">
                  {searchQuery && (
                    <Button variant="outline" onClick={() => setSearchQuery("")}>
                      Clear Search
                    </Button>
                  )}
                  {activeFilterCount > 0 && (
                    <Button variant="outline" onClick={clearFilters}>
                      Clear Filters
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
