"use client";

import MentalHealthAssessment from "@/components/mental-health-assessment";
import { BackButton } from "@/components/ui/back-button";
import { Brain, ShieldCheck } from "lucide-react";

export default function AssessmentPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 animate-in fade-in duration-500" data-testid="page-assessment">
      <div className="flex items-center justify-between">
        <BackButton to="/dashboard" />
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-semibold border border-purple-200 dark:border-purple-800">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Clinically Validated (PHQ-9 & GAD-7)</span>
        </div>
      </div>

      <MentalHealthAssessment />
    </div>
  );
}