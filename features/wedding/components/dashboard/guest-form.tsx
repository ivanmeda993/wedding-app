import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import type { Guest } from "../../types";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

// Custom styles for phone input
const phoneInputCustomStyles = {
  phoneInput: {
    width: "100%",
    height: "40px",
    fontSize: "14px",
    borderRadius: "6px",
    border: "1px solid hsl(var(--input))",
    backgroundColor: "hsl(var(--background))",
    "&:focus": {
      borderColor: "hsl(var(--ring))",
      outline: "none",
      boxShadow: "0 0 0 2px hsl(var(--ring) / 0.2)",
    },
  },
  phoneInputContainer: {
    width: "100%",
  },
  phoneInputSearch: {
    backgroundColor: "hsl(var(--background))",
    color: "hsl(var(--foreground))",
  },
  phoneInputDropdown: {
    backgroundColor: "hsl(var(--background))",
    color: "hsl(var(--foreground))",
  },
};

const companionSchema = z.object({
  firstName: z.string().min(2, "Ime mora imati bar 2 karaktera"),
  lastName: z.string().optional(),
  isAdult: z.boolean(),
});

export const guestSchema = z.object({
  firstName: z.string().min(2, "Ime mora imati bar 2 karaktera"),
  lastName: z.string().min(2, "Prezime mora imati bar 2 karaktera"),
  phone: z.string().optional(),
  attendance: z.enum(["yes", "no", "pending"]),
  side: z.enum(["bride", "groom"]),
  groupId: z.string().optional(),
  notes: z.string().optional(),
  gift: z
    .object({
      type: z.enum(["money", "other"]),
      amount: z.number().optional(),
      description: z.string().optional(),
    })
    .optional()
    .nullable(),
  companions: z.array(companionSchema).default([]),
});

export type GuestFormValues = z.infer<typeof guestSchema>;

interface GuestFormProps {
  defaultValues?: Partial<GuestFormValues>;
  onSubmit: (values: GuestFormValues) => void;
  submitText: string;
}

export function GuestForm({
  defaultValues,
  onSubmit,
  submitText,
}: GuestFormProps) {
  const { data: groups = [] } = useGroups();

  const form = useForm<GuestFormValues>({
    resolver: zodResolver(guestSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      attendance: "pending",
      side: "bride",
      companions: [],
      ...defaultValues,
    },
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="mb-1">Ime</FormLabel>
                <FormControl>
                  <Input className="h-9" placeholder="Ime" {...field} />
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
                <FormLabel className="mb-1">Prezime</FormLabel>
                <FormControl>
                  <Input className="h-9" placeholder="Prezime" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="side"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="mb-1">Strana</FormLabel>
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
            name="attendance"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="mb-1">Status dolaska</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Izaberi status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="yes">Dolazi</SelectItem>
                    <SelectItem value="no">Ne dolazi</SelectItem>
                    <SelectItem value="pending">Neodređeno</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="groupId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="mb-1">Grupa</FormLabel>
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

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="mb-1">Broj telefona</FormLabel>
              <FormControl>
                <PhoneInput
                  country="rs"
                  preferredCountries={["rs"]}
                  countryCodeEditable={false}
                  enableSearch
                  inputClass="phone-input"
                  containerClass="phone-input-container"
                  searchClass="phone-input-search"
                  dropdownClass="phone-input-dropdown"
                  buttonClass="phone-input-button"
                  value={field.value}
                  onChange={(phone) => field.onChange(phone)}
                  inputStyle={{
                    width: "100%",
                    height: "36px",
                    fontSize: "14px",
                    paddingLeft: "48px",
                    paddingTop: "6px",
                    paddingBottom: "6px",
                    borderRadius: "6px",
                    border: "1px solid hsl(var(--input))",
                    backgroundColor: "hsl(var(--background))",
                  }}
                  buttonStyle={{
                    backgroundColor: "transparent",
                    border: "none",
                    borderRight: "1px solid hsl(var(--input))",
                    borderRadius: "6px 0 0 6px",
                    height: "34px",
                  }}
                  dropdownStyle={{
                    backgroundColor: "hsl(var(--background))",
                    color: "hsl(var(--foreground))",
                  }}
                />
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
              <FormLabel className="mb-1">Napomena</FormLabel>
              <FormControl>
                <Input className="h-9" placeholder="Napomena" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Gift Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <FormLabel className="mb-1">Poklon</FormLabel>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const currentGift = form.getValues("gift");
                form.setValue("gift", currentGift ? null : { type: "money" });
              }}
            >
              {form.watch("gift") ? (
                <>
                  <X className="w-4 h-4 mr-2" />
                  Ukloni poklon
                </>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Dodaj poklon
                </>
              )}
            </Button>
          </div>

          {form.watch("gift") && (
            <div className="space-y-4 border rounded-lg p-4">
              <FormField
                control={form.control}
                name="gift.type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="mb-1">Vrsta poklona</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Izaberi vrstu" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="money">Novac</SelectItem>
                        <SelectItem value="other">Drugo</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch("gift.type") === "money" && (
                <FormField
                  control={form.control}
                  name="gift.amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="mb-1">Iznos</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Iznos"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? Number.parseInt(e.target.value, 10)
                                : undefined
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {form.watch("gift.type") === "other" && (
                <FormField
                  control={form.control}
                  name="gift.description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="mb-1">Opis poklona</FormLabel>
                      <FormControl>
                        <Input placeholder="Opis poklona" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          )}
        </div>

        {/* Companions Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <FormLabel className="mb-1">Pratioci</FormLabel>
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
              key={`companion-${
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                index
              }`}
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
                      <FormLabel className="mb-1">Ime</FormLabel>
                      <FormControl>
                        <Input className="h-9" placeholder="Ime" {...field} />
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
                      <FormLabel className="mb-1">Prezime</FormLabel>
                      <FormControl>
                        <Input
                          className="h-9"
                          placeholder="Prezime"
                          {...field}
                        />
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
                    <FormLabel className="mb-1">Tip</FormLabel>
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
          {submitText}
        </Button>
      </form>
    </Form>
  );
}
