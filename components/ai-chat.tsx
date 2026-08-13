"use client";

import { FormEvent, useEffect, useRef } from "react";
import { useChat } from "@ai-sdk/react";
import { ArrowUp, Robot, Sparkle, UserCircle } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const suggestions = ["如何避免预约时间冲突？", "帮我整理一份会前检查清单", "会议室预约有哪些规则？"];

export function AiChat() {
  const { messages, input, handleInputChange, handleSubmit, append, isLoading, error } = useChat({ api: "/api/chat" });
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }); }, [messages]);
  const submit = (event: FormEvent<HTMLFormElement>) => { handleSubmit(event); };
  return (
    <div className="panel flex min-h-[calc(100dvh-190px)] flex-col overflow-hidden lg:min-h-[680px]">
      <div className="flex items-center justify-between border-b border-[#dce4e1] bg-[#f8faf9] px-4 py-3 sm:px-5"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-[#123a32] text-white"><Robot size={20} /></span><div><strong className="block text-sm">空间协作助手</strong><span className="flex items-center gap-1 text-[11px] text-[#087c68]"><span className="h-1.5 w-1.5 rounded-full bg-[#19a287]" />流式响应</span></div></div><span className="hidden font-[family-name:var(--font-geist-mono)] text-[10px] text-[#7b8783] sm:block">LANGCHAIN / EDGE</span></div>
      <div ref={scrollRef} className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain p-4 sm:p-6">
        {messages.length === 0 && <div className="mx-auto flex max-w-xl flex-col items-center py-10 text-center"><span className="mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-[#dff3ed] text-[#087c68]"><Sparkle size={27} /></span><h2 className="text-xl font-semibold tracking-[-0.025em]">有什么可以协助你？</h2><p className="mt-2 max-w-md text-sm leading-6 text-[#687571]">询问预约规则、会议组织方法，或检索研究院内部会议资料。</p><div className="mt-6 grid w-full gap-2 sm:grid-cols-3">{suggestions.map((text) => <button key={text} onClick={() => append({ role: "user", content: text })} className="focus-ring min-h-12 rounded-xl border border-[#d4ddda] bg-white px-3 py-2 text-left text-xs font-medium leading-5 transition hover:border-[#8dbdb3] hover:bg-[#f0f8f6] active:translate-y-px">{text}</button>)}</div></div>}
        {messages.map((message) => <article key={message.id} className={`flex min-w-0 gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>{message.role !== "user" && <span className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#123a32] text-white"><Robot size={17} /></span>}<div className={`min-w-0 max-w-[88%] overflow-wrap-anywhere rounded-2xl px-4 py-3 text-sm leading-7 sm:max-w-[75%] ${message.role === "user" ? "bg-[#087c68] text-white" : "border border-[#dce4e1] bg-[#f8faf9] text-[#263431]"}`}><p className="whitespace-pre-wrap break-words [overflow-wrap:anywhere]">{message.content}</p></div>{message.role === "user" && <span className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#e7eeec] text-[#53615e]"><UserCircle size={18} /></span>}</article>)}
        {isLoading && <div className="flex gap-3"><span className="grid h-8 w-8 place-items-center rounded-lg bg-[#123a32] text-white"><Robot size={17} /></span><span className="flex items-center gap-1.5 rounded-2xl border border-[#dce4e1] bg-[#f8faf9] px-4 py-3"><i className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#087c68]" /><i className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#087c68] [animation-delay:150ms]" /><i className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#087c68] [animation-delay:300ms]" /></span></div>}
        {error && <p role="alert" className="rounded-xl border border-[#e5bdb8] bg-[#fff4f2] px-4 py-3 text-sm text-[#873832]">AI 服务暂时不可用：{error.message}</p>}
      </div>
      <form onSubmit={submit} className="border-t border-[#dce4e1] bg-white p-3 sm:p-4"><div className="relative"><Textarea name="prompt" value={input} onChange={handleInputChange} rows={2} className="max-h-36 min-h-14 pr-14" placeholder="输入你的问题…" /><Button aria-label="发送" type="submit" size="sm" className="absolute bottom-2 right-2 h-10 min-h-10 w-10 px-0" disabled={isLoading || !input.trim()}><ArrowUp size={18} /></Button></div><p className="mt-2 px-1 text-[11px] text-[#7b8783]">AI 回答仅作辅助，实际占用情况以预约页面为准。</p></form>
    </div>
  );
}
