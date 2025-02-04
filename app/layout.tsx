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
      <body className={`${inter.className} relative`} suppressHydrationWarning>
        {/* Fancy gradient background */}
        <div className="fixed inset-0 bg-gradient-to-br from-pink-100 via-white to-violet-100" />

        {/* Decorative elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[40%] -left-[20%] w-[70%] h-[70%] rounded-full bg-gradient-to-br from-pink-200/40 to-violet-300/40 blur-3xl" />
          <div className="absolute -bottom-[40%] -right-[20%] w-[70%] h-[70%] rounded-full bg-gradient-to-br from-violet-200/40 to-pink-300/40 blur-3xl" />
        </div>

        {/* Content */}
        <div className="relative">
          <Providers>
            <AuthProvider>
              {children}
              <Analytics />
              <Toaster />
            </AuthProvider>
          </Providers>
        </div>
      </body>
    </html>
  );
}
