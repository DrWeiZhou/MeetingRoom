"use client";

import { useActionState, useMemo, useState } from "react";
import { CheckCircle, MagnifyingGlass, UsersThree } from "@phosphor-icons/react";
import { createMeetingAction, type ActionState } from "@/app/actions/meetings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { combineDateAndTime, getHalfHourTimeSlots } from "@/lib/time";

type Room = { id: string; name: string; roomNumber: string; capacity: string; facilities: string };
type Teacher = { id: string; displayName: string; username: string };
const timeSlots = getHalfHourTimeSlots();

const selectClassName = "focus-ring h-12 w-full rounded-xl border border-[#cbd7d3] bg-white px-3.5 text-base text-[#17211f] sm:text-sm";

export function BookingForm({ rooms, teachers, currentUserId }: { rooms: Room[]; teachers: Teacher[]; currentUserId: string }) {
  const [state, action, pending] = useActionState(createMeetingAction, {} as ActionState);
  const [query, setQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const filtered = useMemo(() => teachers.filter((teacher) => teacher.id !== currentUserId && `${teacher.displayName}${teacher.username}`.toLowerCase().includes(query.toLowerCase())), [teachers, currentUserId, query]);
  return (
    <form action={action} className="space-y-7">
      <section className="panel p-5 sm:p-7"><div className="mb-5 flex items-center gap-3"><span className="font-[family-name:var(--font-geist-mono)] text-xs font-bold text-[#087c68]">01</span><h2 className="text-lg font-semibold">会议与空间</h2></div><div className="grid gap-5 md:grid-cols-2"><div className="space-y-2 md:col-span-2"><label className="field-label" htmlFor="subject">会议主题</label><Input id="subject" name="subject" required minLength={2} maxLength={120} placeholder="例如：具身导航算法周会" /></div><fieldset className="md:col-span-2"><legend className="field-label mb-3">选择会议室</legend><div className="grid gap-3 sm:grid-cols-3">{rooms.map((room) => <label key={room.id} className="has-[:checked]:border-[#087c68] has-[:checked]:bg-[#edf8f5] relative flex min-h-24 cursor-pointer flex-col justify-between rounded-xl border border-[#d4ddda] bg-white p-4 transition active:scale-[0.99]"><input className="peer sr-only" type="radio" name="roomId" value={room.id} required /><span className="text-sm font-semibold">{room.name}</span><span className="font-[family-name:var(--font-geist-mono)] text-xs text-[#6b7874]">ROOM {room.roomNumber}</span><CheckCircle weight="fill" className="absolute right-3 top-3 hidden text-[#087c68] peer-checked:block" size={19} /></label>)}</div></fieldset></div></section>
      <section className="panel p-5 sm:p-7"><div className="mb-5 flex items-center gap-3"><span className="font-[family-name:var(--font-geist-mono)] text-xs font-bold text-[#087c68]">02</span><h2 className="text-lg font-semibold">日期与时间</h2></div><input type="hidden" name="startAt" value={combineDateAndTime(startDate, startTime)} /><input type="hidden" name="endAt" value={combineDateAndTime(endDate, endTime)} /><div className="grid gap-5 sm:grid-cols-2"><fieldset className="space-y-3"><legend className="field-label">开始时间</legend><div className="grid grid-cols-[minmax(0,1fr)_120px] gap-2"><div><label className="sr-only" htmlFor="startDate">开始日期</label><Input id="startDate" type="date" value={startDate} onChange={(event) => { const nextDate = event.target.value; setStartDate(nextDate); if (!endDate || endDate === startDate) setEndDate(nextDate); }} required /></div><div><label className="sr-only" htmlFor="startTime">开始时间块</label><select id="startTime" className={selectClassName} value={startTime} onChange={(event) => setStartTime(event.target.value)} required><option value="">选择时间</option>{timeSlots.map((slot) => <option key={slot} value={slot}>{slot}</option>)}</select></div></div><p className="field-help">支持周一至周日，只能选择整点或半点</p></fieldset><fieldset className="space-y-3"><legend className="field-label">结束时间</legend><div className="grid grid-cols-[minmax(0,1fr)_120px] gap-2"><div><label className="sr-only" htmlFor="endDate">结束日期</label><Input id="endDate" type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} required /></div><div><label className="sr-only" htmlFor="endTime">结束时间块</label><select id="endTime" className={selectClassName} value={endTime} onChange={(event) => setEndTime(event.target.value)} required><option value="">选择时间</option>{timeSlots.map((slot) => <option key={slot} value={slot}>{slot}</option>)}</select></div></div><p className="field-help">会议时长只能是 30 分钟的整数倍</p></fieldset></div></section>
      <section className="panel p-5 sm:p-7"><div className="mb-5 flex items-center gap-3"><span className="font-[family-name:var(--font-geist-mono)] text-xs font-bold text-[#087c68]">03</span><h2 className="text-lg font-semibold">参与人员</h2></div><div className="relative mb-4"><MagnifyingGlass aria-hidden className="absolute left-3.5 top-3.5 text-[#71807c]" size={19} /><Input value={query} onChange={(event) => setQuery(event.target.value)} className="pl-11" placeholder="搜索姓名或用户名" /></div><div className="max-h-72 overflow-y-auto rounded-xl border border-[#d8e1de]"><div className="grid grid-cols-1 divide-y divide-[#e5ebe9] sm:grid-cols-2 sm:divide-y-0">{filtered.map((teacher) => <label key={teacher.id} className="flex min-h-14 cursor-pointer items-center gap-3 px-4 py-2 hover:bg-[#f3f7f6]"><input name="participantIds" value={teacher.id} type="checkbox" className="h-5 w-5 accent-[#087c68]" /><span className="min-w-0"><strong className="block text-sm">{teacher.displayName}</strong><small className="text-[#74817e]">{teacher.username}</small></span></label>)}</div>{filtered.length === 0 && <p className="p-6 text-center text-sm text-[#6b7874]">未找到匹配的教师</p>}</div><p className="mt-3 flex items-center gap-2 text-xs text-[#6b7874]"><UsersThree size={16} />参与人可多选，不包含申请人本人</p></section>
      {state.error && <p role="alert" className="rounded-xl border border-[#e5bdb8] bg-[#fff4f2] px-4 py-3 text-sm font-medium text-[#873832]">{state.error}</p>}
      {state.success && <p role="status" className="rounded-xl border border-[#acd9ce] bg-[#effaf7] px-4 py-3 text-sm font-medium text-[#056353]">{state.success}</p>}
      <div className="sticky bottom-20 z-10 rounded-2xl border border-[#d4ddda] bg-white/90 p-3 backdrop-blur lg:bottom-4"><Button type="submit" size="lg" className="w-full sm:w-auto sm:min-w-48" disabled={pending}>{pending ? "正在校验时段…" : "确认预约"}</Button><span className="ml-4 hidden text-xs text-[#687571] sm:inline">无冲突将自动预约成功</span></div>
    </form>
  );
}
