import { Key } from "@phosphor-icons/react/dist/ssr";
import { requireUser } from "@/lib/auth";
import { ChangePasswordForm } from "@/components/change-password-form";

export default async function ChangePasswordPage() {
  const user = await requireUser({ allowPasswordChange: true });
  return <main className="grid min-h-[100dvh] place-items-center px-4 py-10"><div className="w-full max-w-md"><div className="panel p-6 sm:p-8"><span className="mb-6 grid h-12 w-12 place-items-center rounded-xl bg-[#dff3ed] text-[#087c68]"><Key size={24} /></span><h1 className="text-2xl font-semibold tracking-[-0.03em]">{user.displayName}，请先修改密码</h1><p className="mb-7 mt-2 text-sm leading-6 text-[#66736f]">为了账号安全，首次登录必须设置新的个人密码。</p><ChangePasswordForm /></div></div></main>;
}
