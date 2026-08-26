"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BackButton } from "@/components/ui/back-button";
import { useToast } from "@/hooks/use-toast";
import { 
  BookOpen, Search, Plus, Settings, Bell, ChevronRight,
  Flame, MapPin, Heart, Share2, Copy, LayoutDashboard,
  Calendar, BarChart2, Tag, LogOut, Sparkles, SlidersHorizontal,
  ArrowUpRight, Smile, SmilePlus, Meh, Frown, BookMarked,
  PenLine, Lightbulb, Moon, Coffee, TreePine, Waves, Sun,
  CheckSquare, ClipboardList, Feather
} from "lucide-react";
import { format, addDays, startOfWeek, isToday, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface DiaryEntry {
  id: string;
  title: string;
  content: string;
  date: Date;
  mood: number;
  category: string;
  tag: string;
  color: string;
  accentColor: string;
  imageUrl?: string;
}

const moodOptions = [
  { value: 1, icon: <Frown className="w-4 h-4" />, label: "Rough", color: "text-rose-500", bg: "bg-rose-100 dark:bg-rose-900/30" },
  { value: 2, icon: <Frown className="w-4 h-4" />, label: "Low",   color: "text-amber-500", bg: "bg-amber-100 dark:bg-amber-900/30" },
  { value: 3, icon: <Meh className="w-4 h-4" />,   label: "Okay",  color: "text-slate-400",  bg: "bg-slate-100 dark:bg-slate-900/30" },
  { value: 4, icon: <Smile className="w-4 h-4" />, label: "Good",  color: "text-sky-500",    bg: "bg-sky-100 dark:bg-sky-900/30" },
  { value: 5, icon: <SmilePlus className="w-4 h-4" />, label: "Great", color: "text-emerald-500", bg: "bg-emerald-100 dark:bg-emerald-900/30" },
];

const dailyPrompts = [
  "I slow down to hear the flowers bloom and feel the gentle touch of the breeze.",
  "What small moment today made you pause and appreciate life?",
  "What is one thing you did today that took courage?",
  "Describe a feeling you haven't been able to name yet.",
  "What are three things your future self will thank you for today?",
  "Write about something that surprised you recently.",
  "If today had a colour, what would it be and why?",
];

const templates = [
  { icon: <ClipboardList className="w-5 h-5 text-orange-500" />, label: "Recipes", sub: "Cooking instructions", bg: "bg-orange-50 dark:bg-orange-900/20" },
  { icon: <CheckSquare className="w-5 h-5 text-green-500" />, label: "Grocery List", sub: "Fruits, dairy, etc.", bg: "bg-green-50 dark:bg-green-900/20" },
  { icon: <Calendar className="w-5 h-5 text-blue-500" />, label: "Meeting Notes", sub: "Date, attendees, agenda", bg: "bg-blue-50 dark:bg-blue-900/20" },
  { icon: <CheckSquare className="w-5 h-5 text-purple-500" />, label: "To-Do List", sub: "Checkboxes and more!", bg: "bg-purple-50 dark:bg-purple-900/20" },
  { icon: <Feather className="w-5 h-5 text-rose-500" />, label: "Journal", sub: "Prompts or quotes", bg: "bg-rose-50 dark:bg-rose-900/20" },
];

const mockEntries: DiaryEntry[] = [
  {
    id: "1", title: "Therapy Session Insights",
    content: "Had a breakthrough in therapy today. Dr. Smith helped me understand my trigger patterns. I'm starting to see how certain situations remind me of past experiences.",
    date: new Date(2024, 0, 15), mood: 4, category: "Wellness", tag: "Article",
    color: "bg-violet-50 dark:bg-violet-900/20", accentColor: "bg-violet-400",
  },
  {
    id: "2", title: "Morning Calm",
    content: "Woke up early and sat by the window. The light was golden, the air still. It felt like the world was giving me permission to just breathe.",
    date: new Date(2024, 1, 3), mood: 5, category: "Mindfulness", tag: "Must read",
    color: "bg-sky-50 dark:bg-sky-900/20", accentColor: "bg-sky-400",
  },
  {
    id: "3", title: "Letting Go",
    content: "I wrote a letter to my past self today. About the things I wish I'd known, the apologies I needed to make to myself. It felt healing and deeply necessary.",
    date: new Date(2024, 1, 10), mood: 3, category: "Healing", tag: "Research",
    color: "bg-rose-50 dark:bg-rose-900/20", accentColor: "bg-rose-400",
  },
  {
    id: "4", title: "How to create a successful habit",
    content: "Tiny habits stack up. I've been tracking my sleep, water intake and mood for 30 days and the patterns are eye-opening. Consistency beats intensity every time.",
    date: new Date(2024, 2, 12), mood: 4, category: "Growth", tag: "Videos",
    color: "bg-amber-50 dark:bg-amber-900/20", accentColor: "bg-amber-400",
  },
  {
    id: "5", title: "Difficult Day",
    content: "Today was challenging. The presentation triggered anxiety but I used the breathing techniques we practiced. Small victories count just as much.",
    date: new Date(2024, 0, 12), mood: 2, category: "Recovery", tag: "Important",
    color: "bg-emerald-50 dark:bg-emerald-900/20", accentColor: "bg-emerald-400",
  },
  {
    id: "6", title: "The impact of colour on mood",
    content: "Read a fascinating study today about how surrounding colours can shift our emotional state. I want to repaint my room something warm.",
    date: new Date(2024, 2, 7), mood: 4, category: "Research", tag: "Research",
    color: "bg-pink-50 dark:bg-pink-900/20", accentColor: "bg-pink-400",
  },
];

const tagColors: Record<string, string> = {
  "Article":   "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  "Must read": "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
  "Research":  "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
  "Videos":    "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  "Important": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  "Images":    "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300",
};

// ─── BOOK VIEW ─────────────────────────────────────────────────────────────────
function BookView({ onClose }: { onClose: () => void }) {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [selectedMood, setSelectedMood] = useState(3);
  const [location, setLocation] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [liked, setLiked] = useState(false);
  const [streak] = useState(1);
  const { toast } = useToast();

  const todayPrompt = dailyPrompts[new Date().getDay() % dailyPrompts.length];
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const pastMonths = [
    { day: "27", month: "7月", label: "今天" },
    { day: "26", month: "12月", label: "周一" },
    { day: "25", month: "5月", label: "周一" },
    { day: "29", month: "4月", label: "周四" },
    { day: "23", month: "3月", label: "周四" },
    { day: "11", month: "12月", label: "2024", year: true },
    { day: "19", month: "11月", label: "2024", year: true },
  ];

  const handleSave = () => {
    if (!content.trim()) return;
    toast({ title: "Entry saved!", description: "Your thoughts are safely stored." });
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
    >
      <motion.div
        initial={{ y: 24 }}
        animate={{ y: 0 }}
        className="w-full max-w-4xl"
        style={{ maxHeight: "90vh" }}
      >
        {/* Outer book with light blue border glow */}
        <div
          className="relative rounded-3xl overflow-hidden shadow-2xl"
          style={{
            background: "linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%)",
            padding: "3px",
            boxShadow: "0 0 0 3px #7dd3fc, 0 32px 64px rgba(0,0,0,0.25)"
          }}
        >
          <div className="rounded-[22px] overflow-hidden flex" style={{ background: "#f8fcff", minHeight: 500 }}>

            {/* Far left – date strip */}
            <div className="w-[72px] flex-shrink-0 bg-white/80 border-r border-sky-100 flex flex-col items-center py-6 gap-1">
              {pastMonths.map((d, i) => (
                <button
                  key={i}
                  onClick={() => {
                    const now = new Date();
                    const m = new Date(d.year ? 2024 : now.getFullYear(), parseInt(d.month) - 1, parseInt(d.day));
                    setSelectedDate(m);
                  }}
                  className={cn(
                    "flex flex-col items-center px-2 py-1.5 rounded-xl transition-all w-14",
                    i === 0 ? "bg-sky-500 text-white shadow-sm shadow-sky-300" : "hover:bg-sky-50 text-gray-500"
                  )}
                >
                  {d.year && <span className="text-[8px] font-medium opacity-60 mb-0.5">{d.label}</span>}
                  {!d.year && i === 0 && <span className="text-[8px] font-bold opacity-80">今天</span>}
                  <span className={cn("text-base font-bold leading-none", i === 0 ? "text-white" : "text-gray-700")}>{d.day}</span>
                  <span className={cn("text-[9px] mt-0.5", i === 0 ? "text-sky-100" : "text-gray-400")}>{d.month}</span>
                </button>
              ))}
            </div>

            {/* Left panel */}
            <div className="w-64 flex-shrink-0 border-r border-sky-100 flex flex-col bg-white/70 py-5 px-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="12" cy="12" r="5"/>
                      <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-medium">{format(selectedDate, "EEEE")}</p>
                    <p className="text-xs font-bold text-gray-700">{format(selectedDate, "MMM d, yyyy")}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors text-xs font-medium"
                >
                  ✕
                </button>
              </div>

              {/* Illustrated card */}
              <div className="rounded-2xl overflow-hidden mb-4 shadow-sm border border-sky-100" style={{ height: 180 }}>
                <svg viewBox="0 0 260 180" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <defs>
                    <linearGradient id="sky2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#bfdbfe"/>
                      <stop offset="60%" stopColor="#dbeafe"/>
                      <stop offset="100%" stopColor="#eff6ff"/>
                    </linearGradient>
                    <linearGradient id="sea2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9"/>
                      <stop offset="100%" stopColor="#0284c7"/>
                    </linearGradient>
                  </defs>
                  <rect width="260" height="180" fill="url(#sky2)"/>
                  {/* Big fluffy cloud */}
                  <ellipse cx="155" cy="52" rx="52" ry="38" fill="white" opacity="0.95"/>
                  <ellipse cx="185" cy="46" rx="35" ry="28" fill="white" opacity="0.9"/>
                  <ellipse cx="125" cy="58" rx="32" ry="22" fill="white" opacity="0.85"/>
                  <ellipse cx="205" cy="65" rx="22" ry="16" fill="white" opacity="0.75"/>
                  {/* Sea */}
                  <path d="M0 120 Q65 112 130 118 Q195 124 260 116 L260 180 L0 180 Z" fill="url(#sea2)"/>
                  {/* Flower field */}
                  {[15,35,55,75,95,115,135,155,175,195,215,240].map((x, i) => {
                    const h = 108 + (i % 3) * 5;
                    const c = i % 3 === 0 ? "#fbbf24" : i % 3 === 1 ? "#f97316" : "#facc15";
                    return (
                      <g key={i}>
                        <line x1={x} y1={h+6} x2={x} y2={h+18} stroke="#4ade80" strokeWidth="1.5"/>
                        <circle cx={x} cy={h} r="4.5" fill={c}/>
                        <circle cx={x-3} cy={h+2} r="2" fill={c} opacity="0.7"/>
                        <circle cx={x+3} cy={h+2} r="2" fill={c} opacity="0.7"/>
                      </g>
                    );
                  })}
                  {/* Person */}
                  <g transform="translate(128,90)">
                    <circle cx="0" cy="-14" r="7" fill="#92400e"/>
                    <path d="M-5,-7 Q0,10 5,-7" fill="#d97706" stroke="#b45309" strokeWidth="0.5"/>
                    <path d="M-8,2 Q-15,14 -10,18" stroke="#92400e" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                    <path d="M8,2 Q15,14 10,18" stroke="#92400e" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                  </g>
                </svg>
              </div>
              <p className="text-[10px] text-center text-gray-400 mb-4 font-medium">充满鲜花的世界到底在哪里</p>

              {/* Weekly mini-calendar */}
              <div className="mb-4">
                <div className="grid grid-cols-7 gap-0 text-center mb-1">
                  {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d, i) => (
                    <div key={i} className="text-[8px] font-medium text-gray-400">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-0.5">
                  {weekDays.map((d, i) => {
                    const isSel = isSameDay(d, selectedDate);
                    const tod = isToday(d);
                    return (
                      <button
                        key={i}
                        onClick={() => setSelectedDate(d)}
                        className={cn(
                          "h-6 w-6 mx-auto rounded-full text-[10px] font-semibold transition-all",
                          isSel ? "bg-sky-500 text-white shadow-sm" :
                          tod ? "bg-sky-100 text-sky-600" :
                          "text-gray-500 hover:bg-gray-100"
                        )}
                      >
                        {format(d, "d")}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Streak */}
              <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 p-3 text-center">
                <div className="flex items-center justify-center gap-1 mb-0.5">
                  <Flame className="w-3.5 h-3.5 text-orange-500" />
                  <span className="text-xs font-bold text-orange-600">{streak} Day Streak</span>
                </div>
                <p className="text-[9px] text-amber-600/70">You're on fire! Keep the flame lit every day!</p>
              </div>
            </div>

            {/* Spiral binding */}
            <div className="w-8 flex-shrink-0 flex flex-col items-center justify-around py-6 bg-gradient-to-b from-sky-50 to-blue-50 border-x border-sky-100 z-10">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="w-5 h-5 rounded-full border-2 border-sky-300 bg-white shadow-sm flex-shrink-0" />
              ))}
            </div>

            {/* Right panel */}
            <div className="flex-1 flex flex-col bg-white/80 min-w-0">

              {/* Quote card */}
              <div className="px-6 pt-5 pb-3">
                <div className="rounded-2xl bg-gray-50 border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-medium">
                      <BookMarked className="w-3.5 h-3.5 text-sky-400" />
                      Savor the Moment
                    </div>
                    <span className="text-[10px] text-gray-400">{format(new Date(), "h:mm a")}</span>
                  </div>
                  <p className="text-sm font-bold text-gray-700 leading-snug text-center px-4 py-2 italic">
                    "{todayPrompt}"
                  </p>
                  <div className="flex items-center justify-center gap-5 mt-2 pt-2 border-t border-gray-100">
                    <button className="p-1 rounded text-gray-400 hover:text-gray-600 transition-colors">
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setLiked(!liked)}
                      className={cn("p-1 rounded transition-colors", liked ? "text-rose-500" : "text-gray-400 hover:text-rose-400")}
                    >
                      <Heart className="w-3.5 h-3.5" fill={liked ? "currentColor" : "none"} />
                    </button>
                    <button className="p-1 rounded text-gray-400 hover:text-gray-600 transition-colors">
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Writing area */}
              <div className="flex-1 px-6 py-2 relative overflow-hidden">
                <p className="text-[10px] text-amber-500 italic mb-2 leading-relaxed">
                  ✏ Use the card's prompt to take a small action, make a decision, affirm a belief, or reflect on an idea, and write it down:
                </p>
                {/* Optional title */}
                <input
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Entry title (optional)..."
                  className="w-full text-xs font-semibold text-gray-600 bg-transparent border-0 outline-none mb-2 placeholder:text-gray-300"
                />
                {/* Lined paper */}
                <div className="relative">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute left-0 right-0 border-b border-gray-100 pointer-events-none"
                      style={{ top: i * 30 + 26 }}
                    />
                  ))}
                  <textarea
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    placeholder="Feel free to journal your current thoughts or anything else you'd like..."
                    className="w-full bg-transparent border-0 outline-none resize-none text-[13px] text-gray-600 leading-[30px] placeholder:text-gray-300 placeholder:text-xs placeholder:italic relative z-10"
                    style={{ minHeight: 220, lineHeight: "30px" }}
                  />
                </div>
              </div>

              {/* Bottom bar */}
              <div className="px-6 py-3 border-t border-gray-100 flex items-center gap-3">
                <MapPin className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
                <input
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="Where are you right now..."
                  className="flex-1 text-xs bg-transparent outline-none border-0 text-gray-400 placeholder:text-gray-300 placeholder:italic"
                />
                <div className="flex items-center gap-1">
                  {moodOptions.map(m => (
                    <button
                      key={m.value}
                      onClick={() => setSelectedMood(m.value)}
                      className={cn(
                        "p-1 rounded-full transition-all",
                        selectedMood === m.value ? `${m.bg} ${m.color} scale-110` : "text-gray-200 hover:text-gray-400"
                      )}
                    >
                      {m.icon}
                    </button>
                  ))}
                </div>
                <Button
                  onClick={handleSave}
                  disabled={!content.trim()}
                  size="sm"
                  className="bg-sky-500 hover:bg-sky-600 text-white text-xs rounded-xl px-4 h-8 shadow-sm shadow-sky-200"
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── MAIN DIARY PAGE ───────────────────────────────────────────────────────────
export default function DiaryPage() {
  const [entries, setEntries] = useState<DiaryEntry[]>(mockEntries);
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeNav, setActiveNav] = useState("workspace");

  const filteredEntries = entries.filter(e =>
    !searchTerm ||
    e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sidebarNav = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    {
      id: "workspace", label: "Workspace", icon: <BookOpen className="w-4 h-4" />, expanded: true,
      children: [
        { id: "entries", label: "Entries", icon: <PenLine className="w-3 h-3" /> },
        { id: "prompts", label: "Prompts", icon: <Lightbulb className="w-3 h-3" /> },
        { id: "drafts", label: "Canal Drafts", icon: <Feather className="w-3 h-3" /> },
      ]
    },
    { id: "stats", label: "Statistics", icon: <BarChart2 className="w-4 h-4" /> },
    { id: "calendar", label: "Calendar", icon: <Calendar className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-100/60 dark:bg-gray-950" data-testid="page-diary">
      <AnimatePresence>
        {showNewEntry && <BookView onClose={() => setShowNewEntry(false)} />}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">

        {/* ── LEFT SIDEBAR (like DoDo) ── */}
        <aside className="w-52 flex-shrink-0 hidden lg:flex flex-col gap-1">
          {/* Logo */}
          <div className="flex items-center gap-2 px-3 py-4 mb-2">
            <div className="w-7 h-7 rounded-full bg-sky-500 flex items-center justify-center shadow-sm">
              <Feather className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-bold text-gray-800 dark:text-gray-100">Clarity</span>
          </div>

          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-1">Menu</p>

          {sidebarNav.map(item => (
            <div key={item.id}>
              <button
                onClick={() => setActiveNav(item.id)}
                className={cn(
                  "flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-sm font-medium transition-all",
                  activeNav === item.id
                    ? "bg-white dark:bg-gray-900 text-sky-600 dark:text-sky-400 shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:bg-white/60 dark:hover:bg-gray-900/60"
                )}
              >
                {item.icon}
                {item.label}
              </button>
              {item.children && activeNav === item.id && (
                <div className="ml-4 mt-0.5 space-y-0.5">
                  {item.children.map(child => (
                    <button key={child.id} className="flex items-center gap-2 w-full px-3 py-1.5 rounded-lg text-xs text-gray-500 dark:text-gray-400 hover:bg-white/60 dark:hover:bg-gray-900/60 transition-all">
                      {child.icon}
                      {child.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="mt-4 border-t border-gray-200 dark:border-gray-800 pt-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-1">General</p>
            <button className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-sm text-gray-500 hover:bg-white/60 dark:hover:bg-gray-900/60 transition-all">
              <Settings className="w-4 h-4" /> Settings
            </button>
            <button className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-sm text-gray-500 hover:bg-white/60 dark:hover:bg-gray-900/60 transition-all">
              <BookOpen className="w-4 h-4" /> Support
            </button>
          </div>

          <div className="mt-auto pt-6">
            <BackButton to="/dashboard" />
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main className="flex-1 min-w-0">

          {/* Top bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3 lg:hidden">
              <BackButton to="/dashboard" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">My Journal</h1>
              <p className="text-sm text-gray-400 mt-0.5">Let's get started — take the first step towards your story.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search or type command"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-9 h-9 w-52 text-sm bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 rounded-full shadow-sm"
                />
              </div>
              <Button
                onClick={() => setShowNewEntry(true)}
                className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl px-4 h-9 text-sm font-semibold shadow-sm shadow-sky-200 dark:shadow-sky-900/30 transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                New Entry
              </Button>
              <button className="p-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-gray-800 shadow-sm">
                <Bell className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Templates row (like DoDo) */}
          <div className="mb-6">
            <h2 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Templates</h2>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
              {templates.map((t, i) => (
                <button
                  key={i}
                  onClick={() => setShowNewEntry(true)}
                  className={cn(
                    "flex-shrink-0 flex items-start gap-3 p-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:shadow-md transition-all active:scale-95 w-40 text-left",
                    "hover:-translate-y-0.5"
                  )}
                >
                  <div className={cn("p-2 rounded-xl flex-shrink-0", t.bg)}>{t.icon}</div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-200 truncate">{t.label}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-2 leading-snug">{t.sub}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* My Drafts heading */}
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-gray-700 dark:text-gray-300">My drafts</h2>
            <span className="text-xs text-gray-400">{filteredEntries.length} entries</span>
          </div>

          {/* Masonry grid (exact DoDo style) */}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
            {filteredEntries.map((entry, index) => {
              const isLong = entry.content.length > 100;
              const tColor = tagColors[entry.tag] || tagColors["Article"];
              const isHighlighted = index === 0 || index === 4;

              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06, duration: 0.35 }}
                  className={cn(
                    "break-inside-avoid mb-4 rounded-2xl border overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1",
                    entry.color,
                    isHighlighted ? "border-2" : "border"
                  )}
                  style={{ borderColor: isHighlighted ? undefined : "transparent" }}
                >
                  <div className="p-4">
                    {/* Tags row */}
                    <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                      <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", tColor)}>
                        {entry.tag}
                      </span>
                      {entry.category && (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/60 dark:bg-black/20 text-gray-500">
                          {entry.category}
                        </span>
                      )}
                      {isHighlighted && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-300">
                          Must read
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 leading-snug mb-2">
                      {entry.title}
                    </h3>

                    {/* Content */}
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-3">
                      {isLong ? `${entry.content.substring(0, 110)}…` : entry.content}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-gray-400">{format(entry.date, "MMM d, yyyy")}</span>
                      <button className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded-lg bg-white/80 dark:bg-gray-800/80 flex items-center justify-center text-gray-500 hover:text-gray-800 shadow-sm transition-all">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Bottom accent line */}
                  <div className={cn("h-1 w-full", entry.accentColor, "opacity-50")} />
                </motion.div>
              );
            })}

            {/* New Entry CTA card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: filteredEntries.length * 0.06 }}
              onClick={() => setShowNewEntry(true)}
              className="break-inside-avoid mb-4 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 p-6 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/10 transition-all group min-h-[120px]"
            >
              <div className="w-10 h-10 rounded-2xl bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Plus className="w-5 h-5 text-sky-500" />
              </div>
              <p className="text-xs font-semibold text-gray-400 group-hover:text-sky-500 transition-colors">New entry</p>
            </motion.div>
          </div>

          {filteredEntries.length === 0 && searchTerm && (
            <div className="text-center py-16 text-gray-400">
              <Search className="w-8 h-8 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No entries match "{searchTerm}"</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}