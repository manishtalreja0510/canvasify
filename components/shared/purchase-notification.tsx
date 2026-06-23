"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package } from "lucide-react";

const NOTIFICATIONS = [
  { name: "Priya S.", location: "Mumbai", product: "Canvas Kit", time: "2 mins ago" },
  { name: "Rahul K.", location: "Bangalore", product: "Digital Download", time: "5 mins ago" },
  { name: "Ananya P.", location: "Delhi", product: "Framed Artwork", time: "8 mins ago" },
  { name: "Vikram M.", location: "Pune", product: "Canvas Kit", time: "12 mins ago" },
  { name: "Meera I.", location: "Chennai", product: "Digital Download", time: "15 mins ago" },
  { name: "Arjun S.", location: "Hyderabad", product: "Canvas Kit", time: "20 mins ago" },
];

export function PurchaseNotification() {
  const [current, setCurrent] = useState<(typeof NOTIFICATIONS)[0] | null>(null);
  const [index, setIndex] = useState(0);

  const show = useCallback(() => {
    setCurrent(NOTIFICATIONS[index % NOTIFICATIONS.length]);
    setIndex((i) => i + 1);
    setTimeout(() => setCurrent(null), 4000);
  }, [index]);

  useEffect(() => {
    const first = setTimeout(show, 5000);
    const interval = setInterval(show, 15000);
    return () => {
      clearTimeout(first);
      clearInterval(interval);
    };
  }, [show]);

  return (
    <AnimatePresence>
      {current && (
        <motion.div
          key={current.name + index}
          initial={{ opacity: 0, x: -40, y: 0 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="fixed bottom-20 left-6 z-30"
        >
          <div className="glass rounded-xl p-3 flex items-center gap-3 border border-[rgba(255,255,255,0.08)] shadow-[0_8px_32px_rgba(0,0,0,0.4)] max-w-[240px]">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[rgba(0,208,132,0.2)] to-[rgba(0,208,132,0.1)] border border-[rgba(0,208,132,0.2)] flex items-center justify-center shrink-0">
              <Package className="w-4 h-4 text-[#00D084]" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white leading-tight truncate">
                {current.name} from {current.location}
              </p>
              <p className="text-[10px] text-[#94A3B8] truncate">
                just ordered {current.product}
              </p>
              <p className="text-[9px] text-[#94A3B8] mt-0.5">{current.time}</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
