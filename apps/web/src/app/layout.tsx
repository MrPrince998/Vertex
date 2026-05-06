import type { Metadata } from "next";

import { Geist, Geist_Mono } from "next/font/google";

import "../index.css";
import Header from "@/components/header";
import Providers from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Vextro",
    template: "%s | Vextro",
  },
  description:
    "A modern media processing workspace for downloads, conversion, compression, and previews.",
  metadataBase: new URL("https://vextro.vercel.app"),
  icons: {
    icon: "/vextro-favicon.svg",
    shortcut: "/vextro-favicon.svg",
    apple: "/vextro-favicon.svg",
  },
  openGraph: {
    title: "Vextro",
    description:
      "A modern media processing workspace for downloads, conversion, compression, and previews.",
    images: ["/vextro-favicon.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <div className="grid grid-rows-[auto_1fr] h-svh">
            <Header />
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
