"use client";

import React, { useState } from "react";
import { BackButton } from "@/components/ui/back-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import {
  Gamepad2,
  Brain,
  Target,
  Puzzle,
  Timer,
  Trophy,
  Play,
  Star,
  PawPrint,
  Sparkles,
  ShieldCheck,
  Wind,
  Compass,
  Heart,
  BookOpen,
  ArrowRight,
  Activity,
  CheckCircle2
} from "lucide-react";

type CategoryFilter = "all" | "resilience" | "mindfulness" | "focus";

export default function GamesPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all");

  const wellnessGames = [
    {
      id: "inner-gatekeeper",
      title: "Inner Gatekeeper",
      badge: "Cognitive Reappraisal",
      description: "A mature strategy practice based on CBT and ACT. Meet internal thought visitors (imposter doubts, perfectionism, comparison) and choose mindful responses.",
      icon: ShieldCheck,
      color: "text-indigo-600 dark:text-indigo-400",
      bgGradient: "from-indigo-500/10 via-purple-500/10 to-teal-500/10",
      accentBorder: "border-indigo-200 dark:border-indigo-800/40",
      difficulty: "Intermediate",
      time: "8-12 min",
      framework: "CBT & ACT",
      category: "resilience",
      route: "/inner-gatekeeper",
      featured: true,
      highlights: ["Imposter syndrome reframing", "Boundary setting practice", "Mindful clarity scores"]
    },
    {
      id: "petcare-companion",
      title: "Mindful Pet Companion Studio",
      badge: "Activity Companion",
      description: "Cultivate daily wellness habits alongside an empathetic companion. Engage in 4-4-4-4 box breathing, 5-4-3-2-1 somatic grounding, and focus sprints.",
      icon: PawPrint,
      color: "text-emerald-600 dark:text-emerald-400",
      bgGradient: "from-emerald-500/10 via-teal-500/10 to-sky-500/10",
      accentBorder: "border-emerald-200 dark:border-emerald-800/40",
      difficulty: "All Levels",
      time: "3-25 min",
      framework: "Somatic & Habit",
      category: "mindfulness",
      route: "/petcare-game",
      featured: true,
      highlights: ["Box breathing guide", "5-4-3-2-1 grounding", "Pomodoro study sprints"]
    },
    {
      id: "mindful-breathing",
      title: "Diaphragmatic Breath Journey",
      badge: "Vagal Regulation",
      description: "Guided visual pacing to activate the parasympathetic nervous system and down-regulate physiological anxiety.",
      icon: Wind,
      color: "text-sky-600 dark:text-sky-400",
      bgGradient: "from-sky-500/10 to-blue-500/10",
      accentBorder: "border-sky-200 dark:border-sky-800/40",
      difficulty: "Beginner",
      time: "3-5 min",
      framework: "Polyvagal Theory",
      category: "mindfulness",
      route: "/petcare-game"
    },
    {
      id: "focus-sprint",
      title: "Focus Sanctuary & Timer",
      badge: "Cognitive Momentum",
      description: "Structured deep work intervals designed to reduce task initiation friction and prevent academic burnout.",
      icon: Timer,
      color: "text-amber-600 dark:text-amber-400",
      bgGradient: "from-amber-500/10 to-orange-500/10",
      accentBorder: "border-amber-200 dark:border-amber-800/40",
      difficulty: "Customizable",
      time: "15-45 min",
      framework: "Pomodoro & Flow",
      category: "focus",
      route: "/petcare-game"
    },
    {
      id: "reflection-prompts",
      title: "Cognitive Reflection Journal",
      badge: "Self-Inquiry",
      description: "Targeted collegiate journal prompts to dismantle harsh self-criticism and externalize overwhelming thoughts.",
      icon: BookOpen,
      color: "text-purple-600 dark:text-purple-400",
      bgGradient: "from-purple-500/10 to-pink-500/10",
      accentBorder: "border-purple-200 dark:border-purple-800/40",
      difficulty: "Gentle",
      time: "5-10 min",
      framework: "Reflective Therapy",
      category: "resilience",
      route: "/petcare-game"
    },
    {
      id: "somatic-grounding",
      title: "5-4-3-2-1 Somatic Grounding",
      badge: "Sensory Re-anchoring",
      description: "A fast sensory protocol to interrupt acute stress spirals and re-center in the physical room.",
      icon: Compass,
      color: "text-teal-600 dark:text-teal-400",
      bgGradient: "from-teal-500/10 to-emerald-500/10",
      accentBorder: "border-teal-200 dark:border-teal-800/40",
      difficulty: "Immediate",
      time: "4-6 min",
      framework: "Somatic Grounding",
      category: "mindfulness",
      route: "/petcare-game"
    }
  ];

  const filteredGames = activeCategory === "all" 
    ? wellnessGames 
    : wellnessGames.filter((g) => g.category === activeCategory || g.featured);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-24 animate-in fade-in duration-400" data-testid="page-games">
      <BackButton to="/dashboard" />

      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3.5 bg-gradient-to-tr from-indigo-500 to-purple-600 text-white rounded-2xl shadow-lg">
            <Gamepad2 className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground">
              Wellness & Interactive Hub
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Evidence-based interactive activities designed to build emotional resilience, focus, and somatic calm.
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-muted/60 dark:bg-slate-800/60 p-1 rounded-2xl border border-border/80 self-start md:self-auto overflow-x-auto max-w-full">
          {[
            { id: "all", label: "All Practices" },
            { id: "resilience", label: "Resilience & CBT" },
            { id: "mindfulness", label: "Mindfulness & Body" },
            { id: "focus", label: "Focus & Flow" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as CategoryFilter)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                activeCategory === cat.id
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── FEATURED HERO ACTIVITIES ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Featured: Inner Gatekeeper */}
        <div className="bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-teal-500/10 rounded-3xl p-6 sm:p-8 border border-indigo-200 dark:border-indigo-800/50 shadow-xl backdrop-blur-xl relative overflow-hidden flex flex-col justify-between group">
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />

          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between">
              <Badge className="bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                Featured Practice
              </Badge>
              <span className="text-xs font-mono font-medium text-muted-foreground">
                8-12 mins · CBT / ACT
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground group-hover:text-indigo-600 transition-colors">
                  Inner Gatekeeper
                </h2>
                <p className="text-xs text-muted-foreground">
                  Cognitive Reappraisal & Mind Sanctuary
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Encounter realistic collegiate thought visitors (imposter syndrome, exam catastrophizing, peer comparison) and practice mindful reappraisal to protect mental balance.
            </p>

            <div className="space-y-1.5 pt-2">
              {[
                "Navigate real collegiate stress scenarios",
                "Immediate psychological insight & pattern recognition",
                "Measure Clarity, Compassion & Flexibility"
              ].map((point, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs font-medium text-foreground/90">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 relative z-10">
            <Button
              onClick={() => router.push("/inner-gatekeeper")}
              className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-600 hover:from-indigo-700 hover:to-teal-700 text-white font-bold py-5 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.01] flex items-center justify-center gap-2"
            >
              <span>Begin Gatekeeper Practice</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Featured: Pet Companion Studio */}
        <div className="bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-sky-500/10 rounded-3xl p-6 sm:p-8 border border-emerald-200 dark:border-emerald-800/50 shadow-xl backdrop-blur-xl relative overflow-hidden flex flex-col justify-between group">
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />

          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between">
              <Badge className="bg-emerald-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                Activity Studio
              </Badge>
              <span className="text-xs font-mono font-medium text-muted-foreground">
                3-25 mins · Somatic Habits
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
                <PawPrint className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground group-hover:text-emerald-600 transition-colors">
                  Mindful Pet Companion
                </h2>
                <p className="text-xs text-muted-foreground">
                  Activity-Based Daily Wellness Ally
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              A supportive wellness presence that grows alongside your healthy habits. Practice guided box breathing, somatic grounding, study sprints, and empathetic check-ins.
            </p>

            <div className="space-y-1.5 pt-2">
              {[
                "Guided Box Breathing with animated pacing",
                "5-4-3-2-1 Somatic Sensory Grounding tool",
                "Pomodoro Focus Sanctuary with quiet companion"
              ].map((point, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs font-medium text-foreground/90">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 relative z-10">
            <Button
              onClick={() => router.push("/petcare-game")}
              className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 hover:from-emerald-700 hover:to-sky-700 text-white font-bold py-5 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.01] flex items-center justify-center gap-2"
            >
              <span>Open Companion Studio</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* ── ALL WELLNESS MODULES GRID ── */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <Brain className="w-4 h-4 text-indigo-500" />
          Individual Wellness Modules
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredGames.map((game) => {
            const IconComp = game.icon;
            return (
              <Card
                key={game.id}
                className="group rounded-3xl border border-border hover:border-indigo-300 dark:hover:border-indigo-700 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between bg-card"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-11 h-11 rounded-2xl bg-muted/80 dark:bg-slate-800 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
                      <IconComp className={`w-5 h-5 ${game.color}`} />
                    </div>
                    <Badge variant="outline" className="text-[10px] font-semibold text-muted-foreground">
                      {game.time}
                    </Badge>
                  </div>

                  <div className="space-y-1 pt-2">
                    <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                      {game.badge}
                    </span>
                    <CardTitle className="text-lg font-bold text-foreground group-hover:text-indigo-600 transition-colors">
                      {game.title}
                    </CardTitle>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {game.description}
                  </p>

                  <div className="pt-2 border-t border-border flex items-center justify-between">
                    <span className="text-[11px] font-medium text-muted-foreground">
                      {game.framework}
                    </span>
                    <Button
                      size="sm"
                      onClick={() => router.push(game.route)}
                      className="rounded-xl text-xs font-bold bg-muted hover:bg-indigo-600 hover:text-white text-foreground transition-colors"
                    >
                      <span>Practice</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}