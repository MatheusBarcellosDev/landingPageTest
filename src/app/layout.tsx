import type { Metadata } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const lato = Lato({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  variable: "--font-lato",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Immersive Home Experience",
  description: "A cinematic journey through your next home.",
};

// Viewport configuration for mobile address bar handling
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover', // Extends content into safe areas
  interactiveWidget: 'resizes-content', // Handles address bar changes smoothly
};

import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import AudioController from "@/components/AudioController";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${lato.variable}`}>
      <body className="bg-black text-white antialiased font-sans selection:bg-white/30">
        <SmoothScrollProvider>
          <AudioController />
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
