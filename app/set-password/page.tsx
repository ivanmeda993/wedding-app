"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export default function SetPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(undefined);

    if (password !== confirmPassword) {
      setError("Šifre se ne poklapaju.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Šifra mora imati najmanje 6 karaktera.");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      // Set flag in user metadata
      const { error: metadataError } = await supabase.auth.updateUser({
        data: { has_password: true },
      });

      if (metadataError) throw metadataError;

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (err) {
      setError("Došlo je do greške pri postavljanju šifre.");
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

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-center">Postavite šifru</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground mb-8">
            Da biste mogli da se prijavite u budućnosti, postavite šifru za svoj
            nalog.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Nova šifra</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Potvrdite šifru</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              Sačuvaj šifru
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
