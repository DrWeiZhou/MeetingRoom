"use client";

import { useActionState } from "react";
import { changePasswordAction, type AuthState } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ChangePasswordForm() {
  const [state, action, pending] = useActionState(changePasswordAction, {} as AuthState);
  return <form action={action} className="space-y-5"><div className="space-y-2"><label className="field-label" htmlFor="password">新密码</label><Input id="password" name="password" type="password" minLength={8} required autoComplete="new-password" /><p className="field-help">至少 8 位，请勿继续使用初始密码。</p></div><div className="space-y-2"><label className="field-label" htmlFor="confirmation">再次输入</label><Input id="confirmation" name="confirmation" type="password" minLength={8} required autoComplete="new-password" /></div>{state.error && <p role="alert" className="text-sm text-[#873832]">{state.error}</p>}<Button className="w-full" size="lg" disabled={pending}>{pending ? "正在更新…" : "保存新密码"}</Button></form>;
}
