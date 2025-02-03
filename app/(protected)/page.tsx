'use client';

import { useWeddingDetails } from '@/features/wedding/hooks/queries';
import { WeddingSetup } from '@/features/wedding/components/setup';
import { Dashboard } from '@/features/wedding/components/dashboard';

export default function Home() {
  const { data: weddingDetails, isLoading } = useWeddingDetails();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Učitavanje...</p>
        </div>
      </div>
    );
  }

  if (!weddingDetails) return <WeddingSetup />;

  return <Dashboard />;
}