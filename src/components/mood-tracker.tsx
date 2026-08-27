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
import { MoodQuadrantPicker } from "./mood/MoodQuadrantPicker";

interface MoodTrackerProps {
  variant?: 'full' | 'compact' | 'inline';
  defaultQuadrant?: string | null;
  onMoodLogged?: (mood: any) => void;
}

export function MoodTracker({ variant = 'full', defaultQuadrant = null, onMoodLogged }: MoodTrackerProps) {
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

  return (
    <div className="w-full relative min-h-[420px] rounded-[32px] sm:rounded-[40px] overflow-hidden">
      <AnimatePresence mode="wait">
        {!activeQuadrant && (
          <motion.div
            key="quadrant-picker"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="w-full h-[500px] relative rounded-[32px] sm:rounded-[40px] overflow-hidden"
          >
             <MoodQuadrantPicker onSelect={setActiveQuadrant} />
          </motion.div>
        )}

        {activeQuadrant && (
          <motion.div
            key="mood-grid-field"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed inset-0 z-[9999] w-full h-full overflow-hidden bg-black"
          >
            <MoodGrid
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
