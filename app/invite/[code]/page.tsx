"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function InvitePage({ params }: { params: { code: string } }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    async function handleAuth() {
      try {
        // Check if we have a code from magic link
        const code = searchParams.get("code");
        if (code) {
          // Exchange code for session
          const { data, error: authError } =
            await supabase.auth.exchangeCodeForSession(code);
          if (authError) throw authError;

          // Check if we have a redirect URL in user metadata
          const redirectTo = data.user?.user_metadata?.redirect_to;
          if (redirectTo) {
            router.push(redirectTo);
            return;
          }
        }

        // Get wedding details using RPC function
        const { data: wedding, error: weddingError } = await supabase.rpc(
          "get_wedding_by_invite_code",
          {
            code: params.code,
          }
        );

        if (weddingError || !wedding) {
          console.error("Wedding error:", weddingError);
          setError("Pozivnica nije pronađena.");
          setLoading(false);
          return;
        }

        // Check if user is logged in
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          // Add as collaborator if not already
          const { error: collaboratorError } = await supabase
            .from("wedding_collaborators")
            .insert({
              wedding_id: wedding.id,
              email: session.user.email,
            })
            .select()
            .single();

          if (collaboratorError && collaboratorError.code !== "23505") {
            // Ignore unique violation
            throw collaboratorError;
          }

          // Check if user has password set
          const { data: user, error: userError } =
            await supabase.auth.getUser();
          if (userError) throw userError;

          // If user doesn't have a password set, redirect to password setup
          if (!user.user?.user_metadata?.has_password) {
            router.push("/set-password");
            return;
          }

          // Redirect to dashboard
          router.push("/dashboard");
          return;
        }

        setLoading(false);
      } catch (err) {
        console.error("Error handling auth:", err);
        setError("Došlo je do greške pri autentikaciji.");
        setLoading(false);
      }
    }

    handleAuth();
  }, [params.code, router, searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-center">Autentikacija u toku</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            Molimo sačekajte dok vas prijavimo...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
