import { create } from "zustand";

interface GroupsState {
  openGroups: string[];
  toggleGroup: (groupId: string) => void;
  expandAll: (groupIds: string[]) => void;
  collapseAll: () => void;
}

export const useGroupsStore = create<GroupsState>((set) => ({
  openGroups: [],
  toggleGroup: (groupId) =>
    set((state) => ({
      openGroups: state.openGroups.includes(groupId)
        ? state.openGroups.filter((id) => id !== groupId)
        : [...state.openGroups, groupId],
    })),
  expandAll: (groupIds) => set({ openGroups: groupIds }),
  collapseAll: () => set({ openGroups: [] }),
}));
