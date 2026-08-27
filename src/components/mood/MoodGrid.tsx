"use client";

import { useMemo, useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { MOOD_DATA, Quadrant } from "@/lib/mood-data";
import { MoodBubble } from "./MoodBubble";
import { ArrowLeft, Search, Bookmark } from "lucide-react";

interface MoodGridProps {
  initialQuadrant: Quadrant;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onBack: () => void;
}

// Helper to chunk array
const chunk = <T,>(arr: T[], size: number): T[][] => {
  return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size)
  );
};

export function MoodGrid({ initialQuadrant, selectedId, onSelect, onBack }: MoodGridProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Organize data physically into the circumplex model
  // Top-Left: Red, Top-Right: Yellow
  // Bottom-Left: Blue, Bottom-Right: Green
  const rows = useMemo(() => {
    const red = MOOD_DATA.filter(m => m.quadrant === "high-unpleasant");
    const yellow = MOOD_DATA.filter(m => m.quadrant === "high-pleasant");
    const blue = MOOD_DATA.filter(m => m.quadrant === "low-unpleasant");
    const green = MOOD_DATA.filter(m => m.quadrant === "low-pleasant");

    // Pad arrays so they match in size for easier gridding
    // Realistically you'd want exactly N items per quadrant.
    
    // We want about 3-4 bubbles per half-row (6-8 per full row)
    const redRows = chunk(red, 4);
    const yellowRows = chunk(yellow, 4);
    const blueRows = chunk(blue, 4);
    const greenRows = chunk(green, 4);

    const maxTopRows = Math.max(redRows.length, yellowRows.length);
    const maxBottomRows = Math.max(blueRows.length, greenRows.length);

    const assembledRows = [];

    // Top half (Red | Yellow)
    for (let i = 0; i < maxTopRows; i++) {
      const left = redRows[i] || [];
      const right = yellowRows[i] || [];
      assembledRows.push([...left, ...right]);
    }

    // Bottom half (Blue | Green)
    for (let i = 0; i < maxBottomRows; i++) {
      const left = blueRows[i] || [];
      const right = greenRows[i] || [];
      assembledRows.push([...left, ...right]);
    }

    return assembledRows;
  }, []);

  // Initial scroll positioning
  useEffect(() => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    
    // Calculate approximate offset based on quadrant
    // This is a naive scroll jump, a real app would measure element positions
    const maxScrollTop = el.scrollHeight - el.clientHeight;
    const maxScrollLeft = el.scrollWidth - el.clientWidth;

    let targetTop = 0;
    let targetLeft = 0;

    switch (initialQuadrant) {
      case "high-unpleasant": // Top Left
        targetTop = 0; targetLeft = 0; break;
      case "high-pleasant": // Top Right
        targetTop = 0; targetLeft = maxScrollLeft; break;
      case "low-unpleasant": // Bottom Left
        targetTop = maxScrollTop; targetLeft = 0; break;
      case "low-pleasant": // Bottom Right
        targetTop = maxScrollTop; targetLeft = maxScrollLeft; break;
    }

    el.scrollTo({ top: targetTop, left: targetLeft, behavior: 'instant' });
  }, [initialQuadrant]);

  return (
    <div className="flex flex-col h-full w-full bg-black overflow-hidden relative">
      {/* Header Chrome */}
      <div className="absolute top-0 inset-x-0 h-24 z-50 flex items-center justify-between px-6 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
        <button 
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-[#1A1A1A] border border-white/10 flex items-center justify-center pointer-events-auto hover:bg-[#2A2A2A] transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        
        <div className="w-10 h-10 rounded-full bg-[#1A1A1A] border border-white/10 flex items-center justify-center pointer-events-auto shadow-md">
          <Bookmark className="w-4 h-4 text-white" />
        </div>

        <button className="w-10 h-10 rounded-full bg-[#1A1A1A] border border-white/10 flex items-center justify-center pointer-events-auto hover:bg-[#2A2A2A] transition-colors">
          <Search className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Grid Container */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-auto touch-pan-x touch-pan-y no-scrollbar"
        style={{
          // We add padding to allow panning past the edges
          padding: '120px 40px 240px 40px' 
        }}
      >
        <motion.div 
          className="flex flex-col items-center justify-center min-w-max"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          {rows.map((row, rowIndex) => {
            const isOffset = rowIndex % 2 !== 0;
            return (
              <div 
                key={rowIndex} 
                className="flex items-center justify-center"
                style={{ 
                  marginLeft: isOffset ? '80px' : '0px',
                  // Negative margin top brings rows closer to interlock them
                  marginTop: rowIndex > 0 ? '-20px' : '0px'
                }}
              >
                {row.map(word => (
                  <MoodBubble 
                    key={word.id} 
                    word={word} 
                    isSelected={selectedId === word.id} 
                    onSelect={onSelect} 
                  />
                ))}
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
