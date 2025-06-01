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
  saved?: boolean
}

type Category = {
  id: string
  title: string
  description: string
  icon: any
  articles: Article[]
}

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

// 6 main categories with their articles
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
      {
        id: "1-4",
        title: "Conflict Resolution in Government Settings",
        description: "Strategies for managing disputes and building consensus",
        readTime: "8 min read",
        district: "Jalandhar",
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
      {
        id: "2-4",
        title: "Data-Driven Decision Making",
        description: "Using analytics to improve government performance",
        readTime: "13 min read",
        district: "Patiala",
        department: "Information Technology",
        subThemes: ["Management", "Technology"],
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
      {
        id: "3-4",
        title: "Automation in Government Operations",
        description: "Implementing automated solutions for routine tasks",
        readTime: "11 min read",
        district: "Ludhiana",
        department: "Information Technology",
        subThemes: ["Technology", "Management"],
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
      {
        id: "4-4",
        title: "Workload Balancing Strategies",
        description: "Techniques for managing competing priorities and deadlines",
        readTime: "9 min read",
        district: "Amritsar",
        department: "Personnel",
        subThemes: ["Management", "Leadership"],
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
      {
        id: "5-4",
        title: "Emergency Response Coordination",
        description: "Managing multi-agency responses to public emergencies",
        readTime: "12 min read",
        district: "Patiala",
        department: "Governance Reforms",
        subThemes: ["Management", "Governance"],
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
      {
        id: "6-4",
        title: "Public Participation in Policy Making",
        description: "Engaging citizens in government decision-making processes",
        readTime: "14 min read",
        district: "Mohali",
        department: "Governance Reforms",
        subThemes: ["Governance", "Policy"],
      },
    ],
  },
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

function CategoryCard({ category, onClick }) {
  const Icon = category.icon

  return (
    <div
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 overflow-hidden cursor-pointer h-full"
      onClick={onClick}
    >
      <div className="p-6 flex flex-col h-full">
        <div className="flex items-start gap-3 mb-4">
          <div className="p-3 bg-primary-50 rounded-lg shrink-0">
            <Icon className="h-6 w-6 text-primary-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-900 mb-2">{category.title}</h3>
            <p className="text-gray-600 text-sm">{category.description}</p>
          </div>
        </div>

        <div className="mt-auto">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>{category.articles.length} resources</span>
            <span className="text-primary-600 font-medium">View Resources →</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function ArticleCard({ article, onSave, onView }) {
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h4 className="font-semibold text-lg text-gray-900 flex-1 pr-4">{article.title}</h4>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onSave(article.id)
            }}
            className={`p-2 rounded-full transition-colors ${
              article.saved ? "bg-primary-100 text-primary-600" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            <Bookmark className="h-4 w-4" />
          </button>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{article.description}</p>

        {article.subThemes && article.subThemes.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {article.subThemes.slice(0, 2).map((theme, index) => (
              <Badge key={`${theme}-${index}`} variant="secondary">
                {theme}
              </Badge>
            ))}
            {article.subThemes.length > 2 && <Badge variant="default">+{article.subThemes.length - 2} more</Badge>}
          </div>
        )}

        <div className="flex flex-wrap items-center text-xs text-gray-500 gap-x-4 gap-y-2 mb-4">
          <div className="flex items-center">
            <Clock className="h-3.5 w-3.5 mr-1" />
            {article.readTime}
          </div>

          {article.district && (
            <div className="flex items-center">
              <Tag className="h-3.5 w-3.5 mr-1" />
              {article.district}
            </div>
          )}

          {article.department && (
            <div className="flex items-center">
              <Tag className="h-3.5 w-3.5 mr-1" />
              {article.department}
            </div>
          )}
        </div>

        <Button variant="primary" size="sm" onClick={() => onView(article)} className="w-full">
          Read Article
        </Button>
      </div>
    </div>
  )
}

function ArticleDetail({ article, onBack }) {
  const content = expandedArticles[article.id]

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6">
        <button onClick={onBack} className="flex items-center text-primary-600 hover:text-primary-700 mb-6 font-medium">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to resources
        </button>

        <h1 className="font-bold text-2xl text-gray-900 mb-4">{article.title}</h1>

        <div className="flex flex-wrap items-center text-sm text-gray-500 gap-x-4 gap-y-2 mb-6">
          {content?.publishDate && (
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {content.publishDate}
            </div>
          )}

          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {article.readTime}
          </div>

          {article.district && (
            <div className="flex items-center">
              <Tag className="h-4 w-4 mr-1" />
              {article.district}
            </div>
          )}

          {article.department && (
            <div className="flex items-center">
              <Tag className="h-4 w-4 mr-1" />
              {article.department}
            </div>
          )}
        </div>

        {article.subThemes && article.subThemes.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {article.subThemes.map((theme, index) => (
              <Badge key={`${theme}-${index}`} variant="secondary">
                {theme}
              </Badge>
            ))}
          </div>
        )}

        <div className="prose max-w-none">
          <div dangerouslySetInnerHTML={{ __html: content?.fullContent || "<p>Content not available.</p>" }} />
        </div>
      </div>
    </div>
  )
}

export function ResourceHub() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedArticle, setSelectedArticle] = useState(null)
  const [savedArticles, setSavedArticles] = useState(new Set())

  const [selectedFilters, setSelectedFilters] = useState({
    districts: [] as string[],
    departments: [] as string[],
    subThemes: [] as string[],
  })

  const activeFilterCount =
    selectedFilters.districts.length + selectedFilters.departments.length + selectedFilters.subThemes.length

  const handleFilterChange = (filterType: "districts" | "departments" | "subThemes", value: string) => {
    setSelectedFilters((prev) => {
      const currentValues = [...prev[filterType]]
      const index = currentValues.indexOf(value)

      if (index === -1) {
        return {
          ...prev,
          [filterType]: [...currentValues, value],
        }
      } else {
        currentValues.splice(index, 1)
        return {
          ...prev,
          [filterType]: currentValues,
        }
      }
    })
  }

  const clearFilters = () => {
    setSelectedFilters({
      districts: [],
      departments: [],
      subThemes: [],
    })
  }

  const handleSaveArticle = (articleId: string) => {
    setSavedArticles((prev) => {
      const newSaved = new Set(prev)
      if (newSaved.has(articleId)) {
        newSaved.delete(articleId)
      } else {
        newSaved.add(articleId)
      }

      // Save to localStorage
      localStorage.setItem("savedArticles", JSON.stringify(Array.from(newSaved)))

      return newSaved
    })
  }

  // Load saved articles from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("savedArticles")
    if (saved) {
      setSavedArticles(new Set(JSON.parse(saved)))
    }
  }, [])

  const filterArticles = (articles: Article[]) => {
    return articles.filter((article) => {
      // Search filter
      const matchesSearch =
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.subThemes?.some((theme) => theme.toLowerCase().includes(searchQuery.toLowerCase()))

      if (!matchesSearch) return false

      // If no filters selected, show all
      if (activeFilterCount === 0) return true

      // Apply filters
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
  }

  const filteredCategories = categories
    .map((category) => ({
      ...category,
      articles: filterArticles(category.articles),
    }))
    .filter((category) => category.articles.length > 0)

  return (
    <div className="space-y-8 pb-24">
      <div className="text-center px-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Resource Hub</h1>
        <p className="mt-2 text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
          Access curated resources and best practices to enhance your management skills
        </p>
      </div>

      {/* Search and Filter */}
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

      <FilterMenu
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        selectedFilters={selectedFilters}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
      />

      {/* Main Content */}
      <div className="px-4">
        {selectedArticle ? (
          <ArticleDetail article={selectedArticle} onBack={() => setSelectedArticle(null)} />
        ) : selectedCategory ? (
          <div>
            <button
              onClick={() => setSelectedCategory(null)}
              className="mb-6 text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to categories
            </button>

            <div className="mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{selectedCategory.title}</h2>
              <p className="mt-2 text-gray-600 text-sm sm:text-base">{selectedCategory.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filterArticles(selectedCategory.articles).map((article) => (
                <ArticleCard
                  key={article.id}
                  article={{
                    ...article,
                    saved: savedArticles.has(article.id),
                  }}
                  onSave={handleSaveArticle}
                  onView={setSelectedArticle}
                />
              ))}
            </div>
          </div>
        ) : (
          <div>
            {filteredCategories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCategories.map((category) => (
                  <CategoryCard key={category.id} category={category} onClick={() => setSelectedCategory(category)} />
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
