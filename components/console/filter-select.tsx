"use client"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export interface FilterOption {
  label: string
  value: string
}

export function FilterSelect({
  value,
  onChange,
  options,
  placeholder = "Tất cả",
  className,
  ariaLabel,
}: {
  value: string
  onChange: (value: string) => void
  options: FilterOption[]
  placeholder?: string
  className?: string
  ariaLabel?: string
}) {
  return (
    <Select value={value} onValueChange={(v) => onChange((v as string) ?? "all")}>
      <SelectTrigger className={className} aria-label={ariaLabel} size="sm">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
