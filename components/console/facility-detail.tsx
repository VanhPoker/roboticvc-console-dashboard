"use client"

import { MapPinIcon, PhoneIcon, UserIcon } from "lucide-react"
import {
  DetailDrawer,
  DetailRow,
  DetailSection,
} from "@/components/console/detail-drawer"
import { StatusBadge } from "@/components/console/status-badge"
import { StatTile } from "@/components/console/stat-tile"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  collaborators,
  devices,
  videoAssets,
} from "@/lib/mock-data"
import { deviceStatusMeta, facilityStatusMeta } from "@/lib/labels"
import { formatGb } from "@/lib/format"
import type { Facility } from "@/lib/types"

export function FacilityDetail({
  facility,
  open,
  onOpenChange,
}: {
  facility: Facility | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const facDevices = facility
    ? devices.filter((d) => d.facilityId === facility.id)
    : []
  const facCollabs = facility
    ? collaborators.filter((c) => c.facilityId === facility.id)
    : []
  const facVideos = facility
    ? videoAssets.filter((v) => v.facilityId === facility.id)
    : []
  const onlineCount = facDevices.filter(
    (d) => d.status === "online" || d.status === "uploading",
  ).length
  const issueCount = facDevices.filter(
    (d) => d.status === "error" || d.status === "offline",
  ).length

  const meta = facility ? facilityStatusMeta[facility.status] : null

  return (
    <DetailDrawer
      open={open}
      onOpenChange={onOpenChange}
      title={facility?.name ?? ""}
      description={facility ? `Mã cơ sở ${facility.code} · ${facility.region}` : ""}
      badge={meta && <StatusBadge label={meta.label} tone={meta.tone} />}
      footer={
        <>
          <Button size="sm">Chỉnh sửa cơ sở</Button>
          <Button size="sm" variant="outline">
            Xem thiết bị
          </Button>
        </>
      }
    >
      {facility && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <StatTile label="Thiết bị" value={facDevices.length} tone="info" />
            <StatTile label="Đang hoạt động" value={onlineCount} tone="success" />
            <StatTile label="Cộng tác viên" value={facCollabs.length} tone="neutral" />
            <StatTile label="Cần chú ý" value={issueCount} tone={issueCount > 0 ? "danger" : "neutral"} />
          </div>

          <DetailSection title="Thông tin liên hệ">
            <div className="flex flex-col gap-2.5 rounded-lg border bg-muted/30 p-3.5">
              <div className="flex items-center gap-2.5 text-sm">
                <MapPinIcon className="size-4 shrink-0 text-muted-foreground" />
                <span>{facility.address}</span>
              </div>
              <Separator />
              <div className="flex items-center gap-2.5 text-sm">
                <UserIcon className="size-4 shrink-0 text-muted-foreground" />
                <span>{facility.contactName}</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm">
                <PhoneIcon className="size-4 shrink-0 text-muted-foreground" />
                <span className="font-mono">{facility.contactPhone}</span>
              </div>
            </div>
          </DetailSection>

          <DetailSection title={`Thiết bị tại cơ sở (${facDevices.length})`}>
            <div className="flex flex-col gap-1.5">
              {facDevices.slice(0, 8).map((d) => {
                const dm = deviceStatusMeta[d.status]
                return (
                  <div
                    key={d.id}
                    className="flex items-center justify-between gap-3 rounded-md border bg-card px-3 py-2 text-sm"
                  >
                    <span className="font-mono text-xs">{d.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">
                        {formatGb(d.totalStorageGb - d.freeStorageGb)} dùng
                      </span>
                      <StatusBadge label={dm.label} tone={dm.tone} dot={false} />
                    </div>
                  </div>
                )
              })}
              {facDevices.length > 8 && (
                <p className="px-1 pt-1 text-xs text-muted-foreground">
                  +{facDevices.length - 8} thiết bị khác
                </p>
              )}
            </div>
          </DetailSection>

          <DetailSection title="Tổng quan dữ liệu">
            <div className="flex flex-col gap-1.5 rounded-lg border bg-muted/30 p-3.5">
              <DetailRow label="Số phiên video" value={facVideos.length} />
              <DetailRow
                label="Dung lượng đã ghi"
                value={formatGb(facVideos.reduce((s, v) => s + v.sizeGb, 0))}
              />
              <DetailRow
                label="Tổng thời lượng"
                value={`${Math.round(facVideos.reduce((s, v) => s + v.durationMin, 0) / 60)} giờ`}
              />
            </div>
          </DetailSection>
        </>
      )}
    </DetailDrawer>
  )
}
