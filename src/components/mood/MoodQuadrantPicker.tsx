"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Quadrant } from "@/lib/mood-data";
import { Sparkles } from "lucide-react";

interface MoodQuadrantPickerProps {
  onSelect: (quadrant: Quadrant) => void;
}

const quadrants = [
  {
    id: "q1",
    quadrantKey: "high-unpleasant" as Quadrant,
    label: "High Energy\nUnpleasant",
    color: "bg-rose-600",
    textColor: "text-white"
  },
  {
    id: "q2",
    quadrantKey: "high-pleasant" as Quadrant,
    label: "High Energy\nPleasant",
    color: "bg-amber-600",
    textColor: "text-white"
  },
  {
    id: "q3",
    quadrantKey: "low-unpleasant" as Quadrant,
    label: "Low Energy\nUnpleasant",
    color: "bg-blue-600",
    textColor: "text-white"
  },
  {
    id: "q4",
    quadrantKey: "low-pleasant" as Quadrant,
    label: "Low Energy\nPleasant",
    color: "bg-emerald-600",
    textColor: "text-white"
  }
];

export function MoodQuadrantPicker({ onSelect }: MoodQuadrantPickerProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center w-full px-4">
      
      <div className="flex items-center justify-center w-full px-4 mb-8">
        <span className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 font-semibold flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-yellow-500 dark:text-yellow-400" />
          Interactive Mood Meter
        </span>
      </div>

      <motion.h2 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-xl sm:text-2xl font-semibold mb-12 text-center text-gray-900 dark:text-white tracking-tight font-serif"
      >
        Tap the color that best describes<br/>how you feel right now
      </motion.h2>

      {/* Tightly packed 2x2 Grid */}
      <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
        {quadrants.map((quad, index) => (
          <motion.button
            key={quad.id}
            onClick={() => onSelect(quad.quadrantKey)}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              y: [0, (index % 2 === 0 ? -3 : 3), 0],
            }}
            transition={{ 
              opacity: { duration: 0.4, delay: index * 0.1 },
              scale: { type: "spring", stiffness: 200, damping: 15, delay: index * 0.1 },
              y: { repeat: Infinity, duration: 4, ease: "easeInOut", delay: index * 0.5 }
            }}
            whileHover={{ scale: 1.05, opacity: 1, zIndex: 10 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "w-[130px] h-[130px] sm:w-44 sm:h-44 rounded-full flex items-center justify-center text-center p-3 sm:p-4 cursor-pointer",
              "shadow-[0_0_40px_rgba(0,0,0,0.3)]",
              quad.color, quad.textColor
            )}
          >
            <span className="font-bold text-sm sm:text-base whitespace-pre-line leading-tight pointer-events-none">
              {quad.label}
            </span>
          </motion.button>
        ))}
      </div>
      
    </div>
  );
}
