"use client";

import { CreativeZone } from "@/components/creative-zone";
import { BackButton } from "@/components/ui/back-button";
import { Palette, Sparkles } from "lucide-react";

export default function CreativePage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 animate-in fade-in duration-500" data-testid="page-creative">
      <BackButton to="/dashboard" />
      
      {/* Premium Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-violet-500/10 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-violet-900/20 rounded-[36px] p-8 sm:p-12 border border-blue-200/50 dark:border-blue-800/40 shadow-sm">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-64 h-64 bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-48 h-48 bg-violet-400/20 dark:bg-violet-600/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200 text-xs font-bold shadow-sm">
            <Palette className="w-3.5 h-3.5" />
            <span className="uppercase tracking-wider">Art Therapy & Mindfulness</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-3">
            Creative Expression Canvas
          </h1>
          
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-xl">
            Explore therapeutic coloring, chakra balancing mandalas, and freeform canvas tools to soothe anxiety and stimulate imaginative focus.
          </p>
          
          <div className="flex items-center gap-6 pt-4 text-sm font-medium text-blue-700 dark:text-blue-400">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4" /> Calming Canvas
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Chakra Mandalas
            </div>
          </div>
        </div>
      </div>
      
      <CreativeZone />
    </div>
  );
}