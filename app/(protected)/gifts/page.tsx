"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGuests } from "@/features/wedding/hooks/queries";
import { ArrowLeft, ArrowUpDown, Search, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState, useMemo } from "react";
import type { Gift, Side, GiftType } from "@/features/wedding/types";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type SortField = "name" | "amount" | "type" | "side";
type SortOrder = "asc" | "desc";

interface GiftWithGuest extends Gift {
  guestName: string;
  side: Side;
}

/**
 * Gift Registry Page
 *
 * Manages wedding gifts with features:
 * - Gift tracking
 * - Gift assignment to guests
 * - Gift categories
 * - Notes and status tracking
 *
 * Protected route - requires authentication
 *
 * @page
 */

export default function GiftsPage() {
  const { data: guests = [] } = useGuests();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSide, setSelectedSide] = useState<Side | "all">("all");
  const [selectedType, setSelectedType] = useState<GiftType | "all">("all");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  // Transform guests data to gift list
  const gifts = useMemo(() => {
    return guests
      .filter((guest) => guest.gift)
      .map((guest) => ({
        ...(guest.gift || {}),
        guestName: `${guest.firstName} ${guest.lastName}`,
        side: guest.side,
      }));
  }, [guests]);

  // Apply filters and sorting
  const filteredAndSortedGifts = useMemo(() => {
    return gifts
      .filter((gift) => {
        const matchesSearch = searchQuery
          ? gift.guestName.toLowerCase().includes(searchQuery.toLowerCase())
          : true;
        const matchesSide =
          selectedSide === "all" ? true : gift.side === selectedSide;
        const matchesType =
          selectedType === "all" ? true : gift.type === selectedType;
        return matchesSearch && matchesSide && matchesType;
      })
      .sort((a, b) => {
        let comparison = 0;

        switch (sortField) {
          case "name":
            comparison = a.guestName.localeCompare(b.guestName);
            break;
          case "amount":
            comparison = (a.amount || 0) - (b.amount || 0);
            break;
          case "type":
            comparison = (a.type || "").localeCompare(b.type || "");
            break;
          case "side":
            comparison = a.side.localeCompare(b.side);
            break;
        }

        return sortOrder === "asc" ? comparison : -comparison;
      });
  }, [gifts, searchQuery, selectedSide, selectedType, sortField, sortOrder]);

  // Calculate total gift amount for filtered gifts
  const filteredTotalAmount = filteredAndSortedGifts.reduce((acc, gift) => {
    if (gift.type === "money" && gift.amount) {
      return acc + gift.amount;
    }
    return acc;
  }, 0);

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="gap-2 hover:bg-primary/5"
        >
          <Link href="/">
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Nazad na evidenciju</span>
            <span className="sm:hidden">Nazad</span>
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            {/* Mobile Filters Button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full sm:hidden mb-4">
                  <ChevronDown className="h-4 w-4 mr-2" />
                  Filteri i pretraga
                </Button>
              </SheetTrigger>
              <SheetContent side="top" className="w-full">
                <SheetHeader>
                  <SheetTitle>Filteri i pretraga</SheetTitle>
                </SheetHeader>
                <div className="space-y-4 py-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Pretraži po imenu..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <Select
                    value={selectedSide}
                    onValueChange={(value: string) =>
                      setSelectedSide(value as Side | "all")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Strana" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Sve strane</SelectItem>
                      <SelectItem value="bride">Mladina strana</SelectItem>
                      <SelectItem value="groom">Mladoženjina strana</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={selectedType as string}
                    onValueChange={(value: string) =>
                      setSelectedType(value as GiftType | "all")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tip poklona" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Svi pokloni</SelectItem>
                      <SelectItem value="money">Novac</SelectItem>
                      <SelectItem value="other">Drugo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </SheetContent>
            </Sheet>

            {/* Desktop Filters */}
            <div className="hidden sm:flex flex-col sm:flex-row gap-4">
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Pretraži po imenu..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select
                  value={selectedSide}
                  onValueChange={(value: string) =>
                    setSelectedSide(value as Side | "all")
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Strana" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Sve strane</SelectItem>
                    <SelectItem value="bride">Mladina strana</SelectItem>
                    <SelectItem value="groom">Mladoženjina strana</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={selectedType as string}
                  onValueChange={(value: string) =>
                    setSelectedType(value as GiftType | "all")
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tip poklona" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Svi pokloni</SelectItem>
                    <SelectItem value="money">Novac</SelectItem>
                    <SelectItem value="other">Drugo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="text-right text-sm border-t pt-4 sm:border-none sm:pt-0">
              <span className="text-muted-foreground">Ukupna vrednost:</span>{" "}
              <span className="font-bold text-lg">
                €{filteredTotalAmount.toLocaleString("de-DE")}
              </span>
            </div>

            {/* Mobile List View */}
            <div className="sm:hidden space-y-4">
              {filteredAndSortedGifts.map((gift) => (
                <div
                  key={gift.guestName}
                  className="p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="space-y-2">
                    <div className="font-medium">{gift.guestName}</div>
                    <div className="text-sm text-muted-foreground">
                      {gift.side === "bride" ? "Mladina" : "Mladoženjina"}{" "}
                      strana
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span>{gift.type === "money" ? "Novac" : "Drugo"}</span>
                      <span className="font-medium">
                        {gift.type === "money"
                          ? `€${gift.amount?.toLocaleString("de-DE")}`
                          : gift.description}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block rounded-md border">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="h-12 px-4 text-left align-middle font-medium">
                        <Button
                          variant="ghost"
                          onClick={() => handleSort("name")}
                          className="hover:bg-transparent p-0 font-medium"
                        >
                          Gost
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium">
                        <Button
                          variant="ghost"
                          onClick={() => handleSort("side")}
                          className="hover:bg-transparent p-0 font-medium"
                        >
                          Strana
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium">
                        <Button
                          variant="ghost"
                          onClick={() => handleSort("type")}
                          className="hover:bg-transparent p-0 font-medium"
                        >
                          Tip poklona
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium">
                        <Button
                          variant="ghost"
                          onClick={() => handleSort("amount")}
                          className="hover:bg-transparent p-0 font-medium"
                        >
                          Vrednost/Opis
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAndSortedGifts.map((gift) => (
                      <tr
                        key={gift.guestName}
                        className="border-b transition-colors hover:bg-muted/50"
                      >
                        <td className="p-4 align-middle">{gift.guestName}</td>
                        <td className="p-4 align-middle">
                          {gift.side === "bride" ? "Mladina" : "Mladoženjina"}
                        </td>
                        <td className="p-4 align-middle">
                          {gift.type === "money" ? "Novac" : "Drugo"}
                        </td>
                        <td className="p-4 align-middle">
                          {gift.type === "money"
                            ? `€${gift.amount?.toLocaleString("de-DE")}`
                            : gift.description}
                        </td>
                      </tr>
                    ))}
                    <tr className="border-t-2 bg-muted/10 font-medium">
                      <td className="p-4 align-middle" colSpan={3}>
                        Ukupna vrednost novčanih poklona
                      </td>
                      <td className="p-4 align-middle">
                        €{filteredTotalAmount.toLocaleString("de-DE")}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
