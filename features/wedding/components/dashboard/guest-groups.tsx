"use client";

import { useGroupsWithStats, useGuests } from "../../hooks/queries";
import { GuestCard } from "./guest-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UsersRound, ChevronDown } from "lucide-react";
import type { Side, AttendanceStatus, Guest } from "../../types";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { GroupActions } from "./group-actions";

interface GuestGroupsProps {
  selectedSide: Side | "all";
  selectedStatus: AttendanceStatus | "all";
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
  const [openGroups, setOpenGroups] = useState<string[]>([]);

  const toggleGroup = (groupId: string) => {
    setOpenGroups((current) =>
      current.includes(groupId)
        ? current.filter((id) => id !== groupId)
        : [...current, groupId]
    );
  };

  const expandAll = () => {
    const allGroupIds = groupsWithStats.map((group) => group.id);
    setOpenGroups(allGroupIds);
  };

  const collapseAll = () => {
    setOpenGroups([]);
  };

  const filteredGroups = groupsWithStats.filter((group) =>
    selectedSide === "all" ? true : group.side === selectedSide
  );

  const brideGroups = filteredGroups.filter((group) => group.side === "bride");
  const groomGroups = filteredGroups.filter((group) => group.side === "groom");

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

  const GroupSection = ({
    groups,
    title,
  }: {
    groups: typeof brideGroups;
    title: string;
  }) => {
    if (groups.length === 0) return null;

    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <div className="space-y-4">
          {groups.map((group) => {
            const groupGuests = filterGuests(
              guests.filter((guest) => guest.groupId === group.id)
            );
            const isOpen = openGroups.includes(group.id);
            const totalGuests = groupGuests.reduce(
              (acc, guest) => acc + 1 + guest.companions.length,
              0
            );

            if (groupGuests.length === 0) return null;

            return (
              <Card key={group.id}>
                <Collapsible
                  open={isOpen}
                  onOpenChange={() => toggleGroup(group.id)}
                >
                  <div className="w-full">
                    <CardHeader
                      className="cursor-pointer p-2"
                      onClick={() => toggleGroup(group.id)}
                    >
                      <div className="flex md:items-center justify-between">
                        <div className="flex items-center gap-1 md:gap-2">
                          <CardTitle className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2">
                            <div className="flex items-center gap-1 text-sm md:text-md">
                              <UsersRound className="w-5 h-5" />
                              {group.name}
                            </div>
                            <span className="text-sm font-normal text-muted-foreground">
                              (
                              {group.side === "bride"
                                ? "Mladina strana"
                                : "Mladoženjina strana"}
                              )
                            </span>
                            <span className="text-sm font-normal text-muted-foreground">
                              • {totalGuests}{" "}
                              {totalGuests === 1
                                ? "gost"
                                : totalGuests < 5
                                ? "gosta"
                                : "gostiju"}
                            </span>
                          </CardTitle>
                        </div>
                        <div className="flex items-center gap-2">
                          <GroupActions group={group} />
                          <ChevronDown
                            className={cn(
                              "h-4 w-4 text-muted-foreground transition-transform",
                              isOpen && "transform rotate-180"
                            )}
                          />
                        </div>
                      </div>
                    </CardHeader>
                  </div>
                  <CollapsibleContent>
                    <CardContent>
                      <div className="space-y-2 md:space-y-4">
                        {groupGuests.map((guest) => (
                          <GuestCard key={guest.id} guest={guest} />
                        ))}
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

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
          onClick={expandAll}
          className="gap-2"
        >
          <ChevronDown className="h-4 w-4" />
          Proširi sve grupe
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={collapseAll}
          className="gap-2"
        >
          <ChevronDown className="h-4 w-4 rotate-180" />
          Skupi sve grupe
        </Button>
      </div>
      {selectedSide !== "groom" && (
        <GroupSection groups={brideGroups} title="Mladina strana" />
      )}
      {selectedSide !== "bride" && (
        <GroupSection groups={groomGroups} title="Mladoženjina strana" />
      )}
    </div>
  );
}
