"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Compass, Home, Phone } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] w-full flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6 pb-8 px-6 text-center space-y-5">
          <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mx-auto">
            <Compass className="w-7 h-7 text-muted-foreground" aria-hidden="true" />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-bold text-foreground">Page not found</h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We couldn&apos;t find that page. It may have been moved, or the link may be out of date.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Button asChild className="min-h-[44px]">
              <Link href="/dashboard">
                <Home className="w-4 h-4 mr-2" aria-hidden="true" />
                Go to Dashboard
              </Link>
            </Button>
            <Button variant="outline" asChild className="min-h-[44px]">
              <Link href="/resources">
                <Compass className="w-4 h-4 mr-2" aria-hidden="true" />
                Browse Resources
              </Link>
            </Button>
          </div>
          <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <span>Need support right now? </span>
            <Link
              href="/crisis"
              className="inline-flex items-center gap-1 font-semibold text-rose-600 dark:text-rose-400 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
            >
              <Phone className="w-3.5 h-3.5" aria-hidden="true" />
              Crisis Support
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
