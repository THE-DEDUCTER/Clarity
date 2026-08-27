"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, useMotionValue, useSpring, animate, AnimatePresence } from "framer-motion";
import { MOOD_DATA, MoodWord, Quadrant } from "@/lib/mood-data";
import { MoodBubble } from "./MoodBubble";
import { ArrowLeft, Search, Compass, X, Sparkles } from "lucide-react";

interface AppleWatchMoodFieldProps {
  initialQuadrant: Quadrant;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onBack: () => void;
}

// 2D Positioning coordinates calculation for Honeycomb Circumplex
interface PositionedMoodWord extends MoodWord {
  posX: number;
  posY: number;
}

// Calculate 2D coordinates for all mood words in an Apple Watch honeycomb cloud
function generateHoneycombLayout(words: MoodWord[]): PositionedMoodWord[] {
  const quadrants: Record<Quadrant, MoodWord[]> = {
    "high-pleasant": [],
    "high-unpleasant": [],
    "low-unpleasant": [],
    "low-pleasant": []
  };

  words.forEach(w => quadrants[w.quadrant].push(w));

  // We place the clusters closer together (~560px between centers)
  // so they form one single cohesive cloud, rather than four isolated islands.
  const quadrantCenters: Record<Quadrant, { cx: number; cy: number }> = {
    "high-unpleasant": { cx: -280, cy: -280 }, // Top-Left  = Red
    "high-pleasant":   { cx:  280, cy: -280 }, // Top-Right = Yellow
    "low-unpleasant":  { cx: -280, cy:  280 }, // Bot-Left  = Blue
    "low-pleasant":    { cx:  280, cy:  280 }, // Bot-Right = Green
  };

  const positioned: PositionedMoodWord[] = [];

  // Helper to layout a cluster in concentric hexagonal rings
  (Object.keys(quadrants) as Quadrant[]).forEach(q => {
    const list = quadrants[q];
    // Sort by intensity descending so hero/anchor words are at the heart
    const sorted = [...list].sort((a, b) => b.intensity - a.intensity);
    const { cx, cy } = quadrantCenters[q];

    sorted.forEach((word, index) => {
      if (index === 0) {
        // Central anchor of the quadrant
        positioned.push({ ...word, posX: cx, posY: cy });
        return;
      }

      // Fermat's spiral (sunflower) provides organic packing
      // Tighter 'c' (105) because bubbles are scaled down
      const c = 105;
      const radius = Math.sqrt(index) * c;
      const angle = index * 2.39996; // golden angle in radians

      // Pull each cluster gently toward (0,0) so the four clouds touch at the center.
      const pullX = cx > 0 ? -25 : 25; 
      const pullY = cy > 0 ? -25 : 25; 

      const posX = cx + Math.cos(angle) * radius + pullX;
      const posY = cy + Math.sin(angle) * radius + pullY;

      positioned.push({
        ...word,
        posX: Math.round(posX),
        posY: Math.round(posY)
      });
    });
  });

  return positioned;
}

