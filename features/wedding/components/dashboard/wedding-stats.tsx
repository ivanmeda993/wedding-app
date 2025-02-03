'use client';

import { useWeddingStats } from '../../hooks/queries';
import { Users, Wallet, UserCheck, UserMinus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
}

function StatCard({ title, value, icon, description }: StatCardProps) {
  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-card to-card/50 p-4 sm:p-6 shadow-md border border-border/50">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <div>
          <p className="text-xs sm:text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-xl sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            {value}
          </p>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export function WeddingStats() {
  const stats = useWeddingStats();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
      <StatCard
        title="Ukupno gostiju"
        value={stats.totalGuests}
        icon={<Users className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />}
        description={`${stats.totalAdults} odraslih, ${stats.totalChildren} dece`}
      />
      <StatCard
        title="Odrasli"
        value={stats.totalAdults}
        icon={<UserCheck className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />}
      />
      <StatCard
        title="Deca"
        value={stats.totalChildren}
        icon={<UserMinus className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />}
      />
      <StatCard
        title="Ukupan trošak"
        value={`€${stats.totalCost.toLocaleString('de-DE')}`}
        icon={<Wallet className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />}
      />
    </div>
  );
}