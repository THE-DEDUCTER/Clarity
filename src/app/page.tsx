"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BackgroundPaths } from "@/components/ui/background-paths";
import { useRouter } from "next/navigation";
import { Heart, Brain, Users, Shield, ArrowRight, Sparkles, LogIn, UserPlus, User, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export function DemoBackgroundPaths() {
    return <BackgroundPaths title="Welcome to Clarity" />
}

export default function HomePage() {
  const router = useRouter();
  const { user, isAuthenticated, logout, isLoading } = useAuth();

  const handleEnterApp = () => {
    if (isAuthenticated) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-slate-50 dark:bg-gray-900">
      {/* Animated Background Paths */}
      <div className="absolute inset-0 z-0">
        <BackgroundPaths title="" />
      </div>

      {/* Main Content */}
      <div className="relative z-20 flex flex-col h-screen">
        {/* Authentication Header */}
        <header className="flex justify-between items-center p-4 sm:p-6 h-20 shrink-0">
          <div className="flex items-center space-x-2">
            <Heart className="w-6 h-6 text-emerald-600" />
            <span className="text-lg font-bold text-gray-800 dark:text-gray-200">Clarity</span>
          </div>
          
          <div className="flex items-center space-x-3">
            {isLoading ? (
              <div className="w-8 h-8 animate-pulse bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            ) : isAuthenticated && user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-white/80 dark:bg-black/80 backdrop-blur-sm rounded-full px-3 py-1.5 border border-gray-200 dark:border-gray-800 shadow-sm">
                  <User className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {user.firstName || user.username}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="bg-white/80 dark:bg-black/80 backdrop-blur-sm hover:bg-white dark:hover:bg-black border-gray-200 dark:border-gray-800"
                >
                  <LogOut className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push("/login")}
                  className="bg-white/80 dark:bg-black/80 backdrop-blur-sm hover:bg-white dark:hover:bg-black"
                >
                  <LogIn className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Login</span>
                </Button>
                <Button
                  size="sm"
                  onClick={() => router.push("/register")}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <UserPlus className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Sign Up</span>
                </Button>
              </div>
            )}
          </div>
        </header>

        {/* Center Content vertically */}
        <div className="flex-1 flex flex-col justify-center items-center px-4 -mt-10 overflow-hidden">
          <div className="w-full max-w-4xl mx-auto text-center flex flex-col items-center">
            
            {/* Logo */}
            <div className="flex justify-center mb-4 sm:mb-8 animate-in fade-in zoom-in duration-700">
              <img 
                src="/assets/clarity-logo.png" 
                alt="Clarity Logo" 
                className="h-20 xs:h-24 sm:h-28 md:h-32 drop-shadow-xl max-w-full rounded-2xl"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>

            {/* Main Heading */}
            <div className="space-y-2 sm:space-y-4 mb-8 sm:mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-blue-600 dark:text-blue-400 tracking-tight drop-shadow-sm">
                Clarity
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-slate-700 dark:text-slate-300 font-medium">
                When the Mind Is Clear, the Heart Is at Peace.
              </p>
            </div>

            {/* CTA Section */}
            <div className="mb-10 sm:mb-14 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
              {isAuthenticated && user ? (
                <div className="inline-block group relative bg-gradient-to-b from-emerald-500/20 via-blue-500/20 to-purple-500/20 p-px rounded-2xl shadow-xl transition-transform hover:scale-105">
                  <Button
                    onClick={handleEnterApp}
                    variant="ghost"
                    className="rounded-[0.95rem] px-8 py-6 text-lg font-semibold bg-white/95 hover:bg-white dark:bg-gray-950 dark:hover:bg-black text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50"
                  >
                    <Sparkles className="w-5 h-5 mr-3" />
                    Go to Dashboard
                    <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-2 transition-transform" />
                  </Button>
                </div>
              ) : (
                <div className="inline-block group relative bg-gradient-to-b from-emerald-500/20 via-blue-500/20 to-purple-500/20 p-px rounded-2xl shadow-xl transition-transform hover:scale-105">
                  <Button
                    onClick={() => router.push("/register")}
                    variant="ghost"
                    className="rounded-[0.95rem] px-8 py-6 text-lg font-semibold bg-white/95 hover:bg-white dark:bg-gray-950 dark:hover:bg-black text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50"
                  >
                    <UserPlus className="w-5 h-5 mr-3" />
                    Get Started Free
                    <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-2 transition-transform" />
                  </Button>
                </div>
              )}
            </div>

            {/* Features Row - Replaces the bulky grid */}
            <div className="flex flex-wrap justify-center gap-3 sm:gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500 w-full max-w-3xl">
              {[
                { label: "Wellness", icon: Heart, bg: "bg-pink-50 text-pink-600 border-pink-200" },
                { label: "AI Support", icon: Brain, bg: "bg-blue-50 text-blue-600 border-blue-200" },
                { label: "Community", icon: Users, bg: "bg-emerald-50 text-emerald-600 border-emerald-200" },
                { label: "Safe Space", icon: Shield, bg: "bg-purple-50 text-purple-600 border-purple-200" }
              ].map((feat, i) => (
                <div key={i} className={`flex items-center gap-2 px-4 py-2.5 rounded-full border shadow-sm backdrop-blur-md ${feat.bg} bg-opacity-90 dark:bg-opacity-10 dark:border-opacity-20`}>
                  <feat.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-semibold text-sm sm:text-base">{feat.label}</span>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Footer */}
        <footer className="h-12 flex-shrink-0 flex items-center justify-center text-xs sm:text-sm text-gray-500 dark:text-gray-400 bg-white/30 dark:bg-black/30 backdrop-blur-md border-t border-gray-200/50 dark:border-gray-800/50">
          © 2025 Clarity. Supporting student mental health with compassion and innovation.
        </footer>
      </div>
    </div>
  );
}