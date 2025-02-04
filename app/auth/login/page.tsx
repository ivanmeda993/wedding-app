"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Heart, Loader2 } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/use-auth";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/lib/supabase";

const loginSchema = z.object({
  email: z.string().email("Unesite validnu email adresu"),
  password: z.string().min(6, "Lozinka mora imati najmanje 6 karaktera"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { signIn } = useAuth();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      setError(null);
      await signIn(values);

      // Check if user has a wedding
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) return;

      // First check if user is a wedding owner
      const { data: ownedWedding } = await supabase
        .from("weddings")
        .select("id")
        .eq("user_id", session.session.user.id)
        .maybeSingle();

      if (ownedWedding) {
        router.push("/");
        return;
      }

      // Then check if user is a collaborator
      const { data: collaborator } = await supabase
        .from("wedding_collaborators")
        .select("wedding_id")
        .eq("email", session.session.user.email)
        .maybeSingle();

      if (collaborator) {
        router.push("/");
        return;
      }

      // If no wedding found, redirect to setup
      router.push("/setup");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Došlo je do greške prilikom prijave");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center flex items-center justify-center gap-2">
            <Heart className="text-pink-500" />
            Prijava
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email adresa</FormLabel>
                    <FormControl>
                      <Input placeholder="vasa@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lozinka</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Prijava...
                  </>
                ) : (
                  "Prijavi se"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Nemate nalog?{" "}
            <Link
              href="/auth/register"
              className="text-primary hover:underline"
            >
              Registrujte se
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
