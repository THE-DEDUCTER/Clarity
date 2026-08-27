"use client";

import { motion } from "framer-motion";
import { MoodWord, Quadrant } from "@/lib/mood-data";
import { cn } from "@/lib/utils";

export interface MoodBubbleProps {
  word: MoodWord;
  isSelected: boolean;
  onSelect: (id: string) => void;
  style?: React.CSSProperties;
}

const QUADRANT_GRADIENTS: Record<Quadrant, { bg: string; active: string; text: string; border: string }> = {
  "high-pleasant": {
    bg: "bg-[#FFC837]/10 hover:bg-[#FFC837]/20",
    active: "bg-gradient-to-br from-[#FFE169] to-[#FF9800]",
    border: "border-[#FFC837]/30",
    text: "text-[#FFE169]",
  },
  "high-unpleasant": {
    bg: "bg-[#FF3B4E]/10 hover:bg-[#FF3B4E]/20",
    active: "bg-gradient-to-br from-[#FF6575] to-[#E60026]",
    border: "border-[#FF3B4E]/30",
    text: "text-[#FF6575]",
  },
  "low-unpleasant": {
    bg: "bg-[#3B82F6]/10 hover:bg-[#3B82F6]/20",
    active: "bg-gradient-to-br from-[#72B9FF] to-[#1D4ED8]",
    border: "border-[#3B82F6]/30",
    text: "text-[#72B9FF]",
  },
  "low-pleasant": {
    bg: "bg-[#10B981]/10 hover:bg-[#10B981]/20",
    active: "bg-gradient-to-br from-[#56ECA6] to-[#059669]",
    border: "border-[#10B981]/30",
    text: "text-[#56ECA6]",
  }
};

export function MoodBubble({
  word,
  isSelected,
  onSelect,
  style,
}: MoodBubbleProps) {
  const colors = QUADRANT_GRADIENTS[word.quadrant] || QUADRANT_GRADIENTS["high-pleasant"];
  
  // Size based on intensity:
  // Extreme (4-5): Large block
  // Moderate (3): Medium pill
  // Mild (1-2): Small pill
  
  const isExtreme = word.intensity >= 4;
  const isModerate = word.intensity === 3;

  return (
    <motion.button
      onClick={() => onSelect(word.id)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative flex flex-col items-center justify-center text-center transition-all duration-200 ease-out border backdrop-blur-sm select-none cursor-pointer outline-none touch-manipulation overflow-hidden",
        isExtreme ? "w-full py-4 sm:py-6 rounded-[24px]" : 
        isModerate ? "w-full py-3 sm:py-4 rounded-[20px]" : 
        "w-full py-2.5 sm:py-3 rounded-[16px]",
        isSelected ? [colors.active, "border-transparent shadow-lg scale-[1.02] z-10"] : [colors.bg, colors.border, "shadow-sm z-0"]
      )}
      style={style}
    >
      <span className={cn(
        "font-semibold tracking-tight transition-colors duration-200",
        isSelected ? (word.quadrant === "high-pleasant" ? "text-amber-950" : "text-white") : colors.text,
        isExtreme ? "text-lg sm:text-xl" :
        isModerate ? "text-base sm:text-lg" :
        "text-sm sm:text-base"
      )}>
        {word.label}
      </span>
      
      {isExtreme && (
        <span className={cn(
          "text-xs mt-1 max-w-[80%] opacity-80 leading-tight",
          isSelected ? (word.quadrant === "high-pleasant" ? "text-amber-950" : "text-white") : "text-white/50"
        )}>
          {word.description || "Intense emotion"}
        </span>
      )}
    </motion.button>
  );
}
