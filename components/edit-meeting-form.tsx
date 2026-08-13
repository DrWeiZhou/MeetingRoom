"use client";

import { useActionState, useMemo, useState } from "react";
import { MagnifyingGlass, UsersThree } from "@phosphor-icons/react";
import { updateMeetingAction, type ActionState } from "@/app/actions/meetings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { combineDateAndTime, getHalfHourTimeSlots, toChinaDateTimeInputValues } from "@/lib/time";

type Room = { id: string; name: string; roomNumber: string; capacity: string; facilities: string };
type Teacher = { id: string; displayName: string; username: string };
type Meeting = { id: string; subject: string; roomId: string; startAt: Date; endAt: Date; participantIds: string[] };
const timeSlots = getHalfHourTimeSlots();
const selectClassName = "focus-ring h-12 w-full rounded-xl border border-[#cbd7d3] bg-white px-3.5 text-base text-[#17211f] sm:text-sm";

export function EditMeetingForm({ meeting, rooms, teachers, currentUserId }: { meeting: Meeting; rooms: Room[]; teachers: Teacher[]; currentUserId: string }) {
  const initialStart = toChinaDateTimeInputValues(meeting.startAt);
  const initialEnd = toChinaDateTimeInputValues(meeting.endAt);
  const [state, action, pending] = useActionState(updateMeetingAction, {} as ActionState);
  const [query, setQuery] = useState("");
  const [startDate, setStartDate] = useState(initialStart.date);
  const [startTime, setStartTime] = useState(initialStart.time);
  const [endDate, setEndDate] = useState(initialEnd.date);
  const [endTime, setEndTime] = useState(initialEnd.time);
  const filtered = useMemo(() => teachers.filter((teacher) => teacher.id !== currentUserId && `${teacher.displayName}${teacher.username}`.toLowerCase().includes(query.toLowerCase())), [teachers, currentUserId, query]);

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="id" value={meeting.id} />
      <section className="panel grid gap-5 p-5 sm:grid-cols-2 sm:p-7"><div className="space-y-2 sm:col-span-2"><label className="field-label" htmlFor="subject">会议主题</label><Input id="subject" name="subject" defaultValue={meeting.subject} required minLength={2} maxLength={120} /></div><div className="space-y-2 sm:col-span-2"><label className="field-label" htmlFor="roomId">会议室</label><select id="roomId" name="roomId" className={selectClassName} defaultValue={meeting.roomId} required>{rooms.map((room) => <option key={room.id} value={room.id}>{room.name}（{room.roomNumber}）</option>)}</select></div><fieldset className="space-y-3"><legend className="field-label">开始时间</legend><input type="hidden" name="startAt" value={combineDateAndTime(startDate, startTime)} /><div className="grid grid-cols-[minmax(0,1fr)_120px] gap-2"><Input aria-label="开始日期" type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} required /><select aria-label="开始时间" className={selectClassName} value={startTime} onChange={(event) => setStartTime(event.target.value)} required>{timeSlots.map((slot) => <option key={slot} value={slot}>{slot}</option>)}</select></div></fieldset><fieldset className="space-y-3"><legend className="field-label">结束时间</legend><input type="hidden" name="endAt" value={combineDateAndTime(endDate, endTime)} /><div className="grid grid-cols-[minmax(0,1fr)_120px] gap-2"><Input aria-label="结束日期" type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} required /><select aria-label="结束时间" className={selectClassName} value={endTime} onChange={(event) => setEndTime(event.target.value)} required>{timeSlots.map((slot) => <option key={slot} value={slot}>{slot}</option>)}</select></div></fieldset></section>
      <section className="panel p-5 sm:p-7"><div className="mb-4 flex items-center gap-3"><UsersThree className="text-[#087c68]" size={21} /><h2 className="font-semibold">参与人员</h2></div><div className="relative mb-4"><MagnifyingGlass aria-hidden className="absolute left-3.5 top-3.5 text-[#71807c]" size={19} /><Input value={query} onChange={(event) => setQuery(event.target.value)} className="pl-11" placeholder="搜索姓名或用户名" /></div><div className="max-h-72 overflow-y-auto rounded-xl border border-[#d8e1de]"><div className="grid divide-y divide-[#e5ebe9] sm:grid-cols-2 sm:divide-y-0">{filtered.map((teacher) => <label key={teacher.id} className="flex min-h-14 cursor-pointer items-center gap-3 px-4 py-2 hover:bg-[#f3f7f6]"><input name="participantIds" value={teacher.id} type="checkbox" defaultChecked={meeting.participantIds.includes(teacher.id)} className="h-5 w-5 accent-[#087c68]" /><span><strong className="block text-sm">{teacher.displayName}</strong><small className="text-[#74817e]">{teacher.username}</small></span></label>)}</div>{filtered.length === 0 && <p className="p-6 text-center text-sm text-[#6b7874]">未找到匹配的教师</p>}</div></section>
      {state.error && <p role="alert" className="rounded-xl border border-[#e5bdb8] bg-[#fff4f2] px-4 py-3 text-sm font-medium text-[#873832]">{state.error}</p>}
      <div className="sticky bottom-20 z-10 rounded-2xl border border-[#d4ddda] bg-white/90 p-3 backdrop-blur lg:bottom-4"><Button type="submit" size="lg" className="w-full sm:w-auto sm:min-w-48" disabled={pending}>{pending ? "正在保存…" : "保存修改"}</Button></div>
    </form>
  );
}
