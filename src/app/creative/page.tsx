"use client";

import { CreativeZone } from "@/components/creative-zone";
import { BackButton } from "@/components/ui/back-button";
import { Palette, Sparkles } from "lucide-react";

export default function CreativePage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 animate-in fade-in duration-500" data-testid="page-creative">
      <BackButton to="/dashboard" />
      
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-pink-500/10 rounded-[32px] p-6 sm:p-8 border border-blue-200/50 dark:border-blue-800/40">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200 text-xs font-bold">
            <Palette className="w-3.5 h-3.5" />
            <span>Art Therapy & Mindfulness</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground dark:text-gray-100">
            Creative Expression Canvas
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground dark:text-gray-300">
            Explore therapeutic coloring, chakra balancing mandalas, and freeform canvas tools to soothe anxiety and stimulate imaginative focus.
          </p>
        </div>
      </div>
      
      <CreativeZone />
    </div>
  );
}