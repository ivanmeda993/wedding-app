"use client";

import { useGroupsWithStats, useGuests } from "../../hooks/queries";
import { Button } from "@/components/ui/button";
import { ChevronDown, Plus, UserPlus } from "lucide-react";
import type { Side, Attendance, Guest } from "../../types";

import { useGroupsStore } from "../../stores/groups-store";
import { GroupList } from "./group-list";
import { useModalStore } from "./modals/modal-store";

interface GuestGroupsProps {
  selectedSide: Side | "all";
  selectedStatus: Attendance | "all";
  searchQuery: string;
}

/**
 * Guest Groups Component
 *
 * Manages guest categorization with:
 * - Custom group creation
 * - Group assignment
 * - Group statistics
 * - Filtering capabilities
 *
 * Default groups include Work, Family, Friends
 * but users can create custom groups
 *
 * @component
 * @param {Object} props
 * @param {Group[]} props.groups - Available groups
 * @param {Function} props.onGroupCreate - Handler for new group creation
 */

export function GuestGroups({
  selectedSide,
  selectedStatus,
  searchQuery,
}: GuestGroupsProps) {
  const { data: groupsWithStats = [] } = useGroupsWithStats();
  const { data: guests = [] } = useGuests();
  const { expandAll, collapseAll } = useGroupsStore();
  const onOpenChange = useModalStore((state) => state.onOpenChange);

  const filterGuests = (guests: Guest[]) => {
    return guests.filter((guest) => {
      const matchesSearch = searchQuery
        ? `${guest.firstName} ${guest.lastName}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        : true;
      const matchesStatus =
        selectedStatus === "all" ? true : guest.attendance === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  };

  const filteredGroups = groupsWithStats.filter((group) =>
    selectedSide === "all" ? true : group.side === selectedSide
  );

  const brideGroups = filteredGroups.filter((group) => group.side === "bride");
  const groomGroups = filteredGroups.filter((group) => group.side === "groom");

  // If there are no groups at all or no filtered groups, return null
  if (groupsWithStats.length === 0 || filteredGroups.length === 0) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => expandAll(groupsWithStats.map((g) => g.id))}
          className="gap-2"
        >
          <ChevronDown className="h-4 w-4 text-violet-500" />
          <span>Proširi sve grupe</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => collapseAll()}
          className="gap-2"
        >
          <ChevronDown className="h-4 w-4 rotate-180 text-violet-500" />
          <span>Skupi sve grupe</span>
        </Button>
      </div>

      <div className="space-y-2">
        {/* Nova grupa dugme */}
        <Button
          variant="outline"
          className="w-full border-dashed border-violet-500/50 hover:border-violet-500 hover:bg-violet-50 dark:hover:bg-violet-950"
          onClick={() => onOpenChange("addGroup")}
        >
          <Plus className="h-4 w-4 text-violet-500" />
          Nova grupa
        </Button>

        {/* Novi gost dugme */}
        <Button
          className="w-full bg-violet-500 text-white hover:bg-violet-600"
          onClick={() => onOpenChange("addGuest")}
        >
          <UserPlus className="h-4 w-4" />
          Novi gost
        </Button>
      </div>

      {selectedSide !== "groom" && (
        <GroupList
          groups={brideGroups}
          title="Mladina strana"
          guests={guests}
          filterGuests={filterGuests}
        />
      )}
      {selectedSide !== "bride" && (
        <GroupList
          groups={groomGroups}
          title="Mladoženjina strana"
          guests={guests}
          filterGuests={filterGuests}
        />
      )}
    </div>
  );
}
