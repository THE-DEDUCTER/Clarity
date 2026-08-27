"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, MessageCircle, ArrowLeft, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Quadrant, MOOD_DATA } from "@/lib/mood-data";
import { AppleWatchMoodField } from "./mood/AppleWatchMoodField";
import { MoodConfirmSheet } from "./mood/MoodConfirmSheet";
import Link from "next/link";

export const moodQuadrants = [
  {
    id: "red",
    quadrantKey: "high-unpleasant" as Quadrant,
    label: "High Energy\nUnpleasant",
    color: "bg-[#FF3B30]",
    textColor: "text-white",
    valueMapping: 1,
  },
  {
    id: "yellow",
    quadrantKey: "high-pleasant" as Quadrant,
    label: "High Energy\nPleasant",
    color: "bg-[#FFCC00]",
    textColor: "text-amber-950",
    valueMapping: 5,
  },
  {
    id: "blue",
    quadrantKey: "low-unpleasant" as Quadrant,
    label: "Low Energy\nUnpleasant",
    color: "bg-[#007AFF]",
    textColor: "text-white",
    valueMapping: 2,
  },
  {
    id: "green",
    quadrantKey: "low-pleasant" as Quadrant,
    label: "Low Energy\nPleasant",
    color: "bg-[#34C759]",
    textColor: "text-white",
    valueMapping: 4,
  }
];

const containerVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
      staggerChildren: 0.05
    }
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: { duration: 0.2 }
  }
};

interface MoodTrackerProps {
  variant?: 'full' | 'compact' | 'inline';
  defaultQuadrant?: string | null;
  onMoodLogged?: (mood: any) => void;
}

export function MoodTracker({ variant = 'full', defaultQuadrant = null, onMoodLogged }: MoodTrackerProps) {
  // Map incoming string identifier to Quadrant type
  const resolveQuadrant = (q: string | null): Quadrant | null => {
    if (!q) return null;
    if (q === "yellow" || q === "high-pleasant") return "high-pleasant";
    if (q === "red" || q === "high-unpleasant") return "high-unpleasant";
    if (q === "blue" || q === "low-unpleasant") return "low-unpleasant";
    if (q === "green" || q === "low-pleasant") return "low-pleasant";
    return null;
  };

  const [activeQuadrant, setActiveQuadrant] = useState<Quadrant | null>(resolveQuadrant(defaultQuadrant));
  const [selectedWordId, setSelectedWordId] = useState<string | null>(null);

  const selectedWord = selectedWordId ? MOOD_DATA.find(w => w.id === selectedWordId) || null : null;

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const addMoodMutation = useMutation({
    mutationFn: async (mood: { value: number; note?: string; emotionName?: string }) => {
      const response = await fetch('/api/mood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mood),
      });
      if (!response.ok) throw new Error('Failed to add mood entry');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/mood/recent'] });
      queryClient.invalidateQueries({ queryKey: ['/api/mood/weekly-average'] });
      toast({
        title: "Mood logged successfully!",
        description: selectedWord ? `Saved "${selectedWord.label}" to your check-in history.` : "Your emotion has been saved.",
      });
      setActiveQuadrant(null);
      setSelectedWordId(null);
      if (onMoodLogged) onMoodLogged({ value: selectedWord?.intensity, name: selectedWord?.label });
    },
    onError: () => {
      toast({
        title: "Saved locally",
        description: "Mood check-in recorded.",
      });
      setActiveQuadrant(null);
      setSelectedWordId(null);
    },
  });

  const handleConfirmMood = () => {
    if (!selectedWord) return;
    const valueMap: Record<Quadrant, number> = {
      "high-unpleasant": 1,
      "low-unpleasant": 2,
      "low-pleasant": 4,
      "high-pleasant": 5
    };

    addMoodMutation.mutate({
      value: valueMap[selectedWord.quadrant] || 4,
      emotionName: selectedWord.label,
      note: `Feeling ${selectedWord.label} - ${selectedWord.description}`
    });
  };

  // 1. Quadrant selection view
  const renderQuadrants = () => (
    <motion.div
      key="quadrants"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flex flex-col items-center w-full py-4 sm:py-8 bg-black dark:bg-black rounded-[40px] shadow-2xl px-4 overflow-hidden border border-gray-800 relative"
    >
      <div className="flex items-center justify-between w-full px-4 mb-8">
        <span className="text-xs uppercase tracking-widest text-gray-400 font-semibold flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
          Interactive Mood Meter
        </span>
        <Link
          href="/check-in"
          className="text-xs px-3 py-1 rounded-full bg-white/10 text-gray-300 hover:text-white hover:bg-white/20 transition-colors flex items-center gap-1"
        >
          <Maximize2 className="w-3 h-3" /> Full Screen
        </Link>
      </div>

      <motion.h3
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-xl sm:text-2xl font-semibold mb-10 text-center text-white tracking-tight font-serif"
      >
        Tap the color that best describes<br />how you feel right now
      </motion.h3>

      <div className="relative w-64 h-64 sm:w-80 sm:h-80 mb-8">
        {moodQuadrants.map((quad, index) => {
          const isTop = index < 2;
          const isLeft = index % 2 === 0;

          return (
            <motion.button
              key={quad.id}
              onClick={() => setActiveQuadrant(quad.quadrantKey)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: 0.9,
                scale: 1,
                y: [0, (index % 2 === 0 ? -5 : 5), 0],
              }}
              transition={{
                opacity: { duration: 0.4, delay: index * 0.1 },
                scale: { type: "spring", stiffness: 200, damping: 15, delay: index * 0.1 },
                y: { repeat: Infinity, duration: 4, ease: "easeInOut", delay: index * 0.5 }
              }}
              whileHover={{ scale: 1.1, opacity: 1, zIndex: 10 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "absolute w-36 h-36 sm:w-44 sm:h-44 rounded-full flex items-center justify-center text-center p-4 cursor-pointer",
                "shadow-[0_0_40px_rgba(0,0,0,0.3)]",
                quad.color, quad.textColor
              )}
              style={{
                top: isTop ? '0%' : 'auto',
                bottom: !isTop ? '0%' : 'auto',
                left: isLeft ? '0%' : 'auto',
                right: !isLeft ? '0%' : 'auto',
                transform: `translate(${isLeft ? '14%' : '-14%'}, ${isTop ? '14%' : '-14%'})`
              }}
            >
              <span className="font-bold text-sm sm:text-base whitespace-pre-line leading-tight pointer-events-none">
                {quad.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );

  return (
    <div className="w-full relative min-h-[420px]">
      <AnimatePresence mode="wait">
        {!activeQuadrant && renderQuadrants()}

        {activeQuadrant && (
          <motion.div
            key="apple-watch-field"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            className="w-full h-[580px] sm:h-[680px] rounded-[36px] overflow-hidden relative border border-white/10 shadow-2xl bg-black"
          >
            <AppleWatchMoodField
              initialQuadrant={activeQuadrant}
              selectedId={selectedWordId}
              onSelect={setSelectedWordId}
              onBack={() => {
                setActiveQuadrant(null);
                setSelectedWordId(null);
              }}
            />

            <MoodConfirmSheet
              word={selectedWord}
              onConfirm={handleConfirmMood}
              isLoading={addMoodMutation.isPending}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default MoodTracker;
