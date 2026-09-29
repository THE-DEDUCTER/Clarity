"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Heart, 
  MessageCircle, 
  Lock, 
  Activity, 
  CheckCircle2, 
  BookOpen, 
  Newspaper, 
  Palette, 
  Brain, 
  PhoneCall, 
  Flame,
  ChevronRight,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MoodTracker } from "@/components/mood-tracker";

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [showMoodPicker, setShowMoodPicker] = useState(false);

  const companions = [
    {
      name: "Alex",
      role: "Wellness & Grounding Coach",
      quote: "Take a gentle breath. Let's find balance in this moment together.",
      color: "from-emerald-500/20 to-teal-500/10",
      accent: "text-emerald-700 dark:text-emerald-300",
      border: "border-emerald-500/30",
      tag: "Grounding & Mindfulness",
      icon: Heart,
      image: "/assets/companion-alex.jpg"
    },
    {
      name: "Maya",
      role: "Motivational & Energy Buddy",
      quote: "Every step forward counts! You have so much strength in you — let's tackle this goal.",
      color: "from-amber-500/20 to-orange-500/10",
      accent: "text-amber-700 dark:text-amber-300",
      border: "border-amber-500/30",
      tag: "Motivation & Momentum",
      icon: Flame,
      image: "/assets/companion-maya.jpg"
    },
    {
      name: "Sage",
      role: "Analytical & Clarity Guide",
      quote: "Let's break down what's overwhelming you into manageable, actionable pieces.",
      color: "from-purple-500/20 to-indigo-500/10",
      accent: "text-purple-700 dark:text-purple-300",
      border: "border-purple-500/30",
      tag: "Problem Solving & Structure",
      icon: Brain,
      image: "/assets/companion-sage.jpg"
    },
    {
      name: "Luna",
      role: "Nighttime & Rest Companion",
      quote: "Let the events of the day drift away. You are safe, and your mind is allowed to rest.",
      color: "from-blue-500/20 to-sky-500/10",
      accent: "text-blue-700 dark:text-blue-300",
      border: "border-blue-500/30",
      tag: "Sleep & Wind-Down",
      icon: Activity,
      image: "/assets/companion-luna.jpg"
    }
  ];

  const features = [
    {
      icon: MessageCircle,
      title: "Empathetic AI Companions",
      description: "Available 24/7 with zero waiting lists. Grounded in Psychological First Aid and cognitive reframing.",
      tag: "Clinical Companion",
      image: "/assets/companions-preview.jpg"
    },
    {
      icon: Lock,
      title: "Strict Zero-Knowledge Privacy",
      description: "End-to-end client encrypted reflections. No telemetry monetization, no ads, and total confidentiality.",
      tag: "Uncompromised Safety",
      image: "/assets/news-privacy-vault.jpg"
    },
    {
      icon: Activity,
      title: "Interactive Mood & Growth Tracking",
      description: "Understand patterns in emotional regulation, distress triggers, and positive streak momentum.",
      tag: "Longitudinal Insight",
      image: "/assets/news-anxiety-study.jpg"
    },
    {
      icon: Palette,
      title: "Creative Somatic Expression",
      description: "Tactile chakra art therapy and freeform coloring designed to regulate sympathetic nervous system overload.",
      tag: "Somatic Art Suite",
      image: "/assets/feature-art-therapy.jpg"
    },
    {
      icon: BookOpen,
      title: "Peer-Reviewed Clinical Frameworks",
      description: "Developed alongside trauma-informed clinical research standards and evidence-based CBT models.",
      tag: "Evidence-Based",
      image: "/assets/news-clinical-ai.jpg"
    },
    {
      icon: PhoneCall,
      title: "Emergency Crisis De-escalation",
      description: "Direct bridges and warm handoffs to verified human crisis lifelines whenever acute danger is signaled.",
      tag: "Safety First",
      image: "/assets/news-crisis-lifeline.jpg"
    }
  ];

  return (
    <div className="min-h-screen bg-[#faf8f5] dark:bg-[#0d0c12] text-[#262335] dark:text-[#f3ede6] selection:bg-rose-500/20 font-sans transition-colors">
      
      {/* Top Enterprise Navigation */}
      <header className="sticky top-0 z-40 bg-[#faf8f5]/80 dark:bg-[#0d0c12]/80 backdrop-blur-xl border-b border-black/5 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <img 
              src="/assets/clarity-logo.png" 
              alt="Clarity Logo" 
              className="h-8 w-auto sm:h-9 object-contain rounded-lg transition-transform group-hover:scale-105" 
            />
            <span className="font-extrabold text-2xl tracking-tight text-[#262335] dark:text-white">
              Clarity
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600 dark:text-gray-300">
            <Link href="/research" className="hover:text-black dark:hover:text-white transition-colors">
              Clinical Research
            </Link>
            <Link href="/news" className="hover:text-black dark:hover:text-white transition-colors">
              News & Studies
            </Link>
            <Link href="/crisis" className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors flex items-center gap-1.5 font-semibold">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              Crisis Helpline
            </Link>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <Link
              href={isAuthenticated ? "/dashboard" : "/login"}
              className="px-5 py-2.5 rounded-full text-sm font-semibold border border-black/10 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/10 transition-all text-[#262335] dark:text-white"
            >
              Sign In
            </Link>
            <Link
              href={isAuthenticated ? "/dashboard" : "/login"}
              className="px-6 py-2.5 rounded-full text-sm font-semibold bg-[#262335] text-white hover:bg-black dark:bg-white dark:text-[#262335] dark:hover:bg-gray-100 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-gradient-to-tr from-purple-400/15 via-rose-300/15 to-emerald-300/10 blur-3xl pointer-events-none -z-10 rounded-full" />
        
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10 text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 backdrop-blur-md">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Trauma-Informed &bull; Private &bull; 24/7 Available</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.08] text-[#262335] dark:text-white">
            Compassionate AI designed for real mental wellness.
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed font-normal max-w-2xl mx-auto">
            A safe, zero-judgment digital sanctuary anchored in evidence-based Psychological First Aid. Receive instant emotional support, reflective journaling, and somatic mindfulness.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => router.push(isAuthenticated ? "/dashboard" : "/login")}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#262335] text-white hover:bg-black dark:bg-white dark:text-[#262335] dark:hover:bg-gray-100 font-bold text-base transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-2 group"
            >
              <span>Begin Your Journey</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => setShowMoodPicker(true)}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white dark:bg-[#1a1824] border border-black/10 dark:border-white/15 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#232030] font-semibold text-base transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-rose-500" />
              <span>Log Quick Mood</span>
            </button>
          </div>

          {/* Trust badges */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> AES-256 Client Encrypted
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Zero Telemetry Resale
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Sub-Second AI Response
            </span>
          </div>
        </div>
      </section>

      {/* Interactive AI Companions Showcase with Real Visual Portraits */}
      <section className="py-16 md:py-24 bg-white/60 dark:bg-[#121118]/60 border-y border-black/5 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-rose-600 dark:text-rose-400">
              Personalized Support
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Choose the companion that fits your present state.
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
              Everyone experiences distress differently. Clarity provides specialized empathetic personalities adapted to grounding, motivation, analytical problem-solving, or peaceful rest.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {companions.map((comp) => {
              const CompIcon = comp.icon;
              return (
                <div
                  key={comp.name}
                  onClick={() => router.push("/ai-buddy")}
                  className={`rounded-[32px] overflow-hidden border ${comp.border} bg-white dark:bg-[#181622] backdrop-blur-md cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl flex flex-col justify-between group`}
                >
                  <div className="relative h-48 w-full overflow-hidden">
                    <img 
                      src={comp.image} 
                      alt={comp.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
                      <div className="text-white">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md">
                          {comp.tag}
                        </span>
                        <h3 className="text-xl font-bold mt-1">{comp.name}</h3>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-xs font-semibold text-rose-500 uppercase tracking-wider">
                        {comp.role}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-300 mt-2 leading-relaxed italic">
                        "{comp.quote}"
                      </p>
                    </div>

                    <div className="pt-3 border-t border-black/5 dark:border-white/10 flex items-center justify-between text-xs font-bold text-gray-900 dark:text-white group-hover:translate-x-1 transition-transform">
                      <span>Talk with {comp.name}</span>
                      <ChevronRight className="w-4 h-4 text-rose-500" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Clinical Research Spotlight */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[40px] overflow-hidden border border-black/10 dark:border-white/10 shadow-2xl bg-gradient-to-br from-black/5 to-black/10 dark:from-white/5 dark:to-transparent">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center p-8 sm:p-14">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-xs font-bold uppercase tracking-wider">
                <BookOpen className="w-4 h-4" />
                Clinical Whitepaper
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                Healing from Severe Trauma & Conflict
              </h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                Survivors of interpersonal violence, systemic conflict, and severe acute distress often struggle with traditional therapeutic intake. Clarity delivers anonymous, trauma-informed digital first aid anchored in clinical safeguards.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-white/70 dark:bg-black/30 border border-black/5 dark:border-white/10">
                  <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">94%</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Reported reduced isolation in zero-judgment sanctuary</div>
                </div>
                <div className="p-4 rounded-2xl bg-white/70 dark:bg-black/30 border border-black/5 dark:border-white/10">
                  <div className="text-3xl font-extrabold text-rose-600 dark:text-rose-400">Sub-Sec</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Automated crisis detection & trigger evasion</div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/research"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#262335] text-white hover:bg-black dark:bg-white dark:text-[#262335] font-semibold text-sm transition-all shadow-md"
                >
                  <span>Read Full Clinical Research</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-black/10 dark:border-white/15 h-80 sm:h-96">
              <img
                src="/assets/chatgpt-research.png"
                alt="Clarity Clinical Research"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6">
                <span className="text-xs text-white/90 font-medium">
                  Evidence-based psychological first aid architecture &bull; Clarity Clinical Division
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid with Real Dedicated Visual Boxes */}
      <section className="py-20 bg-white/50 dark:bg-[#121118]/50 border-t border-black/5 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              Enterprise Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Built for trust, speed, and real emotional recovery.
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
              A holistic ecosystem connecting clinical evidence, emotional grounding, private journaling, and human safety nets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className="rounded-[32px] overflow-hidden bg-white dark:bg-[#181622] border border-black/5 dark:border-white/10 shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between"
                >
                  <div className="relative h-48 w-full overflow-hidden bg-black/5 dark:bg-white/5">
                    <img
                      src={feat.image}
                      alt={feat.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-black/75 text-white backdrop-blur-sm">
                        {feat.tag}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-2.5">
                    <div className="flex items-center gap-2 text-rose-500 font-bold text-sm">
                      <Icon className="w-4 h-4" />
                      <span>{feat.title}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {feat.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Latest Press & News Section with Visual Cards */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-rose-600 dark:text-rose-400">
              Newsroom
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Updates & Clinical Research
            </h2>
          </div>
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-sm font-bold text-rose-600 hover:text-rose-700 transition-colors"
          >
            <span>View All News & Studies</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/news" className="group rounded-[32px] overflow-hidden bg-white dark:bg-[#181622] border border-black/5 dark:border-white/10 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between">
            <div className="h-48 w-full overflow-hidden">
              <img src="/assets/news-clinical-ai.jpg" alt="Clinical AI" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-6 space-y-2">
              <span className="text-xs font-bold text-rose-500">Clinical AI &bull; Breakthrough</span>
              <h4 className="font-bold text-base leading-snug group-hover:text-rose-600 transition-colors">
                Breakthrough in Emotion-Responsive AI for Crisis Prevention
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                New multi-modal benchmarks achieve 42% faster response times in detecting acute psychological distress.
              </p>
            </div>
          </Link>

          <Link href="/news" className="group rounded-[32px] overflow-hidden bg-white dark:bg-[#181622] border border-black/5 dark:border-white/10 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between">
            <div className="h-48 w-full overflow-hidden">
              <img src="/assets/somatic-mandala.jpg" alt="Art Therapy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-6 space-y-2">
              <span className="text-xs font-bold text-purple-500">Product Updates &bull; Art Therapy</span>
              <h4 className="font-bold text-base leading-snug group-hover:text-purple-600 transition-colors">
                Chakra Art Therapy & Creative Expression Suite
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                Merging ancient mindfulness concepts with digital tactile coloring to help users process complex emotions beyond words.
              </p>
            </div>
          </Link>

          <Link href="/news" className="group rounded-[32px] overflow-hidden bg-white dark:bg-[#181622] border border-black/5 dark:border-white/10 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between">
            <div className="h-48 w-full overflow-hidden">
              <img src="/assets/news-privacy-vault.jpg" alt="Privacy Vault" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-6 space-y-2">
              <span className="text-xs font-bold text-emerald-500">Privacy &bull; Trust Architecture</span>
              <h4 className="font-bold text-base leading-snug group-hover:text-emerald-600 transition-colors">
                Zero-Knowledge Privacy: How Clarity Protects Your Data
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                A detailed look into our client-side encryption protocols that keep your innermost thoughts strictly yours.
              </p>
            </div>
          </Link>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-10 sm:p-16 rounded-[40px] bg-gradient-to-r from-[#262335] to-[#171520] text-white text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Begin your path to calm and clarity today.
            </h2>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
              No judgment. No wait times. Experience compassionate support tailored to your unique emotional needs.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => router.push(isAuthenticated ? "/dashboard" : "/login")}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white text-[#262335] hover:bg-gray-100 font-bold text-sm transition-all shadow-lg hover:scale-105"
              >
                Get Started for Free
              </button>
              <Link
                href="/crisis"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-rose-600/80 hover:bg-rose-600 text-white font-semibold text-sm transition-all"
              >
                Immediate Crisis Help
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise Footer */}
      <footer className="border-t border-black/10 dark:border-white/10 py-12 px-4 sm:px-6 lg:px-8 bg-[#faf8f5] dark:bg-[#0d0c12]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-3">
            <img src="/assets/clarity-logo.png" alt="Clarity" className="h-6 w-auto" />
            <span className="font-semibold text-sm text-gray-800 dark:text-gray-200">Clarity Mental Health AI</span>
            <span>&bull; &copy; 2026 Clarity Inc.</span>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <Link href="/research" className="hover:text-black dark:hover:text-white transition-colors">Clinical Research</Link>
            <Link href="/news" className="hover:text-black dark:hover:text-white transition-colors">Newsroom</Link>
            <Link href="/crisis" className="hover:text-rose-500 font-bold transition-colors">Crisis SOS</Link>
            <Link href="/dashboard" className="hover:text-black dark:hover:text-white transition-colors">Dashboard</Link>
          </div>
        </div>
      </footer>

      {/* Floating Mood Picker Button */}
      <button 
        onClick={() => setShowMoodPicker(true)}
        className="fixed bottom-6 right-6 z-40 bg-[#262335] dark:bg-white text-white dark:text-[#262335] px-6 py-3.5 rounded-full font-bold text-xs sm:text-sm shadow-2xl hover:scale-105 transition-all flex items-center gap-2 border border-black/10 dark:border-white/20"
      >
        <Sparkles className="w-4 h-4 text-rose-500" />
        How are you feeling?
      </button>

      {/* Mood Picker Modal */}
      <AnimatePresence>
        {showMoodPicker && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-background w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden relative"
            >
              <button 
                onClick={() => setShowMoodPicker(false)} 
                className="absolute top-4 right-4 z-50 text-muted-foreground hover:text-foreground bg-black/10 hover:bg-black/20 p-2 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="w-full flex justify-center bg-card p-6">
                <MoodTracker onMoodLogged={() => router.push('/ai-buddy')} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}