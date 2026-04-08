import type { Metadata } from "next";
import { Syne, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { CustomCursor } from "@/components/ui/custom-cursor";

// Header and brand font
const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

// Body and content font
const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

// Code font - keeping it as it's useful for technical bits
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "QuizApp - Test Your Knowledge",
  description: "Interactive quiz platform to challenge yourself and learn new things",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${dmSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className={`${syne.variable} ${dmSans.variable} ${jetbrainsMono.variable} min-h-full flex flex-col`}>
      <CustomCursor />
      <Header/>
      {children}</body>
    </html>
  );
}
