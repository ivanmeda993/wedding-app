import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import { AuthProvider } from "@/features/auth/providers/auth-provider";
import { Analytics } from "@vercel/analytics/react";
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

export const metadata: Metadata = {
  title: "Evidencija gostiju za venčanje",
  description:
    "Premium aplikacija za organizaciju i evidenciju gostiju na venčanju",
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
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
