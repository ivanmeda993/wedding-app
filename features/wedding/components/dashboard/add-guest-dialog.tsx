"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAddGuest } from "../../hooks/mutations";
import { GuestForm, type GuestFormValues } from "./guest-form";

interface AddGuestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddGuestDialog({ open, onOpenChange }: AddGuestDialogProps) {
  const addGuest = useAddGuest();

  const onSubmit = (values: GuestFormValues) => {
    addGuest.mutate(
      {
        ...values,
        groupId: values.groupId || null,
        companions: values?.companions?.map((c, i) => ({
          ...c,
          id: `temp-${i}`,
        })),
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
          <DialogTitle className="text-2xl font-bold">Novi gost</DialogTitle>
        </DialogHeader>
        <GuestForm
          onSubmit={onSubmit}
          submitText={addGuest.isPending ? "Dodavanje..." : "Dodaj gosta"}
        />
      </DialogContent>
    </Dialog>
  );
}
