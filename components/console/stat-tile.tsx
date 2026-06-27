"use client"

import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { StatusTone } from "@/lib/labels"

const dotTone: Record<StatusTone, string> = {
  success: "bg-success",
  info: "bg-info",
  warning: "bg-warning",
  danger: "bg-danger",
  neutral: "bg-muted-foreground/60",
}

export function StatTile({
  label,
  value,
  tone,
  active = false,
  onClick,
}: {
  label: string
  value: number
  tone: StatusTone
  active?: boolean
  onClick?: () => void
}) {
  return (
    <Card
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault()
          onClick()
        }
      }}
      className={cn(
        "flex flex-col gap-1.5 p-3.5 transition-colors",
        onClick && "cursor-pointer hover:border-ring/60 hover:bg-accent/40",
        active && "border-ring bg-accent/60 ring-1 ring-ring/40",
      )}
    >
      <div className="flex items-center gap-1.5">
        <span className={cn("size-2 rounded-full", dotTone[tone])} />
        <span className="truncate text-xs text-muted-foreground">{label}</span>
      </div>
      <span className="text-2xl font-semibold tabular-nums">{value}</span>
    </Card>
  )
}
