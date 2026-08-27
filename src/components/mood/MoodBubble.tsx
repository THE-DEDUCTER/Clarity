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
  searchQuery?: string;
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
  searchQuery = ""
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

  const isMatch = searchQuery === "" || word.label.toLowerCase().includes(searchQuery.toLowerCase());
  const opacityState = isMatch ? 1 : 0.15;
  const filterState = isMatch ? "grayscale(0%)" : "grayscale(100%)";

  return (
    <motion.button
      onClick={() => onSelect(word.id)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      // Combine 3D rotation, and dynamic filtering
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        ...style
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ 
        opacity: opacityState, 
        scale: isSelected ? 1.05 : 1, 
        filter: filterState
      }}
      whileHover={{ scale: 1.08, zIndex: 50 }}
      whileTap={{ scale: 0.95 }}
      // Use Layout to make everything glide when filtered or sorted
      layout
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 25,
        opacity: { duration: 0.2 },
      }}
      className={cn(
        "relative inline-flex flex-col items-center justify-center text-center transition-all duration-[250ms] ease-out border backdrop-blur-xl select-none cursor-pointer outline-none group overflow-hidden",
        isExtreme ? "w-auto px-6 py-4 rounded-full" : 
        isModerate ? "w-auto px-5 py-3 rounded-full" : 
        "w-auto px-4 py-2.5 rounded-full",
        isSelected 
          ? [theme.active, "border-white/40 shadow-[0_0_30px_rgba(255,255,255,0.2)] z-30"] 
          : [theme.base, theme.border, "shadow-lg z-10"]
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
        style={{ transform: "translateZ(20px)" }} // Pop the text off the glass!
      >
        <span className={cn(
          "font-semibold tracking-tight transition-colors duration-200 leading-[1.1]",
          isSelected ? (word.quadrant === "high-pleasant" ? "text-amber-950" : "text-white") : theme.text,
          isExtreme ? "text-lg sm:text-xl" :
          isModerate ? "text-base sm:text-lg" :
          "text-sm sm:text-base"
        )}>
          {word.label}
        </span>
      </div>
    </motion.button>
  );
}
