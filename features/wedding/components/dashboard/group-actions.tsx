'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2 } from 'lucide-react';
import { useDeleteGroup } from '../../hooks/mutations';
import { EditGroupDialog } from './edit-group-dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { Group } from '../../types';

export function GroupActions({ group }: { group: Group }) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const deleteGroup = useDeleteGroup();

  const handleDelete = async () => {
    try {
      await deleteGroup.mutateAsync(group.id);
      setIsDeleteOpen(false);
    } catch (error) {
      console.error('Error deleting group:', error);
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event from bubbling up
    setIsEditOpen(true);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event from bubbling up
    setIsDeleteOpen(true);
  };

  return (
    <>
      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleEditClick}
          className="h-8 w-8"
        >
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDeleteClick}
          className="h-8 w-8 text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <EditGroupDialog
        group={group}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Brisanje grupe</AlertDialogTitle>
            <AlertDialogDescription>
              Da li ste sigurni da želite da obrišete grupu "{group.name}"?
              Svi gosti iz ove grupe će biti prebačeni u "Ostali gosti".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Otkaži</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteGroup.isPending ? 'Brisanje...' : 'Obriši'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}