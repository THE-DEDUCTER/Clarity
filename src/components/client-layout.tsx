"use client";
import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SOSButton } from "@/components/sos-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { BottomNav } from "@/components/bottom-nav";
import { MobileNavDrawer } from "@/components/mobile-nav-drawer";
import Link from "next/link";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showSOSButton = pathname === "/dashboard" || pathname === "/crisis";

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
            className="flex-shrink-0 icon-interactive modern-button rounded-xl p-2 hover:bg-accent/50 md:flex hidden" 
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
          {showSOSButton && <SOSButton />}
          <ThemeToggle />
        </div>
      </header>
      
      {/* Main Layout */}
      <div className="flex h-screen w-full main-content">
        <div className="hidden md:block">
          <AppSidebar />
        </div>
        <div className="flex flex-col flex-1">
          <main className={`flex-1 overflow-auto android-scroll ${pathname.startsWith("/ai-buddy") ? "p-0" : "p-2 xxs:p-1 sm:p-3 md:p-4 lg:p-6 pb-24 md:pb-6"}`}>
            {children}
          </main>
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
}
