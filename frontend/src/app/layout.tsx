import type { Metadata, Viewport } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: "#6366f1",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://notesphere.app"),
  title: {
    default: "NoteSphere | The Universal Academic Note-Sharing Vault",
    template: "%s | NoteSphere",
  },
  description:
    "Premium academic note-sharing platform with uploads, verification, gamification, and social discovery.",
  keywords: [
    "NoteSphere",
    "academic notes",
    "student notes",
    "university notes",
    "study materials",
    "notes upload",
  ],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "NoteSphere",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
  icons: {
    icon: [
      { url: "/icon-192x192.png?v=1", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png?v=1", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icon-512x512.png?v=1", sizes: "512x512", type: "image/png" },
    ],
  },
  openGraph: {
    title: "NoteSphere",
    description: "The Universal Academic Note-Sharing Vault",
    type: "website",
    url: "https://notesphere.app",
    images: [
      {
        url: "/icon-512x512.png",
        width: 512,
        height: 512,
        alt: "NoteSphere Logo",
      },
    ],
  },
};

import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import IntroLoader from "@/components/IntroLoader";
import CustomCursor from "@/components/ui/CustomCursor";
import Footer from "@/components/ui/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={spaceGrotesk.className} suppressHydrationWarning>
        <IntroLoader />
        <CustomCursor />
        {children}
        <Footer />
        <PWAInstallPrompt />
      </body>
    </html>
  );
}
