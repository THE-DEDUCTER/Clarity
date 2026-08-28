import React from "react";
import { motion } from "framer-motion";
import { MoodWord, Quadrant } from "@/lib/mood-data";
import { cn } from "@/lib/utils";

interface MoodBlobProps {
  word: MoodWord;
  isSelected: boolean;
  onSelect: (id: string) => void;
  searchQuery?: string;
  delay?: number;
}

const QUADRANT_THEME: Record<Quadrant, { base: string; active: string; text: string; border: string }> = {
  "high-pleasant": { 
    base: "bg-amber-500 dark:bg-amber-500", 
    active: "bg-amber-400 dark:bg-amber-400", 
    text: "text-white", 
    border: "border-amber-400 dark:border-amber-400" 
  },
  "high-unpleasant": { 
    base: "bg-rose-500 dark:bg-rose-500", 
    active: "bg-rose-400 dark:bg-rose-400", 
    text: "text-white", 
    border: "border-rose-400 dark:border-rose-400" 
  },
  "low-unpleasant": { 
    base: "bg-blue-600 dark:bg-blue-600", 
    active: "bg-blue-500 dark:bg-blue-500", 
    text: "text-white", 
    border: "border-blue-500 dark:border-blue-500" 
  },
  "low-pleasant": { 
    base: "bg-emerald-500 dark:bg-emerald-500", 
    active: "bg-emerald-400 dark:bg-emerald-400", 
    text: "text-white", 
    border: "border-emerald-400 dark:border-emerald-400" 
  },
};

// Organic blob shapes for the breathing animation
const BLOB_SHAPES = [
  "40% 60% 70% 30% / 40% 50% 60% 50%",
  "60% 40% 30% 70% / 60% 30% 70% 40%",
  "30% 70% 70% 30% / 30% 60% 40% 70%",
  "50% 50% 40% 60% / 50% 40% 60% 50%",
  "40% 60% 70% 30% / 40% 50% 60% 50%", // Return to start
];

export function MoodBlob({
  word,
  isSelected,
  onSelect,
  searchQuery = "",
  delay = 0,
}: MoodBlobProps) {
  const theme = QUADRANT_THEME[word.quadrant] || QUADRANT_THEME["high-pleasant"];
  
  const isMatch = searchQuery === "" || word.label.toLowerCase().includes(searchQuery.toLowerCase());
  const opacityState = isMatch ? 1 : 0.15;
  const filterState = isMatch ? "grayscale(0%)" : "grayscale(100%)";

  const isExtreme = word.intensity >= 4;
  const isModerate = word.intensity === 3;

  // Use the word ID to stagger the animation phases deterministically (so they don't all breathe in sync)
  const staggerOffset = word.id.charCodeAt(0) % 4;
  const shiftedShapes = [
    ...BLOB_SHAPES.slice(staggerOffset, 4),
    ...BLOB_SHAPES.slice(0, staggerOffset),
    BLOB_SHAPES[staggerOffset] // Close the loop
  ];

  return (
    <motion.button
      onClick={() => onSelect(word.id)}
      animate={{ 
        opacity: opacityState, 
        scale: isSelected ? 1.05 : 1,
        filter: filterState,
        borderRadius: shiftedShapes,
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      whileHover={{ scale: 1.08, zIndex: 50, filter: "brightness(1.2)" }}
      whileTap={{ scale: 0.95 }}
      layout
      transition={{ 
        // Morphing animation physics
        borderRadius: { 
          duration: 8 + (word.id.charCodeAt(word.id.length - 1) % 4), // slightly randomized duration 8-11s
          repeat: Infinity, 
          ease: "easeInOut" 
        },
        // Entrance and interaction physics
        opacity: { duration: 0.4, delay: delay },
        scale: { type: "spring", stiffness: 300, damping: 25 },
        layout: { type: "spring", stiffness: 300, damping: 25 }
      }}
      className={cn(
        "relative flex flex-col items-center justify-center text-center transition-colors duration-500 ease-out border backdrop-blur-xl select-none cursor-pointer outline-none overflow-hidden",
        isExtreme ? "w-[150px] h-[130px]" : 
        isModerate ? "w-[130px] h-[110px]" : 
        "w-[110px] h-[95px]",
        isSelected 
          ? [theme.active, "border-gray-900/30 dark:border-white/50 shadow-[0_0_20px_rgba(0,0,0,0.1)] dark:shadow-[0_0_40px_rgba(255,255,255,0.15)] z-30"] 
          : [theme.base, theme.border, "shadow-sm dark:shadow-lg z-10 hover:border-gray-900/20 dark:hover:border-white/30 hover:bg-black/5 dark:hover:bg-white/5"]
      )}
    >
      {/* Soft internal glow for selected state */}
      {isSelected && (
        <div className="absolute inset-0 bg-white/30 dark:bg-white/10 mix-blend-overlay rounded-inherit pointer-events-none" />
      )}

      {/* Text Content */}
      <div className="relative z-10 flex flex-col items-center px-4 w-full">
        <span className={cn(
          "font-medium tracking-wide transition-colors duration-200 leading-[1.2]",
          isSelected ? "text-white drop-shadow-md font-bold scale-110" : "text-white/90 drop-shadow-sm",
          isExtreme ? "text-lg" :
          isModerate ? "text-base" :
          "text-sm"
        )}>
          {word.label}
        </span>
      </div>
    </motion.button>
  );
}
