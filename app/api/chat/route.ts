import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { LangChainAdapter, type Message } from "ai";
import { getSession } from "@/lib/auth";

export const runtime = "edge";
export const maxDuration = 30;

type KnowledgeMatch = { id: string; content: string; similarity: number };

async function retrieveContext(query: string) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;
  if (!url || !key || !openaiKey) return [] as KnowledgeMatch[];
  const embeddings = new OpenAIEmbeddings({ apiKey: openaiKey, model: "text-embedding-3-small" });
  const queryEmbedding = await embeddings.embedQuery(query);
  const response = await fetch(`${url}/rest/v1/rpc/match_knowledge_documents`, {
    method: "POST",
    headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query_embedding: queryEmbedding, match_threshold: 0.65, match_count: 5 }),
  });
  if (!response.ok) return [] as KnowledgeMatch[];
  return response.json() as Promise<KnowledgeMatch[]>;
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return new Response("未登录", { status: 401 });
  if (!process.env.OPENAI_API_KEY) return new Response("尚未配置 OPENAI_API_KEY", { status: 503 });
  const { messages }: { messages: Message[] } = await request.json();
  const latest = [...messages].reverse().find((message) => message.role === "user")?.content ?? "";
  const matches = await retrieveContext(latest);
  const context = matches.length ? matches.map((item, index) => `[资料 ${index + 1}] ${item.content}`).join("\n\n") : "暂无匹配的内部资料。";
  const system = `你是具身智能与机器人研究院的会议室预约助手。回答应简洁、准确、使用中文。你可以解释预约规则、时间冲突和会议组织建议，但不能声称已经替用户完成预约；需要预约时，引导用户前往“预约会议室”页面。当前用户：${session.displayName}（${session.role === "admin" ? "管理员" : "教师"}）。\n\n可参考的内部资料：\n${context}`;
  const langchainMessages = [
    new SystemMessage(system),
    ...messages.map((message) => message.role === "user" ? new HumanMessage(message.content) : new AIMessage(message.content)),
  ];
  const model = new ChatOpenAI({ apiKey: process.env.OPENAI_API_KEY, model: process.env.OPENAI_MODEL ?? "gpt-4o-mini", temperature: 0.2, streaming: true });
  const stream = await model.stream(langchainMessages);
  return LangChainAdapter.toDataStreamResponse(stream);
}
