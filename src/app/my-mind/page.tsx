"use client";

import React from "react";
import Link from "next/link";
import { Brain, Bot, PenLine, Castle, ArrowUpRight, Sparkles } from "lucide-react";
import MoodTracker from "@/components/mood-tracker";
import { BackButton } from "@/components/ui/back-button";

export default function MyMindPage() {
  const mindFeatures = [
    {
      title: "AI Buddy",
      href: "/ai-buddy",
      icon: Bot,
      bg: "bg-[#EE5394]",
      textColor: "text-white",
      iconBg: "bg-white/20",
      description: "Talk to your empathetic AI companion",
    },
    {
      title: "Emotional Diary",
      href: "/diary",
      icon: PenLine,
      bg: "bg-[#E89326]",
      textColor: "text-white",
      iconBg: "bg-white/20",
      description: "Journal your thoughts and emotions",
    },
    {
      title: "Self-Assessment",
      href: "/assessment",
      icon: Brain,
      bg: "bg-[#9B89F3]",
      textColor: "text-white",
      iconBg: "bg-white/20",
      description: "Take clinically-backed wellness checks",
    },
    {
      title: "Inner Gatekeeper",
      href: "/inner-gatekeeper",
      icon: Castle,
      bg: "bg-[#64A3E9]",
      textColor: "text-white",
      iconBg: "bg-white/20",
      description: "Guard your mental castle",
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-6 sm:space-y-8 pb-20 animate-in fade-in duration-500">
      {/* Navigation */}
      <div>
        <BackButton to="/dashboard" />
      </div>

      {/* Hero Banner Section */}
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-violet-500/10 via-purple-500/10 to-indigo-500/10 border border-violet-500/15 p-6 sm:p-10 shadow-sm">
        {/* Glow decoration */}
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-violet-500/15 text-violet-700 dark:text-violet-300 border border-violet-500/20 backdrop-blur-sm">
            <Brain className="w-3.5 h-3.5" />
            <span>Your Inner World</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-gray-50 tracking-tight">
            My Mind
          </h1>

          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
            Your central sanctuary for self-reflection, AI guidance, mood exploration, and emotional resilience. Check in with yourself and nurture your mental well-being every day.
          </p>
        </div>
      </div>

      {/* Mood Tracker Section */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <h2 className="text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-200 tracking-wide">
              Daily Mood Check-In
            </h2>
          </div>
        </div>
        <div className="rounded-[28px] overflow-hidden bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 p-2 sm:p-4">
          <MoodTracker variant="inline" />
        </div>
      </section>

      {/* Feature Bento Grid */}
      <section className="space-y-3 sm:space-y-4">
        <div className="px-1">
          <h2 className="text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-200 tracking-wide">
            Explore Mind Tools
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {mindFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link
                key={feature.title}
                href={feature.href}
                className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded-[28px]"
              >
                <div
                  className={`relative ${feature.bg} ${feature.textColor} rounded-[28px] h-36 sm:h-44 p-5 flex flex-col justify-between overflow-hidden shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-[0.99]`}
                >
                  {/* Top Bar: Icon Container + Arrow */}
                  <div className="flex justify-between items-start z-10">
                    <div className={`w-12 h-12 rounded-xl ${feature.iconBg} backdrop-blur-sm flex items-center justify-center shadow-sm group-hover:scale-105 group-hover:-rotate-2 transition-transform duration-300`}>
                      <Icon className="w-6 h-6 text-current stroke-[2.2]" />
                    </div>

                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-colors">
                      <ArrowUpRight className="w-4 h-4 text-current" />
                    </div>
                  </div>

                  {/* Bottom Bar: Title + Description */}
                  <div className="z-10 mt-auto">
                    <h3 className="text-lg font-semibold leading-tight tracking-tight">
                      {feature.title}
                    </h3>
                    <p className="text-sm opacity-80 mt-1 line-clamp-1 sm:line-clamp-2">
                      {feature.description}
                    </p>
                  </div>

                  {/* Decorative background blob */}
                  <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
