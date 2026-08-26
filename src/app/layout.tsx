import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

import { Providers } from "@/components/providers";
import { ClientLayout } from "@/components/client-layout";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Clarity | Premium Experience",
  description: "A fast, beautiful, and completely customized Next.js application.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={outfit.variable} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>
          <ClientLayout>{children}</ClientLayout>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
