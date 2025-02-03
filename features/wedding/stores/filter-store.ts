import { create } from 'zustand';
import type { Side, AttendanceStatus } from '../types';

interface FilterState {
  viewMode: 'all' | 'groups' | 'ungrouped';
  selectedSide: Side | 'all';
  selectedStatus: AttendanceStatus | 'all';
  searchQuery: string;
  setViewMode: (mode: 'all' | 'groups' | 'ungrouped') => void;
  setSelectedSide: (side: Side | 'all') => void;
  setSelectedStatus: (status: AttendanceStatus | 'all') => void;
  setSearchQuery: (query: string) => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  viewMode: 'all',
  selectedSide: 'all',
  selectedStatus: 'all',
  searchQuery: '',
  
  setViewMode: (mode) => set({ viewMode: mode }),
  setSelectedSide: (side) => set({ selectedSide: side }),
  setSelectedStatus: (status) => set({ selectedStatus: status }),
  setSearchQuery: (query) => set({ searchQuery: query }),
}));