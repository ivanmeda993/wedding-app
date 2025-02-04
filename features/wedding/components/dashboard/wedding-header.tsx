"use client";

import { useWeddingDetails } from "../../hooks/queries";
import {
  CalendarDays,
  MapPin,
  Building2,
  Gift,
  LogOut,
  Share2,
  Settings,
} from "lucide-react";
import { WeddingStats } from "./wedding-stats";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { useModalStore } from "./modals/modal-store";

/**
 * Wedding Header Component
 *
 * Displays wedding overview information:
 * - Couple names
 * - Wedding date
 * - Location
 * - Quick action buttons
 *
 * @component
 * @param {Object} props
 * @param {WeddingDetails} props.details - Wedding information
 */

function LoadingSkeleton() {
  return (
    <Card className="p-8 animate-pulse">
      <div className="space-y-4">
        <div className="h-8 bg-muted rounded w-1/3 mx-auto" />
        <div className="h-4 bg-muted rounded w-1/4 mx-auto" />
      </div>
    </Card>
  );
}

export function WeddingHeader() {
  const { data: weddingDetails, isLoading, isError } = useWeddingDetails();
  const { signOut } = useAuth();
  const onOpenChange = useModalStore((state) => state.onOpenChange);
  const setWedding = useModalStore((state) => state.setWedding);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (isError || !weddingDetails || !weddingDetails.venue) {
    return (
      <Card className="p-8">
        <div className="text-center text-muted-foreground">
          Došlo je do greške pri učitavanju podataka o venčanju.
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-violet-500/10 via-violet-500/5 to-transparent p-4">
          {/* Mobile Action Buttons */}
          <div className="grid grid-cols-4 gap-2 mb-4 sm:hidden">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setWedding(weddingDetails);
                onOpenChange("editWedding");
              }}
              className="w-full"
            >
              <Settings className="w-4 h-4 text-violet-500" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setWedding(weddingDetails);
                onOpenChange("shareWedding");
              }}
              className="w-full"
            >
              <Share2 className="w-4 h-4 text-violet-500" />
            </Button>
            <Button variant="outline" size="sm" asChild className="w-full">
              <Link href="/gifts">
                <Gift className="w-4 h-4 text-violet-500" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={signOut}
              className="w-full text-destructive hover:text-destructive"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>

          {/* Desktop Action Buttons */}
          <div className="hidden sm:flex flex-wrap gap-2 justify-end mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setWedding(weddingDetails);
                onOpenChange("editWedding");
              }}
              className="hover:bg-violet-50"
            >
              <Settings className="w-4 h-4 mr-2 text-violet-500" />
              Izmeni podatke
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setWedding(weddingDetails);
                onOpenChange("shareWedding");
              }}
              className="hover:bg-violet-50"
            >
              <Share2 className="w-4 h-4 mr-2 text-violet-500" />
              Podeli pristup
            </Button>
            <Button
              variant="outline"
              size="sm"
              asChild
              className="hover:bg-violet-50"
            >
              <Link href="/gifts" className="flex items-center gap-2">
                <Gift className="w-4 h-4 text-violet-500" />
                Pregled poklona
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={signOut}
              className="hover:bg-destructive/5 hover:text-destructive"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Odjavi se
            </Button>
          </div>

          <div className="text-center space-y-3">
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-violet-800">
              {weddingDetails.brideName} & {weddingDetails.groomName}
            </h1>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-violet-500/70 text-sm">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-violet-500" />
                <time className="font-medium">
                  {new Date(weddingDetails.date).toLocaleDateString("sr-RS", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </time>
              </div>
              {weddingDetails.venue.name && (
                <>
                  <span className="hidden sm:inline text-violet-500/70">•</span>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-violet-500" />
                    <span className="font-medium">
                      {weddingDetails.venue.name}
                    </span>
                  </div>
                </>
              )}
              {weddingDetails.venue.hall && (
                <>
                  <span className="hidden sm:inline text-violet-500/70">•</span>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-violet-500" />
                    <span className="font-medium">
                      {weddingDetails.venue.hall}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </Card>

      <WeddingStats />
    </div>
  );
}
