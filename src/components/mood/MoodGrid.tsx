"use client";

import React, { useEffect, useRef } from "react";
import { ArrowLeft, Search, Bookmark } from "lucide-react";
import { Quadrant, MOOD_DATA, MoodWord } from "@/lib/mood-data";
import { MoodBubble } from "./MoodBubble";

interface MoodGridProps {
  initialQuadrant: Quadrant;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onBack: () => void;
}

export function MoodGrid({ initialQuadrant, selectedId, onSelect, onBack }: MoodGridProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Group data by quadrant and sort by intensity
  const getQuadrantData = (quadrant: Quadrant) => 
    MOOD_DATA.filter((w) => w.quadrant === quadrant).sort((a, b) => b.intensity - a.intensity);

  const red = getQuadrantData("high-unpleasant");
  const yellow = getQuadrantData("high-pleasant");
  const blue = getQuadrantData("low-unpleasant");
  const green = getQuadrantData("low-pleasant");

  // Scroll to the selected quadrant on mount
  useEffect(() => {
    if (scrollRef.current) {
      const el = scrollRef.current;
      const isRight = initialQuadrant === "high-pleasant" || initialQuadrant === "low-pleasant";
      const isBottom = initialQuadrant === "low-unpleasant" || initialQuadrant === "low-pleasant";

      setTimeout(() => {
        const targetX = isRight ? el.scrollWidth / 2 : 0;
        const targetY = isBottom ? el.scrollHeight / 2 : 0;
        el.scrollTo({ left: targetX, top: targetY, behavior: "smooth" });
      }, 50);
    }
  }, [initialQuadrant]);

  // A helper component to render a cleanly gridded quadrant block without strict "box" styling
  const QuadrantBlock = ({ words }: { words: MoodWord[] }) => (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-4">
      {words.map((word) => (
        <div key={word.id} className="flex items-center justify-center">
          <MoodBubble
            word={word}
            isSelected={selectedId === word.id}
            onSelect={onSelect}
          />
        </div>
      ))}
    </div>
  );

  return (
    <div className="relative w-full h-full bg-black flex flex-col overflow-hidden">
      {/* Header Chrome */}
      <div className="absolute top-0 inset-x-0 z-50 flex items-center justify-between px-5 pt-4 pb-4 bg-gradient-to-b from-black via-black/80 to-transparent pointer-events-none" style={{ paddingTop: "calc(env(safe-area-inset-top) + 16px)" }}>
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-[#1C1C1E] border border-white/10 flex items-center justify-center pointer-events-auto hover:bg-[#2C2C2E] active:scale-95 transition-all shadow-xl"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>

        <div className="px-4 py-2 rounded-full bg-[#1C1C1E]/90 border border-white/10 backdrop-blur-md pointer-events-auto flex items-center gap-2 shadow-2xl">
          <Bookmark className="w-4 h-4 text-white/70" />
          <span className="text-sm font-medium text-white/90">Mood Grid</span>
        </div>

        <button
          className="w-10 h-10 rounded-full bg-[#1C1C1E] border border-white/10 flex items-center justify-center pointer-events-auto hover:bg-[#2C2C2E] active:scale-95 transition-all shadow-xl"
          aria-label="Search"
        >
          <Search className="w-[18px] h-[18px] text-white" />
        </button>
      </div>

      {/* Native 2D Scroll Container */}
      <div 
        ref={scrollRef}
        className="w-full h-full overflow-auto overscroll-contain pt-24 pb-32 px-2 sm:px-4 no-scrollbar"
      >
        {/* Master Square Container */}
        <div className="flex flex-col gap-2 sm:gap-4 w-max mx-auto">
          {/* Top Half */}
          <div className="flex gap-2 sm:gap-4">
            <QuadrantBlock words={red} />
            <QuadrantBlock words={yellow} />
          </div>
          {/* Bottom Half */}
          <div className="flex gap-2 sm:gap-4">
            <QuadrantBlock words={blue} />
            <QuadrantBlock words={green} />
          </div>
        </div>
      </div>
    </div>
  );
}
