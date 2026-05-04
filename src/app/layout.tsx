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

export const metadata: Metadata = {
  title: "[Cabinet] — Cosmetic Dentistry in [City]",
  description:
    "Premium cosmetic dentistry in [City]. Veneers, implants, smile design — crafted with precision by [Dr. Nom]. Schedule your consultation today.",
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
