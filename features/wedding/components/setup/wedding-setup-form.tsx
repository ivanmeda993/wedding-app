"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState } from "react";
import { weddingSetupSchema } from "../../schemas";
import { useSetupWedding } from "../../hooks/mutations";
import type { WeddingSetupFormData } from "../../types";

export function WeddingSetupForm() {
  const [error, setError] = useState<string | null>(null);
  const { mutate: setupWedding, isPending } = useSetupWedding();

  const form = useForm<WeddingSetupFormData>({
    resolver: zodResolver(weddingSetupSchema),
    defaultValues: {
      brideName: "",
      groomName: "",
      venue: {
        name: "",
        address: "",
        hall: "",
      },
      date: "",
      pricePerPerson: 0,
    },
  });

  async function onSubmit(values: WeddingSetupFormData) {
    try {
      setError(null);
      await setupWedding(values);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Došlo je do greške pri kreiranju venčanja"
      );
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="brideName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ime mlade</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ana"
                    {...field}
                    className="bg-background/50"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="groomName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ime mladoženje</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Marko"
                    {...field}
                    className="bg-background/50"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Informacije o lokaciji</h3>
          <div className="grid gap-4">
            <FormField
              control={form.control}
              name="venue.name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Naziv lokacije</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Hotel Grand"
                      {...field}
                      className="bg-background/50"
                    />
                  </FormControl>
                  <FormDescription>
                    Unesite naziv hotela ili restorana gde će se održati
                    venčanje
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="venue.address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresa</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Bulevar oslobođenja 1"
                      {...field}
                      className="bg-background/50"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="venue.hall"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sala/Restoran</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Kristalna dvorana"
                      {...field}
                      className="bg-background/50"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Datum venčanja</FormLabel>
                <FormControl>
                  <Input type="date" {...field} className="bg-background/50" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pricePerPerson"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cena po osobi (EUR)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="50"
                    {...field}
                    className="bg-background/50"
                  />
                </FormControl>
                <FormDescription>
                  Unesite cenu menija po osobi u evrima
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
          disabled={isPending}
        >
          {isPending ? "Učitavanje..." : "Započni evidenciju"}
        </Button>
      </form>
    </Form>
  );
}
