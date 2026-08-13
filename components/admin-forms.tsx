"use client";

import { useActionState } from "react";
import { createRoomAction, createTeacherAction, rejectMeetingAction } from "@/app/actions/admin";
import type { ActionState } from "@/app/actions/meetings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

function Feedback({ state }: { state: ActionState }) {
  if (state.error) return <p role="alert" className="rounded-xl bg-[#fff0ed] px-3 py-2 text-sm text-[#873832]">{state.error}</p>;
  if (state.success) return <p role="status" className="rounded-xl bg-[#effaf7] px-3 py-2 text-sm text-[#056353]">{state.success}</p>;
  return null;
}

export function CreateRoomForm() {
  const [state, action, pending] = useActionState(createRoomAction, {} as ActionState);
  return <form action={action} className="grid gap-4 sm:grid-cols-2"><div className="space-y-2"><label className="field-label" htmlFor="name">会议室名称</label><Input id="name" name="name" required placeholder="例如：协作会议室" /></div><div className="space-y-2"><label className="field-label" htmlFor="roomNumber">房间号</label><Input id="roomNumber" name="roomNumber" required placeholder="例如：1008" /></div><div className="space-y-2"><label className="field-label" htmlFor="capacity">容纳人数</label><Input id="capacity" name="capacity" required placeholder="例如：12 人" /></div><div className="space-y-2"><label className="field-label" htmlFor="facilities">设施</label><Input id="facilities" name="facilities" placeholder="投影、白板、视频会议" /></div><div className="sm:col-span-2"><Feedback state={state} /></div><Button disabled={pending} className="sm:col-span-2">{pending ? "正在添加…" : "添加会议室"}</Button></form>;
}

export function CreateTeacherForm() {
  const [state, action, pending] = useActionState(createTeacherAction, {} as ActionState);
  return <form action={action} className="grid gap-4 sm:grid-cols-2"><div className="space-y-2"><label className="field-label" htmlFor="displayName">教师姓名</label><Input id="displayName" name="displayName" required /></div><div className="space-y-2"><label className="field-label" htmlFor="username">全拼用户名</label><Input id="username" name="username" required autoCapitalize="none" /></div><div className="sm:col-span-2"><Feedback state={state} /></div><Button disabled={pending} className="sm:col-span-2">{pending ? "正在创建…" : "创建教师账号"}</Button></form>;
}

export function RejectMeetingForm({ id }: { id: string }) {
  const [state, action, pending] = useActionState(rejectMeetingAction, {} as ActionState);
  return <form action={action} className="space-y-3"><input type="hidden" name="id" value={id} /><label className="field-label" htmlFor={`reason-${id}`}>驳回理由</label><Textarea id={`reason-${id}`} name="rejectionReason" required minLength={4} placeholder="说明无法使用该会议室的原因…" /><Feedback state={state} /><Button variant="danger" disabled={pending} className="w-full sm:w-auto">{pending ? "正在驳回…" : "确认驳回"}</Button></form>;
}
