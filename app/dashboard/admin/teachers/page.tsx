import { asc } from "drizzle-orm";
import { UsersThree } from "@phosphor-icons/react/dist/ssr";
import { toggleTeacherAction } from "@/app/actions/admin";
import { CreateTeacherForm } from "@/components/admin-forms";
import { Button } from "@/components/ui/button";
import { getDb } from "@/db";
import { users } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";

export const metadata = { title: "人员管理" };

export default async function TeachersAdminPage() {
  const current = await requireAdmin();
  const list = await getDb().select({ id: users.id, displayName: users.displayName, username: users.username, role: users.role, isActive: users.isActive, mustChangePassword: users.mustChangePassword }).from(users).orderBy(asc(users.displayName));
  return <div className="page-container py-7 sm:py-10"><header className="mb-7"><p className="font-[family-name:var(--font-geist-mono)] text-xs font-semibold tracking-[0.15em] text-[#087c68]">ADMIN / PEOPLE</p><h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">人员管理</h1><p className="mt-2 text-sm text-[#65726f]">当前共 {list.length} 个账号。</p></header><div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]"><section className="overflow-hidden rounded-2xl border border-[#d8e1de] bg-white"><div className="hidden grid-cols-[1fr_1fr_100px_100px_90px] gap-3 border-b border-[#dce4e1] bg-[#f7f9f8] px-5 py-3 text-xs font-semibold text-[#65726f] sm:grid"><span>姓名</span><span>用户名</span><span>角色</span><span>状态</span><span /></div>{list.map((teacher) => <article key={teacher.id} className="grid min-h-16 grid-cols-[1fr_auto] items-center gap-3 border-b border-[#e5ebe9] px-4 py-3 last:border-0 sm:grid-cols-[1fr_1fr_100px_100px_90px] sm:px-5"><strong className="text-sm">{teacher.displayName}</strong><span className="font-[family-name:var(--font-geist-mono)] text-xs text-[#62706c]">{teacher.username}</span><span className="hidden text-xs sm:block">{teacher.role === "admin" ? "管理员" : "教师"}</span><span className={`hidden text-xs font-semibold sm:block ${teacher.isActive ? "text-[#087c68]" : "text-[#8a5550]"}`}>{teacher.isActive ? (teacher.mustChangePassword ? "待改密码" : "正常") : "已停用"}</span>{teacher.id !== current.id ? <form action={toggleTeacherAction}><input type="hidden" name="id" value={teacher.id} /><input type="hidden" name="isActive" value={String(teacher.isActive)} /><Button variant="ghost" size="sm">{teacher.isActive ? "停用" : "恢复"}</Button></form> : <span className="text-right text-xs text-[#89938f]">当前账号</span>}</article>)}</section><aside className="panel h-fit p-5 sm:p-6"><div className="mb-5 flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#dff3ed] text-[#087c68]"><UsersThree size={21} /></span><div><h2 className="font-semibold">新增教师</h2><p className="text-xs text-[#6b7874]">初始密码统一为 123456</p></div></div><CreateTeacherForm /></aside></div></div>;
}
