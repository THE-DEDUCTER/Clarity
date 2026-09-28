"use client";

import { GoalTracker } from "@/components/goal-tracker";
import { BackButton } from "@/components/ui/back-button";
import { Target, TrendingUp, Sparkles } from "lucide-react";

export default function GoalsPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 animate-in fade-in zoom-in-95 duration-500" data-testid="page-goals">
      <div className="flex items-center">
        <BackButton to="/dashboard" />
      </div>
      
      {/* Premium Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-rose-500/10 dark:from-amber-900/20 dark:via-orange-900/20 dark:to-rose-900/20 rounded-[36px] p-8 sm:p-12 border border-amber-200/50 dark:border-amber-800/40 shadow-sm">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-64 h-64 bg-amber-400/20 dark:bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-48 h-48 bg-rose-400/20 dark:bg-rose-600/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 text-xs font-bold shadow-sm">
            <Target className="w-3.5 h-3.5" />
            <span className="uppercase tracking-wider">Goal Tracker</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-3">
            Track Progress & Milestones
          </h1>
          
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-xl">
            Break down your mental health journey into achievable micro-steps. Celebrate every victory, monitor your growth, and stay aligned with your long-term wellbeing.
          </p>
          
          <div className="flex items-center gap-6 pt-4 text-sm font-medium text-amber-700 dark:text-amber-400">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Daily Streaks
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Earn Rewards
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4">
        <GoalTracker />
      </div>
    </div>
  );
}