import Link from "next/link";
import {
  Atom,
  CalendarBlank,
  ChatCircleDots,
  DoorOpen,
  House,
  SignOut,
  UsersThree,
} from "@phosphor-icons/react/dist/ssr";
import type { SessionUser } from "@/lib/auth";
import { logoutAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";

const teacherLinks = [
  { href: "/dashboard", label: "总览", icon: House },
  { href: "/dashboard/book", label: "预约会议室", icon: CalendarBlank },
  { href: "/dashboard/assistant", label: "AI 助手", icon: ChatCircleDots },
];

const adminLinks = [
  { href: "/dashboard/admin/meetings", label: "预约管理", icon: CalendarBlank },
  { href: "/dashboard/admin/rooms", label: "会议室", icon: DoorOpen },
  { href: "/dashboard/admin/teachers", label: "人员", icon: UsersThree },
];

export function AppShell({ user, children }: { user: SessionUser; children: React.ReactNode }) {
  const links = user.role === "admin" ? [...teacherLinks, ...adminLinks] : teacherLinks;
  return (
    <div className="min-h-[100dvh] lg:grid lg:grid-cols-[248px_minmax(0,1fr)]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[248px] flex-col border-r border-[#d8e1de] bg-[#f9fbfa]/95 px-4 py-5 backdrop-blur lg:flex">
        <Link href="/dashboard" className="mb-8 flex items-center gap-3 px-2"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#123a32] text-white"><Atom size={23} /></span><span><strong className="block text-sm">会议室预定</strong><small className="text-[11px] text-[#6b7874]">具身智能研究院</small></span></Link>
        <nav aria-label="主导航" className="space-y-1">{links.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className="focus-ring flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium text-[#53605d] transition hover:bg-[#eaf0ee] hover:text-[#17211f]"><Icon size={19} />{label}</Link>)}</nav>
        <div className="mt-auto border-t border-[#dce4e1] pt-4"><div className="mb-3 flex items-center gap-3 px-2"><span className="grid h-9 w-9 place-items-center rounded-full bg-[#dff3ed] text-sm font-bold text-[#056353]">{user.displayName.slice(0, 1)}</span><span className="min-w-0"><strong className="block truncate text-sm">{user.displayName}</strong><small className="text-[#71807c]">{user.role === "admin" ? "管理员" : "教师"}</small></span></div><form action={logoutAction}><Button variant="ghost" className="w-full justify-start"><SignOut size={18} />退出登录</Button></form></div>
      </aside>
      <div className="min-w-0 lg:col-start-2">
        <header className="sticky top-0 z-20 border-b border-[#dce4e1] bg-[#f4f7f6]/92 backdrop-blur lg:hidden"><div className="flex h-16 items-center justify-between px-4"><Link href="/dashboard" className="flex items-center gap-2 font-semibold"><span className="grid h-9 w-9 place-items-center rounded-xl bg-[#123a32] text-white"><Atom size={20} /></span>会议室预定</Link><span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold">{user.displayName}</span></div></header>
        <main className="pb-24 lg:pb-10">{children}</main>
      </div>
      <nav aria-label="移动端导航" className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-3 rounded-2xl border border-[#ccd8d4] bg-white/95 p-1.5 shadow-[0_12px_30px_rgba(20,49,43,0.16)] backdrop-blur lg:hidden">{teacherLinks.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className="focus-ring flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-semibold text-[#5e6b68] active:bg-[#e8f1ee]"><Icon size={20} />{label}</Link>)}</nav>
    </div>
  );
}
