"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C5CFF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#060816] disabled:pointer-events-none disabled:opacity-40 cursor-pointer select-none",
  {
    variants: {
      variant: {
        primary:
          "bg-[#7C5CFF] text-white hover:bg-[#9B7FFF] shadow-[0_0_30px_rgba(124,92,255,0.3)] hover:shadow-[0_0_50px_rgba(124,92,255,0.5)] rounded-xl",
        secondary:
          "bg-transparent border border-[rgba(255,255,255,0.12)] text-white hover:border-[rgba(124,92,255,0.5)] hover:bg-[rgba(124,92,255,0.08)] rounded-xl",
        accent:
          "bg-[#00E5FF] text-[#060816] font-bold hover:bg-[#33ECFF] shadow-[0_0_30px_rgba(0,229,255,0.3)] rounded-xl",
        ghost:
          "text-[#94A3B8] hover:text-white hover:bg-[rgba(255,255,255,0.05)] rounded-xl",
        destructive:
          "bg-red-600 text-white hover:bg-red-700 rounded-xl",
        gradient:
          "bg-gradient-to-r from-[#7C5CFF] to-[#00E5FF] text-white font-bold shadow-[0_0_40px_rgba(124,92,255,0.3)] hover:shadow-[0_0_60px_rgba(124,92,255,0.5)] rounded-xl hover:scale-[1.02]",
        glass:
          "bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-white backdrop-blur-sm hover:bg-[rgba(255,255,255,0.08)] rounded-xl",
        link: "text-[#7C5CFF] underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        xs: "h-7 px-3 text-xs rounded-lg",
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-sm",
        lg: "h-13 px-8 text-base",
        xl: "h-14 px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  magnetic?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, children, icon, iconRight, magnetic, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        whileTap={{ scale: 0.97 }}
        whileHover={magnetic ? { scale: 1.02 } : undefined}
        {...(props as React.ComponentProps<typeof motion.button>)}
      >
        {loading ? (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        ) : (
          icon
        )}
        {children}
        {iconRight && !loading && iconRight}
      </motion.button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
