"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, Bot, PenLine, Users2, Headphones, BookOpen, Palette, Activity, Brain, Target, Gamepad2, Phone, Sparkles } from "lucide-react";
import Link from "next/link";
import MoodTracker from "@/components/mood-tracker";

export default function Dashboard() {
  const { user } = useAuth();
  const name = user?.firstName || user?.username || "Friend";

  const quickPills = [
    { title: "Self-Assessment", href: "/assessment", icon: Brain, bg: "bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300" },
    { title: "Therapy Games", href: "/games", icon: Gamepad2, bg: "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300" },
    { title: "My Goals", href: "/goals", icon: Target, bg: "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300" },
    { title: "Crisis SOS", href: "/crisis", icon: Phone, bg: "bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300" },
  ];

  const bentoCards = [
    { 
      title: "Talk to AI Buddy", 
      icon: Bot, 
      href: "/ai-buddy", 
      bg: "bg-[#EE5394]", // Pink
      textColor: "text-white",
      span: "col-span-1"
    },
    { 
      title: "Write in Diary", 
      icon: PenLine, 
      href: "/diary", 
      bg: "bg-[#E89326]", // Orange
      textColor: "text-white",
      span: "col-span-1"
    },
    { 
      title: "Peer Community", 
      icon: Users2, 
      href: "/peer-support", 
      bg: "bg-[#EAC85A]", // Yellow
      textColor: "text-amber-950",
      span: "col-span-1"
    },
    { 
      title: "Audio Sessions", 
      icon: Headphones, 
      href: "/audio-sessions", 
      bg: "bg-[#13B695]", // Green
      textColor: "text-white",
      span: "col-span-1"
    },
    { 
      title: "Learning Resources", 
      icon: BookOpen, 
      href: "/resources", 
      bg: "bg-[#9B89F3]", // Purple
      textColor: "text-white",
      span: "col-span-2 xs:col-span-1 sm:col-span-2 md:col-span-1"
    },
    { 
      title: "Creative Canvas", 
      icon: Palette, 
      href: "/creative", 
      bg: "bg-[#64A3E9]", // Blue
      textColor: "text-white",
      span: "col-span-2 xs:col-span-1 sm:col-span-2 md:col-span-1"
    }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 sm:space-y-8 pb-20 px-2 sm:px-4 animate-in fade-in zoom-in-95 duration-500">
      
      {/* Top Banner Area */}
      <div className="bg-[#FAE9E6] dark:bg-[#3d211e] rounded-[36px] sm:rounded-[48px] p-6 sm:p-10 relative overflow-hidden shadow-sm mt-2">
        <div className="flex justify-between items-start mb-4 sm:mb-8">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400 tracking-wide uppercase">Your Daily Growth</span>
          <div className="w-10 h-10 bg-white dark:bg-black/40 rounded-full flex items-center justify-center shadow-sm cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="flex gap-1">
              <div className="w-1 h-1 bg-gray-400 rounded-full" />
              <div className="w-1 h-1 bg-gray-400 rounded-full" />
              <div className="w-1 h-1 bg-gray-400 rounded-full" />
            </div>
          </div>
        </div>
        
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium text-[#2d3748] dark:text-[#f7fafc] leading-[1.15] tracking-tight">
          Hello, {name}<br />
          <span className="text-[#4a5568] dark:text-[#cbd5e0]">How are you<br />feeling today?</span>
        </h1>
        
        {/* Subtle background decoration */}
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/20 dark:bg-black/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Quick Jump Shortcuts (Mobile horizontal scroll + Desktop flex wrap) */}
      <div className="px-2 overflow-x-auto pb-1 no-scrollbar -mt-2">
        <div className="flex items-center gap-2.5 min-w-max">
          {quickPills.map((pill) => (
            <Link
              key={pill.title}
              href={pill.href}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-semibold shadow-sm transition-all duration-200 hover:scale-105 active:scale-95 border border-black/5 dark:border-white/10 ${pill.bg}`}
            >
              <pill.icon className="w-3.5 h-3.5" />
              <span>{pill.title}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Mood Tracker */}
      <div className="px-2">
        <div className="mb-4">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 tracking-wide">Select Mood type</span>
        </div>
        {/* We reuse the existing MoodTracker but it will automatically inherit the cleaner aesthetic */}
        <MoodTracker variant="inline" />
      </div>

      {/* Bento Grid Features */}
      <div className="px-2 pt-6">
        <div className="mb-4">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 tracking-wide">Explore Activities</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
          {bentoCards.map((card, index) => (
            <Link key={card.title} href={card.href} className={card.span}>
              <div 
                className={`group relative h-40 sm:h-48 rounded-[28px] sm:rounded-[32px] p-5 sm:p-6 ${card.bg} ${card.textColor} overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-95 flex flex-col justify-between`}
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: 'slideInBounce 0.8s ease-out forwards'
                }}
              >
                <div className="flex justify-between items-start z-10">
                  <h3 className="text-lg sm:text-xl font-semibold leading-tight max-w-[70%]">
                    {card.title}
                  </h3>
                  <div className="w-8 h-8 rounded-full bg-white/20 dark:bg-black/10 flex items-center justify-center backdrop-blur-md group-hover:bg-white/30 transition-colors">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
                
                <div className="w-16 h-16 rounded-2xl bg-white/20 dark:bg-black/15 backdrop-blur-md flex items-center justify-center self-end mt-auto opacity-95 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300 z-10 shadow-sm">
                  <card.icon className="w-8 h-8 text-current stroke-[2.2]" />
                </div>
                
                {/* Decorative blob */}
                <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Progress / Wellness Card */}
      <div className="px-2 pt-2">
        <Link href="/wellness">
          <div className="relative overflow-hidden bg-[#e2e8f0] dark:bg-[#1a202c] rounded-[36px] p-6 sm:p-10 flex flex-col justify-center h-48 sm:h-56 group transition-all hover:shadow-lg">
            <div className="relative z-10">
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 tracking-wide">Your Wellness Score</span>
              <div className="text-6xl sm:text-7xl font-bold text-gray-800 dark:text-gray-100 mt-2">
                85%
              </div>
            </div>
            
            {/* Abstract hexagon-like background shapes mimicking the first reference image */}
            <div className="absolute right-0 bottom-0 opacity-40 dark:opacity-20 translate-x-1/4 translate-y-1/4 group-hover:scale-105 transition-transform duration-700">
              <div className="w-64 h-64 grid grid-cols-3 gap-2 rotate-12">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="w-20 h-20 bg-white dark:bg-gray-600 rounded-2xl opacity-70" style={{ transform: i % 2 === 0 ? 'translateY(20px)' : 'none' }} />
                ))}
              </div>
            </div>
          </div>
        </Link>
      </div>
      
      <style>{`
        @keyframes slideInBounce {
          0% { opacity: 0; transform: translateY(30px) scale(0.95); }
          50% { transform: translateY(-5px) scale(1.02); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}