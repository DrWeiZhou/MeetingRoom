import { requireAdmin } from "@/lib/auth";
import { listMeetingsInRange } from "@/lib/queries";
import { formatDateTime } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/status-badge";
import { RejectMeetingForm } from "@/components/admin-forms";
import { AdminTabs } from "@/components/admin-tabs";

export const metadata = { title: "预约管理" };

export default async function MeetingsAdminPage() {
  await requireAdmin();
  const start = new Date(Date.now() - 30 * 86400000);
  const end = new Date(Date.now() + 90 * 86400000);
  const list = await listMeetingsInRange(start, end);
  return <div className="page-container py-7 sm:py-10"><header className="mb-7"><p className="font-[family-name:var(--font-geist-mono)] text-xs font-semibold tracking-[0.15em] text-[#087c68]">ADMIN / RESERVATIONS</p><h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">预约管理</h1><p className="mt-2 text-sm text-[#65726f]">管理员可登记会议，也可填写理由驳回已自动通过的预约。</p></header><AdminTabs /><div className="space-y-4">{list.map((meeting) => <article key={meeting.id} className="panel grid gap-5 p-5 lg:grid-cols-[minmax(0,1fr)_380px]"><div><div className="flex flex-wrap items-center gap-3"><h2 className="text-lg font-semibold">{meeting.subject}</h2><StatusBadge status={meeting.status} /></div><dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2"><div><dt className="text-xs text-[#74817e]">会议室</dt><dd className="mt-1 font-medium">{meeting.roomName}（{meeting.roomNumber}）</dd></div><div><dt className="text-xs text-[#74817e]">时间</dt><dd className="mt-1 font-medium">{formatDateTime(meeting.startAt)} — {formatDateTime(meeting.endAt).slice(-5)}</dd></div><div><dt className="text-xs text-[#74817e]">申请人</dt><dd className="mt-1 font-medium">{meeting.applicantName}</dd></div><div><dt className="text-xs text-[#74817e]">参与人员</dt><dd className="mt-1 font-medium">{meeting.participants.join("、") || "未选择"}</dd></div></dl>{meeting.rejectionReason && <p className="mt-4 rounded-xl bg-[#fff2ef] px-3 py-2 text-sm text-[#873832]">驳回理由：{meeting.rejectionReason}</p>}</div>{meeting.status === "approved" ? <div className="border-t border-[#e1e7e5] pt-4 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0"><RejectMeetingForm id={meeting.id} /></div> : <div className="grid place-items-center rounded-xl bg-[#f5f7f6] p-4 text-sm text-[#7b8783]">该预约已结束处理</div>}</article>)}{list.length === 0 && <div className="panel p-10 text-center text-sm text-[#6b7874]">当前时间范围内暂无预约</div>}</div></div>;
}
