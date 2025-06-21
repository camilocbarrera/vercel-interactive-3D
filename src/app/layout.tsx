import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IA HACKATHON 2025 | Plataforma de Innovación",
  description: "Únete a la plataforma de innovación de la región. Crea tu insignia personalizada para el IA HACKATHON Edición Agosto 2025.",
  keywords: "IA, Hackathon, Inteligencia Artificial, Colombia, Tech Week, Innovación, 2025",
  authors: [{ name: "Colombia Tech Week" }],
  creator: "Colombia Tech Week",
  publisher: "Colombia Tech Week",
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  openGraph: {
    title: "IA HACKATHON 2025 | Plataforma de Innovación",
    description: "Únete a la plataforma de innovación de la región. Crea tu insignia personalizada para el IA HACKATHON Edición Agosto 2025.",
    url: "https://ia-hackathon.vercel.app",
    siteName: "IA HACKATHON 2025",
    images: [
      {
        url: "/og-image.png",
        width: 1024,
        height: 1024,
        alt: "IA HACKATHON 2025 - Insignia Digital",
      },
    ],
    locale: "es_CO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "IA HACKATHON 2025 | Plataforma de Innovación",
    description: "Únete a la plataforma de innovación de la región. Crea tu insignia personalizada para el IA HACKATHON Edición Agosto 2025.",
    images: ["/og-image.png"],
    creator: "@ColombiaTS",
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
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
