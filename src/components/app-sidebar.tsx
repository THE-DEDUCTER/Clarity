"use client";

import {
  Home,
  MessageCircle,
  BookOpen,
  Users,
  Users2,
  Palette,
  Heart,
  Target,
  Settings,
  Shield,
  Phone,
  User,
  Brain,
  PenLine,
  UserCheck,
  Gamepad2,
  Castle,
  GraduationCap,
  Headphones,
  MessageSquare,
  ChevronRight,
  PawPrint,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface NavChild {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavHub {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  children: NavChild[];
}

const hubItems: NavHub[] = [
  {
    title: "My Mind",
    url: "/my-mind",
    icon: Brain,
    children: [
      { title: "AI Buddy", url: "/ai-buddy", icon: MessageCircle },
      { title: "Diary", url: "/diary", icon: PenLine },
      { title: "Assessment", url: "/assessment", icon: Brain },
      { title: "Inner Gatekeeper", url: "/inner-gatekeeper", icon: Castle },
    ],
  },
  {
    title: "Wellness",
    url: "/wellness",
    icon: Heart,
    children: [
      { title: "Goals", url: "/goals", icon: Target },
      { title: "Audio Sessions", url: "/audio-sessions", icon: Headphones },
      { title: "Creative Zone", url: "/creative", icon: Palette },
    ],
  },
  {
    title: "Play",
    url: "/games",
    icon: Gamepad2,
    children: [
      { title: "Pet Care", url: "/petcare-game", icon: PawPrint },
      { title: "Inner Gatekeeper", url: "/inner-gatekeeper", icon: Castle },
    ],
  },
  {
    title: "Community",
    url: "/community",
    icon: Users2,
    children: [
      { title: "Peer Support", url: "/peer-support", icon: Users },
      { title: "Clarity Connect", url: "/professional-community", icon: GraduationCap },
      { title: "Mentorship", url: "/mentorship", icon: UserCheck },
      { title: "Anonymous Chat", url: "/anonymous-chat", icon: MessageSquare },
    ],
  },
];

const exploreItem = { title: "Explore", url: "/resources", icon: BookOpen };

const safetyItems = [
  { title: "Crisis Support", url: "/crisis", icon: Phone },
  { title: "Report", url: "/report", icon: Shield },
];

const accountItems = [
  { title: "Profile", url: "/profile", icon: User },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [expandedHubs, setExpandedHubs] = useState<Record<string, boolean>>({});

  const isActive = (url: string) => {
    if (url === "/dashboard" && pathname === "/dashboard") return true;
    if (url !== "/dashboard" && pathname?.startsWith(url)) return true;
    return false;
  };

  const isHubOrChildActive = (hub: NavHub) => {
    if (pathname?.startsWith(hub.url)) return true;
    return hub.children.some((child) => pathname?.startsWith(child.url));
  };

  const toggleHub = (e: React.MouseEvent, title: string) => {
    e.preventDefault();
    setExpandedHubs((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const itemClass = (active: boolean) =>
    cn(
      "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 w-full text-sm font-medium relative group/link",
      "hover:bg-gray-100 dark:hover:bg-gray-800/60 active:scale-[0.98]",
      active ? "bg-primary text-primary-foreground shadow-md" : "text-gray-700 dark:text-gray-200"
    );

  const iconClass = (active: boolean) =>
    cn(
      "w-5 h-5 shrink-0 transition-colors",
      active ? "text-primary-foreground" : "text-gray-500 dark:text-gray-400 group-hover/link:text-gray-900 dark:group-hover/link:text-white"
    );

  return (
    <aside className="group absolute left-0 top-0 h-full bg-white dark:bg-[#0c0c0c] border-r border-gray-200/50 dark:border-gray-800/50 transition-all duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] w-[72px] hover:w-[260px] overflow-hidden flex flex-col z-40 shadow-sm md:shadow-none hover:shadow-2xl">
      <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin pt-20 pb-6 flex flex-col gap-6">
        
        {/* Navigation Section */}
        <div className="px-3 flex flex-col gap-1.5">
          {/* Section Header (Hidden when collapsed) */}
          <div className="px-3 flex items-center overflow-hidden transition-all duration-300 h-0 mb-0 group-hover:h-6 group-hover:mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              Navigate
            </span>
          </div>

          <Link href="/dashboard" className={itemClass(isActive("/dashboard"))}>
            <Home className={iconClass(isActive("/dashboard"))} />
            <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">Home</span>
          </Link>

          {hubItems.map((hub) => {
            const hubActive = isHubOrChildActive(hub);
            const isExpanded = expandedHubs[hub.title] ?? hubActive;

            return (
              <div key={hub.title} className="flex flex-col">
                <Link href={hub.url} className={itemClass(isActive(hub.url))}>
                  <hub.icon className={iconClass(isActive(hub.url))} />
                  <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 flex-1">
                    {hub.title}
                  </span>
                  
                  {/* Chevron only visible when hovered */}
                  <button
                    onClick={(e) => toggleHub(e, hub.title)}
                    className="p-1 rounded-md hover:bg-black/10 dark:hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-all absolute right-2"
                  >
                    <ChevronRight className={cn("w-4 h-4 text-gray-400 transition-transform", isExpanded && "rotate-90")} />
                  </button>
                </Link>

                {/* Children Menu (Only shown when expanded AND sidebar is hovered) */}
                <div className={cn(
                  "overflow-hidden transition-all duration-300 ease-in-out opacity-0 group-hover:opacity-100 max-h-0",
                  isExpanded && "group-hover:max-h-96 group-hover:mt-1"
                )}>
                  <div className="ml-[22px] pl-3 border-l-2 border-gray-100 dark:border-gray-800 flex flex-col gap-1">
                    {hub.children.map((child) => (
                      <Link 
                        key={child.url} 
                        href={child.url} 
                        className={cn(
                          "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all whitespace-nowrap group/child",
                          isActive(child.url) 
                            ? "bg-primary/10 text-primary font-semibold" 
                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                        )}
                      >
                        <child.icon className={cn("w-4 h-4 shrink-0 transition-transform group-hover/child:scale-110", isActive(child.url) ? "text-primary" : "opacity-70")} />
                        <span>{child.title}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}

          <Link href={exploreItem.url} className={itemClass(isActive(exploreItem.url))}>
            <exploreItem.icon className={iconClass(isActive(exploreItem.url))} />
            <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">{exploreItem.title}</span>
          </Link>
        </div>

        {/* Safety Section */}
        <div className="px-3 flex flex-col gap-1.5 mt-2">
          <div className="px-3 flex items-center overflow-hidden transition-all duration-300 h-0 mb-0 group-hover:h-6 group-hover:mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-500/70 dark:text-rose-400/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              Safety
            </span>
          </div>
          {safetyItems.map((item) => {
            const isCrisis = item.url === "/crisis";
            return (
              <Link 
                key={item.url} 
                href={item.url} 
                className={cn(
                  itemClass(isActive(item.url)), 
                  isCrisis && !isActive(item.url) && "text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                )}
              >
                <item.icon className={cn(iconClass(isActive(item.url)), isCrisis && "text-rose-500 dark:text-rose-400")} />
                <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">{item.title}</span>
              </Link>
            );
          })}
        </div>

      </div>

      {/* Footer / Account */}
      <div className="p-3 border-t border-gray-100/50 dark:border-gray-800/50 flex flex-col gap-1.5 bg-gray-50/50 dark:bg-[#0c0c0c]">
        {accountItems.map((item) => (
          <Link key={item.url} href={item.url} className={itemClass(isActive(item.url))}>
            <item.icon className={iconClass(isActive(item.url))} />
            <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">{item.title}</span>
          </Link>
        ))}
      </div>
    </aside>
  );
}