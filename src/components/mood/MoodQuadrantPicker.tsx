"use client";

import { motion } from "framer-motion";
import { Quadrant } from "@/lib/mood-data";

interface MoodQuadrantPickerProps {
  onSelect: (quadrant: Quadrant) => void;
}

export function MoodQuadrantPicker({ onSelect }: MoodQuadrantPickerProps) {
  const quadrants = [
    {
      id: "high-unpleasant" as Quadrant,
      label: "High Energy\nUnpleasant",
      bg: "bg-gradient-to-br from-[#FF4B5C] to-[#FF3355]",
      glow: "shadow-[0_0_30px_rgba(255,75,92,0.4)]",
      border: "border border-[#FF3355]/50",
      layoutId: "quadrant-high-unpleasant"
    },
    {
      id: "high-pleasant" as Quadrant,
      label: "High Energy\nPleasant",
      bg: "bg-gradient-to-br from-[#FFD84D] to-[#FFB020]",
      glow: "shadow-[0_0_30px_rgba(255,216,77,0.4)]",
      border: "border border-[#FFB020]/50",
      layoutId: "quadrant-high-pleasant"
    },
    {
      id: "low-unpleasant" as Quadrant,
      label: "Low Energy\nUnpleasant",
      bg: "bg-gradient-to-br from-[#5EB3FF] to-[#3B82F6]",
      glow: "shadow-[0_0_30px_rgba(94,179,255,0.4)]",
      border: "border border-[#3B82F6]/50",
      layoutId: "quadrant-low-unpleasant"
    },
    {
      id: "low-pleasant" as Quadrant,
      label: "Low Energy\nPleasant",
      bg: "bg-gradient-to-br from-[#4ADE9E] to-[#10B981]",
      glow: "shadow-[0_0_30px_rgba(74,222,158,0.4)]",
      border: "border border-[#10B981]/50",
      layoutId: "quadrant-low-pleasant"
    }
  ];

  return (
    <div className="flex flex-col items-center w-full max-w-[500px] mx-auto px-4 mt-8 sm:mt-12">
      <div className="text-center mb-12 sm:mb-16">
        <h1 className="text-white text-[22px] sm:text-2xl font-medium leading-tight font-serif">
          Tap the color that best describes<br />how you feel right now
        </h1>
      </div>

      {/* 2x2 Grid of overlapping circles */}
      <div className="relative w-full aspect-square max-w-[340px] sm:max-w-[400px]">
        {quadrants.map((q, i) => {
          const isTop = i < 2;
          const isLeft = i % 2 === 0;

          return (
            <motion.button
              key={q.id}
              layoutId={q.layoutId}
              onClick={() => onSelect(q.id)}
              whileHover={{ scale: 1.05, zIndex: 10 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: i * 0.1
              }}
              className={`absolute rounded-full flex items-center justify-center ${q.bg} ${q.glow} ${q.border} z-0`}
              style={{
                width: '54%',
                height: '54%',
                top: isTop ? '0%' : 'auto',
                bottom: !isTop ? '0%' : 'auto',
                left: isLeft ? '0%' : 'auto',
                right: !isLeft ? '0%' : 'auto',
                // Overlap them slightly toward the center
                transform: `translate(${isLeft ? '8%' : '-8%'}, ${isTop ? '8%' : '-8%'})`
              }}
            >
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="font-bold text-black text-sm sm:text-base leading-tight whitespace-pre-line pointer-events-none"
              >
                {q.label}
              </motion.span>
              
              {/* Fake 3D rim inner shadow effect */}
              <div className="absolute inset-0 rounded-full shadow-[inset_0_-4px_12px_rgba(0,0,0,0.15)] pointer-events-none" />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
