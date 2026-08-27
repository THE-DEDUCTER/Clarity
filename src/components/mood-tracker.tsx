"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, MessageCircle, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export const moodQuadrants = [
  {
    id: "red",
    label: "High Energy\nUnpleasant",
    color: "bg-[#FF3B30]",
    textColor: "text-white",
    valueMapping: 1,
    emotions: [
      { name: "Angry", size: "w-28 h-28 sm:w-32 sm:h-32" },
      { name: "Anxious", size: "w-24 h-24 sm:w-28 sm:h-28" },
      { name: "Frustrated", size: "w-24 h-24 sm:w-28 sm:h-28" },
      { name: "Panicked", size: "w-20 h-20 sm:w-24 sm:h-24" },
      { name: "Stressed", size: "w-28 h-28 sm:w-32 sm:h-32" },
      { name: "Jittery", size: "w-24 h-24 sm:w-28 sm:h-28" },
      { name: "Annoyed", size: "w-20 h-20 sm:w-24 sm:h-24" },
      { name: "Overwhelmed", size: "w-32 h-32 sm:w-36 sm:h-36" },
      { name: "Nervous", size: "w-24 h-24 sm:w-28 sm:h-28" }
    ]
  },
  {
    id: "yellow",
    label: "High Energy\nPleasant",
    color: "bg-[#FFCC00]",
    textColor: "text-amber-950",
    valueMapping: 5,
    emotions: [
      { name: "Excited", size: "w-32 h-32 sm:w-36 sm:h-36" },
      { name: "Happy", size: "w-28 h-28 sm:w-32 sm:h-32" },
      { name: "Inspired", size: "w-24 h-24 sm:w-28 sm:h-28" },
      { name: "Energized", size: "w-28 h-28 sm:w-32 sm:h-32" },
      { name: "Joyful", size: "w-24 h-24 sm:w-28 sm:h-28" },
      { name: "Thrilled", size: "w-20 h-20 sm:w-24 sm:h-24" },
      { name: "Hopeful", size: "w-24 h-24 sm:w-28 sm:h-28" },
      { name: "Proud", size: "w-20 h-20 sm:w-24 sm:h-24" },
      { name: "Playful", size: "w-24 h-24 sm:w-28 sm:h-28" }
    ]
  },
  {
    id: "blue",
    label: "Low Energy\nUnpleasant",
    color: "bg-[#007AFF]",
    textColor: "text-white",
    valueMapping: 2,
    emotions: [
      { name: "Sad", size: "w-28 h-28 sm:w-32 sm:h-32" },
      { name: "Tired", size: "w-24 h-24 sm:w-28 sm:h-28" },
      { name: "Bored", size: "w-24 h-24 sm:w-28 sm:h-28" },
      { name: "Disappointed", size: "w-28 h-28 sm:w-32 sm:h-32" },
      { name: "Down", size: "w-32 h-32 sm:w-36 sm:h-36" },
      { name: "Meh", size: "w-24 h-24 sm:w-28 sm:h-28" },
      { name: "Fatigued", size: "w-24 h-24 sm:w-28 sm:h-28" },
      { name: "Lonely", size: "w-28 h-28 sm:w-32 sm:h-32" },
      { name: "Disheartened", size: "w-24 h-24 sm:w-28 sm:h-28" }
    ]
  },
  {
    id: "green",
    label: "Low Energy\nPleasant",
    color: "bg-[#34C759]",
    textColor: "text-white",
    valueMapping: 4,
    emotions: [
      { name: "Calm", size: "w-28 h-28 sm:w-32 sm:h-32" },
      { name: "Relaxed", size: "w-32 h-32 sm:w-36 sm:h-36" },
      { name: "Peaceful", size: "w-28 h-28 sm:w-32 sm:h-32" },
      { name: "Comfortable", size: "w-24 h-24 sm:w-28 sm:h-28" },
      { name: "Chill", size: "w-24 h-24 sm:w-28 sm:h-28" },
      { name: "Mellow", size: "w-20 h-20 sm:w-24 sm:h-24" },
      { name: "Balanced", size: "w-24 h-24 sm:w-28 sm:h-28" },
      { name: "Tranquil", size: "w-24 h-24 sm:w-28 sm:h-28" },
      { name: "At Ease", size: "w-28 h-28 sm:w-32 sm:h-32" }
    ]
  }
];

// Animation variants
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

const bubbleVariants = {
  hidden: { opacity: 0, scale: 0.5, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 400, damping: 15 }
  }
};

interface MoodTrackerProps {
  variant?: 'full' | 'compact' | 'inline';
  defaultQuadrant?: string | null;
  onMoodLogged?: (mood: any) => void;
}

