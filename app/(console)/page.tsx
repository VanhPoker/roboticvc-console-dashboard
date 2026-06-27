"use client"

import { useRouter } from "next/navigation"
import {
  Building2Icon,
  UsersIcon,
  WifiIcon,
  ClapperboardIcon,
  HardDriveIcon,
  ChevronRightIcon,
} from "lucide-react"
import { KpiCard } from "@/components/console/kpi-card"
import {
  DevicesByFacilityChart,
  UploadTrendChart,
} from "@/components/console/dashboard-charts"
import { StatusBadge } from "@/components/console/status-badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  facilities,
  collaborators,
  devices,
  deviceStatusCounts,
  facilityName,
  collaboratorName,
  pendingVideoCount,
  totalGcsUsedTb,
} from "@/lib/mock-data"
import { deviceStatusMeta } from "@/lib/labels"
import { formatRelativeTime } from "@/lib/format"

export default function DashboardPage() {
  const router = useRouter()
  const counts = deviceStatusCounts()
  const online = (counts.online ?? 0) + (counts.uploading ?? 0) + (counts.updating ?? 0)
  const offline = (counts.offline ?? 0) + (counts.error ?? 0)

  const attention = devices
    .filter((d) => d.status === "offline" || d.status === "error" || d.offlineQueue >= 8)
    .sort((a, b) => b.offlineQueue - a.offlineQueue)
    .slice(0, 8)

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <KpiCard label="Cơ sở" value={facilities.length} icon={Building2Icon} sub={`${facilities.filter((f) => f.status === "active").length} đang hoạt động`} />
        <KpiCard label="Cộng tác viên" value={collaborators.length} icon={UsersIcon} accent="info" sub={`${collaborators.filter((c) => c.status === "active").length} đang làm việc`} />
        <KpiCard label="Thiết bị trực tuyến" value={`${online}/${devices.length}`} icon={WifiIcon} accent="success" sub={`${offline} ngoại tuyến / lỗi`} />
        <KpiCard label="Video chờ xử lý" value={pendingVideoCount} icon={ClapperboardIcon} accent="warning" sub="đang tải lên / xử lý" />
        <KpiCard label="Dung lượng GCS" value={`${totalGcsUsedTb} TB`} icon={HardDriveIcon} accent="neutral" sub="đã sử dụng" />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <DevicesByFacilityChart />
        <UploadTrendChart />
      </div>

      <Card className="gap-0 py-0">
        <CardHeader className="flex flex-row items-center justify-between border-b py-4">
          <div>
            <CardTitle className="text-sm">Thiết bị cần chú ý</CardTitle>
            <CardDescription>
              Thiết bị ngoại tuyến, lỗi hoặc có hàng đợi offline cao
            </CardDescription>
          </div>
          <StatusBadge label={`${attention.length} cảnh báo`} tone="warning" dot={false} />
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="text-xs">Thiết bị</TableHead>
                  <TableHead className="text-xs">Cơ sở</TableHead>
                  <TableHead className="text-xs">CTV</TableHead>
                  <TableHead className="text-xs">Trạng thái</TableHead>
                  <TableHead className="text-right text-xs">Hàng đợi</TableHead>
                  <TableHead className="text-right text-xs">Last seen</TableHead>
                  <TableHead className="w-8" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {attention.map((d) => {
                  const meta = deviceStatusMeta[d.status]
                  return (
                    <TableRow
                      key={d.id}
                      className="cursor-pointer"
                      onClick={() => router.push(`/thiet-bi?q=${encodeURIComponent(d.name)}`)}
                    >
                      <TableCell className="font-medium">{d.name}</TableCell>
                      <TableCell className="text-muted-foreground">{facilityName(d.facilityId)}</TableCell>
                      <TableCell className="text-muted-foreground">{collaboratorName(d.collaboratorId)}</TableCell>
                      <TableCell>
                        <StatusBadge label={meta.label} tone={meta.tone} pulse={d.status === "uploading"} />
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        <span className={d.offlineQueue >= 8 ? "font-semibold text-danger" : ""}>
                          {d.offlineQueue}
                        </span>
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground tabular-nums">
                        {formatRelativeTime(d.lastSeenMinutes)}
                      </TableCell>
                      <TableCell>
                        <ChevronRightIcon className="size-4 text-muted-foreground" />
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
