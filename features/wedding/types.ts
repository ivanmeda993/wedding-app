import type { z } from 'zod';
import { weddingSetupSchema } from './schemas';

export type WeddingSetupFormData = z.infer<typeof weddingSetupSchema>;

export interface WeddingDetails extends WeddingSetupFormData {
  id: string;
}

export type Side = 'bride' | 'groom';
export type AttendanceStatus = 'yes' | 'no' | 'pending';
export type GiftType = 'money' | 'other' | null;

export interface Gift {
  type: GiftType;
  description?: string;
  amount?: number;
}

export interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  phone?: string;
  attendance: AttendanceStatus;
  side: Side;
  groupId: string | null;
  gift?: Gift;
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