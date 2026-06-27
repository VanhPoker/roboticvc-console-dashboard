"use client"

import { GitBranchIcon } from "lucide-react"
import {
  DetailDrawer,
  DetailRow,
  DetailSection,
} from "@/components/console/detail-drawer"
import { StatusBadge } from "@/components/console/status-badge"
import { Meter } from "@/components/console/meter"
import { Button } from "@/components/ui/button"
import { channelMeta, policyMeta, rolloutStatusMeta } from "@/lib/labels"
import { deviceName } from "@/lib/mock-data"
import { formatDate } from "@/lib/format"
import type { Version } from "@/lib/types"

const ROLLOUT_ORDER = ["done", "updating", "pending", "failed"] as const

export function VersionDetail({
  version,
  open,
  onOpenChange,
}: {
  version: Version | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const channel = version ? channelMeta[version.channel] : null
  const total = version?.rollout.length ?? 0
  const done = version?.rollout.filter((r) => r.status === "done").length ?? 0
  const pct = total ? Math.round((done / total) * 100) : 0
  const counts = ROLLOUT_ORDER.map((s) => ({
    status: s,
    meta: rolloutStatusMeta[s],
    count: version?.rollout.filter((r) => r.status === s).length ?? 0,
  }))

  return (
    <DetailDrawer
      open={open}
      onOpenChange={onOpenChange}
      title={<span className="font-mono">{version?.tag ?? ""}</span>}
      description={version ? `Phát hành ${formatDate(version.releasedAt)}` : ""}
      badge={
        channel && (
          <div className="flex items-center gap-1.5">
            <StatusBadge label={channel.label} tone={channel.tone} dot={false} />
            {version?.active && <StatusBadge label="Đang hoạt động" tone="success" />}
          </div>
        )
      }
      footer={
        <>
          <Button size="sm">Đẩy bản cập nhật</Button>
          <Button size="sm" variant="outline">
            Chỉnh sửa
          </Button>
        </>
      }
    >
      {version && (
        <>
          <div className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3.5">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <GitBranchIcon className="size-6" />
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Tỉ lệ cập nhật</span>
                <span className="font-medium tabular-nums">
                  {done}/{total} · {pct}%
                </span>
              </div>
              <Meter value={pct} tone={pct === 100 ? "success" : "info"} />
            </div>
          </div>

          <DetailSection title="Thông tin">
            <div className="flex flex-col gap-1.5 rounded-lg border bg-muted/30 p-3.5">
              <DetailRow label="Kênh" value={channel?.label} />
              <DetailRow
                label="Chính sách"
                value={
                  <StatusBadge
                    label={policyMeta[version.policy].label}
                    tone={policyMeta[version.policy].tone}
                    dot={false}
                  />
                }
              />
              <DetailRow label="Trạng thái" value={version.active ? "Đang hoạt động" : "Lưu trữ"} />
              <DetailRow label="Ngày phát hành" value={formatDate(version.releasedAt)} />
            </div>
          </DetailSection>

          <DetailSection title="Ghi chú phát hành">
            <ul className="flex flex-col gap-1.5 rounded-lg border bg-muted/30 p-3.5">
              {version.notes.map((n, i) => (
                <li key={i} className="flex gap-2 text-sm">
                  <span className="mt-1.5 size-1 shrink-0 rounded-full bg-muted-foreground/60" />
                  <span>{n}</span>
                </li>
              ))}
            </ul>
          </DetailSection>

          <DetailSection title="Triển khai">
            <div className="grid grid-cols-4 gap-2">
              {counts.map((c) => (
                <div key={c.status} className="flex flex-col items-center gap-1 rounded-lg border bg-muted/30 p-2.5">
                  <span className="text-lg font-semibold tabular-nums">{c.count}</span>
                  <span className="text-center text-[11px] text-muted-foreground">{c.meta.label}</span>
                </div>
              ))}
            </div>
            <div className="mt-2 flex flex-col divide-y rounded-lg border">
              {version.rollout.slice(0, 12).map((r) => {
                const m = rolloutStatusMeta[r.status]
                return (
                  <div key={r.deviceId} className="flex items-center justify-between gap-3 px-3 py-2 text-sm">
                    <span className="truncate font-mono text-xs">{deviceName(r.deviceId)}</span>
                    <StatusBadge label={m.label} tone={m.tone} />
                  </div>
                )
              })}
              {version.rollout.length > 12 && (
                <div className="px-3 py-2 text-center text-xs text-muted-foreground">
                  +{version.rollout.length - 12} thiết bị khác
                </div>
              )}
            </div>
          </DetailSection>
        </>
      )}
    </DetailDrawer>
  )
}
