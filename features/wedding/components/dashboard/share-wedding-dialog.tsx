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
import { useShareWedding, useDeleteCollaborator } from "../../hooks/mutations";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Check, Copy, Mail, UserX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCollaborators, useWeddingDetails } from "../../hooks/queries";
import { supabase } from "../../../../lib/supabase";

export function ShareWeddingDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [email, setEmail] = useState("");
  const [copied, setCopied] = useState(false);
  const shareWedding = useShareWedding();
  const deleteCollaborator = useDeleteCollaborator();
  const { toast } = useToast();
  const { data: collaborators = [], isLoading } = useCollaborators();
  const { data: weddingDetails } = useWeddingDetails();

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();

    if (email.trim()) {
      try {
        // Add collaborator
        await shareWedding.mutateAsync(
          { email: email.trim() },
          {
            onSuccess: () => {
              setEmail("");
            },
          }
        );

        // Send magic link
        const { error: magicLinkError } = await supabase.auth.signInWithOtp({
          email: email.trim(),
          options: {
            emailRedirectTo: `${window.location.origin}/invite/${weddingDetails?.inviteCode}`,
          },
        });

        if (magicLinkError) throw magicLinkError;

        onOpenChange(false);
        toast({
          title: "Uspešno deljenje",
          description: `Pristup je uspešno podeljen sa ${email}. Poslali smo email sa linkom za prijavu.`,
        });
      } catch (error) {
        console.error("Error sharing wedding:", error);
        toast({
          title: "Greška",
          description: "Došlo je do greške prilikom deljenja pristupa.",
          variant: "destructive",
        });
      }
    }
  };

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

  const handleDeleteCollaborator = (id: string, email: string) => {
    deleteCollaborator.mutate(id, {
      onSuccess: () => {
        toast({
          title: "Uspešno brisanje",
          description: `Pristup je uspešno ukinut za ${email}`,
        });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Podeli pristup venčanju</DialogTitle>
          <DialogDescription>
            Pošalji pozivnicu mladoj ili drugim organizatorima da pristupe
            evidenciji gostiju.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleShare} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email adresa</Label>
            <div className="flex gap-2">
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="flex-1"
              />
              <Button type="submit" disabled={shareWedding.isPending}>
                <Mail className="w-4 h-4 mr-2" />
                Pošalji
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Ili
              </span>
            </div>
          </div>

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

          {shareWedding.isError && (
            <Alert variant="destructive">
              <AlertDescription>
                Došlo je do greške prilikom deljenja pristupa.
              </AlertDescription>
            </Alert>
          )}

          {/* Lista kolaboratora */}
          <div className="space-y-2 pt-4">
            <Label>Kolaboratori</Label>
            {isLoading ? (
              <div className="text-sm text-muted-foreground">Učitavanje...</div>
            ) : collaborators.length === 0 ? (
              <div className="text-sm text-muted-foreground">
                Još uvek nema kolaboratora
              </div>
            ) : (
              <div className="space-y-2">
                {collaborators.map((collaborator) => (
                  <div
                    key={collaborator.id}
                    className="flex items-center justify-between p-2 rounded-lg border"
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {collaborator.email}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Dodat{" "}
                        {new Date(collaborator.created_at).toLocaleDateString(
                          "sr-RS"
                        )}
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() =>
                        handleDeleteCollaborator(
                          collaborator.id,
                          collaborator.email
                        )
                      }
                      disabled={deleteCollaborator.isPending}
                    >
                      <UserX className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
