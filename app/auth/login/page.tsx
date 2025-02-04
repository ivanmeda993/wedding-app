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
  password: z.string().min(8, "Lozinka mora imati najmanje 8 karaktera"),
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
    <div className="min-h-screen flex items-center justify-center py-8 px-4">
      <Card className="w-full max-w-lg p-4 sm:p-6">
        <div className="space-y-6">
          <div className="lg:hidden space-y-3 text-center mt-2">
            <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-violet-600 to-violet-400 bg-clip-text text-transparent">
              WeddList
            </h1>
            <div className="flex justify-center">
              <div className="w-14 h-14 rounded-full bg-violet-500/10 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-7 h-7 text-violet-500 animate-pulse"
                  role="img"
                  aria-labelledby="heart-title-mobile"
                >
                  <title id="heart-title-mobile">WeddList Logo</title>
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-violet-800">
              Dobrodošli nazad
            </h2>
            <p className="text-sm sm:text-base text-violet-500/70">
              Unesite vaše podatke za prijavu
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="vasa@email.com"
                        {...field}
                      />
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
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && (
                <p className="text-sm text-red-500 bg-red-500/10 p-2.5 rounded-lg">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Prijavljivanje...
                  </>
                ) : (
                  "Prijavi se"
                )}
              </Button>

              <p className="text-center text-sm text-violet-500/70">
                Nemate nalog?{" "}
                <Link
                  href="/auth/register"
                  className="font-medium text-violet-500 hover:text-violet-600"
                >
                  Registrujte se
                </Link>
              </p>
            </form>
          </Form>
        </div>
      </Card>
    </div>
  );
}
