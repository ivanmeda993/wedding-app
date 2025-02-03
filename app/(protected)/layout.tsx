"use client";

import { WeddingHeader } from "@/features/wedding/components/dashboard/wedding-header";
import { useWeddingDetails } from "@/features/wedding/hooks/queries";
import type { Viewport } from "next";
/**
 * Protected Layout
 *
 * Layout wrapper for authenticated routes:
 * - Handles authentication check
 * - Provides navigation
 * - Common UI elements
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

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: weddingDetails, isLoading } = useWeddingDetails();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground">Učitavanje...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container  mx-auto px-2 py-2 sm:py-6 space-y-2 sm:space-y-6">
        {weddingDetails && <WeddingHeader />}
        {children}
      </div>
    </div>
  );
}
