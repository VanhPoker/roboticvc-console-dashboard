"use client"

import { VideoIcon } from "lucide-react"
import {
  DetailDrawer,
  DetailRow,
  DetailSection,
} from "@/components/console/detail-drawer"
import { StatusBadge } from "@/components/console/status-badge"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { streamLabels, videoStatusMeta } from "@/lib/labels"
import { collaboratorName, deviceName, facilityName } from "@/lib/mock-data"
import { formatDateTime, formatDuration, formatGb } from "@/lib/format"
import type { VideoAsset } from "@/lib/types"

export function VideoDetail({
  video,
  open,
  onOpenChange,
}: {
  video: VideoAsset | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const meta = video ? videoStatusMeta[video.status] : null

  return (
    <DetailDrawer
      open={open}
      onOpenChange={onOpenChange}
      title={<span className="font-mono">{video?.sessionCode ?? ""}</span>}
      description={video ? formatDateTime(video.recordedAt) : ""}
      badge={meta && <StatusBadge label={meta.label} tone={meta.tone} />}
      footer={
        <>
          <Button size="sm" disabled={video?.status !== "ready"}>
            Tải xuống
          </Button>
          <Button size="sm" variant="outline" disabled={video?.status === "archived"}>
            Lưu trữ
          </Button>
        </>
      }
    >
      {video && (
        <>
          <DetailSection title="Luồng dữ liệu">
            <div className="grid grid-cols-3 gap-2">
              {video.streams.map((s) => (
                <div
                  key={s}
                  className="flex aspect-video flex-col items-center justify-center gap-1.5 rounded-lg border bg-muted/40"
                >
                  <VideoIcon className="size-5 text-muted-foreground" />
                  <span className="text-[11px] font-medium text-muted-foreground">
                    {streamLabels[s] ?? s}
                  </span>
                </div>
              ))}
            </div>
          </DetailSection>

          <DetailSection title="Nguồn">
            <div className="flex flex-col gap-1.5 rounded-lg border bg-muted/30 p-3.5">
              <DetailRow label="Cơ sở" value={facilityName(video.facilityId)} />
              <DetailRow label="Cộng tác viên" value={collaboratorName(video.collaboratorId)} />
              <DetailRow label="Thiết bị" value={<span className="font-mono text-sm">{deviceName(video.deviceId)}</span>} />
            </div>
          </DetailSection>

          <DetailSection title="Thông số">
            <div className="flex flex-col gap-1.5 rounded-lg border bg-muted/30 p-3.5">
              <DetailRow label="Thời lượng" value={formatDuration(video.durationMin)} />
              <DetailRow label="Dung lượng" value={formatGb(video.sizeGb)} />
              <DetailRow
                label="Số luồng"
                value={
                  <div className="flex flex-wrap justify-end gap-1">
                    {video.streams.map((s) => (
                      <Badge key={s} variant="secondary" className="text-[10px]">
                        {streamLabels[s] ?? s}
                      </Badge>
                    ))}
                  </div>
                }
              />
              <DetailRow label="Thời điểm quay" value={formatDateTime(video.recordedAt)} />
            </div>
          </DetailSection>
        </>
      )}
    </DetailDrawer>
  )
}
