import type { z } from "zod";
import { weddingSetupSchema } from "./schemas";

export type WeddingSetupFormData = z.infer<typeof weddingSetupSchema>;

export interface WeddingDetails extends WeddingSetupFormData {
  id: string;
  brideName: string;
  groomName: string;
  venue: {
    name: string;
    address: string;
    hall: string;
  };
  date: string;
  pricePerPerson: number;
  inviteCode: string;
}

export type Side = "bride" | "groom";
export type AttendanceStatus = "yes" | "no" | "pending";
export type GiftType = "money" | "other";

export interface Gift {
  type: GiftType | null;
  description?: string;
  amount?: number;
}

export type GuestGift = Gift | null | undefined;

export interface Guest {
  id: string;
  firstName: string;
  lastName?: string;
  phone?: string;
  attendance: AttendanceStatus;
  side: Side;
  groupId: string | null;
  gift?: GuestGift;
  notes?: string;
  companions: Companion[];
}

export interface Companion {
  id: string;
  firstName: string;
  lastName?: string;
  isAdult: boolean;
}

export interface Group {
  id: string;
  name: string;
  side: Side;
}

export interface GroupStats {
  totalGuests: number;
  totalAdults: number;
  totalChildren: number;
  totalGiftAmount: number;
}

export interface GroupWithStats extends Group {
  stats: GroupStats;
}

export interface WeddingStats {
  totalGuests: number;
  totalAdults: number;
  totalChildren: number;
  totalCost: number;
  totalGiftAmount: number;
}

export interface Collaborator {
  id: string;
  email: string;
  created_at: string;
}
