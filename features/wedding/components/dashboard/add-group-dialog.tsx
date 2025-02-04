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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAddGroup } from "../../hooks/mutations";
import type { Side } from "../../types";

export function AddGroupDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [groupName, setGroupName] = useState("");
  const [side, setSide] = useState<Side>("bride");
  const addGroup = useAddGroup();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (groupName.trim()) {
      addGroup.mutate(
        { name: groupName.trim(), side },
        {
          onSuccess: () => {
            setGroupName("");
            setSide("bride");
            onOpenChange(false);
          },
        }
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova grupa</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="space-y-1">
            <Label htmlFor="groupName">Naziv grupe</Label>
            <Input
              id="groupName"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="npr. Porodica, Prijatelji, Posao..."
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="side">Strana</Label>
            <Select
              value={side}
              onValueChange={(value: Side) => setSide(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Izaberi stranu" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bride">Mladina</SelectItem>
                <SelectItem value="groom">Mladoženjina</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={addGroup.isPending}
          >
            {addGroup.isPending ? "Dodavanje..." : "Dodaj grupu"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
