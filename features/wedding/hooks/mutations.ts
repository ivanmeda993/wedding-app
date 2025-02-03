import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import { queryKeys } from "./query-keys";
import type { Guest, Group, Side, WeddingSetupFormData } from "../types";

export function useSetupWedding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: WeddingSetupFormData) => api.setupWedding(data),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.weddingDetails, data);
    },
  });
}

export function useUpdateWedding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: WeddingSetupFormData) => api.updateWedding(data),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.weddingDetails, data);
    },
  });
}

export function useAddGuest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (guest: Omit<Guest, "id">) => api.addGuest(guest),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.guests });
      queryClient.invalidateQueries({ queryKey: queryKeys.groupsWithStats });
    },
  });
}

export function useUpdateGuest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, guest }: { id: string; guest: Partial<Guest> }) =>
      api.updateGuest(id, guest),
    onSuccess: () => {
      // Invalidate both guests and groups with stats queries
      queryClient.invalidateQueries({ queryKey: queryKeys.guests });
      queryClient.invalidateQueries({ queryKey: queryKeys.groupsWithStats });
    },
  });
}

export function useDeleteGuest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.deleteGuest(id),
    onSuccess: () => {
      // Invalidate both guests and groups with stats queries
      queryClient.invalidateQueries({ queryKey: queryKeys.guests });
      queryClient.invalidateQueries({ queryKey: queryKeys.groupsWithStats });
    },
  });
}

export function useAddGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ name, side }: { name: string; side: Side }) =>
      api.addGroup(name, side),
    onSuccess: () => {
      // Invalidate both groups and groups with stats queries
      queryClient.invalidateQueries({ queryKey: queryKeys.groups });
      queryClient.invalidateQueries({ queryKey: queryKeys.groupsWithStats });
    },
  });
}

export function useUpdateGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Group> }) =>
      api.updateGroup(id, updates),
    onSuccess: () => {
      // Invalidate both groups and groups with stats queries
      queryClient.invalidateQueries({ queryKey: queryKeys.groups });
      queryClient.invalidateQueries({ queryKey: queryKeys.groupsWithStats });
    },
  });
}

export function useDeleteGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.deleteGroup(id),
    onSuccess: () => {
      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.groups });
      queryClient.invalidateQueries({ queryKey: queryKeys.groupsWithStats });
      queryClient.invalidateQueries({ queryKey: queryKeys.guests });
    },
  });
}

export function useShareWedding() {
  return useMutation({
    mutationFn: ({ email }: { email: string }) => api.shareWedding(email),
  });
}

export function useDeleteCollaborator() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.deleteCollaborator,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.collaborators });
    },
  });
}
