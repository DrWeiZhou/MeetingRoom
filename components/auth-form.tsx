"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ArrowRight, LockKey, User } from "@phosphor-icons/react";
import { loginAction, registerAction, type AuthState } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const initialState: AuthState = {};

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const [state, action, pending] = useActionState(mode === "login" ? loginAction : registerAction, initialState);
  return (
    <form action={action} className="space-y-5">
      {mode === "register" && (
        <div className="space-y-2">
          <label className="field-label" htmlFor="displayName">姓名</label>
          <Input id="displayName" name="displayName" autoComplete="name" required placeholder="请输入真实姓名" />
        </div>
      )}
      <div className="space-y-2">
        <label className="field-label" htmlFor="username">用户名</label>
        <div className="relative"><User aria-hidden className="absolute left-3.5 top-3.5 text-[#71807c]" size={20} /><Input className="pl-11" id="username" name="username" autoCapitalize="none" autoComplete="username" required placeholder="姓名全拼" /></div>
      </div>
      <div className="space-y-2">
        <label className="field-label" htmlFor="password">密码</label>
        <div className="relative"><LockKey aria-hidden className="absolute left-3.5 top-3.5 text-[#71807c]" size={20} /><Input className="pl-11" id="password" name="password" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} required placeholder={mode === "login" ? "请输入密码" : "至少 6 位"} /></div>
      </div>
      {state.error && <p role="alert" className="rounded-xl border border-[#e5bdb8] bg-[#fff4f2] px-3 py-2 text-sm text-[#873832]">{state.error}</p>}
      <Button type="submit" size="lg" className="w-full" disabled={pending}>{pending ? "正在处理…" : mode === "login" ? "进入预约系统" : "创建教师账号"}<ArrowRight aria-hidden size={18} /></Button>
      <p className="text-center text-sm text-[#66736f]">{mode === "login" ? "首次使用？" : "已有账号？"}<Link className="ml-1 font-semibold text-[#087c68] underline-offset-4 hover:underline" href={mode === "login" ? "/register" : "/login"}>{mode === "login" ? "注册账号" : "返回登录"}</Link></p>
    </form>
  );
}
