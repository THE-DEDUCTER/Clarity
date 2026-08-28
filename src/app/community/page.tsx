"use client";

import React from "react";
import Link from "next/link";
import { 
  Users2, 
  GraduationCap, 
  UserCheck, 
  MessageSquare, 
  ArrowUpRight, 
  Heart, 
  Sparkles,
  ShieldCheck,
  MessageCircle
} from "lucide-react";
import { BackButton } from "@/components/ui/back-button";

export default function CommunityPage() {
  const communityFeatures = [
    {
      title: "Peer Support",
      href: "/peer-support",
      icon: Users2,
      bg: "bg-[#EAC85A]",
      textColor: "text-amber-950",
      iconBg: "bg-black/10",
      arrowBg: "bg-black/10 group-hover:bg-black/15",
      description: "Connect with empathetic companions",
    },
    {
      title: "Clarity Connect",
      href: "/professional-community",
      icon: GraduationCap,
      bg: "bg-[#13B695]",
      textColor: "text-white",
      iconBg: "bg-white/20",
      arrowBg: "bg-white/20 group-hover:bg-white/30",
      description: "Professional wellness community",
    },
    {
      title: "Mentorship",
      href: "/mentorship",
      icon: UserCheck,
      bg: "bg-[#9B89F3]",
      textColor: "text-white",
      iconBg: "bg-white/20",
      arrowBg: "bg-white/20 group-hover:bg-white/30",
      description: "1-on-1 guidance and mentor pairing",
    },
    {
      title: "Anonymous Chat",
      href: "/anonymous-chat",
      icon: MessageSquare,
      bg: "bg-[#64A3E9]",
      textColor: "text-white",
      iconBg: "bg-white/20",
      arrowBg: "bg-white/20 group-hover:bg-white/30",
      description: "Confidential counselor connection",
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-6 sm:space-y-8 pb-20 animate-in fade-in duration-500">
      {/* Navigation */}
      <div>
        <BackButton to="/dashboard" />
      </div>

      {/* Hero Banner Section */}
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-indigo-500/10 border border-blue-500/15 p-6 sm:p-10 shadow-sm">
        {/* Subtle glow decoration */}
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/20 backdrop-blur-sm">
            <Users2 className="w-3.5 h-3.5" />
            <span>You&apos;re Not Alone</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-gray-50 tracking-tight">
            Community
          </h1>

          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
            Connect with empathetic peers, discover trusted mentors, consult certified mental health professionals, and share your journey in a safe, compassionate space.
          </p>
        </div>
      </div>

      {/* Feature Bento Grid */}
      <section className="space-y-3 sm:space-y-4">
        <div className="px-1">
          <h2 className="text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-200 tracking-wide">
            Connection &amp; Support Hubs
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {communityFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link
                key={feature.title}
                href={feature.href}
                className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-[28px]"
              >
                <div
                  className={`relative ${feature.bg} ${feature.textColor} rounded-[28px] h-36 sm:h-44 p-5 flex flex-col justify-between overflow-hidden shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-[0.99]`}
                >
                  {/* Top Bar: Icon Container + Arrow */}
                  <div className="flex justify-between items-start z-10">
                    <div className={`w-12 h-12 rounded-xl ${feature.iconBg} backdrop-blur-sm flex items-center justify-center shadow-sm group-hover:scale-105 group-hover:-rotate-2 transition-transform duration-300`}>
                      <Icon className="w-6 h-6 text-current stroke-[2.2]" />
                    </div>

                    <div className={`w-8 h-8 rounded-full ${feature.arrowBg} backdrop-blur-sm flex items-center justify-center transition-colors`}>
                      <ArrowUpRight className="w-4 h-4 text-current" />
                    </div>
                  </div>

                  {/* Bottom Bar: Title + Description */}
                  <div className="z-10 mt-auto">
                    <h3 className="text-lg font-semibold leading-tight tracking-tight">
                      {feature.title}
                    </h3>
                    <p className="text-sm opacity-80 mt-1 line-clamp-1 sm:line-clamp-2">
                      {feature.description}
                    </p>
                  </div>

                  {/* Decorative background blob */}
                  <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Community Activity Section */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500" />
            <h2 className="text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-200 tracking-wide">
              Community Activity
            </h2>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[28px] border border-gray-200/80 dark:border-gray-800/80 bg-white/60 dark:bg-gray-900/60 backdrop-blur-md p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Safe &amp; Moderated</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
                Join active discussions and share your journey
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Connect in group discussions, exchange daily encouragement, and ask anonymous questions in our warm, supportive space.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <Link
                href="/peer-support"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 w-full sm:w-auto"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Explore Discussions</span>
              </Link>
            </div>
          </div>

          {/* Activity Preview Pills */}
          <div className="mt-6 pt-6 border-t border-gray-200/60 dark:border-gray-800/60 grid grid-cols-1 sm:grid-cols-3 gap-3 relative z-10">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <div className="text-xs">
                <p className="font-semibold text-gray-800 dark:text-gray-200">Active Peer Circles</p>
                <p className="text-gray-500 dark:text-gray-400">Open for daily sharing</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <div className="text-xs">
                <p className="font-semibold text-gray-800 dark:text-gray-200">100% Confidential</p>
                <p className="text-gray-500 dark:text-gray-400">Anonymous handles &amp; avatars</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
              <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
              <div className="text-xs">
                <p className="font-semibold text-gray-800 dark:text-gray-200">Guided Facilitation</p>
                <p className="text-gray-500 dark:text-gray-400">Mentors &amp; counselor support</p>
              </div>
            </div>
          </div>

          {/* Decorative ambient gradients */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />
        </div>
      </section>
    </div>
  );
}
