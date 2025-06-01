"use client"

import { useState, useEffect } from "react"
import {
  TrendingUp,
  TrendingDown,
  Clock,
  Users,
  FileText,
  Award,
  Download,
  Filter,
  ChevronDown,
  Calendar,
  MapPin,
  HelpCircle,
  X,
  FileSpreadsheet,
  FileTextIcon,
} from "lucide-react"
import { Card, CardContent } from "./ui/Card"
import { Button } from "./ui/Button"
import { Badge } from "./ui/Badge"
import { supabase } from "../lib/supabase"
import { format } from "date-fns"

type UserProfile = {
  name: string
  service: string
  office: string
  district: string
}

type HistoricalMetric = {
  month: string
  value: number
  target: number
}

// Fallback dummy data generator for when Supabase data is not available
const generateFallbackData = (period: string) => {
  const processingData: HistoricalMetric[] = []
  const delayedData: HistoricalMetric[] = []

  const currentDate = new Date()

  switch (period) {
    case "7days": {
      for (let i = 6; i >= 0; i--) {
        const date = new Date()
        date.setDate(currentDate.getDate() - i)
        const dayName = date.toLocaleDateString("en-US", { weekday: "short" })

        processingData.push({
          month: dayName,
          value: Math.round((3.2 + (Math.random() - 0.5) * 0.8) * 100) / 100,
          target: 3.0,
        })

        delayedData.push({
          month: dayName,
          value: Math.round((2.75 + (Math.random() - 0.5) * 0.5) * 100) / 100,
          target: 2.0,
        })
      }
      break
    }

    case "30days": {
      const weekLabels = ["Week 1", "Week 2", "Week 3", "Week 4"]

      for (let i = 0; i < 4; i++) {
        processingData.push({
          month: weekLabels[i],
          value: Math.round((3.2 + (Math.random() - 0.5) * 1.0) * 100) / 100,
          target: 3.0,
        })

        delayedData.push({
          month: weekLabels[i],
          value: Math.round((2.75 + (Math.random() - 0.5) * 0.7) * 100) / 100,
          target: 2.0,
        })
      }
      break
    }

    case "6months": {
      const monthNames = []
      for (let i = 5; i >= 0; i--) {
        const date = new Date()
        date.setMonth(currentDate.getMonth() - i)
        monthNames.push(date.toLocaleDateString("en-US", { month: "short" }))
      }

      for (const month of monthNames) {
        processingData.push({
          month,
          value: Math.round((3.2 + (Math.random() - 0.5) * 1.2) * 100) / 100,
          target: 3.0,
        })

        delayedData.push({
          month,
          value: Math.round((2.75 + (Math.random() - 0.5) * 0.8) * 100) / 100,
          target: 2.0,
        })
      }
      break
    }

    case "1year": {
      const quarters = ["Q1", "Q2", "Q3", "Q4"]

      for (const quarter of quarters) {
        processingData.push({
          month: quarter,
          value: Math.round((3.2 + (Math.random() - 0.5) * 1.5) * 100) / 100,
          target: 3.0,
        })

        delayedData.push({
          month: quarter,
          value: Math.round((2.75 + (Math.random() - 0.5) * 1.0) * 100) / 100,
          target: 2.0,
        })
      }
      break
    }

    case "6years": {
      const currentYear = currentDate.getFullYear()
      const years = []

      for (let i = 5; i >= 0; i--) {
        years.push((currentYear - i).toString())
      }

      for (const year of years) {
        processingData.push({
          month: year,
          value: Math.round((3.2 + (Math.random() - 0.5) * 1.8) * 100) / 100,
          target: 3.0,
        })

        delayedData.push({
          month: year,
          value: Math.round((2.75 + (Math.random() - 0.5) * 1.2) * 100) / 100,
          target: 2.0,
        })
      }
      break
    }

    default:
      const monthNames = ["Dec", "Jan", "Feb", "Mar", "Apr", "May"]

      for (const month of monthNames) {
        processingData.push({
          month,
          value: Math.round((3.2 + (Math.random() - 0.5) * 1.2) * 100) / 100,
          target: 3.0,
        })

        delayedData.push({
          month,
          value: Math.round((2.75 + (Math.random() - 0.5) * 0.8) * 100) / 100,
          target: 2.0,
        })
      }
  }

  return { processingData, delayedData }
}

