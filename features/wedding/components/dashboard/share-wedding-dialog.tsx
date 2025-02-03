'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useShareWedding } from '../../hooks/mutations';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Check, Copy, Mail } from 'lucide-react';

export function ShareWeddingDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [email, setEmail] = useState('');
  const [copied, setCopied] = useState(false);
  const shareWedding = useShareWedding();

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      shareWedding.mutate(
        { email: email.trim() },
        {
          onSuccess: () => {
            setEmail('');
            onOpenChange(false);
          },
        }
      );
    }
  };

  const copyInviteLink = () => {
    // U produkciji bi ovo bio stvarni link za pozivnicu
    navigator.clipboard.writeText(`${window.location.origin}/invite/[code]`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Podeli pristup venčanju</DialogTitle>
          <DialogDescription>
            Pošalji pozivnicu mladoj ili drugim organizatorima da pristupe evidenciji gostiju.
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
              <span className="bg-background px-2 text-muted-foreground">Ili</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Link za pozivnicu</Label>
            <div className="flex gap-2">
              <Input
                readOnly
                value={`${window.location.origin}/invite/[code]`}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={copyInviteLink}
                className={copied ? "text-green-600" : ""}
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
        </form>
      </DialogContent>
    </Dialog>
  );
}