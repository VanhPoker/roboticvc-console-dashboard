import type { LucideIcon } from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const accentMap = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success/12 text-success",
  info: "bg-info/12 text-info",
  warning: "bg-warning/15 text-warning",
  danger: "bg-danger/12 text-danger",
  neutral: "bg-muted text-muted-foreground",
} as const

export function KpiCard({
  label,
  value,
  sub,
  icon: Icon,
  accent = "primary",
}: {
  label: string
  value: string | number
  sub?: string
  icon: LucideIcon
  accent?: keyof typeof accentMap
}) {
  return (
    <Card className="flex flex-row items-center gap-3 p-4">
      <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-lg", accentMap[accent])}>
        <Icon className="size-5" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-xs text-muted-foreground">{label}</p>
        <p className="text-2xl font-semibold tracking-tight tabular-nums">{value}</p>
        {sub && <p className="truncate text-xs text-muted-foreground">{sub}</p>}
      </div>
    </Card>
  )
}
