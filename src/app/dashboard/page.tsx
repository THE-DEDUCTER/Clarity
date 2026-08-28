"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Bot, PenLine, Users2, Headphones, BookOpen, Palette, Brain, Target, Gamepad2, Phone, Sparkles, ChevronRight, X } from "lucide-react";
import Link from "next/link";
import MoodTracker from "@/components/mood-tracker";
import { PromptInput } from "@/components/ui/ai-chat-input";

export default function Dashboard() {
  const { user } = useAuth();
  const name = user?.firstName || user?.username || "Friend";
  const [analyzing, setAnalyzing] = useState(false);
  const [detectedQuadrant, setDetectedQuadrant] = useState<string | null>(null);

  const handlePromptSubmit = (message: string) => {
    setAnalyzing(true);
    
    // Simulate API delay and mock sentiment analysis based on keywords
    setTimeout(() => {
      const lowerMsg = message.toLowerCase();
      let quadrant = "green"; // Default to calm/relaxed
      
      if (lowerMsg.match(/(angry|mad|furious|frustrated|stressed|overwhelmed|panic|hate|annoyed|shit|fuck|bad day)/)) {
        quadrant = "red";
      } else if (lowerMsg.match(/(excited|happy|great|awesome|amazing|joy|love|good day)/)) {
        quadrant = "yellow";
      } else if (lowerMsg.match(/(sad|depressed|tired|lonely|bored|down|bad|cry|exhausted)/)) {
        quadrant = "blue";
      }

      setDetectedQuadrant(quadrant);
      setAnalyzing(false);
    }, 1200);
  };

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
    <div className="w-full max-w-none mx-auto space-y-8 sm:space-y-12 pb-16 px-4 md:px-8 lg:px-16 xl:px-24 animate-in fade-in zoom-in-95 duration-500">
      
      {/* Top Banner Area (Sleek, integrated typography instead of a box) */}
      <div className="pt-6 sm:pt-10 relative">
        <div className="flex flex-col gap-6">
          <span className="text-sm font-medium text-muted-foreground dark:text-gray-400 tracking-wide uppercase">Your Daily Growth</span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium text-foreground dark:text-white leading-[1.1] tracking-tight">
            Hello,<br />
            <span className="text-gray-400 dark:text-muted-foreground">How are you feeling today?</span>
          </h1>
        </div>

        {/* Quick Jump Shortcuts */}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          {quickPills.map((pill) => (
            <Link
              key={pill.title}
              href={pill.href}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 hover:scale-105 active:scale-95 border border-border dark:border-white/10 bg-white/50 dark:bg-black/40 text-muted-foreground dark:text-gray-300 backdrop-blur-md hover:bg-muted dark:hover:bg-white/10"
            >
              <pill.icon className="w-4 h-4" />
              <span>{pill.title}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Main Content Layout Grid */}
      <div className="flex flex-col gap-12 lg:gap-16">
        
        {/* Mood Tracker */}
        <div className="flex flex-col gap-6 w-full">
          <MoodTracker variant="inline" />
        </div>

        {/* Bento Grid Features */}
        <div className="pt-2">
          <div className="mb-6">
            <span className="text-sm font-semibold text-muted-foreground dark:text-gray-300 tracking-wide">Explore Activities</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            {bentoCards.map((card, index) => (
              <Link key={card.title} href={card.href} className={card.span}>
                <div 
                  className={`group relative h-40 sm:h-56 rounded-[28px] sm:rounded-[36px] p-5 sm:p-6 ${card.bg} ${card.textColor} overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-95 flex flex-col justify-between`}
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: 'slideInBounce 0.8s ease-out forwards'
                  }}
                >
                  <div className="flex justify-between items-start z-10">
                    <h3 className="text-lg sm:text-2xl font-semibold leading-tight max-w-[70%] drop-shadow-sm">
                      {card.title}
                    </h3>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 dark:bg-black/10 flex items-center justify-center backdrop-blur-md group-hover:bg-white/30 transition-colors">
                      <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                  </div>
                  
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/20 dark:bg-black/15 backdrop-blur-md flex items-center justify-center self-end mt-auto opacity-95 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300 z-10 shadow-sm">
                    <card.icon className="w-8 h-8 sm:w-10 sm:h-10 text-current stroke-[2.2]" />
                  </div>
                  
                  {/* Decorative blob */}
                  <div className="absolute -bottom-4 -left-4 w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Progress / Wellness Card */}
        <div className="pt-2">
          <Link href="/wellness">
            <div className="relative overflow-hidden bg-[#e2e8f0] dark:bg-[#1a202c] rounded-[36px] p-6 sm:p-10 flex flex-col justify-center h-48 sm:h-56 group transition-all hover:shadow-lg">
              <div className="relative z-10">
                <span className="text-sm font-semibold text-muted-foreground dark:text-gray-400 tracking-wide">Your Wellness Score</span>
                <div className="text-6xl sm:text-7xl font-bold text-foreground dark:text-gray-100 mt-2">
                  85%
                </div>
              </div>
              
              {/* Abstract hexagon-like background shapes mimicking the first reference image */}
              <div className="absolute right-0 bottom-0 opacity-40 dark:opacity-20 translate-x-1/4 translate-y-1/4 group-hover:scale-105 transition-transform duration-700">
                <div className="w-64 h-64 grid grid-cols-3 gap-2 rotate-12">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="w-20 h-20 bg-card dark:bg-gray-600 rounded-2xl opacity-70" style={{ transform: i % 2 === 0 ? 'translateY(20px)' : 'none' }} />
                  ))}
                </div>
              </div>
            </div>
          </Link>
        </div>

      </div>

      {/* Global Command Palette */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 w-full max-w-lg px-4 flex justify-center pointer-events-none">
        <div className="pointer-events-auto flex justify-center w-full shadow-2xl rounded-3xl relative">
          {analyzing && (
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-2 animate-pulse shadow-lg whitespace-nowrap">
              <Sparkles className="w-3 h-3" />
              Analyzing your mood...
            </div>
          )}
          <PromptInput 
            placeholder="How are you feeling right now?"
            onSubmit={handlePromptSubmit}
          />
        </div>
      </div>

      {/* Mood Overlay */}
      {detectedQuadrant && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-lg bg-black rounded-[44px] shadow-2xl relative overflow-hidden border border-white/10 animate-in zoom-in-95 duration-400">
             <button 
               onClick={() => setDetectedQuadrant(null)}
               className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center z-50 text-white hover:bg-white/20 transition-colors"
               aria-label="Close"
             >
               <X className="w-4 h-4" />
             </button>
             
             <div className="pt-6 relative z-10 max-h-[85vh] overflow-y-auto no-scrollbar">
               <MoodTracker 
                 variant="inline" 
                 defaultQuadrant={detectedQuadrant} 
                 onMoodLogged={() => setDetectedQuadrant(null)} 
               />
             </div>
          </div>
        </div>
      )}
    </div>
  );
}