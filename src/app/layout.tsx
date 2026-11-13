import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Facebook Marketplace Clone",
  description: "Marketplace UI built with Next.js 15 and Shadcn",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/* fixed inset-0 completely pins the app to the window corners */}
      <body className="fixed inset-0 flex flex-col overflow-hidden bg-white antialiased">
        <Header />
        
        {/* This wrapper holds the sidebar and main feed, preventing them from expanding past the window */}
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          {children}
        </div>
        
      </body>
    </html>
  );
}