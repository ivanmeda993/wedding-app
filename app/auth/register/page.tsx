"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/features/auth/hooks/use-auth";
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
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import Link from "next/link";

const formSchema = z
  .object({
    email: z.string().email("Unesite validnu email adresu"),
    password: z.string().min(8, "Lozinka mora imati najmanje 8 karaktera"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Lozinke se ne poklapaju",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof formSchema>;

export default function RegisterPage() {
  const { signUp } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setError(null);
      await signUp(data);
      router.push("/setup");
    } catch (error) {
      setError("Došlo je do greške prilikom registracije");
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

          <div className="s text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-violet-800">
              Kreirajte nalog
            </h2>
            <p className="text-sm sm:text-base text-violet-500/70">
              Unesite vaše podatke za registraciju
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
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

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Potvrda lozinke</FormLabel>
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
                    Registracija...
                  </>
                ) : (
                  "Registruj se"
                )}
              </Button>

              <p className="text-center text-sm text-violet-500/70">
                Već imate nalog?{" "}
                <Link
                  href="/auth/login"
                  className="font-medium text-violet-500 hover:text-violet-600"
                >
                  Prijavite se
                </Link>
              </p>
            </form>
          </Form>
        </div>
      </Card>
    </div>
  );
}
