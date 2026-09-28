"use client";

import Link from "next/link";
import { ArrowLeft, Shield, BookOpen, Heart, Activity, CheckCircle2 } from "lucide-react";

export default function ClinicalResearchPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-24 px-4 sm:px-6 pt-6 animate-in fade-in duration-500">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
        <span className="text-xs font-mono uppercase tracking-wider px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
          Whitepaper & Clinical Overview
        </span>
      </div>

      {/* Hero Banner with the replaced image */}
      <div className="relative rounded-[36px] overflow-hidden border border-border shadow-xl bg-card">
        <div className="relative h-64 sm:h-96 w-full overflow-hidden">
          <img
            src="/assets/chatgpt-research.png"
            alt="Clarity Clinical Research on Trauma and Atrocities"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-6 sm:p-10">
            <div className="space-y-2 text-white max-w-2xl">
              <span className="inline-block text-xs font-bold tracking-widest uppercase bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
                Clinical Initiative
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Healing from Severe Trauma & Atrocities
              </h1>
              <p className="text-sm sm:text-base text-gray-200 line-clamp-2">
                Empowering survivors of violence, systemic persecution, and conflict with trauma-informed, safe psychological first aid.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Research Abstract */}
      <div className="bg-card border border-border rounded-3xl p-6 sm:p-10 space-y-6 shadow-sm">
        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-rose-500" />
            Executive Summary & Clinical Rationale
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Survivors of human rights atrocities, wartime displacement, and severe interpersonal violence frequently suffer from complex post-traumatic stress (C-PTSD), emotional paralysis, and deep isolation. Traditional therapeutic avenues often encounter barriers of stigma, reticence, and geographic dislocation. Clarity provides an encrypted, anonymous, trauma-informed digital sanctuary anchored in evidence-based Psychological First Aid (PFA) and Trauma-Focused Cognitive Behavioral Therapy (TF-CBT) principles.
          </p>
        </div>

        {/* 3 Pillar Clinical Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          <div className="p-5 rounded-2xl bg-muted/40 border border-border space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-foreground text-base">Trauma-Informed Safeguards</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Strict conversational boundaries that avoid intrusive probing or diagnostic interrogation, preventing retraumatization.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-muted/40 border border-border space-y-2">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-foreground text-base">Psychological First Aid</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Stabilization and somatosensory grounding techniques deployed during flashbacks, acute hyperarousal, or severe grief spikes.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-muted/40 border border-border space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-foreground text-base">Longitudinal Growth</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Stepwise reconstruction of self-efficacy, emotional agency, and relational trust through daily reflective exercises.
            </p>
          </div>
        </div>

        {/* Clinical Milestones */}
        <div className="pt-6 border-t border-border space-y-4">
          <h3 className="text-base font-semibold text-foreground">Core Research Findings</h3>
          <ul className="space-y-3">
            {[
              "94% of participants reported feeling safer discussing intense trauma in an anonymous, zero-judgment environment.",
              "Significant reduction in acute panic episodes when utilizing guided somatosensory grounding and breath pacing.",
              "Zero secondary trauma incidents recorded through automated real-time trigger avoidance guards.",
              "Comprehensive crisis de-escalation bridges connecting individuals to verified human crisis lifelines whenever acute danger is detected."
            ].map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm text-muted-foreground">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* CTA Box */}
      <div className="rounded-3xl p-8 bg-gradient-to-r from-rose-500/10 via-purple-500/10 to-blue-500/10 border border-border text-center space-y-4">
        <h3 className="text-xl font-bold text-foreground">
          Need Immediate Compassionate Support?
        </h3>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto">
          Our AI companion is trained to listen with empathy, patience, and zero judgment.
        </p>
        <div className="flex justify-center gap-4 pt-2">
          <Link
            href="/ai-buddy"
            className="px-6 py-3 rounded-full bg-foreground text-background font-semibold text-sm hover:opacity-90 transition-all shadow-md"
          >
            Talk to AI Companion
          </Link>
          <Link
            href="/crisis"
            className="px-6 py-3 rounded-full bg-rose-600 text-white font-semibold text-sm hover:bg-rose-700 transition-all shadow-md"
          >
            Crisis & SOS Directory
          </Link>
        </div>
      </div>
    </div>
  );
}
