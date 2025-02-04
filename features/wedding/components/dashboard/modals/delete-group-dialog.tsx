import {
  AlertDialog,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogFooter,
  AlertDialogContent,
} from "@/components/ui/alert-dialog";
import { useDeleteGroup } from "@/features/wedding/hooks/mutations";
import type { Group } from "@/features/wedding/types";

interface DeleteGroupDialogProps {
  group: Group;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
export function DeleteGroupDialog({
  group,
  open,
  onOpenChange,
}: DeleteGroupDialogProps) {
  const deleteGroup = useDeleteGroup();

  const handleDelete = async () => {
    try {
      await deleteGroup.mutateAsync(group.id);
      onOpenChange(false);
    } catch (error) {
      console.error("Error deleting group:", error);
    }
  };
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Brisanje grupe</AlertDialogTitle>
          <AlertDialogDescription>
            Da li ste sigurni da želite da obrišete grupu &quot;
            {group.name}&quot;? Svi gosti iz ove grupe će biti prebačeni u
            &quot;Ostali gosti&quot;.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Otkaži</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteGroup.isPending ? "Brisanje..." : "Obriši"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
