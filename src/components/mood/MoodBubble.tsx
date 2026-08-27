"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { MoodWord, Quadrant } from "@/lib/mood-data";
import { cn } from "@/lib/utils";

interface MoodBubbleProps {
  word: MoodWord;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const QUADRANT_COLORS: Record<Quadrant, { from: string, to: string, text: string }> = {
  "high-unpleasant": { from: "#FF4B5C", to: "#FF8C9A", text: "text-black" },
  "high-pleasant": { from: "#FFD84D", to: "#FFE899", text: "text-black" },
  "low-unpleasant": { from: "#3B82F6", to: "#8FBBFF", text: "text-black" },
  "low-pleasant": { from: "#10B981", to: "#7BE5BA", text: "text-black" }
};

export function MoodBubble({ word, isSelected, onSelect }: MoodBubbleProps) {
  // Base size based on intensity (1-5)
  // 5 = anchor (e.g. 200px)
  // 1 = peripheral (e.g. 130px)
  const baseSize = useMemo(() => {
    switch (word.intensity) {
      case 5: return 190;
      case 4: return 170;
      case 3: return 150;
      case 2: return 140;
      case 1: return 130;
      default: return 150;
    }
  }, [word.intensity]);

  const colors = QUADRANT_COLORS[word.quadrant];
  
  // Calculate a varied size slightly random but stable per id
  const seededSize = useMemo(() => {
    const hash = word.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const variance = (hash % 10) - 5; // -5 to +5
    return baseSize + variance;
  }, [word.id, baseSize]);

  // Morph paths (100x100 viewBox)
  const circlePath = "M 50 0 C 77.6 0 100 22.4 100 50 C 100 77.6 77.6 100 50 100 C 22.4 100 0 77.6 0 50 C 0 22.4 22.4 0 50 0 Z";
  
  // A generated organic scallop path (star-like with rounded edges)
  const scallopPath = "M 50 5 C 65 5, 85 -5, 90 20 C 95 45, 110 60, 80 85 C 50 110, 30 110, 15 80 C 0 50, 10 30, 20 15 C 30 0, 35 5, 50 5 Z";

  const currentPath = isSelected ? scallopPath : circlePath;

  return (
    <motion.button
      onClick={() => onSelect(word.id)}
      animate={{
        scale: isSelected ? 1.15 : 1,
        zIndex: isSelected ? 50 : 10,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20
      }}
      className={cn(
        "relative flex items-center justify-center rounded-full shrink-0",
        colors.text
      )}
      style={{
        width: seededSize,
        height: seededSize,
        // The container margin helps simulate the brick gap, but the grid will manage layout overlap.
        margin: -4 // Slight overlap default
      }}
    >
      {/* SVG Background for clipping/morphing */}
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 w-full h-full drop-shadow-sm pointer-events-none"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={`grad-${word.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors.from} />
            <stop offset="100%" stopColor={colors.to} />
          </linearGradient>
        </defs>
        
        <motion.path
          d={currentPath}
          fill={`url(#grad-${word.id})`}
          animate={{ d: currentPath }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className={cn("transition-shadow", isSelected ? "drop-shadow-lg" : "")}
        />
      </svg>
      
      {/* Glow layer behind if selected */}
      {isSelected && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          className="absolute inset-0 rounded-full blur-xl -z-10"
          style={{ backgroundColor: colors.from }}
        />
      )}

      {/* Label */}
      <motion.span
        animate={{ 
          fontWeight: isSelected ? 800 : 700,
        }}
        className="relative z-10 text-center leading-tight tracking-tight px-4 pointer-events-none"
        style={{ fontSize: seededSize * 0.16 }}
      >
        {word.label}
      </motion.span>
    </motion.button>
  );
}
