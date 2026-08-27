"use client";

import React, { useState, useMemo } from "react";
import { X, Search } from "lucide-react";
import { Quadrant, MOOD_DATA } from "@/lib/mood-data";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { arc, pie } from "d3-shape";

interface MoodGridProps {
  initialQuadrant: Quadrant;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onBack: () => void;
}

const QUADRANT_THEMES: Record<Quadrant, { title: string; subtitle: string; bg: string; fill: string; activeFill: string; text: string }> = {
  "high-pleasant": { title: "High Energy, Pleasant", subtitle: "Joyful, Excited, Energized", bg: "bg-[#FFC837]/5", fill: "rgba(255, 200, 55, 0.15)", activeFill: "rgba(255, 200, 55, 0.6)", text: "text-[#FFC837]" },
  "high-unpleasant": { title: "High Energy, Unpleasant", subtitle: "Angry, Anxious, Frustrated", bg: "bg-[#FF3B4E]/5", fill: "rgba(255, 59, 78, 0.15)", activeFill: "rgba(255, 59, 78, 0.6)", text: "text-[#FF3B4E]" },
  "low-unpleasant": { title: "Low Energy, Unpleasant", subtitle: "Sad, Exhausted, Hopeless", bg: "bg-[#3B82F6]/5", fill: "rgba(59, 130, 246, 0.15)", activeFill: "rgba(59, 130, 246, 0.6)", text: "text-[#3B82F6]" },
  "low-pleasant": { title: "Low Energy, Pleasant", subtitle: "Calm, Relaxed, Serene", bg: "bg-[#10B981]/5", fill: "rgba(16, 185, 129, 0.15)", activeFill: "rgba(16, 185, 129, 0.6)", text: "text-[#10B981]" },
};

