"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { MoodQuadrantPicker } from "@/components/mood/MoodQuadrantPicker";
import { MoodGrid } from "@/components/mood/MoodGrid";
import { MoodConfirmSheet } from "@/components/mood/MoodConfirmSheet";
import { Quadrant, MOOD_DATA } from "@/lib/mood-data";
import { ArrowLeft, Search } from "lucide-react";

export default function CheckInPage() {
  const router = useRouter();
  const [step, setStep] = useState<'quadrant' | 'grid'>('quadrant');
  const [activeQuadrant, setActiveQuadrant] = useState<Quadrant | null>(null);
  const [selectedWordId, setSelectedWordId] = useState<string | null>(null);

  const selectedWord = selectedWordId ? MOOD_DATA.find(w => w.id === selectedWordId) || null : null;

  const handleSelectQuadrant = (quadrant: Quadrant) => {
    setActiveQuadrant(quadrant);
    setStep('grid');
  };

  const handleBackToQuadrants = () => {
    setStep('quadrant');
    setSelectedWordId(null);
  };

  const handleConfirm = () => {
    // Navigate away or log to backend
    if (selectedWord) {
      console.log("Logged mood:", selectedWord);
      router.push("/dashboard"); // Take them back to dashboard
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-black overflow-hidden flex flex-col items-center select-none touch-none lg:touch-auto">
      
      <AnimatePresence mode="wait">
        {step === 'quadrant' && (
          <motion.div
            key="quadrant-step"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, transition: { duration: 0.3 } }}
            className="w-full h-full flex flex-col relative"
          >
            {/* Header Chrome */}
            <div className="absolute top-0 inset-x-0 h-24 z-50 flex items-center justify-between px-6 pointer-events-none">
              <button 
                onClick={() => router.push('/dashboard')}
                className="w-10 h-10 rounded-full bg-[#1A1A1A] border border-white/10 flex items-center justify-center pointer-events-auto hover:bg-[#2A2A2A] transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              
              <button className="w-10 h-10 rounded-full bg-[#1A1A1A] border border-white/10 flex items-center justify-center pointer-events-auto hover:bg-[#2A2A2A] transition-colors">
                <Search className="w-5 h-5 text-white" />
              </button>
            </div>

            <MoodQuadrantPicker onSelect={handleSelectQuadrant} />
          </motion.div>
        )}

        {step === 'grid' && activeQuadrant && (
          <motion.div
            key="grid-step"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full"
          >
            <MoodGrid 
              initialQuadrant={activeQuadrant} 
              selectedId={selectedWordId}
              onSelect={setSelectedWordId}
              onBack={handleBackToQuadrants}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Renders independently of step so it overlays smoothly */}
      <MoodConfirmSheet 
        word={selectedWord}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
