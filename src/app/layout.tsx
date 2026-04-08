import type { Metadata } from "next";
import { Inter, Poppins, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";

// Primary font for body text - excellent readability for quiz questions
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Heading font - modern and engaging for quiz UI
const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

// Code font - perfect for technical/code quizzes
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
      className={`${inter.variable} ${poppins.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
      <Header/>
      {children}</body>
    </html>
  );
}
