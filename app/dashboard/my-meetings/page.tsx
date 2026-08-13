import Link from "next/link";
import { ArrowLeft, CalendarBlank, Clock, DoorOpen, PencilSimple, UsersThree } from "@phosphor-icons/react/dist/ssr";
import { requireUser } from "@/lib/auth";
import { getChinaWeekRange } from "@/lib/calendar";
import { listMeetingsInRange } from "@/lib/queries";
import { formatDateTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CancelMeetingForm } from "@/components/cancel-meeting-form";

export const metadata = { title: "我的本周会议" };

export default async function MyMeetingsPage({ searchParams }: { searchParams: Promise<{ updated?: string }> }) {
  const [{ updated }, user] = await Promise.all([searchParams, requireUser()]);
  const { start, end } = getChinaWeekRange();
  const meetings = (await listMeetingsInRange(start, end)).filter((meeting) => meeting.applicantId === user.id && meeting.status === "approved");
  const now = new Date();

  return (
    <div className="page-container py-7 sm:py-10">
      <Button asChild variant="ghost" size="sm" className="mb-5"><Link href="/dashboard"><ArrowLeft size={16} />返回总览</Link></Button>
      {updated === "success" && <div role="status" className="mb-6 rounded-2xl border border-[#acd9ce] bg-[#effaf7] px-4 py-3.5 text-sm font-medium text-[#056353]">预约已更新。</div>}
      <header className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="font-[family-name:var(--font-geist-mono)] text-xs font-semibold tracking-[0.15em] text-[#087c68]">MY WEEKLY MEETINGS</p><h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">我的本周会议</h1><p className="mt-2 text-sm text-[#65726f]">查看、编辑或删除本周由你发起的预约。</p></div>
        <Button asChild><Link href="/dashboard/book"><CalendarBlank size={18} />新建预约</Link></Button>
      </header>
      <div className="space-y-4">
        {meetings.map((meeting) => {
          const canManage = meeting.startAt > now;
          return <article key={meeting.id} className="panel p-5 sm:p-6"><div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between"><div className="min-w-0"><h2 className="text-lg font-semibold">{meeting.subject}</h2><div className="mt-4 grid gap-3 text-sm sm:grid-cols-3"><p className="flex items-center gap-2 text-[#53615e]"><Clock className="shrink-0 text-[#087c68]" size={17} /><span>{formatDateTime(meeting.startAt)} — {formatDateTime(meeting.endAt).slice(-5)}</span></p><p className="flex items-center gap-2 text-[#53615e]"><DoorOpen className="shrink-0 text-[#087c68]" size={17} /><span>{meeting.roomName}（{meeting.roomNumber}）</span></p><p className="flex items-center gap-2 text-[#53615e]"><UsersThree className="shrink-0 text-[#087c68]" size={17} /><span>{meeting.participants.join("、") || "未选择参与人员"}</span></p></div></div>{canManage ? <div className="flex shrink-0 flex-wrap gap-2"><Button asChild variant="secondary" size="sm"><Link href={`/dashboard/my-meetings/${meeting.id}/edit`}><PencilSimple size={16} />编辑</Link></Button><CancelMeetingForm id={meeting.id} /></div> : <span className="shrink-0 rounded-full bg-[#eef1f0] px-3 py-1.5 text-xs font-medium text-[#6b7874]">会议已开始，无法修改</span>}</div></article>;
        })}
        {meetings.length === 0 && <div className="panel grid place-items-center gap-4 p-10 text-center"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#e8f3f0] text-[#087c68]"><CalendarBlank size={24} /></span><div><h2 className="font-semibold">本周暂无预约</h2><p className="mt-1 text-sm text-[#6b7874]">新建预约后会显示在这里。</p></div><Button asChild variant="secondary"><Link href="/dashboard/book">预约会议室</Link></Button></div>}
      </div>
    </div>
  );
}
