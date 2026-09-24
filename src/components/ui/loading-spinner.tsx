"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  /** Accessible label announced to screen readers. Defaults to "Loading". */
  label?: string;
  /** Pixel size of the spinner icon. */
  size?: number;
  className?: string;
  /** Optionally render helper text below the spinner. */
  text?: string;
}

/**
 * Single shared loading indicator so spinners look and behave identically
 * across the app (same icon, same theme token, same accessible labeling).
 */
export function LoadingSpinner({
  label = "Loading",
  size = 32,
  className,
  text,
}: LoadingSpinnerProps) {
  return (
    <div
      className={cn("flex flex-col items-center justify-center gap-3", className)}
      role="status"
      aria-live="polite"
    >
      <Loader2
        className="animate-spin text-primary"
        style={{ width: size, height: size }}
        aria-hidden="true"
      />
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
      <span className="sr-only">{label}</span>
    </div>
  );
}
