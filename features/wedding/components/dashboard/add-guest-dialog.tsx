"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { PlusCircle, X } from "lucide-react";
import { useEffect } from "react";
import { useGroups } from "../../hooks/queries";
import { useAddGuest } from "../../hooks/mutations";

const companionSchema = z.object({
  firstName: z.string().min(2, "Ime mora imati bar 2 karaktera"),
  lastName: z.string().optional(),
  isAdult: z.boolean(),
});

const guestSchema = z.object({
  firstName: z.string().min(2, "Ime mora imati bar 2 karaktera"),
  lastName: z.string().min(2, "Prezime mora imati bar 2 karaktera"),
  phone: z.string().optional(),
  attendance: z.enum(["yes", "no", "pending"]),
  side: z.enum(["bride", "groom"]),
  groupId: z.string().optional(),
  notes: z.string().optional(),
  companions: z.array(companionSchema).default([]),
});

type GuestFormValues = z.infer<typeof guestSchema>;

const defaultValues: GuestFormValues = {
  firstName: "",
  lastName: "",
  phone: "",
  attendance: "pending",
  side: "bride",
  groupId: undefined,
  notes: "",
  companions: [],
};

export function AddGuestDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { data: groups = [] } = useGroups();
  const addGuest = useAddGuest();

  const form = useForm<GuestFormValues>({
    resolver: zodResolver(guestSchema),
    defaultValues,
  });

  const selectedSide = form.watch("side");
  const companions = form.watch("companions");

  // Reset groupId when side changes
  useEffect(() => {
    form.setValue("groupId", undefined);
  }, [form]);

  const filteredGroups = groups.filter((group) => group.side === selectedSide);

  const addCompanion = () => {
    const currentCompanions = form.getValues("companions");
    form.setValue("companions", [
      ...currentCompanions,
      { firstName: "", lastName: "", isAdult: true },
    ]);
  };

  const removeCompanion = (index: number) => {
    const currentCompanions = form.getValues("companions");
    form.setValue(
      "companions",
      currentCompanions.filter((_, i) => i !== index)
    );
  };

  const onSubmit = (values: GuestFormValues) => {
    addGuest.mutate(
      {
        ...values,
        groupId: values.groupId || null,
        companions: values.companions.map((c, i) => ({
          ...c,
          id: `temp-${i}`,
        })),
      },
      {
        onSuccess: () => {
          form.reset(defaultValues);
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novi gost</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ime</FormLabel>
                    <FormControl>
                      <Input placeholder="Ime" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prezime</FormLabel>
                    <FormControl>
                      <Input placeholder="Prezime" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                        <SelectTrigger>
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
              <FormField
                control={form.control}
                name="groupId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grupa</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Izaberi grupu" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {filteredGroups.map((group) => (
                          <SelectItem key={group.id} value={group.id}>
                            {group.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Broj telefona</FormLabel>
                  <FormControl>
                    <Input placeholder="Broj telefona" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Napomena</FormLabel>
                  <FormControl>
                    <Input placeholder="Napomena" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Companions Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Pratioci</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addCompanion}
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Dodaj pratioca
                </Button>
              </div>

              {companions.map((_, index) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                  key={index}
                  className="space-y-4 p-4 border rounded-lg relative"
                >
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2"
                    onClick={() => removeCompanion(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`companions.${index}.firstName`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ime</FormLabel>
                          <FormControl>
                            <Input placeholder="Ime" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`companions.${index}.lastName`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prezime</FormLabel>
                          <FormControl>
                            <Input placeholder="Prezime" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name={`companions.${index}.isAdult`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tip</FormLabel>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(value === "adult")
                          }
                          value={field.value ? "adult" : "child"}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Izaberi tip" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="adult">Odrasla osoba</SelectItem>
                            <SelectItem value="child">Dete</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </div>

            <Button type="submit" className="w-full">
              Dodaj gosta
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
