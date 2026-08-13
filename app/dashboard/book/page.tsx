import { requireUser } from "@/lib/auth";
import { listActiveRooms, listActiveTeachers } from "@/lib/queries";
import { BookingForm } from "@/components/booking-form";

export const metadata = { title: "预约会议室" };

export default async function BookPage() {
  const user = await requireUser();
  const [rooms, teachers] = await Promise.all([listActiveRooms(), listActiveTeachers()]);
  return <div className="page-container py-7 sm:py-10"><header className="mb-7"><p className="font-[family-name:var(--font-geist-mono)] text-xs font-semibold tracking-[0.15em] text-[#087c68]">NEW RESERVATION</p><h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">预约会议室</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-[#65726f]">选择连续的半小时时间块。系统会实时校验会议室冲突，无冲突即自动通过。</p></header><BookingForm rooms={rooms} teachers={teachers} currentUserId={user.id} /></div>;
}
