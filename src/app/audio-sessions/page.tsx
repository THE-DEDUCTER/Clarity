"use client";

import { AudioSessions } from "@/components/audio-sessions";
import { BackButton } from "@/components/ui/back-button";

export default function AudioSessionsPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 animate-in fade-in duration-500" data-testid="page-audio-sessions">
      <BackButton to="/dashboard" />
      <AudioSessions />
    </div>
  );
}