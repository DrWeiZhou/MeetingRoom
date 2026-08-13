# 具身智能与机器人研究院会议室预定系统

基于 Next.js 15 App Router、Tailwind CSS / Shadcn 风格组件、Supabase PostgreSQL（pgvector）、Drizzle ORM 与 Vercel AI SDK 的响应式会议室预约系统。

## 功能

- 教师注册、登录和首次登录强制修改初始密码
- 周一至周日、以半小时为单位、支持连续多个时间块的会议室预约
- 数据库级排斥约束，避免并发请求产生重复预约
- 申请人、参与人员、会议室、时间段与会议主题的完整记录
- 管理员管理教师和会议室、代为预约、填写理由驳回预约
- AI SDK `useChat` 流式交互；Edge Runtime + `LangChainAdapter`
- Supabase pgvector 知识库与 `device_type` 来源记录
- 手机全宽、桌面最大宽度限制，以及适合触控的交互尺寸

## 本地启动

要求 Node.js 20 或更高版本，以及一个启用了 PostgreSQL 的 Supabase 项目。

```bash
cp .env.example .env.local
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

访问 `http://localhost:3000`。初始化管理员账号为 `liujia`，初始化教师与管理员的密码均为 `123456`，登录后必须修改。

> 初始化数据严格保留需求中的房间号：第一会议室和小会议室均为 1007。系统以房间名称区分，不对房间号设置唯一约束。

## 环境变量

| 变量 | 用途 |
| --- | --- |
| `DATABASE_URL` | Supabase Transaction Pooler 或直连 PostgreSQL 地址 |
| `AUTH_SECRET` | 至少 32 字符，用于签发 HTTP-only 会话 Cookie |
| `OPENAI_API_KEY` | AI 助手与查询向量生成；不配置时只有 AI 助手不可用 |
| `OPENAI_MODEL` | 可选，默认 `gpt-4o-mini` |
| `SUPABASE_URL` | Edge Route 通过 REST RPC 访问 pgvector |
| `SUPABASE_SERVICE_ROLE_KEY` | 仅服务端使用，不得添加 `NEXT_PUBLIC_` 前缀 |

数据库迁移会启用 `vector` 与 `btree_gist` 扩展、创建表、并添加 `match_knowledge_documents` RPC。种子脚本可重复执行，不会重复创建教师或会议室。

## 数据库与冲突规则

应用层在写入前查询冲突，数据库层还有 `meetings_no_room_overlap` 排斥约束。时间区间采用左闭右开 `[start, end)`，因此 10:00 结束的会议与 10:00 开始的会议不冲突。只有状态为 `approved` 的会议占用时段；管理员驳回后时段立即释放。

RAG 文档向量列在 Drizzle 中定义为 `vector(1536)`。可由后续采集流程写入 `knowledge_documents`；AI Route 会使用 `text-embedding-3-small` 查询相似资料。

## Vercel 部署

1. 将上述环境变量添加到 Vercel Project Settings。
2. 在首次部署前对生产 Supabase 执行 `npm run db:migrate && npm run db:seed`。
3. 正常执行 `npm run build` 部署。`app/api/chat/route.ts` 已显式设置 `runtime = "edge"`，业务数据写操作使用 Server Actions。

## 验证命令

```bash
npm test
npm run typecheck
npm run lint
npm run build
```
