"use client";

import { useGuests } from "../../hooks/queries";
import { GuestCard } from "./guest-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Side, AttendanceStatus, Guest } from "../../types";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { useState } from "react";
import { ChevronDown, Users2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface GuestListProps {
  selectedSide: Side | "all";
  selectedStatus: AttendanceStatus | "all";
  searchQuery: string;
}

export function GuestList({
  selectedSide,
  selectedStatus,
  searchQuery,
}: GuestListProps) {
  const { data: guests = [] } = useGuests();
  const [isOpen, setIsOpen] = useState(true);
  const [openSections, setOpenSections] = useState<Side[]>(["bride", "groom"]);

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

  const ungroupedGuests = filterGuests(
    guests.filter(
      (guest) =>
        !guest.groupId &&
        (selectedSide === "all" ? true : guest.side === selectedSide)
    )
  );

  const brideGuests = ungroupedGuests.filter((guest) => guest.side === "bride");
  const groomGuests = ungroupedGuests.filter((guest) => guest.side === "groom");

  // If there are no ungrouped guests, return null
  if (ungroupedGuests.length === 0) {
    return null;
  }

  const toggleSection = (side: Side) => {
    setOpenSections((current) =>
      current.includes(side)
        ? current.filter((s) => s !== side)
        : [...current, side]
    );
  };

  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader
          className="cursor-pointer p-3"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users2 className="w-4 h-4 sm:w-5 sm:h-5" />
              <CardTitle className="flex items-center gap-2 text-sm sm:text-lg">
                Ostali gosti
                {(() => {
                  const totalGuests = ungroupedGuests.reduce(
                    (acc, guest) => acc + 1 + guest.companions.length,
                    0
                  );
                  return (
                    <span className="text-xs sm:text-sm font-normal text-muted-foreground">
                      ({totalGuests}{" "}
                      {totalGuests === 1
                        ? "gost"
                        : totalGuests < 5
                        ? "gosta"
                        : "gostiju"}
                      )
                    </span>
                  );
                })()}
              </CardTitle>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(true);
                }}
                className="h-7 sm:h-8 px-2 sm:px-3 text-xs sm:text-sm"
              >
                <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline ml-1">Proširi</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                }}
                className="h-7 sm:h-8 px-2 sm:px-3 text-xs sm:text-sm"
              >
                <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 rotate-180" />
                <span className="hidden sm:inline ml-1">Skupi</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
            <div className="space-y-2 md:space-y-3">
              {selectedSide !== "groom" && brideGuests.length > 0 && (
                <Collapsible open={openSections.includes("bride")}>
                  {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
                  <div
                    className="flex items-center justify-between cursor-pointer "
                    onClick={() => toggleSection("bride")}
                  >
                    <h3 className="text-sm sm:text-lg font-medium">
                      Mladina strana
                    </h3>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 text-muted-foreground transition-transform",
                        openSections.includes("bride") && "transform rotate-180"
                      )}
                    />
                  </div>
                  <CollapsibleContent>
                    <div className="space-y-3 sm:space-y-4 mt-3">
                      {brideGuests.map((guest) => (
                        <GuestCard key={guest.id} guest={guest} />
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              )}

              {selectedSide !== "bride" && groomGuests.length > 0 && (
                <Collapsible open={openSections.includes("groom")}>
                  {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
                  <div
                    className="flex items-center justify-between cursor-pointer "
                    onClick={() => toggleSection("groom")}
                  >
                    <h3 className="text-sm sm:text-lg font-medium">
                      Mladoženjina strana
                    </h3>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 text-muted-foreground transition-transform",
                        openSections.includes("groom") && "transform rotate-180"
                      )}
                    />
                  </div>
                  <CollapsibleContent>
                    <div className="space-y-3 sm:space-y-4 mt-3">
                      {groomGuests.map((guest) => (
                        <GuestCard key={guest.id} guest={guest} />
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              )}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
