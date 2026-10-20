import type { Metadata } from "next";
import { Geist, Geist_Mono, Manrope } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { QueryProvider } from "@/lib/providers/query-provider";
import { ReactNode, Suspense } from "react";
import { RouteProgress } from "@/components/common/route-progress";

const geistHeading = Geist({ subsets: ['latin'], variable: '--font-heading' });

const manrope = Manrope({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FITALENTA",
  description: "Empowering businesses and individuals to grow.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", manrope.variable, geistHeading.variable)}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <Suspense fallback={null}>
          <RouteProgress />
        </Suspense>
        <QueryProvider>
          <main>
            {children}
          </main>
        </QueryProvider>
      </body>
    </html>
  );
}