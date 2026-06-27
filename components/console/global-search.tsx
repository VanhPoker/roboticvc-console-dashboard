"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { SearchIcon, CornerDownLeftIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import {
  devices,
  facilities,
  collaborators,
  videoAssets,
  facilityName,
} from "@/lib/mock-data"

interface Result {
  id: string
  title: string
  subtitle: string
  type: string
  href: string
}

function buildResults(query: string): Result[] {
  const q = query.trim().toLowerCase()
  if (!q) return []
  const results: Result[] = []

  for (const d of devices) {
    if (
      d.name.toLowerCase().includes(q) ||
      d.hardwareId.toLowerCase().includes(q)
    ) {
      results.push({
        id: d.id,
        title: d.name,
        subtitle: `${d.hardwareId} · ${facilityName(d.facilityId)}`,
        type: "Thiết bị",
        href: `/thiet-bi?q=${encodeURIComponent(d.name)}`,
      })
    }
  }
  for (const f of facilities) {
    if (f.name.toLowerCase().includes(q) || f.code.toLowerCase().includes(q)) {
      results.push({
        id: f.id,
        title: f.name,
        subtitle: `${f.code} · ${f.region}`,
        type: "Cơ sở",
        href: `/co-so?q=${encodeURIComponent(f.name)}`,
      })
    }
  }
  for (const c of collaborators) {
    if (c.name.toLowerCase().includes(q) || c.phone.includes(q)) {
      results.push({
        id: c.id,
        title: c.name,
        subtitle: `${c.phone} · ${facilityName(c.facilityId)}`,
        type: "CTV",
        href: `/cong-tac-vien?q=${encodeURIComponent(c.name)}`,
      })
    }
  }
  for (const v of videoAssets) {
    if (v.sessionCode.toLowerCase().includes(q)) {
      results.push({
        id: v.id,
        title: v.sessionCode,
        subtitle: facilityName(v.facilityId),
        type: "Video",
        href: `/video?q=${encodeURIComponent(v.sessionCode)}`,
      })
    }
  }
  return results.slice(0, 8)
}

const typeTone: Record<string, string> = {
  "Thiết bị": "text-info",
  "Cơ sở": "text-success",
  CTV: "text-warning",
  Video: "text-primary",
}

export function GlobalSearch() {
  const router = useRouter()
  const [query, setQuery] = React.useState("")
  const [open, setOpen] = React.useState(false)
  const [active, setActive] = React.useState(0)
  const containerRef = React.useRef<HTMLDivElement>(null)

  const results = React.useMemo(() => buildResults(query), [query])

  React.useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onClick)
    return () => document.removeEventListener("mousedown", onClick)
  }, [])

  React.useEffect(() => setActive(0), [query])

  const go = (r: Result) => {
    setOpen(false)
    setQuery("")
    router.push(r.href)
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setOpen(true)
        }}
        onFocus={() => query && setOpen(true)}
        onKeyDown={(e) => {
          if (!open || results.length === 0) return
          if (e.key === "ArrowDown") {
            e.preventDefault()
            setActive((a) => (a + 1) % results.length)
          } else if (e.key === "ArrowUp") {
            e.preventDefault()
            setActive((a) => (a - 1 + results.length) % results.length)
          } else if (e.key === "Enter") {
            e.preventDefault()
            go(results[active])
          } else if (e.key === "Escape") {
            setOpen(false)
          }
        }}
        placeholder="Tìm thiết bị, cơ sở, CTV, video..."
        className="h-9 pl-8"
        aria-label="Tìm kiếm toàn cục"
      />
      {open && query && (
        <div className="absolute top-full left-0 z-50 mt-1.5 w-full overflow-hidden rounded-lg border bg-popover shadow-lg">
          {results.length === 0 ? (
            <p className="px-3 py-4 text-center text-sm text-muted-foreground">
              Không tìm thấy kết quả cho “{query}”
            </p>
          ) : (
            <ul className="max-h-80 overflow-y-auto p-1.5">
              {results.map((r, i) => (
                <li key={`${r.type}-${r.id}`}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onClick={() => go(r)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-left transition-colors",
                      active === i ? "bg-accent" : "hover:bg-accent/50",
                    )}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{r.title}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {r.subtitle}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "shrink-0 text-[11px] font-medium",
                        typeTone[r.type],
                      )}
                    >
                      {r.type}
                    </span>
                    {active === i && (
                      <CornerDownLeftIcon className="size-3.5 shrink-0 text-muted-foreground" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
