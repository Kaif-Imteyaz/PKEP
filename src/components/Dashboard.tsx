"use client"

import { useState, useEffect } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  Download,
  Users,
  FileText,
  Target,
  BookOpen,
  HelpCircle,
  Award,
  Filter,
  ChevronDown,
  ChevronRight,
  ArrowUpRight,
  Calendar,
  MapPin,
} from "lucide-react"
import { Card, CardContent, CardHeader } from "./ui/Card"
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
}

// Dummy data for additional charts
const applicationData = [
  { month: "Jan", processed: 45, pending: 12, delayed: 3 },
  { month: "Feb", processed: 52, pending: 8, delayed: 2 },
  { month: "Mar", processed: 48, pending: 15, delayed: 5 },
  { month: "Apr", processed: 61, pending: 10, delayed: 1 },
  { month: "May", processed: 55, pending: 7, delayed: 2 },
  { month: "Jun", processed: 67, pending: 5, delayed: 1 },
]

const processingTimeData = [
  { month: "Jan", avgTime: 4.2, target: 3.0 },
  { month: "Feb", avgTime: 3.8, target: 3.0 },
  { month: "Mar", avgTime: 4.1, target: 3.0 },
  { month: "Apr", avgTime: 3.2, target: 3.0 },
  { month: "May", avgTime: 3.5, target: 3.0 },
  { month: "Jun", avgTime: 2.9, target: 3.0 },
]

const departmentData = [
  { name: "Revenue", applications: 156, efficiency: 92 },
  { name: "Transport", applications: 89, efficiency: 88 },
  { name: "Health", applications: 134, efficiency: 95 },
  { name: "Education", applications: 67, efficiency: 90 },
  { name: "Agriculture", applications: 98, efficiency: 87 },
]

const satisfactionData = [
  { rating: "Excellent", count: 45, percentage: 65 },
  { rating: "Good", count: 18, percentage: 26 },
  { rating: "Average", count: 5, percentage: 7 },
  { rating: "Poor", count: 1, percentage: 1 },
]

const performanceRadarData = [
  { metric: "Speed", current: 85, target: 90 },
  { metric: "Accuracy", current: 92, target: 95 },
  { metric: "Quality", current: 88, target: 90 },
  { metric: "Efficiency", current: 90, target: 85 },
  { metric: "Satisfaction", current: 87, target: 90 },
  { metric: "Compliance", current: 95, target: 95 },
]

