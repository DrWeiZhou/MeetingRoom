import Link from "next/link";

const links = [
  ["/dashboard/admin/meetings", "预约管理"],
  ["/dashboard/admin/rooms", "会议室"],
  ["/dashboard/admin/teachers", "人员"],
] as const;

export function AdminTabs() {
  return <nav aria-label="管理功能" className="mb-6 flex gap-2 overflow-x-auto pb-1 lg:hidden">{links.map(([href, label]) => <Link key={href} href={href} className="focus-ring min-h-11 shrink-0 rounded-xl border border-[#ccd8d4] bg-white px-4 py-3 text-sm font-semibold text-[#42504d]">{label}</Link>)}</nav>;
}
