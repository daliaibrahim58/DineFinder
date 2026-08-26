import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

import type { Metadata } from "next";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";

import ReduxProvider from "@/redux/ReduxProvider";

import AuthProvider from "@/redux/AuthProvider";

import AppLayout from "@/components/layout/AppLayout";

// =====================================================
// Fonts
// =====================================================

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// =====================================================
// Metadata
// =====================================================

export const metadata: Metadata = {
  title: "DineFinder",
  description: "Discover the best restaurants around you",
};

// =====================================================
// Root Layout
// =====================================================

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body>
        <AppRouterCacheProvider>
          <ReduxProvider>
            <AuthProvider>
              <AppLayout>{children}</AppLayout>
            </AuthProvider>
          </ReduxProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
