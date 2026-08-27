"use client";

import React from 'react';
import { BackButton } from '@/components/ui/back-button';
import { VirtualPets } from '@/components/3d/virtual-pets';

export default function PetCareGamePage() {
  return (
    <div className="relative w-full" style={{ height: 'calc(100vh - 0px)' }}>
      {/* Back button floats over the game */}
      <div className="absolute top-3 left-3 z-50">
        <BackButton to="/games" />
      </div>
      <VirtualPets fullPage />
    </div>
  );
}