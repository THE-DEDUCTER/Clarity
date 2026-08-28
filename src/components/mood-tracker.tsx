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

export function MoodTracker({ variant = 'full', onMoodLogged }: MoodTrackerProps) {
  const [step, setStep] = useState<'quadrant' | 'grid'>('quadrant');
  const [activeQuadrant, setActiveQuadrant] = useState<Quadrant | null>(null);
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
      setStep('quadrant');
      setActiveQuadrant(null);
      setIsFullscreen(false);
    },
  });

  const handleSelectQuadrant = (quadrant: Quadrant) => {
    setActiveQuadrant(quadrant);
    setStep('grid');
  };

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
    <div 
      className="w-full relative flex flex-col overflow-hidden"
      style={{
        WebkitMaskImage: 'radial-gradient(50% 50% at 50% 50%, black 60%, transparent 100%)',
        maskImage: 'radial-gradient(50% 50% at 50% 50%, black 60%, transparent 100%)'
      }}
    >
      
      {/* Header Area */}
      <div className="flex items-center justify-between w-full px-6 py-5 z-20">
        <span className="text-xs uppercase tracking-widest text-muted-foreground dark:text-gray-400 font-semibold flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-yellow-500 dark:text-yellow-400" />
          Interactive Mood Meter
        </span>
        {step === 'grid' && (
          <div className="flex items-center gap-2">
            <button 
              onClick={() => { setStep('quadrant'); setActiveQuadrant(null); }}
              className="text-xs font-semibold text-muted-foreground dark:text-white/50 hover:text-foreground dark:hover:text-white px-3 py-1.5 rounded-full bg-muted dark:bg-white/5"
            >
              Back to Menu
            </button>
            <button 
              onClick={() => setIsFullscreen(true)}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-muted dark:bg-white/5 hover:bg-secondary dark:hover:bg-white/10 transition-colors"
              title="Expand Map"
            >
              <Maximize2 className="w-4 h-4 text-muted-foreground dark:text-white/70" />
            </button>
          </div>
        )}
      </div>

      {/* Main View Area */}
      <div className="relative w-full h-[450px] sm:h-[550px] lg:h-[600px]">
        <AnimatePresence mode="wait">
          {step === 'quadrant' && (
            <motion.div
              key="menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center py-8"
            >
              <MoodQuadrantPicker onSelect={handleSelectQuadrant} />
            </motion.div>
          )}

          {step === 'grid' && activeQuadrant && (
            <motion.div
              key="map"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 w-full h-full"
            >
              <MoodGrid
                initialQuadrant={activeQuadrant}
                selectedId={selectedWordId}
                onSelect={setSelectedWordId}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Fullscreen Overlay */}
      <AnimatePresence>
        {isFullscreen && activeQuadrant && (
          <motion.div
            key="fullscreen-map"
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed inset-0 z-[9999] w-full h-full bg-black overflow-hidden flex flex-col"
          >
            <MoodGrid
              initialQuadrant={activeQuadrant}
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
