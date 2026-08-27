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
    id: "red",
    quadrantKey: "high-unpleasant" as Quadrant,
    label: "High Energy\nUnpleasant",
    color: "bg-[#FF3B30]",
    textColor: "text-white"
  },
  {
    id: "yellow",
    quadrantKey: "high-pleasant" as Quadrant,
    label: "High Energy\nPleasant",
    color: "bg-[#FFCC00]",
    textColor: "text-amber-950"
  },
  {
    id: "blue",
    quadrantKey: "low-unpleasant" as Quadrant,
    label: "Low Energy\nUnpleasant",
    color: "bg-[#007AFF]",
    textColor: "text-white"
  },
  {
    id: "green",
    quadrantKey: "low-pleasant" as Quadrant,
    label: "Low Energy\nPleasant",
    color: "bg-[#34C759]",
    textColor: "text-white"
  }
];

export function MoodQuadrantPicker({ onSelect }: MoodQuadrantPickerProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center w-full px-4">
      
      <div className="flex items-center justify-center w-full px-4 mb-8">
        <span className="text-xs uppercase tracking-widest text-gray-400 font-semibold flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
          Interactive Mood Meter
        </span>
      </div>

      <motion.h3 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-xl sm:text-2xl font-semibold mb-12 text-center text-white tracking-tight font-serif"
      >
        Tap the color that best describes<br/>how you feel right now
      </motion.h3>

      {/* Tightly packed 2x2 Grid */}
      <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
        {quadrants.map((quad, index) => (
          <motion.button
            key={quad.id}
            onClick={() => onSelect(quad.quadrantKey)}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: 0.9, 
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
              "w-36 h-36 sm:w-44 sm:h-44 rounded-full flex items-center justify-center text-center p-4 cursor-pointer",
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
