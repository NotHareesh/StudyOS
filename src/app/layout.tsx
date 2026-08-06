import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "StudyOS — AI Study Operating System for CBSE 12 & JEE",
  description: "Personal AI-powered study management system built for Class 12 CBSE, JEE Main, and JEE Advanced preparation.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <head>
        <Script src="https://accounts.google.com/gsi/client" strategy="beforeInteractive" />
      </head>
      <body className="min-h-full bg-[#090d16] text-slate-100 flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
