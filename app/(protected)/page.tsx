"use client";

import { useWeddingDetails } from "@/features/wedding/hooks/queries";
import { Dashboard } from "@/features/wedding/components/dashboard";

/**
 * Protected Dashboard Page
 *
 * Shows wedding details and guest management interface.
 * Only accessible to authenticated users who are collaborators.
 *
 * Features:
 * - Guest list
 * - Group management
 * - Wedding details
 * - Statistics
 *
 * @page
 */
export default function DashboardPage() {
  const { data: weddingDetails, isLoading, isSuccess } = useWeddingDetails();

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

  if (!weddingDetails && isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Venčanje nije pronađeno.</p>
        </div>
      </div>
    );
  }

  if (weddingDetails && isSuccess) {
    return <Dashboard />;
  }

  return null;
}
