import { cn } from "@/lib/utils";

const labels = { approved: "已预约", rejected: "已驳回", cancelled: "已取消" } as const;

export function StatusBadge({ status }: { status: keyof typeof labels }) {
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-semibold", status === "approved" && "bg-[#dff3ed] text-[#056353]", status === "rejected" && "bg-[#f5e4e2] text-[#8b3833]", status === "cancelled" && "bg-[#e9eeec] text-[#5a6663]")}>
      {labels[status]}
    </span>
  );
}
