import { asc } from "drizzle-orm";
import { UsersThree } from "@phosphor-icons/react/dist/ssr";
import { toggleTeacherAction } from "@/app/actions/admin";
import { CreateTeacherForm, UpdateTeacherForm } from "@/components/admin-forms";
import { AdminTabs } from "@/components/admin-tabs";
import { Button } from "@/components/ui/button";
import { getDb } from "@/db";
import { users } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";

export const metadata = { title: "人员管理" };

export default async function TeachersAdminPage() {
  const current = await requireAdmin();
  const list = await getDb().select({ id: users.id, displayName: users.displayName, username: users.username, role: users.role, isActive: users.isActive, mustChangePassword: users.mustChangePassword }).from(users).orderBy(asc(users.displayName));
  return <div className="page-container py-7 sm:py-10"><header className="mb-7"><p className="font-[family-name:var(--font-geist-mono)] text-xs font-semibold tracking-[0.15em] text-[#087c68]">ADMIN / PEOPLE</p><h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">人员管理</h1><p className="mt-2 text-sm text-[#65726f]">当前共 {list.length} 个账号。</p></header><AdminTabs /><div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]"><section className="space-y-3">{list.map((teacher) => <article key={teacher.id} className="panel p-4 sm:p-5"><UpdateTeacherForm teacher={teacher} /><div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-[#e3e9e7] pt-3"><div className="flex items-center gap-3 text-xs"><span>{teacher.role === "admin" ? "管理员" : "教师"}</span><span className={`font-semibold ${teacher.isActive ? "text-[#087c68]" : "text-[#8a5550]"}`}>{teacher.isActive ? (teacher.mustChangePassword ? "待改密码" : "正常") : "已停用"}</span></div>{teacher.id !== current.id ? <form action={toggleTeacherAction}><input type="hidden" name="id" value={teacher.id} /><input type="hidden" name="isActive" value={String(teacher.isActive)} /><Button variant="ghost" size="sm">{teacher.isActive ? "停用" : "恢复"}</Button></form> : <span className="text-right text-xs text-[#89938f]">当前账号</span>}</div></article>)}</section><aside className="panel h-fit p-5 sm:p-6"><div className="mb-5 flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#dff3ed] text-[#087c68]"><UsersThree size={21} /></span><div><h2 className="font-semibold">新增教师</h2><p className="text-xs text-[#6b7874]">初始密码统一为 123456</p></div></div><CreateTeacherForm /></aside></div></div>;
}
