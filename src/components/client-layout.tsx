"use client";
import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SOSButton } from "@/components/sos-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { BottomNav } from "@/components/bottom-nav";
import { MobileNavDrawer } from "@/components/mobile-nav-drawer";
import Link from "next/link";
import { useSidebar } from "@/components/ui/sidebar";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { setOpen, state } = useSidebar();

  // Routes that should not show the normal app layout
  const isSpecialRoute =
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/admin-login" ||
    pathname === "/admin";

  if (isSpecialRoute) {
    return <div className="min-h-screen flex-1 w-full">{children}</div>;
  }

  return (
    <div className="responsive-container flex-1 w-full">
      {/* Fixed Header */}
      <header className="fixed-header">
        <div className="header-left flex items-center gap-2">
          {/* Mobile drawer trigger */}
          <div className="md:hidden">
            <MobileNavDrawer />
          </div>

          {/* Desktop sidebar trigger */}
          <SidebarTrigger 
            data-testid="button-sidebar-toggle" 
            className="hidden" 
          />
          <Link href="/dashboard" className="flex items-center">
            <img 
              src="/assets/clarity-logo.png" 
              alt="Clarity" 
              className="h-6 w-auto sm:h-7 md:h-8 cursor-pointer transition-all duration-300 hover:scale-105 hover:drop-shadow-lg hover:brightness-110 max-w-full flex-shrink-0 rounded-lg ml-1 md:ml-0"
            />
          </Link>
        </div>
        <div className="header-right flex items-center gap-2">
          <SOSButton variant="compact" />
          <ThemeToggle />
        </div>
      </header>
      
      {/* Main Layout */}
      <div className="flex h-[calc(100vh-var(--header-height,4rem))] w-full main-content relative">
        
        {/* Spacer to push main content - Desktop only */}
        <div className="hidden md:block w-[72px] shrink-0 h-full bg-white dark:bg-[#0c0c0c] border-r border-gray-200/50 dark:border-gray-800/50" />

        {/* Absolute Custom Sidebar overlay */}
        <div className="hidden md:block absolute left-0 top-0 bottom-0 z-50">
          <AppSidebar />
        </div>
        
        <div className="flex flex-col flex-1 min-w-0 relative">
          <main className={`flex-1 min-w-0 overflow-auto android-scroll ${pathname.startsWith("/ai-buddy") ? "p-0" : "p-2 xxs:p-1 sm:p-3 md:p-4 lg:p-6 pb-24 md:pb-6"}`}>
            {children}
          </main>
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
}
