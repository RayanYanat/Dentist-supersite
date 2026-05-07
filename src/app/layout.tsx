import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

/*
 * Cormorant Garamond — refined editorial serif. Replaces Playfair Display,
 * which had become the web's "generic luxury" default. Cormorant has more
 * personality at large sizes, draws cleaner italics, and reads as "Parisian
 * atelier" rather than "wedding invitation template."
 */
const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets:  ["latin"],
  weight:   ["300", "400", "500", "600", "700"],
  style:    ["normal", "italic"],
  display:  "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets:  ["latin"],
  weight:   ["400", "500", "600"],
  display:  "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets:  ["latin"],
  weight:   ["400", "500"],
  display:  "swap",
});

/**
 * Root metadata — generic fallback. Per-prospect [slug]/page.tsx overrides
 * via generateMetadata with the cabinet name + city.
 */
export const metadata: Metadata = {
  title:       "Cosmetic Dentistry — Crafted with Precision",
  description: "Premium cosmetic and restorative dentistry. Veneers, implants, smile design — crafted with the precision of an atelier.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable} ${jetbrains.variable} h-full`}
    >
      <body
        className="min-h-full flex flex-col antialiased"
        style={{ backgroundColor: "#0C0B09", color: "#D8D2C8" }}
      >
        {children}
      </body>
    </html>
  );
}
