"use client"

import { X } from "lucide-react"
import { Button } from "../ui/Button"

export function FilterMenu({ isOpen, onClose, selectedFilters, onFilterChange, onClearFilters, categories }) {
  const timeframes = ["Last 7 days", "Last 30 days", "Last 3 months", "Last year"]

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
          <h3 className="font-semibold text-lg">Filter Badges</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* Category filter */}
          <div>
            <h4 className="font-medium mb-2 text-gray-900">Badge Category</h4>
            <div className="space-y-2">
              {categories.map((category) => (
                <label key={category} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedFilters.categories.includes(category)}
                    onChange={() => onFilterChange("categories", category)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded cursor-pointer mr-2"
                  />
                  <span className="text-gray-700">{category}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Timeframe filter */}
          <div>
            <h4 className="font-medium mb-2 text-gray-900">Timeframe</h4>
            <div className="space-y-2">
              {timeframes.map((timeframe) => (
                <label key={timeframe} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedFilters.timeframes.includes(timeframe)}
                    onChange={() => onFilterChange("timeframes", timeframe)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded cursor-pointer mr-2"
                  />
                  <span className="text-gray-700">{timeframe}</span>
                </label>
              ))}
            </div>
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
