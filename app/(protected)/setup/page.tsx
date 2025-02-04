"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { WeddingSetup } from "@/features/wedding/components/setup";

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

export default function ProtectedHome() {
  const { user } = useAuth();
  const router = useRouter();

  console.log("User:", user);
  useEffect(() => {
    async function checkWedding() {
      if (!user) return;

      // Check if user has wedding in metadata
      const weddingId = user.user_metadata?.wedding_id;
      if (weddingId) {
        router.push("/");
        return;
      }

      // Check if user is a collaborator
      const { data: collaborator } = await supabase
        .from("wedding_collaborators")
        .select("wedding_id")
        .eq("email", user.email)
        .single();

      if (collaborator) {
        router.push("/");
        return;
      }
    }

    checkWedding();
  }, [user, router]);

  return <>{!user?.user_metadata?.wedding_id && <WeddingSetup />}</>;
}
