import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Papyr — Alat PDF Gratis untuk Indonesia",
    template: "%s | Papyr",
  },
  description:
    "Kompres, gabungkan, pisahkan, dan konversi PDF dengan mudah. Gratis, tanpa akun, dan menjaga privasi. Dibuat untuk pengguna Indonesia.",
  metadataBase: new URL("https://mypapyr.com"),
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "Papyr",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${dmSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
