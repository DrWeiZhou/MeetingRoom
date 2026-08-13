import { AiChat } from "@/components/ai-chat";

export const metadata = { title: "AI 助手" };

export default function AssistantPage() {
  return <div className="page-container py-7 sm:py-10"><header className="mb-6"><p className="font-[family-name:var(--font-geist-mono)] text-xs font-semibold tracking-[0.15em] text-[#087c68]">AI ASSISTANT</p><h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">空间协作助手</h1><p className="mt-2 text-sm text-[#65726f]">基于研究院知识库提供预约与会议组织建议。</p></header><AiChat /></div>;
}
