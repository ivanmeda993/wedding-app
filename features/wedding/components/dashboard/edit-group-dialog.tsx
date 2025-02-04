"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useUpdateGroup } from "../../hooks/mutations";
import type { Group } from "../../types";
import { Loader2 } from "lucide-react";

const groupSchema = z.object({
  name: z.string().min(2, "Naziv grupe mora imati bar 2 karaktera"),
  side: z.enum(["bride", "groom"]),
});

type GroupFormValues = z.infer<typeof groupSchema>;

export function EditGroupDialog({
  group,
  open,
  onOpenChange,
}: {
  group: Group;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const updateGroup = useUpdateGroup();

  const form = useForm<GroupFormValues>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      name: group.name,
      side: group.side,
    },
  });

  const onSubmit = async (values: GroupFormValues) => {
    try {
      setError(null);
      await updateGroup.mutateAsync(
        { id: group.id, updates: values },
        {
          onSuccess: () => {
            onOpenChange(false);
            form.reset();
          },
        }
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Došlo je do greške pri ažuriranju grupe"
      );
    }
  };

  const stopPropagation = (e: React.SyntheticEvent) => {
    e.stopPropagation();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Izmena grupe</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={(e) => {
              stopPropagation(e);
              form.handleSubmit(onSubmit)(e);
            }}
            className="space-y-4"
            onClick={stopPropagation}
            onKeyDown={stopPropagation}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Naziv grupe</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="npr. Porodica, Prijatelji, Posao..."
                      {...field}
                      onClick={stopPropagation}
                      onKeyDown={stopPropagation}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="side"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Strana</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger
                        onClick={stopPropagation}
                        onKeyDown={stopPropagation}
                      >
                        <SelectValue placeholder="Izaberi stranu" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="bride">Mladina</SelectItem>
                      <SelectItem value="groom">Mladoženjina</SelectItem>
                    </SelectContent>
                  </Select>
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
              disabled={updateGroup.isPending}
              onClick={stopPropagation}
              onKeyDown={stopPropagation}
            >
              {updateGroup.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Čuvanje...
                </>
              ) : (
                "Sačuvaj izmene"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
