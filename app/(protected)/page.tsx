"use client";

import { useWeddingDetails } from "@/features/wedding/hooks/queries";
import { WeddingSetup } from "@/features/wedding/components/setup";
import { Dashboard } from "@/features/wedding/components/dashboard";

/**
 * Protected Dashboard Page
 *
 * Main entry point for authenticated users.
 * Renders the wedding planning dashboard with:
 * - Guest management
 * - Statistics
 * - Group management
 *
 * Protected route - requires authentication
 *
 * @page
 */

export default function Home() {
  const { data: weddingDetails, isLoading } = useWeddingDetails();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground">Učitavanje...</p>
        </div>
      </div>
    );
  }

  if (!weddingDetails) return <WeddingSetup />;

  return <Dashboard />;
}
