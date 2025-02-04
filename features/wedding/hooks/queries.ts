import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { queryKeys } from "./query-keys";
import type { GroupWithStats, Collaborator, WeddingDetails } from "../types";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { supabase } from "@/lib/supabase";

export function useWeddingDetails() {
  const { user } = useAuth();

  return useQuery({
    queryKey: queryKeys.weddingDetails,
    queryFn: async () => {
      if (!user) return null;

      // First check if user is the owner
      const { data: ownedWedding } = await supabase
        .from("weddings")
        .select(
          `
          id,
          bride_name,
          groom_name,
          date,
          venue:venue_name,
          venue_address,
          venue_hall,
          price_per_person,
          invite_code
          `
        )
        .eq("user_id", user.id)
        .maybeSingle();

      if (ownedWedding) {
        return {
          id: ownedWedding.id,
          brideName: ownedWedding.bride_name,
          groomName: ownedWedding.groom_name,
          date: ownedWedding.date,
          venue: {
            name: ownedWedding.venue,
            address: ownedWedding.venue_address,
            hall: ownedWedding.venue_hall,
          },
          pricePerPerson: ownedWedding.price_per_person,
          inviteCode: ownedWedding.invite_code,
        } as WeddingDetails;
      }

      // Then check user metadata
      const weddingId = user.user_metadata?.wedding_id;
      if (weddingId) {
        const { data: wedding } = await supabase
          .from("weddings")
          .select(
            `
            id,
            bride_name,
            groom_name,
            date,
            venue:venue_name,
            venue_address,
            venue_hall,
            price_per_person,
            invite_code
            `
          )
          .eq("id", weddingId)
          .maybeSingle();

        if (wedding) {
          return {
            id: wedding.id,
            brideName: wedding.bride_name,
            groomName: wedding.groom_name,
            date: wedding.date,
            venue: {
              name: wedding.venue,
              address: wedding.venue_address,
              hall: wedding.venue_hall,
            },
            pricePerPerson: wedding.price_per_person,
            inviteCode: wedding.invite_code,
          } as WeddingDetails;
        }
      }

      // Finally check collaborators
      const { data: collaborator } = await supabase
        .from("wedding_collaborators")
        .select("wedding_id")
        .eq("email", user.email)
        .maybeSingle();

      if (collaborator) {
        const { data: wedding } = await supabase
          .from("weddings")
          .select(
            `
            id,
            bride_name,
            groom_name,
            date,
            venue:venue_name,
            venue_address,
            venue_hall,
            price_per_person,
            invite_code
            `
          )
          .eq("id", collaborator.wedding_id)
          .maybeSingle();

        if (wedding) {
          return {
            id: wedding.id,
            brideName: wedding.bride_name,
            groomName: wedding.groom_name,
            date: wedding.date,
            venue: {
              name: wedding.venue,
              address: wedding.venue_address,
              hall: wedding.venue_hall,
            },
            pricePerPerson: wedding.price_per_person,
            inviteCode: wedding.invite_code,
          } as WeddingDetails;
        }
      }

      return null;
    },
    enabled: !!user,
    retry: false,
  });
}

export function useGroups() {
  const { data: weddingDetails, isSuccess } = useWeddingDetails();

  return useQuery({
    queryKey: queryKeys.groups,
    queryFn: api.getGroups,
    enabled: isSuccess && !!weddingDetails,
  });
}

export function useGuests() {
  const { data: weddingDetails, isSuccess } = useWeddingDetails();

  return useQuery({
    queryKey: queryKeys.guests,
    queryFn: api.getGuests,
    enabled: isSuccess && !!weddingDetails,
  });
}

export function useGroupsWithStats() {
  const { data: weddingDetails, isSuccess } = useWeddingDetails();

  return useQuery<GroupWithStats[]>({
    queryKey: queryKeys.groupsWithStats,
    queryFn: api.getGroupsWithStats,
    enabled: isSuccess && !!weddingDetails,
  });
}

export function useCollaborators() {
  const { data: weddingDetails, isSuccess } = useWeddingDetails();

  return useQuery<Collaborator[]>({
    queryKey: queryKeys.collaborators,
    queryFn: api.getCollaborators,
    enabled: isSuccess && !!weddingDetails,
  });
}

export function useWeddingStats() {
  const { data: guests = [] } = useGuests();
  const { data: weddingDetails } = useWeddingDetails();

  if (!guests || !weddingDetails) {
    return {
      totalGuests: 0,
      totalAdults: 0,
      totalChildren: 0,
      totalCost: 0,
      totalGiftAmount: 0,
    };
  }

  // Count primary guests (they are always adults)
  const primaryGuestsCount = guests.length;

  // Count all companions
  const companionStats = guests.reduce(
    (acc, guest) => {
      const adultCompanions = guest.companions.filter((c) => c.isAdult).length;
      const childCompanions = guest.companions.filter((c) => !c.isAdult).length;
      return {
        adults: acc.adults + adultCompanions,
        children: acc.children + childCompanions,
      };
    },
    { adults: 0, children: 0 }
  );

  // Calculate total gift amount
  const totalGiftAmount = guests.reduce((acc, guest) => {
    if (guest.gift?.type === "money" && guest.gift.amount) {
      return acc + guest.gift.amount;
    }
    return acc;
  }, 0);

  const totalAdults = primaryGuestsCount + companionStats.adults;
  const totalChildren = companionStats.children;
  const totalGuests = totalAdults + totalChildren;
  const totalCost = totalAdults * weddingDetails.pricePerPerson;

  return {
    totalGuests,
    totalAdults,
    totalChildren,
    totalCost,
    totalGiftAmount,
  };
}
