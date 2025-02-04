"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Wedding = {
  id: string;
  bride_name: string;
  groom_name: string;
};

export default function InvitePage({ params }: { params: { code: string } }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [wedding, setWedding] = useState<Wedding>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registering, setRegistering] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function checkInvite() {
      try {
        // Get wedding details using RPC function
        const { data: weddingData, error: weddingError } = await supabase.rpc(
          "get_wedding_by_invite_code",
          {
            code: params.code,
          }
        );

        if (weddingError || !weddingData) {
          console.error("Wedding error:", weddingError);
          setError("Pozivnica nije pronađena.");
          setLoading(false);
          return;
        }

        if (weddingData.length === 0) {
          setError("Pozivnica nije pronađena.");
          setLoading(false);
          return;
        }

        setWedding(weddingData[0]);
        setLoading(false);
      } catch (err) {
        console.error("Error checking invite:", err);
        setError("Došlo je do greške pri proveri pozivnice.");
        setLoading(false);
      }
    }

    checkInvite();
  }, [params.code]);

  console.log("Wedding:", wedding);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wedding) return;

    try {
      setRegistering(true);

      // Add as collaborator first
      const { error: collaboratorError } = await supabase
        .from("wedding_collaborators")
        .insert({
          wedding_id: wedding.id,
          email: email,
        });

      if (collaboratorError && collaboratorError.code !== "23505") {
        // Ignore unique violation
        throw collaboratorError;
      }

      // Register user
      const { data: authData, error: signUpError } = await supabase.auth.signUp(
        {
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            data: {
              wedding_id: wedding.id,
            },
          },
        }
      );

      if (signUpError) throw signUpError;
      if (!authData.user) throw new Error("No user data returned");

      // Create profile
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: authData.user.id,
        email: email,
      });

      if (profileError) throw profileError;

      // Show success message
      setError(
        "Uspešno ste se registrovali! Proverite email za potvrdu naloga."
      );
      setRegistering(false);
    } catch (err) {
      console.error("Error registering:", err);
      setError("Došlo je do greške pri registraciji.");
    } finally {
      setRegistering(false);
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
          <CardTitle className="text-center">Pozivnica za venčanje</CardTitle>
        </CardHeader>
        <CardContent>
          {wedding && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">
                  {wedding.bride_name} & {wedding.groom_name}
                </h2>
                <p className="text-muted-foreground">
                  Registrujte se da biste pristupili evidenciji gostiju
                </p>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email adresa</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Lozinka</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={registering}>
                  {registering ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : null}
                  Registruj se
                </Button>
              </form>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
