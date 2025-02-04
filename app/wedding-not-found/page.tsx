"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { useRouter } from "next/navigation";

export default function WeddingNotFoundPage() {
  const { signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-4">Nemate pristup venčanju</h1>
      <p className="text-gray-600 mb-8 text-center max-w-md">
        Trenutno nemate pristup nijednom venčanju. Možete kreirati svoje
        venčanje ili se izlogovati.
      </p>
      <div className="flex gap-4">
        <Button onClick={handleSignOut} variant="outline">
          Izloguj se
        </Button>
      </div>
    </div>
  );
}
