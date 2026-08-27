"use client";

import { MouseEvent, useRef } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { MoodWord, Quadrant } from "@/lib/mood-data";
import { cn } from "@/lib/utils";

export interface MoodBubbleProps {
  word: MoodWord;
  isSelected: boolean;
  onSelect: (id: string) => void;
  style?: React.CSSProperties;
}

const QUADRANT_THEME: Record<Quadrant, { base: string; active: string; text: string; glow: string; border: string }> = {
  "high-pleasant": {
    base: "bg-[#FFC837]/10",
    active: "bg-gradient-to-br from-[#FFE169] to-[#FF9800]",
    border: "border-[#FFC837]/30",
    text: "text-[#FFE169]",
    glow: "rgba(255, 200, 55, 0.25)"
  },
  "high-unpleasant": {
    base: "bg-[#FF3B4E]/10",
    active: "bg-gradient-to-br from-[#FF6575] to-[#E60026]",
    border: "border-[#FF3B4E]/30",
    text: "text-[#FF6575]",
    glow: "rgba(255, 59, 78, 0.25)"
  },
  "low-unpleasant": {
    base: "bg-[#3B82F6]/10",
    active: "bg-gradient-to-br from-[#72B9FF] to-[#1D4ED8]",
    border: "border-[#3B82F6]/30",
    text: "text-[#72B9FF]",
    glow: "rgba(59, 130, 246, 0.25)"
  },
  "low-pleasant": {
    base: "bg-[#10B981]/10",
    active: "bg-gradient-to-br from-[#56ECA6] to-[#059669]",
    border: "border-[#10B981]/30",
    text: "text-[#56ECA6]",
    glow: "rgba(16, 185, 129, 0.25)"
  }
};

export function MoodBubble({
  word,
  isSelected,
  onSelect,
  style,
}: MoodBubbleProps) {
  const theme = QUADRANT_THEME[word.quadrant] || QUADRANT_THEME["high-pleasant"];
  
  // Size based on intensity:
  const isExtreme = word.intensity >= 4;
  const isModerate = word.intensity === 3;

  // VisionOS Style Advanced Physics & Spotlight
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useMotionValue(0), { damping: 40, stiffness: 200 });
  const rotateY = useSpring(useMotionValue(0), { damping: 40, stiffness: 200 });
  
  // Soft ambient spotlight tracking cursor
  const spotlightTemplate = useMotionTemplate`radial-gradient(150px circle at ${mouseX}px ${mouseY}px, ${theme.glow}, transparent 80%)`;
  const borderTemplate = useMotionTemplate`radial-gradient(100px circle at ${mouseX}px ${mouseY}px, rgba(255,255,255,0.4), transparent 100%)`;

  function handleMouseMove(e: MouseEvent<HTMLButtonElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mouseX.set(x);
    mouseY.set(y);

    // 3D Parallax Tilt Math
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const tiltX = ((y - centerY) / centerY) * -12; // Max 12 deg up/down
    const tiltY = ((x - centerX) / centerX) * 12;  // Max 12 deg left/right
    
    rotateX.set(tiltX);
    rotateY.set(tiltY);
  }

  function handleMouseLeave() {
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <motion.button
      onClick={() => onSelect(word.id)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      // Combine 3D rotation with scaling on hover
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        ...style
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      // Use Layout to make everything glide when filtered or sorted
      layout
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={cn(
        "relative flex flex-col items-center justify-center text-center transition-all duration-[250ms] ease-out border backdrop-blur-xl select-none cursor-pointer outline-none group overflow-hidden",
        isExtreme ? "w-full py-5 sm:py-7 rounded-[28px]" : 
        isModerate ? "w-full py-3.5 sm:py-5 rounded-[24px]" : 
        "w-full py-2.5 sm:py-3.5 rounded-[20px]",
        isSelected 
          ? [theme.active, "border-white/40 shadow-[0_0_30px_rgba(255,255,255,0.15)] z-20"] 
          : [theme.base, theme.border, "shadow-xl z-0"]
      )}
    >
      {/* 1. Base Glass Highlight Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none opacity-50" />

      {/* 2. Interactive Spotlight Gradient (Cursor Tracking) */}
      {!isSelected && (
        <motion.div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: spotlightTemplate }}
        />
      )}

      {/* 3. Glowing Border Trace (Cursor Tracking) */}
      {!isSelected && (
        <motion.div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[inherit] mix-blend-overlay"
          style={{ 
            boxShadow: "inset 0 0 0 1px transparent",
            border: "1px solid transparent",
            borderImageSource: borderTemplate,
            borderImageSlice: 1
          }}
        />
      )}
      
      {/* 4. Text Content (Lifted up via 3D translateZ) */}
      <div 
        className="relative z-10 flex flex-col items-center pointer-events-none"
        style={{ transform: "translateZ(30px)" }} // Pop the text off the glass!
      >
        <span className={cn(
          "font-semibold tracking-tight transition-colors duration-200",
          isSelected ? (word.quadrant === "high-pleasant" ? "text-amber-950" : "text-white") : theme.text,
          isExtreme ? "text-lg sm:text-2xl" :
          isModerate ? "text-base sm:text-lg" :
          "text-sm sm:text-base"
        )}>
          {word.label}
        </span>
        
        {isExtreme && (
          <span className={cn(
            "text-[11px] sm:text-xs mt-1.5 max-w-[85%] leading-tight font-medium opacity-80",
            isSelected ? (word.quadrant === "high-pleasant" ? "text-amber-950/70" : "text-white/70") : "text-white/40"
          )}>
            {word.description || "Intense emotion"}
          </span>
        )}
      </div>
    </motion.button>
  );
}
