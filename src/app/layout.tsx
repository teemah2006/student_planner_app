// 'use client';

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import  SessionProvider  from "../components/Features/SessionProvider";
import { Toaster } from 'react-hot-toast';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StudyEase",
  description: "Make studying easier with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider><Toaster
          position="top-center"
          toastOptions={{
            success: {
              style: {
                background: "#d1fae5",
                color: "#065f46",
                border: "1px solid #10b981",
              },
              iconTheme: {
                primary: "#10b981",
                secondary: "#ffffff",
              },
            },
            error: {
              style: {
                background: "#fee2e2",
                color: "#991b1b",
                border: "1px solid #ef4444",
              },
              iconTheme: {
                primary: "#ef4444",
                secondary: "#ffffff",
              },
            },
          }}
        />{children}</SessionProvider>
      </body>
    </html>
  );
}
