"use client";

import { AudioSessions } from "@/components/audio-sessions";
import { BackButton } from "@/components/ui/back-button";
import { Headphones, Waves, Wind } from "lucide-react";

export default function AudioSessionsPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 animate-in fade-in zoom-in-95 duration-500" data-testid="page-audio-sessions">
      <div className="flex items-center">
        <BackButton to="/dashboard" />
      </div>
      
      {/* Premium Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-cyan-500/10 dark:from-emerald-900/20 dark:via-teal-900/20 dark:to-cyan-900/20 rounded-[36px] p-8 sm:p-12 border border-emerald-200/50 dark:border-emerald-800/40 shadow-sm">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-64 h-64 bg-emerald-400/20 dark:bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-48 h-48 bg-cyan-400/20 dark:bg-cyan-600/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 text-xs font-bold shadow-sm">
            <Headphones className="w-3.5 h-3.5" />
            <span className="uppercase tracking-wider">Audio Therapy</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-3">
            Soundscapes & Guided Audio
          </h1>
          
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-xl">
            Immerse yourself in deeply relaxing binaural beats, mindfulness meditations, and nature soundscapes to calm anxiety and restore your focus.
          </p>
          
          <div className="flex items-center gap-6 pt-4 text-sm font-medium text-emerald-700 dark:text-emerald-400">
            <div className="flex items-center gap-2">
              <Waves className="w-4 h-4" /> Binaural Frequencies
            </div>
            <div className="flex items-center gap-2">
              <Wind className="w-4 h-4" /> Breathwork Pacing
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4">
        <AudioSessions />
      </div>
    </div>
  );
}