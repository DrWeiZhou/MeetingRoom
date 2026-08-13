import { asc } from "drizzle-orm";
import { DoorOpen } from "@phosphor-icons/react/dist/ssr";
import { toggleRoomAction, updateRoomAction } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreateRoomForm } from "@/components/admin-forms";
import { getDb } from "@/db";
import { rooms } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";

export const metadata = { title: "会议室管理" };

export default async function RoomsAdminPage() {
  await requireAdmin();
  const list = await getDb().select().from(rooms).orderBy(asc(rooms.createdAt));
  return <div className="page-container py-7 sm:py-10"><header className="mb-7"><p className="font-[family-name:var(--font-geist-mono)] text-xs font-semibold tracking-[0.15em] text-[#087c68]">ADMIN / SPACES</p><h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">会议室管理</h1></header><div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]"><section className="space-y-3">{list.map((room) => <article key={room.id} className="panel p-4 sm:p-5"><form action={updateRoomAction} className="grid items-end gap-3 sm:grid-cols-2 lg:grid-cols-[1.2fr_0.7fr_0.7fr_1.3fr_auto]"><input type="hidden" name="id" value={room.id} /><div className="space-y-1.5"><label className="text-xs font-semibold">名称</label><Input name="name" defaultValue={room.name} /></div><div className="space-y-1.5"><label className="text-xs font-semibold">房间号</label><Input name="roomNumber" defaultValue={room.roomNumber} /></div><div className="space-y-1.5"><label className="text-xs font-semibold">容量</label><Input name="capacity" defaultValue={room.capacity} /></div><div className="space-y-1.5"><label className="text-xs font-semibold">设施</label><Input name="facilities" defaultValue={room.facilities} /></div><Button variant="secondary" type="submit">保存</Button></form><div className="mt-3 flex items-center justify-between border-t border-[#e3e9e7] pt-3"><span className={`text-xs font-semibold ${room.isActive ? "text-[#087c68]" : "text-[#8a5550]"}`}>{room.isActive ? "可预约" : "已停用"}</span><form action={toggleRoomAction}><input type="hidden" name="id" value={room.id} /><input type="hidden" name="isActive" value={String(room.isActive)} /><Button variant="ghost" size="sm">{room.isActive ? "停用" : "恢复"}</Button></form></div></article>)}</section><aside className="panel h-fit p-5 sm:p-6"><div className="mb-5 flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#dff3ed] text-[#087c68]"><DoorOpen size={21} /></span><div><h2 className="font-semibold">新增会议室</h2><p className="text-xs text-[#6b7874]">名称和房间号可独立设置</p></div></div><CreateRoomForm /></aside></div></div>;
}
