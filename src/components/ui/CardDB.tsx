// DB = Dashboard
import type React from "react"
import { cn } from "../../lib/utils"
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated"
}

export function Card({ className, variant = "default", ...props }: CardProps) {
  return (
    <div
      className={cn("rounded-lg border bg-card text-card-foreground", variant === "elevated" && "shadow-lg", className)}
      {...props}
    />
  )
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  subtitle?: string
  action?: React.ReactNode
}

export function CardHeader({ className, title, subtitle, action, children, ...props }: CardHeaderProps) {
  return (
    <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props}>
      <div className="flex items-center justify-between">
        <div>
          {title && <h3 className="text-2xl font-semibold leading-none tracking-tight">{title}</h3>}
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
      {children}
    </div>
  )
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6 pt-0", className)} {...props} />
}
