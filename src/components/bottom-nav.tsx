"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Brain, Heart, Users2, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";
import { MobileNavDrawer } from "@/components/mobile-nav-drawer";

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", href: "/dashboard", icon: Home },
    { name: "My Mind", href: "/my-mind", icon: Brain },
    { name: "Wellness", href: "/wellness", icon: Heart },
    { name: "Community", href: "/community", icon: Users2 },
  ];

  // Don't show bottom nav on root, login, or register
  if (pathname === "/" || pathname === "/login" || pathname === "/register" || pathname === "/admin" || pathname === "/admin-login") {
    return null;
  }

  return (
    <nav id="bottom-nav" aria-label="Mobile Navigation" className="md:hidden fixed bottom-4 left-3 right-3 z-50 transition-transform duration-300" suppressHydrationWarning>
      <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl border border-gray-200/70 dark:border-gray-800/80 shadow-2xl rounded-[28px] px-2 py-1.5 flex justify-around items-center">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href));
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className="flex flex-col items-center justify-center p-1.5 group touch-manipulation"
              aria-label={item.name}
            >
              <div className={cn(
                "p-2.5 rounded-2xl transition-all duration-300 flex items-center justify-center",
                isActive 
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/25 scale-105" 
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100/60 dark:hover:bg-gray-800/60"
              )}>
                <item.icon className="w-5 h-5" />
              </div>
              <span className={cn(
                "text-[10px] font-semibold mt-0.5 transition-colors",
                isActive ? "text-indigo-600 dark:text-indigo-400" : "text-gray-500 dark:text-gray-400"
              )}>
                {item.name}
              </span>
            </Link>
          );
        })}

        {/* 5th Button: Open Full Mobile Menu / Drawer */}
        <MobileNavDrawer 
          trigger={
            <button 
              className="flex flex-col items-center justify-center p-1.5 group touch-manipulation cursor-pointer"
              aria-label="Explore all features"
            >
              <div className="p-2.5 rounded-2xl transition-all duration-300 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100/60 dark:hover:bg-gray-800/60 group-hover:scale-105">
                <LayoutGrid className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-semibold mt-0.5 text-gray-500 dark:text-gray-400">
                Explore
              </span>
            </button>
          } 
        />
      </div>
    </nav>
  );
}
