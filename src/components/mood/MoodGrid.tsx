"use client";

import React, { useState, useMemo } from "react";
import { X, Search } from "lucide-react";
import { Quadrant, MOOD_DATA } from "@/lib/mood-data";
import { MoodBlob } from "./MoodBlob";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface MoodGridProps {
  initialQuadrant: Quadrant;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onBack: () => void;
}

const QUADRANT_THEMES: Record<Quadrant, { title: string; subtitle: string; bg: string }> = {
  "high-pleasant": { title: "High Energy, Pleasant", subtitle: "Joyful, Excited, Energized", bg: "bg-[#FFC837]/10" },
  "high-unpleasant": { title: "High Energy, Unpleasant", subtitle: "Angry, Anxious, Frustrated", bg: "bg-[#FF3B4E]/10" },
  "low-unpleasant": { title: "Low Energy, Unpleasant", subtitle: "Sad, Exhausted, Hopeless", bg: "bg-[#3B82F6]/10" },
  "low-pleasant": { title: "Low Energy, Pleasant", subtitle: "Calm, Relaxed, Serene", bg: "bg-[#10B981]/10" },
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

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 200, damping: 25 }
  }
};

export function MoodGrid({ initialQuadrant, selectedId, onSelect, onBack }: MoodGridProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const theme = QUADRANT_THEMES[initialQuadrant];

  const relevantMoods = useMemo(() => {
    let moods = MOOD_DATA.filter(w => w.quadrant === initialQuadrant);
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      moods = moods.filter(w => w.label.toLowerCase().includes(q));
    }
    return moods.sort((a, b) => a.label.localeCompare(b.label));
  }, [initialQuadrant, searchQuery]);

  const extremeMoods = relevantMoods.filter(w => w.intensity >= 4);
  const moderateMoods = relevantMoods.filter(w => w.intensity === 3);
  const mildMoods = relevantMoods.filter(w => w.intensity <= 2);

  // Helper to generate a stable staggered Y offset to break the "grid" look
  const getPebbleOffset = (index: number) => {
    if (index % 3 === 0) return 15;
    if (index % 3 === 1) return -10;
    return 5;
  };

  return (
    <div className={cn("relative w-full h-full flex flex-col overflow-hidden bg-black")}>
      
      {/* Soft Ambient Zen Background */}
      <motion.div 
        className={cn("absolute inset-0 opacity-40 mix-blend-screen pointer-events-none", theme.bg)}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        style={{ filter: "blur(120px)" }}
      />

      {/* Pinned Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="shrink-0 z-50 px-5 pt-4 pb-4 border-b border-white/5 bg-black/40 backdrop-blur-2xl" 
        style={{ paddingTop: "calc(env(safe-area-inset-top) + 16px)" }}
      >
        <div className="flex flex-col gap-4 max-w-4xl mx-auto">
          {/* Top Bar */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white tracking-tight">{theme.title}</h2>
              <p className="text-sm text-white/50">{theme.subtitle}</p>
            </div>
            
            <button
              onClick={onBack}
              className="shrink-0 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all shadow-xl ml-4"
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
              className="w-full h-11 bg-white/5 border border-white/10 rounded-2xl pl-10 pr-4 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-colors"
            />
          </div>
        </div>
      </motion.div>

      {/* Zen Pebble Layout */}
      <motion.div 
        className="flex-1 overflow-y-auto overscroll-contain no-scrollbar px-2 sm:px-5 py-10 pb-40 z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-16">
          
          <AnimatePresence>
            {relevantMoods.length === 0 && (
              <motion.div variants={sectionVariants} className="text-center py-20 text-white/40 w-full">
                No moods found matching "{searchQuery}"
              </motion.div>
            )}
          </AnimatePresence>

          {/* Extreme Section */}
          {extremeMoods.length > 0 && (
            <motion.section variants={sectionVariants} className="w-full">
              <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30 mb-8 text-center">Extreme</h3>
              {/* Scattered pebble layout */}
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-8 px-4">
                <AnimatePresence>
                  {extremeMoods.map((word, i) => (
                    <motion.div 
                      key={word.id} 
                      layout 
                      layoutId={`blob-${word.id}`}
                      style={{ y: getPebbleOffset(i) }}
                    >
                      <MoodBlob word={word} isSelected={selectedId === word.id} onSelect={onSelect} delay={i * 0.05} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.section>
          )}

          {/* Moderate Section */}
          {moderateMoods.length > 0 && (
            <motion.section variants={sectionVariants} className="w-full">
              <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30 mb-8 text-center">Moderate</h3>
              <div className="flex flex-wrap justify-center gap-x-3 gap-y-6 px-4">
                <AnimatePresence>
                  {moderateMoods.map((word, i) => (
                    <motion.div 
                      key={word.id} 
                      layout 
                      layoutId={`blob-${word.id}`}
                      style={{ y: getPebbleOffset(i) * -1 }} // Invert offset for variety
                    >
                      <MoodBlob word={word} isSelected={selectedId === word.id} onSelect={onSelect} delay={(extremeMoods.length + i) * 0.05} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.section>
          )}

          {/* Mild Section */}
          {mildMoods.length > 0 && (
            <motion.section variants={sectionVariants} className="w-full">
              <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30 mb-8 text-center">Mild</h3>
              <div className="flex flex-wrap justify-center gap-x-2 gap-y-5 px-4">
                <AnimatePresence>
                  {mildMoods.map((word, i) => (
                    <motion.div 
                      key={word.id} 
                      layout 
                      layoutId={`blob-${word.id}`}
                      style={{ y: getPebbleOffset(i) }}
                    >
                      <MoodBlob word={word} isSelected={selectedId === word.id} onSelect={onSelect} delay={(extremeMoods.length + moderateMoods.length + i) * 0.05} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.section>
          )}

        </div>
      </motion.div>
    </div>
  );
}
