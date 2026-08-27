"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import { ArrowLeft, Search, Bookmark } from "lucide-react";
import { Quadrant, MOOD_DATA, MoodWord } from "@/lib/mood-data";
import { MoodBubble } from "./MoodBubble";
import * as d3 from "d3-force";

interface MoodGridProps {
  initialQuadrant: Quadrant;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onBack: () => void;
}

// Internal node type for D3 simulation
interface BubbleNode extends d3.SimulationNodeDatum {
  id: string;
  word: MoodWord;
  r: number; // Radius
  quadrant: Quadrant;
}

export function MoodGrid({ initialQuadrant, selectedId, onSelect, onBack }: MoodGridProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<BubbleNode[]>([]);
  const [scale, setScale] = useState(1);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Simple responsive scaling for mobile vs desktop
    const handleResize = () => {
      setScale(window.innerWidth < 640 ? 0.6 : window.innerWidth < 1024 ? 0.8 : 1);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initialize nodes and run D3 physics simulation
  useEffect(() => {
    if (!isClient) return;

    // Helper to get base size
    const getBaseSize = (intensity: number) => {
      switch (intensity) {
        case 5: return 160;
        case 4: return 140;
        case 3: return 120;
        case 2: return 100;
        case 1: return 90;
        default: return 120;
      }
    };

    // Create node array
    const initialNodes: BubbleNode[] = MOOD_DATA.map(word => {
      const size = getBaseSize(word.intensity) * scale;
      return {
        id: word.id,
        word: word,
        r: size / 2,
        quadrant: word.quadrant,
        // Start them slightly scattered near their target to speed up settling
        x: (Math.random() - 0.5) * 100,
        y: (Math.random() - 0.5) * 100,
      };
    });

    // Determine Focal Points for each quadrant (creates the color grouping)
    // Distance from center controls how tightly the 4 quadrants merge
    const focalDist = 220 * scale; 
    
    const getTargetX = (q: Quadrant) => (q === "high-pleasant" || q === "low-pleasant" ? focalDist : -focalDist);
    const getTargetY = (q: Quadrant) => (q === "low-unpleasant" || q === "low-pleasant" ? focalDist : -focalDist);

    // Run Force Simulation
    const simulation = d3.forceSimulation<BubbleNode>(initialNodes)
      // Force bubbles towards their color's quadrant center
      .force("x", d3.forceX<BubbleNode>(d => getTargetX(d.quadrant)).strength(0.08))
      .force("y", d3.forceY<BubbleNode>(d => getTargetY(d.quadrant)).strength(0.08))
      // Prevent any overlapping with a 4px gap padding
      .force("collide", d3.forceCollide<BubbleNode>().radius(d => d.r + 4).iterations(3))
      // Slight center gravity to pull the 4 quadrants together into one unified map
      .force("center", d3.forceCenter(0, 0).strength(0.02))
      .on("tick", () => {
        // Update React state on every physics tick
        setNodes([...initialNodes]);
      });

    // Run hot initially to settle the layout faster
    simulation.alpha(1).restart();

    return () => {
      simulation.stop();
    };
  }, [scale, isClient]);

  // Center scroll container on mount based on selected quadrant
  useEffect(() => {
    if (scrollRef.current && isClient) {
      const el = scrollRef.current;
      const isRight = initialQuadrant === "high-pleasant" || initialQuadrant === "low-pleasant";
      const isBottom = initialQuadrant === "low-unpleasant" || initialQuadrant === "low-pleasant";

      // The canvas is 2400x2400, center is 1200,1200
      const center = 1200;
      const offset = 300 * scale;

      setTimeout(() => {
        const targetX = center + (isRight ? offset : -offset) - (el.clientWidth / 2);
        const targetY = center + (isBottom ? offset : -offset) - (el.clientHeight / 2);
        
        el.scrollTo({ left: Math.max(0, targetX), top: Math.max(0, targetY), behavior: "smooth" });
      }, 100);
    }
  }, [initialQuadrant, scale, isClient]);

  if (!isClient) return <div className="w-full h-full bg-black" />; // Avoid SSR hydration mismatch

  // Canvas size defines the scrollable boundary. Center of simulation is exactly in the middle.
  const canvasSize = 2400;

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
          <span className="text-sm font-medium text-white/90">Mood Map</span>
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
        className="w-full h-full overflow-auto overscroll-contain no-scrollbar cursor-grab active:cursor-grabbing"
      >
        {/* Massive internal canvas to allow endless scrolling/panning around the physics cluster */}
        <div 
          className="relative pointer-events-none" 
          style={{ width: canvasSize, height: canvasSize }}
        >
          {nodes.map((node) => {
            return (
              <div 
                key={node.id} 
                className="absolute pointer-events-auto"
                style={{
                  // Position relative to the center of the massive canvas
                  left: (canvasSize / 2) + (node.x || 0),
                  top: (canvasSize / 2) + (node.y || 0)
                }}
              >
                <MoodBubble
                  word={node.word}
                  isSelected={selectedId === node.id}
                  onSelect={onSelect}
                  bubbleSize={node.r * 2}
                  // We handled the absolute center offset in the wrapper div, so x/y are 0 for the bubble itself
                  x={0}
                  y={0}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
