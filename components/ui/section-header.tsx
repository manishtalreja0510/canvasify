"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  badge?: string;
  title: string;
  highlight?: string;
  description?: string;
  centered?: boolean;
  className?: string;
}

export function SectionHeader({
  badge,
  title,
  highlight,
  description,
  centered = true,
  className,
}: SectionHeaderProps) {
  const titleParts = highlight
    ? title.split(highlight)
    : [title];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className={cn(
        "flex flex-col gap-4",
        centered && "items-center text-center",
        className
      )}
    >
      {badge && (
        <span className="badge-premium">
          {badge}
        </span>
      )}
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
        {titleParts[0]}
        {highlight && (
          <span className="gradient-text">{highlight}</span>
        )}
        {titleParts[1]}
      </h2>
      {description && (
        <p className={cn(
          "text-lg text-[#94A3B8] leading-relaxed",
          centered && "max-w-2xl mx-auto"
        )}>
          {description}
        </p>
      )}
    </motion.div>
  );
}
