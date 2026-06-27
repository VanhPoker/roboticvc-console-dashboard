import { cn } from "@/lib/utils"
import type { StatusTone } from "@/lib/labels"

const fillTone: Record<StatusTone, string> = {
  success: "bg-success",
  info: "bg-info",
  warning: "bg-warning",
  danger: "bg-danger",
  neutral: "bg-muted-foreground/60",
}

export function Meter({
  value,
  tone = "info",
  className,
}: {
  value: number
  tone?: StatusTone
  className?: string
}) {
  const pct = Math.max(0, Math.min(100, value))
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-muted", className)}>
      <div
        className={cn("h-full rounded-full transition-all", fillTone[tone])}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
