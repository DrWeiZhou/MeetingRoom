import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn("focus-ring h-12 w-full rounded-xl border border-[#cbd7d3] bg-white px-3.5 text-base text-[#17211f] placeholder:text-[#7b8885] disabled:bg-[#eef2f1] sm:text-sm", className)}
      {...props}
    />
  ),
);
Input.displayName = "Input";
