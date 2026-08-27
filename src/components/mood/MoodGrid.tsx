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
    <div className={cn("relative w-full h-full flex flex-col overflow-hidden bg-black", theme.bg)}>
      {/* Pinned Header */}
      <div 
        className="shrink-0 z-50 px-5 pt-4 pb-4 border-b border-white/5 bg-black/80 backdrop-blur-xl" 
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
      </div>

      {/* Scrollable List */}
      <div className="flex-1 overflow-y-auto overscroll-contain no-scrollbar p-5 pb-32">
        <div className="max-w-3xl mx-auto flex flex-col gap-10">
          
          {relevantMoods.length === 0 && (
            <div className="text-center py-20 text-white/40">
              No moods found matching "{searchQuery}"
            </div>
          )}

          {/* Extreme Section */}
          {extremeMoods.length > 0 && (
            <section>
              <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4 px-1">Extreme</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {extremeMoods.map(word => (
                  <MoodBubble key={word.id} word={word} isSelected={selectedId === word.id} onSelect={onSelect} />
                ))}
              </div>
            </section>
          )}

          {/* Moderate Section */}
          {moderateMoods.length > 0 && (
            <section>
              <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4 px-1">Moderate</h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                {moderateMoods.map(word => (
                  <MoodBubble key={word.id} word={word} isSelected={selectedId === word.id} onSelect={onSelect} />
                ))}
              </div>
            </section>
          )}

          {/* Mild Section */}
          {mildMoods.length > 0 && (
            <section>
              <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4 px-1">Mild</h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2">
                {mildMoods.map(word => (
                  <MoodBubble key={word.id} word={word} isSelected={selectedId === word.id} onSelect={onSelect} />
                ))}
              </div>
            </section>
          )}

        </div>
      </div>
    </div>
  );
}