function ExportDialog({
  isOpen,
  onClose,
  onExport,
}: {
  isOpen: boolean
  onClose: () => void
  onExport: (format: "pdf" | "excel") => void
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-90vw">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Export Data</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="text-gray-600 mb-6">Choose your preferred export format:</p>

        <div className="space-y-3">
          <button
            onClick={() => onExport("pdf")}
            className="w-full flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="p-2 bg-red-100 rounded-lg mr-3">
              <FileTextIcon className="h-5 w-5 text-red-600" />
            </div>
            <div className="text-left">
              <div className="font-medium text-gray-900">PDF Report</div>
              <div className="text-sm text-gray-500">Complete dashboard with charts and data</div>
            </div>
          </button>

          <button
            onClick={() => onExport("excel")}
            className="w-full flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="p-2 bg-green-100 rounded-lg mr-3">
              <FileSpreadsheet className="h-5 w-5 text-green-600" />
            </div>
            <div className="text-left">
              <div className="font-medium text-gray-900">Excel Spreadsheet</div>
              <div className="text-sm text-gray-500">Raw data for further analysis</div>
            </div>
          </button>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}

function MetricCard({
  title,
  value,
  trend,
  rankChange,
  icon: Icon,
  color,
  percentile,
  tooltip,
  unit = "%",
  history,
  delay = 0,
}: {
  title: string
  value: number
  trend: "up" | "down"
  rankChange: number
  icon: any
  color: string
  percentile: number
  tooltip: string
  unit?: string
  history: HistoricalMetric[]
  delay?: number
}) {
  const maxValue = Math.max(...history.map((h) => Math.max(h.value, h.target)))
  const minValue = Math.min(...history.map((h) => Math.min(h.value, h.target)))
  const range = maxValue - minValue || 1

  const chartHeight = 180
  const topPadding = 40
  const bottomPadding = 40

  const getY = (value: number) => {
    return topPadding + ((maxValue - value) / range) * (chartHeight - topPadding - bottomPadding)
  }

  const valuePoints = history.map((point, i) => ({
    x: 40 + (i * (300 - 80)) / (history.length - 1),
    y: getY(point.value),
  }))

  const targetPoints = history.map((point, i) => ({
    x: 40 + (i * (300 - 80)) / (history.length - 1),
    y: getY(point.target),
  }))

  // Determine target line color based on metric type
  const targetLineColor = title === "Delayed Applications" ? "#22c55e" : "#ef4444" // Green for delayed apps, red for others

  return (
    <Card
      variant="elevated"
      className={`animate-slide-up hover:shadow-lg transition-shadow duration-300`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <CardContent className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`p-2 rounded-full bg-${color === "rose" ? "red" : color}-100`}>
              <Icon className={`h-5 w-5 text-${color === "rose" ? "red" : color}-600`} />
            </div>
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            <div className="group relative">
              <HelpCircle className="h-4 w-4 text-gray-400" />
              <div className="hidden group-hover:block absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded whitespace-nowrap z-10">
                {tooltip}
              </div>
            </div>
          </div>
          <Badge variant="primary" className="flex items-center">
            <Award className="h-3.5 w-3.5 mr-1 text-primary-600" />
            <span>TOP {percentile}%</span>
          </Badge>
        </div>

        <div className="flex items-baseline justify-between">
          <div>
            <p className="text-4xl font-bold text-gray-900">
              {value.toFixed(2)}
              {unit}
            </p>
            <p className="mt-1 text-sm text-gray-500 flex items-center">
              Rank {trend === "up" ? "improved" : "dropped"} by {rankChange}
              <span className={`ml-2 ${trend === "up" ? "text-green-600" : "text-red-600"}`}>
                {trend === "up" ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              </span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Target</p>
            <p className="text-lg font-semibold text-gray-700">
              {history[history.length - 1]?.target.toFixed(2) || 0}
              {unit}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Bottom 25%</span>
            <span>Average</span>
            <span>Top 25%</span>
          </div>
          <div className="flex space-x-1">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                style={{ transitionDelay: `${i * 30}ms` }}
                className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                  i < 5 ? "bg-red-200" : i < 15 ? "bg-amber-200" : "bg-green-200"
                } ${Math.floor(percentile / 5) === i ? "ring-2 ring-offset-2 ring-primary-600" : ""} ${
                  i <= Math.floor(percentile / 5) ? "scale-y-100" : "scale-y-0"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="space-y-3 mt-6">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium text-gray-700">Historical Trend</h4>
            <div className="flex items-center space-x-4 text-xs">
              <div className="flex items-center">
                <div className={`w-4 h-0.5 bg-${color === "rose" ? "red" : "blue"}-500 mr-2`}></div>
                <span className="text-gray-700 font-medium">Actual</span>
              </div>
              <div className="flex items-center">
                <div
                  className="w-4 h-0.5 mr-2"
                  style={{
                    backgroundColor: targetLineColor,
                    backgroundImage: `repeating-linear-gradient(to right, ${targetLineColor} 0, ${targetLineColor} 3px, transparent 3px, transparent 6px)`,
                  }}
                ></div>
                <span className="text-gray-700 font-medium">Target</span>
              </div>
            </div>
          </div>
          <div className="h-52 bg-gray-50 rounded-lg p-3 mt-4">
            <div className="relative h-full w-full">
              <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500 py-6">
                <span>
                  {maxValue.toFixed(1)}
                  {unit}
                </span>
                <span>
                  {((maxValue + minValue) / 2).toFixed(1)}
                  {unit}
                </span>
                <span>
                  {minValue.toFixed(1)}
                  {unit}
                </span>
              </div>

              <div className="ml-8 h-full">
                <svg className="w-full h-full" viewBox="0 0 300 180" preserveAspectRatio="none">
                  <g className="grid-lines">
                    <line
                      x1="40"
                      y1={topPadding}
                      x2="260"
                      y2={topPadding}
                      stroke="#e5e7eb"
                      strokeWidth="1"
                      strokeDasharray="2 2"
                    />
                    <line x1="40" y1={chartHeight / 2} x2="260" y2={chartHeight / 2} stroke="#d1d5db" strokeWidth="1" />
                    <line
                      x1="40"
                      y1={chartHeight - bottomPadding}
                      x2="260"
                      y2={chartHeight - bottomPadding}
                      stroke="#e5e7eb"
                      strokeWidth="1"
                      strokeDasharray="2 2"
                    />
                  </g>

                  <polyline
                    points={targetPoints.map((p) => `${p.x},${p.y}`).join(" ")}
                    fill="none"
                    stroke={targetLineColor}
                    strokeWidth="2"
                    strokeDasharray="5 3"
                  />

                  <polyline
                    points={valuePoints.map((p) => `${p.x},${p.y}`).join(" ")}
                    fill="none"
                    stroke={color === "rose" ? "#dc2626" : "#3b82f6"}
                    strokeWidth="2"
                    style={{
                      strokeDasharray: "1000",
                      strokeDashoffset: "1000",
                      animation: "drawLine 2s ease-out forwards",
                    }}
                  />

                  {targetPoints.map((point, i) => (
                    <polygon
                      key={`target-${i}`}
                      points={`${point.x},${point.y - 3} ${point.x + 3},${point.y} ${point.x},${point.y + 3} ${point.x - 3},${point.y}`}
                      fill={targetLineColor}
                      opacity="0.9"
                    />
                  ))}

                  {valuePoints.map((point, i) => (
                    <g
                      key={i}
                      className="group"
                      style={{ opacity: 0, animation: `fadePoint 0.3s ${0.5 + i * 0.1}s forwards` }}
                    >
                      <circle cx={point.x} cy={point.y} r="15" fill="transparent" className="cursor-pointer" />
                      <circle
                        cx={point.x}
                        cy={point.y}
                        r="4"
                        fill="white"
                        stroke={color === "rose" ? "#dc2626" : "#3b82f6"}
                        strokeWidth="2"
                        className="transition-all duration-200"
                      />

                      <g className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <rect
                          x={point.x - 40}
                          y={point.y - 50}
                          width="80"
                          height="35"
                          rx="4"
                          fill="white"
                          stroke="#e5e7eb"
                          strokeWidth="1"
                        />
                        <text
                          x={point.x}
                          y={point.y - 35}
                          textAnchor="middle"
                          fill="#1f2937"
                          fontSize="10"
                          fontWeight="600"
                        >
                          {history[i]?.month}
                        </text>
                        <text x={point.x} y={point.y - 25} textAnchor="middle" fill="#3b82f6" fontSize="9">
                          Actual: {history[i]?.value.toFixed(2)}
                          {unit}
                        </text>
                        <text x={point.x} y={point.y - 17} textAnchor="middle" fill={targetLineColor} fontSize="9">
                          Target: {history[i]?.target.toFixed(2)}
                          {unit}
                        </text>
                      </g>

                      <text
                        x={point.x}
                        y={chartHeight - 10}
                        textAnchor="middle"
                        className="text-xs fill-gray-500"
                        fontSize="11"
                      >
                        {history[i]?.month}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function Dashboard() {
  const [dateRange, setDateRange] = useState("6months")
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [profile] = useState<UserProfile>({
    name: "Amitabh Bachchan",
    service: "Revenue Service",
    office: "District Revenue Office",
    district: "Amritsar",
  })
  const [metrics, setMetrics] = useState({
    delayed_applications: 2.75,
    process_days: 3.2,
    applications_handled: 67,
  })
  const [historicalMetrics, setHistoricalMetrics] = useState<{
    delayed_applications: HistoricalMetric[]
    process_days: HistoricalMetric[]
  }>({
    delayed_applications: [],
    process_days: [],
  })
  const [isExporting, setIsExporting] = useState(false)
  const [dataSource, setDataSource] = useState<"supabase" | "fallback">("fallback")

  useEffect(() => {
    fetchMetricsFromSupabase()
    updateDataForTimeRange(dateRange)
  }, [dateRange])

  const fetchMetricsFromSupabase = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        console.log("No authenticated user, using fallback data")
        setDataSource("fallback")
        return
      }

      // Try to fetch current metrics
      const { data: metricsData, error: metricsError } = await supabase
        .from("dashboard_metrics")
        .select("*")
        .eq("user_id", user.id)
        .single()

      if (metricsError) {
        console.log("Error fetching metrics from Supabase:", metricsError.message)
        setDataSource("fallback")
        return
      }

      // Try to fetch historical metrics
      const { data: historicalData, error: historicalError } = await supabase
        .from("historical_metrics")
        .select("*")
        .eq("user_id", user.id)
        .order("month", { ascending: true })

      if (historicalError) {
        console.log("Error fetching historical data from Supabase:", historicalError.message)
        setDataSource("fallback")
        return
      }

      // If we have data, use it
      if (metricsData && historicalData) {
        setMetrics(metricsData)

        const delayed = historicalData
          .filter((m) => m.metric_type === "delayed_applications")
          .map((m) => ({
            month: format(new Date(m.month), "MMM"),
            value: m.value,
            target: 2.0, // Default target for delayed applications
          }))

        const process = historicalData
          .filter((m) => m.metric_type === "process_days")
          .map((m) => ({
            month: format(new Date(m.month), "MMM"),
            value: m.value,
            target: 3.0, // Default target for process days
          }))

        setHistoricalMetrics({
          delayed_applications: delayed,
          process_days: process,
        })

        setDataSource("supabase")
        console.log("Successfully loaded data from Supabase")
      } else {
        setDataSource("fallback")
      }
    } catch (error) {
      console.error("Error connecting to Supabase:", error)
      setDataSource("fallback")
    }
  }

  const updateDataForTimeRange = (period: string) => {
    // Only use fallback data if Supabase data is not available
    if (dataSource === "fallback") {
      const { processingData, delayedData } = generateFallbackData(period)

      setHistoricalMetrics({
        delayed_applications: delayedData,
        process_days: processingData,
      })

      setMetrics((prev) => ({
        ...prev,
        delayed_applications: delayedData[delayedData.length - 1]?.value || prev.delayed_applications,
        process_days: processingData[processingData.length - 1]?.value || prev.process_days,
      }))
    }
  }

  const exportToPDF = async () => {
    setIsExporting(true)

    try {
      const html2canvas = (await import("html2canvas")).default
      const jsPDF = (await import("jspdf")).default

      const pdf = new jsPDF("p", "mm", "a4")
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()

      pdf.setFontSize(20)
      pdf.text("Service Metrics Dashboard Report", pageWidth / 2, 20, { align: "center" })

      pdf.setFontSize(12)
      pdf.text(`Officer: ${profile.name}`, 20, 35)
      pdf.text(`Service: ${profile.service}`, 20, 45)
      pdf.text(`Office: ${profile.office}`, 20, 55)
      pdf.text(`District: ${profile.district}`, 20, 65)
      pdf.text(`Report Date: ${new Date().toLocaleDateString()}`, 20, 75)
      pdf.text(`Time Period: ${getTimeRangeLabel()}`, 20, 85)
      pdf.text(`Data Source: ${dataSource === "supabase" ? "Live Database" : "Demo Data"}`, 20, 95)

      pdf.setFontSize(14)
      pdf.text("Key Metrics:", 20, 110)
      pdf.setFontSize(12)
      pdf.text(`• Delayed Applications: ${metrics.delayed_applications.toFixed(2)}%`, 25, 120)
      pdf.text(`• Processing Days: ${metrics.process_days.toFixed(2)} days`, 25, 130)
      pdf.text(`• Applications Handled: ${metrics.applications_handled}`, 25, 140)

      const metricCards = document.querySelectorAll("[data-metric-card]")
      let yPosition = 150

      for (let i = 0; i < metricCards.length; i++) {
        const card = metricCards[i] as HTMLElement
        if (card) {
          const canvas = await html2canvas(card, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
          })
          const imgData = canvas.toDataURL("image/png")
          const imgWidth = pageWidth - 40
          const imgHeight = (canvas.height * imgWidth) / canvas.width

          if (yPosition + imgHeight > pageHeight - 20) {
            pdf.addPage()
            yPosition = 20
          }

          pdf.addImage(imgData, "PNG", 20, yPosition, imgWidth, imgHeight)
          yPosition += imgHeight + 10
        }
      }

      // Add data table with borders
      if (yPosition + 80 > pageHeight - 20) {
        pdf.addPage()
        yPosition = 20
      }

      pdf.setFontSize(16)
      pdf.text("Historical Data", 20, yPosition)
      yPosition += 15

      // Table setup
      const startX = 20
      const startY = yPosition
      const rowHeight = 8
      const colWidth = (pageWidth - 40) / 5

      // Table headers with borders
      pdf.setFontSize(10)
      pdf.setFont(undefined, "bold")

      const headers = ["Period", "Processing Days", "Processing Target", "Delayed Apps %", "Delayed Target %"]

      // Draw header row with borders
      headers.forEach((header, i) => {
        const cellX = startX + i * colWidth
        pdf.rect(cellX, startY, colWidth, rowHeight)
        pdf.text(header, cellX + 2, startY + 5)
      })

      // Data rows with borders
      pdf.setFont(undefined, "normal")
      historicalMetrics.process_days.forEach((item, index) => {
        const delayedItem = historicalMetrics.delayed_applications[index]
        if (delayedItem) {
          const rowY = startY + (index + 1) * rowHeight
          const data = [
            item.month,
            item.value.toFixed(2),
            item.target.toFixed(2),
            delayedItem.value.toFixed(2),
            delayedItem.target.toFixed(2),
          ]

          data.forEach((cellData, i) => {
            const cellX = startX + i * colWidth
            pdf.rect(cellX, rowY, colWidth, rowHeight)
            pdf.text(cellData, cellX + 2, rowY + 5)
          })
        }
      })

      pdf.save(`service-metrics-report-${new Date().toISOString().split("T")[0]}.pdf`)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Error generating PDF. Please try again.")
    } finally {
      setIsExporting(false)
      setShowExportDialog(false)
    }
  }

  const exportToExcel = () => {
    setIsExporting(true)

    setTimeout(() => {
      const csvData = [
        ["Service Metrics Dashboard Report"],
        [""],
        ["Officer Information"],
        ["Name", profile.name],
        ["Service", profile.service],
        ["Office", profile.office],
        ["District", profile.district],
        ["Report Date", new Date().toLocaleDateString()],
        ["Time Period", getTimeRangeLabel()],
        ["Data Source", dataSource === "supabase" ? "Live Database" : "Demo Data"],
        [""],
        ["Current Metrics"],
        ["Metric", "Value", "Unit"],
        ["Delayed Applications", metrics.delayed_applications.toFixed(2), "%"],
        ["Processing Days", metrics.process_days.toFixed(2), "days"],
        ["Applications Handled", metrics.applications_handled, "count"],
        [""],
        ["Historical Data"],
        ["Period", "Processing Days", "Processing Target", "Delayed Applications %", "Delayed Target %"],
        ...historicalMetrics.process_days.map((item, index) => {
          const delayedItem = historicalMetrics.delayed_applications[index]
          return [
            item.month,
            item.value.toFixed(2),
            item.target.toFixed(2),
            delayedItem?.value.toFixed(2) || "",
            delayedItem?.target.toFixed(2) || "",
          ]
        }),
      ]

      const csvContent = csvData.map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `service-metrics-${new Date().toISOString().split("T")[0]}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      setIsExporting(false)
      setShowExportDialog(false)
    }, 1000)
  }

  const handleExport = (format: "pdf" | "excel") => {
    if (format === "pdf") {
      exportToPDF()
    } else {
      exportToExcel()
    }
  }

  const getTimeRangeLabel = () => {
    switch (dateRange) {
      case "7days":
        return "Last 7 days"
      case "30days":
        return "Last 30 days (weekly)"
      case "6months":
        return "Last 6 months"
      case "1year":
        return "Last year (quarterly)"
      case "6years":
        return "Last 6 years"
      default:
        return "Last 6 months"
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center animate-fade-in">
        <h1 className="text-3xl font-bold text-gray-900">Service Metrics Dashboard</h1>
        <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
          Track your performance metrics and identify areas for improvement in service delivery.
        </p>
        {dataSource === "fallback" && (
          <div className="mt-2 text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 inline-block">
            📊 Currently showing demo data. Connect to database for live metrics.
          </div>
        )}
      </div>

      <Card variant="elevated" className={`overflow-hidden animate-slide-up`} style={{ animationDelay: "100ms" }}>
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-4">
          <h2 className="text-xl font-semibold text-white">Officer Profile</h2>
        </div>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
            <div className="flex items-start">
              <div className="p-2 rounded-full bg-primary-100 mr-3">
                <Users className="h-5 w-5 text-primary-700" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Officer Name</p>
                <p className="mt-1 font-medium text-gray-900">{profile.name}</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="p-2 rounded-full bg-primary-100 mr-3">
                <Award className="h-5 w-5 text-primary-700" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Service</p>
                <p className="mt-1 font-medium text-gray-900">{profile.service}</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="p-2 rounded-full bg-primary-100 mr-3">
                <Calendar className="h-5 w-5 text-primary-700" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Office</p>
                <p className="mt-1 font-medium text-gray-900">{profile.office}</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="p-2 rounded-full bg-primary-100 mr-3">
                <MapPin className="h-5 w-5 text-primary-700" />
              </div>
              <div>
                <p className="text-sm text-gray-500">District</p>
                <p className="mt-1 font-medium text-gray-900">{profile.district}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div
        className="flex flex-col sm:flex-row justify-between items-center gap-4 animate-slide-up"
        style={{ animationDelay: "200ms" }}
      >
        <div className="flex items-center space-x-3">
          <Button variant="outline" icon={<Filter className="h-4 w-4" />} iconPosition="left">
            Filter
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days (weekly)</option>
            <option value="6months">Last 6 months</option>
            <option value="1year">Last year (quarterly)</option>
            <option value="6years">Last 6 years</option>
          </select>
          <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">{getTimeRangeLabel()}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Applications Handled:</span>
          <span className="font-medium text-gray-900">{metrics.applications_handled}</span>
          <span className="text-sm text-green-600 flex items-center">
            <TrendingUp className="h-4 w-4 mr-1" />
            +12%
          </span>
          <Button
            onClick={() => setShowExportDialog(true)}
            disabled={isExporting}
            variant="outline"
            icon={<Download className="h-4 w-4" />}
            iconPosition="left"
            className="ml-4"
          >
            {isExporting ? "Exporting..." : "Export"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div data-metric-card>
          <MetricCard
            title="Delayed Applications"
            value={metrics.delayed_applications}
            trend="down"
            rankChange={4}
            icon={Clock}
            color="rose"
            percentile={92}
            tooltip="Percentage of applications processed beyond stipulated timeline"
            history={historicalMetrics.delayed_applications}
            delay={300}
          />
        </div>
        <div data-metric-card>
          <MetricCard
            title="Process Days"
            value={metrics.process_days}
            trend="up"
            rankChange={2}
            icon={FileText}
            color="green"
            percentile={88}
            tooltip="Median time taken to process applications"
            unit=" days"
            history={historicalMetrics.process_days}
            delay={400}
          />
        </div>
      </div>

      <ExportDialog isOpen={showExportDialog} onClose={() => setShowExportDialog(false)} onExport={handleExport} />
    </div>
  )
}

const styleTag = document.createElement("style")
styleTag.innerHTML = `
  @keyframes drawLine {
    to {
      stroke-dashoffset: 0;
    }
  }
  
  @keyframes fadePoint {
    to {
      opacity: 1;
    }
  }
  
  @keyframes slide-up {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  .animate-slide-up {
    animation: slide-up 0.6s ease-out forwards;
  }
  
  .animate-fade-in {
    animation: fade-in 0.8s ease-out forwards;
  }
`
document.head.appendChild(styleTag)
