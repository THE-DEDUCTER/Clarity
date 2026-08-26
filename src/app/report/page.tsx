"use client";

import { AntiRaggingSystem } from "@/components/anti-ragging-system";
import { BackButton } from "@/components/ui/back-button";

export default function ReportPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 animate-in fade-in duration-500" data-testid="page-report">
      <BackButton to="/dashboard" />
      <AntiRaggingSystem />
    </div>
  );
}