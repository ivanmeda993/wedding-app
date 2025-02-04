import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { ChevronDown, Edit2, Trash2, UsersRound } from "lucide-react";
import { GuestCard } from "./guest-card";
import type { Guest, GroupWithStats, Side } from "../../types";
import { useGroupsStore } from "../../stores/groups-store";
import { Button } from "@/components/ui/button";
import { useModalStore } from "./modals/modal-store";

interface GroupListProps {
  groups: GroupWithStats[];
  title: string;
  guests: Guest[];
  filterGuests: (guests: Guest[]) => Guest[];
}

export function GroupList({
  groups,
  title,
  guests,
  filterGuests,
}: GroupListProps) {
  const { openGroups, toggleGroup } = useGroupsStore();
  const onOpenChange = useModalStore((state) => state.onOpenChange);
  const setGroup = useModalStore((state) => state.setGroup);
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
                  <button
                    type="button"
                    className="w-full cursor-pointer p-2 text-left"
                    onClick={() => toggleGroup(group.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        toggleGroup(group.id);
                      }
                    }}
                  >
                    <div className="flex md:items-center justify-between">
                      <div className="flex items-center gap-1 md:gap-2">
                        <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2">
                          <div className="flex items-center gap-1 text-sm md:text-lg font-semibold text-purple-800">
                            <UsersRound className="w-5 h-5" />
                            <span className="bg-clip-text text-transparent">
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
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setGroup(group);
                              onOpenChange("editGroup");
                            }}
                            className="h-8 w-8"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setGroup(group);
                              onOpenChange("deleteGroup");
                            }}
                            className="h-8 w-8 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 text-muted-foreground transition-transform",
                            isOpen && "transform rotate-180"
                          )}
                        />
                      </div>
                    </div>
                  </button>
                </div>
                <CollapsibleContent>
                  <div className="p-2">
                    <div className="space-y-2 md:space-y-4">
                      {groupGuests.map((guest) => (
                        <GuestCard key={guest.id} guest={guest} />
                      ))}
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
