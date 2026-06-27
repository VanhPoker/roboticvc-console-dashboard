"use client"

import * as React from "react"
import { SearchInput } from "@/components/console/search-input"
import { FilterSelect } from "@/components/console/filter-select"
import { DataPagination } from "@/components/console/data-pagination"
import {
  DataTable,
  useSortedRows,
  type Column,
} from "@/components/console/data-table"
import { StatusBadge } from "@/components/console/status-badge"
import { StatTile } from "@/components/console/stat-tile"
import { Meter } from "@/components/console/meter"
import { DeviceDetail } from "@/components/console/device-detail"
import { devices, facilities, deviceStatusCounts, facilityName, collaboratorName } from "@/lib/mock-data"
import { deviceStatusMeta } from "@/lib/labels"
import { formatGb, formatRelativeTime } from "@/lib/format"
import type { Device, DeviceStatus } from "@/lib/types"

const PAGE_SIZE = 10

const facilityOptions = [
  { label: "Tất cả cơ sở", value: "all" },
  ...facilities.map((f) => ({ label: f.name, value: f.id })),
]

const statusOptions = [
  { label: "Tất cả trạng thái", value: "all" },
  ...Object.entries(deviceStatusMeta).map(([value, m]) => ({ label: m.label, value })),
]

const SUMMARY: { status: DeviceStatus }[] = [
  { status: "online" },
  { status: "uploading" },
  { status: "updating" },
  { status: "offline" },
  { status: "error" },
]

export default function DevicesPage() {
  const counts = deviceStatusCounts()
  const [query, setQuery] = React.useState("")
  const [facility, setFacility] = React.useState("all")
  const [status, setStatus] = React.useState("all")
  const [page, setPage] = React.useState(1)
  const [selected, setSelected] = React.useState<Device | null>(null)
  const [open, setOpen] = React.useState(false)

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    return devices.filter((d) => {
      if (facility !== "all" && d.facilityId !== facility) return false
      if (status !== "all" && d.status !== status) return false
      if (q && !`${d.name} ${d.hardwareId} ${d.model}`.toLowerCase().includes(q)) return false
      return true
    })
  }, [query, facility, status])

  const columns: Column<Device>[] = [
    {
      key: "name",
      header: "Thiết bị",
      sortable: true,
      sortValue: (d) => d.name,
      cell: (d) => (
        <div className="flex flex-col">
          <span className="font-mono font-medium">{d.name}</span>
          <span className="font-mono text-xs text-muted-foreground">{d.hardwareId}</span>
        </div>
      ),
    },
    {
      key: "facility",
      header: "Cơ sở",
      cell: (d) => <span className="text-sm">{facilityName(d.facilityId)}</span>,
    },
    {
      key: "collaborator",
      header: "CTV",
      cell: (d) => <span className="text-sm">{collaboratorName(d.collaboratorId)}</span>,
    },
    {
      key: "version",
      header: "Phiên bản",
      cell: (d) => <span className="font-mono text-xs">{d.appVersion}</span>,
    },
    {
      key: "storage",
      header: "Lưu trữ",
      cell: (d) => {
        const usedPct = Math.round(((d.totalStorageGb - d.freeStorageGb) / d.totalStorageGb) * 100)
        return (
          <div className="flex w-28 flex-col gap-1">
            <span className="text-xs tabular-nums text-muted-foreground">{formatGb(d.freeStorageGb)} trống</span>
            <Meter value={usedPct} tone={usedPct > 85 ? "danger" : usedPct > 65 ? "warning" : "success"} />
          </div>
        )
      },
    },
    {
      key: "queue",
      header: "Hàng đợi",
      align: "right",
      sortable: true,
      sortValue: (d) => d.offlineQueue,
      cell: (d) => <span className="tabular-nums">{d.offlineQueue}</span>,
    },
    {
      key: "lastSeen",
      header: "Hoạt động cuối",
      sortable: true,
      sortValue: (d) => d.lastSeenMinutes,
      cell: (d) => <span className="text-xs text-muted-foreground">{formatRelativeTime(d.lastSeenMinutes)}</span>,
    },
    {
      key: "status",
      header: "Trạng thái",
      sortable: true,
      sortValue: (d) => d.status,
      cell: (d) => {
        const m = deviceStatusMeta[d.status]
        return <StatusBadge label={m.label} tone={m.tone} pulse={d.status === "online"} />
      },
    },
  ]

  const { sorted, sortKey, sortDir, toggleSort } = useSortedRows(filtered, columns, "name")

  React.useEffect(() => {
    setPage(1)
  }, [query, facility, status])

  const paged = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {SUMMARY.map(({ status: s }) => {
          const m = deviceStatusMeta[s]
          return (
            <StatTile
              key={s}
              label={m.label}
              value={counts[s] ?? 0}
              tone={m.tone}
              active={status === s}
              onClick={() => setStatus((prev) => (prev === s ? "all" : s))}
            />
          )
        })}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Tìm theo tên, hardware ID, model..."
          className="w-full sm:w-72"
        />
        <FilterSelect value={facility} onChange={setFacility} options={facilityOptions} ariaLabel="Lọc theo cơ sở" className="w-52" />
        <FilterSelect value={status} onChange={setStatus} options={statusOptions} ariaLabel="Lọc theo trạng thái" className="w-44" />
      </div>

      <DataTable
        columns={columns}
        rows={paged}
        sortKey={sortKey}
        sortDir={sortDir}
        onSort={toggleSort}
        activeRowId={open ? selected?.id : null}
        onRowClick={(d) => {
          setSelected(d)
          setOpen(true)
        }}
        emptyMessage="Không tìm thấy thiết bị phù hợp"
      />

      <DataPagination page={page} pageSize={PAGE_SIZE} total={sorted.length} onPageChange={setPage} />

      <DeviceDetail device={selected} open={open} onOpenChange={setOpen} />
    </div>
  )
}
