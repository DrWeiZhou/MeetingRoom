import { AuthForm } from "@/components/auth-form";

export default function RegisterPage() {
  return <div className="mx-auto w-full max-w-md"><div className="mb-8"><p className="mb-2 font-[family-name:var(--font-geist-mono)] text-xs font-semibold tracking-[0.16em] text-[#087c68]">ROOM OS / 注册</p><h2 className="text-3xl font-semibold tracking-[-0.035em]">创建教师账号</h2><p className="mt-2 text-sm leading-6 text-[#66736f]">账号仅供研究院内部教师使用。</p></div><div className="panel p-5 sm:p-7"><AuthForm mode="register" /></div></div>;
}
