"use client";

import { useGroupsWithStats, useGuests } from "../../hooks/queries";
import { GuestCard } from "./guest-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UsersRound, ChevronDown, Plus, UserPlus } from "lucide-react";
import type { Side, Attendance, Guest } from "../../types";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { GroupActions } from "./group-actions";
import { AddGuestDialog } from "./add-guest-dialog";
import { AddGroupDialog } from "./add-group-dialog";

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
  const [openGroups, setOpenGroups] = useState<string[]>([]);
  const [isNewGuestOpen, setIsNewGuestOpen] = useState(false);
  const [isNewGroupOpen, setIsNewGroupOpen] = useState(false);

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
      <div className="space-y-2">
        <h2 className="text-xl md:text-3xl font-semibold text-violet-800">
          {title}
        </h2>
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
                            <div className="flex items-center gap-1 text-sm md:text-lg font-semibold text-purple-800">
                              <UsersRound className="w-5 h-5 " />
                              <span className="  bg-clip-text text-transparent">
                                {group.name}
                              </span>
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
          <ChevronDown className="h-4 w-4 text-violet-500" />
          <span>Proširi sve grupe</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={collapseAll}
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
          onClick={() => setIsNewGroupOpen(true)}
        >
          <Plus className="h-4 w-4 text-violet-500" />
          Nova grupa
        </Button>

        {/* Novi gost dugme */}
        <Button
          className="w-full bg-violet-500 text-white hover:bg-violet-600"
          onClick={() => setIsNewGuestOpen(true)}
        >
          <UserPlus className="h-4 w-4" />
          Novi gost
        </Button>
      </div>

      {selectedSide !== "groom" && (
        <GroupSection groups={brideGroups} title="Mladina strana" />
      )}
      {selectedSide !== "bride" && (
        <GroupSection groups={groomGroups} title="Mladoženjina strana" />
      )}

      <AddGuestDialog open={isNewGuestOpen} onOpenChange={setIsNewGuestOpen} />

      <AddGroupDialog open={isNewGroupOpen} onOpenChange={setIsNewGroupOpen} />
    </div>
  );
}
