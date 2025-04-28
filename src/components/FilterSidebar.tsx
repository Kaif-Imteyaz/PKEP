"use client"
import { ChevronLeft, ChevronRight, Filter, X } from "lucide-react"
import { Checkbox } from "./ui/Checkbox"
import { Button } from "./ui/Button"
import { Badge } from "./ui/Badge"
import { punjabDistricts, punjabDepartments } from "../lib/punjab-data"

interface FilterSidebarProps {
  isOpen: boolean
  toggleSidebar: () => void
  filters: {
    districts: string[]
    departments: string[]
    subThemes: string[]
  }
  selectedFilters: {
    districts: string[]
    departments: string[]
    subThemes: string[]
  }
  onFilterChange: (filterType: "districts" | "departments" | "subThemes", value: string) => void
  onClearFilters: () => void
  activeFilterCount: number
}

export function FilterSidebar({
  isOpen,
  toggleSidebar,
  filters,
  selectedFilters,
  onFilterChange,
  onClearFilters,
  activeFilterCount,
}: FilterSidebarProps) {
  // Define sub-themes for resources
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

  return (
    <>
      {/* Mobile filter button */}
      <div className="lg:hidden flex items-center mb-4">
        <Button
          variant="outline"
          onClick={toggleSidebar}
          icon={<Filter className="h-4 w-4" />}
          className="flex items-center"
        >
          Filters
          {activeFilterCount > 0 && (
            <Badge variant="primary" className="ml-2">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Filter sidebar - mobile overlay when open */}
      {isOpen && <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={toggleSidebar}></div>}

      {/* Sidebar container */}
      <div
        className={`
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} 
          fixed lg:sticky top-0 lg:top-20 left-0 h-full lg:h-[calc(100vh-5rem)] 
          w-80 bg-white shadow-lg lg:shadow-none z-50 lg:z-30 
          transform transition-transform duration-300 ease-in-out
          overflow-y-auto
        `}
      >
        <div className="p-4 border-b sticky top-0 bg-white z-10 flex items-center justify-between">
          <h3 className="font-semibold text-lg flex items-center">
            <Filter className="h-5 w-5 mr-2 text-primary-600" />
            Filters
          </h3>
          <div className="flex items-center space-x-2">
            {activeFilterCount > 0 && (
              <Button variant="ghost" size="sm" onClick={onClearFilters} className="text-sm">
                Clear all
              </Button>
            )}
            <button onClick={toggleSidebar} className="lg:hidden p-1 rounded-full hover:bg-gray-100">
              <X className="h-5 w-5 text-gray-500" />
            </button>
            <button onClick={toggleSidebar} className="hidden lg:block p-1 rounded-full hover:bg-gray-100">
              {isOpen ? (
                <ChevronLeft className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronRight className="h-5 w-5 text-gray-500" />
              )}
            </button>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* District filter */}
          <div>
            <h4 className="font-medium mb-2 text-gray-900">District</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
              {punjabDistricts.map((district) => (
                <Checkbox
                  key={district}
                  id={`district-${district}`}
                  label={district}
                  checked={selectedFilters.districts.includes(district)}
                  onChange={() => onFilterChange("districts", district)}
                />
              ))}
            </div>
          </div>

          {/* Department filter */}
          <div>
            <h4 className="font-medium mb-2 text-gray-900">Department</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
              {punjabDepartments.map((department) => (
                <Checkbox
                  key={department}
                  id={`department-${department}`}
                  label={department}
                  checked={selectedFilters.departments.includes(department)}
                  onChange={() => onFilterChange("departments", department)}
                />
              ))}
            </div>
          </div>

          {/* Sub-theme filter */}
          <div>
            <h4 className="font-medium mb-2 text-gray-900">Sub Theme</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
              {subThemes.map((theme) => (
                <Checkbox
                  key={theme}
                  id={`theme-${theme}`}
                  label={theme}
                  checked={selectedFilters.subThemes.includes(theme)}
                  onChange={() => onFilterChange("subThemes", theme)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Toggle button for desktop */}
      <button
        onClick={toggleSidebar}
        className="hidden lg:flex fixed left-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-r-md shadow-md z-40"
      >
        {isOpen ? (
          <ChevronLeft className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronRight className="h-5 w-5 text-gray-500" />
        )}
      </button>
    </>
  )
}
