"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { MoodWord, Quadrant } from "@/lib/mood-data";
import { cn } from "@/lib/utils";

export interface MoodBubbleProps {
  word: MoodWord;
  isSelected: boolean;
  isCenterFocal?: boolean;
  scaleFactor?: number;
  onSelect: (id: string) => void;
  style?: React.CSSProperties;
}

const QUADRANT_GRADIENTS: Record<Quadrant, { from: string; via: string; to: string; glow: string; text: string }> = {
  "high-pleasant": {
    from: "#FFE169",
    via: "#FFC837",
    to: "#FF9800",
    glow: "rgba(255, 200, 55, 0.55)",
    text: "text-[#1A1100]"
  },
  "high-unpleasant": {
    from: "#FF6575",
    via: "#FF3B4E",
    to: "#E60026",
    glow: "rgba(255, 59, 78, 0.55)",
    text: "text-[#1A0004]"
  },
  "low-unpleasant": {
    from: "#72B9FF",
    via: "#3B82F6",
    to: "#1D4ED8",
    glow: "rgba(59, 130, 246, 0.55)",
    text: "text-[#001026]"
  },
  "low-pleasant": {
    from: "#56ECA6",
    via: "#10B981",
    to: "#059669",
    glow: "rgba(16, 185, 129, 0.55)",
    text: "text-[#001D13]"
  }
};

// Variety of organic SVG shapes representing different emotional states
const MORPH_SHAPES = [
  // 0: Soft 4-petal scallop (Calm / Warm)
  "M 50 4 C 68 4, 82 12, 88 28 C 96 48, 96 68, 80 84 C 64 100, 40 96, 24 88 C 6 80, 2 56, 12 36 C 20 20, 32 4, 50 4 Z",
  // 1: 5-petal flower bloom (Excited / Joyful)
  "M 50 6 C 63 6, 78 -2, 88 15 C 98 32, 102 52, 90 68 C 78 84, 80 102, 60 98 C 40 94, 22 104, 12 86 C 2 68, -4 48, 8 30 C 20 12, 37 6, 50 6 Z",
  // 2: Fluid mindfulness pebble (Sympathetic / Thoughtful)
  "M 50 3 C 74 3, 97 19, 97 49 C 97 79, 75 97, 47 97 C 19 97, 3 75, 3 49 C 3 23, 26 3, 50 3 Z",
  // 3: Radiant burst star-scallop (Thrilled / Energized)
  "M 50 2 C 65 14, 86 14, 98 28 C 86 42, 86 64, 98 78 C 84 90, 64 86, 50 98 C 36 86, 16 90, 2 78 C 14 64, 14 42, 2 28 C 14 14, 35 14, 50 2 Z",
  // 4: Organic undulating cloud (Relaxed / Content)
  "M 50 7 C 70 7, 91 19, 95 41 C 99 63, 87 85, 69 93 C 51 101, 31 95, 17 83 C 3 71, 5 47, 15 29 C 25 11, 30 7, 50 7 Z"
];

const CIRCLE_PATH = "M 50 0 C 77.6 0 100 22.4 100 50 C 100 77.6 77.6 100 50 100 C 22.4 100 0 77.6 0 50 C 0 22.4 22.4 0 50 0 Z";

export function MoodBubble({
  word,
  isSelected,
  isCenterFocal = false,
  scaleFactor = 1,
  onSelect,
  style
}: MoodBubbleProps) {
  // Deterministic seed from word id to assign unique shape profile
  const shapeIndex = useMemo(() => {
    const hash = word.id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return hash % MORPH_SHAPES.length;
  }, [word.id]);

  // Base size based on intensity (1-5)
  const baseSize = useMemo(() => {
    switch (word.intensity) {
      case 5: return 180;
      case 4: return 160;
      case 3: return 145;
      case 2: return 130;
      case 1: return 120;
      default: return 145;
    }
  }, [word.intensity]);

  const colors = QUADRANT_GRADIENTS[word.quadrant] || QUADRANT_GRADIENTS["high-pleasant"];
  
  // Decide whether to morph
  const shouldMorph = isSelected || isCenterFocal;
  const targetPath = shouldMorph ? MORPH_SHAPES[shapeIndex] : CIRCLE_PATH;

  // Visual scale combination of base size and center proximity factor
  const totalScale = (isSelected ? 1.22 : isCenterFocal ? 1.15 : 1) * scaleFactor;

  return (
    <motion.button
      onClick={() => onSelect(word.id)}
      whileHover={{ scale: totalScale * 1.08, zIndex: 60 }}
      whileTap={{ scale: totalScale * 0.94 }}
      animate={{
        scale: totalScale,
        zIndex: isSelected ? 80 : isCenterFocal ? 50 : 10
      }}
      transition={{
        type: "spring",
        stiffness: 320,
        damping: 22,
        mass: 0.8
      }}
      className={cn(
        "relative flex items-center justify-center select-none cursor-pointer outline-none touch-manipulation group",
        colors.text
      )}
      style={{
        width: baseSize,
        height: baseSize,
        ...style
      }}
    >
      {/* Morphing SVG Silhouette */}
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-md overflow-visible"
      >
        <defs>
          <radialGradient
            id={`grad-${word.id}`}
            cx="35%"
            cy="30%"
            r="70%"
            fx="30%"
            fy="25%"
          >
            <stop offset="0%" stopColor={colors.from} />
            <stop offset="55%" stopColor={colors.via} />
            <stop offset="100%" stopColor={colors.to} />
          </radialGradient>
        </defs>

        {/* Pulsing breathing morph animation when focal */}
        <motion.path
          d={targetPath}
          fill={`url(#grad-${word.id})`}
          animate={{
            d: targetPath,
            rotate: isCenterFocal || isSelected ? [0, 2, -2, 0] : 0,
            scale: isCenterFocal || isSelected ? [1, 1.02, 0.99, 1] : 1
          }}
          transition={{
            d: { type: "spring", stiffness: 280, damping: 20 },
            rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" },
            scale: { duration: 3.5, repeat: Infinity, ease: "easeInOut" }
          }}
          className="transition-all duration-300"
        />

        {/* 3D Glass / Apple Watch light highlight rim on top */}
        <motion.path
          d={targetPath}
          fill="none"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="1.5"
          className="opacity-70"
        />
      </svg>

      {/* Dynamic outer glow halo when center focal or selected */}
      {(isSelected || isCenterFocal) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: isSelected ? 0.7 : 0.45,
            scale: isSelected ? 1.3 : 1.15
          }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.35 }}
          className="absolute inset-0 rounded-full blur-2xl -z-10 pointer-events-none"
          style={{ backgroundColor: colors.glow }}
        />
      )}

      {/* Floating Emotion Word Label */}
      <motion.span
        animate={{
          scale: isSelected ? 1.05 : 1,
          fontWeight: isSelected ? 800 : isCenterFocal ? 750 : 650
        }}
        className="relative z-10 text-center leading-[1.1] tracking-tight px-3 py-1 font-serif pointer-events-none drop-shadow-sm select-none"
        style={{
          fontSize: Math.max(14, Math.round(baseSize * 0.155)),
          color: colors.text.includes("white") ? "#FFFFFF" : "#0A0A0A"
        }}
      >
        {word.label}
      </motion.span>
    </motion.button>
  );
}
