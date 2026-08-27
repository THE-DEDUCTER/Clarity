"use client";

import React, { useState, useMemo } from "react";
import { X, Search } from "lucide-react";
import { Quadrant, MOOD_DATA } from "@/lib/mood-data";
import { MoodBubble } from "./MoodBubble";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

interface MoodGridProps {
  initialQuadrant: Quadrant;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onBack: () => void;
}

const QUADRANT_THEMES: Record<Quadrant, { title: string; subtitle: string; bg: string; border: string }> = {
  "high-pleasant": { title: "High Energy, Pleasant", subtitle: "Joyful, Excited, Energized", bg: "bg-[#FFC837]/10", border: "border-[#FFC837]/30" },
  "high-unpleasant": { title: "High Energy, Unpleasant", subtitle: "Angry, Anxious, Frustrated", bg: "bg-[#FF3B4E]/10", border: "border-[#FF3B4E]/30" },
  "low-unpleasant": { title: "Low Energy, Unpleasant", subtitle: "Sad, Exhausted, Hopeless", bg: "bg-[#3B82F6]/10", border: "border-[#3B82F6]/30" },
  "low-pleasant": { title: "Low Energy, Pleasant", subtitle: "Calm, Relaxed, Serene", bg: "bg-[#10B981]/10", border: "border-[#10B981]/30" },
};

export function MoodGrid({ initialQuadrant, selectedId, onSelect, onBack }: MoodGridProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const theme = QUADRANT_THEMES[initialQuadrant];

  const allMoods = useMemo(() => {
    return MOOD_DATA.filter(w => w.quadrant === initialQuadrant).sort((a, b) => a.label.localeCompare(b.label));
  }, [initialQuadrant]);

  const extremeMoods = allMoods.filter(w => w.intensity >= 4);
  const moderateMoods = allMoods.filter(w => w.intensity === 3);
  const mildMoods = allMoods.filter(w => w.intensity <= 2);

  // Define Orbital Radii
  const R_EXTREME = 160;
  const R_MODERATE = 300;
  const R_MILD = 450;
  const CANVAS_SIZE = 1200; // Large enough to hold the 450 radius comfortably

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden bg-black">
      
      {/* Ambient Breathing Background Gradient */}
      <motion.div 
        className={cn("absolute inset-0 opacity-40 mix-blend-screen pointer-events-none", theme.bg)}
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ 
          opacity: [0.2, 0.4, 0.2],
          scale: [1, 1.05, 1],
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
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
        <div className="flex flex-col gap-4 max-w-3xl mx-auto">
          {/* Top Bar */}
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

          {/* Search Bar */}
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

      {/* Orbital Solar System Map */}
      <div className="flex-1 w-full h-full cursor-grab active:cursor-grabbing z-10 overflow-hidden">
        <TransformWrapper
          initialScale={0.75}
          minScale={0.3}
          maxScale={2}
          centerOnInit={true}
          wheel={{ step: 0.1 }}
          panning={{ velocityDisabled: false }}
          doubleClick={{ disabled: true }}
        >
          <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }}>
            
            <div 
              className="relative pointer-events-none" 
              style={{ width: CANVAS_SIZE, height: CANVAS_SIZE }}
            >
              
              {/* The Core */}
              <div 
                className={cn("absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full blur-[60px] pointer-events-none", theme.bg)}
              />

              {/* Orbital Rings */}
              <div className={cn("absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed opacity-30", theme.border)} style={{ width: R_EXTREME * 2, height: R_EXTREME * 2 }} />
              <div className={cn("absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed opacity-20", theme.border)} style={{ width: R_MODERATE * 2, height: R_MODERATE * 2 }} />
              <div className={cn("absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed opacity-10", theme.border)} style={{ width: R_MILD * 2, height: R_MILD * 2 }} />

              {/* Inner Ring (Extreme) */}
              <div className="absolute top-1/2 left-1/2 pointer-events-auto">
                {extremeMoods.map((word, i) => {
                  const angle = (i / extremeMoods.length) * 2 * Math.PI - Math.PI / 2;
                  const x = Math.cos(angle) * R_EXTREME;
                  const y = Math.sin(angle) * R_EXTREME;
                  return (
                    <MoodBubble key={word.id} word={word} isSelected={selectedId === word.id} onSelect={onSelect} x={x} y={y} delay={i * 0.05} searchQuery={searchQuery} />
                  );
                })}
              </div>

              {/* Middle Ring (Moderate) */}
              <div className="absolute top-1/2 left-1/2 pointer-events-auto">
                {moderateMoods.map((word, i) => {
                  const angle = (i / moderateMoods.length) * 2 * Math.PI - Math.PI / 2;
                  const x = Math.cos(angle) * R_MODERATE;
                  const y = Math.sin(angle) * R_MODERATE;
                  return (
                    <MoodBubble key={word.id} word={word} isSelected={selectedId === word.id} onSelect={onSelect} x={x} y={y} delay={(extremeMoods.length + i) * 0.05} searchQuery={searchQuery} />
                  );
                })}
              </div>

              {/* Outer Ring (Mild) */}
              <div className="absolute top-1/2 left-1/2 pointer-events-auto">
                {mildMoods.map((word, i) => {
                  const angle = (i / mildMoods.length) * 2 * Math.PI - Math.PI / 2;
                  const x = Math.cos(angle) * R_MILD;
                  const y = Math.sin(angle) * R_MILD;
                  return (
                    <MoodBubble key={word.id} word={word} isSelected={selectedId === word.id} onSelect={onSelect} x={x} y={y} delay={(extremeMoods.length + moderateMoods.length + i) * 0.05} searchQuery={searchQuery} />
                  );
                })}
              </div>

            </div>
          </TransformComponent>
        </TransformWrapper>
      </div>
    </div>
  );
}
