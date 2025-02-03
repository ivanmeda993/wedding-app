"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUpdateGuest } from "../../hooks/mutations";
import type { Guest } from "../../types";
import { GuestForm, type GuestFormValues } from "./guest-form";

interface EditGuestDialogProps {
  guest: Guest;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditGuestDialog({
  guest,
  open,
  onOpenChange,
}: EditGuestDialogProps) {
  const updateGuest = useUpdateGuest();

  const onSubmit = (values: GuestFormValues) => {
    updateGuest.mutate(
      {
        id: guest.id,
        guest: {
          ...values,
          groupId: values.groupId || null,
          companions: values.companions.map((c, i) => ({
            ...c,
            id: guest.companions[i]?.id || `temp-${i}`,
          })),
        },
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Izmena gosta</DialogTitle>
        </DialogHeader>
        <GuestForm
          defaultValues={{
            firstName: guest.firstName,
            lastName: guest.lastName,
            phone: guest.phone,
            attendance: guest.attendance,
            side: guest.side,
            groupId: guest.groupId || undefined,
            notes: guest.notes,
            gift: guest.gift?.type
              ? {
                  type: guest.gift.type,
                  amount: guest.gift.amount,
                  description: guest.gift.description,
                }
              : undefined,
            companions: guest.companions.map((companion) => ({
              firstName: companion.firstName,
              lastName: companion.lastName,
              isAdult: companion.isAdult,
            })),
          }}
          onSubmit={onSubmit}
          submitText={updateGuest.isPending ? "Čuvanje..." : "Sačuvaj izmene"}
        />
      </DialogContent>
    </Dialog>
  );
}
