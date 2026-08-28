"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Menu, 
  Search, 
  Home, 
  Bot, 
  PenLine, 
  Brain, 
  Gamepad2, 
  Castle, 
  PawPrint, 
  Users2, 
  GraduationCap, 
  UserCheck, 
  MessageSquare, 
  Heart, 
  Target, 
  Headphones, 
  Palette, 
  BookOpen, 
  Phone, 
  Shield, 
  User, 
  Settings,
  Sparkles,
  ArrowUpRight
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureItem {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  badge?: string;
}

interface FeatureCategory {
  title: string;
  items: FeatureItem[];
}

const FEATURE_CATEGORIES: FeatureCategory[] = [
  {
    title: "My Mind",
    items: [
      { title: "My Mind Hub", description: "Your mental and emotional toolkit", href: "/my-mind", icon: Brain, color: "text-violet-600 bg-violet-50 dark:bg-violet-950/50" },
      { title: "AI Buddy", description: "Empathetic companion with voice support", href: "/ai-buddy", icon: Bot, color: "text-pink-600 bg-pink-50 dark:bg-pink-950/50", badge: "Live" },
      { title: "Emotional Diary", description: "Journal your thoughts and emotions", href: "/diary", icon: PenLine, color: "text-orange-600 bg-orange-50 dark:bg-orange-950/50" },
      { title: "Self-Assessment", description: "Clinically backed mental wellbeing tests", href: "/assessment", icon: Brain, color: "text-purple-600 bg-purple-50 dark:bg-purple-950/50" },
      { title: "Inner Gatekeeper", description: "Mind strategy and thought management", href: "/inner-gatekeeper", icon: Castle, color: "text-blue-600 bg-blue-50 dark:bg-blue-950/50" },
    ]
  },
  {
    title: "Wellness",
    items: [
      { title: "Wellness Hub", description: "Daily habits, breathwork and mindfulness", href: "/wellness", icon: Heart, color: "text-rose-600 bg-rose-50 dark:bg-rose-950/50" },
      { title: "Goal Tracker", description: "Step-by-step progress and micro-milestones", href: "/goals", icon: Target, color: "text-red-600 bg-red-50 dark:bg-red-950/50" },
      { title: "Audio Sessions", description: "Binaural soundscapes and soothing sleep", href: "/audio-sessions", icon: Headphones, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50" },
      { title: "Creative Zone", description: "Mandala art therapy and calming canvas", href: "/creative", icon: Palette, color: "text-sky-600 bg-sky-50 dark:bg-sky-950/50" },
    ]
  },
  {
    title: "Play",
    items: [
      { title: "Games Hub", description: "Explore all therapeutic mini-games", href: "/games", icon: Gamepad2, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50" },
      { title: "Pet Care Companion", description: "Interactive emotional pet simulation", href: "/petcare-game", icon: PawPrint, color: "text-amber-600 bg-amber-50 dark:bg-amber-950/50" },
    ]
  },
  {
    title: "Community",
    items: [
      { title: "Community Hub", description: "Connect, share, and find support", href: "/community", icon: Users2, color: "text-cyan-600 bg-cyan-50 dark:bg-cyan-950/50" },
      { title: "Peer Support", description: "Connect with empathetic companions", href: "/peer-support", icon: Users2, color: "text-amber-600 bg-amber-50 dark:bg-amber-950/50" },
      { title: "Clarity Connect", description: "Professional wellness community feed", href: "/professional-community", icon: GraduationCap, color: "text-teal-600 bg-teal-50 dark:bg-teal-950/50" },
      { title: "Mentorship", description: "1-on-1 guidance and mentor pairing", href: "/mentorship", icon: UserCheck, color: "text-violet-600 bg-violet-50 dark:bg-violet-950/50" },
      { title: "Anonymous Chat", description: "Confidential counselor connection", href: "/anonymous-chat", icon: MessageSquare, color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/50" },
    ]
  },
  {
    title: "Explore",
    items: [
      { title: "Resources", description: "Articles, guides and psychological literacy", href: "/resources", icon: BookOpen, color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/50" },
    ]
  },
  {
    title: "Safety",
    items: [
      { title: "Crisis Support", description: "24/7 emergency helplines and SOS", href: "/crisis", icon: Phone, color: "text-rose-700 bg-rose-100 dark:bg-rose-950" },
      { title: "Safety & Report", description: "Confidential issue reporting", href: "/report", icon: Shield, color: "text-slate-600 bg-slate-100 dark:bg-slate-800" },
    ]
  },
  {
    title: "Account",
    items: [
      { title: "Profile", description: "Account settings and personal stats", href: "/profile", icon: User, color: "text-gray-600 bg-gray-100 dark:bg-gray-800" },
      { title: "Settings", description: "Theme, privacy and notification preferences", href: "/settings", icon: Settings, color: "text-gray-600 bg-gray-100 dark:bg-gray-800" },
    ]
  }
];

export function MobileNavDrawer({ trigger }: { trigger?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();

  const filteredCategories = FEATURE_CATEGORIES.map((category) => ({
    ...category,
    items: category.items.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter((category) => category.items.length > 0);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger || (
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden rounded-2xl w-10 h-10 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md shadow-sm border border-gray-100 dark:border-gray-700"
          >
            <Menu className="w-5 h-5 text-gray-700 dark:text-gray-200" />
            <span className="sr-only">Open feature menu</span>
          </Button>
        )}
      </SheetTrigger>

      <SheetContent 
        side="left" 
        className="w-[88vw] sm:max-w-md p-0 flex flex-col bg-slate-50/95 dark:bg-gray-900/95 backdrop-blur-2xl border-r border-gray-200/50 dark:border-gray-800/50 z-[100]"
      >
        <SheetHeader className="p-4 sm:p-6 pb-2 border-b border-gray-200/40 dark:border-gray-800/40 text-left">
          <div className="flex items-center gap-3">
            <img 
              src="/assets/clarity-logo.png" 
              alt="Clarity" 
              className="h-8 w-auto rounded-xl drop-shadow-sm" 
            />
            <div>
              <SheetTitle className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Clarity
              </SheetTitle>
              <p className="text-xs text-muted-foreground">All features at your fingertips</p>
            </div>
          </div>

          {/* Quick Search */}
          <div className="relative mt-4">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input 
              type="text"
              placeholder="Search features..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-white/90 dark:bg-gray-800/90 rounded-2xl h-10 text-sm border-gray-200/60 dark:border-gray-700/60 shadow-sm"
            />
          </div>
        </SheetHeader>

        {/* Feature List */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground text-sm">
              <Sparkles className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              No features match &quot;{searchQuery}&quot;
            </div>
          ) : (
            filteredCategories.map((category) => (
              <div key={category.title} className="space-y-2">
                <h4 className={cn(
                  "text-xs font-bold uppercase tracking-wider px-2",
                  category.title === "Safety" 
                    ? "text-rose-600 dark:text-rose-400" 
                    : "text-muted-foreground"
                )}>
                  {category.title}
                </h4>
                <div className="grid grid-cols-1 gap-1.5">
                  {category.items.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href));
                    return (
                      <Link
                        key={item.href + item.title}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center gap-3.5 p-2.5 rounded-2xl transition-all duration-200 group active:scale-[0.98]",
                          isActive
                            ? "bg-white dark:bg-gray-800 shadow-md border border-gray-200/60 dark:border-gray-700"
                            : "hover:bg-white/60 dark:hover:bg-gray-800/60"
                        )}
                      >
                        <div className={cn("p-2 rounded-xl transition-transform group-hover:scale-110", item.color)}>
                          <item.icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">
                              {item.title}
                            </span>
                            {item.badge && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {item.description}
                          </p>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
