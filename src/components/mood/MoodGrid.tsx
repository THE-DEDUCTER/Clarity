"use client";

import React, { useState, useMemo } from "react";
import { X, Search } from "lucide-react";
import { Quadrant, MOOD_DATA } from "@/lib/mood-data";
import { MoodBlob } from "./MoodBlob";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MoodGridProps {
  initialQuadrant?: Quadrant | null;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onBack?: () => void;
}

// Group moods by quadrant
const QUADRANTS: { key: Quadrant; name: string }[] = [
  { key: "high-unpleasant", name: "High Energy, Unpleasant" }, // Top Left
  { key: "high-pleasant", name: "High Energy, Pleasant" }, // Top Right
  { key: "low-unpleasant", name: "Low Energy, Unpleasant" }, // Bottom Left
  { key: "low-pleasant", name: "Low Energy, Pleasant" }, // Bottom Right
];

export function MoodGrid({ initialQuadrant = null, selectedId, onSelect, onBack }: MoodGridProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMoods = useMemo(() => {
    let moods = MOOD_DATA;
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      moods = moods.filter(w => w.label.toLowerCase().includes(q));
    }
    return moods;
  }, [searchQuery]);

  const getMoodsForQuadrant = (quadrant: Quadrant) => {
    return filteredMoods
      .filter(w => w.quadrant === quadrant)
      .sort((a, b) => b.intensity - a.intensity); // Sort by intensity so extreme is near the center
  };

  const getPebbleOffset = (index: number) => {
    if (index % 3 === 0) return 10;
    if (index % 3 === 1) return -8;
    return 4;
  };

  // Calculate the required translation to center the selected quadrant
  const getCameraOffset = (quadrant: Quadrant | null) => {
    switch(quadrant) {
      case "high-unpleasant": return { x: 450, y: 450 }; // Top Left
      case "high-pleasant": return { x: -450, y: 450 }; // Top Right
      case "low-unpleasant": return { x: 450, y: -450 }; // Bottom Left
      case "low-pleasant": return { x: -450, y: -450 }; // Bottom Right
      default: return { x: 0, y: 0 };
    }
  };

  const initialOffset = getCameraOffset(initialQuadrant);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-[#0A0A0A]">
      
      {/* Pinned Header */}
      {onBack && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-0 left-0 right-0 z-50 px-5 pt-4 pb-4 bg-gradient-to-b from-black/80 to-transparent pointer-events-none flex justify-end"
          style={{ paddingTop: "calc(env(safe-area-inset-top) + 16px)" }}
        >
          <button
            onClick={onBack}
            className="shrink-0 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/20 active:scale-95 transition-all shadow-xl pointer-events-auto"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-white/90" />
          </button>
        </motion.div>
      )}

      {/* Floating Search Bar */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4 pointer-events-none">
        <div className="relative pointer-events-auto shadow-2xl shadow-black/50 rounded-2xl">
          <Search className="w-4 h-4 text-white/50 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search moods..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl pl-11 pr-4 text-sm text-white placeholder:text-white/50 focus:outline-none focus:border-white/40 focus:bg-white/20 transition-all"
          />
        </div>
      </div>

      {/* The Unified Map Engine (Framer Motion Drag) */}
      <motion.div 
        className="absolute z-10 w-[1800px] h-[1800px] cursor-grab active:cursor-grabbing"
        drag
        dragConstraints={{ left: -900, right: 900, top: -900, bottom: 900 }}
        dragElastic={0.1}
        initial={{ x: initialOffset.x, y: initialOffset.y, scale: 0.9 }}
        animate={{ x: initialOffset.x, y: initialOffset.y, scale: 1 }}
        transition={{ type: "spring", stiffness: 150, damping: 20 }}
      >
        {/* The Unified 2x2 Map */}
        <div className="grid grid-cols-2 w-full h-full">
          
          {QUADRANTS.map((quadrant, qIndex) => {
            const quadMoods = getMoodsForQuadrant(quadrant.key);
            
            // Alignment based on quadrant position to make them pack towards the center
            const isLeft = qIndex === 0 || qIndex === 2;
            const isTop = qIndex === 0 || qIndex === 1;

            return (
              <div 
                key={quadrant.key} 
                className={cn(
                  "flex flex-wrap content-center p-8 w-[900px] h-[900px]", 
                  isLeft ? "justify-end" : "justify-start",
                )}
              >
                <div className="flex flex-wrap gap-2 justify-center max-w-[800px]">
                  {quadMoods.map((word, i) => (
                    <div 
                      key={word.id} 
                      style={{ 
                        transform: `translateY(${getPebbleOffset(i)}px)`,
                        // Make them flow towards the center visually
                        alignSelf: "center"
                      }}
                    >
                      <MoodBlob 
                        word={word} 
                        isSelected={selectedId === word.id} 
                        onSelect={onSelect} 
                        searchQuery={searchQuery}
                        delay={Math.random() * 0.3} // random entrance staggering
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

        </div>
      </motion.div>
    </div>
  );
}
