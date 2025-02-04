import type { z } from "zod";
import { weddingSetupSchema } from "./schemas";

export type Side = "bride" | "groom";
export type Attendance = "yes" | "no" | "pending";
export type GiftType = "money" | "other";

export type WeddingSetupFormData = {
  brideName: string;
  groomName: string;
  date: string;
  venue: {
    name: string;
    address: string;
    hall: string;
  };
  pricePerPerson: number;
};

export type WeddingDetails = {
  id: string;
  brideName: string;
  groomName: string;
  date: string;
  venue: {
    name: string;
    address: string;
    hall: string;
  };
  pricePerPerson: number;
  inviteCode?: string;
};

export type Group = {
  id: string;
  name: string;
  side: Side;
};

export type Guest = {
  id: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  attendance: Attendance;
  side: Side;
  groupId: string | null | undefined;
  notes?: string | null;
  companions: Companion[];
  gift?: Gift | null;
};

export type Companion = {
  id: string;
  firstName: string;
  lastName?: string;
  isAdult: boolean;
};

export type Gift = {
  type: GiftType;
  amount?: number | null;
  description?: string | null;
};

export type GroupWithStats = Group & {
  stats: {
    totalGuests: number;
    totalAdults: number;
    totalChildren: number;
    totalGiftAmount: number;
  };
};

export type Collaborator = {
  email: string;
};

export type GuestGift = Gift | null | undefined;

export interface GroupStats {
  totalGuests: number;
  totalAdults: number;
  totalChildren: number;
  totalGiftAmount: number;
}

export interface WeddingStats {
  totalGuests: number;
  totalAdults: number;
  totalChildren: number;
  totalCost: number;
  totalGiftAmount: number;
}