export function MoodGrid({ initialQuadrant, selectedId, onSelect, onBack }: MoodGridProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const theme = QUADRANT_THEMES[initialQuadrant];

  const relevantMoods = useMemo(() => {
    return MOOD_DATA.filter(w => w.quadrant === initialQuadrant).sort((a, b) => a.label.localeCompare(b.label));
  }, [initialQuadrant]);

  const extremeMoods = relevantMoods.filter(w => w.intensity >= 4);
  const moderateMoods = relevantMoods.filter(w => w.intensity === 3);
  const mildMoods = relevantMoods.filter(w => w.intensity <= 2);

  // D3 Pie Generator (evenly distributes items in a full circle)
  const pieGenerator = pie<any>().value(1).sort(null);

  const R1 = 80;
  const R2 = 160;
  const R3 = 240;
  const R4 = 320;

  // Generate Arc Data
  const extremeArcs = pieGenerator(extremeMoods);
  const extremeArcGen = arc<any>().innerRadius(R1).outerRadius(R2).padAngle(0.03).cornerRadius(6);

  const moderateArcs = pieGenerator(moderateMoods);
  const moderateArcGen = arc<any>().innerRadius(R2 + 8).outerRadius(R3).padAngle(0.02).cornerRadius(4);

  const mildArcs = pieGenerator(mildMoods);
  const mildArcGen = arc<any>().innerRadius(R3 + 8).outerRadius(R4).padAngle(0.01).cornerRadius(3);

  const allArcsData = [
    ...extremeArcs.map(d => ({ ...d, arcGen: extremeArcGen, isExtreme: true })),
    ...moderateArcs.map(d => ({ ...d, arcGen: moderateArcGen, isExtreme: false })),
    ...mildArcs.map(d => ({ ...d, arcGen: mildArcGen, isExtreme: false }))
  ];

  return (
    <div className={cn("relative w-full h-full flex flex-col overflow-hidden bg-black")}>
      
      {/* Ambient Breathing Background */}
      <motion.div 
        className={cn("absolute inset-0 opacity-40 mix-blend-screen pointer-events-none", theme.bg)}
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.05, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{ filter: "blur(100px)" }}
      />

      {/* Pinned Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="shrink-0 z-50 px-5 pt-4 pb-4 border-b border-white/5 bg-black/40 backdrop-blur-3xl" 
        style={{ paddingTop: "calc(env(safe-area-inset-top) + 16px)" }}
      >
        <div className="flex flex-col gap-4 max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white tracking-tight">{theme.title}</h2>
              <p className="text-sm text-white/50">{theme.subtitle}</p>
            </div>
            
            <button
              onClick={onBack}
              className="shrink-0 w-10 h-10 rounded-full bg-[#1C1C1E] border border-white/10 flex items-center justify-center hover:bg-[#2C2C2E] active:scale-95 transition-all shadow-xl ml-4"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-white/80" />
            </button>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search for a specific feeling..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-colors"
            />
          </div>
        </div>
      </motion.div>

      {/* Emotion Wheel Container */}
      <div className="flex-1 w-full h-full relative overflow-y-auto no-scrollbar flex items-center justify-center p-5 z-10">
        
        {/* We use a fixed aspect ratio container to hold both SVG and HTML labels perfectly aligned */}
        <div className="relative w-full max-w-[700px] aspect-square flex items-center justify-center min-h-[700px]">
          
          {/* Core Glow */}
          <div className={cn("absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full blur-[40px] pointer-events-none", theme.bg)} />

          {/* SVG Arcs */}
          <svg viewBox="-350 -350 700 700" className="absolute inset-0 w-full h-full overflow-visible">
            {allArcsData.map((d, i) => {
              const word = d.data;
              const isSelected = selectedId === word.id;
              const pathString = d.arcGen(d as any) || "";
              
              const isMatch = searchQuery === "" || word.label.toLowerCase().includes(searchQuery.toLowerCase());
              const opacityState = isMatch ? 1 : 0.05;

              return (
                <motion.path
                  key={`path-${word.id}`}
                  d={pathString}
                  fill={isSelected ? theme.activeFill : theme.fill}
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth={1}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: opacityState,
                    scale: 1,
                  }}
                  whileHover={{ 
                    scale: 1.05, 
                    filter: "brightness(1.5)",
                    stroke: "rgba(255,255,255,0.8)",
                    strokeWidth: 2,
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onSelect(word.id)}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                    opacity: { duration: 0.4, delay: i * 0.02 },
                    scale: { type: "spring", delay: i * 0.02 }
                  }}
                  className="cursor-pointer transition-colors duration-300 drop-shadow-2xl"
                  style={{ transformOrigin: "0 0" }} // Center of viewBox
                />
              );
            })}
          </svg>

          {/* HTML Text Labels overlay */}
          <div className="absolute inset-0 pointer-events-none">
            {allArcsData.map((d, i) => {
              const word = d.data;
              const isSelected = selectedId === word.id;
              const [cx, cy] = d.arcGen.centroid(d as any);
              
              const isMatch = searchQuery === "" || word.label.toLowerCase().includes(searchQuery.toLowerCase());
              const opacityState = isMatch ? 1 : 0.05;

              // The SVG is viewBox="-350 -350 700 700".
              // This maps precisely to 50% + percentage based on max radius 350.
              const xPercent = 50 + (cx / 350) * 50;
              const yPercent = 50 + (cy / 350) * 50;

              return (
                <motion.div
                  key={`label-${word.id}`}
                  className="absolute flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${xPercent}%`,
                    top: `${yPercent}%`,
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: opacityState, scale: 1 }}
                  transition={{ delay: (i * 0.02) + 0.1, duration: 0.3 }}
                >
                  <span className={cn(
                    "font-semibold tracking-tight transition-colors duration-200 text-center drop-shadow-[0_2px_4px_rgba(0,0,0,1)]",
                    isSelected ? "text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" : "text-white/90",
                    d.isExtreme ? "text-sm sm:text-base" : "text-[10px] sm:text-xs"
                  )}>
                    {word.label}
                  </span>
                </motion.div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}
