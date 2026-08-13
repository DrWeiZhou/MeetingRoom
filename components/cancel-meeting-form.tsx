"use client";

import { useActionState } from "react";
import { Trash } from "@phosphor-icons/react";
import { cancelMeetingAction, type ActionState } from "@/app/actions/meetings";
import { Button } from "@/components/ui/button";

export function CancelMeetingForm({ id }: { id: string }) {
  const [state, action, pending] = useActionState(cancelMeetingAction, {} as ActionState);
  return (
    <form action={action} onSubmit={(event) => { if (!window.confirm("确定删除这条预约吗？删除后将释放该时段。")) event.preventDefault(); }}>
      <input type="hidden" name="id" value={id} />
      <Button type="submit" variant="danger" size="sm" disabled={pending}><Trash aria-hidden size={16} />{pending ? "删除中…" : "删除预约"}</Button>
      {state.error && <p role="alert" className="mt-2 text-xs font-medium text-[#873832]">{state.error}</p>}
    </form>
  );
}
