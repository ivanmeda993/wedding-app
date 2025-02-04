"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Copy, Loader2, Trash2 } from "lucide-react";
import { useWeddingDetails, useCollaborators } from "../../hooks/queries";
import { useDeleteCollaborator } from "../../hooks/mutations";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function ShareWeddingDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: weddingDetails } = useWeddingDetails();
  const { data: collaborators = [], isLoading: isLoadingCollaborators } =
    useCollaborators();
  const deleteCollaborator = useDeleteCollaborator();

  const inviteLink = weddingDetails?.inviteCode
    ? `${window.location.origin}/invite/${weddingDetails.inviteCode}`
    : "";

  const copyInviteLink = () => {
    if (inviteLink) {
      navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDeleteCollaborator = async (email: string) => {
    try {
      setError(null);
      await deleteCollaborator.mutateAsync(email);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Došlo je do greške pri brisanju kolaboratora."
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Podeli pristup venčanju</DialogTitle>
          <DialogDescription>
            Kopiraj link za pozivnicu i podeli ga sa mladom ili drugim
            organizatorima.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Link za pozivnicu</Label>
            <div className="flex gap-2">
              <Input
                readOnly
                value={inviteLink}
                className="flex-1"
                placeholder="Učitavanje..."
              />
              <Button
                type="button"
                variant="outline"
                onClick={copyInviteLink}
                className={copied ? "text-green-600" : ""}
                disabled={!inviteLink}
              >
                {copied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Kolaboratori</Label>
            {isLoadingCollaborators ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : collaborators.length === 0 ? (
              <div className="text-sm text-muted-foreground text-center py-4">
                Još uvek nema kolaboratora
              </div>
            ) : (
              <div className="space-y-2">
                {collaborators.map((collaborator) => (
                  <div
                    key={collaborator.email}
                    className="flex items-center justify-between gap-2 p-2 rounded-md border"
                  >
                    <span className="text-sm truncate flex-1">
                      {collaborator.email}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleDeleteCollaborator(collaborator.email)
                      }
                      disabled={deleteCollaborator.isPending}
                      className="text-destructive hover:text-destructive"
                    >
                      {deleteCollaborator.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
