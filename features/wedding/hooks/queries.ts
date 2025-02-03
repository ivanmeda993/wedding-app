import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { queryKeys } from "./query-keys";
import type { GroupWithStats, Collaborator } from "../types";

export function useWeddingDetails() {
  return useQuery({
    queryKey: queryKeys.weddingDetails,
    queryFn: api.getWeddingDetails,
  });
}

export function useGroups() {
  return useQuery({
    queryKey: queryKeys.groups,
    queryFn: api.getGroups,
  });
}

export function useGuests() {
  return useQuery({
    queryKey: queryKeys.guests,
    queryFn: api.getGuests,
  });
}

export function useGroupsWithStats() {
  return useQuery<GroupWithStats[]>({
    queryKey: queryKeys.groupsWithStats,
    queryFn: api.getGroupsWithStats,
  });
}

export function useCollaborators() {
  return useQuery<Collaborator[]>({
    queryKey: queryKeys.collaborators,
    queryFn: api.getCollaborators,
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
