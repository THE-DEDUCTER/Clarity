"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { VirtualPets } from "@/components/3d/virtual-pets";
import {
  Heart,
  Wind,
  Brain,
  Timer,
  BookOpen,
  Sparkles,
  Trophy,
  Activity,
  Smile,
  MessageSquare,
  Send,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Compass,
  Zap,
  Moon,
  Sun,
  ShieldCheck,
  ChevronRight,
  Flame,
  ArrowRight,
  Sparkle
} from "lucide-react";
import { BackButton } from "@/components/ui/back-button";

interface CompanionStats {
  mindfulness: number; // 0-100
  energy: number; // 0-100
  clarity: number; // 0-100
  calm: number; // 0-100
  bondPoints: number;
  streakDays: number;
  lastActiveDate: string;
}

type ActivityType = "breathe" | "grounding" | "focus" | "journal" | "stretch";

interface JournalEntry {
  id: string;
  date: string;
  prompt: string;
  content: string;
  companionReflection: string;
}

export const PetCareDashboard: React.FC = () => {
  const [viewMode, setViewMode] = useState<"sanctuary" | "3d">("sanctuary");
  const [companionName, setCompanionName] = useState("Buddy");
  const [companionType, setCompanionType] = useState<"dog" | "cat">("dog");
  const [isCompanionHovered, setIsCompanionHovered] = useState(false);
  
  const [stats, setStats] = useState<CompanionStats>({
    mindfulness: 75,
    energy: 80,
    clarity: 70,
    calm: 85,
    bondPoints: 140,
    streakDays: 4,
    lastActiveDate: new Date().toISOString().split("T")[0]
  });

  // Active Activity Modal / Flow
  const [activeActivity, setActiveActivity] = useState<ActivityType | null>(null);
  
  // Breathing activity state
  const [breathPhase, setBreathPhase] = useState<"Inhale" | "Hold" | "Exhale" | "Pause">("Inhale");
  const [breathSeconds, setBreathSeconds] = useState(4);
  const [breathCyclesRemaining, setBreathCyclesRemaining] = useState(4);
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const breathTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Grounding 5-4-3-2-1 state
  const [groundingStep, setGroundingStep] = useState(0);
  const [groundingInputs, setGroundingInputs] = useState<string[]>(["", "", "", "", ""]);

  // Focus Timer state
  const [focusDurationMinutes, setFocusDurationMinutes] = useState(25);
  const [focusSecondsLeft, setFocusSecondsLeft] = useState(25 * 60);
  const [isFocusRunning, setIsFocusRunning] = useState(false);
  const [focusGoal, setFocusGoal] = useState("");
  const focusTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Journaling state
  const [selectedPromptIndex, setSelectedPromptIndex] = useState(0);
  const [journalContent, setJournalContent] = useState("");
  const [recentEntries, setRecentEntries] = useState<JournalEntry[]>([]);

  // Companion Chat state
  const [chatMessages, setChatMessages] = useState<Array<{ id: string; sender: "user" | "companion"; message: string; timestamp: Date }>>([
    {
      id: "1",
      sender: "companion",
      message: "Hello! I am here as your mindful companion. Whenever you feel stressed, overwhelmed, or need a grounding break, we can practice together.",
      timestamp: new Date()
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState("");

  const journalPrompts = [
    "What is one expectation or pressure you can grant yourself permission to release today?",
    "Name a small, quiet moment of beauty or calm you noticed in the past 24 hours.",
    "How is your body feeling right now, and what kind of support does it need most?",
    "What is one thing you accomplished recently that you haven't given yourself enough credit for?",
    "If a close friend were feeling the stress you feel today, what gentle words would you tell them?"
  ];

  // Bond Milestones
  const bondMilestones = [
    { level: 1, title: "New Companion", min: 0, max: 60, desc: "Beginning your mindfulness journey" },
    { level: 2, title: "Growing Harmony", min: 60, max: 120, desc: "Building positive daily routines" },
    { level: 3, title: "Mindful Ally", min: 120, max: 200, desc: "Consistent partner in daily wellness" },
    { level: 4, title: "Steady Anchor", min: 200, max: 300, desc: "Trusted emotional confidant & guide" },
    { level: 5, title: "Deep Resonance", min: 300, max: 500, desc: "Soulful, unwavering grounding presence" },
  ];

  const getBondTier = (points: number) => {
    if (points >= 300) return { level: 5, title: "Deep Resonance", desc: "Soulful, unwavering grounding anchor", color: "text-purple-600 dark:text-purple-400", badgeBg: "bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800" };
    if (points >= 200) return { level: 4, title: "Steady Anchor", desc: "Trusted emotional confidant & guide", color: "text-indigo-600 dark:text-indigo-400", badgeBg: "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800" };
    if (points >= 120) return { level: 3, title: "Mindful Ally", desc: "Consistent partner in daily wellness", color: "text-emerald-600 dark:text-emerald-400", badgeBg: "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800" };
    if (points >= 60) return { level: 2, title: "Growing Harmony", desc: "Building positive daily routines", color: "text-sky-600 dark:text-sky-400", badgeBg: "bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800" };
    return { level: 1, title: "New Companion", desc: "Beginning your mindfulness journey", color: "text-amber-600 dark:text-amber-400", badgeBg: "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800" };
  };

  const bondTier = getBondTier(stats.bondPoints);

  // ── BREATHING ACTIVITY LOGIC ──
  const startBreathing = () => {
    setIsBreathingActive(true);
    setBreathCyclesRemaining(4);
    setBreathPhase("Inhale");
    setBreathSeconds(4);
  };

  useEffect(() => {
    if (!isBreathingActive) return;

    breathTimerRef.current = setInterval(() => {
      setBreathSeconds((prev) => {
        if (prev > 1) return prev - 1;

        // Phase transitions (Box Breathing: 4 Inhale, 4 Hold, 4 Exhale, 4 Pause)
        setBreathPhase((currentPhase) => {
          if (currentPhase === "Inhale") return "Hold";
          if (currentPhase === "Hold") return "Exhale";
          if (currentPhase === "Exhale") return "Pause";
          
          // Cycle completed
          setBreathCyclesRemaining((c) => {
            if (c <= 1) {
              completeBreathing();
              return 0;
            }
            return c - 1;
          });
          return "Inhale";
        });

        return 4;
      });
    }, 1000);

    return () => {
      if (breathTimerRef.current) clearInterval(breathTimerRef.current);
    };
  }, [isBreathingActive]);

  const completeBreathing = () => {
    setIsBreathingActive(false);
    if (breathTimerRef.current) clearInterval(breathTimerRef.current);

    setStats((prev) => ({
      ...prev,
      mindfulness: Math.min(100, prev.mindfulness + 20),
      calm: Math.min(100, prev.calm + 25),
      bondPoints: prev.bondPoints + 15
    }));

    addCompanionMessage(
      "Wonderful breathing session! Box breathing down-regulates the sympathetic nervous system and activates the vagus nerve to restore inner calm."
    );
  };

  // ── 5-4-3-2-1 GROUNDING LOGIC ──
  const groundingPrompts = [
    { count: 5, label: "5 Things You Can See", placeholder: "Look around you (e.g. sunlit window, green plant, bookshelf, lamp...)" },
    { count: 4, label: "4 Things You Can Physically Feel", placeholder: "Notice bodily sensations (e.g. feet on the floor, texture of sweater, cool air...)" },
    { count: 3, label: "3 Things You Can Hear", placeholder: "Listen carefully (e.g. ambient hum, distant traffic, quiet breath...)" },
    { count: 2, label: "2 Things You Can Smell or Fresh Air", placeholder: "Notice aromas (e.g. coffee, fresh rain, calming candle, clean breeze...)" },
    { count: 1, label: "1 Kind Truth About Yourself", placeholder: "Affirm yourself (e.g. 'I am doing my best and that is enough')..." }
  ];

  const handleNextGroundingStep = () => {
    if (groundingStep < groundingPrompts.length - 1) {
      setGroundingStep((prev) => prev + 1);
    } else {
      // Complete Grounding
      setStats((prev) => ({
        ...prev,
        clarity: Math.min(100, prev.clarity + 25),
        calm: Math.min(100, prev.calm + 20),
        bondPoints: prev.bondPoints + 18
      }));
      setActiveActivity(null);
      setGroundingStep(0);
      addCompanionMessage(
        "You completed the 5-4-3-2-1 Somatic Grounding practice! By anchoring all five senses in the present moment, you've interrupted anxious thought loops."
      );
    }
  };

  // ── FOCUS TIMER LOGIC ──
  useEffect(() => {
    if (!isFocusRunning) return;

    focusTimerRef.current = setInterval(() => {
      setFocusSecondsLeft((prev) => {
        if (prev <= 1) {
          completeFocusSprint();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (focusTimerRef.current) clearInterval(focusTimerRef.current);
    };
  }, [isFocusRunning]);

  const completeFocusSprint = () => {
    setIsFocusRunning(false);
    if (focusTimerRef.current) clearInterval(focusTimerRef.current);

    setStats((prev) => ({
      ...prev,
      clarity: Math.min(100, prev.clarity + 25),
      energy: Math.min(100, prev.energy + 15),
      bondPoints: prev.bondPoints + 20
    }));

    addCompanionMessage(
      `Great focus session on "${focusGoal || "your study sprint"}"! Regular structured sprints with mindful breaks dramatically improve cognitive retention and prevent fatigue.`
    );
  };

  // ── JOURNALING SAVE LOGIC ──
  const handleSaveJournal = () => {
    if (!journalContent.trim()) return;

    const reflections = [
      "Thank you for honoring your internal world by writing this down. Self-reflection builds profound emotional clarity.",
      "Acknowledging your feelings without judgment is a hallmark of emotional resilience. You are doing important inner work.",
      "Writing externalizes heavy thoughts, creating healthy cognitive distance so you can see solutions with greater peace."
    ];
    const compReflection = reflections[Math.floor(Math.random() * reflections.length)];

    const entry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
      prompt: journalPrompts[selectedPromptIndex],
      content: journalContent,
      companionReflection: compReflection
    };

    setRecentEntries((prev) => [entry, ...prev]);
    setJournalContent("");
    setStats((prev) => ({
      ...prev,
      mindfulness: Math.min(100, prev.mindfulness + 20),
      clarity: Math.min(100, prev.clarity + 15),
      bondPoints: prev.bondPoints + 15
    }));
    setActiveActivity(null);

    addCompanionMessage(compReflection);
  };

  // ── DESK STRETCH COMPLETE ──
  const handleCompleteStretch = () => {
    setStats((prev) => ({
      ...prev,
      energy: Math.min(100, prev.energy + 25),
      calm: Math.min(100, prev.calm + 15),
      bondPoints: prev.bondPoints + 12
    }));
    setActiveActivity(null);
    addCompanionMessage("Physical release invites mental ease. Taking regular physical breaks resets your posture and re-oxygenates your brain!");
  };

  const addCompanionMessage = (text: string) => {
    setChatMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: "companion",
        message: text,
        timestamp: new Date()
      }
    ]);
  };

  // ── CHAT HANDLING ──
  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;

    const userText = currentMessage;
    const userMsg = {
      id: Date.now().toString(),
      sender: "user" as const,
      message: userText,
      timestamp: new Date()
    };
    setChatMessages((prev) => [...prev, userMsg]);
    setCurrentMessage("");

    setTimeout(() => {
      const lower = userText.toLowerCase();
      let reply = "I am right here with you. Take a soft breath and let your shoulders drop. What would feel most supportive right now: a breathing break, focus sprint, or just talking it out?";

      if (lower.includes("exam") || lower.includes("test") || lower.includes("grade") || lower.includes("deadline")) {
        reply = "Academic stress can feel overwhelming, but remember: you are more than any single test or assignment. Let's break your tasks into small, bite-sized steps.";
      } else if (lower.includes("anxious") || lower.includes("panic") || lower.includes("overwhelmed") || lower.includes("stress")) {
        reply = "I hear how heavy things feel right now. Let's do the 5-4-3-2-1 grounding exercise together to help bring your nervous system back to safety.";
      } else if (lower.includes("tired") || lower.includes("exhausted") || lower.includes("sleep") || lower.includes("burnout")) {
        reply = "Rest is not a reward you earn after burning out—it is an essential requirement. Can you give yourself permission to step away for 15 quiet minutes?";
      } else if (lower.includes("lonely") || lower.includes("sad") || lower.includes("alone")) {
        reply = "You are never truly alone. Feeling disconnected is a very human experience, especially in college. Be extra gentle with yourself today.";
      }

      addCompanionMessage(reply);
    }, 800);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-400 pb-20">
      <BackButton to="/games" />

      {/* ── 1. LARGE COMPANION HERO SANCTUARY ── */}
      <div className="relative rounded-[36px] border border-border/80 bg-gradient-to-b from-card via-card/80 to-card/95 shadow-2xl backdrop-blur-2xl p-6 sm:p-10 overflow-hidden">
        {/* Rich atmospheric background lights */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gradient-to-br from-indigo-500/15 to-teal-500/15 blur-3xl pointer-events-none animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-gradient-to-tr from-purple-500/10 to-rose-500/10 blur-3xl pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-teal-500/5 to-indigo-500/5 blur-3xl pointer-events-none" />

        {/* Top Bar: View Mode Switcher + Sound Indicator */}
        <div className="relative z-20 flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-border/60">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Mindful Companion Sanctuary
            </span>
          </div>

          {/* Polished Segmented View Toggle */}
          <div className="flex items-center gap-1.5 bg-muted/70 dark:bg-slate-800/70 p-1.5 rounded-2xl border border-border/80 shadow-sm">
            <button
              onClick={() => setViewMode("sanctuary")}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-1.5 ${
                viewMode === "sanctuary"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Activity Sanctuary</span>
            </button>
            <button
              onClick={() => setViewMode("3d")}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-1.5 ${
                viewMode === "3d"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>3D Studio Arena</span>
            </button>
          </div>
        </div>

        {/* Main Companion Hero Content (Side-by-side on desktop, stacked on mobile) */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-6 sm:pt-8">
          {/* Left Column: Interactive Companion Hero Avatar & Aura */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center text-center space-y-4">
            <div
              onMouseEnter={() => setIsCompanionHovered(true)}
              onMouseLeave={() => setIsCompanionHovered(false)}
              className="relative w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center cursor-pointer transition-transform duration-500 hover:scale-105"
            >
              {/* Multi-layered Breathing Aura Rings */}
              <div className="absolute -inset-5 rounded-full border border-indigo-400/10 dark:border-indigo-500/10 animate-ping opacity-20 pointer-events-none" style={{ animationDuration: "5s" }} />
              <div className="absolute inset-0 rounded-full border border-indigo-400/20 dark:border-indigo-500/20 animate-ping opacity-30 pointer-events-none" style={{ animationDuration: "4s" }} />
              <div className="absolute -inset-3 rounded-full border border-purple-400/25 dark:border-purple-500/25 animate-pulse pointer-events-none" />

              {/* Soft ambient glow behind orb */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500/20 via-purple-500/15 to-teal-400/20 blur-xl pointer-events-none animate-pulse" style={{ animationDuration: '3s' }} />

              {/* Core Companion Orb Container — animated gradient border */}
              <div className="w-full h-full rounded-full p-[3px] shadow-2xl flex items-center justify-center" style={{ background: 'conic-gradient(from 0deg, #6366f1, #a855f7, #14b8a6, #6366f1)' }}>
                <div className="w-full h-full rounded-full bg-gradient-to-b from-card via-card/90 to-card flex flex-col items-center justify-center relative overflow-hidden">
                  {/* Inner ambient shimmer */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-transparent rounded-full pointer-events-none" />

                  <div className="text-6xl sm:text-7xl drop-shadow-lg select-none transform transition-transform duration-300 hover:scale-110 relative z-10">
                    {companionType === "dog" ? "🐕" : "🐈"}
                  </div>

                  {/* Gentle Floating status indicator */}
                  <div className="absolute bottom-3 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-semibold text-white/90 border border-white/10 shadow-lg z-10">
                    {isCompanionHovered ? "✨ Attentive & Present" : "🫧 Gentle Breathing"}
                  </div>
                </div>
              </div>
            </div>

            {/* Companion Name & Toggle */}
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-2">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  {companionName}
                </h2>
                <button
                  onClick={() => setCompanionType((t) => (t === "dog" ? "cat" : "dog"))}
                  className="text-xs text-muted-foreground hover:text-indigo-600 bg-muted px-2 py-0.5 rounded-full transition-colors"
                  title="Switch Companion"
                >
                  {companionType === "dog" ? "Switch to Cat 🐈" : "Switch to Dog 🐕"}
                </button>
              </div>

              <div className="flex items-center justify-center gap-2">
                <Badge variant="outline" className={`text-xs font-semibold ${bondTier.badgeBg}`}>
                  Level {bondTier.level} · {bondTier.title}
                </Badge>
                <span className="text-xs text-muted-foreground font-mono">
                  {stats.streakDays}-Day Streak 🔥
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: "Today's Companion Moment" & Primary Trigger */}
          <div className="lg:col-span-7 space-y-5">
            <div className="bg-gradient-to-br from-indigo-50/70 via-purple-50/50 to-teal-50/50 dark:from-indigo-950/40 dark:via-purple-950/30 dark:to-teal-950/30 rounded-3xl p-6 sm:p-7 border border-indigo-200/80 dark:border-indigo-800/60 shadow-md space-y-3">
              <div className="flex items-center gap-2">
                <Sparkle className="w-4 h-4 text-indigo-500 fill-indigo-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
                  Today's Companion Moment
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-foreground leading-snug">
                "Take 3 minutes to slow your breath before opening your next study assignment."
              </h3>

              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {companionName} is ready to guide you through diaphragmatic Box Breathing to down-regulate tension and reset your focus.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Button
                  onClick={() => setActiveActivity("breathe")}
                  className="bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-600 hover:from-indigo-700 hover:to-teal-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 text-sm"
                >
                  <Play className="w-4 h-4" />
                  <span>Begin 3-Min Box Breathing</span>
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setActiveActivity("grounding")}
                  className="rounded-xl text-xs font-semibold"
                >
                  <Compass className="w-3.5 h-3.5 mr-1 text-emerald-500" />
                  5-4-3-2-1 Grounding
                </Button>
              </div>
            </div>

            {/* Dimension Metrics Grid — enhanced with color accents */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="relative bg-background/80 dark:bg-slate-900/60 rounded-2xl p-3 border border-sky-200/40 dark:border-sky-800/30 text-center shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
                <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-transparent pointer-events-none" />
                <div className="relative flex items-center justify-center gap-1 text-sky-600 dark:text-sky-400 mb-0.5">
                  <Wind className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Mindfulness</span>
                </div>
                <div className="relative text-base font-extrabold text-foreground">{stats.mindfulness}%</div>
                <Progress value={stats.mindfulness} className="h-1.5 mt-1 relative" />
              </div>

              <div className="relative bg-background/80 dark:bg-slate-900/60 rounded-2xl p-3 border border-amber-200/40 dark:border-amber-800/30 text-center shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none" />
                <div className="relative flex items-center justify-center gap-1 text-amber-600 dark:text-amber-400 mb-0.5">
                  <Zap className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Energy</span>
                </div>
                <div className="relative text-base font-extrabold text-foreground">{stats.energy}%</div>
                <Progress value={stats.energy} className="h-1.5 mt-1 relative" />
              </div>

              <div className="relative bg-background/80 dark:bg-slate-900/60 rounded-2xl p-3 border border-emerald-200/40 dark:border-emerald-800/30 text-center shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />
                <div className="relative flex items-center justify-center gap-1 text-emerald-600 dark:text-emerald-400 mb-0.5">
                  <Compass className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Clarity</span>
                </div>
                <div className="relative text-base font-extrabold text-foreground">{stats.clarity}%</div>
                <Progress value={stats.clarity} className="h-1.5 mt-1 relative" />
              </div>

              <div className="relative bg-background/80 dark:bg-slate-900/60 rounded-2xl p-3 border border-purple-200/40 dark:border-purple-800/30 text-center shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent pointer-events-none" />
                <div className="relative flex items-center justify-center gap-1 text-purple-600 dark:text-purple-400 mb-0.5">
                  <Heart className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Inner Calm</span>
                </div>
                <div className="relative text-base font-extrabold text-foreground">{stats.calm}%</div>
                <Progress value={stats.calm} className="h-1.5 mt-1 relative" />
              </div>
            </div>
          </div>
        </div>

        {/* Bond Milestone Stepper Line */}
        <div className="mt-8 pt-6 border-t border-border/60">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-3 font-semibold">
            <span>Milestone Growth: {bondTier.title} ({stats.bondPoints} Bond XP)</span>
            <span>Next Tier: Level {Math.min(5, bondTier.level + 1)}</span>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {bondMilestones.map((m) => {
              const isPassed = stats.bondPoints >= m.min;
              const isCurrent = stats.bondPoints >= m.min && stats.bondPoints < m.max;
              return (
                <div key={m.level} className="space-y-1">
                  <div className={`h-2 rounded-full transition-all duration-500 ${
                    isCurrent
                      ? "bg-indigo-600 dark:bg-indigo-400 shadow-md"
                      : isPassed
                      ? "bg-emerald-500/80"
                      : "bg-muted"
                  }`} />
                  <p className="text-[10px] font-semibold text-muted-foreground truncate text-center hidden sm:block">
                    {m.title}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── 3D STUDIO ARENA VIEW IF SELECTED ── */}
      {viewMode === "3d" && (
        <div className="animate-in fade-in duration-300">
          <VirtualPets />
        </div>
      )}

      {/* ── 2. ACTIVITY SANCTUARY: LAYERED CATEGORIES & HIERARCHY ── */}
      {viewMode === "sanctuary" && (
        <div className="space-y-8">
          {/* Active Activity Modal Workspace */}
          {activeActivity === "breathe" && (
            <Card className="border-2 border-indigo-300 dark:border-indigo-800 shadow-2xl bg-card/95 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-300">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-foreground">
                  <Wind className="w-5 h-5 text-indigo-500" />
                  Box Breathing Meditation (4-4-4-4)
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => { setIsBreathingActive(false); setActiveActivity(null); }}>
                  ✕
                </Button>
              </CardHeader>
              <CardContent className="space-y-6 py-6 text-center">
                {/* Expanding circle animation */}
                <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
                  <div
                    className={`absolute inset-0 rounded-full border-4 border-indigo-400/40 transition-all duration-1000 ${
                      breathPhase === "Inhale"
                        ? "scale-110 bg-indigo-500/20"
                        : breathPhase === "Hold"
                        ? "scale-110 bg-purple-500/20"
                        : breathPhase === "Exhale"
                        ? "scale-75 bg-teal-500/20"
                        : "scale-75 bg-indigo-500/10"
                    }`}
                  />
                  <div className="relative z-10 space-y-1">
                    <p className="text-xl font-bold text-foreground tracking-wide uppercase">
                      {isBreathingActive ? breathPhase : "Ready"}
                    </p>
                    <p className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">
                      {isBreathingActive ? `${breathSeconds}s` : "4 Cycles"}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  {isBreathingActive
                    ? `Cycle ${5 - breathCyclesRemaining} of 4: Deep belly breathing restores vagal balance.`
                    : "Follow the rhythmic breathing circle to immediately lower cortisol and ease tension."}
                </p>

                <div className="flex justify-center gap-3">
                  {!isBreathingActive ? (
                    <Button onClick={startBreathing} className="bg-gradient-to-r from-indigo-600 to-teal-600 text-white font-bold px-8 py-2.5 rounded-xl shadow-lg">
                      <Play className="w-4 h-4 mr-2" /> Start Breathing
                    </Button>
                  ) : (
                    <Button variant="outline" onClick={() => setIsBreathingActive(false)} className="rounded-xl">
                      <Pause className="w-4 h-4 mr-2" /> Pause
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {activeActivity === "grounding" && (
            <Card className="border-2 border-emerald-300 dark:border-emerald-800 shadow-2xl bg-card/95 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-300">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-foreground">
                  <Compass className="w-5 h-5 text-emerald-500" />
                  5-4-3-2-1 Somatic Sensory Grounding
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setActiveActivity(null)}>
                  ✕
                </Button>
              </CardHeader>
              <CardContent className="space-y-6 py-4">
                <div className="flex justify-between items-center text-xs font-semibold text-muted-foreground">
                  <span>Step {groundingStep + 1} of 5</span>
                  <span className="text-emerald-600 dark:text-emerald-400">
                    {groundingPrompts[groundingStep].label}
                  </span>
                </div>
                <Progress value={((groundingStep + 1) / 5) * 100} className="h-2" />

                <div className="space-y-3 bg-muted/40 dark:bg-slate-800/40 rounded-2xl p-5 border border-border">
                  <h3 className="text-base font-bold text-foreground">
                    {groundingPrompts[groundingStep].label}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {groundingPrompts[groundingStep].placeholder}
                  </p>
                  <Input
                    value={groundingInputs[groundingStep]}
                    onChange={(e) => {
                      const updated = [...groundingInputs];
                      updated[groundingStep] = e.target.value;
                      setGroundingInputs(updated);
                    }}
                    placeholder="Type what you observe or notice around you..."
                    className="bg-background"
                  />
                </div>

                <div className="flex justify-between items-center pt-2">
                  <Button
                    variant="outline"
                    disabled={groundingStep === 0}
                    onClick={() => setGroundingStep((s) => Math.max(0, s - 1))}
                    className="rounded-xl text-xs"
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={handleNextGroundingStep}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs px-6"
                  >
                    {groundingStep === 4 ? "Complete Grounding" : "Next Sense"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeActivity === "focus" && (
            <Card className="border-2 border-amber-300 dark:border-amber-800 shadow-2xl bg-card/95 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-300">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-foreground">
                  <Timer className="w-5 h-5 text-amber-500" />
                  Study Sprint & Focus Sanctuary
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => { setIsFocusRunning(false); setActiveActivity(null); }}>
                  ✕
                </Button>
              </CardHeader>
              <CardContent className="space-y-6 py-4 text-center">
                <div className="text-5xl font-extrabold font-mono text-foreground tracking-wider">
                  {Math.floor(focusSecondsLeft / 60).toString().padStart(2, "0")}:
                  {(focusSecondsLeft % 60).toString().padStart(2, "0")}
                </div>

                <div className="max-w-sm mx-auto">
                  <Input
                    value={focusGoal}
                    onChange={(e) => setFocusGoal(e.target.value)}
                    placeholder="Focus intention (e.g. Read Chapter 4, Draft Essay)..."
                    disabled={isFocusRunning}
                    className="text-center bg-background text-sm"
                  />
                </div>

                <div className="flex justify-center gap-2">
                  {[15, 25, 45].map((mins) => (
                    <Button
                      key={mins}
                      variant={focusDurationMinutes === mins ? "default" : "outline"}
                      size="sm"
                      disabled={isFocusRunning}
                      onClick={() => {
                        setFocusDurationMinutes(mins);
                        setFocusSecondsLeft(mins * 60);
                      }}
                      className="rounded-xl text-xs"
                    >
                      {mins} mins
                    </Button>
                  ))}
                </div>

                <div className="flex justify-center gap-3">
                  <Button
                    onClick={() => setIsFocusRunning((r) => !r)}
                    className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold px-8 rounded-xl shadow-lg"
                  >
                    {isFocusRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                    {isFocusRunning ? "Pause Sprint" : "Start Focus"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsFocusRunning(false);
                      setFocusSecondsLeft(focusDurationMinutes * 60);
                    }}
                    className="rounded-xl"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" /> Reset
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeActivity === "journal" && (
            <Card className="border-2 border-purple-300 dark:border-purple-800 shadow-2xl bg-card/95 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-300">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-foreground">
                  <BookOpen className="w-5 h-5 text-purple-500" />
                  Mindful Reflection Prompt
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setActiveActivity(null)}>
                  ✕
                </Button>
              </CardHeader>
              <CardContent className="space-y-4 py-2">
                <div className="bg-purple-50/60 dark:bg-purple-950/40 p-4 rounded-2xl border border-purple-200 dark:border-purple-800/60">
                  <p className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-1">
                    Today's Reflection Prompt
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    {journalPrompts[selectedPromptIndex]}
                  </p>
                </div>

                <Textarea
                  value={journalContent}
                  onChange={(e) => setJournalContent(e.target.value)}
                  placeholder="Write your honest, unedited thoughts here..."
                  rows={4}
                  className="bg-background text-sm leading-relaxed"
                />

                <div className="flex justify-between items-center pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedPromptIndex((idx) => (idx + 1) % journalPrompts.length)}
                    className="text-xs text-muted-foreground"
                  >
                    <RotateCcw className="w-3.5 h-3.5 mr-1" /> Try Another Prompt
                  </Button>
                  <Button
                    onClick={handleSaveJournal}
                    disabled={!journalContent.trim()}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs px-6"
                  >
                    Save Reflection
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeActivity === "stretch" && (
            <Card className="border-2 border-sky-300 dark:border-sky-800 shadow-2xl bg-card/95 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-300">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-foreground">
                  <Activity className="w-5 h-5 text-sky-500" />
                  Desk Posture & Somatic Reset
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setActiveActivity(null)}>
                  ✕
                </Button>
              </CardHeader>
              <CardContent className="space-y-4 py-2 text-center">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-left">
                  <div className="bg-muted/40 dark:bg-slate-800/40 p-4 rounded-2xl border border-border">
                    <span className="text-xs font-bold text-sky-600 dark:text-sky-400">1. Neck Release</span>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      Drop right ear to right shoulder for 15s. Breathe into the side of the neck. Switch to left side.
                    </p>
                  </div>
                  <div className="bg-muted/40 dark:bg-slate-800/40 p-4 rounded-2xl border border-border">
                    <span className="text-xs font-bold text-sky-600 dark:text-sky-400">2. Shoulder Roll & Heart Opener</span>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      Roll shoulders back 5 times. Interlace fingers behind your back and gently lift chest upward.
                    </p>
                  </div>
                  <div className="bg-muted/40 dark:bg-slate-800/40 p-4 rounded-2xl border border-border">
                    <span className="text-xs font-bold text-sky-600 dark:text-sky-400">3. Gentle Spinal Twist</span>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      Place right hand on left knee, gently twist torso left, exhale deeply. Repeat for right side.
                    </p>
                  </div>
                </div>

                <div className="flex justify-center pt-2">
                  <Button onClick={handleCompleteStretch} className="bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl px-8">
                    <CheckCircle2 className="w-4 h-4 mr-2" /> Complete Reset Break
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ── 3. VISUAL ACTIVITY CATEGORIES ── */}
          <div className="space-y-6">
            {/* Category: CALM & NERVOUS SYSTEM REGULATION */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                  <Wind className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-tight text-foreground uppercase">
                    Calm & Nervous System Regulation
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    Somatic practices to down-regulate acute physiological stress
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Box Breathing */}
                <div
                  onClick={() => setActiveActivity("breathe")}
                  className="group bg-card hover:bg-card/90 rounded-3xl p-5 border border-border hover:border-indigo-400 dark:hover:border-indigo-600 transition-all duration-300 shadow-md hover:shadow-xl cursor-pointer flex items-start justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <Badge variant="outline" className="text-[10px] bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800">
                      3-5 Mins · Polyvagal Rhythm
                    </Badge>
                    <h4 className="text-base font-bold text-foreground group-hover:text-indigo-600 transition-colors">
                      Box Breathing Meditation (4-4-4-4)
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Equal-ratio diaphragmatic breathing to stabilize pulse and relieve mental tension.
                    </p>
                  </div>
                  <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Wind className="w-6 h-6" />
                  </div>
                </div>

                {/* 5-4-3-2-1 Grounding */}
                <div
                  onClick={() => setActiveActivity("grounding")}
                  className="group bg-card hover:bg-card/90 rounded-3xl p-5 border border-border hover:border-emerald-400 dark:hover:border-emerald-600 transition-all duration-300 shadow-md hover:shadow-xl cursor-pointer flex items-start justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <Badge variant="outline" className="text-[10px] bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800">
                      5 Mins · Somatic Presence
                    </Badge>
                    <h4 className="text-base font-bold text-foreground group-hover:text-emerald-600 transition-colors">
                      5-4-3-2-1 Somatic Grounding
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Re-anchor through all five senses to interrupt catastrophic thought loops.
                    </p>
                  </div>
                  <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Compass className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </div>

            {/* Category: FOCUS & DEEP WORK */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                  <Timer className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-tight text-foreground uppercase">
                    Focus & Cognitive Momentum
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    Structured intervals for productive, burnout-free studying
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Focus Sprint */}
                <div
                  onClick={() => setActiveActivity("focus")}
                  className="group bg-card hover:bg-card/90 rounded-3xl p-5 border border-border hover:border-amber-400 dark:hover:border-amber-600 transition-all duration-300 shadow-md hover:shadow-xl cursor-pointer flex items-start justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <Badge variant="outline" className="text-[10px] bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800">
                      15-45 Mins · Pomodoro
                    </Badge>
                    <h4 className="text-base font-bold text-foreground group-hover:text-amber-600 transition-colors">
                      Focus Sprint & Study Sanctuary
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Deep work sprint with your companion maintaining quiet meditative presence.
                    </p>
                  </div>
                  <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Timer className="w-6 h-6" />
                  </div>
                </div>

                {/* Inner Gatekeeper Strategy Link */}
                <a
                  href="/inner-gatekeeper"
                  className="group bg-gradient-to-br from-indigo-50/70 to-purple-50/70 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-3xl p-5 border border-indigo-200 dark:border-indigo-800/50 hover:shadow-xl transition-all duration-300 flex items-start justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <Badge variant="outline" className="text-[10px] bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800">
                      8-12 Mins · CBT Strategy
                    </Badge>
                    <h4 className="text-base font-bold text-foreground group-hover:text-indigo-600 transition-colors">
                      Inner Gatekeeper Practice
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Defend your mind sanctuary from imposter syndrome and academic pressure.
                    </p>
                  </div>
                  <div className="p-3 rounded-2xl bg-indigo-600 text-white flex-shrink-0 group-hover:scale-110 transition-transform shadow-md">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                </a>
              </div>
            </div>

            {/* Category: REFLECT & RESET */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-tight text-foreground uppercase">
                    Reflect & Somatic Recovery
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    Mind-body resets to unwind after long screen time
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Daily Journal */}
                <div
                  onClick={() => setActiveActivity("journal")}
                  className="group bg-card hover:bg-card/90 rounded-3xl p-5 border border-border hover:border-purple-400 dark:hover:border-purple-600 transition-all duration-300 shadow-md hover:shadow-xl cursor-pointer flex items-start justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <Badge variant="outline" className="text-[10px] bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800">
                      5 Mins · Self-Inquiry
                    </Badge>
                    <h4 className="text-base font-bold text-foreground group-hover:text-purple-600 transition-colors">
                      Daily Reflection Journal
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Release perfectionism, process daily challenges, and receive companion validation.
                    </p>
                  </div>
                  <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex-shrink-0 group-hover:scale-110 transition-transform">
                    <BookOpen className="w-6 h-6" />
                  </div>
                </div>

                {/* Desk Posture */}
                <div
                  onClick={() => setActiveActivity("stretch")}
                  className="group bg-card hover:bg-card/90 rounded-3xl p-5 border border-border hover:border-sky-400 dark:hover:border-sky-600 transition-all duration-300 shadow-md hover:shadow-xl cursor-pointer flex items-start justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <Badge variant="outline" className="text-[10px] bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800">
                      3 Mins · Physical Ease
                    </Badge>
                    <h4 className="text-base font-bold text-foreground group-hover:text-sky-600 transition-colors">
                      Desk Posture & Somatic Reset
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      3-step desk movement to relieve neck stiffness and restore deep circulation.
                    </p>
                  </div>
                  <div className="p-3 rounded-2xl bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Activity className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── 4. EMPATHETIC COMPANION DIALOGUE ── */}
          <Card className="bg-card/90 dark:bg-slate-900/90 rounded-3xl border border-indigo-200/40 dark:border-indigo-800/30 shadow-xl backdrop-blur-md overflow-hidden relative">
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-indigo-500/5 to-transparent pointer-events-none rounded-3xl" />
            <CardHeader className="border-b border-border/60 pb-3 relative">
              <CardTitle className="text-base font-bold flex items-center gap-2 text-foreground">
                <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60">
                  <MessageSquare className="w-4 h-4 text-indigo-500" />
                </div>
                Mindful Check-in with {companionName}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 space-y-4">
              {/* Message transcript */}
              <div className="h-44 overflow-y-auto space-y-3 pr-1 scrollbar-thin">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[75%] p-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        msg.sender === "user"
                          ? "bg-indigo-600 text-white rounded-br-none"
                          : "bg-muted/80 dark:bg-slate-800/80 border border-border text-foreground rounded-bl-none"
                      }`}
                    >
                      {msg.message}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="flex gap-2">
                <Input
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder={`Share what is on your mind with ${companionName}...`}
                  className="bg-background rounded-xl text-xs sm:text-sm"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!currentMessage.trim()}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>

              {/* Quick Prompt Chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[
                  "I'm feeling overwhelmed with deadlines",
                  "Can we do a quick breathing exercise?",
                  "I feel tired and unmotivated today",
                  "Give me a grounding thought for right now"
                ].map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentMessage(prompt);
                    }}
                    className="text-[11px] bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground px-2.5 py-1 rounded-full border border-border/60 transition-all"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};