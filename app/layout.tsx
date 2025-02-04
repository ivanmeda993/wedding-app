import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import { AuthProvider } from "@/features/auth/providers/auth-provider";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

/**
 * Root Layout
 *
 * Application root layout providing:
 * - Global styles
 * - Theme provider
 * - Authentication context
 * - Error boundaries
 *
 * Currently supports Serbian language
 * with plans for internationalization
 *
 * @layout
 */

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  // Also supported but less commonly used
  // interactiveWidget: 'resizes-visual',
};

export const metadata: Metadata = {
  title: "Evidencija gostiju za venčanje | Organizacija venčanja",
  description:
    "Premium aplikacija za organizaciju venčanja i evidenciju gostiju. Jednostavno upravljanje spiskom zvanica, praćenje potvrda dolaska i organizacija rasporeda sedenja.",
  keywords: [
    "evidencija gostiju",
    "organizacija venčanja",
    "spisak gostiju za venčanje",
    "upravljanje gostima",
    "planiranje venčanja",
    "wedding planning",
    "raspored sedenja",
  ],
  authors: [{ name: "Ivan Milićević" }],
  creator: "Ivan Milićević",
  publisher: "Ivan Milićević",
  openGraph: {
    title: "Evidencija gostiju za venčanje | Organizacija venčanja",
    description:
      "Premium aplikacija za organizaciju venčanja i evidenciju gostiju. Jednostavno upravljanje spiskom zvanica.",
    type: "website",
    locale: "sr_RS",
    siteName: "Evidencija gostiju",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sr" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          <AuthProvider>
            {children}
            <Analytics />
            <Toaster />
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
