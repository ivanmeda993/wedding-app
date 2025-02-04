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

const registerSchema = z
  .object({
    email: z.string().email("Unesite validnu email adresu"),
    password: z.string().min(6, "Lozinka mora imati najmanje 6 karaktera"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Lozinke se ne poklapaju",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();
  const { signUp } = useAuth();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      setError(null);
      setSuccess(null);
      await signUp(values);
      setSuccess(
        "Poslali smo vam email za potvrdu. Molimo vas da potvrdite vašu email adresu pre prijave. Proverite spam folder ako ne vidite email."
      );
      form.reset();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Došlo je do greške prilikom registracije");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center flex items-center justify-center gap-2">
            <Heart className="text-pink-500" />
            Registracija
          </CardTitle>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="space-y-4">
              <Alert className="mb-4" variant="default">
                <AlertDescription>{success}</AlertDescription>
              </Alert>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push("/auth/login")}
              >
                Nazad na prijavu
              </Button>
            </div>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
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
                        <Input
                          type="password"
                          placeholder="••••••"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Potvrdite lozinku</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••"
                          {...field}
                        />
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
                      Registracija...
                    </>
                  ) : (
                    "Registruj se"
                  )}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
        {!success && (
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Već imate nalog?{" "}
              <Link href="/auth/login" className="text-primary hover:underline">
                Prijavite se
              </Link>
            </p>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
