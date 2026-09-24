"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, RotateCcw, Home, Phone } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface the error for observability without leaking it to the UI.
    console.error("Unhandled app error:", error);
  }, [error]);

  return (
    <div
      className="min-h-[60vh] w-full flex items-center justify-center bg-background p-4"
      role="alert"
      aria-live="assertive"
    >
      <Card className="w-full max-w-md">
        <CardContent className="pt-6 pb-8 px-6 text-center space-y-5">
          <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-950/50 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-7 h-7 text-red-600 dark:text-red-400" aria-hidden="true" />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-bold text-foreground">Something went wrong</h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              An unexpected error interrupted this page. Your data is safe — nothing you saved has been lost.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Button onClick={reset} className="min-h-[44px]">
              <RotateCcw className="w-4 h-4 mr-2" aria-hidden="true" />
              Try again
            </Button>
            <Button variant="outline" asChild className="min-h-[44px]">
              <Link href="/dashboard">
                <Home className="w-4 h-4 mr-2" aria-hidden="true" />
                Go to Dashboard
              </Link>
            </Button>
          </div>
          <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <span>In crisis? </span>
            <Link
              href="/crisis"
              className="inline-flex items-center gap-1 font-semibold text-rose-600 dark:text-rose-400 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
            >
              <Phone className="w-3.5 h-3.5" aria-hidden="true" />
              Crisis Support
            </Link>
          </p>
          {error?.digest && (
            <p className="text-[11px] text-muted-foreground/70">
              Error reference: {error.digest}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
