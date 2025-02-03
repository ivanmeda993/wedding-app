"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail } from "lucide-react";

export default function InvitePage({ params }: { params: { code: string } }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [weddingDetails, setWeddingDetails] = useState<{
    brideName: string;
    groomName: string;
  }>();
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function checkInvite() {
      try {
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

        setWeddingDetails({
          brideName: wedding.bride_name,
          groomName: wedding.groom_name,
        });

        // Check if user is already logged in
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
        setError("Došlo je do greške pri proveri pozivnice.");
        setLoading(false);
      }
    }

    checkInvite();
  }, [params.code, router, supabase]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/invite/${params.code}`,
        },
      });

      if (error) throw error;

      setEmailSent(true);
    } catch (err) {
      setError("Došlo je do greške pri slanju email-a.");
    } finally {
      setLoading(false);
    }
  };

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
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-center">Proverite svoj email</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">
              Poslali smo vam email sa linkom za prijavu. Kliknite na link u
              email-u da biste pristupili venčanju.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-center">
            Dobrodošli na venčanje {weddingDetails?.brideName} i{" "}
            {weddingDetails?.groomName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground mb-8">
            Da biste pristupili evidenciji gostiju, unesite svoju email adresu.
            Poslaćemo vam link za prijavu.
          </p>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email adresa</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              <Mail className="w-4 h-4 mr-2" />
              Pošalji link za prijavu
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
