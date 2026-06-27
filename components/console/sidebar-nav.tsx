"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BotIcon } from "lucide-react"
import { navItems } from "./nav-items"
import { cn } from "@/lib/utils"

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center gap-2.5 border-b px-4">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <BotIcon className="size-5" />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold">RoboticVC</p>
          <p className="text-[11px] text-muted-foreground">Console</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        <p className="px-2 pb-1 pt-2 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
          Vận hành
        </p>
        {navItems.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
              )}
            >
              <Icon className="size-4 shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t p-3">
        <div className="rounded-lg bg-muted/60 px-3 py-2.5">
          <p className="text-xs font-medium">Dữ liệu chất lượng hôm nay</p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            Robot thông minh ngày mai
          </p>
        </div>
      </div>
    </div>
  )
}
