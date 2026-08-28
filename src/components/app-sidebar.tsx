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

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

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
  const { isMobile, setOpenMobile } = useSidebar();
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

  const toggleHub = (title: string) => {
    setExpandedHubs((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const handleNavigation = () => {
    if (isMobile) {
      setTimeout(() => setOpenMobile(false), 150);
    }
  };

  const itemClass = (active: boolean, extra?: string) =>
    cn(
      "modern-button group px-3 py-2 rounded-xl transition-all duration-300 hover:bg-accent/50 hover:scale-[1.02] active:scale-[0.98]",
      active && "bg-primary text-primary-foreground shadow-md",
      extra
    );

  return (
    <Sidebar data-testid="sidebar-main" className="modern-card border-0 shadow-lg">
      <SidebarContent className="bg-background/50 pt-4 sm:pt-5 md:pt-6 flex flex-col h-full">
        {/* Primary navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-bold text-muted-foreground px-3 py-2">
            Navigate
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {/* Home */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  data-active={isActive("/dashboard")}
                  data-testid="nav-home"
                  className={itemClass(isActive("/dashboard"))}
                >
                  <Link href="/dashboard" className="flex items-center gap-3" onClick={handleNavigation}>
                    <Home className="w-5 h-5 icon-interactive transition-transform duration-200" />
                    <span className="text-sm font-medium">Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Hub items */}
              {hubItems.map((hub) => {
                const hubActive = isHubOrChildActive(hub);
                const isExpanded = expandedHubs[hub.title] ?? hubActive;

                return (
                  <SidebarMenuItem key={hub.title}>
                    <div className="flex items-center">
                      <SidebarMenuButton
                        asChild
                        data-active={isActive(hub.url)}
                        data-testid={`nav-${hub.title.toLowerCase().replace(/\s+/g, "-")}`}
                        className={cn(itemClass(isActive(hub.url)), "flex-1")}
                      >
                        <Link href={hub.url} className="flex items-center gap-3" onClick={handleNavigation}>
                          <hub.icon className="w-5 h-5 icon-interactive transition-transform duration-200" />
                          <span className="text-sm font-medium">{hub.title}</span>
                        </Link>
                      </SidebarMenuButton>
                      <button
                        onClick={() => toggleHub(hub.title)}
                        className="p-1.5 rounded-lg hover:bg-accent/50 transition-colors mr-1"
                        aria-label={`${isExpanded ? "Collapse" : "Expand"} ${hub.title}`}
                      >
                        <ChevronRight
                          className={cn(
                            "w-3.5 h-3.5 text-muted-foreground transition-transform duration-200",
                            isExpanded && "rotate-90"
                          )}
                        />
                      </button>
                    </div>

                    {isExpanded && (
                      <div className="ml-4 mt-1 space-y-0.5 border-l-2 border-muted/40 pl-3">
                        {hub.children.map((child) => (
                          <SidebarMenuButton
                            key={child.url + child.title}
                            asChild
                            data-active={isActive(child.url)}
                            className={cn(
                              "px-2.5 py-1.5 rounded-lg transition-all duration-200 hover:bg-accent/40 text-sm",
                              isActive(child.url) && "bg-primary/10 text-primary font-semibold"
                            )}
                          >
                            <Link href={child.url} className="flex items-center gap-2.5" onClick={handleNavigation}>
                              <child.icon className="w-4 h-4 opacity-70" />
                              <span className="text-sm">{child.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        ))}
                      </div>
                    )}
                  </SidebarMenuItem>
                );
              })}

              {/* Explore */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  data-active={isActive(exploreItem.url)}
                  data-testid="nav-explore"
                  className={itemClass(isActive(exploreItem.url))}
                >
                  <Link href={exploreItem.url} className="flex items-center gap-3" onClick={handleNavigation}>
                    <exploreItem.icon className="w-5 h-5 icon-interactive transition-transform duration-200" />
                    <span className="text-sm font-medium">{exploreItem.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Safety — visually distinct, never buried */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-bold text-rose-600 dark:text-rose-400 px-3 py-2">
            Safety
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {safetyItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    data-active={isActive(item.url)}
                    data-testid={`nav-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
                    className={itemClass(
                      isActive(item.url),
                      item.url === "/crisis" && !isActive(item.url)
                        ? "text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                        : undefined
                    )}
                  >
                    <Link href={item.url} className="flex items-center gap-3" onClick={handleNavigation}>
                      <item.icon className="w-5 h-5 icon-interactive transition-transform duration-200" />
                      <span className="text-sm font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Account — pinned bottom */}
        <SidebarGroup className="mt-auto border-t border-muted/30 pt-2">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {accountItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    data-active={isActive(item.url)}
                    data-testid={`nav-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
                    className={itemClass(isActive(item.url))}
                  >
                    <Link href={item.url} className="flex items-center gap-3" onClick={handleNavigation}>
                      <item.icon className="w-5 h-5 icon-interactive transition-transform duration-200" />
                      <span className="text-sm font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}