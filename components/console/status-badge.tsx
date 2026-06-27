import { cn } from "@/lib/utils"
import type { StatusTone } from "@/lib/labels"

const toneClasses: Record<StatusTone, string> = {
  success: "bg-success/12 text-success border-success/25",
  info: "bg-info/12 text-info border-info/25",
  warning: "bg-warning/15 text-warning border-warning/30",
  danger: "bg-danger/12 text-danger border-danger/25",
  neutral: "bg-muted text-muted-foreground border-border",
}

const dotClasses: Record<StatusTone, string> = {
  success: "bg-success",
  info: "bg-info",
  warning: "bg-warning",
  danger: "bg-danger",
  neutral: "bg-muted-foreground/60",
}

export function StatusBadge({
  label,
  tone,
  dot = true,
  pulse = false,
  className,
}: {
  label: string
  tone: StatusTone
  dot?: boolean
  pulse?: boolean
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        toneClasses[tone],
        className,
      )}
    >
      {dot && (
        <span className="relative flex size-1.5">
          {pulse && (
            <span
              className={cn(
                "absolute inline-flex size-full animate-ping rounded-full opacity-60",
                dotClasses[tone],
              )}
            />
          )}
          <span className={cn("relative inline-flex size-1.5 rounded-full", dotClasses[tone])} />
        </span>
      )}
      {label}
    </span>
  )
}
