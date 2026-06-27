import {
  LayoutDashboardIcon,
  Building2Icon,
  UsersIcon,
  CpuIcon,
  GitBranchIcon,
  VideoIcon,
  type LucideIcon,
} from "lucide-react"

export interface NavItem {
  label: string
  shortLabel: string
  href: string
  icon: LucideIcon
}

export const navItems: NavItem[] = [
  { label: "Tổng quan", shortLabel: "Tổng quan", href: "/", icon: LayoutDashboardIcon },
  { label: "Cơ sở", shortLabel: "Cơ sở", href: "/co-so", icon: Building2Icon },
  {
    label: "Cộng tác viên",
    shortLabel: "CTV",
    href: "/cong-tac-vien",
    icon: UsersIcon,
  },
  { label: "Thiết bị", shortLabel: "Thiết bị", href: "/thiet-bi", icon: CpuIcon },
  { label: "Phiên bản", shortLabel: "Phiên bản", href: "/phien-ban", icon: GitBranchIcon },
  {
    label: "Tài nguyên Video",
    shortLabel: "Video",
    href: "/video",
    icon: VideoIcon,
  },
]

export const pageTitles: Record<string, { title: string; description: string }> = {
  "/": {
    title: "Tổng quan",
    description: "Theo dõi toàn bộ đội thiết bị thu thập dữ liệu",
  },
  "/co-so": { title: "Cơ sở", description: "Quản lý các điểm thu thập dữ liệu" },
  "/cong-tac-vien": {
    title: "Cộng tác viên",
    description: "Quản lý nhân sự thu thập dữ liệu",
  },
  "/thiet-bi": {
    title: "Thiết bị",
    description: "Trạng thái và cấu hình thiết bị EGOkit",
  },
  "/phien-ban": {
    title: "Phiên bản",
    description: "Quản lý firmware và triển khai cập nhật",
  },
  "/video": {
    title: "Tài nguyên Video",
    description: "Dữ liệu video đa luồng đã thu thập",
  },
}
