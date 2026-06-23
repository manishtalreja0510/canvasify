import * as React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, iconRight, type, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-sm font-medium text-white/80">{label}</label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]">
              {icon}
            </div>
          )}
          <input
            type={type}
            ref={ref}
            className={cn(
              "w-full h-11 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-4 text-sm text-white placeholder:text-[#94A3B8] transition-all duration-200",
              "focus:outline-none focus:border-[rgba(124,92,255,0.5)] focus:bg-[rgba(124,92,255,0.05)] focus:shadow-[0_0_20px_rgba(124,92,255,0.1)]",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              icon && "pl-10",
              iconRight && "pr-10",
              error && "border-red-500/50 focus:border-red-500/70",
              className
            )}
            {...props}
          />
          {iconRight && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]">
              {iconRight}
            </div>
          )}
        </div>
        {error && (
          <p className="text-red-400 text-xs mt-0.5">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
