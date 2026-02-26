import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/elements/blocks/Navbar";
import Footer from "@/components/elements/blocks/Footer";
import { EdgeStoreProvider } from "@/lib/edge";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap', // Améliore le LCP (Largest Contentful Paint)
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
});

// Configuration du Viewport pour 2026 (Accessibilité et Mobile-First)
export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://votre-domaine-embalini.com"),
  title: {
    default: "Embalini | Solutions d'Emballage Premium & Logistique Durable",
    template: "%s | Embalini",
  },
  description: 
    "Embalini transforme chaque déballage en expérience de luxe. Solutions d'emballage sur mesure pour entreprises (COMPANY) et particuliers, certifiées Premium 2026.",
  keywords: ["emballage luxe", "packaging premium", "logistique durable", "Embalini", "design packaging 2026"],
  authors: [{ name: "Embalini Studio" }],
  creator: "Embalini",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://votre-domaine-embalini.com",
    title: "Embalini | L'Art de la Protection Premium",
    description: "Design d'exception et protection durable pour vos colis. Valorisez votre marque avec Embalini.",
    siteName: "Embalini",
    images: [
      {
        url: "/og-image.jpg", // Créez cette image (1200x630) mettant en avant vos boîtes premium
        width: 1200,
        height: 630,
        alt: "Embalini Packaging Premium 2026",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Embalini | Packaging de Luxe",
    description: "Valorisez votre marque avec nos solutions d'emballage premium.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
      >
       
       
       <EdgeStoreProvider>{children}</EdgeStoreProvider>
        
       
      </body>
    </html>
  );
}