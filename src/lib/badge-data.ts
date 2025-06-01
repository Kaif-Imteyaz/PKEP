import { Target, Zap, CheckCircle, Award, Shield, Rocket, Bolt } from "lucide-react"

export const badgeData = [
  {
    id: "1",
    title: "Efficiency Expert",
    description: "You reduced Process Days by more than 20% from last month.",
    category: "Efficiency",
    earned: true,
    daysAgo: 3,
    rarity: "Uncommon",
    criteria: [
      "Reduce average processing time by at least 20% over a month",
      "Maintain quality standards with less than 2% error rate",
      "Process at least 50 applications during the evaluation period",
    ],
    benefits: [
      "Recognition in the monthly department newsletter",
      "Priority consideration for professional development opportunities",
      "Certificate of achievement for your personnel file",
    ],
    emoji: "🏅",
    icon: Award,
  },
  {
    id: "2",
    title: "Fast Tracker",
    description:
      "You completed a specific stage (e.g., Document Upload, Field Verification) in record time compared to peers.",
    category: "Speed",
    earned: true,
    daysAgo: 5,
    rarity: "Common",
    criteria: [
      "Complete document processing within 24 hours of submission",
      "Handle at least 30 documents in a week",
      "Maintain a consistent processing speed across different document types",
    ],
    emoji: "⚡",
    icon: Bolt,
  },
  {
    id: "3",
    title: "Top Performer",
    description: "You are ranked among the Top 5 in both Delay Rate and Process Days across the state.",
    category: "Quality",
    earned: true,
    daysAgo: 45,
    rarity: "Rare",
    criteria: [
      "Achieve top 5 ranking in delay rate statewide",
      "Achieve top 5 ranking in process days statewide",
      "Maintain consistent performance for at least 3 months",
    ],
    emoji: "🚀",
    icon: Rocket,
  },
  {
    id: "4",
    title: "Delay Defender",
    description: "You reduced delayed applications rate compared to last month.",
    category: "Efficiency",
    earned: true,
    daysAgo: 60,
    rarity: "Uncommon",
    criteria: [
      "Reduce delayed applications rate by at least 15%",
      "Maintain improvement for consecutive months",
      "Process applications within stipulated timeframes",
    ],
    emoji: "🛡️",
    icon: Shield,
  },
]

export const badgeCategories = [
  {
    id: "efficiency",
    name: "Efficiency",
    description: "Badges related to improving efficiency in service delivery.",
    icon: Target,
    bgColor: "bg-yellow-50",
    iconColor: "text-amber-600",
    badgeVariant: "warning",
    badges: ["Efficiency Expert", "Delay Defender"],
  },
  {
    id: "speed",
    name: "Speed",
    description: "Badges related to improving the speed of service delivery.",
    icon: Zap,
    bgColor: "bg-green-50",
    iconColor: "text-green-600",
    badgeVariant: "success",
    badges: ["Fast Tracker"],
  },
  {
    id: "quality",
    name: "Quality",
    description: "Badges related to improving the quality of service delivery.",
    icon: CheckCircle,
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600",
    badgeVariant: "primary",
    badges: ["Top Performer"],
  },
]

export const badgeMetrics = [
  {
    name: "Efficiency Expert",
    category: "Efficiency",
    count: 42,
    total: 120,
    description: "Reduced process days by 20%+",
  },
  { name: "Fast Tracker", category: "Speed", count: 78, total: 120, description: "Completed stages in record time" },
  {
    name: "Top Performer",
    category: "Quality",
    count: 5,
    total: 120,
    description: "Top 5 in Delay Rate & Process Days",
  },
  {
    name: "Delay Defender",
    category: "Efficiency",
    count: 35,
    total: 120,
    description: "Reduced delayed applications",
  },
]

// Motivational quotes for badges page
export const motivationalQuotes = [
  {
    quote:
      "Excellence is never an accident. It is always the result of high intention, sincere effort, and intelligent execution.",
    author: "Aristotle",
  },
  {
    quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
  },
  {
    quote: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney",
  },
  {
    quote: "Innovation distinguishes between a leader and a follower.",
    author: "Steve Jobs",
  },
  {
    quote: "Quality is not an act, it is a habit.",
    author: "Aristotle",
  },
  {
    quote: "Efficiency is doing things right; effectiveness is doing the right things.",
    author: "Peter Drucker",
  },
  {
    quote: "The best time to plant a tree was 20 years ago. The second best time is now.",
    author: "Chinese Proverb",
  },
  {
    quote: "Continuous improvement is better than delayed perfection.",
    author: "Mark Twain",
  },
]
