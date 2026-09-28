"use client";

import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background px-4 text-center">
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-3xl bg-purple-500/10 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800/40 shadow-sm">
          <Sparkles className="w-10 h-10" />
        </div>
      </div>
      
      <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-3">
        Page Not Found
      </h1>
      
      <p className="text-muted-foreground max-w-md text-base leading-relaxed mb-8">
        The page you are looking for doesn't exist or has moved. Let's get you back to your wellness journey.
      </p>

      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-foreground text-background font-semibold text-sm hover:opacity-90 transition-all hover:scale-105 shadow-md"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Dashboard</span>
      </Link>
    </div>
  );
}
