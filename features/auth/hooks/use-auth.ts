"use client";

import { useContext } from "react";
import { AuthContext } from "../providers/auth-provider";
import type { User } from "@supabase/auth-helpers-nextjs";

export type AuthContextType = {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: { email: string; password: string }) => Promise<void>;
  signOut: () => Promise<void>;
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
