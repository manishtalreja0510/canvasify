import * as React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
  hover?: boolean;
  gradient?: boolean;
}

function Card({ className, glass, hover, gradient, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[#0D1323] transition-all duration-300",
        glass && "bg-[rgba(13,19,35,0.6)] backdrop-blur-xl",
        hover && "hover:border-[rgba(124,92,255,0.25)] hover:shadow-[0_8px_40px_rgba(124,92,255,0.12)] hover:-translate-y-1",
        gradient && "bg-gradient-to-br from-[#0D1323] to-[#060816]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-6 pb-0", className)} {...props}>
      {children}
    </div>
  );
}

function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn("text-xl font-bold text-white leading-tight", className)} {...props}>
      {children}
    </h3>
  );
}

function CardDescription({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-[#94A3B8] text-sm mt-2 leading-relaxed", className)} {...props}>
      {children}
    </p>
  );
}

function CardContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-6", className)} {...props}>
      {children}
    </div>
  );
}

function CardFooter({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-6 pt-0 flex items-center", className)} {...props}>
      {children}
    </div>
  );
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
