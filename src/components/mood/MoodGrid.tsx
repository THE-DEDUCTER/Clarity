"use client";

import { Quadrant } from "@/lib/mood-data";
import { AppleWatchMoodField } from "./AppleWatchMoodField";

interface MoodGridProps {
  initialQuadrant: Quadrant;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onBack: () => void;
}

export function MoodGrid({ initialQuadrant, selectedId, onSelect, onBack }: MoodGridProps) {
  return (
    <AppleWatchMoodField
      initialQuadrant={initialQuadrant}
      selectedId={selectedId}
      onSelect={onSelect}
      onBack={onBack}
    />
  );
}
