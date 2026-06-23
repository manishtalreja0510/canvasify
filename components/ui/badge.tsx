import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full font-semibold text-xs px-3 py-1 transition-all duration-200",
  {
    variants: {
      variant: {
        default: "bg-[rgba(124,92,255,0.15)] border border-[rgba(124,92,255,0.3)] text-[#B48EFF]",
        accent: "bg-[rgba(0,229,255,0.12)] border border-[rgba(0,229,255,0.25)] text-[#00E5FF]",
        success: "bg-[rgba(0,208,132,0.12)] border border-[rgba(0,208,132,0.25)] text-[#00D084]",
        warning: "bg-[rgba(245,158,11,0.12)] border border-[rgba(245,158,11,0.25)] text-[#F59E0B]",
        error: "bg-[rgba(239,68,68,0.12)] border border-[rgba(239,68,68,0.25)] text-red-400",
        muted: "bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.08)] text-[#94A3B8]",
        glass: "bg-[rgba(255,255,255,0.06)] backdrop-blur-sm border border-[rgba(255,255,255,0.08)] text-white",
        new: "bg-gradient-to-r from-[#7C5CFF] to-[#00E5FF] text-white border-0",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {children}
    </span>
  );
}

export { Badge, badgeVariants };
