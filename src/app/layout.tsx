import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BOUQCAKES | Edible Floral Gifting — Dubai",
  description:
    "BOUQCAKES Dubai — Edible floral gifting crafted to be admired, gifted, and savoured. Without us, it's just cake.",
  keywords: [
    "Bouqcakes",
    "Dubai edible floral bouquet",
    "edible floral gifting",
    "floral cupcake bouquet Dubai",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${manrope.variable} antialiased`}
    >
      <body className="min-h-screen bg-[#F5EEE5] text-[#292321] font-sans selection:bg-[#8F1728] selection:text-[#F5EEE5] flex flex-col">
        {children}
      </body>
    </html>
  );
}
