"use client";

import { CrisisSupport } from "@/components/crisis-support";
import { BackButton } from "@/components/ui/back-button";
import { PhoneCall, ShieldAlert, HeartHandshake } from "lucide-react";

export default function CrisisPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 animate-in fade-in duration-500" data-testid="page-crisis">
      <BackButton to="/dashboard" />
      
      {/* Emergency Hero Banner */}
      <div className="bg-gradient-to-r from-rose-500/15 via-red-500/10 to-orange-500/15 rounded-[32px] p-6 sm:p-8 border border-rose-200 dark:border-rose-900/50 relative overflow-hidden">
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 text-xs font-bold border border-rose-200 dark:border-rose-800">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>24/7 Rapid Emergency Response</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Immediate Crisis Support & Helplines
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
            You are never alone. If you are experiencing overwhelming feelings, distress, or need urgent help, reach out to these certified free helplines right now.
          </p>
        </div>
      </div>
      
      <CrisisSupport />
    </div>
  );
}