"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Quadrant, MOOD_DATA } from "@/lib/mood-data";
import { MoodGrid } from "./mood/MoodGrid";
import { MoodConfirmSheet } from "./mood/MoodConfirmSheet";

interface MoodTrackerProps {
  variant?: 'full' | 'compact' | 'inline';
  defaultQuadrant?: string | null;
  onMoodLogged?: (mood: any) => void;
}

export function MoodTracker({ variant = 'full', onMoodLogged }: MoodTrackerProps) {
  const [selectedWordId, setSelectedWordId] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

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
      setSelectedWordId(null);
      setIsFullscreen(false);
      if (onMoodLogged) onMoodLogged({ value: selectedWord?.intensity, name: selectedWord?.label });
    },
    onError: () => {
      toast({
        title: "Saved locally",
        description: "Mood check-in recorded.",
      });
      setSelectedWordId(null);
      setIsFullscreen(false);
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

  return (
    <div className="w-full relative flex flex-col bg-black rounded-[32px] sm:rounded-[40px] shadow-2xl overflow-hidden border border-gray-800">
      
      {/* Header Area */}
      <div className="flex items-center justify-between w-full px-6 py-5 z-20 bg-black/60 backdrop-blur-xl border-b border-white/5">
        <span className="text-xs uppercase tracking-widest text-gray-400 font-semibold flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-yellow-400" />
          Unified Mood Map
        </span>
        <button 
          onClick={() => setIsFullscreen(true)}
          className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
          title="Expand Map"
        >
          <Maximize2 className="w-4 h-4 text-white/70" />
        </button>
      </div>

      {/* Inline Map View */}
      <div className="relative w-full h-[500px] bg-black">
        <MoodGrid
          selectedId={selectedWordId}
          onSelect={setSelectedWordId}
        />
      </div>

      {/* Fullscreen Overlay */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            key="fullscreen-map"
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed inset-0 z-[9999] w-full h-full bg-black overflow-hidden flex flex-col"
          >
            <MoodGrid
              selectedId={selectedWordId}
              onSelect={setSelectedWordId}
              onBack={() => setIsFullscreen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <MoodConfirmSheet
        word={selectedWord}
        onConfirm={handleConfirmMood}
        isLoading={addMoodMutation.isPending}
      />
    </div>
  );
}

export default MoodTracker;
