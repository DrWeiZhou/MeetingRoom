import { Clock } from "@phosphor-icons/react/dist/ssr";
import { chinaDateKey, getWeekDays } from "@/lib/calendar";
import { formatDateTime } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/status-badge";

type Meeting = {
  id: string; subject: string; startAt: Date; endAt: Date; status: "approved" | "rejected" | "cancelled";
  roomName: string; roomNumber: string; applicantName: string; participants: string[]; rejectionReason: string | null;
};

export function WeekSchedule({ start, meetings }: { start: Date; meetings: Meeting[] }) {
  const days = getWeekDays(start);
  return <div className="overflow-hidden rounded-2xl border border-[#d6dfdc] bg-white"><div className="hidden grid-cols-7 border-b border-[#dce4e1] bg-[#f7f9f8] md:grid">{days.map((day) => <div key={day.key} className="border-r border-[#e1e7e5] p-3 last:border-r-0"><strong className="block text-xs">{day.label}</strong><span className="font-[family-name:var(--font-geist-mono)] text-[11px] text-[#74817e]">{day.day}</span></div>)}</div><div className="hidden min-h-72 grid-cols-7 divide-x divide-[#e1e7e5] md:grid">{days.map((day) => <div key={day.key} className="min-w-0 space-y-2 p-2">{meetings.filter((meeting) => chinaDateKey(meeting.startAt) === day.key).map((meeting) => <article key={meeting.id} className="rounded-xl border border-[#cfe0db] bg-[#f0f8f6] p-2.5"><p className="truncate text-xs font-semibold">{meeting.subject}</p><p className="mt-1 font-[family-name:var(--font-geist-mono)] text-[10px] text-[#596762]">{formatDateTime(meeting.startAt).slice(-5)}–{formatDateTime(meeting.endAt).slice(-5)}</p><p className="mt-2 truncate text-[10px] text-[#6c7875]">{meeting.roomName}</p></article>)}</div>)}</div><div className="divide-y divide-[#e1e7e5] md:hidden">{days.map((day) => { const list = meetings.filter((meeting) => chinaDateKey(meeting.startAt) === day.key); return <section key={day.key} className="grid grid-cols-[64px_1fr]"><div className="bg-[#f7f9f8] p-3"><strong className="block text-xs">{day.label}</strong><span className="text-[11px] text-[#74817e]">{day.day}</span></div><div className="min-h-16 space-y-2 p-2">{list.length ? list.map((meeting) => <article key={meeting.id} className="rounded-xl border border-[#d4e2de] bg-[#f3f9f7] p-3"><div className="flex items-start justify-between gap-2"><strong className="text-sm">{meeting.subject}</strong><StatusBadge status={meeting.status} /></div><p className="mt-2 flex items-center gap-1 text-xs text-[#62706c]"><Clock size={14} />{formatDateTime(meeting.startAt).slice(-5)}–{formatDateTime(meeting.endAt).slice(-5)} · {meeting.roomName}</p></article>) : <p className="px-2 py-3 text-xs text-[#97a19e]">空闲</p>}</div></section>; })}</div></div>;
}
