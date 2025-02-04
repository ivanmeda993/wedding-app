"use client";

import { GuestGroups } from "./guest-groups";
import { GuestList } from "./guest-list";
import { AddGroupDialog } from "./add-group-dialog";
import { AddGuestDialog } from "./add-guest-dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, UserPlus, Users2, UsersRound, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useFilterStore } from "../../stores/filter-store";
import type { Side, Attendance } from "../../types";

/**
 * Wedding Dashboard Component
 *
 * Main dashboard for wedding planning application that displays:
 * - Wedding header with basic info
 * - Statistics about guests and costs
 * - Guest groups management
 * - Individual guest cards
 *
 * Features:
 * - Track RSVPs and plus-ones
 * - Monitor children guests (under 6-8 don't count for full seat)
 * - Flexible guest grouping (Work, Family, Friends, etc.)
 * - Separate tracking for bride's and groom's guests
 * - Gift registry integration
 * - Smart cost calculations
 *
 * @component
 * @example
 * return (
 *   <WeddingDashboard />
 * )
 */

export function Dashboard() {
  const [isAddGroupOpen, setIsAddGroupOpen] = useState(false);
  const [isAddGuestOpen, setIsAddGuestOpen] = useState(false);

  const {
    viewMode,
    selectedSide,
    selectedStatus,
    searchQuery,
    setViewMode,
    setSelectedSide,
    setSelectedStatus,
    setSearchQuery,
  } = useFilterStore();

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="bg-card  rounded-lg shadow-sm space-y-4">
        {/* View Mode Buttons */}
        <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-4">
          <Button
            variant={viewMode === "all" ? "default" : "outline"}
            onClick={() => setViewMode("all")}
            className="w-full sm:w-auto gap-2"
            size="sm"
          >
            <Users2 className="w-4 h-4" />
            <span className="hidden sm:inline">Svi gosti</span>
            <span className="sm:hidden">Svi</span>
          </Button>
          <Button
            variant={viewMode === "groups" ? "default" : "outline"}
            onClick={() => setViewMode("groups")}
            className="w-full sm:w-auto gap-2"
            size="sm"
          >
            <UsersRound className="w-4 h-4" />
            <span className="hidden sm:inline">Grupe</span>
            <span className="sm:hidden">Grupe</span>
          </Button>
          <Button
            variant={viewMode === "ungrouped" ? "default" : "outline"}
            onClick={() => setViewMode("ungrouped")}
            className="w-full sm:w-auto gap-2"
            size="sm"
          >
            <Users2 className="w-4 h-4" />
            <span className="hidden sm:inline">Ostali gosti</span>
            <span className="sm:hidden">Ostali</span>
          </Button>
        </div>

        {/* Filters and Actions */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              value={selectedSide}
              onValueChange={(value: Side | "all") => setSelectedSide(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Izaberi stranu" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Sve strane</SelectItem>
                <SelectItem value="bride">Mladina strana</SelectItem>
                <SelectItem value="groom">Mladoženjina strana</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={selectedStatus}
              onValueChange={(value: Attendance | "all") =>
                setSelectedStatus(value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Status dolaska" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Svi statusi</SelectItem>
                <SelectItem value="yes">Dolazi</SelectItem>
                <SelectItem value="no">Ne dolazi</SelectItem>
                <SelectItem value="pending">Neodređeno</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={() => setIsAddGroupOpen(true)}
              variant="outline"
              size="sm"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Nova grupa</span>
              <span className="sm:hidden">Grupa</span>
            </Button>
            <Button onClick={() => setIsAddGuestOpen(true)} size="sm">
              <UserPlus className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Novi gost</span>
              <span className="sm:hidden">Gost</span>
            </Button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Pretraži goste po imenu ili prezimenu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <div className="space-y-6 sm:space-y-8">
        {(viewMode === "all" || viewMode === "groups") && (
          <GuestGroups
            selectedSide={selectedSide}
            selectedStatus={selectedStatus}
            searchQuery={searchQuery}
          />
        )}
        {(viewMode === "all" || viewMode === "ungrouped") && (
          <GuestList
            selectedSide={selectedSide}
            selectedStatus={selectedStatus}
            searchQuery={searchQuery}
          />
        )}
      </div>

      <AddGroupDialog open={isAddGroupOpen} onOpenChange={setIsAddGroupOpen} />
      <AddGuestDialog open={isAddGuestOpen} onOpenChange={setIsAddGuestOpen} />
    </div>
  );
}
