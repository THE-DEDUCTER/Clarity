"use client";
import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SOSButton } from "@/components/sos-button";
import { ThemeToggle } from "@/components/theme-toggle";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showSOSButton = pathname === "/dashboard";

  // Routes that should not show the normal app layout
  const isSpecialRoute =
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/admin-login" ||
    pathname === "/admin";

  if (isSpecialRoute) {
    return <div className="min-h-screen">{children}</div>;
  }

  return (
    <div className="responsive-container">
      {/* Fixed Header */}
      <header className="fixed-header">
        <div className="header-left">
          <SidebarTrigger 
            data-testid="button-sidebar-toggle" 
            className="flex-shrink-0 icon-interactive modern-button rounded-xl p-2 hover:bg-accent/50" 
          />
          <img 
            src="/assets/clarity-logo.png" 
            alt="Clarity" 
            className="h-6 w-auto sm:h-7 md:h-8 cursor-pointer transition-all duration-300 hover:scale-105 hover:drop-shadow-lg hover:brightness-110 max-w-full flex-shrink-0 rounded-lg"
          />
        </div>
        <div className="header-right">
          {showSOSButton && <SOSButton />}
          <ThemeToggle />
        </div>
      </header>
      
      {/* Main Layout */}
      <div className="flex h-screen w-full main-content">
        <AppSidebar />
        <div className="flex flex-col flex-1">
          <main className="flex-1 overflow-auto p-2 xxs:p-1 sm:p-3 md:p-4 lg:p-6 pb-safe-area-bottom android-scroll">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
