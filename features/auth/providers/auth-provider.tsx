"use client";

import { createContext, useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { User } from "@supabase/supabase-js";

const supabase = createClientComponentClient();

interface AuthContextType {
  user: User | null;
  signIn: (credentials: { email: string; password: string }) => Promise<void>;
  signUp: (credentials: { email: string; password: string }) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
});

const publicRoutes = ["/auth/login", "/auth/register"];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const checkSession = useCallback(async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    } catch (error) {
      console.error("Error checking session:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        setUser(session?.user ?? null);
        if (publicRoutes.includes(pathname)) {
          router.push("/");
        }
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        router.push("/auth/login");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [checkSession, router, pathname]);

  const signIn = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message === "Email not confirmed") {
        throw new Error("Molimo vas da potvrdite email adresu pre prijave.");
      }
      throw error;
    }
  };

  const signUp = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}/api/auth/callback`,
      },
    });

    if (error) {
      throw error;
    }

    if (data.user && !data.user.confirmed_at) {
      throw new Error(
        "Poslali smo vam email za potvrdu. Molimo vas da potvrdite vašu email adresu pre prijave. Proverite spam folder ako ne vidite email."
      );
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
