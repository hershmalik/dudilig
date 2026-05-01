import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter-tight",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "Dudilig — Compliance OS",
  description: "The compliance operating system for tokenized real-world assets",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${interTight.variable} ${jetbrainsMono.variable} antialiased`}
        style={{
          fontFamily: "var(--font-inter-tight), 'Inter Tight', system-ui, sans-serif",
          background: "var(--bg-base)",
          color: "var(--text-primary)",
        }}
      >
        {children}
      </body>
    </html>
  );
}
