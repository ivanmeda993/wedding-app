'use client';

import { WeddingHeader } from '@/features/wedding/components/dashboard/wedding-header';
import { useWeddingDetails } from '@/features/wedding/hooks/queries';

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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Učitavanje...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-7xl mx-auto px-4 py-4 sm:py-8 space-y-6 sm:space-y-8">
        {weddingDetails && <WeddingHeader />}
        {children}
      </div>
    </div>
  );
}