"use client";

import { useActionState, useMemo, useState } from "react";
import { CheckCircle, MagnifyingGlass, UsersThree } from "@phosphor-icons/react";
import { createMeetingAction, type ActionState } from "@/app/actions/meetings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Room = { id: string; name: string; roomNumber: string; capacity: string; facilities: string };
type Teacher = { id: string; displayName: string; username: string };

export function BookingForm({ rooms, teachers, currentUserId }: { rooms: Room[]; teachers: Teacher[]; currentUserId: string }) {
  const [state, action, pending] = useActionState(createMeetingAction, {} as ActionState);
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => teachers.filter((teacher) => teacher.id !== currentUserId && `${teacher.displayName}${teacher.username}`.toLowerCase().includes(query.toLowerCase())), [teachers, currentUserId, query]);
  return (
    <form action={action} className="space-y-7">
      <section className="panel p-5 sm:p-7"><div className="mb-5 flex items-center gap-3"><span className="font-[family-name:var(--font-geist-mono)] text-xs font-bold text-[#087c68]">01</span><h2 className="text-lg font-semibold">会议与空间</h2></div><div className="grid gap-5 md:grid-cols-2"><div className="space-y-2 md:col-span-2"><label className="field-label" htmlFor="subject">会议主题</label><Input id="subject" name="subject" required minLength={2} maxLength={120} placeholder="例如：具身导航算法周会" /></div><fieldset className="md:col-span-2"><legend className="field-label mb-3">选择会议室</legend><div className="grid gap-3 sm:grid-cols-3">{rooms.map((room) => <label key={room.id} className="has-[:checked]:border-[#087c68] has-[:checked]:bg-[#edf8f5] relative flex min-h-24 cursor-pointer flex-col justify-between rounded-xl border border-[#d4ddda] bg-white p-4 transition active:scale-[0.99]"><input className="peer sr-only" type="radio" name="roomId" value={room.id} required /><span className="text-sm font-semibold">{room.name}</span><span className="font-[family-name:var(--font-geist-mono)] text-xs text-[#6b7874]">ROOM {room.roomNumber}</span><CheckCircle weight="fill" className="absolute right-3 top-3 hidden text-[#087c68] peer-checked:block" size={19} /></label>)}</div></fieldset></div></section>
      <section className="panel p-5 sm:p-7"><div className="mb-5 flex items-center gap-3"><span className="font-[family-name:var(--font-geist-mono)] text-xs font-bold text-[#087c68]">02</span><h2 className="text-lg font-semibold">日期与时间</h2></div><div className="grid gap-5 sm:grid-cols-2"><div className="space-y-2"><label className="field-label" htmlFor="startAt">开始时间</label><Input id="startAt" name="startAt" type="datetime-local" step={1800} required /><p className="field-help">支持周一至周日，整点或半点开始</p></div><div className="space-y-2"><label className="field-label" htmlFor="endAt">结束时间</label><Input id="endAt" name="endAt" type="datetime-local" step={1800} required /><p className="field-help">可连续跨越多个半小时时间块</p></div></div></section>
      <section className="panel p-5 sm:p-7"><div className="mb-5 flex items-center gap-3"><span className="font-[family-name:var(--font-geist-mono)] text-xs font-bold text-[#087c68]">03</span><h2 className="text-lg font-semibold">参与人员</h2></div><div className="relative mb-4"><MagnifyingGlass aria-hidden className="absolute left-3.5 top-3.5 text-[#71807c]" size={19} /><Input value={query} onChange={(event) => setQuery(event.target.value)} className="pl-11" placeholder="搜索姓名或用户名" /></div><div className="max-h-72 overflow-y-auto rounded-xl border border-[#d8e1de]"><div className="grid grid-cols-1 divide-y divide-[#e5ebe9] sm:grid-cols-2 sm:divide-y-0">{filtered.map((teacher) => <label key={teacher.id} className="flex min-h-14 cursor-pointer items-center gap-3 px-4 py-2 hover:bg-[#f3f7f6]"><input name="participantIds" value={teacher.id} type="checkbox" className="h-5 w-5 accent-[#087c68]" /><span className="min-w-0"><strong className="block text-sm">{teacher.displayName}</strong><small className="text-[#74817e]">{teacher.username}</small></span></label>)}</div>{filtered.length === 0 && <p className="p-6 text-center text-sm text-[#6b7874]">未找到匹配的教师</p>}</div><p className="mt-3 flex items-center gap-2 text-xs text-[#6b7874]"><UsersThree size={16} />参与人可多选，不包含申请人本人</p></section>
      {state.error && <p role="alert" className="rounded-xl border border-[#e5bdb8] bg-[#fff4f2] px-4 py-3 text-sm font-medium text-[#873832]">{state.error}</p>}
      {state.success && <p role="status" className="rounded-xl border border-[#acd9ce] bg-[#effaf7] px-4 py-3 text-sm font-medium text-[#056353]">{state.success}</p>}
      <div className="sticky bottom-20 z-10 rounded-2xl border border-[#d4ddda] bg-white/90 p-3 backdrop-blur lg:bottom-4"><Button type="submit" size="lg" className="w-full sm:w-auto sm:min-w-48" disabled={pending}>{pending ? "正在校验时段…" : "确认预约"}</Button><span className="ml-4 hidden text-xs text-[#687571] sm:inline">无冲突将自动预约成功</span></div>
    </form>
  );
}
