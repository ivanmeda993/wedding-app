"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { WeddingSetupForm } from "./wedding-setup-form";

export function WeddingSetup() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <div className="container max-w-7xl">
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2">
              <Heart className="text-pink-500" />
              Dobrodošli u aplikaciju za evidenciju gostiju
            </CardTitle>
          </CardHeader>
          <CardContent>
            <WeddingSetupForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
