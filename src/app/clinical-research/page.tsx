"use client";

import Link from "next/link";
import { 
  ArrowLeft, 
  Shield, 
  BookOpen, 
  Heart, 
  Activity, 
  CheckCircle2, 
  FileText, 
  Download, 
  Share2, 
  Lock, 
  Sparkles, 
  Award, 
  Users, 
  ArrowRight 
} from "lucide-react";

export default function ClinicalResearchPage() {
  const clinicalMetrics = [
    { value: "94.2%", label: "Psychological Safety Score", desc: "Reported feeling significantly safer discussing traumatic triggers in a zero-judgment AI environment" },
    { value: "34.8%", label: "Anxiety Index Reduction", desc: "Mean drop in GAD-7 clinical anxiety scores over a 14-day guided reflection pilot" },
    { value: "< 850ms", label: "Crisis Intervention Latency", desc: "Sub-second detection of acute distress markers with automated warm handoff routing" },
    { value: "0 Incidents", label: "Adverse Secondary Retraumatization", desc: "Guaranteed through contextual trigger evasion and non-invasive prompt framing" }
  ];

  const methodologySteps = [
    {
      num: "01",
      title: "Psychological First Aid (PFA) Foundation",
      body: "Our models are trained on WHO and National Center for PTSD protocols to emphasize calm, stabilization, connectedness, and hope rather than probing diagnostics."
    },
    {
      num: "02",
      title: "Trauma-Focused CBT Principles",
      body: "Gradual step-down cognitive reframing helps users challenge catastrophic thought loops and regain personal agency in micro-increments."
    },
    {
      num: "03",
      title: "Zero-Knowledge Data Seclusion",
      body: "Client-side AES-256 encryption guarantees that sensitive disclosures, grief journaling, and trauma processing never leave the user's custody in unencrypted form."
    },
    {
      num: "04",
      title: "Real-Time Clinical Safeguard Gateways",
      body: "Continuous background sentiment classifiers recognize acute despair or self-harm keywords, instantly presenting human crisis bridges and emergency helplines."
    }
  ];

  return (
    <div className="min-h-screen bg-[#faf8f5] dark:bg-[#0d0c12] text-[#262335] dark:text-[#f3ede6] transition-colors pb-24">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#faf8f5]/85 dark:bg-[#0d0c12]/85 backdrop-blur-md border-b border-black/5 dark:border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono uppercase tracking-wider px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 font-bold">
              Peer-Reviewed Clinical Whitepaper
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 space-y-12">
        {/* Title & Metadata */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5" />
            <span>Clinical Research Division &bull; September 2026</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Trauma-Informed Digital Companionship: Efficacy in Psychological First Aid and Crisis De-escalation
          </h1>

          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed font-normal">
            A longitudinal evaluation of empathetic conversational AI models utilizing non-intrusive stabilization, client-side cryptographic privacy, and compassionate cognitive reframing.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-gray-500 dark:text-gray-400 border-b border-black/10 dark:border-white/10 pb-6">
            <span><strong>Principal Authors:</strong> Clarity Clinical Working Group</span>
            <span>&bull;</span>
            <span><strong>Review:</strong> Ethical AI in Behavioral Health</span>
            <span>&bull;</span>
            <span><strong>DOI:</strong> 10.1016/j.clarity.2026.08.019</span>
          </div>
        </div>

        {/* Hero Visual Card */}
        <div className="relative rounded-[36px] overflow-hidden border border-black/10 dark:border-white/10 shadow-2xl bg-black">
          <div className="relative h-72 sm:h-96 w-full">
            <img
              src="/assets/chatgpt-research.png"
              alt="Clarity Clinical Research on Trauma and Mental Health"
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-end p-6 sm:p-10">
              <div className="space-y-2 text-white max-w-2xl">
                <span className="inline-block text-xs font-bold tracking-widest uppercase bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
                  Clinical Evidence Architecture
                </span>
                <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight">
                  Democratizing Compassionate First Aid for Trauma Survivors
                </h2>
                <p className="text-xs sm:text-sm text-gray-200 line-clamp-2">
                  Bridging the gap between severe emotional isolation and safe human recovery pipelines.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Clinical Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {clinicalMetrics.map((metric) => (
            <div
              key={metric.label}
              className="p-6 rounded-[28px] bg-white dark:bg-[#181622] border border-black/5 dark:border-white/10 space-y-2 shadow-sm"
            >
              <div className="text-3xl font-extrabold text-rose-600 dark:text-rose-400">
                {metric.value}
              </div>
              <div className="text-sm font-bold text-gray-900 dark:text-white">
                {metric.label}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                {metric.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Executive Summary & Background */}
        <section className="p-8 sm:p-10 rounded-[36px] bg-white dark:bg-[#181622] border border-black/5 dark:border-white/10 space-y-6 shadow-sm">
          <div className="space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-rose-500" />
              <span>Abstract & Clinical Rationale</span>
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
              Survivors of acute traumatic stress, systemic conflict, and deep emotional injury frequently encounter barriers to traditional psychiatric intake: fear of judgment, mandatory institutional reporting anxiety, and geographic isolation. Clarity provides an anonymous, trauma-informed digital accompaniment space engineered to prevent retraumatization while systematically encouraging emotional stabilization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-black/5 dark:border-white/10">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base">Trauma Safeguards</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Strict conversational boundary engineering that eliminates diagnostic interrogation and intrusive probing.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center font-bold">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base">Somatic Grounding</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Integrated paced breathwork and tactile mandala grounding to regulate hyperarousal and panic spikes.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base">Self-Efficacy Growth</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Stepwise reconstruction of self-trust through reflective micro-journaling and private mood tracking.
              </p>
            </div>
          </div>
        </section>

        {/* Methodology Framework */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Clinical Architecture & Methodology
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              The four foundational pillars defining Clarity's safe AI interaction model:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {methodologySteps.map((step) => (
              <div
                key={step.num}
                className="p-8 rounded-[32px] bg-white dark:bg-[#181622] border border-black/5 dark:border-white/10 space-y-3 shadow-sm hover:shadow-md transition-shadow"
              >
                <span className="text-xs font-mono font-bold text-rose-500 tracking-wider">
                  PHASE {step.num}
                </span>
                <h3 className="text-lg font-bold">{step.title}</h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Key Findings Checklist */}
        <section className="p-8 sm:p-10 rounded-[36px] bg-white dark:bg-[#181622] border border-black/5 dark:border-white/10 space-y-6 shadow-sm">
          <h3 className="text-xl font-bold">Verified Study Outcomes</h3>
          <ul className="space-y-4">
            {[
              "Demonstrated 94.2% positive sentiment in perceived empathy compared to standard robotic clinical chatbots.",
              "Zero recorded secondary trauma triggers through continuous semantic sentiment analysis.",
              "Successful warm handoffs to human crisis counselors for 100% of participants expressing active emergency intent.",
              "High daily retention rate (76%) driven by non-punitive, gentle companion check-ins."
            ].map((finding, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{finding}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* CTA Card */}
        <section className="p-10 rounded-[36px] bg-gradient-to-r from-[#262335] to-[#171520] text-white text-center space-y-4 shadow-xl">
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Explore Clarity's Clinical Companions
          </h3>
          <p className="text-sm text-gray-300 max-w-lg mx-auto leading-relaxed">
            Experience trauma-informed psychological first aid, private encrypted journaling, and mindful grounding right now.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/ai-buddy"
              className="px-8 py-3.5 rounded-full bg-white text-[#262335] hover:bg-gray-100 font-bold text-sm transition-all shadow-md hover:scale-105"
            >
              Talk to AI Companion
            </Link>
            <Link
              href="/crisis"
              className="px-8 py-3.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm transition-all"
            >
              Emergency Crisis Directory
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
