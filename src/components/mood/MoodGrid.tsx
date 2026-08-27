"use client";

import React, { useRef, useEffect, useMemo, useState } from "react";
import { ArrowLeft, Search, Bookmark } from "lucide-react";
import { Quadrant, MOOD_DATA, MoodWord } from "@/lib/mood-data";
import { MoodBubble } from "./MoodBubble";
import { motion, useMotionValue, useSpring, animate } from "framer-motion";

interface MoodGridProps {
  initialQuadrant: Quadrant;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onBack: () => void;
}

export function MoodGrid({ initialQuadrant, selectedId, onSelect, onBack }: MoodGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewportSize, setViewportSize] = useState({ width: 1000, height: 800 });

  // Framer motion values for incredibly slick 2D panning with spring inertia
  const panX = useMotionValue(0);
  const panY = useMotionValue(0);
  const springConfig = { damping: 28, stiffness: 220, mass: 0.8 };
  const smoothX = useSpring(panX, springConfig);
  const smoothY = useSpring(panY, springConfig);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setViewportSize({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ── 1. Group and sort words by quadrant ──────────────────────────────────────
  const gridRows = useMemo(() => {
    const red = MOOD_DATA.filter((w) => w.quadrant === "high-unpleasant").sort((a, b) => b.intensity - a.intensity);
    const yellow = MOOD_DATA.filter((w) => w.quadrant === "high-pleasant").sort((a, b) => b.intensity - a.intensity);
    const blue = MOOD_DATA.filter((w) => w.quadrant === "low-unpleasant").sort((a, b) => b.intensity - a.intensity);
    const green = MOOD_DATA.filter((w) => w.quadrant === "low-pleasant").sort((a, b) => b.intensity - a.intensity);

    const rows: (MoodWord | null)[][] = [];

    // Top half: Red (Left 3) + Yellow (Right 3)
    const topRowCount = Math.max(Math.ceil(red.length / 3), Math.ceil(yellow.length / 3));
    for (let i = 0; i < topRowCount; i++) {
      const r = red.slice(i * 3, i * 3 + 3);
      const y = yellow.slice(i * 3, i * 3 + 3);
      while (r.length < 3) r.push(null);
      while (y.length < 3) y.push(null);
      rows.push([...r, ...y]);
    }

    // Bottom half: Blue (Left 3) + Green (Right 3)
    const botRowCount = Math.max(Math.ceil(blue.length / 3), Math.ceil(green.length / 3));
    for (let i = 0; i < botRowCount; i++) {
      const b = blue.slice(i * 3, i * 3 + 3);
      const g = green.slice(i * 3, i * 3 + 3);
      while (b.length < 3) b.push(null);
      while (g.length < 3) g.push(null);
      rows.push([...b, ...g]);
    }

    return rows;
  }, []);

  // ── 2. Pan to the deep-linked quadrant on mount ───────────────────────────
  useEffect(() => {
    // The grid is ~780px wide (6 cols * 130px) and ~1200px tall.
    // Center is 0,0 for Framer Motion since it's centered in the viewport.
    // We animate panX and panY to center the desired quadrant.
    const isRight = initialQuadrant === "high-pleasant" || initialQuadrant === "low-pleasant";
    const isBottom = initialQuadrant === "low-unpleasant" || initialQuadrant === "low-pleasant";

    // Target coordinates to bring a quadrant into view
    const targetX = isRight ? -250 : 250;
    const targetY = isBottom ? -350 : 350;

    animate(panX, targetX, { type: "spring", stiffness: 180, damping: 24 });
    animate(panY, targetY, { type: "spring", stiffness: 180, damping: 24 });
  }, [initialQuadrant, panX, panY]);

  // Mouse wheel / trackpad 2D navigation
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const currentX = panX.get();
    const currentY = panY.get();
    // Clamp constraints
    const newX = Math.max(-600, Math.min(600, currentX - e.deltaX * 0.8));
    const newY = Math.max(-800, Math.min(800, currentY - e.deltaY * 0.8));
    panX.set(newX);
    panY.set(newY);
  };

  return (
    <div 
      ref={containerRef}
      onWheel={handleWheel}
      className="relative w-full h-full bg-black overflow-hidden flex flex-col touch-none select-none cursor-grab active:cursor-grabbing"
    >
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

      {/* Slick Framer Motion Draggable Container */}
      <motion.div
        drag
        dragConstraints={{ left: -600, right: 600, top: -800, bottom: 800 }}
        dragElastic={0.15}
        dragMomentum={true}
        style={{
          x: smoothX,
          y: smoothY,
          // Start the container roughly centered in the viewport
          left: viewportSize.width / 2 - 390, // half of grid width
          top: viewportSize.height / 2 - 400, // half of grid height
        }}
        className="absolute origin-center will-change-transform"
      >
        <div className="relative py-24 px-12 w-max select-none">
          {gridRows.map((row, rowIndex) => {
            const isOdd = rowIndex % 2 !== 0;
            return (
              <div
                key={rowIndex}
                className="flex items-center"
                style={{
                  // The brick offset: shift odd rows right
                  marginLeft: isOdd ? "65px" : "0",
                  // Very light vertical overlap so bubbles nestle gracefully
                  marginTop: rowIndex === 0 ? "0" : "-10px",
                }}
              >
                {row.map((word, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className="relative flex items-center justify-center"
                    style={{
                      // Larger grid cell gives them more room, preventing massive overlap
                      width: "130px",
                      height: "130px",
                    }}
                  >
                    {word && (
                      <MoodBubble
                        word={word}
                        isSelected={selectedId === word.id}
                        onSelect={onSelect}
                        // Absolute positioning allows organic overflow
                        style={{ position: "absolute" }}
                      />
                    )}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