const COLORS = ["#10B981", "#3B82F6", "#F59E0B", "#EF4444", "#8B5CF6"]

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
  const maxValue = Math.max(...history.map((h) => h.value))
  const minValue = Math.min(...history.map((h) => h.value))
  const range = maxValue - minValue

  const getY = (value: number) => {
    const height = 80
    const padding = 10
    return height - ((value - minValue) / range) * (height - 2 * padding) + padding
  }

  const generateSmoothPath = (points: { x: number; y: number }[]) => {
    if (points.length < 2) return ""

    const path = [`M ${points[0].x} ${points[0].y}`]

    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i]
      const next = points[i + 1]
      const controlPointX = (next.x - current.x) / 2

      path.push(`C ${current.x + controlPointX} ${current.y} ${next.x - controlPointX} ${next.y} ${next.x} ${next.y}`)
    }

    return path.join(" ")
  }

  const points = history.map((point, i) => ({
    x: (i * 300) / (history.length - 1),
    y: getY(point.value),
  }))

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
              {value}
              {unit}
            </p>
            <p className="mt-1 text-sm text-gray-500 flex items-center">
              Rank {trend === "up" ? "improved" : "dropped"} by {rankChange}
              <span className={`ml-2 ${trend === "up" ? "text-green-600" : "text-red-600"}`}>
                {trend === "up" ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              </span>
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

        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Historical Trend</h4>
          <div className="h-32">
            <div className="relative h-full w-full">
              <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-400">
                <span>
                  {Math.round(maxValue * 10) / 10}
                  {unit}
                </span>
                <span>
                  {Math.round(((maxValue + minValue) / 2) * 10) / 10}
                  {unit}
                </span>
                <span>
                  {Math.round(minValue * 10) / 10}
                  {unit}
                </span>
              </div>

              <div className="ml-8 h-full">
                <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
                  <g className="grid-lines">
                    <line x1="0" y1="20" x2="300" y2="20" stroke="#f3f4f6" strokeWidth="1" strokeDasharray="4 4" />
                    <line x1="0" y1="50" x2="300" y2="50" stroke="#e5e7eb" strokeWidth="1" />
                    <line x1="0" y1="80" x2="300" y2="80" stroke="#f3f4f6" strokeWidth="1" strokeDasharray="4 4" />
                  </g>

                  <path
                    d={generateSmoothPath(points)}
                    fill="none"
                    stroke={`${color === "rose" ? "#dc2626" : "#10b981"}`}
                    strokeWidth="2"
                    strokeDasharray="300"
                    strokeDashoffset="300"
                    style={{
                      animation: "dashOffset 2s forwards ease-out",
                    }}
                  />

                  {history.map((point, i) => (
                    <g
                      key={i}
                      className="group"
                      style={{ opacity: 0, animation: `fadePoint 0.3s ${0.5 + i * 0.1}s forwards` }}
                    >
                      <circle
                        cx={(i * 300) / (history.length - 1)}
                        cy={getY(point.value)}
                        r="12"
                        fill="transparent"
                        className="cursor-pointer"
                      />
                      <circle
                        cx={(i * 300) / (history.length - 1)}
                        cy={getY(point.value)}
                        r="3"
                        fill="white"
                        stroke={`${color === "rose" ? "#dc2626" : "#10b981"}`}
                        strokeWidth="2"
                        className="transition-all duration-200 group-hover:r-4"
                      />
                      <g className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <rect
                          x={(i * 300) / (history.length - 1) - 25}
                          y={getY(point.value) - 25}
                          width="50"
                          height="20"
                          rx="4"
                          fill="#1f2937"
                        />
                        <text
                          x={(i * 300) / (history.length - 1)}
                          y={getY(point.value) - 12}
                          textAnchor="middle"
                          fill="white"
                          fontSize="10"
                        >
                          {point.value.toFixed(1)}
                          {unit}
                        </text>
                      </g>
                      <text
                        x={(i * 300) / (history.length - 1)}
                        y="95"
                        textAnchor="middle"
                        className="text-xs fill-gray-400"
                      >
                        {point.month}
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
  const [dateRange, setDateRange] = useState("30")
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
    delayed_applications: [
      { month: "Aug", value: 2.9 },
      { month: "Sep", value: 2.7 },
      { month: "Oct", value: 2.5 },
      { month: "Nov", value: 2.3 },
      { month: "Dec", value: 2.9 },
      { month: "Jan", value: 2.75 },
    ],
    process_days: [
      { month: "Aug", value: 3.4 },
      { month: "Sep", value: 3.3 },
      { month: "Oct", value: 3.1 },
      { month: "Nov", value: 2.8 },
      { month: "Dec", value: 3.4 },
      { month: "Jan", value: 3.2 },
    ],
  })
  const [isExporting, setIsExporting] = useState(false)

  useEffect(() => {
    fetchMetrics()
    fetchHistoricalMetrics()
  }, [])

  const fetchMetrics = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase.from("dashboard_metrics").select("*").eq("user_id", user.id).single()

      if (error) {
        console.error("Error fetching metrics:", error)
        return
      }

      if (data) {
        setMetrics({
          delayed_applications: data.delayed_applications || 2.75,
          process_days: data.process_days || 3.2,
          applications_handled: data.applications_handled || 67,
        })
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }

  const fetchHistoricalMetrics = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from("historical_metrics")
        .select("*")
        .eq("user_id", user.id)
        .order("month", { ascending: true })

      if (error) {
        console.error("Error fetching historical metrics:", error)
        return
      }

      if (data && data.length > 0) {
        const delayed = data
          .filter((m) => m.metric_type === "delayed_applications")
          .map((m) => ({
            month: format(new Date(m.month), "MMM"),
            value: m.value,
          }))

        const process = data
          .filter((m) => m.metric_type === "process_days")
          .map((m) => ({
            month: format(new Date(m.month), "MMM"),
            value: m.value,
          }))

        if (delayed.length > 0 || process.length > 0) {
          setHistoricalMetrics({
            delayed_applications: delayed.length > 0 ? delayed : historicalMetrics.delayed_applications,
            process_days: process.length > 0 ? process : historicalMetrics.process_days,
          })
        }
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }

  const handleExport = async () => {
    setIsExporting(true)

    // Simulate export process
    setTimeout(() => {
      // Create CSV data
      const csvData = [
        ["Month", "Processed", "Pending", "Delayed", "Avg Processing Time"],
        ...applicationData.map((item, index) => [
          item.month,
          item.processed,
          item.pending,
          item.delayed,
          processingTimeData[index]?.avgTime || 0,
        ]),
      ]

      // Convert to CSV string
      const csvContent = csvData.map((row) => row.join(",")).join("\n")

      // Create and download file
      const blob = new Blob([csvContent], { type: "text/csv" })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `service-metrics-${new Date().toISOString().split("T")[0]}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      setIsExporting(false)
    }, 2000)
  }

  const handleNavigation = (view: string) => {
    const event = new CustomEvent("viewChange", { detail: view })
    window.dispatchEvent(event)
  }

  return (
    <div className="space-y-8">
      <div className="text-center animate-fade-in">
        <h1 className="text-3xl font-bold text-gray-900">Service Metrics Dashboard</h1>
        <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
          Track your performance metrics and identify areas for improvement in service delivery.
        </p>
      </div>

      {/* Officer Profile Card */}
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

      {/* Filter Controls */}
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
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Applications Handled:</span>
          <span className="font-medium text-gray-900">{metrics.applications_handled}</span>
          <span className="text-sm text-green-600 flex items-center">
            <TrendingUp className="h-4 w-4 mr-1" />
            +12%
          </span>
          <Button
            onClick={handleExport}
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

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

      {/* Central Dashboard Summary */}
      <Card variant="elevated" className="animate-slide-up" style={{ animationDelay: "500ms" }}>
        <CardHeader title="Performance Overview" />
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Radar Chart */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Performance Radar</h4>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={performanceRadarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="metric" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar name="Current" dataKey="current" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                  <Radar name="Target" dataKey="target" stroke="#10B981" fill="#10B981" fillOpacity={0.1} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Department Efficiency */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Department Efficiency</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={departmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="efficiency" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Applications Processed */}
        <Card variant="elevated">
          <CardHeader title="Applications Processed" />
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={applicationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="processed" fill="#10B981" name="Processed" />
                <Bar dataKey="pending" fill="#F59E0B" name="Pending" />
                <Bar dataKey="delayed" fill="#EF4444" name="Delayed" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Processing Time Trend */}
        <Card variant="elevated">
          <CardHeader title="Processing Time Trend" />
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={processingTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="avgTime" stroke="#3B82F6" name="Avg Time (days)" strokeWidth={3} />
                <Line type="monotone" dataKey="target" stroke="#EF4444" name="Target" strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Customer Satisfaction */}
        <Card variant="elevated">
          <CardHeader title="Customer Satisfaction" />
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={satisfactionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name} ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {satisfactionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Trends */}
        <Card variant="elevated">
          <CardHeader title="Monthly Performance Trends" />
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={applicationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="processed"
                  stackId="1"
                  stroke="#10B981"
                  fill="#10B981"
                  fillOpacity={0.6}
                />
                <Area type="monotone" dataKey="pending" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Performance Improvement Tips */}
      <Card variant="elevated" className={`animate-slide-up`} style={{ animationDelay: "600ms" }}>
        <CardHeader
          title="Performance Improvement Tips"
          subtitle="Personalized suggestions based on your metrics"
          action={
            <Button
              variant="ghost"
              size="sm"
              icon={<ChevronRight className="h-4 w-4" />}
              iconPosition="right"
              onClick={() => handleNavigation("resources")}
            >
              View All Tips
            </Button>
          }
        />
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div
              className="flex hover:bg-primary-50 p-4 rounded-lg transition-colors duration-200 cursor-pointer"
              onClick={() => handleNavigation("resources")}
            >
              <div className="p-3 rounded-full bg-primary-100 mr-4 flex-shrink-0">
                <Clock className="h-5 w-5 text-primary-700" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Reduce Processing Time</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Consider implementing a standardized checklist for document verification to reduce back-and-forth with
                  applicants.
                </p>
                <button className="mt-3 text-primary-600 text-sm font-medium inline-flex items-center">
                  Learn more <ArrowUpRight className="ml-1 h-3 w-3" />
                </button>
              </div>
            </div>
            <div
              className="flex hover:bg-primary-50 p-4 rounded-lg transition-colors duration-200 cursor-pointer"
              onClick={() => handleNavigation("resources")}
            >
              <div className="p-3 rounded-full bg-green-100 mr-4 flex-shrink-0">
                <Users className="h-5 w-5 text-green-700" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Delegate Effectively</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Identify routine tasks that can be handled by junior staff to free up time for complex applications.
                </p>
                <button className="mt-3 text-green-600 text-sm font-medium inline-flex items-center">
                  Learn more <ArrowUpRight className="ml-1 h-3 w-3" />
                </button>
              </div>
            </div>
            <div
              className="flex hover:bg-purple-50 p-4 rounded-lg transition-colors duration-200 cursor-pointer"
              onClick={() => handleNavigation("resources")}
            >
              <div className="p-3 rounded-full bg-purple-100 mr-4 flex-shrink-0">
                <Target className="h-5 w-5 text-purple-700" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Goal Setting Framework</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Use SMART goals to track and improve your key performance indicators systematically.
                </p>
                <button className="mt-3 text-purple-600 text-sm font-medium inline-flex items-center">
                  Learn more <ArrowUpRight className="ml-1 h-3 w-3" />
                </button>
              </div>
            </div>
            <div
              className="flex hover:bg-blue-50 p-4 rounded-lg transition-colors duration-200 cursor-pointer"
              onClick={() => handleNavigation("resources")}
            >
              <div className="p-3 rounded-full bg-blue-100 mr-4 flex-shrink-0">
                <BookOpen className="h-5 w-5 text-blue-700" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Best Practices Library</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Access proven strategies and case studies from top-performing officers in your department.
                </p>
                <button className="mt-3 text-blue-600 text-sm font-medium inline-flex items-center">
                  Learn more <ArrowUpRight className="ml-1 h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card variant="elevated">
        <CardHeader title="Recent Activity" />
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Application #2024-0156 processed successfully</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Clock className="h-5 w-5 text-blue-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Processing time improved by 15% this week</p>
                <p className="text-xs text-gray-500">1 day ago</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Monthly target achieved ahead of schedule</p>
                <p className="text-xs text-gray-500">3 days ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

const styleTag = document.createElement("style")
styleTag.innerHTML = `
  @keyframes dashOffset {
    to {
      stroke-dashoffset: 0;
    }
  }
  
  @keyframes fadePoint {
    to {
      opacity: 1;
    }
  }
`
document.head.appendChild(styleTag)
