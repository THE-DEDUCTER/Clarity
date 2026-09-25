"use client";

import React from 'react';
import { PetCareDashboard } from '@/components/petcare-game';

export default function PetCareGamePage() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-background via-background/95 to-muted/20 px-4 sm:px-6 py-6 pb-24">
      <PetCareDashboard />
    </div>
  );
}