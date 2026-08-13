import { AuthForm } from "@/components/auth-form";

export default function LoginPage() {
  return <div className="mx-auto w-full max-w-md"><div className="mb-8"><p className="mb-2 font-[family-name:var(--font-geist-mono)] text-xs font-semibold tracking-[0.16em] text-[#087c68]">ROOM OS / 登录</p><h2 className="text-3xl font-semibold tracking-[-0.035em]">欢迎回来</h2><p className="mt-2 text-sm leading-6 text-[#66736f]">使用姓名全拼账号登录，初始密码为 123456。</p></div><div className="panel p-5 sm:p-7"><AuthForm mode="login" /></div></div>;
}
