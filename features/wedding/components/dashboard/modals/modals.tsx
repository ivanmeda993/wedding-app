"use client";
import { AddGroupDialog } from "../add-group-dialog";
import { AddGuestDialog } from "../add-guest-dialog";
import { EditGroupDialog } from "../edit-group-dialog";
import { EditWeddingDialog } from "../edit-wedding-dialog";
import { ShareWeddingDialog } from "../share-wedding-dialog";
import { DeleteGroupDialog } from "./delete-group-dialog";
import { useModalStore } from "./modal-store";

export function Modals() {
  const openModal = useModalStore((state) => state.openModal);
  const group = useModalStore((state) => state.group);
  const wedding = useModalStore((state) => state.wedding);
  const closeModal = useModalStore((state) => state.closeModal);
  return (
    <>
      <AddGuestDialog
        open={openModal === "addGuest"}
        onOpenChange={closeModal}
      />
      <AddGroupDialog
        open={openModal === "addGroup"}
        onOpenChange={closeModal}
      />
      {group && (
        <EditGroupDialog
          group={group}
          open={openModal === "editGroup"}
          onOpenChange={closeModal}
        />
      )}
      {group && (
        <DeleteGroupDialog
          group={group}
          open={openModal === "deleteGroup"}
          onOpenChange={closeModal}
        />
      )}
      {wedding && (
        <EditWeddingDialog
          wedding={wedding}
          open={openModal === "editWedding"}
          onOpenChange={closeModal}
        />
      )}
      <ShareWeddingDialog
        open={openModal === "shareWedding"}
        onOpenChange={closeModal}
      />
    </>
  );
}
