"use client";

import React, { useState, useMemo } from "react";
import { MOOD_DATA, MoodWord, Quadrant } from "@/lib/mood-data";
import { MoodBubble } from "./MoodBubble";
import { ArrowLeft, Search, X, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

// @ts-expect-error - react-bubble-ui lacks types
import BubbleUI from 'react-bubble-ui';
import 'react-bubble-ui/dist/index.css';

interface AppleWatchMoodFieldProps {
  initialQuadrant: Quadrant;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onBack: () => void;
}

// Helper to interleave words into a grid that keeps Quadrants geometrically organized
function orderWordsForBubbleUI(words: MoodWord[], numCols: number): MoodWord[] {
  const reds = words.filter(w => w.quadrant === "high-unpleasant").sort((a,b) => b.intensity - a.intensity);
  const yellows = words.filter(w => w.quadrant === "high-pleasant").sort((a,b) => b.intensity - a.intensity);
  const blues = words.filter(w => w.quadrant === "low-unpleasant").sort((a,b) => b.intensity - a.intensity);
  const greens = words.filter(w => w.quadrant === "low-pleasant").sort((a,b) => b.intensity - a.intensity);

  const halfCols = Math.floor(numCols / 2);
  const result: MoodWord[] = [];

  let rIndex = 0;
  let yIndex = 0;
  while (rIndex < reds.length || yIndex < yellows.length) {
    for (let i = 0; i < halfCols; i++) {
      if (rIndex < reds.length) result.push(reds[rIndex++]);
      else result.push({ id: `spacer-r-${rIndex++}`, label: "", description: "", intensity: 0, quadrant: "high-unpleasant" } as unknown as MoodWord);
    }
    for (let i = 0; i < halfCols; i++) {
      if (yIndex < yellows.length) result.push(yellows[yIndex++]);
      else result.push({ id: `spacer-y-${yIndex++}`, label: "", description: "", intensity: 0, quadrant: "high-pleasant" } as unknown as MoodWord);
    }
  }

  let bIndex = 0;
  let gIndex = 0;
  while (bIndex < blues.length || gIndex < greens.length) {
    for (let i = 0; i < halfCols; i++) {
      if (bIndex < blues.length) result.push(blues[bIndex++]);
      else result.push({ id: `spacer-b-${bIndex++}`, label: "", description: "", intensity: 0, quadrant: "low-unpleasant" } as unknown as MoodWord);
    }
    for (let i = 0; i < halfCols; i++) {
      if (gIndex < greens.length) result.push(greens[gIndex++]);
      else result.push({ id: `spacer-g-${gIndex++}`, label: "", description: "", intensity: 0, quadrant: "low-pleasant" } as unknown as MoodWord);
    }
  }

  return result;
}

export function AppleWatchMoodField({
  initialQuadrant,
  selectedId,
  onSelect,
  onBack
}: AppleWatchMoodFieldProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Bubble UI setup
  const numCols = 10;
  const orderedWords = useMemo(() => orderWordsForBubbleUI(MOOD_DATA, numCols), []);

  const options = {
    size: 160,
    minSize: 160,
    gutter: 12,
    provideProps: true,
    numCols: numCols,
    fringeWidth: 160,
    yRadius: 200,
    xRadius: 200,
    cornerRadius: 50,
    showGuides: false,
    compact: true,
    gravitation: 3,
    friction: 7
  };

  // Filtered search list
  const filteredWords = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return MOOD_DATA.filter(w =>
      w.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.description.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 8);
  }, [searchQuery]);

  return (
    <div className="relative w-full h-full bg-black overflow-hidden select-none">
      {/* Background Ambient Radial Glow */}
      <div className="absolute inset-0 pointer-events-none opacity-25">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-500/20 rounded-full blur-[120px]" />
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-red-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[120px]" />
      </div>

      {/* Top Header Controls Bar */}
      <div className="absolute top-0 inset-x-0 z-50 flex items-center justify-between px-4 sm:px-6 pt-4 pb-2 bg-gradient-to-b from-black via-black/80 to-transparent pointer-events-none">
        <button
          onClick={onBack}
          className="w-11 h-11 rounded-full bg-[#1C1C1E] border border-white/15 flex items-center justify-center pointer-events-auto hover:bg-[#2C2C2E] active:scale-95 transition-all shadow-xl"
          aria-label="Go back to quadrants"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>

        {/* Search button */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="w-11 h-11 rounded-full bg-[#1C1C1E] border border-white/15 flex items-center justify-center pointer-events-auto hover:bg-[#2C2C2E] active:scale-95 transition-all shadow-xl"
          aria-label="Search emotions"
        >
          <Search className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* 2D Pannable & Draggable Honeycomb Cloud using react-bubble-ui */}
      <div className="absolute inset-0 w-full h-full flex items-center justify-center pt-20 pb-10">
        <BubbleUI options={options} className="w-full h-full custom-bubble-ui">
          {orderedWords.map((word) => {
            if (word.label === "") {
              // Spacer bubble to maintain strictly ordered quadrant grid
              return <div key={word.id} className="w-full h-full opacity-0 pointer-events-none" />;
            }
            return (
              <MoodBubble
                key={word.id}
                word={word}
                isSelected={selectedId === word.id}
                isCenterFocal={false}
                onSelect={onSelect}
                style={{ width: "100%", height: "100%" }}
              />
            );
          })}
        </BubbleUI>
      </div>

      {/* Search Overlay Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col p-6 items-center"
          >
            <div className="w-full max-w-md flex items-center justify-between mb-4">
              <h3 className="text-white text-lg font-serif">Find an Emotion</h3>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="w-full max-w-md relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search emotions (e.g. Joyful, Peaceful, Frustrated)..."
                autoFocus
                className="w-full pl-12 pr-4 py-3.5 bg-[#1C1C1E] text-white rounded-2xl border border-white/15 focus:outline-none focus:border-yellow-400 text-base"
              />
            </div>

            <div className="w-full max-w-md flex-1 overflow-y-auto space-y-2 no-scrollbar">
              {filteredWords.map(word => (
                <button
                  key={word.id}
                  onClick={() => {
                    onSelect(word.id);
                    setIsSearchOpen(false);
                  }}
                  className="w-full text-left p-4 rounded-2xl bg-[#1C1C1E] hover:bg-[#2C2C2E] border border-white/5 flex items-center justify-between transition-colors group"
                >
                  <div>
                    <span className="font-bold text-white text-lg group-hover:text-yellow-400 transition-colors">
                      {word.label}
                    </span>
                    <p className="text-gray-400 text-xs line-clamp-1 mt-0.5">{word.description}</p>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-white/10 text-gray-300 capitalize">
                    {word.quadrant.replace("-", " ")}
                  </span>
                </button>
              ))}

              {searchQuery.trim() && filteredWords.length === 0 && (
                <p className="text-center text-gray-500 mt-8">No matching emotion words found</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Instructions Hint */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 0.7, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="absolute bottom-20 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 pointer-events-none text-xs text-gray-300 flex items-center gap-1.5 shadow-lg"
      >
        <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
        <span>Scroll to explore emotions</span>
      </motion.div>
    </div>
  );
}
