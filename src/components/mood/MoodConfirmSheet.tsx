"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MoodWord, Quadrant } from "@/lib/mood-data";
import { ArrowRight } from "lucide-react";

interface MoodConfirmSheetProps {
  word: MoodWord | null;
  onConfirm: () => void;
}

const QUADRANT_COLORS: Record<Quadrant, string> = {
  "high-unpleasant": "#FF4B5C",
  "high-pleasant": "#FFD84D",
  "low-unpleasant": "#3B82F6",
  "low-pleasant": "#10B981"
};

export function MoodConfirmSheet({ word, onConfirm }: MoodConfirmSheetProps) {
  return (
    <AnimatePresence>
      {word && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-0 left-0 right-0 z-[100] px-4 pb-[max(16px,env(safe-area-inset-bottom))] pt-0 flex justify-center pointer-events-none"
        >
          <div className="w-full max-w-[500px] bg-[#1C1C1E]/95 backdrop-blur-xl rounded-t-[28px] p-5 sm:p-6 flex items-center justify-between gap-4 pointer-events-auto shadow-2xl border-t border-white/5 relative overflow-hidden">
            {/* Subtle glow reflecting the emotion color */}
            <div 
              className="absolute -top-10 -left-10 w-32 h-32 rounded-full blur-3xl opacity-10 pointer-events-none"
              style={{ backgroundColor: QUADRANT_COLORS[word.quadrant] }}
            />

            <div className="flex-1 min-w-0 pr-4">
              <h2 
                className="text-[22px] font-bold leading-tight mb-1 truncate"
                style={{ color: QUADRANT_COLORS[word.quadrant] }}
              >
                {word.label}
              </h2>
              <p className="text-gray-300 text-[15px] leading-snug line-clamp-2">
                {word.description}
              </p>
            </div>

            <button 
              onClick={onConfirm}
              className="w-14 h-14 shrink-0 rounded-full bg-white flex items-center justify-center hover:scale-105 active:scale-95 transition-transform duration-200 shadow-lg"
              aria-label="Confirm mood"
            >
              <ArrowRight className="w-6 h-6 text-black" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
