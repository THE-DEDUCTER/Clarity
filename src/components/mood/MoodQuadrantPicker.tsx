"use client";

import { motion } from "framer-motion";
import { X, Search } from "lucide-react";
import { Quadrant } from "@/lib/mood-data";

interface MoodQuadrantPickerProps {
  onSelect: (quadrant: Quadrant) => void;
  onClose?: () => void;
}

// ── Circle order matches the standard affect circumplex:
//   Top-left:     Red    = High Energy / Unpleasant
//   Top-right:    Yellow = High Energy / Pleasant
//   Bottom-left:  Blue   = Low Energy  / Unpleasant
//   Bottom-right: Green  = Low Energy  / Pleasant
const QUADRANTS = [
  {
    id: "high-unpleasant" as Quadrant,
    label: "High Energy\nUnpleasant",
    bg: "radial-gradient(circle at 35% 30%, #FF7A5C 0%, #FF2244 100%)",
    glow: "rgba(255,34,68,0.50)",
  },
  {
    id: "high-pleasant" as Quadrant,
    label: "High Energy\nPleasant",
    bg: "radial-gradient(circle at 35% 30%, #FFE870 0%, #FFA818 100%)",
    glow: "rgba(255,168,24,0.50)",
  },
  {
    id: "low-unpleasant" as Quadrant,
    label: "Low Energy\nUnpleasant",
    bg: "radial-gradient(circle at 35% 30%, #80CAFF 0%, #3372F0 100%)",
    glow: "rgba(51,114,240,0.50)",
  },
  {
    id: "low-pleasant" as Quadrant,
    label: "Low Energy\nPleasant",
    bg: "radial-gradient(circle at 35% 30%, #50EDAA 0%, #08BE7A 100%)",
    glow: "rgba(8,190,122,0.50)",
  },
];

export function MoodQuadrantPicker({ onSelect, onClose }: MoodQuadrantPickerProps) {
  return (
    <div
      className="absolute inset-0 w-full h-full bg-black flex flex-col overflow-hidden"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      {/* Serif two-line title */}
      <div className="flex-shrink-0 text-center mt-12 mb-8 px-8 select-none z-10">
        <p
          className="text-white font-medium leading-[1.45]"
          style={{
            fontFamily: "Georgia, 'Times New Roman', Times, serif",
            fontSize: 22,
          }}
        >
          Tap the color that best describes
          <br />
          how you feel right now
        </p>
      </div>

      {/* 2×2 tight circle cluster */}
      <div className="flex flex-col items-center justify-center flex-1 pb-10 px-4 z-10">
        <div className="grid grid-cols-2 gap-4">
          {QUADRANTS.map((q, i) => (
            <motion.button
              key={q.id}
              onClick={() => onSelect(q.id)}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: i * 0.08,
              }}
              className="relative flex items-center justify-center rounded-[40px] focus:outline-none w-[160px] h-[160px] sm:w-[180px] sm:h-[180px]"
              style={{
                background: q.bg,
                boxShadow: `0 0 44px ${q.glow}, 0 0 90px ${q.glow.replace("0.50", "0.18")}`,
                border: "1.5px solid rgba(255,255,255,0.13)",
              }}
            >
              {/* Top-left specular highlight */}
              <div
                className="absolute inset-0 rounded-[40px] pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle at 30% 26%, rgba(255,255,255,0.30) 0%, transparent 52%)",
                }}
              />
              {/* Inner depth rim */}
              <div
                className="absolute inset-0 rounded-[40px] pointer-events-none"
                style={{ boxShadow: "inset 0 -5px 16px rgba(0,0,0,0.22)" }}
              />

              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 + i * 0.08 }}
                className="relative z-10 text-black font-bold text-center leading-tight whitespace-pre-line select-none"
                style={{ fontSize: 14, maxWidth: 112, lineHeight: 1.35 }}
              >
                {q.label}
              </motion.span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
