"use client";

import { useState } from "react";
import {
  Phone,
  Gift,
  ScrollText,
  Users,
  Check,
  X,
  Clock,
  Edit,
  Banknote,
  Trash2,
} from "lucide-react";
import type { Guest } from "../../types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { EditGuestDialog } from "./edit-guest-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteGuest } from "../../hooks/mutations";

/**
 * Guest Card Component
 *
 * Displays individual guest information including:
 * - Name
 * - RSVP status
 * - Plus-one details
 * - Children information
 * - Guest side (bride/groom)
 * - Group assignment
 *
 * @component
 * @param {Object} props
 * @param {Guest} props.guest - Guest information
 */

interface GuestCardProps {
  guest: Guest;
}

export function GuestCard({ guest }: GuestCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const deleteGuest = useDeleteGuest();

  const attendanceConfig = {
    yes: {
      icon: Check,
      label: "Dolazi",
      class: "bg-green-500/10 text-green-500",
    },
    no: { icon: X, label: "Ne dolazi", class: "bg-red-500/10 text-red-500" },
    pending: {
      icon: Clock,
      label: "Neodređeno",
      class: "bg-yellow-500/10 text-yellow-500",
    },
  }[guest.attendance];

  const AttendanceIcon = attendanceConfig.icon;

  const handleDelete = async () => {
    try {
      await deleteGuest.mutateAsync(guest.id);
      setIsDeleteOpen(false);
    } catch (error) {
      console.error("Error deleting guest:", error);
    }
  };

  return (
    <>
      <div className="p-3  rounded-xl bg-gradient-to-br from-card to-card/50 border border-border/50 shadow-sm hover:shadow-md transition-all space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
            <div>
              <h4 className="font-medium text-base sm:text-lg bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                {guest.firstName} {guest.lastName}
              </h4>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {guest.side === "bride"
                  ? "Mladina strana"
                  : "Mladoženjina strana"}
              </p>
            </div>

            <div className="flex flex-wrap items-start gap-2 mt-2 sm:mt-0">
              {guest.phone && (
                <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
                  <div className="h-5 w-5 sm:h-6 sm:w-6 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-3 h-3 text-primary" />
                  </div>
                  {guest.phone}
                </div>
              )}

              {guest.gift && (
                <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
                  <div className="h-5 w-5 sm:h-6 sm:w-6 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                    {guest.gift.type === "money" ? (
                      <Banknote className="w-3 h-3 text-primary" />
                    ) : (
                      <Gift className="w-3 h-3 text-primary" />
                    )}
                  </div>
                  {guest.gift.type === "money" ? (
                    <span>€{guest.gift.amount?.toLocaleString("de-DE")}</span>
                  ) : (
                    guest.gift.description
                  )}
                </div>
              )}

              {guest.notes && (
                <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
                  <div className="h-5 w-5 sm:h-6 sm:w-6 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <ScrollText className="w-3 h-3 text-primary" />
                  </div>
                  {guest.notes}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2 mt-1 sm:mt-0">
            <div
              className={cn(
                "text-xs sm:text-sm font-medium px-2 sm:px-3 py-1 sm:py-1.5 rounded-full flex items-center gap-1 sm:gap-2",
                attendanceConfig.class
              )}
            >
              <AttendanceIcon className="w-3 h-3 sm:w-4 sm:h-4" />
              {attendanceConfig.label}
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditOpen(true)}
                className="h-7 sm:h-8 px-2 sm:px-3 text-xs sm:text-sm gap-1 sm:gap-2 hover:bg-primary/5"
              >
                <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Izmeni</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDeleteOpen(true)}
                className="h-7 sm:h-8 px-2 sm:px-3 text-xs sm:text-sm gap-1 sm:gap-2 hover:bg-destructive/5 hover:text-destructive"
              >
                <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Obriši</span>
              </Button>
            </div>
          </div>
        </div>

        {guest.companions.length > 0 && (
          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t">
            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-medium mb-2 sm:mb-3">
              <div className="h-5 w-5 sm:h-6 sm:w-6 rounded-md bg-primary/10 flex items-center justify-center">
                <Users className="w-3 h-3 text-primary" />
              </div>
              <span>Pratioci ({guest.companions.length})</span>
            </div>
            <div className="space-y-1 sm:space-y-2 pl-6 sm:pl-8">
              {guest.companions.map((companion, index) => (
                <div
                  key={`companion-${index}`}
                  className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1.5"
                >
                  <div className="w-1 h-1 rounded-full bg-primary/50" />
                  <span className="font-medium">
                    {companion.firstName} {companion.lastName}
                  </span>
                  <span className="text-[10px] sm:text-xs px-1.5 py-0.5 rounded-full bg-muted">
                    {companion.isAdult ? "Odrasla osoba" : "Dete"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <EditGuestDialog
        guest={guest}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Brisanje gosta</AlertDialogTitle>
            <AlertDialogDescription>
              Da li ste sigurni da želite da obrišete gosta {guest.firstName}{" "}
              {guest.lastName}? Ova akcija je nepovratna.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Otkaži</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteGuest.isPending ? "Brisanje..." : "Obriši"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
