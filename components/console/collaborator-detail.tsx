"use client"

import { PhoneIcon } from "lucide-react"
import {
  DetailDrawer,
  DetailRow,
  DetailSection,
} from "@/components/console/detail-drawer"
import { StatusBadge } from "@/components/console/status-badge"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  collaboratorStatusMeta,
  deviceStatusMeta,
} from "@/lib/labels"
import { deviceById, facilityName } from "@/lib/mock-data"
import { formatDate } from "@/lib/format"
import type { Collaborator } from "@/lib/types"

function initials(name: string) {
  const parts = name.trim().split(/\s+/)
  return (parts[0]?.[0] ?? "") + (parts[parts.length - 1]?.[0] ?? "")
}

export function CollaboratorDetail({
  collaborator,
  open,
  onOpenChange,
}: {
  collaborator: Collaborator | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const meta = collaborator ? collaboratorStatusMeta[collaborator.status] : null
  const device = deviceById(collaborator?.assignedDeviceId ?? null)
  const deviceMeta = device ? deviceStatusMeta[device.status] : null

  return (
    <DetailDrawer
      open={open}
      onOpenChange={onOpenChange}
      title={collaborator?.name ?? ""}
      description={
        collaborator ? facilityName(collaborator.facilityId) : ""
      }
      badge={meta && <StatusBadge label={meta.label} tone={meta.tone} />}
      footer={
        <>
          <Button size="sm">Gán thiết bị</Button>
          <Button size="sm" variant="outline">
            Chỉnh sửa
          </Button>
        </>
      }
    >
      {collaborator && (
        <>
          <div className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3.5">
            <Avatar className="size-12">
              <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
                {initials(collaborator.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-col">
              <span className="truncate font-medium">{collaborator.name}</span>
              <span className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                <PhoneIcon className="size-3" />
                {collaborator.phone}
              </span>
            </div>
          </div>

          <DetailSection title="Kỹ năng">
            <div className="flex flex-wrap gap-1.5">
              {collaborator.skills.map((s) => (
                <Badge key={s} variant="secondary">
                  {s}
                </Badge>
              ))}
            </div>
          </DetailSection>

          <DetailSection title="Thiết bị đang gán">
            {device ? (
              <div className="flex items-center justify-between gap-3 rounded-lg border bg-card p-3.5">
                <div className="flex flex-col">
                  <span className="font-mono text-sm">{device.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {device.model} · {device.appVersion}
                  </span>
                </div>
                {deviceMeta && (
                  <StatusBadge label={deviceMeta.label} tone={deviceMeta.tone} />
                )}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed bg-muted/20 p-4 text-center text-sm text-muted-foreground">
                Chưa được gán thiết bị
              </div>
            )}
          </DetailSection>

          <DetailSection title="Thông tin">
            <div className="flex flex-col gap-1.5 rounded-lg border bg-muted/30 p-3.5">
              <DetailRow label="Cơ sở" value={facilityName(collaborator.facilityId)} />
              <DetailRow
                label="Ngày tham gia"
                value={formatDate(collaborator.joinedAt)}
              />
              <DetailRow
                label="Số video đã ghi"
                value={<span className="tabular-nums">{collaborator.videosRecorded}</span>}
              />
            </div>
          </DetailSection>

          <DetailSection title="Lịch sử gán thiết bị">
            <ol className="flex flex-col gap-3 border-l pl-4">
              {collaborator.assignmentHistory.length === 0 && (
                <li className="text-sm text-muted-foreground">Chưa có lịch sử</li>
              )}
              {collaborator.assignmentHistory.map((h, i) => (
                <li key={i} className="relative">
                  <span className="absolute top-1 -left-[1.3rem] size-2 rounded-full bg-primary ring-2 ring-background" />
                  <p className="font-mono text-sm">{h.deviceName}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(h.from)} – {h.to ? formatDate(h.to) : "hiện tại"}
                  </p>
                </li>
              ))}
            </ol>
          </DetailSection>
        </>
      )}
    </DetailDrawer>
  )
}
