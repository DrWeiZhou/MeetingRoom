import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { getOwnedMeeting, listActiveRooms, listActiveTeachers } from "@/lib/queries";
import { Button } from "@/components/ui/button";
import { EditMeetingForm } from "@/components/edit-meeting-form";

export const metadata = { title: "编辑预约" };

export default async function EditMeetingPage({ params }: { params: Promise<{ id: string }> }) {
  const [{ id }, user] = await Promise.all([params, requireUser()]);
  const parsedId = z.string().uuid().safeParse(id);
  if (!parsedId.success) notFound();
  const [meeting, rooms, teachers] = await Promise.all([getOwnedMeeting(parsedId.data, user.id), listActiveRooms(), listActiveTeachers()]);
  if (!meeting || meeting.startAt <= new Date()) notFound();

  return <div className="page-container py-7 sm:py-10"><Button asChild variant="ghost" size="sm" className="mb-5"><Link href="/dashboard/my-meetings"><ArrowLeft size={16} />返回我的会议</Link></Button><header className="mb-7"><p className="font-[family-name:var(--font-geist-mono)] text-xs font-semibold tracking-[0.15em] text-[#087c68]">EDIT RESERVATION</p><h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">编辑预约</h1><p className="mt-2 text-sm text-[#65726f]">修改后会重新校验会议室时段冲突。</p></header><EditMeetingForm meeting={meeting} rooms={rooms} teachers={teachers} currentUserId={user.id} /></div>;
}
