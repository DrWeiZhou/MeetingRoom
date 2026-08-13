import * as React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea ref={ref} className={cn("focus-ring min-h-24 w-full resize-y rounded-xl border border-[#cbd7d3] bg-white px-3.5 py-3 text-base placeholder:text-[#7b8885] sm:text-sm", className)} {...props} />
  ),
);
Textarea.displayName = "Textarea";
