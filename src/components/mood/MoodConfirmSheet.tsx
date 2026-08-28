"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MoodWord, Quadrant } from "@/lib/mood-data";
import { Check, Sparkles } from "lucide-react";

interface MoodConfirmSheetProps {
  word: MoodWord | null;
  onConfirm: () => void;
  isLoading?: boolean;
}

const QUADRANT_COLORS: Record<Quadrant, { hex: string; glow: string; textHex: string }> = {
  "high-pleasant": { hex: "#FFD84D", glow: "rgba(255,216,77,0.3)", textHex: "#FFE899" },
  "high-unpleasant": { hex: "#FF4B5C", glow: "rgba(255,75,92,0.3)", textHex: "#FF8C9A" },
  "low-unpleasant": { hex: "#5EB3FF", glow: "rgba(94,179,255,0.3)", textHex: "#8FBBFF" },
  "low-pleasant": { hex: "#4ADE9E", glow: "rgba(74,222,158,0.3)", textHex: "#7BE5BA" }
};

export function MoodConfirmSheet({ word, onConfirm, isLoading = false }: MoodConfirmSheetProps) {
  const currentColors = word ? (QUADRANT_COLORS[word.quadrant] || QUADRANT_COLORS["high-pleasant"]) : null;

  return (
    <AnimatePresence>
      {word && (
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 26 }}
          className="fixed bottom-0 left-0 right-0 z-[100] px-4 pb-[max(20px,env(safe-area-inset-bottom))] pt-0 flex justify-center pointer-events-none"
        >
          <div className="w-full max-w-[540px] bg-[#141416]/95 backdrop-blur-2xl rounded-3xl p-5 sm:p-6 flex items-center justify-between gap-4 pointer-events-auto shadow-[0_-10px_40px_rgba(0,0,0,0.8)] border border-white/10 relative overflow-hidden">
            {/* Subtle radial ambient glow reflecting the emotion color */}
            {currentColors && (
              <div
                className="absolute -top-12 -left-12 w-48 h-48 rounded-full blur-3xl pointer-events-none"
                style={{ backgroundColor: currentColors.glow }}
              />
            )}

            <div className="flex-1 min-w-0 pr-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-yellow-400" /> Selected Emotion
                </span>
              </div>
              <h2
                className="text-2xl sm:text-3xl font-serif font-bold leading-tight truncate"
                style={{ color: currentColors?.hex || "#FFFFFF" }}
              >
                {word.label}
              </h2>
              <p className="text-gray-300 text-sm leading-snug line-clamp-2 mt-1">
                {word.description}
              </p>
            </div>

            {/* Confirm Log Action Button */}
            <motion.button
              onClick={onConfirm}
              disabled={isLoading}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              className="px-5 py-3.5 rounded-2xl bg-card text-foreground font-semibold text-sm flex items-center gap-2 shadow-xl hover:bg-muted active:scale-95 transition-all shrink-0 cursor-pointer"
              aria-label="Confirm mood selection"
            >
              <Check className="w-4 h-4 text-foreground stroke-[3]" />
              <span>Log Feeling</span>
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
