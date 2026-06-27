"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Area,
  AreaChart,
} from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { devicesByFacilityChart, uploadTrendChart } from "@/lib/mock-data"

const barConfig = {
  "thiết bị": { label: "Thiết bị", color: "var(--chart-1)" },
} satisfies ChartConfig

const lineConfig = {
  GB: { label: "Dung lượng (GB)", color: "var(--chart-2)" },
} satisfies ChartConfig

export function DevicesByFacilityChart() {
  const data = devicesByFacilityChart()
  return (
    <Card className="gap-2">
      <CardHeader>
        <CardTitle className="text-sm">Thiết bị theo cơ sở</CardTitle>
        <CardDescription>Phân bổ thiết bị tại từng điểm thu thập</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={barConfig} className="h-[240px] w-full">
          <BarChart data={data} margin={{ left: -16, right: 8, top: 8 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              fontSize={12}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              fontSize={12}
              allowDecimals={false}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(_, payload) =>
                    payload?.[0]?.payload?.fullName ?? ""
                  }
                />
              }
            />
            <Bar dataKey="thiết bị" fill="var(--color-thiết bị)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export function UploadTrendChart() {
  const data = uploadTrendChart()
  return (
    <Card className="gap-2">
      <CardHeader>
        <CardTitle className="text-sm">Lượng video upload (30 ngày)</CardTitle>
        <CardDescription>Tổng dung lượng đồng bộ lên GCS mỗi ngày</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={lineConfig} className="h-[240px] w-full">
          <AreaChart data={data} margin={{ left: -16, right: 8, top: 8 }}>
            <defs>
              <linearGradient id="fillUpload" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-GB)" stopOpacity={0.35} />
                <stop offset="95%" stopColor="var(--color-GB)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="ngày"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              fontSize={11}
              interval={4}
            />
            <YAxis tickLine={false} axisLine={false} fontSize={12} width={40} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              dataKey="GB"
              type="monotone"
              stroke="var(--color-GB)"
              strokeWidth={2}
              fill="url(#fillUpload)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
