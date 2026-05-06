import type { Metadata } from "next";
import { Playfair_Display, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

/*
 * Playfair Display — serif éditorial pour les headings.
 * Contrast fort avec le monospace JetBrains → tension art / science.
 */
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700", "800", "900"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
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
      className={`${playfair.variable} ${inter.variable} ${jetbrains.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased"
        style={{ backgroundColor: "#0C0B09", color: "#D8D2C8" }}>
        {children}
      </body>
    </html>
  );
}
