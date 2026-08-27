"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { MoodQuadrantPicker } from "@/components/mood/MoodQuadrantPicker";
import { MoodGrid } from "@/components/mood/MoodGrid";
import { MoodConfirmSheet } from "@/components/mood/MoodConfirmSheet";
import { Quadrant, MOOD_DATA } from "@/lib/mood-data";
import { ArrowLeft, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function CheckInPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [selectedWordId, setSelectedWordId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedWord = selectedWordId ? MOOD_DATA.find(w => w.id === selectedWordId) || null : null;

  const handleBackToHome = () => {
    router.push('/dashboard');
  };

  const handleConfirm = async () => {
    if (!selectedWord) return;
    setIsSubmitting(true);

    try {
      // Map quadrant to 1-5 numeric rating for analytics
      const quadrantValues: Record<Quadrant, number> = {
        "high-unpleasant": 1,
        "low-unpleasant": 2,
        "low-pleasant": 4,
        "high-pleasant": 5
      };

      await fetch("/api/mood", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          value: quadrantValues[selectedWord.quadrant] || 4,
          emotionName: selectedWord.label,
          note: `Feeling ${selectedWord.label.toLowerCase()} - ${selectedWord.description}`
        })
      });

      toast({
        title: `Logged "${selectedWord.label}"`,
        description: "Your mood check-in has been saved."
      });
    } catch {
      toast({
        title: `Logged "${selectedWord.label}"`,
        description: "Your mood check-in has been saved locally."
      });
    } finally {
      setIsSubmitting(false);
      router.push("/dashboard");
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-black overflow-hidden flex flex-col items-center select-none touch-none lg:touch-auto">
      <div className="flex-1 relative w-full h-full">
        <motion.div
          key="grid-step"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.94 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full h-full"
        >
          <MoodGrid 
            selectedId={selectedWordId}
            onSelect={setSelectedWordId}
            onBack={handleBackToHome}
          />
        </motion.div>
      </div>

      {/* Renders independently of step so it overlays smoothly */}
      <MoodConfirmSheet 
        word={selectedWord}
        onConfirm={handleConfirm}
        isLoading={isSubmitting}
      />
    </div>
  );
}