export function MoodTracker({ variant = 'full', defaultQuadrant = null, onMoodLogged }: MoodTrackerProps) {
  const [activeQuadrant, setActiveQuadrant] = useState<string | null>(defaultQuadrant);
  const [selectedEmotion, setSelectedEmotion] = useState<{name: string, value: number, color: string, textColor: string} | null>(null);
  const [note, setNote] = useState("");
  
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
        description: "Your emotion has been saved.",
      });
      setActiveQuadrant(defaultQuadrant);
      setSelectedEmotion(null);
      setNote("");
      if (onMoodLogged) onMoodLogged({ value: selectedEmotion?.value, name: selectedEmotion?.name });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to log mood. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (!selectedEmotion) return;
    addMoodMutation.mutate({
      value: selectedEmotion.value,
      note: note,
      emotionName: selectedEmotion.name
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
      className="flex flex-col items-center w-full py-4 sm:py-8 bg-black dark:bg-black rounded-[40px] shadow-2xl px-4 overflow-hidden border border-gray-800"
    >
      <motion.h3 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-xl sm:text-2xl font-semibold mb-10 text-center text-white tracking-tight"
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
              onClick={() => setActiveQuadrant(quad.id)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: 0.9, 
                scale: 1,
                y: [0, (index % 2 === 0 ? -6 : 6), 0],
              }}
              transition={{
                opacity: { duration: 0.4, delay: index * 0.1 },
                scale: { type: "spring", stiffness: 200, damping: 15, delay: index * 0.1 },
                y: { repeat: Infinity, duration: 4, ease: "easeInOut", delay: index * 0.5 }
              }}
              whileHover={{ scale: 1.1, opacity: 1, zIndex: 10 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "absolute w-36 h-36 sm:w-44 sm:h-44 rounded-full flex items-center justify-center text-center p-4",
                "mix-blend-screen shadow-[0_0_40px_rgba(0,0,0,0.3)]",
                quad.color, quad.textColor
              )}
              style={{
                top: isTop ? '0%' : 'auto',
                bottom: !isTop ? '0%' : 'auto',
                left: isLeft ? '0%' : 'auto',
                right: !isLeft ? '0%' : 'auto',
                transform: `translate(${isLeft ? '15%' : '-15%'}, ${isTop ? '15%' : '-15%'})`
              }}
            >
              <span className="font-bold text-sm sm:text-base whitespace-pre-line leading-tight pointer-events-none">
                {quad.label}
              </span>
            </motion.button>
          )
        })}
      </div>
    </motion.div>
  );

  // 2. Detailed emotion bubble view
  const renderEmotions = () => {
    const quad = moodQuadrants.find(q => q.id === activeQuadrant);
    if (!quad) return null;

    return (
      <motion.div 
        key="emotions"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="flex flex-col w-full bg-black rounded-[40px] py-6 shadow-2xl border border-gray-800"
      >
        <div className="flex items-center mb-6 px-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setActiveQuadrant(null)}
            className="mr-2 hover:bg-white/10 text-white rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <motion.h3 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-lg font-semibold flex-1 text-center pr-10 text-white"
          >
            How are you feeling exactly?
          </motion.h3>
        </div>

        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 p-4 min-h-[300px] content-center">
          {quad.emotions.map((emotion, i) => (
            <motion.button
              key={emotion.name}
              variants={bubbleVariants}
              onClick={() => setSelectedEmotion({
                name: emotion.name,
                value: quad.valueMapping,
                color: quad.color,
                textColor: quad.textColor
              })}
              whileHover={{ scale: 1.15, zIndex: 10, filter: "brightness(1.1)" }}
              whileTap={{ scale: 0.9 }}
              animate={{
                y: [0, (i % 2 === 0 ? -5 : 5), 0]
              }}
              transition={{
                y: { repeat: Infinity, duration: 3 + (i % 2), ease: "easeInOut", delay: i * 0.1 }
              }}
              className={cn(
                "rounded-full flex items-center justify-center p-2 text-center shadow-lg relative",
                quad.color, quad.textColor, emotion.size
              )}
            >
              <span className="font-bold text-sm sm:text-base tracking-tight">{emotion.name}</span>
              {/* Subtle inner reflection for a 3D bubble effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-black/0 via-white/10 to-white/30 pointer-events-none" />
            </motion.button>
          ))}
        </div>
      </motion.div>
    );
  };

  // 3. Save note view
  const renderSave = () => {
    if (!selectedEmotion) return null;

    return (
      <motion.div 
        key="save"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="flex flex-col w-full py-4"
      >
        <div className="flex items-center mb-6 px-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setSelectedEmotion(null)}
            className="mr-2 rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h3 className="text-lg font-semibold flex-1">
            Log your feeling
          </h3>
        </div>

        <div className="p-6 sm:p-8 rounded-[36px] bg-white dark:bg-gray-800 border border-black/5 dark:border-white/10 shadow-xl relative overflow-hidden">
          {/* Subtle background glow of the selected emotion color */}
          <div className={cn("absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none", selectedEmotion.color)} />

          <div className="flex items-center gap-4 mb-6 relative z-10">
            <motion.div 
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className={cn(
                "w-20 h-20 rounded-full flex items-center justify-center shadow-lg relative",
                selectedEmotion.color, selectedEmotion.textColor
              )}
            >
              <span className="font-bold text-sm">{selectedEmotion.name}</span>
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-black/0 via-white/10 to-white/30 pointer-events-none" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-sm text-gray-500 dark:text-gray-400">You selected</p>
              <p className="text-2xl font-bold">{selectedEmotion.name}</p>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4 relative z-10"
          >
            <label className="text-sm font-semibold flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <MessageCircle className="w-4 h-4" />
              Add a note <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What made you feel this way?"
              className="w-full p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500/50 focus:border-transparent resize-none transition-all duration-200"
              rows={3}
            />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 flex gap-3 justify-end relative z-10"
          >
            <Button 
              variant="outline" 
              onClick={() => {
                setSelectedEmotion(null);
                setActiveQuadrant(null);
                setNote("");
              }}
              className="rounded-full px-6"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={addMoodMutation.isPending}
              className={cn("rounded-full px-8 shadow-lg hover:shadow-xl transition-all", selectedEmotion.color, selectedEmotion.textColor)}
            >
              {addMoodMutation.isPending ? "Saving..." : "Save Log"}
            </Button>
          </motion.div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="w-full relative min-h-[400px]">
      <AnimatePresence mode="wait">
        {!activeQuadrant && !selectedEmotion && renderQuadrants()}
        {activeQuadrant && !selectedEmotion && renderEmotions()}
        {selectedEmotion && renderSave()}
      </AnimatePresence>
    </div>
  );
}

export default MoodTracker;
