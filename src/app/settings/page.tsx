"use client";

import { AccessibilityControls } from "@/components/accessibility-controls";
import { ThemeToggle } from "@/components/theme-toggle";
import { BackButton } from "@/components/ui/back-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Palette, Eye } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 animate-in fade-in duration-500" data-testid="page-settings">
      <BackButton to="/dashboard" />
      
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-slate-500/10 via-indigo-500/10 to-purple-500/10 rounded-[32px] p-6 sm:p-8 border border-slate-200/50 dark:border-slate-800/40">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold">
            <Settings className="w-3.5 h-3.5" />
            <span>Preferences & Accessibility</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground dark:text-gray-100">
            Platform Settings
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground dark:text-gray-300">
            Customize your visual comfort, accessibility aids, data privacy, and notification preferences.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Theme Settings */}
        <Card className="rounded-[28px] border border-sky-100 dark:border-sky-900/40 shadow-lg bg-gradient-to-br from-sky-400/10 via-blue-400/10 to-cyan-400/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-sky-400 to-blue-500 rounded-xl shadow-md">
                <Palette className="w-5 h-5 text-white" />
              </div>
              <span className="text-foreground dark:text-gray-100 font-bold">Appearance</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground dark:text-gray-100">Theme Mode</p>
                <p className="text-sm text-muted-foreground">
                  Switch between light and dark mode
                </p>
              </div>
              <ThemeToggle />
            </div>
          </CardContent>
        </Card>

        {/* General Settings */}
        <Card className="rounded-[28px] border border-violet-100 dark:border-violet-900/40 shadow-lg bg-gradient-to-br from-violet-400/10 via-purple-400/10 to-indigo-400/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-violet-400 to-purple-500 rounded-xl shadow-md">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <span className="text-foreground dark:text-gray-100 font-bold">Privacy & Security</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-medium text-foreground dark:text-gray-100">Zero-Trace Data Storage</p>
              <p className="text-sm text-muted-foreground">
                Your personal journal entries and mood logs are strictly encrypted and stored with utmost confidentiality.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Accessibility Controls */}
      <AccessibilityControls />
    </div>
  );
}