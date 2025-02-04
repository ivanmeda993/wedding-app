import type { Group, WeddingDetails } from "@/features/wedding/types";
import { create } from "zustand";

export type ModalType =
  | "addGuest"
  | "addGroup"
  | "editGroup"
  | "deleteGroup"
  | "editWedding"
  | "shareWedding"
  | null;

interface ModalStore {
  openModal: ModalType;
  group: Group | null;
  wedding: WeddingDetails | null;
  onOpenChange: (open: ModalType) => void;
  setGroup: (group: Group | null) => void;
  setWedding: (wedding: WeddingDetails | null) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  openModal: null,
  group: null,
  wedding: null,
  onOpenChange: (open) => set({ openModal: open }),
  setGroup: (group) => set({ group }),
  setWedding: (wedding) => set({ wedding }),
  closeModal: () => set({ openModal: null }),
}));
