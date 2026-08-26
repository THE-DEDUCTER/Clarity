"use client";

import { CounselorConnect } from "@/components/counselor-connect";
import { BackButton } from "@/components/ui/back-button";
import { ShieldCheck, UserCheck, Sparkles } from "lucide-react";

export default function AnonymousChatPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500 pb-16" data-testid="page-anonymous-chat">
      <div className="flex items-center justify-between">
        <BackButton to="/dashboard" />
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold border border-emerald-200 dark:border-emerald-800">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>100% Confidential & Encrypted</span>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-teal-500/10 via-cyan-500/10 to-indigo-500/10 rounded-[32px] p-6 sm:p-8 border border-teal-200/50 dark:border-teal-800/40">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-200 text-xs font-bold">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Licensed Psychological Care</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Counselor Connect
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
            Connect with verified mental health counselors for professional 1-on-1 guidance, therapy sessions, and confidential support.
          </p>
        </div>
      </div>
      
      <CounselorConnect />
    </div>
  );
}