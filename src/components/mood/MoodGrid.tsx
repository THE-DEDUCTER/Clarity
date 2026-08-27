"use client";

import React, { useState, useMemo } from "react";
import { X, Search, Bookmark } from "lucide-react";
import { Quadrant, MOOD_DATA, MoodWord } from "@/lib/mood-data";
import { MoodBubble } from "./MoodBubble";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MoodGridProps {
  initialQuadrant: Quadrant;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onBack: () => void;
}

const QUADRANT_THEMES: Record<Quadrant, { title: string; subtitle: string; bg: string }> = {
  "high-pleasant": { title: "High Energy, Pleasant", subtitle: "Joyful, Excited, Energized", bg: "bg-[#FFC837]/5" },
  "high-unpleasant": { title: "High Energy, Unpleasant", subtitle: "Angry, Anxious, Frustrated", bg: "bg-[#FF3B4E]/5" },
  "low-unpleasant": { title: "Low Energy, Unpleasant", subtitle: "Sad, Exhausted, Hopeless", bg: "bg-[#3B82F6]/5" },
  "low-pleasant": { title: "Low Energy, Pleasant", subtitle: "Calm, Relaxed, Serene", bg: "bg-[#10B981]/5" },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  }
};

export function MoodGrid({ initialQuadrant, selectedId, onSelect, onBack }: MoodGridProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const theme = QUADRANT_THEMES[initialQuadrant];

  // 1. Filter by the active quadrant ONLY
  // 2. Filter by search query if exists
  const relevantMoods = useMemo(() => {
    let moods = MOOD_DATA.filter(w => w.quadrant === initialQuadrant);
    
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      moods = moods.filter(w => w.label.toLowerCase().includes(q));
    }
    
    // Sort alphabetically by default
    return moods.sort((a, b) => a.label.localeCompare(b.label));
  }, [initialQuadrant, searchQuery]);

  // Group by intensity
  const extremeMoods = relevantMoods.filter(w => w.intensity >= 4);
  const moderateMoods = relevantMoods.filter(w => w.intensity === 3);
  const mildMoods = relevantMoods.filter(w => w.intensity <= 2);

  return (
    <div className={cn("relative w-full h-full flex flex-col overflow-hidden bg-black")}>
      
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
            
            {/* Explicit Close Button */}
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

      {/* Scrollable List with Staggered Cascades */}
      <motion.div 
        className="flex-1 overflow-y-auto overscroll-contain no-scrollbar p-5 pb-32 z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-3xl mx-auto flex flex-col gap-10">
          
          {relevantMoods.length === 0 && (
            <motion.div variants={itemVariants} className="text-center py-20 text-white/40">
              No moods found matching "{searchQuery}"
            </motion.div>
          )}

          {/* Extreme Section */}
          {extremeMoods.length > 0 && (
            <motion.section variants={containerVariants}>
              <motion.h3 variants={itemVariants} className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4 px-1">Extreme</motion.h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {extremeMoods.map(word => (
                  <motion.div key={word.id} variants={itemVariants} layoutId={`card-${word.id}`}>
                    <MoodBubble word={word} isSelected={selectedId === word.id} onSelect={onSelect} />
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Moderate Section */}
          {moderateMoods.length > 0 && (
            <motion.section variants={containerVariants}>
              <motion.h3 variants={itemVariants} className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4 px-1">Moderate</motion.h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                {moderateMoods.map(word => (
                  <motion.div key={word.id} variants={itemVariants} layoutId={`card-${word.id}`}>
                    <MoodBubble word={word} isSelected={selectedId === word.id} onSelect={onSelect} />
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Mild Section */}
          {mildMoods.length > 0 && (
            <motion.section variants={containerVariants}>
              <motion.h3 variants={itemVariants} className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4 px-1">Mild</motion.h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2">
                {mildMoods.map(word => (
                  <motion.div key={word.id} variants={itemVariants} layoutId={`card-${word.id}`}>
                    <MoodBubble word={word} isSelected={selectedId === word.id} onSelect={onSelect} />
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

        </div>
      </motion.div>
    </div>
  );
}