export function AppleWatchMoodField({
  initialQuadrant,
  selectedId,
  onSelect,
  onBack
}: AppleWatchMoodFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewportSize, setViewportSize] = useState({ width: 1000, height: 800 });
  const [activeQuadrantTab, setActiveQuadrantTab] = useState<Quadrant>(initialQuadrant);
  const [closestWordId, setClosestWordId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Positioned emotion bubbles
  const positionedWords = useMemo(() => generateHoneycombLayout(MOOD_DATA), []);

  // Framer motion values for 2D panning with spring inertia
  const panX = useMotionValue(0);
  const panY = useMotionValue(0);

  const springConfig = { damping: 28, stiffness: 220, mass: 0.8 };
  const smoothX = useSpring(panX, springConfig);
  const smoothY = useSpring(panY, springConfig);

  // Measure viewport size
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

  // Quadrant target center coordinates (inverse of layout centers to center them in viewport)
  // To bring a quadrant to the viewport center we negate its layout position
  const quadrantTargetPositions = useMemo<Record<Quadrant, { x: number; y: number }>>(() => {
    return {
      "high-unpleasant": { x:  280, y:  280 }, // Red   top-left  → pan right+down
      "high-pleasant":   { x: -280, y:  280 }, // Yellow top-right → pan left+down
      "low-unpleasant":  { x:  280, y: -280 }, // Blue  bot-left  → pan right+up
      "low-pleasant":    { x: -280, y: -280 }, // Green bot-right → pan left+up
    };
  }, []);

  // Center on a specific quadrant
  const flyToQuadrant = useCallback((quadrant: Quadrant) => {
    setActiveQuadrantTab(quadrant);
    const target = quadrantTargetPositions[quadrant];
    if (target) {
      animate(panX, target.x, { type: "spring", stiffness: 180, damping: 24 });
      animate(panY, target.y, { type: "spring", stiffness: 180, damping: 24 });
    }
  }, [panX, panY, quadrantTargetPositions]);

  // Center on a specific word by id
  const flyToWord = useCallback((wordId: string) => {
    const target = positionedWords.find(w => w.id === wordId);
    if (target) {
      setActiveQuadrantTab(target.quadrant);
      onSelect(target.id);
      animate(panX, -target.posX, { type: "spring", stiffness: 200, damping: 22 });
      animate(panY, -target.posY, { type: "spring", stiffness: 200, damping: 22 });
    }
  }, [positionedWords, onSelect, panX, panY]);

  // Initial positioning to selected quadrant
  useEffect(() => {
    const initialTarget = quadrantTargetPositions[initialQuadrant];
    if (initialTarget) {
      panX.set(initialTarget.x);
      panY.set(initialTarget.y);
    }
  }, [initialQuadrant, quadrantTargetPositions, panX, panY]);

  // Real-time tracking of which bubble is closest to the viewport center (Apple Watch focal detection)
  useEffect(() => {
    const updateFocalWord = () => {
      const currentX = panX.get();
      const currentY = panY.get();

      let minDistance = Infinity;
      let focalId: string | null = null;

      positionedWords.forEach(word => {
        // Word's position on screen relative to center
        const screenX = word.posX + currentX;
        const screenY = word.posY + currentY;
        const distance = Math.hypot(screenX, screenY);

        if (distance < minDistance) {
          minDistance = distance;
          focalId = word.id;
        }
      });

      // Focal detection threshold (within 130px of center)
      if (minDistance < 140) {
        setClosestWordId(focalId);
      } else {
        setClosestWordId(null);
      }
    };

    const unsubscribeX = panX.on("change", updateFocalWord);
    const unsubscribeY = panY.on("change", updateFocalWord);
    updateFocalWord();

    return () => {
      unsubscribeX();
      unsubscribeY();
    };
  }, [panX, panY, positionedWords]);

  // Mouse wheel / trackpad 2D navigation
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const currentX = panX.get();
    const currentY = panY.get();
    const newX = Math.max(-800, Math.min(800, currentX - e.deltaX * 0.8));
    const newY = Math.max(-800, Math.min(800, currentY - e.deltaY * 0.8));
    panX.set(newX);
    panY.set(newY);
  }, [panX, panY]);

  // Filtered search list
  const filteredWords = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return MOOD_DATA.filter(w =>
      w.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.description.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 8);
  }, [searchQuery]);

  // Tab order matches circumplex quadrant order: Red, Yellow, Blue, Green
  const quadrantTabs: { id: Quadrant; label: string; color: string; activeColor: string }[] = [
    { id: "high-unpleasant", label: "High Unpleasant", color: "text-[#FF4B5C]", activeColor: "bg-[#FF4B5C] text-white shadow-[0_0_20px_rgba(255,75,92,0.4)]" },
    { id: "high-pleasant",   label: "High Pleasant",   color: "text-[#FFD84D]", activeColor: "bg-[#FFD84D] text-black shadow-[0_0_20px_rgba(255,216,77,0.4)]" },
    { id: "low-unpleasant",  label: "Low Unpleasant",  color: "text-[#5EB3FF]", activeColor: "bg-[#5EB3FF] text-white shadow-[0_0_20px_rgba(94,179,255,0.4)]" },
    { id: "low-pleasant",    label: "Low Pleasant",    color: "text-[#4ADE9E]", activeColor: "bg-[#4ADE9E] text-black shadow-[0_0_20px_rgba(74,222,158,0.4)]" },
  ];

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      className="relative w-full h-full bg-black overflow-hidden select-none cursor-grab active:cursor-grabbing touch-none"
    >
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

        {/* Quadrant Fast Switcher Pills */}
        <div className="flex items-center gap-1 sm:gap-1.5 p-1 rounded-full bg-[#1C1C1E]/90 border border-white/10 backdrop-blur-md pointer-events-auto shadow-2xl overflow-x-auto max-w-[calc(100vw-120px)] sm:max-w-none no-scrollbar">
          {quadrantTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => flyToQuadrant(tab.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold tracking-tight transition-all duration-300 whitespace-nowrap ${
                activeQuadrantTab === tab.id ? tab.activeColor : `hover:bg-white/10 ${tab.color} opacity-80 hover:opacity-100`
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search button */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="w-11 h-11 rounded-full bg-[#1C1C1E] border border-white/15 flex items-center justify-center pointer-events-auto hover:bg-[#2C2C2E] active:scale-95 transition-all shadow-xl"
          aria-label="Search emotions"
        >
          <Search className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Center Reticle / Subtle state indicator */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-white/5 pointer-events-none flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-white/20 animate-ping" />
      </div>

      {/* 2D Pannable & Draggable Honeycomb Cloud */}
      <motion.div
        drag
        dragConstraints={{
          left: -800,
          right: 800,
          top: -800,
          bottom: 800
        }}
        dragElastic={0.18}
        dragMomentum={true}
        style={{
          x: smoothX,
          y: smoothY,
          left: viewportSize.width / 2,
          top: viewportSize.height / 2
        }}
        className="absolute origin-center will-change-transform"
      >
        {positionedWords.map(word => {
          const isSelected = selectedId === word.id;
          const isCenterFocal = closestWordId === word.id;

          return (
            <div
              key={word.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 will-change-transform"
              style={{
                left: word.posX,
                top: word.posY
              }}
            >
              <MoodBubble
                word={word}
                isSelected={isSelected}
                isCenterFocal={isCenterFocal}
                onSelect={(id) => {
                  onSelect(id);
                  flyToWord(id);
                }}
              />
            </div>
          );
        })}
      </motion.div>

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
                    flyToWord(word.id);
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

      {/* Floating Instructions Hint (fades out on interaction) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 0.7, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="absolute top-20 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 pointer-events-none text-xs text-gray-300 flex items-center gap-1.5 shadow-lg"
      >
        <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
        <span>Drag canvas freely &bull; Center bubble morphs dynamically</span>
      </motion.div>
    </div>
  );
}
