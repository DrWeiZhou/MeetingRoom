import Link from "next/link";
import { ArrowRight, CalendarCheck, CheckCircle, DoorOpen, UsersThree } from "@phosphor-icons/react/dist/ssr";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { rooms } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { getChinaWeekRange } from "@/lib/calendar";
import { listMeetingsInRange } from "@/lib/queries";
import { Button } from "@/components/ui/button";
import { WeekSchedule } from "@/components/week-schedule";

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ booking?: string }> }) {
  const { booking } = await searchParams;
  const user = await requireUser();
  const { start, end } = getChinaWeekRange();
  const [allMeetings, activeRooms] = await Promise.all([listMeetingsInRange(start, end), getDb().select({ id: rooms.id }).from(rooms).where(eq(rooms.isActive, true))]);
  const myMeetings = allMeetings.filter((meeting) => meeting.applicantId === user.id);
  return <div className="page-container py-7 sm:py-10">{booking === "success" && <div role="status" aria-live="polite" className="mb-6 flex items-start gap-3 rounded-2xl border border-[#acd9ce] bg-[#effaf7] px-4 py-3.5 text-sm font-medium text-[#056353]"><CheckCircle aria-hidden weight="fill" className="mt-0.5 shrink-0" size={20} /><span>预约成功，会议室已自动通过，可在下方周视图中查看。</span></div>}<header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><p className="font-[family-name:var(--font-geist-mono)] text-xs font-semibold tracking-[0.15em] text-[#087c68]">WEEKLY OVERVIEW</p><h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">{user.displayName}，本周安排</h1><p className="mt-2 text-sm text-[#65726f]">查看研究院会议室占用与自己的会议。</p></div><Button asChild size="lg"><Link href="/dashboard/book">新建预约<ArrowRight size={18} /></Link></Button></header><section className="mb-8 grid gap-3 sm:grid-cols-3"><Link href="/dashboard/my-meetings" className="panel focus-ring flex items-center gap-4 p-5 transition hover:border-[#9bc8bd] hover:bg-[#fbfefd]"><span className="grid h-11 w-11 place-items-center rounded-xl bg-[#dff3ed] text-[#087c68]"><CalendarCheck size={23} /></span><div><strong className="block text-2xl">{myMeetings.filter((m) => m.status === "approved").length}</strong><span className="text-xs text-[#6b7874]">我的本周会议</span></div><ArrowRight aria-hidden className="ml-auto text-[#087c68]" size={18} /></Link><div className="panel flex items-center gap-4 p-5"><span className="grid h-11 w-11 place-items-center rounded-xl bg-[#e8efed] text-[#40514d]"><DoorOpen size={23} /></span><div><strong className="block text-2xl">{activeRooms.length}</strong><span className="text-xs text-[#6b7874]">可用会议室</span></div></div><div className="panel flex items-center gap-4 p-5"><span className="grid h-11 w-11 place-items-center rounded-xl bg-[#e5f0ed] text-[#335f56]"><UsersThree size={23} /></span><div><strong className="block text-2xl">{allMeetings.filter((m) => m.status === "approved").length}</strong><span className="text-xs text-[#6b7874]">本周全部预约</span></div></div></section><section><div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-semibold">会议室周视图</h2></div><WeekSchedule start={start} meetings={allMeetings} /></section></div>;
}
