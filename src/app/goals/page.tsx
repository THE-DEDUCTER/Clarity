"use client";

import { GoalTracker } from "@/components/goal-tracker";
import { BackButton } from "@/components/ui/back-button";

export default function GoalsPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 animate-in fade-in duration-500" data-testid="page-goals">
      <BackButton to="/dashboard" />
      <GoalTracker />
    </div>
  );
}