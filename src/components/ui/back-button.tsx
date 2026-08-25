"use client";

import React from 'react';
import { useRouter } from "next/navigation";
import { Button } from '@/components/ui/button';

interface BackButtonProps {
  to?: string;
  className?: string;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const BackButton: React.FC<BackButtonProps> = ({ 
  to, 
  className = '',
  variant = 'ghost',
  size = 'sm'
}) => {
  const router = useRouter();

  const handleBack = () => {
    if (to) {
      router.push(to);
    } else {
      // Go back in history or to dashboard as fallback
      if (window.history.length > 1) {
        window.history.back();
      } else {
        router.push('/dashboard');
      }
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleBack}
      className={`flex items-center gap-2 mb-4 ${className}`}
    >
      <i className="fi fi-rr-arrow-small-left text-lg" />
      <span>Back</span>
    </Button>
  );
};