import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type {
  WeddingSetupFormData,
  WeddingDetails,
  Guest,
  Group,
  GroupWithStats,
  Collaborator,
  Companion,
  Gift,
} from "../types";

type DBGuest = {
  id: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  attendance: Guest["attendance"];
  side: Guest["side"];
  group_id: string | null;
  notes: string | null;
  companions: Array<{
    id: string;
    first_name: string;
    last_name: string;
    is_adult: boolean;
  }>;
  gifts: Array<{
    type: Gift["type"];
    description: string | null;
    amount: number | null;
  }>;
};

type DBGroup = {
  id: string;
  name: string;
  side: Group["side"];
  guests: DBGuest[];
};

const supabase = createClientComponentClient();

const api = {
  setupWedding: async (data: WeddingSetupFormData): Promise<WeddingDetails> => {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.user) throw new Error("Korisnik nije prijavljen");

    // Create the wedding
    const { data: wedding, error } = await supabase
      .from("weddings")
      .insert({
        bride_name: data.brideName,
        groom_name: data.groomName,
        date: data.date,
        venue_name: data.venue.name,
        venue_address: data.venue.address,
        venue_hall: data.venue.hall,
        price_per_person: Number(data.pricePerPerson),
        user_id: session.session.user.id,
      })
      .select()
      .single();

    if (error) throw error;
    if (!wedding) throw new Error("Greška pri kreiranju venčanja");

    // Update user metadata with wedding_id
    const { error: updateError } = await supabase.auth.updateUser({
      data: { wedding_id: wedding.id },
    });

    if (updateError) {
      console.error("Failed to update user metadata:", updateError);
    }

    return {
      id: wedding.id,
      brideName: wedding.bride_name,
      groomName: wedding.groom_name,
      date: wedding.date,
      venue: {
        name: wedding.venue_name,
        address: wedding.venue_address,
        hall: wedding.venue_hall,
      },
      pricePerPerson: wedding.price_per_person,
      inviteCode: wedding.invite_code,
    };
  },

  updateWedding: async (
    data: WeddingSetupFormData
  ): Promise<WeddingDetails> => {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.user) throw new Error("Korisnik nije prijavljen");

    const { data: wedding, error } = await supabase
      .from("weddings")
      .update({
        bride_name: data.brideName,
        groom_name: data.groomName,
        date: data.date,
        venue_name: data.venue.name,
        venue_address: data.venue.address,
        venue_hall: data.venue.hall,
        price_per_person: Number(data.pricePerPerson),
      })
      .eq("user_id", session.session.user.id)
      .select()
      .single();

    if (error) throw error;
    if (!wedding) throw new Error("Greška pri ažuriranju venčanja");

    return {
      id: wedding.id,
      brideName: wedding.bride_name,
      groomName: wedding.groom_name,
      date: wedding.date,
      venue: {
        name: wedding.venue_name,
        address: wedding.venue_address,
        hall: wedding.venue_hall,
      },
      pricePerPerson: wedding.price_per_person,
      inviteCode: wedding.invite_code,
    };
  },

  getWeddingDetails: async (): Promise<WeddingDetails | null> => {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.user) return null;

    const { data: wedding, error } = await supabase
      .from("weddings")
      .select(
        "id, bride_name, groom_name, date, venue_name, venue_address, venue_hall, price_per_person, invite_code"
      )
      .eq("user_id", session.session.user.id)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null; // No rows returned
      throw error;
    }
    if (!wedding) return null;

    return {
      id: wedding.id,
      brideName: wedding.bride_name,
      groomName: wedding.groom_name,
      date: wedding.date,
      venue: {
        name: wedding.venue_name,
        address: wedding.venue_address,
        hall: wedding.venue_hall,
      },
      pricePerPerson: wedding.price_per_person,
      inviteCode: wedding.invite_code,
    };
  },

  getGroups: async (): Promise<Group[]> => {
    const { data: groups, error } = await supabase
      .from("groups")
      .select("*")
      .order("name");

    if (error) throw error;

    return groups.map((group) => ({
      id: group.id,
      name: group.name,
      side: group.side,
    }));
  },

  getGuests: async (): Promise<Guest[]> => {
    const { data: guests, error: guestsError } = await supabase
      .from("guests")
      .select(
        `
        *,
        companions (*),
        gifts (*)
      `
      )
      .order("created_at");

    if (guestsError) throw guestsError;

    return (guests as DBGuest[]).map((guest) => ({
      id: guest.id,
      firstName: guest.first_name,
      lastName: guest.last_name,
      phone: guest.phone,
      attendance: guest.attendance,
      side: guest.side,
      groupId: guest.group_id,
      notes: guest.notes,
      companions: guest.companions.map((companion) => ({
        id: companion.id,
        firstName: companion.first_name,
        lastName: companion.last_name,
        isAdult: companion.is_adult,
      })),
      gift: guest.gifts[0]
        ? {
            type: guest.gifts[0].type,
            description: guest.gifts[0].description,
            amount: guest.gifts[0].amount,
          }
        : undefined,
    }));
  },

  getGroupsWithStats: async (): Promise<GroupWithStats[]> => {
    const { data: groups, error } = await supabase
      .from("groups")
      .select(
        `
        *,
        guests (
          *,
          companions (*),
          gifts (*)
        )
      `
      )
      .order("name");

    if (error) throw error;

    return (groups as DBGroup[]).map((group) => {
      const guests = group.guests || [];
      const companions = guests.flatMap((g) => g.companions || []);
      const giftAmount = guests.reduce((acc, guest) => {
        const gift = guest.gifts[0];
        return acc + (gift?.type === "money" && gift.amount ? gift.amount : 0);
      }, 0);

      return {
        id: group.id,
        name: group.name,
        side: group.side,
        stats: {
          totalGuests: guests.length + companions.length,
          totalAdults:
            guests.length + companions.filter((c) => c.is_adult).length,
          totalChildren: companions.filter((c) => !c.is_adult).length,
          totalGiftAmount: giftAmount,
        },
      };
    });
  },

  addGuest: async (guest: Omit<Guest, "id">): Promise<void> => {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.user) throw new Error("Korisnik nije prijavljen");

    const { data: wedding } = await supabase
      .from("weddings")
      .select("id")
      .eq("user_id", session.session.user.id)
      .single();

    if (!wedding) throw new Error("Venčanje nije pronađeno");

    const { data: newGuest, error: guestError } = await supabase
      .from("guests")
      .insert({
        first_name: guest.firstName,
        last_name: guest.lastName,
        phone: guest.phone,
        attendance: guest.attendance,
        side: guest.side,
        group_id: guest.groupId,
        notes: guest.notes,
        wedding_id: wedding.id,
      })
      .select()
      .single();

    if (guestError) throw guestError;

    if (guest.companions?.length > 0) {
      const { error: companionsError } = await supabase
        .from("companions")
        .insert(
          guest.companions.map((companion) => ({
            first_name: companion.firstName,
            last_name: companion.lastName,
            is_adult: companion.isAdult,
            guest_id: newGuest.id,
          }))
        );

      if (companionsError) throw companionsError;
    }

    // biome-ignore lint/complexity/useOptionalChain: <explanation>
    if (guest.gift && guest.gift.type) {
      const giftData = {
        type: guest.gift.type,
        guest_id: newGuest.id,
        description:
          guest.gift.type === "other" ? guest.gift.description : null,
        amount: guest.gift.type === "money" ? guest.gift.amount : null,
      };

      const { error: giftError } = await supabase
        .from("gifts")
        .insert(giftData);

      if (giftError) throw giftError;
    }
  },

  updateGuest: async (id: string, updates: Partial<Guest>): Promise<void> => {
    const { error: guestError } = await supabase
      .from("guests")
      .update({
        first_name: updates.firstName,
        last_name: updates.lastName,
        phone: updates.phone,
        attendance: updates.attendance,
        side: updates.side,
        group_id: updates.groupId,
        notes: updates.notes,
      })
      .eq("id", id);

    if (guestError) throw guestError;

    if (updates.companions) {
      // Delete existing companions
      await supabase.from("companions").delete().eq("guest_id", id);

      // Add new companions
      if (updates.companions.length > 0) {
        const { error: companionsError } = await supabase
          .from("companions")
          .insert(
            updates.companions.map((companion) => ({
              first_name: companion.firstName,
              last_name: companion.lastName,
              is_adult: companion.isAdult,
              guest_id: id,
            }))
          );

        if (companionsError) throw companionsError;
      }
    }

    if (updates.gift !== undefined) {
      // Delete existing gift
      await supabase.from("gifts").delete().eq("guest_id", id);

      // Add new gift if it has a valid type
      // biome-ignore lint/complexity/useOptionalChain: <explanation>
      if (updates.gift && updates.gift.type) {
        const giftData = {
          type: updates.gift.type,
          guest_id: id,
          description:
            updates.gift.type === "other" ? updates.gift.description : null,
          amount: updates.gift.type === "money" ? updates.gift.amount : null,
        };

        const { error: giftError } = await supabase
          .from("gifts")
          .insert(giftData);

        if (giftError) throw giftError;
      }
    }
  },

  deleteGuest: async (id: string): Promise<void> => {
    const { error } = await supabase.from("guests").delete().eq("id", id);

    if (error) throw error;
  },

  addGroup: async (name: string, side: Guest["side"]): Promise<void> => {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.user) throw new Error("Korisnik nije prijavljen");

    const { data: wedding } = await supabase
      .from("weddings")
      .select("id")
      .eq("user_id", session.session.user.id)
      .single();

    if (!wedding) throw new Error("Venčanje nije pronađeno");

    const { error } = await supabase.from("groups").insert({
      name,
      side,
      wedding_id: wedding.id,
    });

    if (error) throw error;
  },

  updateGroup: async (id: string, updates: Partial<Group>): Promise<void> => {
    const { error } = await supabase
      .from("groups")
      .update(updates)
      .eq("id", id);

    if (error) throw error;
  },

  deleteGroup: async (id: string): Promise<void> => {
    const { error } = await supabase.from("groups").delete().eq("id", id);

    if (error) throw error;
  },

  shareWedding: async (email: string): Promise<void> => {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.user) throw new Error("Korisnik nije prijavljen");

    const { data: wedding } = await supabase
      .from("weddings")
      .select("id")
      .eq("user_id", session.session.user.id)
      .single();

    if (!wedding) throw new Error("Venčanje nije pronađeno");

    const { error } = await supabase.from("wedding_collaborators").insert({
      wedding_id: wedding.id,
      email: email,
    });

    if (error) throw error;
  },

  getCollaborators: async (): Promise<Collaborator[]> => {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) {
      // Return empty array if session is not ready yet
      return [];
    }

    // First check if user is the wedding owner
    const { data: ownedWedding } = await supabase
      .from("weddings")
      .select("id")
      .eq("user_id", session.session.user.id)
      .maybeSingle();

    if (ownedWedding?.id) {
      const { data: collaborators, error } = await supabase
        .from("wedding_collaborators")
        .select("email")
        .eq("wedding_id", ownedWedding.id);

      if (error) throw error;
      return collaborators || [];
    }

    // Then try to get wedding_id from collaborators table
    const { data: collaborator } = await supabase
      .from("wedding_collaborators")
      .select("wedding_id")
      .eq("email", session.session.user.email)
      .maybeSingle();

    if (collaborator?.wedding_id) {
      const { data: collaborators, error } = await supabase
        .from("wedding_collaborators")
        .select("email")
        .eq("wedding_id", collaborator.wedding_id);

      if (error) throw error;
      return collaborators || [];
    }

    // Finally try to get wedding_id from metadata
    const weddingId = session.session.user.user_metadata?.wedding_id;
    if (!weddingId) return [];

    const { data: collaborators, error } = await supabase
      .from("wedding_collaborators")
      .select("email")
      .eq("wedding_id", weddingId);

    if (error) throw error;
    return collaborators || [];
  },

  deleteCollaborator: async (email: string): Promise<void> => {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) throw new Error("Korisnik nije prijavljen");

    // First check if user is the wedding owner
    const { data: ownedWedding } = await supabase
      .from("weddings")
      .select("id")
      .eq("user_id", session.session.user.id)
      .maybeSingle();

    if (ownedWedding?.id) {
      const { error } = await supabase
        .from("wedding_collaborators")
        .delete()
        .eq("wedding_id", ownedWedding.id)
        .eq("email", email);

      if (error) throw error;

      // If we're deleting our own collaboration, clear wedding_id from metadata
      if (email === session.session.user.email) {
        const { error: updateError } = await supabase.auth.updateUser({
          data: { wedding_id: null },
        });

        if (updateError) {
          console.error("Failed to update user metadata:", updateError);
        }
      }
      return;
    }

    // Then try to get wedding_id from collaborators table
    const { data: collaborator } = await supabase
      .from("wedding_collaborators")
      .select("wedding_id")
      .eq("email", session.session.user.email)
      .maybeSingle();

    if (collaborator?.wedding_id) {
      const { error } = await supabase
        .from("wedding_collaborators")
        .delete()
        .eq("wedding_id", collaborator.wedding_id)
        .eq("email", email);

      if (error) throw error;

      // If we're deleting our own collaboration, clear wedding_id from metadata
      if (email === session.session.user.email) {
        const { error: updateError } = await supabase.auth.updateUser({
          data: { wedding_id: null },
        });

        if (updateError) {
          console.error("Failed to update user metadata:", updateError);
        }
      }
      return;
    }

    // Finally try to get wedding_id from metadata
    const weddingId = session.session.user.user_metadata?.wedding_id;
    if (!weddingId) throw new Error("Venčanje nije pronađeno");

    const { error } = await supabase
      .from("wedding_collaborators")
      .delete()
      .eq("wedding_id", weddingId)
      .eq("email", email);

    if (error) throw error;

    // If we're deleting our own collaboration, clear wedding_id from metadata
    if (email === session.session.user.email) {
      const { error: updateError } = await supabase.auth.updateUser({
        data: { wedding_id: null },
      });

      if (updateError) {
        console.error("Failed to update user metadata:", updateError);
      }
    }
  },
};

export { api };
